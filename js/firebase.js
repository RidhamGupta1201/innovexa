import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyD4zlslBVwMk3eHjAkNyvYvndD-fYClaOA",
    authDomain: "connectx-test-ddf36.firebaseapp.com",
    projectId: "connectx-test-ddf36",
    storageBucket: "connectx-test-ddf36.firebasestorage.app",
    messagingSenderId: "461876690412",
    appId: "1:461876690412:web:eede7d45bf85c54e7d14c9",
    measurementId: "G-HE2J91H8Z7"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THESE EXPORTS WERE MISSING OR WRONG
export const auth = getAuth(app);
export const db = getFirestore(app);