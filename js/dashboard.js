import { auth, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let strengths = [];
let hobbies = [];
let weaknesses = [];

window.addTag = function (type) {
  let input, list, array;

  if (type === "strength") {
    input = document.getElementById("strengthInput");
    list = document.getElementById("strengthList");
    array = strengths;
  }
  if (type === "hobby") {
    input = document.getElementById("hobbyInput");
    list = document.getElementById("hobbyList");
    array = hobbies;
  }
  if (type === "weakness") {
    input = document.getElementById("weaknessInput");
    list = document.getElementById("weaknessList");
    array = weaknesses;
  }

  const value = input.value.trim();
  if (!value) return;

  array.push(value);

  const chip = document.createElement("div");
  chip.className = "tag";
  chip.innerText = value;
  list.appendChild(chip);

  input.value = "";
};

// SAVE PROFILE
document.getElementById("saveProfile").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    name: document.getElementById("nameInput").value,
    college: document.getElementById("collegeInput").value,
    age: Number(document.getElementById("ageInput").value),
    strengths,
    hobbies,
    weaknesses,
    profileCompleted: true,
    updatedAt: serverTimestamp()
  });

window.location.href = "profile.html";
});
