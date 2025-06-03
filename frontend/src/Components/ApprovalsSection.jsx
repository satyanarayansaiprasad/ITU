import React from "react";
import { Link } from "react-router-dom";

const achievements = [
  {
    category: "National Level",
    title: "Gold Medal in National Taekwondo Championship 2023",
  },
  {
    category: "International Level",
    title: "Bronze Medal in Asian Taekwondo Championship 2022",
  },
  {
    category: "State Level",
    title: "Best Taekwondo Academy Award 2023",
  },
  {
    category: "Training Excellence",
    title: "Certified 100+ Black Belt Holders in 2023",
  },
];

const ApprovalsSection = () => {
  return (
    <div className="bg-white py-16 px-6 md:px-20 relative overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center md:items-start">
        {/* Left Section - Blue Box with Right Skew */}
        <div className="relative w-full md:w-1/2 mt-10">
  <div className="bg-[#193A6C] h-auto md:h-[400px] text-white p-6 md:p-12 rounded-lg z-10 transform md:skew-x-[-10deg] origin-right">
    {/* Heading */}
    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:my-4 transform md:-skew-x-[10deg]">
      Our Achievements
    </h2>

    {/* Paragraph */}
    <p className="text-gray-200 p-3 text-sm md:text-base leading-relaxed transform md:-skew-x-[10deg]">
      Our journey in Taekwondo is a testament to dedication, discipline, and excellence. Over the years, we have proudly secured top honors in national championships, represented our country on international platforms, and nurtured world-class athletes. From producing Kukkiwon-certified black belts to organizing award-winning tournaments, our achievements reflect our unwavering commitment to advancing Taekwondo as a sport and a way of life.
    </p>

    {/* Button */}
    <Link to="/gallery">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg mt-6 md:mt-4 transition transform md:-skew-x-[10deg]">
                VIEW OUR ACHIEVEMENTS
              </button>
            </Link>
  </div>
</div>

        {/* Right Section - Achievements List */}
        <div className="relative md:absolute lg:mr-10 md:top-10 md:right-10 w-full md:w-1/2 mt-8 md:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white shadow-lg lg:mt-10 rounded-lg p-6 border-l-4 border-[#193A6C] hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <p className="text-[#f49912] text-sm font-semibold">
                {achievement.category}
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {achievement.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsSection;