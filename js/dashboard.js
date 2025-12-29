import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const xpText = document.getElementById("xp");
const xpFill = document.getElementById("xpFill");
const levelText = document.getElementById("level");

let xp = 0;
let level = 1;
let userRef;

function updateXPUI() {
  xpText.innerText = xp;
  xpFill.style.width = `${(xp % 100)}%`;
  levelText.innerText = `Level ${Math.floor(xp / 100) + 1}`;
}

function createTag(container, text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.innerText = text;
  container.appendChild(span);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  username.innerText = user.displayName;
  avatar.src = user.photoURL;

  userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    xp = data.xp || 0;
    updateXPUI();

    (data.strengths || []).forEach(s =>
      createTag(document.getElementById("strengths"), s)
    );

    (data.needs || []).forEach(n =>
      createTag(document.getElementById("needs"), n)
    );
  }
});

document.getElementById("addStrength").onclick = async () => {
  const val = strengthInput.value.trim();
  if (!val) return;

  xp += 20;
  updateXPUI();

  await updateDoc(userRef, {
    strengths: arrayUnion(val),
    xp: xp
  });

  createTag(strengths, val);
  strengthInput.value = "";
};

document.getElementById("addNeed").onclick = async () => {
  const val = needInput.value.trim();
  if (!val) return;

  xp += 10;
  updateXPUI();
