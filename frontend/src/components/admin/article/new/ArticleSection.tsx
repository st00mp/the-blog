import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    const badgeColors: Record<string, string> = {
        "H1": "bg-blue-700 text-blue-100",
        "H2": "bg-violet-700 text-violet-100",
        "H3": "bg-violet-700 text-violet-100",
        "<p>": "bg-zinc-700 text-zinc-300",
        "CTA": "bg-emerald-700 text-emerald-100",
        "meta": "bg-indigo-700 text-indigo-100",
        "<blockquote>": "bg-amber-700 text-amber-100"
    };

    return (
        <section className="mb-8 border border-zinc-800 overflow-hidden" >
            <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-3 ">
                    <div className="text-lg font-medium text-white tracking-tight">{title}</div>
                    {badge && (
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full border border-zinc-700",
                            badgeColors[badge] || "bg-zinc-800 text-zinc-400"
                        )}>
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
