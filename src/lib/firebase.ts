
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

// Firebase configuration - you can update these values
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Functions
export const functions = getFunctions(app);
