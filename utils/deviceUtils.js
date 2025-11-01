// Device detection utilities for responsive design

export function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop'; // Server-side rendering
  const width = window.innerWidth;
  if (width <= 640) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getDeviceClasses(deviceType = null, isTouch = false) {
  const device = deviceType || getDeviceType();
  const touch = isTouch !== null ? isTouch : isTouchDevice();
  
  return {
    // Primary button sizing (Generate Character, Generate Names, etc.)
    primaryButtonSize: device === 'mobile' ? 'px-4 py-4 text-sm' : device === 'tablet' ? 'px-6 py-4 text-sm' : 'px-6 py-4 text-sm',
    // Action button sizing (smaller grid buttons)
    actionButtonSize: device === 'mobile' ? 'px-3 py-4 text-xs' : device === 'tablet' ? 'px-3 py-3 text-sm' : 'px-2 py-3 text-xs',
    // Navigation button sizing (header buttons)
    navButtonSize: device === 'mobile' ? 'px-4 py-4 text-sm' : device === 'tablet' ? 'px-4 py-4 text-sm' : 'px-4 py-4 text-sm',
    // Legacy button size (for compatibility)
    buttonSize: device === 'mobile' ? 'px-3 py-4 text-xs' : device === 'tablet' ? 'px-3 py-3 text-sm' : 'px-2 py-3 text-xs',
    // Touch target sizing - ensure adequate height for accessibility
    touchTarget: touch && device === 'mobile' ? 'min-h-[48px]' : '',
    // Grid adjustments
    actionGrid: device === 'mobile' ? 'grid-cols-2 gap-2' : device === 'tablet' ? 'grid-cols-3 gap-3' : 'grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:gap-2',
    // Container spacing
    containerPadding: device === 'mobile' ? 'px-4' : device === 'tablet' ? 'px-6' : 'px-4',
    // Header spacing
    headerSpacing: device === 'mobile' ? 'gap-2' : device === 'tablet' ? 'gap-4' : 'gap-6'
  };
}