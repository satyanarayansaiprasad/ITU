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
import Districts from './Components/Districts';
import DistrictDetails from './Components/DistrictDetails';
import Blog from './Components/Blog';
import Gallery from './Components/Gallery';
import UnionAbout from './Components/UnionABout';
import LoginPage from './Components/LoginPage';
import ModernAdminDash from './AdminPanel/Pages/ModernAdminDash';
import ModernViewContact from './AdminPanel/Pages/ModernViewContact';
import ModernNewsManager from './AdminPanel/Pages/ModernNewsManager';
import ModernSliderManager from './AdminPanel/Pages/ModernSliderManager';
import SelfDefenceSliderManager from './AdminPanel/Pages/SelfDefenceSliderManager';
import CategorySliderManager from './AdminPanel/Pages/CategorySliderManager';
import ModernGalleryMng from './AdminPanel/Pages/ModernGalleryMng';
import Form from './Components/Form';
import ModernFormSubmissions from './AdminPanel/Pages/ModernFormSubmissions';
import ModernStatesDistrictsManager from './AdminPanel/Pages/ModernStatesDistrictsManager';
import HeadsManagement from './AdminPanel/Pages/HeadsManagement';
import PlayerManagement from './AdminPanel/Pages/PlayerManagement';
import BeltPromotionManagement from './AdminPanel/Pages/BeltPromotionManagement';
import CompetitionManagement from './AdminPanel/Pages/CompetitionManagement';
import ScrollToTop from './Components/ScrollToTop';
import AdminLayout from './AdminPanel/Pages/AdminLayout';
import StateUnionDashboard from './StateUnionpanel/StateUnionDashboard';
import PlayerDashboard from './PlayerPanel/PlayerDashboard';
import SelfDefence from './Components/SelfDefence';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admindashboard';
  const isDashboardRoute = isAdminRoute || 
                          location.pathname === '/playerdashboard' || 
                          location.pathname === '/stateuniondashboard' ||
                          location.pathname === '/login';

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Mainnav />}
      {!isDashboardRoute && <TopNav />}

      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <Marque />
            <BenefitsSection />
            <ApprovalsSection />
            <Category />
          </>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/state-union" element={<StateUnion />} />
        <Route path="/state-union/:stateName" element={<Districts />} />
        <Route path="/state-union/:stateName/district/:districtName" element={<DistrictDetails />} />
        <Route path="/news" element={<Blog />} />
        <Route path="/news/:id" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/forms" element={<Form />} />
        <Route path="/self-defence" element={<SelfDefence />} />
        <Route path="/about/directors" element={<UnionAbout />} />
            <Route path="/login" element={<LoginPage />} />
             <Route path="/stateuniondashboard" element={<StateUnionDashboard />} />
             <Route path="/playerdashboard" element={<PlayerDashboard />} />
        {/* ✅ Admin Routes - No Header/Footer */}
       <Route element={<AdminLayout />}>
  <Route path="/admindashboard" element={<ModernAdminDash />} />
  <Route path="/admin/view-contacts" element={<ModernViewContact />} />
  <Route path="/admin/blogs" element={<ModernNewsManager />} />
  <Route path="/admin/slider-management" element={<ModernSliderManager />} />
  <Route path="/admin/self-defence-slider" element={<SelfDefenceSliderManager />} />
  <Route path="/admin/category-slider" element={<CategorySliderManager />} />
  <Route path="/admin/gallery" element={<ModernGalleryMng />} />
  <Route path="/admin/form-submissions" element={<ModernFormSubmissions />} />
      <Route path="/admin/states-districts" element={<ModernStatesDistrictsManager />} />
      <Route path="/admin/heads-management" element={<HeadsManagement />} />
      <Route path="/admin/player-management" element={<PlayerManagement />} />
      <Route path="/admin/belt-promotion" element={<BeltPromotionManagement />} />
      <Route path="/admin/competition-registrations" element={<CompetitionManagement />} />
</Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
