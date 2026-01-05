import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Import shared Firebase instances
import { auth, db } from "./firebase.js";

console.log("auth.js loaded");

const provider = new GoogleAuthProvider();
const googleBtn = document.getElementById("googleLogin");

if (!googleBtn) {
  console.error("Google login button not found");
}

googleBtn.addEventListener("click", async () => {
  console.log("Google button clicked");

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Login successful:", user.email);

    // 🔥 CREATE USER IN FIRESTORE (IF NOT EXISTS)
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        strengths: [],
        weaknesses: []
      });

      console.log("New user added to Firestore");
    } else {
      console.log("User already exists in Firestore");
    }

    // ✅ Redirect after DB write
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Google login error:", error);
  }
});
