
// --------------------firebase--------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9kw2tyqNvAoMYCEopZvlTyy97FigTVlQ",
  authDomain: "ems-system-d0f08.firebaseapp.com",
  projectId: "ems-system-d0f08",
  storageBucket: "ems-system-d0f08.firebasestorage.app",
  messagingSenderId: "346869146384",
  appId: "1:346869146384:web:e1ae13e758563c6c977b95",
  measurementId: "G-W0R9HWW2YX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
