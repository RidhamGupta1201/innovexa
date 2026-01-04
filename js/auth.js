import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ IMPORT FROM YOUR firebase.js (MATCHING EXPORTS)
import { auth } from "./firebase.js";

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
    console.log("Login successful:", result.user.email);

    // ✅ Redirect after login
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Google login error:", error);
  }
});
