import { MoreVertical, BookOpen, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
    title: string;
    status: "draft" | "published" | "review";
    lastEdited?: string;
    coverUrl?: string;
}

export function ProjectCard({
    title,
    status,
    lastEdited = "Hoje",
    coverUrl,
}: ProjectCardProps) {
    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md">
            {/* Cover Placeholder */}
            <div className="aspect-[2/3] w-full bg-muted relative overflow-hidden">
                {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={coverUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground">
                        <BookOpen className="h-12 w-12 opacity-20" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <Badge variant={status === "published" ? "default" : "secondary"} className="shadow-sm">
                        {status === "draft" && "Rascunho"}
                        {status === "review" && "Revisão"}
                        {status === "published" && "Publicado"}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-serif text-lg font-bold leading-tight tracking-tight line-clamp-2">
                    {title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    Editado: {lastEdited}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button variant="outline" size="sm" className="w-full mr-2">
                    Abrir Editor
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Abrir Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
