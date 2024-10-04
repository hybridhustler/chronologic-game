// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLqlUEzHLigzFMobhqM2fgM_vhuBD0ovY",
  authDomain: "chronologic-game.firebaseapp.com",
  projectId: "chronologic-game",
  storageBucket: "chronologic-game.appspot.com",
  messagingSenderId: "602870037048",
  appId: "1:602870037048:web:9ebea491ec01454ccf84cd",
  measurementId: "G-LW4NLF7SKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };