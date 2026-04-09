'use client';

import Comment from '@/components/features/Comment';
import Card, { ICardComponentHtmlClass } from '@/components/ui/Card';
import useCommentsCountOnPost from '@/hooks/queries/comment/useCommentsCountOnPost';
import { useQueryClient } from '@tanstack/react-query';


import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-medium-image-zoom/dist/styles.css'


export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "USER" | "ADMIN",
    profilePicUrl: string

}
export interface IPost {
    _id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date | string;
    tags: string[]
}

interface ICommentUser {
    _id: string;
    email: string,
    firstName: string,
    lastName: string,
    profilePicUrl: string
}



export interface IComment {
    _id: string;
    userId: ICommentUser;
    postId: string;
    description: string;
    createdAt: Date;
}

export default function PostsPage(): React.ReactNode {

    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [viewPost, setViewPost] = useState<IPost | null>(null);

    const { postId } = useParams<{ postId: string }>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const { data, isLoading } = useCommentsCountOnPost(postId, token ?? "");

    const comments = data?.data ?? 0;
















    const formatPost = (posts: IPost) => {
        if (!posts) return posts;

        const date = new Date(posts?.createdAt ?? "").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })

        return { ...posts, createdAt: date }

    }






    useEffect(() => { fetchUser(); }, [router]);
    useEffect(() => {
        if (!postId) router.push("/posts")

      
        fetchPost(postId);

        // fetchComments(postId)
    }, [router, user]);



    const fetchPost = async (postId: string) => {
        setLoading(true)
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        if (!postId)
            router.push('/posts');
        try {

            const response = await fetch(`/api/v1/post/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const parsedResponse = await response.json();
            const statePost = formatPost(parsedResponse.data);
            setViewPost(statePost);
        } catch (error: any) {
            console.error("Failed to get posts", error);
        } finally {
            setLoading(false);
        }
    }


    const cardElementCalss: ICardComponentHtmlClass = {
        imageUrl: "w-full h-80 object-cover",
        title: "text-3xl font-bold text-gray-900 mb-2",
        tags: "text-xs font-medium px-2.5 py-0.5 rounded-full border border-transparent",
        handleViewButton: "inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition",
        description: "text-gray-700 leading-relaxed text-[15px] whitespace-pre-line"
    }


    



    const fetchUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }
        try {
            const response = await fetch('/api/v1/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }
            const data = await response.json();
            setUser(data.data);
        } catch (error) {
            localStorage.removeItem('token');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    if (!(viewPost)) return <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>

    return (
        <div className=" min-h-screen  py-8">
            <div className="max-w-5xl mx-auto px-4 ">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
                        <p className="text-sm text-gray-500">Welcome <span className='text-xl text-black font-bold'>@{user?.firstName}</span>,<br /> explore posts from the community</p>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 text-sm transition"
                    >
                        Back
                    </button>
                </div>


                {/* Post */}
                <Card
                    data={viewPost}
                    commentCount={comments || 0}
                    className="bg-white border border-gray-200 rounded-xl p-6 mb-8"
                    elementHtmlClass={cardElementCalss}
                />
                <Comment user={user} post={viewPost} />
            </div>
        </div>
    )
}