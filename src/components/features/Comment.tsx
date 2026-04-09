import { IComment, IPost, IUser } from "@/app/(protected)/posts/[postId]/page";
import useCommentsByPostId from "@/hooks/queries/comment/useCommentsByPostId";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { QueryClient, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useRef, useState } from "react"
import useCommentsCountOnPost from "@/hooks/queries/comment/useCommentsCountOnPost";

export interface ICommentComponentProps {
    user: IUser | null;
    post: IPost;
}

const Comment: React.FC<ICommentComponentProps> = ({ user, post }: ICommentComponentProps): React.ReactNode => {
    const router = useRouter();

    const [error, setError] = useState('');
    const [fieldError, setFieldErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<boolean>(false);

    const [formComment, setFormComment] = useState('');
    const { postId } = useParams<{ postId: string }>();
    const loadRef = useRef<HTMLDivElement | null>(null);
    const [showCommentButton, setShowCommentButton] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const { data: commentsCountData, isLoading: isCommentCountLoading } = useCommentsCountOnPost(postId, token ?? "");

    const commentsCount = commentsCountData?.data ?? 0;


    const { data, fetchNextPage, isFetchingNextPage } = useCommentsByPostId(postId, token ?? "");

    const comments: IComment[] = data?.pages.flatMap(page => page.data) ?? [];

    useEffect(() => {
        if (!postId) router.push("/posts")
    }, [router, user]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        })
        if (loadRef.current) observer.observe(loadRef.current);
        return () => observer.disconnect();
    }, [loadRef]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
    }, []);


    const authHeader = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    };







    const submitComment = async (e: any) => {
        e.preventDefault();
        console.log(formComment)
        if (!formComment || saving) return;
        setSaving(true);
        setError(''); setFieldErrors({});
        const payLoad = {
            userId: user?._id,
            description: formComment,
            postId: post?._id
        };
        try {
            const res = await fetch("/api/v1/comment", {
                method: "POST",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payLoad)
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                if (data.errors) setFieldErrors(data.errors);
                else setError(data.message || 'Something went wrong');
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["comments", postId], refetchType: "active" })
            queryClient.invalidateQueries({ queryKey: ["commentsCount", postId], refetchType: "active" })
            setFormComment('')
        } catch (err: any) {
            console.error(err)
        } finally {
            setSaving(false);
        }
    };



    return (

        <div>

            {/* Comment Input */}
            <div className='flex justify-start gap-3 mt-32'>
                <img src={user?.profilePicUrl} className='rounded-full object-cover w-8 h-8 ms-2 border-1 mb-2' />
                <span className='mt-1'>{user?.firstName}</span>
            </div>

            <div
                className="bg-gray-200 w-full p-2 rounded-md mb-3 transition-all"
                onFocus={() => setShowCommentButton(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setShowCommentButton(false)
                    }
                }}
            >
                <form onSubmit={submitComment}>

                    <input
                        type='text'
                        placeholder="Write a comment..."
                        className="w-full rounded-md px-3 py-2 border-0 bg-gray-200 focus:ring-0 text-sm outline-none resize-none"
                        value={formComment}
                        onChange={(e) => setFormComment(e.target.value)}
                    />

                    {fieldError?.description && (
                        <p className="text-xs text-red-500 mt-1">
                            {fieldError.description}
                        </p>
                    )}

                    <div
                        className={`flex justify-end transition-all duration-200 gap-2 ease-out ${showCommentButton
                            ? "opacity-100 translate-y-0 mt-2"
                            : "opacity-0 -translate-y-1 pointer-events-none"
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setFormComment("")
                                setFieldErrors({})
                                setShowCommentButton(false)
                            }}
                            className="bg-gray-300 text-gray-700 px-3 py-1 text-xs rounded-md hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-3 py-1 text-xs rounded-md hover:bg-gray-700 transition"
                        >
                            Post
                        </button>
                    </div>

                </form>
            </div>



            {/* Comments Section */}
            <div className=" rounded-xl">

                {/* Comment Header */}
                <div className="p-4 border-b border-gray-300 ">
                    <h2 className="font-semibold text-gray-800">
                        Responses ({commentsCount || 0})
                    </h2>
                </div>

                {/* Comment List */}
                <div className="p-4 space-y-4">

                    <div className="p-4 space-y-4 max-h-[350px] ">

                        {comments?.length ? (
                            comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="flex gap-3 bg-gray-50 rounded-lg p-3"
                                >

                                    {/* Avatar */}

                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={comment?.userId?.profilePicUrl}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-gray-400 cursor-pointer"
                                    />


                                    {/* Comment Content */}
                                    <div className="flex-1">

                                        <div className="flex items-center gap-2 text-sm flex-wrap justify-between">
                                            <span className="font-medium text-gray-800">
                                                {comment?.userId?.firstName}<span className="ms-1 text-xs text-gray-400">{comment?.userId?._id == user?._id && " (You)"}</span>
                                            </span>

                                            <span className="text-gray-400 text-xs">
                                                {new Date(comment?.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mt-1">
                                            {comment?.description}
                                        </p>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">
                                No comments yet
                            </p>
                        )}
                        <div ref={loadRef} className="flex h-10 justify-center p-6">
                            {isFetchingNextPage && (
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                            )}
                        </div>

                    </div>

                </div>
            </div>


        </div>
    )
}


export default Comment;