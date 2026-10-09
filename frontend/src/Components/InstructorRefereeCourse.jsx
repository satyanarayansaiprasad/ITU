import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  CreditCard, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  Check, 
  HelpCircle, 
  Download, 
  Printer, 
  ExternalLink,
  Info,
  ArrowRight,
  Shield,
  Building,
  UserCheck
} from 'lucide-react';
import { indianStatesAndDistricts } from '../data/indianStatesDistricts';

const BELT_DAN_LEVELS = [
  '1st Dan Black Belt',
  '2nd Dan Black Belt',
  '3rd Dan Black Belt',
  '4th Dan Black Belt',
  '5th Dan Black Belt',
  '6th Dan Black Belt',
  '7th Dan Black Belt',
  '8th Dan Black Belt',
  '9th Dan Black Belt'
];

const DESIGNATION_OPTIONS = [
  'Instructor',
  'Coach',
  'Referee',
  'Athlete',
  'Other'
];

export default function InstructorRefereeCourse() {
  const formRef = useRef(null);
  const pricingRef = useRef(null);

  // Registration step: 'form' | 'review' | 'payment' | 'success'
  const [step, setStep] = useState('form');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    fatherMotherName: '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    mobileNumber: '',
    email: '',
    address: '',
    state: '',
    pinCode: '',
    presentDan: '1st Dan Black Belt',
    danCertificateNo: '',
    dateOfDanCertification: '',
    isAwaitingDanCertificate: false,
    academyName: '',
    yearsExperience: '',
    currentDesignation: 'Instructor',
    courseOption: 'instructor', // 'instructor' | 'referee' | 'both'
    singleCourseType: 'National Instructor Training Course', // if courseOption === 'instructor' or 'referee'
    previousCourseAttended: false,
    previousCourseDetails: '',
    previousGrade: '',
    declaration: false,
    transactionId: ''
  });

  // Files
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);

  // Errors & Loading
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);
  const [viewBrochureModal, setViewBrochureModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  const states = Object.keys(indianStatesAndDistricts);

  // Calculate Fee
  const getFeeAmount = () => {
    return formData.courseOption === 'both' ? 5000 : 3000;
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle Option Select from Pricing Cards
  const handleSelectPricingOption = (option, singleType = 'National Instructor Training Course') => {
    setFormData(prev => ({
      ...prev,
      courseOption: option,
      singleCourseType: option === 'instructor' ? 'National Instructor Training Course' : option === 'referee' ? 'National Referee Training Course' : prev.singleCourseType
    }));
    scrollToForm();
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Passport photo must be smaller than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (errors.photo) setErrors(prev => ({ ...prev, photo: null }));
  };

  // Handle Payment Proof File Upload
  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Payment receipt image must be smaller than 5MB');
      return;
    }

    setPaymentProofFile(file);
    setPaymentProofPreview(URL.createObjectURL(file));
  };

  // Calculate Age helper
  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Validate Step 1 Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.fatherMotherName.trim()) newErrors.fatherMotherName = "Father's/Mother's Name is required";
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const age = calculateAge(formData.dob);
      if (age < 17) {
        newErrors.dob = 'Applicant must be at least 17 years old to participate';
      }
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) newErrors.address = 'Full address is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pinCode.trim() || formData.pinCode.trim().length < 6) newErrors.pinCode = 'Enter a valid 6-digit PIN code';

    if (!formData.presentDan) newErrors.presentDan = 'Present Dan/Degree is required';
    
    if (!formData.isAwaitingDanCertificate && !formData.danCertificateNo.trim()) {
      newErrors.danCertificateNo = 'Dan Certificate Number is required unless awaiting certificate';
    }

    if (!formData.academyName.trim()) newErrors.academyName = 'Academy/Dojang Name is required';
    if (!formData.yearsExperience || Number(formData.yearsExperience) < 0) newErrors.yearsExperience = 'Enter valid years of experience';
    if (!formData.currentDesignation) newErrors.currentDesignation = 'Current designation is required';

    if (!photoFile) {
      newErrors.photo = 'Passport size photograph is required';
    }

    if (!formData.declaration) {
      newErrors.declaration = 'You must accept the ITU declaration rules to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Proceed from Form to Review
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('review');
      window.scrollTo({ top: formRef.current.offsetTop - 80, behavior: 'smooth' });
    } else {
      toast.error('Please fix the highlighted errors before proceeding');
    }
  };

  // Submit Registration to Backend
  const handleFinalSubmission = async () => {
    if (!formData.transactionId.trim()) {
      toast.error('Please enter the Transaction Reference ID / UTR number');
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Calculate total fee
      const fee = getFeeAmount();
      submitData.append('feeAmount', fee);

      if (photoFile) {
        submitData.append('photo', photoFile);
      }
      if (paymentProofFile) {
        submitData.append('paymentProof', paymentProofFile);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/instructor-referee-course/submit`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSubmittedData(response.data.data);
        setStep('success');
        toast.success('Registration and payment details submitted successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to complete registration';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Print Receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0B2545] via-[#0E2A4E] to-[#13315C] text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container-responsive relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Column: Hero Content */}
            <div className="lg:w-7/12 text-center lg:text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-semibold tracking-wide">
                <Sparkles size={16} />
                Official ITU Event 2026
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
                National Instructor & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Referee Training Course</span> 2026
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Empowering Martial Arts Leadership. Promoted by <strong className="text-white">Indian Taekwondo Union (ITU)</strong> and organized by <strong className="text-white">Odisha Taekwondo Union</strong>. Join national-level master instructors and international-grade referees.
              </p>

              {/* Event Quick Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="p-2.5 bg-orange-500/20 rounded-lg text-orange-400">
                    <Calendar size={22} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400 font-medium">Dates & Schedule</div>
                    <div className="text-sm font-bold text-white">30, 31 Oct & 1 Nov 2026</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="p-2.5 bg-orange-500/20 rounded-lg text-orange-400">
                    <MapPin size={22} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400 font-medium">Event Venue</div>
                    <div className="text-sm font-bold text-white">Madhusudan Bhawan, Rourkela</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-base shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <span>Register Now</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={scrollToPricing}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold text-base transition-all flex items-center gap-2 backdrop-blur-md"
                >
                  <BookOpen size={18} />
                  <span>View Pricing & Options</span>
                </button>

                <button
                  onClick={() => setViewBrochureModal(true)}
                  className="px-4 py-4 text-orange-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5 underline underline-offset-4"
                >
                  <Download size={16} />
                  <span>View Official Flyer</span>
                </button>
              </div>

            </div>

            {/* Right Column: Event Emblem / Badge Card */}
            <div className="lg:w-5/12 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <img src="/ITU LOGO.png" alt="ITU Logo" className="h-20 w-20 rounded-full border-2 border-orange-400 shadow-md object-cover" />
                  <img src="/KUKKIWON LOGO.png" alt="Kukkiwon Logo" className="h-16 w-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Indian Taekwondo Union</h3>
                <p className="text-xs text-orange-300 font-semibold uppercase tracking-wider mb-6">National Accreditation & Certification Course</p>

                <div className="space-y-3 text-left border-t border-white/10 pt-4 text-sm text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Eligibility:</span>
                    <span className="font-bold text-white">17+ Yrs | Kukkiwon 1st Dan+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reporting:</span>
                    <span className="font-bold text-white">30th Oct 2026 @ 8:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Award:</span>
                    <span className="font-bold text-amber-300">Certificate & ID Card</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-orange-500/20 rounded-xl border border-orange-400/30 text-center">
                  <span className="text-xs text-slate-300 block">Course Fee Starting From</span>
                  <span className="text-2xl font-extrabold text-white">₹3,000 <span className="text-xs font-normal text-slate-300">only</span></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: COURSE OVERVIEW & DETAILS CARDS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Course Overview & Important Schedule</h2>
            <p className="text-slate-600">Official information authorized by Indian Taekwondo Union (ITU) & Odisha Taekwondo Union.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Organizer & Leadership */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Building size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Promoted & Organized By</h3>
              <p className="text-sm text-slate-600 mb-2"><strong>Promoted by:</strong> Indian Taekwondo Union (ITU)</p>
              <p className="text-sm text-slate-600"><strong>Organized by:</strong> Odisha Taekwondo Union</p>
            </div>

            {/* Card 2: Dates & Reporting */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dates & Reporting Time</h3>
              <p className="text-sm text-slate-600 mb-1"><strong>Course Dates:</strong> 30th, 31st Oct & 1st Nov 2026</p>
              <p className="text-sm text-slate-600 mb-1"><strong>Reporting Time:</strong> 30th Oct 2026 at 8:00 AM</p>
              <p className="text-sm text-slate-600"><strong>Opening Ceremony:</strong> 30th Oct 2026 at 9:00 AM</p>
            </div>

            {/* Card 3: Venue Address */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Official Venue</h3>
              <p className="text-sm text-slate-700 font-medium">Madhusudan Bhawan</p>
              <p className="text-sm text-slate-600">Chhend, Rourkela, Odisha - 769015</p>
            </div>

            {/* Card 4: Eligibility Criteria */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <UserCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Eligibility Criteria</h3>
              <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Minimum 17 years of age or above.</li>
                <li>Kukkiwon 1st Dan Black Belt or above.</li>
                <li>Candidates awaiting Kukkiwon Dan Certificate (appeared for exam) are also eligible to participate.</li>
              </ul>
            </div>

            {/* Card 5: Awards & Benefits */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Awards Presentation</h3>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Official ITU Training Certificate</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Authorized National Identity Card</li>
              </ul>
            </div>

            {/* Card 6: Helpdesk Contacts */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contact & Queries</h3>
              <p className="text-sm text-slate-600 mb-1"><strong>Mobile:</strong> 9583921122 / 9438849523</p>
              <p className="text-sm text-slate-600 mb-1"><strong>Email:</strong> indianteakwondounion@gmail.com</p>
              <p className="text-sm text-slate-600"><strong>Website:</strong> www.taekwondounion.com</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: COURSE SELECTION & PRICING CARDS
      ───────────────────────────────────────────────────────────── */}
      <section ref={pricingRef} className="py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Updated Registration Fees</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-2">Select Your Course Package</h2>
            <p className="text-slate-600">Choose between a single specialization (Instructor OR Referee) or register for both courses at a discounted rate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Option A: Single Course (₹3,000) */}
            <div 
              onClick={() => handleSelectPricingOption('instructor', 'National Instructor Training Course')}
              className={`bg-white rounded-3xl p-8 border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                formData.courseOption === 'instructor' || formData.courseOption === 'referee'
                  ? 'border-blue-600 shadow-xl ring-4 ring-blue-500/10'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Option A</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">Single Course</h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.courseOption === 'instructor' || formData.courseOption === 'referee' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {(formData.courseOption === 'instructor' || formData.courseOption === 'referee') && <Check size={14} />}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">₹3,000</span>
                  <span className="text-slate-500 text-sm"> / participant</span>
                </div>

                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Register for either the National Instructor Training Course <strong>OR</strong> the National Referee Training Course.
                </p>

                {/* Sub-selector for Instructor vs Referee */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Choose Course Type:</label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="courseSelectOption"
                      checked={formData.courseOption === 'instructor'}
                      onChange={() => handleSelectPricingOption('instructor')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">National Instructor Training Course</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="courseSelectOption"
                      checked={formData.courseOption === 'referee'}
                      onChange={() => handleSelectPricingOption('referee')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">National Referee Training Course</span>
                  </label>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-600 mb-6">
                  <li className="flex items-center gap-2"><Check size={16} className="text-blue-600" /> 3-Day Specialization Training</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-blue-600" /> Course Specific Certification</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-blue-600" /> Authorized Identity Card</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPricingOption(formData.courseOption === 'referee' ? 'referee' : 'instructor')}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition-colors"
              >
                Select Single Course (₹3,000)
              </button>
            </div>

            {/* Option B: Both Courses (₹5,000) */}
            <div 
              onClick={() => handleSelectPricingOption('both')}
              className={`bg-white rounded-3xl p-8 border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                formData.courseOption === 'both'
                  ? 'border-orange-500 shadow-xl ring-4 ring-orange-500/10'
                  : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                Best Value - Save ₹1,000
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">Option B</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">Both Courses</h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.courseOption === 'both' ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                  }`}>
                    {formData.courseOption === 'both' && <Check size={14} />}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">₹5,000</span>
                  <span className="text-slate-500 text-sm"> / participant (Combined)</span>
                </div>

                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Dual Accreditation: Register for both <strong>National Instructor Course</strong> and <strong>National Referee Course</strong> together.
                </p>

                <div className="space-y-2 bg-orange-50/60 p-4 rounded-xl border border-orange-200 mb-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-900">
                    <CheckCircle size={18} className="text-orange-600" />
                    <span>Includes National Instructor Course</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-900">
                    <CheckCircle size={18} className="text-orange-600" />
                    <span>Includes National Referee Course</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-600 mb-6">
                  <li className="flex items-center gap-2"><Check size={16} className="text-orange-600" /> Full 3-Day Comprehensive Training</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-orange-600" /> Dual Certification (Instructor & Referee)</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-orange-600" /> Authorized Dual Identity Card</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPricingOption('both')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-center transition-all shadow-md"
              >
                Select Both Courses (₹5,000)
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: ELIGIBILITY & IMPORTANT INSTRUCTIONS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Important Rules & Checklist */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Important Instructions for Participants</h2>
              <p className="text-slate-600">Please carefully review the following mandatory reporting rules authorized in the official event circular:</p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg flex-shrink-0 mt-0.5">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Accommodation Self-Arranged</h4>
                    <p className="text-sm text-slate-600">Participants must arrange their own accommodation for the duration of the 3-day course in Rourkela.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-lg flex-shrink-0 mt-0.5">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Food & Meals</h4>
                    <p className="text-sm text-slate-600">Participants must arrange their own food during the training programme.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 mt-0.5">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Compulsory Uniform</h4>
                    <p className="text-sm text-slate-600">Standard Dobok (Taekwondo uniform) is compulsory throughout the practical and theoretical sessions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg flex-shrink-0 mt-0.5">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Stamp-Size Photographs</h4>
                    <p className="text-sm text-slate-600">Participants must submit two (2) physical copies of recent stamp-size colour photographs at the time of reporting at Madhusudan Bhawan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Expandable FAQs */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  {
                    q: "Can candidates awaiting their Kukkiwon Dan Certificate participate?",
                    a: "Yes! Candidates who have already appeared for the Kukkiwon Dan Examination and are awaiting their Dan Certificate are eligible to participate. Please check the 'Awaiting Dan Certificate' checkbox in the registration form."
                  },
                  {
                    q: "What is the minimum age requirement?",
                    a: "Candidates must be 17 years of age or above at the start of the course (30th October 2026)."
                  },
                  {
                    q: "What is the difference between Option A and Option B?",
                    a: "Option A (₹3,000) allows you to select ONE course (either National Instructor Course or National Referee Course). Option B (₹5,000) registers you for BOTH courses together at a discounted fee."
                  },
                  {
                    q: "What awards will participants receive?",
                    a: "All successful candidates will receive an Official Training Certificate and an Authorized Identity Card issued by the Indian Taekwondo Union (ITU)."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full text-left p-4 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openFaq === index && (
                      <div className="p-4 bg-white border-t border-slate-200 text-sm text-slate-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: REGISTRATION FORM & WORKFLOW
      ───────────────────────────────────────────────────────────── */}
      <section ref={formRef} className="py-16 bg-slate-50">
        <div className="container-responsive max-w-4xl mx-auto">
          
          {/* Step Stepper Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Course Application Form</h2>
            <p className="text-slate-600 text-sm">Complete all details to register for the National Instructor & Referee Course 2026.</p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                step === 'form' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <span>1. Form Fill</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                step === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <span>2. Review Details</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                step === 'payment' || step === 'success' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <span>3. Payment & Confirmation</span>
              </div>
            </div>
          </div>

          {/* STEP 1: FORM INPUTS */}
          {step === 'form' && (
            <form onSubmit={handleProceedToReview} className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200 space-y-8">
              
              {/* Selected Course summary banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Selected Registration Option:</div>
                  <div className="text-lg font-bold text-slate-900">
                    {formData.courseOption === 'both' ? 'Both Instructor & Referee Training Courses' : (formData.singleCourseType || 'National Instructor Training Course')}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-slate-500">Total Payable Fee</div>
                  <div className="text-2xl font-extrabold text-blue-700">₹{getFeeAmount().toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* 1. PERSONAL DETAILS */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2 text-blue-700">
                  <User size={20} />
                  1. Personal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name of Applicant *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Father's / Mother's Name *</label>
                    <input
                      type="text"
                      name="fatherMotherName"
                      value={formData.fatherMotherName}
                      onChange={handleChange}
                      placeholder="Enter parent's name"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.fatherMotherName ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.fatherMotherName && <p className="text-xs text-red-500 mt-1">{errors.fatherMotherName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth * (Age 17+ required)</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.dob ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.mobileNumber ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Residential Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House No, Street, Landmark, City"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.address ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.state ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none bg-white`}
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="6-digit PIN"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.pinCode ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.pinCode && <p className="text-xs text-red-500 mt-1">{errors.pinCode}</p>}
                  </div>
                </div>

                {/* Passport Photo Upload */}
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Passport Size Photograph * (Max 5MB)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="passport-photo-input"
                    />
                    <label
                      htmlFor="passport-photo-input"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer border border-slate-300 flex items-center gap-2 transition-colors"
                    >
                      <Upload size={18} />
                      Choose Photo
                    </label>
                    {photoPreview && (
                      <div className="flex items-center gap-2">
                        <img src={photoPreview} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-slate-300" />
                        <span className="text-xs text-emerald-600 font-semibold">Photo Attached</span>
                      </div>
                    )}
                  </div>
                  {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
                </div>
              </div>

              {/* 2. TAEKWONDO DETAILS */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2 text-blue-700">
                  <Award size={20} />
                  2. Taekwondo Qualifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Present Dan / Degree *</label>
                    <select
                      name="presentDan"
                      value={formData.presentDan}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                    >
                      {BELT_DAN_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Dan Certificate Number</label>
                    <input
                      type="text"
                      name="danCertificateNo"
                      disabled={formData.isAwaitingDanCertificate}
                      value={formData.danCertificateNo}
                      onChange={handleChange}
                      placeholder={formData.isAwaitingDanCertificate ? 'Awaiting Dan Certificate' : 'Enter Dan Cert No.'}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.danCertificateNo ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400`}
                    />
                    {errors.danCertificateNo && <p className="text-xs text-red-500 mt-1">{errors.danCertificateNo}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="isAwaitingDanCertificate"
                    name="isAwaitingDanCertificate"
                    checked={formData.isAwaitingDanCertificate}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                  />
                  <label htmlFor="isAwaitingDanCertificate" className="text-xs sm:text-sm text-amber-900 font-medium cursor-pointer">
                    I have appeared for the Kukkiwon Dan Examination and am currently awaiting my Dan Certificate.
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Dan Certification</label>
                    <input
                      type="date"
                      name="dateOfDanCertification"
                      value={formData.dateOfDanCertification}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name of Academy / Dojang *</label>
                    <input
                      type="text"
                      name="academyName"
                      value={formData.academyName}
                      onChange={handleChange}
                      placeholder="Dojang / Association Name"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.academyName ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.academyName && <p className="text-xs text-red-500 mt-1">{errors.academyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Years of Experience *</label>
                    <input
                      type="number"
                      min="0"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      placeholder="Years"
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.yearsExperience ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    {errors.yearsExperience && <p className="text-xs text-red-500 mt-1">{errors.yearsExperience}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Current Designation *</label>
                  <select
                    name="currentDesignation"
                    value={formData.currentDesignation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  >
                    {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* 3. PREVIOUS COURSE HISTORY */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2 text-blue-700">
                  <BookOpen size={20} />
                  3. Previous Course History
                </h3>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="previousCourseAttended"
                    name="previousCourseAttended"
                    checked={formData.previousCourseAttended}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                  />
                  <label htmlFor="previousCourseAttended" className="text-sm font-semibold text-slate-800 cursor-pointer">
                    Have you previously attended any ITU / National Instructor or Referee Course?
                  </label>
                </div>

                {formData.previousCourseAttended && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Details of Previous Course</label>
                      <input
                        type="text"
                        name="previousCourseDetails"
                        value={formData.previousCourseDetails}
                        onChange={handleChange}
                        placeholder="Year, Place or Event Name"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Previous Referee/Instructor Grade (if any)</label>
                      <input
                        type="text"
                        name="previousGrade"
                        value={formData.previousGrade}
                        onChange={handleChange}
                        placeholder="Grade 1 / Class A / etc."
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DECLARATION */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="declaration"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded border-slate-300 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="declaration" className="text-xs sm:text-sm text-slate-700 leading-relaxed cursor-pointer">
                    <strong>Declaration:</strong> I hereby declare that the information provided by me in this application form is true and correct to the best of my knowledge. I agree to abide by the rules, regulations, instructions, and disciplinary guidelines of the Indian Taekwondo Union (ITU) during the National Instructor/Referee Training Course 2026.
                  </label>
                </div>
                {errors.declaration && <p className="text-xs text-red-500 font-semibold">{errors.declaration}</p>}
              </div>

              {/* Action Button */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 mx-auto"
                >
                  <span>Review Application & Fee</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: REVIEW SUMMARY */}
          {step === 'review' && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200 space-y-8">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold text-slate-900">Review Your Registration Details</h3>
                <p className="text-sm text-slate-600">Please confirm all details before proceeding to payment.</p>
              </div>

              {/* Summary Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 border-b pb-1 text-blue-700">Applicant Details</h4>
                  <p className="mb-1"><span className="text-slate-500">Name:</span> <strong>{formData.fullName}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Parent's Name:</span> <strong>{formData.fatherMotherName}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">DOB (Age):</span> <strong>{formData.dob} ({calculateAge(formData.dob)} yrs)</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Gender / Nationality:</span> <strong>{formData.gender} / {formData.nationality}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Mobile:</span> <strong>{formData.mobileNumber}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Email:</span> <strong>{formData.email}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">State / PIN:</span> <strong>{formData.state} - {formData.pinCode}</strong></p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3 border-b pb-1 text-blue-700">Taekwondo Qualifications</h4>
                  <p className="mb-1"><span className="text-slate-500">Present Dan:</span> <strong>{formData.presentDan}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Dan Cert No:</span> <strong>{formData.isAwaitingDanCertificate ? 'Awaiting Certificate' : formData.danCertificateNo}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Academy / Dojang:</span> <strong>{formData.academyName}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Experience:</span> <strong>{formData.yearsExperience} Years</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Designation:</span> <strong>{formData.currentDesignation}</strong></p>
                  <p className="mb-1"><span className="text-slate-500">Selected Option:</span> <strong className="text-blue-700 font-bold">{formData.courseOption === 'both' ? 'Both Instructor & Referee' : formData.singleCourseType}</strong></p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs text-orange-800 font-bold uppercase">Total Fee Payable</div>
                  <div className="text-2xl font-extrabold text-orange-900">₹{getFeeAmount().toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right text-xs text-orange-800">
                  3-Day National Level Training & Certification
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Edit Information
                </button>

                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & TRANSACTION ENTRY */}
          {step === 'payment' && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200 space-y-8">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold text-slate-900">Payment & Verification</h3>
                <p className="text-sm text-slate-600">Scan the official ITU Payment QR Code and enter your Transaction UTR reference.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* QR Code Container */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
                  <h4 className="font-bold text-slate-900 text-base">Scan & Pay via UPI</h4>
                  <img
                    src="/itu_payment_qr.jpg"
                    alt="ITU Payment QR Code"
                    className="h-64 mx-auto object-contain rounded-xl border border-slate-300 shadow-sm"
                    onError={(e) => {
                      e.target.src = '/qr_code.jpeg';
                    }}
                  />
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">Merchant Name: INDIAN TAEKWONDO UNION</p>
                    <p>MID: 037135010670154 | TID: 71970207</p>
                  </div>
                </div>

                {/* Transaction details entry */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-xs text-blue-700 font-bold uppercase">Amount to Pay</div>
                    <div className="text-3xl font-extrabold text-blue-900">₹{getFeeAmount().toLocaleString('en-IN')}</div>
                    <p className="text-xs text-blue-800 mt-1">Please pay exact amount using any UPI App (GPay, PhonePe, Paytm, BHIM).</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Transaction Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="e.g. 428910293810 / UTR / UPI Ref ID"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-base"
                    />
                    <p className="text-xs text-slate-500 mt-1">Found in your UPI payment app under receipt details.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Upload Payment Proof Screenshot (Optional but recommended)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentProofUpload}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {paymentProofPreview && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={paymentProofPreview} alt="Receipt Preview" className="h-14 w-14 rounded-lg object-cover border border-slate-300" />
                        <span className="text-xs text-emerald-600 font-semibold">Receipt Attached</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('review')}
                      className="px-5 py-3 text-slate-600 hover:text-slate-900 text-sm font-semibold"
                    >
                      Back to Review
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleFinalSubmission}
                      className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT SUMMARY */}
          {step === 'success' && submittedData && (
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-200 text-center space-y-8">
              
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={48} />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Registration Submitted Successfully!</h2>
                <p className="text-slate-600 max-w-md mx-auto">Your registration and payment reference have been recorded. A confirmation email has been dispatched.</p>
              </div>

              {/* Printable Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Registration No</span>
                    <div className="text-xl font-extrabold text-blue-700 font-mono">{submittedData.registrationNo}</div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
                    {submittedData.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block">Applicant Name</span>
                    <strong className="text-slate-900">{submittedData.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Course Selected</span>
                    <strong className="text-slate-900">{submittedData.selectedCourses?.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Fee Amount</span>
                    <strong className="text-emerald-700">₹{submittedData.feeAmount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Transaction Ref</span>
                    <strong className="text-slate-900 font-mono">{submittedData.transactionId}</strong>
                  </div>
                </div>

                <div className="border-t pt-3 text-xs text-slate-500">
                  <p><strong>Reporting Date:</strong> 30th October 2026 at 8:00 AM</p>
                  <p><strong>Reporting Venue:</strong> Madhusudan Bhawan, Chhend, Rourkela, Odisha</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-colors"
                >
                  <Printer size={18} />
                  <span>Print Receipt / Slip</span>
                </button>

                <a
                  href="https://wa.me/919583921122?text=Hi%20ITU%2C%20I%20have%20registered%20for%20the%20National%20Instructor%20%26%20Referee%20Course%202026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-colors"
                >
                  <Phone size={18} />
                  <span>WhatsApp Support</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* FLYER MODAL */}
      {viewBrochureModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4">
            <button
              onClick={() => setViewBrochureModal(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 bg-slate-100 p-2 rounded-full"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Official Course Circular Flyer</h3>
            <img src="/course_brochure_flyer.jpg" alt="Course Circular" className="w-full h-auto rounded-lg border border-slate-200" />
          </div>
        </div>
      )}

    </div>
  );
}
