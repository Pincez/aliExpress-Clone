import React, { useState } from "react";
import Banner from "../components/Banner";
import NewProductsSlider from "../components/NewProductsSlider";
import all_product from "../assets/Frontend_Assets/all_product"; // Import the data

const Homepage = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // Close tooltip when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest(".tooltip-container") && !event.target.closest(".menu-button")) {
      setIsTooltipOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden relative">
        {/* Banner Section */}
        <div className="w-full">
          <div className="p-6">
            <div className="h-64"> {/* Fixed height for Banner */}
              <Banner />
            </div>
          </div>
        </div>

        {/* New Products Slider Section */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ overflowX: "hidden", marginTop: "0" }}>
          <NewProductsSlider products={all_product} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
