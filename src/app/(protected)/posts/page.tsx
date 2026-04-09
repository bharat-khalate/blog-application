'use client';

import Card, { ICardComponentHtmlClass } from '@/components/ui/Card';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { usePosts } from '@/hooks/queries/post/usePosts';
import { objToFormData } from '@/utils/formDataParser';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCreatePost } from '@/hooks/queries/post/useCreatePost';

interface IUser { _id: string; email: string; firstName: string; lastName: string; role: "USER" | "ADMIN" }
export interface IPost {
    _id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date | string;
    tags: string[]
    imageUrl?: string
}

interface IPostForm {
    title: string
    description: string
    userId: string
    tags: string[]
    file: File | undefined
}


const cardElementCalss: ICardComponentHtmlClass = {
    imageUrl: "w-full h-40 object-cover",
    title: "line-clamp-1 text-sm",
    tags: "text-xs font-medium px-2.5 py-0.5 rounded-full border border-transparent",
    handleViewButton: "inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition",
    commentCount: "",
    description: "text-gray-700 leading-relaxed text-[15px] whitespace-pre-line",
    tagsCount: 2
}

export default function PostsPage(): React.ReactNode {

    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<IPostForm>({ title: '', description: '', userId: '', tags: [], file: undefined });
    const [error, setError] = useState('');
    const [fieldError, setFieldErrors] = useState<Record<string, string>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [createPost, setCreatePost] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [tagInput, setTagInput] = useState("")
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const { mutate: createPostMutation, isPending } = useCreatePost();


    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        
    } = usePosts();

    const posts: IPost[] = data?.pages.flatMap((page) => page.data) ?? [];




    useEffect(() => { fetchUser(); }, [router]);


    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (!loaderRef.current) return;
            if (entries[0].isIntersecting &&
                hasNextPage &&
                !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === " ") {

            e.preventDefault()
            e.stopPropagation()

            const value = tagInput.trim()
            if (!value) return

            setForm((prev) => {
                if (prev.tags.includes(value)) return prev

                return {
                    ...prev,
                    tags: [...prev.tags, value],
                }
            })

            setTagInput("")
        }
    }



    const onCreate = () => {
        setForm({ title: '', description: '', userId: user?._id || '', tags: [] as string[], file: undefined })
        setError(''); setFieldErrors({});
        setCreatePost(true);
        setModalOpen(true);
    }





    const viewComments = async (data: IPost) => {
        router.push(`posts/${data._id}`)
    }


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setError(''); setFieldErrors({});
        setSaving(true);
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login");
            return;
        }
        try {
            const payload = objToFormData({ ...form });
            createPostMutation({ payload, token }, {
                onSuccess: () => {
                    setModalOpen(false);
                },

                onError: (err: any) => {
                    setFieldErrors(err);
                    setError(err.message || "Failed to create post")
                }
            })
        } catch (err: any) {
            console.log(err)
        } finally {
            setSaving(false);
        }
    };


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


    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome <span className='text-xl text-black font-bold'>@{user?.firstName}</span>,<br /> explore Posts!</p>
                </div>
                {user && user.role == "ADMIN" && (
                    <button
                        onClick={onCreate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"

                    >+ New Post</button>
                )}
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {posts?.map((post) => (
                    <div key={post._id} className="mb-4 break-inside-avoid">
                        <Card data={post} handleView={viewComments} className="cursor-pointer hover:shadow-xl hover:scale-105 bg-white text-black rounded-2xl shadow-md transition-transform duration-200 overflow-hidden"
                            elementHtmlClass={cardElementCalss}
                        />

                    </div>
                ))}
            </div>
            <div ref={loaderRef} className="flex h-10 justify-center p-6">
                {isFetchingNextPage && (
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setCreatePost(false) }} title={"Add Post"} size="lg">

                {
                    createPost && (
                        <form onSubmit={handleSave} className="space-y-4">
                            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label htmlFor='title' className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        id='title'
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => { e.preventDefault(); e.stopPropagation(); setForm({ ...form, title: e.target.value }) }}
                                        onKeyDown={(e) => { e.stopPropagation(); }}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldError.title ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="Product name"
                                    />
                                    {fieldError.title && <p className="text-xs text-red-500 mt-1">{fieldError.title}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor='title' className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id='title'
                                        value={form.description}
                                        onChange={(e) => { e.preventDefault(); e.stopPropagation(); setForm({ ...form, description: e.target.value }) }}
                                        onKeyDown={(e) => { e.stopPropagation(); }}
                                        rows={2}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none ${fieldError.description ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="Short product description"
                                    />
                                    {fieldError.description && <p className="text-xs text-red-500 mt-1">{fieldError.description}</p>}
                                </div>
                                <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags
                                    </label>

                                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500">

                                        {/* Render Tags */}
                                        {form.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            tags: form.tags.filter((_, i) => i !== index),
                                                        })
                                                    }
                                                    className="text-indigo-500 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}

                                        {/* Input */}
                                        <input
                                            type="text"
                                            placeholder="Add tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTags}
                                            className="flex-1 text-sm outline-none min-w-[120px]"
                                        />
                                    </div>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Press Enter to add a tag
                                    </p>
                                </div>

                                <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image
                                    </label>

                                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500">

                                        <p className="text-md text-gray-400  w-full">

                                            {form.file ? (
                                                <span
                                                    className="flex justify-between items-center gap-1  bg-green-100 text-indigo-700 text-xs px-2 py-1 rounded-md"
                                                >
                                                    {form.file.name}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm((prev) => { return { ...prev, file: undefined } })
                                                        }
                                                        className="text-indigo-500 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ) : (
                                                < input
                                                    type="file"
                                                    placeholder="Add Image..."
                                                    value={form.file}
                                                    onChange={(e) => setForm((prev) => { return { ...prev, file: e.target.files?.[0] } })}
                                                    onKeyDown={(e) => { e.stopPropagation(); }}
                                                    className="flex-1 text-sm outline-none min-w-[120px]"
                                                />

                                            )}
                                        </p>
                                    </div>

                                </div>


                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setModalOpen(false); setCreatePost(false) }} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                                    {isPending ? 'Saving...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    )
                }
            </Modal >
        </div >
    )
}