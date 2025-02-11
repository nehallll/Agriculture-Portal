import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { farmingTypes } from "../farmingTypes";

export default function FarmingPosts() {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    navigate(`/posts/${categoryName}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gray-900 flex flex-grow items-center justify-center py-8 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-8 font-bold">Select Farming Category</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {farmingTypes.map((category) => {
              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category.toLowerCase())}
                  className="group flex flex-col items-center transition-all duration-200 ease-in-out"
                >
                  <div className="p-2 bg-white rounded-full mb-2 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
                  </div>
                  <span className="text-white uppercase text-sm font-medium tracking-wide text-center transition-colors duration-200 ease-in-out group-hover:text-emerald-500">
                    {category.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
