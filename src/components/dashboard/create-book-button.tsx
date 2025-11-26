"use client";

import { useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBook } from "@/app/(dashboard)/actions";

export function CreateBookButton() {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            await createBook();
        });
    };

    return (
        <Button onClick={handleClick} disabled={isPending}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Plus className="mr-2 h-4 w-4" />
            )}
            Novo Projeto
        </Button>
    );
}
