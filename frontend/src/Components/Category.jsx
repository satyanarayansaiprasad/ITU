import { useState } from "react";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  GiHighKick,
  GiPunchBlast,
  GiPodium,
  GiShield,
  GiBoxingGlove,
  GiSwordSlice,
 
} from "react-icons/gi";

const categories = [
  { name: "High Level Kicks", icon: <GiHighKick size={40} /> },
  { name: "Kyorugi", icon: <GiPunchBlast size={40} /> },
  { name: "Poomsae", icon: <GiPodium size={40} /> },
  { name: "Self-Defence", icon: <GiShield size={40} /> },
  { name: "Sparring", icon: <GiBoxingGlove size={40} /> },
  { name: "Weapons Training", icon: <GiSwordSlice size={40} /> },
 
];

const slides = [
  { text: "How to master Taekwondo kicks", image: "/c1.webp" },
  { text: "Best protective gear for training", image: "/c2.webp" },
  { text: "Rules of international competitions", image: "/c3.webp" },
  { text: "Belt ranking system explained", image: "/c1.webp" },
  { text: "Advanced self-defense techniques", image: "/c4.webp" },
  { text: "Taekwondo training drills", image: "/c3.webp" },
  { text: "Competition strategies", image: "/c4.webp" },
  { text: "Choosing the right sparring gear", image: "/c2.webp" },
  { text: "Taekwondo history & origins", image: "/c3.webp" },
  { text: "Mental discipline in martial arts", image: "/c5.webp" },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex flex-col h-auto lg:flex-row lg:min-h-auto justify-between p-6 gap-8">
      {/* Left Category Section */}
      <div className="w-full lg:w-1/3 p-6 lg:py-30 rounded-lg">
  <h2 className="text-2xl font-bold text-center text-black mb-6">
    Taekwondo Categories
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
    {categories.map((item, index) => (
      <div
        key={index}
        className={`flex flex-col items-center bg-white p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ${
          selectedCategory === item.name ? "bg-blue-200" : ""
        }`}
        onClick={() => setSelectedCategory(item.name)}
      >
        <span className="text-blue-500">{item.icon}</span>
        <p className="mt-2 text-sm sm:text-base font-semibold">
          {item.name}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* Right Carousel Section */}
      <div className="w-full lg:w-3/5 lg:py-30">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          showDots={false}
          arrows={false}
          containerClass="carousel-container"
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative p-2">
              <img
                src={slide.image}
                alt={slide.text}
                className="rounded-lg shadow-lg w-full h-[300px] sm:h-[400px] object-cover"
              />
              <p className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded-md text-sm sm:text-base">
                {slide.text}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
 