import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Card from "./Card";

// Custom desktop arrows
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hidden md:block"
    aria-label="Next products"
  >
    <FiChevronRight className="text-gray-700 text-xl" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hidden md:block"
    aria-label="Previous products"
  >
    <FiChevronLeft className="text-gray-700 text-xl" />
  </button>
);

const NewProductsSlider = ({ products }) => {
  const sliderRef = useRef(null);

  console.log("Received products in NewProductsSlider:", products); // Log the products to verify

  const settings = {
    dots: false,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: Math.min(5, products.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, products.length),
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  // If no products available
  if (!products || products.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 bg-white rounded-lg shadow-sm relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">New Arrivals</h2>

      {/* Mobile arrows */}
      <div className="md:hidden flex justify-between w-full px-2 mb-4">
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Previous products"
        >
          <FiChevronLeft className="text-gray-700" />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Next products"
        >
          <FiChevronRight className="text-gray-700" />
        </button>
      </div>

      <div className="relative group">
        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <div key={product._id || product.id} className="px-2">
              <Card
                product={product} // Pass product directly to Card component
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewProductsSlider;
