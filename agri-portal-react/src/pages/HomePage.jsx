import { Link, useNavigate } from 'react-router-dom';
import FeaturedCard from "../components/common/FeatureCard";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import {
  SunIcon,
  ScaleIcon,
  HandRaisedIcon,
  UserGroupIcon,
  ChartPieIcon,
  StarIcon,
} from "@heroicons/react/24/outline";


const categories = [
  {
    name: "agriculture",
    icon: SunIcon,
    label: "AGRICULTURE",
  },
  {
    name: "horticulture",
    icon: ScaleIcon,
    label: "HORTICULTURE",
  },
  {
    name: "floriculture",
    icon: HandRaisedIcon,
    label: "FLORICULTURE",
  },
  {
    name: "sericulture",
    icon: UserGroupIcon,
    label: "SERICULTURE",
  },
  {
    name: "apiculture",
    icon: ChartPieIcon,
    label: "APICULTURE",
  },
  {
    name: "aquaculture",
    icon: StarIcon,
    label: "AQUACULTURE",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    navigate(`/posts/${categoryName}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 space-y-8">
          <FeaturedCard />
          
          {/* Add Category Cards Section */}
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className="border border-gray-800 group p-8 bg-gray-900 rounded-lg hover:border-gray-400 transition-all duration-200 ease-in-out min-h-[300px] w-full"
                  >
                    <div className="flex flex-col items-center h-full justify-center">
                      <div className="p-5 bg-gray-900 rounded-lg mb-6 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-white text-xl font-bold">
                        {category.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <Footer className="ml-64" />
    </div>
  );
};
//need to add more in this place
const Sidebar = () => {
  const sidebarItems = [
    { name: 'Recent News', link: 'https://agriwelfare.gov.in/en/Recent' },
    { name: 'Weather', link: 'https://www.google.com/search?client=firefox-b-d&q=Current+weather' },
    { name: 'PIB', link: 'https://pib.gov.in/indexd.aspx?reg=3&lang=1' },
    { name: 'Schemes', link: 'https://pmkisan.gov.in/' },
    { name: 'Services', link: 'https://agriwelfare.gov.in/' }
  ];

  const adminToken  = localStorage.getItem('adminToken');
  const userToken  = localStorage.getItem('userToken');

  return (
    <aside 
      className="fixed left-0 top-16 h-full w-64 bg-gray-900 border-r border-gray-700 p-6 space-y-8 mt-10"
      aria-label="Sidebar navigation"
    >
      <nav>
        <h2 className="sr-only">Main Navigation</h2>
        <ul className="space-y-4">
          {sidebarItems.map(({ name, link }) => (
            <li key={name}>
              <Link
                to={link}
                className="text-gray-300 text-sm hover:text-white transition-colors block p-2 rounded hover:bg-gray-800"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!(adminToken || userToken) && <AdminSection />}
      <SalesPortalSection />
    </aside>
  );
};


const SalesPortalSection = () => {
  return (
    <section aria-labelledby="sales-portal-heading">
      <h3 id="sales-portal-heading" className="text-white text-lg font-medium mb-4">
        Sales Portal
      </h3>
      <div className="space-y-3">
        <Link to='/user/buy'><button 
          className="w-full py-2 bg-gray-900 border border-white text-white text-sm hover:bg-white hover:text-gray-900 transition-all mt-1"
        >
          Buy Products
        </button></Link>
        
        <Link to='/users/add-product'><button 
          className="w-full py-2 bg-gray-900 border border-white text-white text-sm hover:bg-white hover:text-gray-900 transition-all mt-3"
        >
          List Items to Sell
        </button></Link>
      </div>
    </section>
  );
};

const AdminSection = () =>{
  return(
    <button 
          className="w-full py-2 bg-white text-gray rounded text-sm font-medium
                     hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2
                     focus:ring-gray-900 focus:ring-offset-2"
        >
          <Link to='/adminlogin'>Administrator Login</Link>
        </button>
  )
}

export default HomePage;