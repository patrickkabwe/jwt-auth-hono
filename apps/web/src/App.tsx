import { useEffect, useState } from "react";
import "./App.css";

import { ChevronRight, MessageSquare, User } from "lucide-react";
import { Outlet, Route, Routes, useNavigate, useParams } from "react-router";
import AuthPage from "./auth-page";
import { axiosInstance } from "./network";

// PostList Component
const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const onPostClick = (post) => {
        // Navigate to the post detail page
        navigate(`/post/${post.id}`);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axiosInstance.get("/contents/posts");

            console.log("Posts:", response.data);

            setPosts(response.data ?? []);
        };

        fetchPosts();
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Posts</h1>
                <p className="text-gray-600">
                    Welcome to the posts page. Click on a post to view more
                    details.
                </p>
            </div>
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onPostClick(post)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {post.title}
                            </h2>
                            <div className="flex items-center mt-2 text-gray-600">
                                <User size={16} className="mr-1" />
                                <span>{post.author.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center text-gray-500">
                                <MessageSquare size={16} className="mr-1" />
                                {post.comments.length}
                            </span>
                            <ChevronRight size={16} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// PostDetail Component
const PostDetail = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    const params = useParams();

    console.log("Params:", params);

    const onBack = () => {
        navigate("/");
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(
                    `/contents/post/${params.id}`
                );
                const commentRes = await axiosInstance.get(
                    `/contents/comments/${params.id}`
                );

                setComments(commentRes.data ?? []);
                setPost(response.data ?? null);
            } catch (error) {
                console.error("An error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
                ← Back to Posts
            </button>
            {isLoading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {post?.title}
                        </h2>
                        <div className="flex items-center mt-2 text-gray-600">
                            <User size={16} className="mr-1" />
                            {/* <span>{post.author.}</span> */}
                        </div>
                    </div>

                    <p className="text-gray-700 mb-8">{post?.content}</p>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Comments ({comments.length})
                        </h3>
                        <div className="space-y-4">
                            {comments?.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-50 rounded-lg p-4"
                                >
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <User size={16} className="mr-1" />
                                        <span>{comment.author}</span>
                                    </div>
                                    <p className="text-gray-700">
                                        {comment.content}
                                    </p>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className="text-gray-500">
                                    No comments yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Layout = () => {
    return (
        <div className="px-4 py-8  bg-white h-screen w-screen">
            <Outlet />
        </div>
    );
};

// Main App Component
const PostsApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PostList />} />
                <Route path="post/:id" element={<PostDetail />} />
            </Route>

            <Route path="/auth" element={<AuthPage />} />
        </Routes>
    );
};

export default PostsApp;
