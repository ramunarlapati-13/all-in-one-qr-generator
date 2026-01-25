import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDxQ1qWt481GHl2LyC8TT_qE7SzxYTB3R8",
    authDomain: "rexplore-qr.firebaseapp.com",
    projectId: "rexplore-qr",
    storageBucket: "rexplore-qr.firebasestorage.app",
    messagingSenderId: "70964310981",
    appId: "1:70964310981:web:61d6b86846d34de72011ac",
    measurementId: "G-3N847Y0WCP"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export default app;
