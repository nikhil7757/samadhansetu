import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(() => i18n.language || (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : 'en') || 'en');

  useEffect(() => {
    const handleLangChange = (lng: string) => setCurrent(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, [i18n]);

  const toggle = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrent(lang);
    try {
      localStorage.setItem('lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch (_) {}
  };

  const isEn = current.startsWith('en');
  const isHi = current.startsWith('hi');

  return (
    <div
      className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs font-semibold shadow-2xs"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => toggle('en')}
        className={cn(
          'rounded-md px-2.5 py-1 transition-all duration-150 cursor-pointer',
          isEn
            ? 'bg-primary text-primary-foreground shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )}
        aria-pressed={isEn}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => toggle('hi')}
        className={cn(
          'rounded-md px-2.5 py-1 transition-all duration-150 cursor-pointer font-medium',
          isHi
            ? 'bg-primary text-primary-foreground shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )}
        aria-pressed={isHi}
        aria-label="हिन्दी"
      >
        हिं
      </button>
    </div>
  );
}
