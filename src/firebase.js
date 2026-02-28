// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyAUTc4yjnY8o54w1bfbAhJ64c_ZV_JQ6Pk",
  authDomain: "dflafia-firebase.firebaseapp.com",
  projectId: "dflafia-firebase",
  storageBucket: "dflafia-firebase.firebasestorage.app",
  messagingSenderId: "193906135759",
  appId: "1:193906135759:web:24255341690842d61e9dba",
  measurementId: "G-31CQ6XNJPK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase AI Logic with the Gemini Developer API backend
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Get a Gemini model instance — export it so any component can use it
export const model = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
});
