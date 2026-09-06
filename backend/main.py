import os
import math
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer

app = FastAPI(title="GiveBack API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google GenAI client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# Local embedding model fallback
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# In-memory storage for MVP
offers_db = []
requests_db = []
id_counter = {"offer": 1, "request": 1}

# --- Pydantic Data Models ---
class StructuredIntent(BaseModel):
    category: str
    skills: List[str]
    availability_or_urgency: str

class EntityInput(BaseModel):
    name: str
    contact: str
    description: str

class MatchResult(BaseModel):
    id: int
    name: str
    contact: str
    description: str
    category: str
    skills: List[str]
    availability_or_urgency: str
    match_percentage: int
    explanation: str

# --- Helper Functions ---
def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def extract_structured_info(description: str, entity_type: str) -> StructuredIntent:
    prompt = f"""
    Analyze this description of a generosity {entity_type}:
    "{description}"
    
    Extract the following structured fields:
    - category (e.g., skills, time, resources, knowledge)
    - skills (list of relevant technologies, topics, or resources mentioned)
    - availability_or_urgency (if offer, describe availability; if request, describe urgency or timeline)
    """
    
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=StructuredIntent,
                ),
            )
            return StructuredIntent.model_validate_json(response.text)
        except Exception:
            time.sleep(1)

    return StructuredIntent(
        category="general",
        skills=[entity_type],
        availability_or_urgency="flexible"
    )

def get_embedding(text: str) -> List[float]:
    return embedder.encode(text).tolist()

def generate_explanation(source_desc: str, target_desc: str, score: int) -> str:
    prompt = f"""
    Explain concisely (1-2 sentences) why these two descriptions match with a similarity of {score}%.
    Description A: "{source_desc}"
    Description B: "{target_desc}"
    Highlight specific overlapping skills, resources, or timing.
    """
    
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text.strip()
        except Exception:
            time.sleep(1)

    return f"This match has a {score}% semantic capability and skill similarity."

# --- Endpoints ---
@app.post("/api/offers")
def create_offer(payload: EntityInput):
    intent = extract_structured_info(payload.description, "offer")
    embedding = get_embedding(f"{payload.description} {' '.join(intent.skills)}")
    
    item_id = id_counter["offer"]
    id_counter["offer"] += 1
    
    record = {
        "id": item_id,
        "name": payload.name,
        "contact": payload.contact,
        "description": payload.description,
        "category": intent.category,
        "skills": intent.skills,
        "availability_or_urgency": intent.availability_or_urgency,
        "embedding": embedding
    }
    offers_db.append(record)

    matches = []
    for req in requests_db:
        sim = cosine_similarity(embedding, req["embedding"])
        score = int(round(sim * 100))
        if score > 20:
            explanation = generate_explanation(payload.description, req["description"], score)
            matches.append(MatchResult(
                id=req["id"],
                name=req["name"],
                contact=req.get("contact", "N/A"),
                description=req["description"],
                category=req["category"],
                skills=req["skills"],
                availability_or_urgency=req["availability_or_urgency"],
                match_percentage=score,
                explanation=explanation
            ))
    
    matches.sort(key=lambda x: x.match_percentage, reverse=True)
    return {"data": record, "matches": matches}

@app.post("/api/requests")
def create_request(payload: EntityInput):
    intent = extract_structured_info(payload.description, "request")
    embedding = get_embedding(f"{payload.description} {' '.join(intent.skills)}")
    
    item_id = id_counter["request"]
    id_counter["request"] += 1
    
    record = {
        "id": item_id,
        "name": payload.name,
        "contact": payload.contact,
        "description": payload.description,
        "category": intent.category,
        "skills": intent.skills,
        "availability_or_urgency": intent.availability_or_urgency,
        "embedding": embedding
    }
    requests_db.append(record)

    matches = []
    for offer in offers_db:
        sim = cosine_similarity(embedding, offer["embedding"])
        score = int(round(sim * 100))
        if score > 20:
            explanation = generate_explanation(payload.description, offer["description"], score)
            matches.append(MatchResult(
                id=offer["id"],
                name=offer["name"],
                contact=offer.get("contact", "N/A"),
                description=offer["description"],
                category=offer["category"],
                skills=offer["skills"],
                availability_or_urgency=offer["availability_or_urgency"],
                match_percentage=score,
                explanation=explanation
            ))
    
    matches.sort(key=lambda x: x.match_percentage, reverse=True)
    return {"data": record, "matches": matches}