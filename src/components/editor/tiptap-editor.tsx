"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState, useCallback } from "react";
import { updateChapterContent } from "@/app/(editor)/actions";
import { Loader2, Check, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
    chapterId: string;
    initialContent?: any | null;
}

type SaveStatus = "saved" | "saving" | "unsaved";

export function TiptapEditor({ chapterId, initialContent }: TiptapEditorProps) {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

    const saveContent = useCallback(
        async (content: any) => {
            setSaveStatus("saving");
            try {
                await updateChapterContent(chapterId, content);
                setSaveStatus("saved");
            } catch (error) {
                console.error("Failed to save:", error);
                setSaveStatus("unsaved"); // Or 'error'
            }
        },
        [chapterId]
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Placeholder.configure({
                placeholder: "Comece a escrever...",
                emptyEditorClass:
                    "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0",
            }),
        ],
        content: initialContent || "",
        editorProps: {
            attributes: {
                class:
                    "prose prose-lg dark:prose-invert mx-auto focus:outline-none min-h-[calc(100vh-200px)]",
            },
        },
        onUpdate: ({ editor }) => {
            setSaveStatus("unsaved");
        },
        immediatelyRender: false,
    });

    // Debounce logic
    useEffect(() => {
        if (!editor || saveStatus !== "unsaved") return;

        const timeoutId = setTimeout(() => {
            saveContent(editor.getJSON());
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [editor, saveStatus, saveContent]);

    if (!editor) {
        return null;
    }

    return (
        <div className="relative">
            {/* Status Indicator */}
            <div className="absolute -top-8 right-0 flex items-center gap-2 text-xs text-muted-foreground transition-opacity duration-300">
                {saveStatus === "saved" && (
                    <>
                        <Cloud className="h-3 w-3" />
                        <span>Salvo</span>
                    </>
                )}
                {saveStatus === "saving" && (
                    <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Salvando...</span>
                    </>
                )}
                {saveStatus === "unsaved" && (
                    <>
                        <span className="italic">Alterações não salvas...</span>
                    </>
                )}
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
