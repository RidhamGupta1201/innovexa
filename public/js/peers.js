import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ============================
   LOAD PEER MATCHES USING GEMINI
============================ */

let currentUserProfile = null;
let otherUsers = [];

/* 1️⃣ Get current user profile */
async function getCurrentUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.data();
}
async function getOtherUsers(currentUid) {
  const snapshot = await getDocs(collection(db, "users"));

  const users = [];

  snapshot.forEach(docSnap => {
    if (docSnap.id !== currentUid) {
      users.push({
        uid: docSnap.id,
        name: docSnap.data().name || "Unnamed",
        strengths: docSnap.data().strengths || [],
        weaknesses: docSnap.data().weaknesses || [],
        hobbies: docSnap.data().hobbies || []
      });
    }
  });

  console.log("Other users fetched:", users);
  return users;
}


/* 3️⃣ Call Node.js + Gemini backend */
async function fetchPeerMatches(userQuery = "") {
  const response = await fetch("http://localhost:5000/api/match-peers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentUser: {
        uid: auth.currentUser.uid,
        strengths: currentUserProfile.strengths || [],
        weaknesses: currentUserProfile.weaknesses || [],
        hobbies: currentUserProfile.hobbies || []
      },
      otherUsers,
      userQuery
    })
  });

  return await response.json();
}

/* 4️⃣ Render matches */
function renderMatches(matches) {
  const matchesGrid = document.getElementById("matchesGrid");
  matchesGrid.innerHTML = "";

  if (!matches || matches.length === 0) {
    matchesGrid.innerHTML = `<p>No matching peers found.</p>`;
    return;
  }

  matches.forEach(user => {
    matchesGrid.innerHTML += `
      <div class="match-card">
        <h3>${user.name}</h3>
        <p>${user.reason}</p>
        <button class="connect-btn">Connect</button>
      </div>
    `;
  });
}

/* ============================
   INITIAL LOAD
============================ */

auth.onAuthStateChanged(async user => {
  if (!user) return;

  currentUserProfile = await getCurrentUserProfile(user.uid);
  otherUsers = await getOtherUsers(user.uid);

  // Initial match without chat input
  const matches = await fetchPeerMatches();
  renderMatches(matches);
});

/* ============================
   CHAT WITH GEMINI (RESTRICTED)
============================ */

document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("chatInput").value.trim();
  if (!input) return;

  const chat = document.getElementById("chatMessages");
  chat.innerHTML += `<p><strong>You:</strong> ${input}</p>`;

  const matches = await fetchPeerMatches(input);

if (Array.isArray(matches)) {
  renderMatches(matches);
  chat.innerHTML += `
    <p><strong>Gemini:</strong>
      Here are peers that best match your request.
    </p>
  `;
} else {
  if (matches.length === 0) {
  chat.innerHTML += `
    <p><strong>Gemini:</strong>
      I couldn’t find a suitable peer based on current data.
    </p>
  `;
} else {
  chat.innerHTML += `
    <p><strong>Gemini:</strong>
      I found ${matches.length} peer(s) that match your request.
    </p>
  `;
}

}


  document.getElementById("chatInput").value = "";
});
