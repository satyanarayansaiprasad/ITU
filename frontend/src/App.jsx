import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // ✅ useLocation added
import "./index.css"; 
import TopNav from './Components/TopNav';
import Home from './Components/Home';
import Mainnav from './Components/Mainnav';
import ApprovalsSection from './Components/ApprovalsSection';
import Footer from './Components/Footer';
import BenefitsSection from './Components/BenefitsSection';
import Category from './Components/Category';
import Marque from './Components/Marque';
import About from './Components/About';
import Contact from './Components/Contact';
import StateUnion from './Components/StateUnion';
import Blog from './Components/Blog';
import Gallery from './Components/Gallery';
import UnionAbout from './Components/UnionABout';
import Map from './Components/Map';
import LoginPage from './Components/LoginPage';
import ModernAdminDash from './AdminPanel/Pages/ModernAdminDash';
import ModernViewContact from './AdminPanel/Pages/ModernViewContact';
import ModernNewsManager from './AdminPanel/Pages/ModernNewsManager';
import ModernSliderManager from './AdminPanel/Pages/ModernSliderManager';
import ModernGalleryMng from './AdminPanel/Pages/ModernGalleryMng';
import Form from './Components/Form';
import ModernFormSubmissions from './AdminPanel/Pages/ModernFormSubmissions';
import ScrollToTop from './Components/ScrollToTop';
import AdminLayout from './AdminPanel/Pages/AdminLayout';
import StateUnionDashboard from './StateUnionpanel/StateUnionDashboard';
import SelfDefence from './Components/SelfDefence';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admindashboard';

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Mainnav />}
      {!isAdminRoute && <TopNav />}

      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <Marque />
            <BenefitsSection />
            <ApprovalsSection />
            <Map />
            <Category />
          </>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/state-union" element={<StateUnion />} />
        <Route path="/news" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/forms" element={<Form />} />
        <Route path="/self-defence" element={<SelfDefence />} />
        <Route path="/about/directors" element={<UnionAbout />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/stateuniondashboard" element={<StateUnionDashboard />} />
        {/* ✅ Admin Routes - No Header/Footer */}
       <Route element={<AdminLayout />}>
  <Route path="/admindashboard" element={<ModernAdminDash />} />
  <Route path="/admin/view-contacts" element={<ModernViewContact />} />
  <Route path="/admin/blogs" element={<ModernNewsManager />} />
  <Route path="/admin/slider-management" element={<ModernSliderManager />} />
  <Route path="/admin/gallery" element={<ModernGalleryMng />} />
  <Route path="/admin/form-submissions" element={<ModernFormSubmissions />} />
</Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
