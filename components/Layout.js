import { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { getInternalLink } from '../utils/links';

// Shared Navigation Layout
export default function Layout({ children }) {
  const [navOpen, setNavOpen] = useState(true);
  // Detect current path for active link styling
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  // Prevent duplicate nav menu: only render if children is not already a Layout
  // Check for Layout in children (array or single)
  function hasLayout(child) {
    if (!child) return false;
    if (Array.isArray(child)) return child.some(hasLayout);
    if (child?.type?.name === 'Layout') return true;
    if (child?.props?.children) return hasLayout(child.props.children);
    return false;
  }
  if (hasLayout(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Duplicate nav menu detected: Layout is being rendered inside another Layout.');
    }
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <button
        className="fixed" style={{ top: '140px', left: 0, zIndex: 40, backgroundColor: '#f59e42', color: 'white', borderRadius: '0 0.75rem 0.75rem 0', padding: '0.5rem 0.5rem', minWidth: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center' }}
        onClick={() => setNavOpen(v => !v)}
        aria-label={navOpen ? 'Hide navigation' : 'Show navigation'}
      >
        {navOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      {/* Single nav menu with sliding animation, no duplicate */}
      <div
        className={`fixed top-20 left-0 z-30 w-[180px] flex flex-col md:flex-row items-center gap-2 p-2 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg border border-gray-700 mb-4 transition-transform duration-300 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ minHeight: '56px', transform: navOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 w-[180px] md:w-auto transition-all duration-300 opacity-100" style={{ alignItems: 'flex-start' }}>
          <a
            href={getInternalLink('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors duration-150 w-full md:w-auto ${currentPath === getInternalLink('/') ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-700'}`}
            title="Character Generator"
          >
            <span role="img" aria-label="character">🧑‍🎤</span> Character Generator
          </a>
          <a
            href={getInternalLink('names')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors duration-150 w-full md:w-auto ${currentPath === getInternalLink('names') ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-700'}`}
            title="Name Generator"
          >
            <span role="img" aria-label="name">📝</span> Name Generator
          </a>
          <a
            href={getInternalLink('info')}
            className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 text-white transition-colors duration-150"
            title="Information"
          >
            <span role="img" aria-label="info">ℹ️</span>
          </a>
        </div>
        <div className="absolute bottom-2 right-2 flex items-end justify-end w-full pr-2" style={{ pointerEvents: 'none' }}>
          <span className="text-xs text-blue-400 text-right" style={{ fontSize: '0.75rem', marginLeft: '2.5rem' }}>
            Click Flag to Open/Close Navigation
          </span>
        </div>
      </div>
      <main className="max-w-screen-sm mx-auto w-full px-2 py-2">
        <header className="w-full bg-gray-800 shadow-md py-3 mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-2xl">⚡</span>
              <span className="text-2xl font-extrabold tracking-wider text-white">ForceFoundry</span>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 pb-16">
          {children}
        </main>
      </main>
    </div>
  );
}
