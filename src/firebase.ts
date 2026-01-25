import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
export default app;
