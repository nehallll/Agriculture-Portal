import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/common/Header"

export default function PostsList() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3001/api/posts?farmingType=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPosts([]);
        } else {
          setPosts(data);
        }
      })
      .catch(() => setError("Failed to fetch posts"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center p-6">
      <Header/>
      <h1 className="text-3xl font-bold mb-4 capitalize text-white mt-20">{category} Posts</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {posts.map((post) => (
          <Link to={`/posts/${category}/${post.id}`} key={post.id} className="w-full">
            <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-lg hover:border-gray-400 transition-all">
              <h2 className="text-xl font-semibold text-white mb-3">{post.title}</h2>
              <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              {post.sections && post.sections.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg text-gray-300 font-semibold">{post.sections[0].subHeading}</h3>
                  <p className="text-gray-400 text-sm mt-1">{post.sections[0].text}</p>
                  {post.sections[0].imageUrl && (
                    <img src={post.sections[0].imageUrl} alt={post.sections[0].subHeading || "Post"} className="mt-3 rounded-lg w-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}