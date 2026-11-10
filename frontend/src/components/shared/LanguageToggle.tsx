import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(
    () => i18n.language || (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : 'en') || 'en'
  );

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
  const isMr = current.startsWith('mr');

  return (
    <div
      className="inline-flex items-center rounded-full border border-border/80 bg-secondary/50 dark:bg-neutral-900/60 p-0.5 text-[11px] font-semibold backdrop-blur-md shadow-2xs"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => toggle('en')}
        className={cn(
          'rounded-full px-2 py-0.5 transition-all duration-150 cursor-pointer',
          isEn
            ? 'bg-primary text-primary-foreground shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        )}
        aria-pressed={isEn}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => toggle('mr')}
        className={cn(
          'rounded-full px-2 py-0.5 transition-all duration-150 cursor-pointer font-medium font-devanagari',
          isMr
            ? 'bg-primary text-primary-foreground shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        )}
        aria-pressed={isMr}
        aria-label="मराठी (Marathi)"
      >
        मराठी
      </button>
      <button
        type="button"
        onClick={() => toggle('hi')}
        className={cn(
          'rounded-full px-2 py-0.5 transition-all duration-150 cursor-pointer font-medium font-devanagari',
          isHi
            ? 'bg-primary text-primary-foreground shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        )}
        aria-pressed={isHi}
        aria-label="हिंदी (Hindi)"
      >
        हिंदी
      </button>
    </div>
  );
}

export default LanguageToggle;
