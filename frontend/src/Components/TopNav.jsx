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
    <div className='w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] relative overflow-hidden'>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#00008B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-[#FF9933] rounded-full blur-2xl"></div>
      </div>
      
      <div className='relative flex overflow-hidden whitespace-nowrap py-1'>
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
          className='flex items-center'
          style={{ whiteSpace: 'nowrap' }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='flex items-center px-8 sm:px-12 md:px-16'
            >
              <span className='text-responsive-sm font-bold text-[#00008B] drop-shadow-sm'>
                {text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom border with Indian flag pattern */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
    </div>
  );
}

export default TopNav;
