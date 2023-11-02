// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW6l92Uqw_DJqi-jd02jtWAVpwHKAQSJY",
  authDomain: "ad-variations.firebaseapp.com",
  projectId:"ad-variations",
  storageBucket: "ad-variations.appspot.com",
  messagingSenderId: "574065841141",
  appId: "1:574065841141:web:cf4cacbc4afd4f7b72c6bc",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const storage = getStorage(app);
