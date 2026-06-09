import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Pill } from 'lucide-react';

const NAV_LINKS = [
  { key: 'nav.home', href: '#' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.products', href: '#products' },
  { key: 'nav.partners', href: '#partners' },
  { key: 'nav.contact', href: '#contact' },
] as const;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <nav className="container mx-auto px-margin-mobile md:px-margin-desktop" aria-label={t('brandFull')}>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 text-primary">
            <Pill className="w-7 h-7" aria-hidden="true" />
            <span className="font-heading font-bold text-xl">{t('brand')}</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-primary hover:bg-surface-container transition-colors font-medium"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{t('nav.switchLanguage')}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t('nav.toggleMenu')}
              className="lg:hidden p-2 rounded-md text-on-surface hover:bg-surface-container transition-colors"
            >
              {open ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden pb-4"
            >
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-3 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-medium"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
