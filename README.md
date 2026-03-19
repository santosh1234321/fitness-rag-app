# FitGuide AI — RAG-Powered Fitness Assistant

A full-stack AI fitness assistant that answers questions about workouts, nutrition, and recovery using a custom RAG (Retrieval-Augmented Generation) pipeline.

## What is RAG?
Instead of relying purely on an AI model's training data, RAG retrieves relevant chunks from your own document (the fitness manual) and injects them into the prompt. This means answers are grounded in your specific knowledge base, not generic AI responses.

## Tech Stack
- **Frontend** — HTML, CSS, Vanilla JS
- **Backend** — Node.js, Express
- **AI** — Gemini 2.5 Flash (Google Generative AI)
- **Retrieval** — Custom keyword-based RAG pipeline

## Project Structure
```
fitness-rag-app/
├── client/
│   ├── index.html       # UI
│   ├── style.css        # Styling
│   └── script.js        # Frontend logic
├── server/
│   ├── server.js        # Express server + Gemini API
│   ├── rag.js           # Retrieval logic
│   └── data-loader.js   # Loads and chunks the fitness manual
├── data/
│   └── fitness.txt      # Fitness knowledge base
└── package.json
```

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/santosh1234321/fitness-rag-app.git
cd fitness-rag-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Gemini API key
Open `server/server.js` and replace:
```js
const API_KEY = "YOUR_GEMINI_API_KEY";
```
Get a free key at [aistudio.google.com](https://aistudio.google.com)

### 4. Run the server
```bash
node server/server.js
```

### 5. Open the app
Open `client/index.html` in your browser.

## How It Works
1. The fitness manual is loaded and split into chunks
2. When a question is asked, the RAG pipeline scores each chunk by keyword relevance
3. The top 5 most relevant chunks are injected into the Gemini prompt as context
4. Gemini answers based on that context, not generic training data

## Features
- Ask anything about muscle groups, exercises, nutrition, recovery
- Quick-topic chips for fast access to common questions
- Animated loading state
- Clean dark UI with responsive design
