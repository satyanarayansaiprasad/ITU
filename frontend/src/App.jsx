import React from 'react'
import { Routes, Route } from 'react-router-dom'; // No BrowserRouter here
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
import News from './Components/News';
import Gallery from './Components/Gallery';
import UnionAbout from './Components/UnionABout';
import Map from './Components/Map';

const App = () => {
  return (
  
    <>
      <Mainnav />
      <TopNav />
      
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
        <Route path="/news" element={<News />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about/directors" element={<UnionAbout />} />
      </Routes>
      
      <Footer />
    </>
  )
}

export default App