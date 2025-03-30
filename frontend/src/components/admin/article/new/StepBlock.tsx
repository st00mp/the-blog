import ArticleSection from "./ArticleSection";
import React from "react";

type StepBlockProps = {
    stepNumber: number;
    title: string;
    onChangeTitle: (val: string) => void;
    content: string;
    onChangeContent: (val: string) => void;
    titlePlaceholder: string;
    tooltip: string;
    children?: React.ReactNode; // Ajout du children
};

export function StepBlock({
    stepNumber,
    title,
    onChangeTitle,
    content,
    onChangeContent,
    titlePlaceholder,
    tooltip,
    children,
}: StepBlockProps) {
    return (
        <ArticleSection
            title={`Étape ${stepNumber} : ${titlePlaceholder}`}
            badge="H3 + <p>"
            tooltip={tooltip}
        >
            <div className="space-y-6">
                {/* H3 */}
                <div>
                    <label className="text-sm font-medium text-zinc-400 mb-1 block">
                        Sous-titre de l’étape (H3)
                    </label>
                    <input
                        type="text"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500"
                        value={title}
                        onChange={(e) => onChangeTitle(e.target.value)}
                        placeholder={titlePlaceholder}
                    />
                </div>

                {/* Paragraphe associé */}
                <div>
                    <label className="text-sm font-medium text-zinc-400 mb-1 block">
                        Contenu de l’étape (p)
                    </label>
                    {children}
                </div>
            </div>
        </ArticleSection>
    );
}
