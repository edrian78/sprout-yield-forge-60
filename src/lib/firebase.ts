import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - you can update these values
const firebaseConfig = {
  apiKey: "AIzaSyC3L4ZH8WE0W-ewwC2ppWb35DziwVa3zJE",
  authDomain: "wzard-ecb8c.firebaseapp.com",
  databaseURL: "https://wzard-ecb8c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wzard-ecb8c",
  storageBucket: "wzard-ecb8c.firebasestorage.app",
  messagingSenderId: "866307070417",
  appId: "1:866307070417:web:60396f70db625b5251a8f0",
  measurementId: "G-VLMR424WWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Functions
export const functions = getFunctions(app);

// Initialize Firestore
export const db = getFirestore(app);
