import { useEffect, useState } from 'react';
import { getInternalLink } from '../utils/links';

// Shared Navigation Layout
export default function Layout({ children }) {
  // Fix hydration mismatch by setting currentPath only on client side
  const [currentPath, setCurrentPath] = useState('');
  
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Set initial path
    updatePath();
    
    // Listen for navigation changes to update active state
    const handleLocationChange = () => {
      // Update path immediately without loading state
      updatePath();
    };
    
    // Listen for popstate (back/forward buttons) and click events
    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleLocationChange);
    
    // Clean up listeners
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLocationChange);
    };
  }, []);

  // Helper function to check if path is active
  const isActivePath = (targetPath) => {
    if (!currentPath) return false;
    
    // Handle both with and without trailing slashes
    const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
    const normalizedTarget = targetPath.replace(/\/$/, '') || '/';
    
    // Special case for root path
    if (normalizedTarget === '/' || normalizedTarget === '') {
      return normalizedCurrent === '/' || normalizedCurrent === '';
    }
    
    // Check if paths match (with or without basePath)
    return normalizedCurrent === normalizedTarget || 
           normalizedCurrent.endsWith(normalizedTarget);
  };

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
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <main className="max-w-screen-lg mx-auto w-full px-2 py-2 relative min-h-screen box-border">
        <header className="w-full bg-gray-800 shadow-md py-4 mb-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4">
            {/* App Title */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-yellow-400 text-2xl">⚡</span>
              <span className="text-2xl font-extrabold tracking-wider text-white">ForceFoundry</span>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <a
                href={getInternalLink('/')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 min-w-0 ${
                  isActivePath(getInternalLink('/'))
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                }`}
                title="Character Generator"
              >
                <span role="img" aria-label="character">🧑‍🎤</span> 
                <span className="hidden sm:inline whitespace-nowrap">Character Generator</span>
                <span className="sm:hidden">Characters</span>
              </a>
              <a
                href={getInternalLink('names')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 min-w-0 ${
                  isActivePath(getInternalLink('names'))
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                }`}
                title="Name Generator"
              >
                <span role="img" aria-label="name">📝</span> 
                <span className="hidden sm:inline whitespace-nowrap">Name Generator</span>
                <span className="sm:hidden">Names</span>
              </a>
              <a
                href={getInternalLink('info')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 min-w-0 ${
                  isActivePath(getInternalLink('info'))
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                }`}
                title="Information"
              >
                <span role="img" aria-label="info">ℹ️</span>
                <span className="hidden sm:inline">Info</span>
              </a>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 pb-16 min-h-[calc(100vh-200px)] w-full box-border">
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
