// components/ArticleSection.tsx
import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ArticleSection({
    title,
    badge,
    tooltip,
    children,
}: {
    title: string;
    badge?: string;
    tooltip?: string;
    children: ReactNode;
}) {
    return (
        <section className="mb-8 border border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-3 ">
                    <h2 className="text-base font-medium text-white tracking-tight">{title}</h2>
                    {badge && (
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                            {badge}
                        </span>
                    )}
                </div>
                {tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="text-zinc-400 hover:text-zinc-300">
                                    <Info className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="flex gap-2 bg-zinc-800 border border-zinc-600 shadow-lg rounded px-2 py-1"
                            >
                                {tooltip}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className="px-5 py-4 space-y-3">{children}</div>
        </section>
    );
}
