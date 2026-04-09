import { POST_PAGE_SIZE } from "@/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";


export const getAllPosts = async ({ pageParam = 1 }) => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`/api/v1/post?page=${pageParam}&limit=${POST_PAGE_SIZE}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return res.json();
};


export const usePosts = () => {
    return useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,

        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasMore
                ? lastPage.pagination.page + 1
                : undefined;
        },
        refetchOnWindowFocus: false
    });
};