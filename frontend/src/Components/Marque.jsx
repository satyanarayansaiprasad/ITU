import { motion } from "framer-motion";
import React from "react";

function Marque() {
  const brandImages = [
  
    "/spel.png",
    "/KUKKIWON LOGO.png",
    "/taeko.png",
    "/nitiayog.png",
    "/FIT INDIA.png",
    "/SKILL INDIA.png",
    "/G20.png",
    "/KCC.png",
  ];

  return (
    <div 
      data-scroll 
      data-scroll-section 
      data-scroll-speed=".1" 
      className="w-full max-w-full py-2 bg-[#ffffff]"
    >
      <div className=" py-2   flex overflow-hidden whitespace-nowrap  sm:px-6">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 120 }}
          className="flex items-center"
        >
          {Array(10).fill(brandImages).flat().map((src, index) => (
            <img key={index} src={src} alt={`${index + 1}`} className="h-18   md:h-20 mx-15" />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Marque;















