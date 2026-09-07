import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface VariantInfo {
  key: string;
  name: string;
}

const VARIANTS: VariantInfo[] = [
  { key: 'A', name: 'A: Civic Direct Portal' },
  { key: 'B', name: 'B: Executive Telemetry' },
  { key: 'C', name: 'C: Step-by-Step Flow' },
];

export function PrototypeSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentVariant = searchParams.get('variant')?.toUpperCase() || 'A';

  const currentIndex = Math.max(
    0,
    VARIANTS.findIndex((v) => v.key === currentVariant)
  );

  const setVariant = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'A') {
      newParams.delete('variant');
    } else {
      newParams.set('variant', key);
    }
    setSearchParams(newParams);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + VARIANTS.length) % VARIANTS.length;
    setVariant(VARIANTS[prevIdx].key);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % VARIANTS.length;
    setVariant(VARIANTS[nextIdx].key);
  };

  return (
    <aside
      aria-label="UI Prototype Switcher"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700/80 text-xs font-semibold backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5 pl-1 pr-2 text-slate-400 border-r border-slate-700">
        <Layers className="h-3.5 w-3.5 text-teal-400" />
        <span className="font-mono text-[10px] text-teal-400">PROTOTYPE</span>
      </div>

      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous UI variant"
        className="h-7 w-7 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="px-2 font-mono text-[11px] text-slate-100 min-w-[170px] text-center">
        {VARIANTS[currentIndex]?.name || `Variant ${currentVariant}`}
      </div>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next UI variant"
        className="h-7 w-7 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </aside>
  );
}
