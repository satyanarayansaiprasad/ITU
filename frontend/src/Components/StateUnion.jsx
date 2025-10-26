import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StateUnion = () => {
  const navigate = useNavigate();
  
  const states = [
    { 
      id: 1, 
      name: 'Maharashtra', 
      secretary: 'Shri Rajesh Verma', 
      districts: 36, 
      unionName: 'Maharashtra Taekwondo Union',
      established: 1995,
      active: true
    },
    { 
      id: 2, 
      name: 'Delhi', 
      secretary: 'Shri Vikram Singh', 
      districts: 11, 
      unionName: 'Delhi Taekwondo Union',
      established: 1992,
      active: true
    },
    { 
      id: 3, 
      name: 'Karnataka', 
      secretary: 'Shri Arjun Reddy', 
      districts: 30, 
      unionName: 'Karnataka Taekwondo Union',
      established: 1998,
      active: true
    },
    { 
      id: 4, 
      name: 'Tamil Nadu', 
      secretary: 'Shri Karthik Iyer',
      districts: 38, 
      unionName: 'Tamil Nadu Taekwondo Union',
      established: 1996,
      active: true
    },
    { 
      id: 5, 
      name: 'Kerala', 
      secretary: 'Shri Ajith Nair', 
      districts: 14, 
      unionName: 'Kerala Taekwondo Union',
      established: 1994,
      active: true
    },
    { 
      id: 6, 
      name: 'Gujarat', 
      secretary: 'Shri Jayesh Patel', 
      districts: 33, 
      unionName: 'Gujarat Taekwondo Union',
      established: 2001,
      active: true
    },
    { 
      id: 7, 
      name: 'Rajasthan', 
      districts: 50,
      active: false,
    },
    { 
      id: 8, 
      name: 'Punjab', 
      districts: 23,
      active: false,
    },
    { 
      id: 9, 
      name: 'West Bengal', 
      districts: 23,
      active: false,
    },
    {
      id: 10,
      name: 'Uttar Pradesh',
      districts: 75,
      active: false,
    },
    {
      id: 11,
      name: 'Bihar',
      districts: 38,
      active: false,
    },
    {
      id: 12,
      name: 'Madhya Pradesh',
      districts: 55,
      active: false,
    },
    {
      id: 13,
      name: 'Odisha',
      districts: 30,
      active: false,
    },
    {
      id: 14,
      name: 'Assam',
      districts: 35,
      active: false,
    },
    {
      id: 15,
      name: 'Andhra Pradesh',
      districts: 26,
      active: false,
    },
    {
      id: 16,
      name: 'Telangana',
      districts: 33,
      active: false,
    },
    {
      id: 17,
      name: 'Chhattisgarh',
      districts: 28,
      active: false,
    },
    {
      id: 18,
      name: 'Jharkhand',
      districts: 24,
      active: false,
    },
    {
      id: 19,
      name: 'Haryana',
      districts: 22,
      active: false,
    },
    {
      id: 20,
      name: 'Uttarakhand',
      districts: 13,
      active: false,
    },
    {
      id: 21,
      name: 'Himachal Pradesh',
      districts: 12,
      active: false,
    },
    {
      id: 22,
      name: 'Tripura',
      districts: 8,
      active: false,
    },
    {
      id: 23,
      name: 'Manipur',
      districts: 16,
      active: false,
    },
    {
      id: 24,
      name: 'Meghalaya',
      districts: 12,
      active: false,
    },
    {
      id: 25,
      name: 'Mizoram',
      districts: 11,
      active: false,
    },
    {
      id: 26,
      name: 'Nagaland',
      districts: 16,
      active: false,
    },
    {
      id: 27,
      name: 'Arunachal Pradesh',
      districts: 26,
      active: false,
    },
    {
      id: 28,
      name: 'Sikkim',
      districts: 6,
      active: false,
    },
    {
      id: 29,
      name: 'Goa',
      districts: 2,
      active: false,
    },
    {
      id: 30,
      name: 'Jammu and Kashmir',
      districts: 20,
      active: false,
    },
    {
      id: 31,
      name: 'Ladakh',
      districts: 2,
      active: false,
    },
    {
      id: 32,
      name: 'Puducherry',
      districts: 4,
      active: false,
    },
    {
      id: 33,
      name: 'Andaman and Nicobar',
      districts: 3,
      active: false,
    },
  ];

  const activeStates = states.filter(state => state.active);
  const upcomingStates = states.filter(state => !state.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-extrabold text-gray-800 sm:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            State <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Unions</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Indian Taekwondo Union - State-wise Network
          </motion.p>
        </div>

        {/* Active States Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">📋</span>
                Active State Unions ({activeStates.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Union Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Secretary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Districts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeStates.map((state, index) => (
                    <motion.tr
                      key={state.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-orange-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/state-union/${state.name}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">{state.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{state.unionName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{state.secretary}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {state.districts}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Upcoming States Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="col-span-full bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold text-white">
              Upcoming State Unions ({upcomingStates.length} States)
            </h2>
          </div>
          {upcomingStates.map((state, index) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 p-4 text-center group cursor-pointer"
              onClick={() => navigate(`/state-union/${state.name}`)}
            >
              <div className="text-gray-600 font-medium group-hover:text-orange-600 transition-colors">
                {state.name}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {state.districts} Districts
              </div>
              <div className="mt-2">
                <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                  Coming Soon
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateUnion;
