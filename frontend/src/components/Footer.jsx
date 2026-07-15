import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Footer = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-4">
              {settings?.restaurantName || 'MenuFlow'}
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              {settings?.description?.slice(0, 150)}...
            </p>
            <div className="flex gap-3">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/menu" className="block hover:text-primary-400 transition-colors">{t('nav.menu')}</Link>
              <Link to="/about" className="block hover:text-primary-400 transition-colors">{t('nav.about')}</Link>
              <Link to="/contact" className="block hover:text-primary-400 transition-colors">{t('nav.contact')}</Link>
              <Link to="/privacy" className="block hover:text-primary-400 transition-colors">{t('footer.privacy')}</Link>
              <Link to="/terms" className="block hover:text-primary-400 transition-colors">{t('footer.terms')}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              {settings?.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {settings.address}
                </p>
              )}
              {settings?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  {settings.phone}
                </p>
              )}
              {settings?.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  {settings.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.restaurantName || 'MenuFlow'}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
