import { TiptapEditor } from "@/components/editor/tiptap-editor";

interface EditorPageProps {
    params: Promise<{
        bookId: string;
    }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { bookId } = await params;

    return (
        <div className="min-h-full">
            <TiptapEditor chapterId="dummy-chapter-id" />
        </div>
    );
}
