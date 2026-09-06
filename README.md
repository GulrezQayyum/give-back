# GiveBack

> **Give what you have. Find what you need.**  
> An AI-powered generosity platform connecting people who can give time, skills, knowledge, or resources with those who need help.

[![Google AI](https://img.shields.io/badge/Powered%20By-Google%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## Challenge Submission

This project is built for the **DEV Challenge: Generosity Edition**. 

GiveBack aligns with the competition's core mission: showcasing how technology can foster accountable, non-monetary giving by directly connecting human needs with available community skills and resources.

---

## Overview

Generosity isn't limited to money. People often have valuable skills, experience, or available time to mentor, support, or collaborate—while others are stuck looking for help on specific challenges.

**GiveBack** replaces generic donation tools with an **AI Matching Engine**. Users describe what they can give or what they need in plain natural language. Google Gemini extracts structured intents, and semantic embeddings match complementary offers and requests with clear explanations of **"Why this match?"**

---

## Features

- **Google AI Structured Extraction:** Gemini processes free-form descriptions to extract category, specific skills/technologies, and availability or urgency.
- **Semantic Vector Matching:** Employs cosine similarity over vector embeddings to calculate exact capability match percentages.
- **"Why This Match?" Explanations:** Generates transparent, human-readable explanations detailing why two entries complement each other.
- **Modern Responsive UI:** Built with React, Tailwind CSS, and Lucide Icons.
- **Real-time Matching:** Instant matches when offers or requests are posted.

---

## Core Architecture

```
User Input (Natural Language)
            │
            ▼
Google Gemini AI
(Structured Extraction)
            │
     ┌──────┴──────────────┐
     ▼                      ▼
  Category           Skills + Availability
     │                      │
     └──────────┬───────────┘
                ▼
        Vector Embedding
                │
                ▼
        Cosine Similarity
        (Match %)
                │
                ▼
        Best Matches
                │
                ▼
    "Why This Match?"
        (AI Explanation)
```

---

## Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library

### Backend
- **Python 3.10+** — Language
- **FastAPI** — Modern async web framework
- **Pydantic** — Data validation
- **Uvicorn** — ASGI server

### AI & ML
- **Google GenAI SDK** — Gemini API integration
  - `gemini-2.5-flash` — Fast structured extraction
  - `text-embedding-004` — Vector embeddings

### Deployment
- **Vercel** (Frontend)
- **Render** (Backend)
- **Git / GitHub** (Version control)

---

## Quick Start

### Prerequisites

- **Node.js** `18+`
- **Python** `3.10+`
- **Google Gemini API Key** — Get it free from [Google AI Studio](https://aistudio.google.dev/)

---

### 1. Backend Setup

```bash
# Clone and enter the project
git clone https://github.com/GulrezQayyum/give-back.git
cd give-back/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your API key (or use .env file)
export GEMINI_API_KEY="your-google-gemini-api-key"

# Start the server
uvicorn main:app --reload --port 8000
```

**Backend will be available at:**
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

In a **new terminal**:

```bash
# Navigate to frontend
cd give-back/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

---

## API Endpoints

### Create an Offer
```bash
POST /api/offers
Content-Type: application/json

{
  "name": "Alex Chen",
  "description": "I know Flutter and can spend 3 hours this weekend helping someone build their first mobile app."
}
```

### Create a Request
```bash
POST /api/requests
Content-Type: application/json

{
  "name": "Jordan Smith",
  "description": "I'm stuck with Firebase authentication in my Flutter project and need help debugging."
}
```

Both endpoints return:
- `data`: The created offer/request with extracted intent
- `matches`: Array of best matches with explanations

---

## Repository Structure

```
give-back/
├── backend/
│   ├── main.py              # FastAPI app + Gemini integration
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component (all screens)
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Tailwind imports
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite config
│   ├── tailwind.config.js   # Tailwind config
│   ├── postcss.config.js    # PostCSS config
│   └── package.json         # Node dependencies
└── README.md
```

---

## How It Works

### 1. User Describes (Natural Language)
User enters a free-form description of what they can offer or request.

### 2. Gemini Extracts Structure
Gemini API parses the description and extracts:
- **Category** (skills, time, resources, knowledge)
- **Specific Skills** (Flutter, Firebase, mentoring, etc.)
- **Availability/Urgency** (3 hours this weekend, ASAP, etc.)

### 3. Embeddings & Matching
- Description is converted to a vector embedding
- Cosine similarity compares against all offers/requests
- Matches are ranked by similarity score (0–100%)

### 4. AI Explanation
For each match, Gemini generates a brief explanation:
> "Ahmed offers Flutter mentoring and has experience with Firebase, which closely matches your request for help building and debugging a Flutter application."

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on [Render.com](https://render.com)
3. Point to `/backend` directory
4. Set environment variable: `GEMINI_API_KEY`
5. Deploy

Update `frontend/src/App.jsx` with the deployed backend URL:
```javascript
const API_BASE = 'https://giveback-api.render.com/api';
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
GEMINI_API_KEY=your-google-gemini-api-key-here
```

**Never commit `.env` to version control.**

---

## Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit pull requests with improvements
- Suggest new features

---

## License

This project is open source and available under the MIT License.

---

## Built For

**DEV Challenge: Generosity Edition**  
Showcasing how AI can enable non-monetary community giving.

---

**Made with love by Gulrez**  
[GitHub](https://github.com/GulrezQayyum) | [Portfolio](https://dev.to/gulrez)
