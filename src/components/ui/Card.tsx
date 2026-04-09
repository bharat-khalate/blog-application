"use client";

import { IPost } from "@/app/(protected)/posts/page";
import { useState } from "react";

const badgeStyles = [
    "bg-green-50 text-green-700 hover:bg-green-100",
    "bg-blue-50 text-blue-700 hover:bg-blue-100",
    "bg-purple-50 text-purple-700 hover:bg-purple-100",
    "bg-amber-50 text-amber-700 hover:bg-amber-100",
    "bg-pink-50 text-pink-700 hover:bg-pink-100",
    "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
];

// Helper to get a consistent "random" color based on the tag string
// This ensures "React" is always Blue, and "CSS" is always Green
const getTagStyle = (tag: string) => {
    const charCodeSum = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return badgeStyles[charCodeSum % badgeStyles.length];
};

export interface ICardComponentHtmlClass {
    imageUrl?: string,
    title: string,
    tags: string,
    handleViewButton?: string,
    commentCount?: string,
    description?: string,
    tagsCount?: number;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    data: IPost,
    handleView?: (data: IPost) => void,
    commentCount?: number,
    elementHtmlClass: ICardComponentHtmlClass,
}

const formatPost = (date: Date | string) => {
    if (!date) return "";

    const parsedDate =
        typeof date === "string" || date instanceof Date
            ? new Date(date)
            : new Date(date?.$date || date);

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

}


const getShortText = (text: string, wordLimit: number) => {
    const words = text;
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit);
};



const Card = ({ data, handleView, elementHtmlClass, commentCount, ...rest }: CardProps) => {

    const [expanded, setExpanded] = useState(false);
    const tagsCount = elementHtmlClass.tagsCount ?? data.tags.length;
    const wordLimit = data.imageUrl ? 250 : 1000;
    const isLong = data.description?.length > wordLimit;


    return (
        <div
            {...rest}
            onClick={() => {
                if (handleView)
                    handleView(data)
            }}
        >
            {/* Image */}
            {data?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={data.imageUrl}
                    alt="post"
                    className={elementHtmlClass.imageUrl ? elementHtmlClass.imageUrl : ""}
                />
            )}

            <div className="p-4">

                {/* Title */}
                <h2 className="text-lg font-semibold mb-2">
                    <span title={data.title} className={elementHtmlClass.title ?? ""}>
                        {data.title}
                    </span>
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {data.tags?.slice(0, tagsCount).map((tag, i) => (
                        <span
                            key={i}
                            className={`${elementHtmlClass.tags ?? ''} ${getTagStyle(tag)}`}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className={`flex items-center ${handleView && "justify-between"} gap-3 gap-3 text-sm text-gray-500 mb-4`}>
                    <span className="text-xs text-gray-400">
                        {formatPost(data.createdAt)}
                    </span>
                    {handleView && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (handleView)
                                    handleView(data)
                            }}
                            className={elementHtmlClass.handleViewButton ? elementHtmlClass.handleViewButton : ""}
                        >
                            View
                        </button>)}
                    {commentCount != null && commentCount != undefined && (
                        <div>
                            <span className="me-2">•</span>
                            <span className={elementHtmlClass.commentCount ? elementHtmlClass.commentCount : ""}>{commentCount} comments</span>
                        </div>
                    )}
                </div>

                {data.description && (
                    <p className={elementHtmlClass?.description ?? ""}>
                        {expanded || !isLong
                            ? data.description
                            : `${getShortText(data.description, wordLimit)}...`}

                        {isLong && !expanded && (
                            <span
                                className="text-blue-500 cursor-pointer ml-2"
                                onClick={() => setExpanded(true)}
                            >
                                See more
                            </span>
                        )}
                    </p>
                )}

            </div>
        </div>
    )
}

export default Card