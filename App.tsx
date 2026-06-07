// @ts-nocheck
import React, { useState } from 'react';
import Hero from './components/ui/Hero';

// دمج الـ Navbar داخل الملف لعدم الاعتماد على مسارات خارجية
function LocalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">الخبراء</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">الرئيسية</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">خدماتنا</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">من نحن</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// دمج الـ Footer داخل الملف لعدم الاعتماد على مسارات خارجية
function LocalFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="text-3xl font-bold text-blue-400">الخبراء</span>
          <p className="text-gray-400 mt-2 font-light">رعايتكم الطبية هي أولويتنا القصوى</p>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} مجمع الخبراء الطبي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between" dir="rtl">
      <div>
        <LocalNavbar />
        <Hero />
      </div>
      <LocalFooter />
    </div>
  );
}

export default App;
