// @ts-nocheck
import React, { useState } from 'react';

// 1. مكون الـ Navbar المدمج
function LocalNavbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">مجمع الخبراء الطبي</span>
          </div>
          <div className="flex items-center space-x-8 space-x-reverse">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">الرئيسية</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">خدماتنا</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">من نحن</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// 2. مكون الـ Hero المدمج بالكامل هنا لتجنب أخطاء الملفات المفقودة
function LocalHero() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          رعاية طبية متميزة تثق بها لعائلتك
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          نحن في مجمع الخبراء الطبي ملتزمون بتقديم أعلى مستويات الرعاية الصحية من خلال نخبة من الأطباء الاستشاريين وأحدث التقنيات الطبية.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            احجز موعداً الآن
          </a>
          <a href="#services" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            اكتشف خدماتنا
          </a>
        </div>
      </div>
    </div>
  );
}

// 3. مكون الـ Footer المدمج
function LocalFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
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

// 4. المكون الرئيسي الشامل
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <LocalNavbar />
      <main className="flex-grow">
        <LocalHero />
      </main>
      <LocalFooter />
    </div>
  );
}
