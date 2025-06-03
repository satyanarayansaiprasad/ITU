// import React from "react";

// const TopNav = () => {
//   return (
//     <header className="border-b border-gray-700 bg-[#011C4D] shadow-md">
//       <div className="mx-auto max-w-7xl py-3 px-2 text-center md:px-2 lg:px-2">
//         {/* Logo Section with Text */}
//         <div className="text-white flex flex-col gap-1 sm:gap-2 md:flex-row md:justify-center md:gap-4">
//           <p className="text-sm sm:text-sm  text-[#8699AE]">
//             An ISO Certified Taekwondo Organization !! 
//           </p>
//           <p className="text-sm sm:text-sm text-[#8699AE]">
//             KUKKIWON 2019 Top Ranked Taekwondo Organization !!
//           </p>
//           <p className="text-sm sm:text-sm text-[#8699AE]">
//             MEMBER & PROMOTED BY: KUKKIWON - WORLD TAEKWONDO HEADQUARTER (SOUTH KOREA) 
//           </p>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopNav;





import { motion } from 'framer-motion';
import React from 'react';

function TopNav() {
  const text = " An ISO Certified Taekwondo Organization  •••  KUKKIWON 2019 Top Ranked Taekwondo Organization  •••  MEMBER & PROMOTED BY: KUKKIWON - WORLD TAEKWONDO HEADQUARTER (SOUTH KOREA)  ";

  return (
    <div 
      data-scroll 
      data-scroll-section 
      data-scroll-speed="4" 
      className='w-full max-w-full md:mt-8 mt-4   bg-gradient-to-r from-[#FF9933] via-white to-[#138808]'
    >
      <div className='flex overflow-hidden whitespace-nowrap px-4 sm:px-6'>
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 400 }}
          className='flex'
          style={{ whiteSpace: 'nowrap' }}
        >
          {[...Array(20)].map((_, i) => (
            <h1
              key={i}
              className='text-xs sm:text-sm md:text-lg lg:text-lg leading-none font-semibold py-4 px-4 sm:px-6 text-[#00008B]' // Dark Blue for Ashoka Chakra color
            >
              {text}
            </h1>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default TopNav;
