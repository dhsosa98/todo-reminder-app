/// <reference types="vite/client" />


export const port = import.meta.env.VITE_API_PORT || 5000;
const isDev = import.meta.env.DEV;
let API_URL = import.meta.env.VITE_API_URL || '/';
if (isDev && !API_URL.includes('http')) {
    API_URL = `http://localhost:${port}/`;
}
export default API_URL;
