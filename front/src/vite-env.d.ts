/// <reference types="vite/client" />


export const port = import.meta.env.VITE_API_PORT || 5000;
const isDev = import.meta.env.DEV;
let API_URL = import.meta.env.VITE_API_URL || '/';

if (isDev && !API_URL.includes('http')) {
    API_URL = `http://localhost:${port}/`;
}
export default API_URL;

export const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    // measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

