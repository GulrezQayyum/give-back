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
- **Semantic Vector Matching:** Employs cosine similarity over vector embeddings (`all-MiniLM-L6-v2` / Gemini Embeddings) to calculate exact capability match percentages.
- **"Why This Match?" Explanations:** Generates transparent, human-readable explanations detailing why two entries complement each other.
- **Direct Connection Bar:** Includes a one-click contact copy bar and mail triggers to let users get in touch instantly.
- **Modern Dark UI:** Responsive interface built with React, Tailwind CSS, and Lucide Icons.

---

## Core Architecture

User Description (Natural Language)
│
▼
Google Gemini AI (3.6-Flash)
│
├──────► Structured Intent / Category / Skills / Availability
│
▼
Semantic Embeddings & Cosine Matching
│
▼
Best Complementary Matches (% Score)
│
▼
"Why this match?" Transparent AI Explanation


---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend
- Python
- FastAPI
- Pydantic
- Uvicorn

### AI & ML
- Google GenAI SDK (`gemini-3.6-flash`)
- Sentence-Transformers (Vector Embeddings)

### Deployment & Tooling
- Git
- VS Code

---

## Quick Start

### Prerequisites

- Node.js `18+`
- Python `3.10+`
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.dev/)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
export GEMINI_API_KEY="your-google-gemini-api-key"

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

---

## Repository Structure

give-back/
├── backend/
│ ├── main.py # FastAPI application & Gemini integration
│ └── requirements.txt # Python dependencies
├── frontend/
│ ├── src/
│ │ ├── App.jsx # Primary UI Application Component
│ │ ├── main.jsx # React DOM entrypoint
│ │ └── index.css # Tailwind CSS imports
│ ├── index.html
│ ├── postcss.config.js # PostCSS configuration
│ ├── tailwind.config.js # Tailwind configuration
│ └── package.json # Node dependencies
└── README.md

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.