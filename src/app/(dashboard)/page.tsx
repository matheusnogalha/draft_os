import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { CreateBookButton } from "@/components/dashboard/create-book-button";

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Fetch Books
    const { data: books } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                        Meus Manuscritos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus livros e projetos de escrita.
                    </p>
                </div>
                <CreateBookButton />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {books?.map((book) => (
                    <ProjectCard
                        key={book.id}
                        title={book.title}
                        status={book.status}
                        lastEdited={new Date(book.updated_at).toLocaleDateString("pt-BR")}
                        coverUrl={book.cover_url}
                    />
                ))}
                {(!books || books.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <p>Você ainda não tem nenhum projeto.</p>
                        <p className="text-sm">Clique em "Novo Projeto" para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
