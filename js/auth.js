import { auth, db } from "./firebase.js";
import { GoogleAuthProvider, signInWithPopup } from 
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from 
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        strengths: [],
        needs: [],
        committees: [],
        createdAt: new Date()
      });
    }

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
});
