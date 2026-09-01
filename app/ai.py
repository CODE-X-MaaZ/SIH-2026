import json
import re
from functools import lru_cache
from typing import Optional

import numpy as np
from langdetect import detect, LangDetectException
from sentence_transformers import SentenceTransformer


CATEGORY_RULES = {
    "water_supply": {
        "label": "Water Supply",
        "department": "WATER",
        "keywords": [
            "water",
            "paani",
            "पानी",
            "pipeline",
            "leak",
            "leakage",
            "supply",
            "sewage",
            "drain",
            "नल",
        ],
    },
    "road_damage": {
        "label": "Road Damage",
        "department": "ROADS",
        "keywords": [
            "road",
            "सड़क",
            "sadak",
            "pothole",
            "गड्ढा",
            "footpath",
            "bridge",
            "pavement",
        ],
    },
    "electricity": {
        "label": "Electricity",
        "department": "ELECTRICITY",
        "keywords": [
            "electricity",
            "बिजली",
            "bijli",
            "power",
            "light",
            "transformer",
            "wire",
            "outage",
        ],
    },
    "garbage": {
        "label": "Garbage and Sanitation",
        "department": "SANITATION",
        "keywords": [
            "garbage",
            "कचरा",
            "kachra",
            "waste",
            "dustbin",
            "dirty",
            "sanitation",
        ],
    },
}


URGENCY_RULES = {
    "critical": [
        "fire",
        "आग",
        "accident",
        "दुर्घटना",
        "collapse",
        "danger",
        "hospital",
        "electrocution",
        "life threatening",
    ],
    "high": [
        "flood",
        "बाढ़",
        "no water",
        "no power",
        "major",
        "overflow",
        "emergency",
        "unsafe",
    ],
    "medium": [
        "broken",
        "leak",
        "not working",
        "delay",
        "damaged",
    ],
}


@lru_cache(maxsize=1)
def get_embedding_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def detect_language(text: str) -> str:
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"


def normalize_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text


def create_embedding(text: str) -> list[float]:
    model = get_embedding_model()
    vector = model.encode(text, normalize_embeddings=True)
    return vector.tolist()


def cosine_similarity(first: list[float], second: list[float]) -> float:
    a = np.array(first, dtype=float)
    b = np.array(second, dtype=float)

    denominator = np.linalg.norm(a) * np.linalg.norm(b)

    if denominator == 0:
        return 0.0

    return float(np.dot(a, b) / denominator)


def classify_text(text: str) -> dict:
    best_category: Optional[str] = None
    best_score = 0

    for category, rule in CATEGORY_RULES.items():
        score = sum(
            1 for keyword in rule["keywords"]
            if keyword.lower() in text
        )

        if score > best_score:
            best_score = score
            best_category = category

    if best_category is None:
        return {
            "category": "other",
            "category_label": "Other Civic Issue",
            "department": None,
            "subcategory": None,
            "confidence": 0.45,
        }

    rule = CATEGORY_RULES[best_category]
    confidence = min(0.98, 0.60 + best_score * 0.10)

    return {
        "category": best_category,
        "category_label": rule["label"],
        "department": rule["department"],
        "subcategory": None,
        "confidence": round(confidence, 2),
    }


def calculate_priority(text: str, category: Optional[str]) -> dict:
    score = 20

    for level, keywords in URGENCY_RULES.items():
        matches = sum(1 for keyword in keywords if keyword in text)

        if level == "critical":
            score += matches * 25
        elif level == "high":
            score += matches * 15
        elif level == "medium":
            score += matches * 8

    if category in ["water_supply", "electricity"]:
        score += 8

    score = min(score, 100)

    if score >= 75:
        priority = "critical"
    elif score >= 55:
        priority = "high"
    elif score >= 35:
        priority = "medium"
    else:
        priority = "low"

    return {
        "priority": priority,
        "priority_score": score,
    }


def analyze_text(text: str) -> dict:
    normalized = normalize_text(text)
    language = detect_language(text)
    classification = classify_text(normalized)
    priority = calculate_priority(
        normalized,
        classification["category"]
    )

    return {
        "language": language,
        "normalized_text": normalized,
        **classification,
        **priority,
    }


def embedding_to_json(embedding: list[float]) -> str:
    return json.dumps(embedding)


def embedding_from_json(value: Optional[str]) -> Optional[list[float]]:
    if not value:
        return None
    return json.loads(value)


def calculate_distance_meters(
    latitude_1: Optional[float],
    longitude_1: Optional[float],
    latitude_2: Optional[float],
    longitude_2: Optional[float],
) -> Optional[float]:
    if None in (
        latitude_1,
        longitude_1,
        latitude_2,
        longitude_2,
    ):
        return None

    lat_distance = (latitude_1 - latitude_2) * 111_000
    lon_distance = (
        (longitude_1 - longitude_2)
        * 111_000
        * np.cos(np.radians(latitude_1))
    )

    return round(
        float(np.sqrt(lat_distance**2 + lon_distance**2)),
        2,
    )