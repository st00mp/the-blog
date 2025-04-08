import ArticleSection from "./ArticleSection";
import React from "react";
import { FieldLabel } from "./FieldLabel";

type StepBlockProps = {
    stepNumber: number;
    title: string;
    onChangeTitle: (val: string) => void;
    content: any;
    onChangeContent: (val: string) => void;
    titlePlaceholder: string;
    tooltip: string;
    children?: React.ReactNode;
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
            tooltip={tooltip}
        >
            <div className="space-y-6">
                {/* H3 */}
                <div>
                    <FieldLabel badge="H3">Sous-titre de l’étape</FieldLabel>
                    <div className="mt-3">
                        <input
                            type="text"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                            value={title}
                            onChange={(e) => onChangeTitle(e.target.value)}
                            placeholder={titlePlaceholder}
                        />
                    </div>
                </div>

                {/* Paragraphe associé */}
                <div>
                    <FieldLabel badge="<p>">Contenu de l’étape</FieldLabel>
                    <div className="mt-3">
                        {children}
                    </div>
                </div>
            </div>
        </ArticleSection>
    );
}
