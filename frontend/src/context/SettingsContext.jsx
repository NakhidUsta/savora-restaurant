import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '../api/settings';

const SettingsContext = createContext(null);

const fallback = {
  site_name: 'Savora',
  logo_url: '',
  phone: '',
  email: '',
  address: '',
  is_saatlari: '',
  hero_title: '',
  hero_description: '',
  instagram_link: '',
  facebook_link: '',
  images: {},
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallback);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    return getSettings()
      .then((data) => setSettings({ ...fallback, ...data }))
      .catch(() => setSettings(fallback))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch }}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings() yalnız SettingsProvider daxilində istifadə oluna bilər');
  }
  return ctx;
}
