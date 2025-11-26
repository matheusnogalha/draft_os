"use client";

import * as React from "react";
import Link from "next/link";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    Bot
} from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";

export function EditorLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const leftPanelRef = React.useRef<ImperativePanelHandle>(null);
    const rightPanelRef = React.useRef<ImperativePanelHandle>(null);

    const [isLeftCollapsed, setIsLeftCollapsed] = React.useState(false);
    const [isRightCollapsed, setIsRightCollapsed] = React.useState(false);

    const toggleLeftPanel = () => {
        const panel = leftPanelRef.current;
        if (panel) {
            if (isLeftCollapsed) {
                panel.expand();
            } else {
                panel.collapse();
            }
            setIsLeftCollapsed(!isLeftCollapsed);
        }
    };

    const toggleRightPanel = () => {
        const panel = rightPanelRef.current;
        if (panel) {
            if (isRightCollapsed) {
                panel.expand();
            } else {
                panel.collapse();
            }
            setIsRightCollapsed(!isRightCollapsed);
        }
    };

    return (
        <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1">

                {/* LEFT SIDEBAR (Structure) */}
                <ResizablePanel
                    ref={leftPanelRef}
                    defaultSize={20}
                    minSize={15}
                    maxSize={30}
                    collapsible={true}
                    onCollapse={() => setIsLeftCollapsed(true)}
                    onExpand={() => setIsLeftCollapsed(false)}
                    className="bg-muted/30 border-r"
                >
                    <div className="h-full p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-sm text-muted-foreground">Estrutura</span>
                        </div>
                        {/* Placeholder for Chapter List */}
                        <div className="space-y-2">
                            <div className="h-8 bg-muted rounded w-full animate-pulse" />
                            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-8 bg-muted rounded w-5/6 animate-pulse" />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* CENTER (Canvas) */}
                <ResizablePanel defaultSize={55} minSize={30}>
                    <div className="h-full flex flex-col">
                        {/* Editor Header */}
                        <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={toggleLeftPanel} title="Toggle Sidebar">
                                    {isLeftCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                                </Button>

                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                                        <ChevronLeft className="h-4 w-4" />
                                        Voltar
                                    </Button>
                                </Link>
                            </div>

                            <div className="font-serif font-medium text-sm">
                                Capítulo 1: O Início
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={toggleRightPanel} title="Toggle AI Assistant">
                                    {isRightCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                                </Button>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="flex-1 overflow-y-auto bg-background">
                            <div className="max-w-prose mx-auto py-12 px-8 min-h-full">
                                {children}
                            </div>
                        </main>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* RIGHT SIDEBAR (AI Assistant) */}
                <ResizablePanel
                    ref={rightPanelRef}
                    defaultSize={25}
                    minSize={20}
                    maxSize={40}
                    collapsible={true}
                    onCollapse={() => setIsRightCollapsed(true)}
                    onExpand={() => setIsRightCollapsed(false)}
                    className="bg-muted/30 border-l"
                >
                    <div className="h-full p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <Bot className="h-4 w-4" />
                            <span className="font-semibold text-sm">Assistente IA</span>
                        </div>
                        {/* Placeholder for Chat */}
                        <div className="flex-1 bg-background border rounded-md p-4 flex items-center justify-center text-sm text-muted-foreground">
                            Chat da IA aparecerá aqui
                        </div>
                    </div>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
}
