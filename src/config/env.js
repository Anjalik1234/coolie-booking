// Central config — import this everywhere instead of import.meta.env directly
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  appName: import.meta.env.VITE_APP_NAME || 'CoolieBook',
  mapsApiKey: import.meta.env.VITE_MAPS_API_KEY || '',
  razorpayKey: import.meta.env.VITE_RAZORPAY_KEY || '',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  enable3D: import.meta.env.VITE_ENABLE_3D === 'true',
  enableSounds: import.meta.env.VITE_ENABLE_SOUNDS === 'true',
};

export default config;