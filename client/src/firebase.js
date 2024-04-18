// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-76eaa.firebaseapp.com",
  projectId: "blog-76eaa",
  storageBucket: "blog-76eaa.appspot.com",
  messagingSenderId: "494018426662",
  appId: "1:494018426662:web:5fcdd32d681b3da46d33e7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
