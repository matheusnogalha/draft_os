-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ENUMS
create type book_status as enum ('draft', 'review', 'published');
create type sub_status as enum ('active', 'canceled', 'past_due', 'trialing');

-- 1. PROFILES (Public user data)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- 2. BOOKS (Projects)
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Sem Título',
  synopsis text,
  cover_url text,
  language text default 'pt-BR',
  status book_status default 'draft',
  epub_metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CHAPTERS (Content)
-- 3. CHAPTERS (Content)
create type chapter_type as enum ('part', 'chapter', 'frontmatter', 'backmatter');

create table public.chapters (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  
  -- Auto-referência para hierarquia:
  -- Se parent_id for NULL, é um item raiz (ex: "Parte I" ou um "Prólogo" solto).
  -- Se parent_id tiver um UUID, este item pertence àquele pai.
  parent_id uuid references public.chapters(id) on delete set null,
  
  title text not null default 'Novo Item',
  item_type chapter_type not null default 'chapter',
  
  content jsonb, -- Tiptap JSON. Geralmente NULL se item_type for 'part'.
  order_index integer not null default 0, -- Ordem dentro do mesmo nível hierárquico
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índice para performance em queries hierárquicas
create index idx_chapters_parent_id on public.chapters(parent_id);

-- 4. CHARACTERS (AI Context)
create table public.characters (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  name text not null,
  role text,
  description text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SUBSCRIPTIONS (Stripe)
create table public.subscriptions (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  stripe_customer_id text,
  stripe_subscription_id text,
  status sub_status default 'active',
  plan_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. AI_CREDITS (Usage control)
create table public.ai_credits (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  balance integer default 10,
  total_usage integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.chapters enable row level security;
alter table public.characters enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ai_credits enable row level security;

-- Profiles: Users can view their own profile (and potentially others if public, but keeping strict for now)
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Books: Users can only view/edit their own books
create policy "Users can view own books" on public.books
  for select using (auth.uid() = user_id);
create policy "Users can insert own books" on public.books
  for insert with check (auth.uid() = user_id);
create policy "Users can update own books" on public.books
  for update using (auth.uid() = user_id);
create policy "Users can delete own books" on public.books
  for delete using (auth.uid() = user_id);

-- Chapters: Access via book ownership
create policy "Users can view chapters of own books" on public.chapters
  for select using (
    exists ( select 1 from public.books where id = chapters.book_id and user_id = auth.uid() )
  );
create policy "Users can insert chapters to own books" on public.chapters
  for insert with check (
    exists ( select 1 from public.books where id = book_id and user_id = auth.uid() )
  );
create policy "Users can update chapters of own books" on public.chapters
  for update using (
    exists ( select 1 from public.books where id = chapters.book_id and user_id = auth.uid() )
  );
create policy "Users can delete chapters of own books" on public.chapters
  for delete using (
    exists ( select 1 from public.books where id = chapters.book_id and user_id = auth.uid() )
  );

-- Characters: Access via book ownership
create policy "Users can view characters of own books" on public.characters
  for select using (
    exists ( select 1 from public.books where id = characters.book_id and user_id = auth.uid() )
  );
create policy "Users can insert characters to own books" on public.characters
  for insert with check (
    exists ( select 1 from public.books where id = book_id and user_id = auth.uid() )
  );
create policy "Users can update characters of own books" on public.characters
  for update using (
    exists ( select 1 from public.books where id = characters.book_id and user_id = auth.uid() )
  );
create policy "Users can delete characters of own books" on public.characters
  for delete using (
    exists ( select 1 from public.books where id = characters.book_id and user_id = auth.uid() )
  );

-- Subscriptions: Users can view own subscription
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- AI Credits: Users can view own credits
create policy "Users can view own credits" on public.ai_credits
  for select using (auth.uid() = user_id);

-- TRIGGERS
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Initialize AI credits
  insert into public.ai_credits (user_id, balance)
  values (new.id, 10);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
