import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import banner_kids from "../assets/Frontend_Assets/banner_kids.png";
import banner_men from "../assets/Frontend_Assets/banner_mens.png";
import banner_women from "../assets/Frontend_Assets/banner_women.png";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    { id: 1, image: banner_kids },
    { id: 2, image: banner_men },
    { id: 3, image: banner_women },
  ];

  return (
    <div className="banner w-full "> {/* Match sidebar height */}
      <Slider {...settings} className="w-full h-full">
        {images.map((item, id) => (
          <div key={id} className="w-full h-full flex justify-center items-center">
            <img
              src={item.image}
              alt={`Slide ${id + 1}`}
              className="w-full h-full object-cover" // Fills the space properly
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
