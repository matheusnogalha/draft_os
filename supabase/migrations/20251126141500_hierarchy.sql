-- Migration: Add hierarchy support to chapters
-- Date: 2025-11-26

-- 1. Create the new ENUM type
create type chapter_type as enum ('part', 'chapter', 'frontmatter', 'backmatter');

-- 2. Drop the existing table (WARNING: Data loss if not backed up)
drop table if exists public.chapters cascade;

-- 3. Recreate the table with hierarchy support
create table public.chapters (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  
  -- Auto-referência para hierarquia
  parent_id uuid references public.chapters(id) on delete set null,
  
  title text not null default 'Novo Item',
  item_type chapter_type not null default 'chapter',
  
  content jsonb,
  order_index integer not null default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Re-enable RLS
alter table public.chapters enable row level security;

-- 5. Re-create RLS Policies
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

-- 6. Create Index
create index idx_chapters_parent_id on public.chapters(parent_id);
