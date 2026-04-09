    import { COMMENT_PAGE_SIZE } from "@/utils/constants";
    import { useInfiniteQuery } from "@tanstack/react-query";

    const getAllCommentsByPostId = async (
        postId: string,
        token: string,
        pageParam: number
    ) => {

        const path = `/api/v1/post/${postId}/comments?page=${pageParam}&limit=${COMMENT_PAGE_SIZE}`;

        const response = await fetch(path, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch comments");

        return response.json();
    };


    export default function useCommentsByPostId(postId: string, token: string) {

        return useInfiniteQuery({
            queryKey: ["comments", postId],

            queryFn: ({ pageParam = 1 }) =>
                getAllCommentsByPostId(postId, token, pageParam),

            initialPageParam: 1,

            getNextPageParam: (lastPage) =>
                lastPage.pagination.hasMore
                    ? lastPage.pagination.page + 1
                    : undefined,

            refetchOnWindowFocus: false,
        });
    }