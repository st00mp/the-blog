type FieldLabelProps = {
    children: React.ReactNode;
    badge?: string;
};

export function FieldLabel({ children, badge }: FieldLabelProps) {
    const badgeColors: Record<string, string> = {
        H1: "bg-blue-700 text-blue-100",
        H2: "bg-violet-700 text-violet-100",
        H3: "bg-purple-700 text-purple-100",
        "<p>": "bg-zinc-700 text-zinc-300",
        CTA: "bg-emerald-700 text-emerald-100",
        meta: "bg-indigo-700 text-indigo-100",
        "<blockquote>": "bg-amber-700 text-amber-100",
    };

    return (
        <div className="flex items-center gap-2 mb-1">
            <label className="text-md font-medium text-zinc-400">{children}</label>
            {badge && (
                <span
                    className={`text-xs px-2 py-0.5 rounded-full border border-zinc-600 ${badgeColors[badge] || "bg-zinc-800 text-zinc-400"
                        }`}
                >
                    {badge}
                </span>
            )}
        </div>
    );
}
