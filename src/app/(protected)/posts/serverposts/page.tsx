import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Card, { ICardComponentHtmlClass } from "@/components/ui/Card";
import { IUser } from "@/types/global.types";
import { IPost } from "../page";
import Link from "next/link";

// ... (Interfaces stay the same)



const cardElementCalss: ICardComponentHtmlClass = {
    imageUrl: "w-full h-40 object-cover",
    title: "line-clamp-1 text-sm",
    tags: "text-xs font-medium px-2.5 py-0.5 rounded-full border border-transparent",
    handleViewButton: "inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition",
    commentCount: "",
    description: "text-gray-700 leading-relaxed text-[15px] whitespace-pre-line",
    tagsCount: 2
}

export default async function PostsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("1. Token found:", !!token);

    if (!token) {
        redirect("/login");
    }



    const fetchUser = async () => {
        console.log("2. Starting fetchUser...");
        try {
            const res = await fetch(`http://localhost:3000/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            console.log("3. User Res Status:", res.status);
            return res.ok ? (await res.json()).data : null;
        } catch (e) {
            console.error("User Fetch Error:", e);
            return null;
        }
    };

    const fetchPosts = async () => {
        console.log("4. Starting fetchPosts..."); // CHECK IF THIS LOGS
        try {
            const res = await fetch(`http://localhost:3000/api/v1/post`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            console.log("5. Posts Res Status:", res.status);
            return res.ok ? (await res.json()).data : [];
        } catch (e) {
            console.error("Posts Fetch Error:", e);
            return [];
        }
    };

    console.log("6. Triggering Parallel Fetch...");
    const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
    console.log("7. All data fetched. Posts count:", posts?.length);
    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Blogs</h1>
                <p className="text-gray-500 mt-2">
                    {user ? `Welcome back, ${user.firstName}!` : "Explore the latest posts"}
                </p>
            </header>

            {posts.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                    {posts.map((post: IPost) => (
                        <div key={post._id} className="mb-6 break-inside-avoid">
                            <Link href={`/posts/${post._id}`} key={post._id} className="mb-6 block break-inside-avoid">
                                <Card
                                    data={post}
                                    className="hover:shadow-2xl hover:-translate-y-1 bg-white rounded-2xl shadow-sm transition-all duration-300 overflow-hidden border border-gray-100"
                                    elementHtmlClass={cardElementCalss}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    No posts found. Start writing!
                </div>
            )}
        </div>
    );
}