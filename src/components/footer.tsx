import { useTranslation } from 'react-i18next';
import { Pill, Mail, Phone } from 'lucide-react';

const FOOTER_LINKS = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.products', href: '#products' },
  { key: 'nav.partners', href: '#partners' },
  { key: 'nav.contact', href: '#contact' },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-surface-container border-t border-outline-variant mt-20">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <Pill className="w-6 h-6" aria-hidden="true" />
              <span className="font-heading font-bold text-lg">{t('brand')}</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
              {t('brandFull')}
            </p>
            <p className="text-on-surface-variant text-sm mt-2">{t('footer.tagline')}</p>
          </div>

          {/* Quick links */}
          <nav aria-label={t('footer.links')}>
            <h2 className="font-heading font-semibold text-on-surface mb-4">{t('footer.links')}</h2>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-heading font-semibold text-on-surface mb-4">{t('footer.contact')}</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@al-khobaraa.com"
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">info@al-khobaraa.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+218000000000"
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">+218 00 000 0000</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline-variant mt-10 pt-6 text-center text-sm text-on-surface-variant">
          © {year} {t('brand')} — {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
