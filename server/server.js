require("dotenv").config();
const express = require("express");
const cors = require("cors");

const loadData = require("./data-loader");
const findRelevantChunks = require("./rag");

const app = express();
app.use(cors());
app.use(express.json());

const chunks = loadData();
const API_KEY = "";

function isIncomplete(text) {
  const t = text.trim();
  return !t.match(/[.!?]$/) || t.endsWith(",") || t.endsWith(":") || t.endsWith("and") || t.endsWith("the");
}

async function callGemini(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    if (data.candidates?.length > 0) {
      const candidate = data.candidates[0];
      const answer = candidate.content.parts.map(p => p.text).join(" ").trim();
      if (candidate.finishReason === "MAX_TOKENS" || isIncomplete(answer)) {
        console.log(`Attempt ${i + 1}: incomplete, retrying...`);
        continue;
      }
      return answer;
    }
  }
  throw new Error("Failed to get a complete response after retries.");
}

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const context = findRelevantChunks(question, chunks).join("\n");

  const prompt = `
You are a helpful fitness expert.

Answer the question clearly and in detail using the context below.
Explain in complete sentences and elaborate where useful.
Always write a complete, finished answer — never cut off mid-sentence.

Context:
${context}

Question:
${question}
`;

  try {
    const answer = await callGemini(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
