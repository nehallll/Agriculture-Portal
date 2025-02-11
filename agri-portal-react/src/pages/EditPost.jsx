import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/posts/${postId}`);
        if (data.error) {
          setError(data.error);
        } else {
          setPost(data);
        }
      } catch (err) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = post.sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setPost({ ...post, sections: updatedSections });
  };

  const addSection = () => {
    setPost({
      ...post,
      sections: [...post.sections, { subHeading: "", text: "", imageUrl: "" }]
    });
  };

  const removeSection = (index) => {
    if (post.sections.length === 1) return;
    const updatedSections = post.sections.filter((_, i) => i !== index);
    setPost({ ...post, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const { data } = await axios.put(
        `http://localhost:3001/api/posts/${postId}`,
        post
      );
      
      setSuccess("Post updated successfully!");
      setTimeout(() => {
        navigate(`/admin/manage-posts/${post.farmingType}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error updating post.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <div className="flex-grow flex items-center justify-center py-10 mt-20">
        <div className="bg-gray-800/80 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
            Edit Post
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-700 rounded-lg"></div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-700 p-5 rounded-lg space-y-4">
                  <div className="h-6 bg-gray-600 w-1/4 rounded"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 bg-gray-600 rounded-lg"></div>
                    <div className="space-y-4">
                      <div className="h-10 bg-gray-600 rounded"></div>
                      <div className="h-20 bg-gray-600 rounded"></div>
                      <div className="h-10 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-300">Post Title</label>
                <input
                  type="text"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white text-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-300">Author Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="authorName"
                    value={post.author?.name || ""}
                    onChange={handleChange}
                    placeholder="Author Name"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  />
                  <input
                    type="email"
                    name="authorEmail"
                    value={post.author?.email || ""}
                    onChange={handleChange}
                    placeholder="Author Email"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  />
                </div>
              </div>

              {post.sections.map((section, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-xl shadow-md relative">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-300">
                      Section {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      disabled={post.sections.length === 1}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {section.imageUrl ? (
                        <img
                          src={section.imageUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-600 flex items-center justify-center text-gray-400 rounded-lg">
                          No Image Preview
                        </div>
                      )}
                      <input
                        type="text"
                        value={section.imageUrl}
                        onChange={(e) => handleSectionChange(index, "imageUrl", e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white"
                        placeholder="Paste image URL here"
                      />
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={section.subHeading}
                        onChange={(e) => handleSectionChange(index, "subHeading", e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white"
                        placeholder="Section subheading"
                      />
                      <textarea
                        value={section.text}
                        onChange={(e) => handleSectionChange(index, "text", e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white h-48"
                        placeholder="Write your content here..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add Section
                </button>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
