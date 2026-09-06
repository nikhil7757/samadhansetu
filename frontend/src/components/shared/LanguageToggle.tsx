import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language || 'en';

  const toggle = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

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
          current.startsWith('en')
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )}
        aria-pressed={current.startsWith('en')}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => toggle('hi')}
        className={cn(
          'rounded-md px-2.5 py-1 transition-all duration-150 cursor-pointer font-medium',
          current.startsWith('hi')
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )}
        aria-pressed={current.startsWith('hi')}
        aria-label="हिन्दी"
      >
        हिं
      </button>
    </div>
  );
}
