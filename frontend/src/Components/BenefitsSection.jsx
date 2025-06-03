import { Activity, Book, Medal, Play, Shield, Users } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const BenefitsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-12 flex flex-col lg:flex-row items-start justify-between px-4 md:px-12 lg:px-20">
      {/* Left Side Content - 40% width */}
      <div className="w-full lg:w-2/5 text-left">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md font-semibold text-sm md:text-base">
          SERVICES
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
          What We Offer in Taekwondo
        </h2>
        <p className="text-gray-600 mt-4 text-base md:text-lg leading-relaxed">
          At ITU, we provide a wide range of Taekwondo services to help you achieve your goals, whether you're a beginner or an advanced practitioner. From training programs to championship events, we are dedicated to promoting Taekwondo at all levels.
        </p>
        {/* Video Button - Now with reduced width */}
        <a
          href="https://youtube.com/@indiantaekwondounion6210?si=l3n62Z7QLTqYWR6m"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition text-lg w-fit"
        >
          <Play className="w-6 h-6 md:w-7 md:h-7" />
          <span>SUBSCRIBE TO OUR CHANNEL</span>
        </a>
      </div>

      {/* Right Side Benefit Boxes - 60% width */}
      <div className="w-full lg:w-3/5 flex flex-wrap justify-between mt-8 lg:mt-0">
        {[
          {
            icon: <Activity size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Taekwondo Practice",
            description: "Regular training sessions for all levels, from beginners to advanced practitioners.",
          },
          {
            icon: <Shield size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Kukkiwon Black Belt",
            description: "Certification programs to achieve internationally recognized Kukkiwon black belts.",
          },
          {
            icon: <Users size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Self Defense",
            description: "Specialized self-defense training programs for individuals and groups.",
          },
          {
            icon: <Medal size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Organizing State Championships",
            description: "Hosting state-level Taekwondo championships to promote talent and competition.",
          },
          {
            icon: <Medal size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Organizing National Championships",
            description: "National-level events to bring together the best Taekwondo athletes from across the country.",
          },
          {
            icon: <Book size={24} className="text-green-500 w-10 h-10 md:w-12 md:h-12" />,
            title: "Referee Seminars",
            description: "Training and certification programs for aspiring Taekwondo referees.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-5 bg-white rounded-lg shadow-md w-full sm:w-[48%] lg:w-[48%] mb-4"
          >
            {item.icon}
            <div>
              <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-snug">{item.description}</p>
            </div>
          </div>
        ))}

        {/* Contact Box - Now navigates to /contact */}
        <div className="mt-6 bg-white p-5 rounded-md shadow-md text-center w-full">
          <p className="text-gray-800 font-semibold text-base md:text-lg">
            Connect with us for more information or to join our programs. We are here to help you achieve your Taekwondo goals.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="text-blue-600 font-bold underline text-base md:text-lg mt-3 inline-block cursor-pointer"
          >
            Click here to connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;