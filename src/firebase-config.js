// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCjFfAuN-DCSTMcmhPaObL4erXrVoadPEw",
    authDomain: "careerfair2025-user-data.firebaseapp.com",
    projectId: "careerfair2025-user-data",
    storageBucket: "careerfair2025-user-data.firebasestorage.app",
    messagingSenderId: "79335418249",
    appId: "1:79335418249:web:eacc7b341dcad394b8d958",
    measurementId: "G-V9QWH9YGBP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
