import React from 'react';
import { motion } from 'framer-motion';

const UnionAbout = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            Indian Taekwondo Union
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="mt-5 max-w-xl mx-auto text-xl text-gray-500"
          >
            Building a stronger India through Taekwondo
          </motion.p>
        </motion.div>

        {/* President Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-white shadow-xl rounded-lg overflow-hidden mb-16"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full md:h-full md:w-48 bg-blue-100 flex items-center justify-center">
                <img 
                  src="/sahadev.webp" 
                  alt="President" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">President</div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Mr. Sahadev Sahu</h2>
              <div className="mt-1 text-sm text-gray-500 font-medium">Indian Taekwondo Union</div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Message from Hon'ble President</h3>
                <p className="mt-2 text-gray-600">
                  A fit and healthy individual leads to an equally Healthy Society and Strong Nation. The INDIAN TAEKWONDO UNION has the mission to provide a platform to the Players, Instructors and Referees of National and International level.
                </p>
                <p className="mt-2 text-gray-600">
                  Sports are an Extremely Important Component for the overall development of our Nation. India, in last few years has made steady progress in the field of Sports. This tremendous potential needs to be shown at a global platform.
                </p>
                <p className="mt-2 text-gray-600">
                  We need to inculcate a strong spirit of participation in Taekwondo that enables players to demonstrate their true Potential.
                </p>
                <p className="mt-2 text-gray-600">
                  To Accomplish the above objectives INDIAN TAEKWONDO UNION has taken initiation to Indentify Talented Players at various levels.
                </p>
                <p className="mt-2 text-gray-600 font-medium">
                  Join us and support the INDIAN TAEKWONDO UNION initiative to transform India into a Global Sporting Power House in the upcoming years.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secretary General Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-white shadow-xl rounded-lg overflow-hidden mb-16"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full md:h-full md:w-80 bg-red-100 flex items-center justify-center">
                <img 
                  src="/mukesh.webp" 
                  alt="Secretary General" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-red-500 font-semibold">Secretary General</div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Master Mukesh Kumar Sahoo</h2>
              <div className="mt-1 text-sm text-gray-500 font-medium">5th Dan Black Belt, KUKKIWÓN South Korea</div>
              <div className="mt-1 text-sm text-gray-500 font-medium">International Instructor and Referee, KUKKIWON South Korea</div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Introduction of Hon'ble Secretary General</h3>
                <p className="mt-2 text-gray-600">
                  Master Mukesh Kumar Sahoo is the founder of Indian Taekwondo Union ITU. Member & Promoted by KUKKIWON World Taekwondo Headquarter, South Korea.
                </p>
                <p className="mt-2 text-gray-600">
                  Master Mukesh Kumar Sahoo has been awarded by KUKKIWON-World Taekwondo Headquarters, South Korea for the Development of Taekwondo Sport in INDIA, Indian Taekwondo Union has been awarded by KUKKIWON 2019 top Ranked Taekwondo Organization in India.
                </p>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Message</h3>
                <p className="mt-2 text-gray-600">
                  Our country, Republic India is famous for its friendly and co-operative attitude. I Appeal to People of India to put efforts to uplift the Taekwondo sport, and I welcome all the countries who want to participate in Internationals Taekwondo events in India for developments of Taekwondo sport.
                </p>
                <p className="mt-2 text-gray-600">
                  I Appeal to Every child, Boys, Girls and Young Generation to join Taekwondo sport through Indian Taekwondo Union - ITU.
                </p>
                <p className="mt-2 text-gray-600">
                  Our ambition is to make every child & youth learn this sport at every part of India. Taekwondo is an Art that fills up the spirit of Respect for Humanity, and most importantly to learn Self-Defence. Discipline make Taekwondo Unique. We want our children and young girls/boys could hold Our National Flag at International level/world events & Olympic Games which would be a great honor for Indian Taekwondo Union.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Chairman Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full md:h-full md:w-48 bg-yellow-100 flex items-center justify-center">
                <img 
                  src="/sumitghosh.webp" 
                  alt="Technical Chairman" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-yellow-500 font-semibold">Technical Chairman</div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Master Sumit Ghosh</h2>
              <div className="mt-1 text-sm text-gray-500 font-medium">6th Dan Black Belt KUKKIWON South Korea</div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Message from Hon'ble Technical Chairman</h3>
                <p className="mt-2 text-gray-600">
                  Greetings to all the Stakeholders of Indian Taekwondo Union.
                </p>
                <p className="mt-2 text-gray-600">
                  I have been practising Taekwondo for over 40 years. Over the years I have seen taekwondo becoming Sports from a hardcore Martial Art. In this Organization you all can learn taekwondo Martial Art. As a Technical Director of this Organization I will be available to all my students, for any kind of technical support.
                </p>
                <p className="mt-2 text-gray-600">
                  Many of my students have taken Taekwondo as their profession. Many sports have lost due to Non Professionalism, that is why I want to make Taekwondo much more professional than it is at present.
                </p>
                <p className="mt-2 text-gray-600">
                  Indian Taekwondo Union have organized few National Championship Offline and Online, which in result was a successful one. Hoping for the All Round Development of Indian Taekwondo Union in Near Future.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnionAbout;