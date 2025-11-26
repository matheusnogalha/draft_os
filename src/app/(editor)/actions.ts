"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateChapterContent(chapterId: string, content: any) {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // 2. Update Chapter
    const { error } = await supabase
        .from("chapters")
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", chapterId)
        // Ensure user owns the book this chapter belongs to (via RLS, but good to be explicit/safe)
        // RLS policies already handle this check: "Users can update chapters of own books"
        .select()
        .single();

    if (error) {
        console.error("Error updating chapter:", error);
        throw new Error("Failed to update chapter");
    }

    return { success: true };
}
