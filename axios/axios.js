import axios from "axios";

// Detect TV browser for compatibility adjustments
const isTVBrowser = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('tizen') || 
         userAgent.includes('webos') || 
         userAgent.includes('web0s') ||
         (userAgent.includes('android') && userAgent.includes('tv')) ||
         userAgent.includes('smart-tv') ||
         userAgent.includes('smarttv');
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Secret-Key": process.env.NEXT_PUBLIC_API_KEY,
  },
  withCredentials: true,
  // TV browsers may need longer timeouts
  timeout: isTVBrowser() ? 30000 : 10000,
});

// Add request interceptor for TV browser compatibility
axiosInstance.interceptors.request.use(
  (config) => {
    // Some TV browsers have issues with certain headers
    if (isTVBrowser()) {
      // Ensure headers are properly formatted
      if (config.headers) {
        config.headers['Accept'] = 'application/json';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error logging for TV browsers
    if (isTVBrowser()) {
      console.error('TV Browser API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
    }
    
    // Retry logic for network errors on TV browsers
    if (isTVBrowser() && !error.response && error.config && !error.config.__isRetryRequest) {
      error.config.__isRetryRequest = true;
      return axiosInstance.request(error.config);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;