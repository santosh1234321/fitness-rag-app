document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.getElementById("question").value = chip.dataset.q;
    document.getElementById("question").focus();
  });
});

document.getElementById("question").addEventListener("keydown", e => {
  if (e.key === "Enter") ask();
});

document.getElementById("askBtn").addEventListener("click", ask);

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

async function ask() {
  const question = document.getElementById("question").value.trim();
  if (!question) return;

  const section = document.getElementById("output-section");
  const btn = document.getElementById("askBtn");

  btn.disabled = true;
  section.classList.remove("hidden");
  section.innerHTML = `<div class="output-card"><div class="thinking"><div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>Thinking...</div></div>`;

  try {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();

    if (res.status === 429) {
      section.innerHTML = `<div class="error-card">⏳ You're being rate limited by the Gemini API. Wait a minute and try again.</div>`;
    } else if (data.error) {
      section.innerHTML = `<div class="error-card">⚠️ ${data.error}</div>`;
    } else {
      section.innerHTML = `<div class="output-card"><div class="output-header"><span class="output-badge">Expert Answer</span><span class="output-question">${question}</span></div><div class="output-text"><p>${renderMarkdown(data.answer)}</p></div></div>`;
    }

  } catch (err) {
    section.innerHTML = `<div class="error-card">⚠️ Could not reach the server. Make sure your backend is running on <strong>localhost:3000</strong>.</div>`;
  }

  btn.disabled = false;
}
