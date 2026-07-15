import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
      if (res.data.themeColor) {
        document.documentElement.style.setProperty('--theme-color', res.data.themeColor);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
