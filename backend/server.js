import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   HELPER: NORMALIZE ARRAYS
========================= */
function normalize(arr = []) {
  return Array.isArray(arr)
    ? arr.map(v => v.toLowerCase().trim())
    : [];
}

/* =========================
   GEMINI PEER MATCHING
========================= */
app.post("/api/match-peers", async (req, res) => {
  try {
    let { currentUser, otherUsers, userQuery } = req.body;

    if (!currentUser || !Array.isArray(otherUsers)) {
      return res.json([]);
    }

    /* 🔧 NORMALIZE USER DATA */
    currentUser = {
      ...currentUser,
      strengths: normalize(currentUser.strengths),
      weaknesses: normalize(currentUser.weaknesses),
      hobbies: normalize(currentUser.hobbies)
    };

    otherUsers = otherUsers.map(u => ({
      ...u,
      strengths: normalize(u.strengths),
      weaknesses: normalize(u.weaknesses),
      hobbies: normalize(u.hobbies)
    }));

    /* 🧠 GEMINI PROMPT */
    const prompt = `
You are CampusConnect AI.

RULES:
- You ONLY do peer matching.
- Match users if ANY condition matches:
  • Their strengths help user's weaknesses
  • Similar OR related hobbies
  • Overlapping interests or skills
- Treat similar words as the same:
  Maths = Mathematics
  Coding = Programming
  Java = Backend

DO NOT:
- Solve problems
- Teach concepts
- Answer anything except peer matching

CURRENT USER:
${JSON.stringify(currentUser)}

OTHER USERS:
${JSON.stringify(otherUsers)}

USER QUERY:
${userQuery || "Find best peer matches"}

Respond ONLY in a valid JSON array.
NO explanation text.
NO markdown.
ONLY JSON.

Format:
[
  {
    "uid": "",
    "name": "",
    "reason": ""
  }
]
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🔵 RAW GEMINI RESPONSE:\n", text);

    if (!text) {
      return res.json([]);
    }

    /* 🔥 SAFELY EXTRACT JSON ARRAY */
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      console.log("⚠️ No JSON array found");
      return res.json([]);
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    } catch (err) {
      console.log("⚠️ JSON parse failed:", jsonMatch[0]);
      return res.json([]);
    }

  } catch (error) {
    console.error("❌ Gemini error:", error);
    res.status(500).json({ error: "Peer matching failed" });
  }
});

/* ========================= */
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
