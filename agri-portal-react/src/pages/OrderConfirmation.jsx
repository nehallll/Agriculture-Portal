import { Link } from "react-router-dom";

export const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-md text-center">
        <div className="flex justify-center mb-4">
          <svg 
            className="w-16 h-16 text-green-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

