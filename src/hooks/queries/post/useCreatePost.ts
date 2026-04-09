import { useMutation, useQueryClient } from "@tanstack/react-query";


interface CreatePostPayload {
    payload: FormData;
    token: string;
}

export const createPost = async ({ payload, token }: CreatePostPayload) => {
    try {
        const res = await fetch("/api/v1/post", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: payload
        });
        const data = await res.json();
        if (data.errors) throw data.errors;
        return data;
    } catch (err) {
        console.error("Failed to create post", err);
        throw err;
    }

};  


export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }

    })
}

