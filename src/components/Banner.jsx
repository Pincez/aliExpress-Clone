import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import banner_kids from "../assets/Frontend_Assets/banner_kids.png";
import banner_men from "../assets/Frontend_Assets/banner_mens.png";
import banner_women from "../assets/Frontend_Assets/banner_women.png";

const Banner = () => {
  const settings = {
    dots: true, // Enable dots for navigation
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides visible
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Enable auto-scroll
    autoplaySpeed: 3000, // Auto-scroll interval
  };

  const images = [
    { id: 1, image: banner_kids },
    { id: 2, image: banner_men },
    { id: 3, image: banner_women },
  ];

  return (
    <div className="banner w-full overflow-hidden">
      <Slider {...settings}>
        {images.map((item, id) => (
          <div key={id} className="relative">
            <img
              src={item.image}
              alt={`Slide ${id + 1}`}
              className="w-full h-auto object-cover" // Ensure responsive images
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
