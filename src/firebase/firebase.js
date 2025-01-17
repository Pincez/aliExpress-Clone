// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyF7mWX0PNgOF-qb49DQBRqdfNoAr4E1Y",
  authDomain: "e-commerce-webapp-7b530.firebaseapp.com",
  projectId: "e-commerce-webapp-7b530",
  storageBucket: "e-commerce-webapp-7b530.appspot.com",
  messagingSenderId: "1043834100650",
  appId: "1:1043834100650:web:7b1417e9683f078944e9d3",
  measurementId: "G-5875JE14FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, functions, storage, auth };