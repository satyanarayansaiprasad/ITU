import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../config/api";
import { MapPin, User, Mail, Phone, Landmark, CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";

const Form = () => {
  const [formData, setFormData] = useState({
    state: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    role: "",
    dob: "",
    beltLevel: "",
    yearsOfExperience: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formType, setFormType] = useState(null); // 'acceleration' or 'player'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const endpoint = formType === 'acceleration' 
        ? 'accelarationform' 
        : 'playerregistration';
      
      await axios.post(API_ENDPOINTS.SUBMIT_FORM(endpoint), formData);
      setIsSubmitted(true);
      setFormData({
        state: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        district: "",
        role: "",
        dob: "",
        beltLevel: "",
        yearsOfExperience: ""
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("This email is already registered. Please use a different email.");
        } else if (error.response.status === 400) {
          setError("Please fill all required fields.");
        } else {
          setError("Submission failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    },
    exit: { scale: 0.8, opacity: 0 }
  };

  const iconMap = {
    state: <Landmark className="w-5 h-5 text-orange-600" />,
    name: <User className="w-5 h-5 text-green-700" />,
    email: <Mail className="w-5 h-5 text-sky-600" />,
    phone: <Phone className="w-5 h-5 text-orange-600" />,
    address: <MapPin className="w-5 h-5 text-green-700" />,
    dob: <Landmark className="w-5 h-5 text-blue-600" />,
    beltLevel: <Landmark className="w-5 h-5 text-purple-600" />,
    yearsOfExperience: <Landmark className="w-5 h-5 text-yellow-600" />
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormType(null);
  };

  const renderFormSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-2xl rounded-2xl p-8 space-y-8 border border-orange-200 text-center"
    >
      <h2 className="text-3xl font-bold text-orange-700 mb-2">
        Select Registration Type
      </h2>
      <p className="text-gray-600 mb-6">
        Choose the appropriate form for your needs
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setFormType('acceleration')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl shadow-md transition flex flex-col items-center"
        >
          <Landmark className="w-10 h-10 mb-2" />
          <span className="font-bold text-lg">Affiliation Form</span>
          <span className="text-sm font-medium mt-1">For general registration</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setFormType('player')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl shadow-md transition flex flex-col items-center"
        >
          <User className="w-10 h-10 mb-2" />
          <span className="font-bold text-lg">Player Registration</span>
          <span className="text-sm font-medium mt-1">For taekwondo athletes</span>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderFormFields = () => {
    const commonFields = [
      { name: "name", label: "Full Name", type: "text" },
      { name: "email", label: "Email Address", type: "email" },
      { name: "phone", label: "Phone Number", type: "tel" },
      { name: "state", label: "State", type: "text" },
      { name: "address", label: "Address", type: "textarea" }
    ];

    const affiliationSpecificFields = [
      { name: "district", label: "District", type: "text" }
    ];

    const playerSpecificFields = [
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "beltLevel", label: "Belt Level", type: "text" },
      { name: "yearsOfExperience", label: "Years of Experience", type: "number" }
    ];

    const allFields = formType === 'player' 
      ? [...commonFields, ...playerSpecificFields] 
      : [...commonFields, ...affiliationSpecificFields];

    return (
      <>
        <button
          onClick={() => setFormType(null)}
          className="flex items-center text-orange-600 hover:text-orange-800 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to form selection
        </button>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-200"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {allFields.map((field, i) => {
            const commonProps = {
              name: field.name,
              required: true,
              onChange: handleChange,
              value: formData[field.name],
              className: "w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500",
            };

            return (
              <motion.div 
                key={field.name} 
                custom={i} 
                variants={inputVariants} 
                className="relative"
              >
                <div className="absolute top-1/2 -translate-y-1/2 left-3">
                  {iconMap[field.name]}
                </div>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.label}
                    rows={3}
                    {...commonProps}
                  />
                ) : (
                  <input
                    placeholder={field.label}
                    type={field.type}
                    {...commonProps}
                  />
                )}
              </motion.div>
            );
          })}

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold py-3 rounded-xl shadow-md transition duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:from-orange-600 hover:to-green-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Submit ${formType === 'player' ? 'Player Registration' : 'Affiliation Form'}`
            )}
          </motion.button>
        </motion.form>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center px-4 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-10">
      <div className="w-full max-w-xl">
        {!isSubmitted ? (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-extrabold text-center text-orange-700 mb-2"
            >
              🇮🇳 Indian Taekwondo Union
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-green-700 font-medium mb-8"
            >
              {formType === 'player' 
                ? "Player Registration Form" 
                : formType === 'acceleration' 
                  ? "Affiliation Form" 
                  : "Join our community"}
            </motion.p>

            {formType ? renderFormFields() : renderFormSelection()}
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200 text-center"
            >
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Form Submitted Successfully!
              </h2>
              
              <div className="space-y-4 text-left bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">What happens next:</span>
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Your application has been received by the Indian Taekwondo Union</li>
                  <li>Administrators will review your details</li>
                  <li>You'll receive an email with confirmation</li>
                  <li>This may take 1-2 business days</li>
                </ul>
              </div>

              <p className="text-gray-600 mt-4">
                Check your email <span className="font-semibold">{formData.email}</span> for updates
              </p>

              <button
                onClick={resetForm}
                className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
              >
                Submit Another Form
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Form;