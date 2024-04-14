
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { FIREBASE_CONFIG } from "../vite-env.d";

//Firebase Config values imported from .env file
const firebaseConfig = {
    apiKey: "AIzaSyAJPbLN7c9soisWp3QtLkb35N5shVtZz4I",
    authDomain: "todo-list-59f9d.firebaseapp.com",
    projectId: "todo-list-59f9d",
    storageBucket: "todo-list-59f9d.appspot.com",
    messagingSenderId: "155629873861",
    appId: "1:155629873861:web:9521078ede67ad8d321eac"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("Firebase initialized");

// Messaging service
export const messaging = getMessaging(app);

export const firebaseAuth = getAuth(app)
