import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";

export default function PostDetail() {
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPost(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch post");
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <div className="text-gray-400 text-center p-8">Loading post...</div>;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center p-6">
      <Header />
      <div className="max-w-4xl w-full mt-20">
        <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>
        <div className="mb-8 text-gray-400 text-sm">
          Posted on {new Date(post.createdAt).toLocaleDateString()} in {category}
        </div>
        
        {post.sections?.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {section.subHeading}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {section.text}
            </p>
            {section.imageUrl && (
              <img
                src={section.imageUrl}
                alt={section.subHeading}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}