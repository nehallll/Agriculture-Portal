import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { farmingTypes } from "../farmingTypes";


export default function ManageFarmingPosts() {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    navigate(`/posts/${categoryName}`);
  };

  const handleAddPost = () => {
    navigate("/admin/addpost");
  };

  const handleEditPosts = (categoryName) => {
  console.log("Navigating to:", `/admin/manage-posts/${categoryName}`);
  navigate(`/admin/manage-posts/${categoryName}`);
};


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gray-900 flex flex-grow items-center justify-center py-8 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-8 font-bold">Manage Farming Posts</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {farmingTypes.map((category) => {
              return (
                <div key={category} className="group flex flex-col items-center">
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className="p-2 bg-white rounded-full mb-2 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
                  >
                  </button>
                  <span className="text-white uppercase text-sm font-medium tracking-wide text-center transition-colors duration-200 ease-in-out group-hover:text-emerald-500">
                    {category}
                  </span>
                  <button
                    onClick={() => handleEditPosts(category)}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                     Edit Posts
                  </button>
                  
                </div>
              );
            })}
          </div>
          <button
            onClick={handleAddPost}
            className="px-6 py-3 bg-gray-700 border border-gray-700 text-white rounded-lg flex items-center hover:bg-gray-900 transition-all"
          >
           Add New Post
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
