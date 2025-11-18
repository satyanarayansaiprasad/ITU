import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

const CompetitionRegistration = () => {
  const [formData, setFormData] = useState({
    competitionName: '',
    date: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement competition registration
    alert('Competition registration feature coming soon!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-600" size={28} />
          Competition Registration
        </h2>
        <p className="text-gray-600 mt-2">Register your players for upcoming competitions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Name *
            </label>
            <input
              type="text"
              value={formData.competitionName}
              onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This feature is under development. Competition registration functionality will be available soon.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default CompetitionRegistration;

