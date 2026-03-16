import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Award, User, Phone, MapPin, Calendar, CreditCard, Building2, Timer } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    playerName: '',
    fatherName: '',
    academyName: '',
    address: '',
    phoneNumber: '',
    dob: '',
    beltTest: '',
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    isActive: true,
    testDate: '29th March, 2026 (Sunday)',
    time: '9:30 Am to 1:30 Pm',
    venue: 'GM-49, 1st Floor, Pratima Bhawan, Near BSNL Chowk, Chhend, Rourkela.'
  });

  const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') return 'http://localhost:3001';
    const envUrl = import.meta.env.VITE_API_BASE_URL || 'https://itu-r1qa.onrender.com';
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  };
  const API_BASE_URL = getBaseUrl();

  const beltOptions = [
    { label: "1. WHITE TO - YELLOW 600", value: "WHITE TO YELLOW - 600" },
    { label: "2. YELLOW TO GREEN - 700", value: "YELLOW TO GREEN - 700" },
    { label: "3. GREEN TO GREEN ONE - 800", value: "GREEN TO GREEN ONE - 800" },
    { label: "4. GREEN ONE TO BLUE - 900", value: "GREEN ONE TO BLUE - 900" },
    { label: "5. BLUE TO BLUE ONE - 1000", value: "BLUE TO BLUE ONE - 1000" },
    { label: "6. BLUE ONE TO RED - 1100", value: "BLUE ONE TO RED - 1100" },
    { label: "7. RED TO RED ONE - 1200", value: "RED TO RED ONE - 1200" }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/taekwondo-test/settings`);
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/taekwondo-test/submit`, formData);
      if (response.data.success) {
        toast.success('Registration submitted successfully!');
        setFormData({
          playerName: '',
          fatherName: '',
          academyName: '',
          address: '',
          phoneNumber: '',
          dob: '',
          beltTest: '',
          transactionId: ''
        });
      }
    } catch (error) {
      console.error('Submission error details:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to connect to server';
      toast.error(`Registration Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!settings.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <Award className="mx-auto text-blue-600 mb-6" size={64} />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Closed</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The registration for the Taekwondo Colour Belt Promotion Test is currently disabled or has reached its deadline.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">Please contact the ITU administration for more information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 py-10 px-8 text-center text-white relative">
          <Award className="absolute top-4 right-4 opacity-20" size={120} />
          <h1 className="text-3xl font-extrabold mb-4 leading-tight">Taekwondo Colour Belt Promotion Test</h1>
          <div className="flex flex-col items-center justify-center gap-2 text-blue-100">
            <div className="flex items-center gap-2 text-lg">
              <Calendar size={20} />
              <span>{settings.testDate}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Timer size={20} />
              <span>{settings.time}</span>
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <MapPin size={20} className="flex-shrink-0" />
              <span>{settings.venue}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="text-blue-500" /> Player Name
                </label>
                <input
                  type="text"
                  name="playerName"
                  required
                  value={formData.playerName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="text-blue-500" /> Father's Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Building2 size={16} className="text-blue-500" /> Academy Name
                </label>
                <input
                  type="text"
                  name="academyName"
                  required
                  value={formData.academyName}
                  onChange={handleChange}
                  placeholder="Enter academy name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="text-blue-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="text-blue-500" /> Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="text-blue-500" /> Address
                </label>
                <textarea
                  name="address"
                  required
                  rows="1"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Award size={16} className="text-blue-500" /> Belt Test Level
                </label>
                <select
                  name="beltTest"
                  required
                  value={formData.beltTest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                >
                  <option value="">Select Belt Test</option>
                  {beltOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard className="text-green-600" /> 
              Payment Information
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
              <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <img 
                  src="/qr_code.jpeg" 
                  alt="Payment QR Code" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=Payment+QR";
                  }}
                />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Please scan the QR code above to complete your payment. Once the payment is successful, enter the <strong>Transaction ID</strong> below to complete your registration.
                </p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    required
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white transition-all shadow-lg ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
