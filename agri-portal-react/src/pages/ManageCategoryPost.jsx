import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ManageCategoryPosts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(
          `http://localhost:3001/api/posts?farmingType=${categoryName}`,
          { headers: { Authorization: token } }
        );
        setPosts(data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryName]);

  const handleEditPost = (postId) => {
    navigate(`/admin/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:3001/api/posts/${postId}`, {
        headers: { Authorization: token }
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <div className="flex-grow flex items-center justify-center py-10 mt-20">
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-6xl mx-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-200">
              Managing {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Posts
            </h2>
            <button
              onClick={() => navigate(`/admin/addpost`)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              Create New Post
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start gap-6 p-5 bg-gray-700 rounded-lg">
                  <div className="w-40 h-40 bg-gray-600 rounded-lg"></div>
                  <div className="flex-grow space-y-3">
                    <div className="h-6 bg-gray-600 w-2/3 rounded"></div>
                    <div className="h-4 bg-gray-600 w-full rounded"></div>
                    <div className="h-4 bg-gray-600 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-200"
                >
                  <div className="flex gap-6">
                    {post.sections?.[0]?.imageUrl && (
                      <img
                        src={post.sections[0].imageUrl}
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {post.sections?.[0]?.text || "No content available"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No posts found in this category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
