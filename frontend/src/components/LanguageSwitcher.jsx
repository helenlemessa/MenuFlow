import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import i18n from '../i18n';

const LanguageSwitcher = () => {
  const { i18n: i18nInstance } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18nInstance.language === 'en' ? 'am' : 'en';
    i18nInstance.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
    >
      <Globe className="w-4 h-4" />
      {i18nInstance.language === 'en' ? 'አማ' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
