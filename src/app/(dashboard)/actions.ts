"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createBook() {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Insert new book
    const { data, error } = await supabase
        .from("books")
        .insert({
            user_id: user.id,
            title: "Novo Manuscrito",
        })
        .select("id")
        .single();

    if (error) {
        console.error("Error creating book:", error);
        throw new Error("Failed to create book");
    }

    // 3. Redirect to Editor
    redirect(`/editor/${data.id}`);
}
