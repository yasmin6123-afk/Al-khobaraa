import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      brand: 'الخبراء',
      brandFull: 'الخبراء لاستيراد وتوزيع الأدوية والمستلزمات الطبية',
      nav: {
        home: 'الرئيسية',
        about: 'من نحن',
        products: 'منتجاتنا',
        partners: 'شركاؤنا',
        contact: 'تواصل معنا',
        toggleMenu: 'فتح القائمة',
        switchLanguage: 'English',
      },
      hero: {
        title: 'شريككم الموثوق في استيراد وتوزيع الأدوية والمستلزمات الطبية',
        subtitle:
          'نوفّر سلسلة إمداد دوائية متكاملة تربط كبرى الشركات العالمية بالصيدليات والمستشفيات، بجودة معتمدة وتغطية شاملة.',
        cta: 'تواصل معنا',
        secondaryCta: 'تعرف على منتجاتنا',
      },
      footer: {
        tagline: 'جودة معتمدة، وتوريد يمكنكم الاعتماد عليه.',
        rights: 'جميع الحقوق محفوظة.',
        links: 'روابط سريعة',
        contact: 'التواصل',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
      },
    },
  },
  en: {
    translation: {
      brand: 'Al-Khobaraa',
      brandFull: 'Al-Khobaraa for Import & Distribution of Medicines and Medical Supplies',
      nav: {
        home: 'Home',
        about: 'About Us',
        products: 'Products',
        partners: 'Partners',
        contact: 'Contact',
        toggleMenu: 'Toggle menu',
        switchLanguage: 'العربية',
      },
      hero: {
        title: 'Your trusted partner in importing and distributing medicines and medical supplies',
        subtitle:
          'A complete pharmaceutical supply chain connecting leading global manufacturers with pharmacies and hospitals — certified quality, nationwide coverage.',
        cta: 'Contact Us',
        secondaryCta: 'Explore Our Products',
      },
      footer: {
        tagline: 'Certified quality, supply you can rely on.',
        rights: 'All rights reserved.',
        links: 'Quick Links',
        contact: 'Contact',
        email: 'Email',
        phone: 'Phone',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') ?? 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

// Keep <html> lang/dir in sync with the active language
const applyDirection = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('lang', lng);
};
applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;
