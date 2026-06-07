// @ts-nocheck
import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/ui/Hero';
import Footer from './components/footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between" dir="rtl">
      <div>
        <Navbar />
        <Hero />
      </div>
      <Footer />
    </div>
  );
}

export default App;
