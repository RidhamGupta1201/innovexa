import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleLogin");

if (googleBtn) {
  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // 🔴 VERY IMPORTANT (prevents form reload)

    try {
      // 1️⃣ Google Login
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2️⃣ Reference to Firestore user doc
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // 3️⃣ FIRST TIME USER → CREATE PROFILE
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          college: "",
          age: null,
          strengths: [],
          weaknesses: [],
          hobbies: [],
          profileCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // 👉 First-time user must fill profile
        window.location.href = "dashboard.html";
        return;
      }

      // 4️⃣ EXISTING USER → CHECK PROFILE STATUS
      const data = userSnap.data();

      if (data.profileCompleted) {
        // ✅ Profile already filled
        window.location.href = "profile.html";
      } else {
        // 📝 Profile incomplete
        window.location.href = "dashboard.html";
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Google login failed. Please try again.");
    }
  });
}
