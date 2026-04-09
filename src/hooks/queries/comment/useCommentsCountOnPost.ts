import { useQuery } from "@tanstack/react-query";

const fetchCommentsCount = async (postId: string, token: string) => {


    try {
        const path = `/api/v1/post/${postId}/comments/counts`;
        const response = await fetch(path, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return await response.json();

    } catch (error: any) {
        console.error("Failed to get comments count", error);
        return 0;
    }
}



const useCommentsCountOnPost = (postId: string, token: string) => {
    return useQuery({
        queryKey: ["commentsCount", postId],
        queryFn: () => fetchCommentsCount(postId, token),
        refetchOnWindowFocus: false,
    })
}

export default useCommentsCountOnPost;

