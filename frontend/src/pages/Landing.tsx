import { useEffect } from 'react';

export default function Landing() {
  useEffect(() => {
    // If inside an iframe or standalone, ensure clean direct view
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.location.replace('/ironforge.html');
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] z-50 overflow-hidden">
      <iframe
        src="/ironforge.html"
        title="IRONFORGE — Elite Strength & Conditioning Studio"
        className="w-full h-full border-0"
        allow="autoplay"
      />
    </div>
  );
}
