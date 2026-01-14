/**
 * Detects if the current browser is running on a TV device
 * Common TV browsers: Samsung Tizen, LG webOS, Android TV, etc.
 */
export const isTVBrowser = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';

  // Samsung Tizen TV
  const isTizen = userAgent.includes('tizen') || userAgent.includes('samsungbrowser');
  
  // LG webOS TV
  const isWebOS = userAgent.includes('webos') || userAgent.includes('web0s');
  
  // Android TV
  const isAndroidTV = userAgent.includes('android') && 
    (userAgent.includes('tv') || userAgent.includes('aftb') || userAgent.includes('aftm'));
  
  // Apple TV
  const isAppleTV = userAgent.includes('appletv') || platform.includes('appletv');
  
  // Smart TV indicators
  const isSmartTV = userAgent.includes('smart-tv') || 
    userAgent.includes('smarttv') ||
    userAgent.includes('smart-tv-browser');
  
  // Large screen detection (TVs typically have large viewports)
  const isLargeScreen = window.screen.width >= 1920 && window.screen.height >= 1080;
  const hasTVLikeViewport = window.innerWidth >= 1920 && window.innerHeight >= 1080;

  return isTizen || isWebOS || isAndroidTV || isAppleTV || isSmartTV || 
    (isLargeScreen && hasTVLikeViewport && !navigator.userAgent.includes('mobile'));
};

/**
 * Gets the recommended socket transport for the current browser
 */
export const getSocketTransports = () => {
  if (isTVBrowser()) {
    // TV browsers often have issues with WebSocket, use polling as fallback
    return ['polling', 'websocket'];
  }
  // Modern browsers prefer websocket first
  return ['websocket', 'polling'];
};

/**
 * Checks if the browser supports WebSocket properly
 */
export const supportsWebSocket = () => {
  if (typeof window === 'undefined') return false;
  return 'WebSocket' in window || 'MozWebSocket' in window;
};
