from datetime import datetime, timedelta

from app.database import Base, SessionLocal, engine
from app.models import (
    Complaint,
    Department,
    Incident,
    IncidentEvidence,
)
from app.ai import (
    analyze_text,
    create_embedding,
    embedding_to_json,
)

Base.metadata.create_all(bind=engine)

db = SessionLocal()

departments = [
    ("WATER", "Water Department"),
    ("ROADS", "Roads Department"),
    ("ELECTRICITY", "Electricity Department"),
    ("SANITATION", "Sanitation Department"),
]

for code, name in departments:
    exists = (
        db.query(Department)
        .filter(Department.code == code)
        .first()
    )

    if not exists:
        db.add(
            Department(
                code=code,
                name=name,
            )
        )

db.commit()

water_department = (
    db.query(Department)
    .filter(Department.code == "WATER")
    .first()
)

incident = (
    db.query(Incident)
    .filter(
        Incident.title == "Water Supply Outage"
    )
    .first()
)

if not incident:
    incident = Incident(
        title="Water Supply Outage",
        category="water_supply",
        status="emerging",
        priority="high",
        department_id=water_department.id,
        latitude=19.1197,
        longitude=72.8468,
        display_name="Andheri East, Mumbai",
        report_count=47,
        baseline_count=4,
        growth_multiplier=10.7,
        ai_confidence=0.93,
        detected_at=datetime.utcnow() - timedelta(hours=4),
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    evidence = [
        (
            "semantic",
            "Similar descriptions",
            0.91,
        ),
        (
            "geographic",
            "Same geographic area",
            0.94,
        ),
        (
            "temporal",
            "Sudden increase in reports",
            0.97,
        ),
    ]

    for evidence_type, label, score in evidence:
        db.add(
            IncidentEvidence(
                incident_id=incident.id,
                evidence_type=evidence_type,
                label=label,
                score=score,
            )
        )

    db.commit()

texts = [
    "There has been no water in our area since yesterday.",
    "Paani nahi aa raha hai in our building.",
    "Water supply has stopped near the main road.",
    "No water supply for three days in Andheri East.",
    "The pipeline is leaking near our society.",
]

for index, text in enumerate(texts):
    tracking_id = f"NR-DEMO{index + 1}"

    exists = (
        db.query(Complaint)
        .filter(Complaint.tracking_id == tracking_id)
        .first()
    )

    if exists:
        continue

    analysis = analyze_text(text)
    embedding = create_embedding(
        analysis["normalized_text"]
    )

    complaint = Complaint(
        tracking_id=tracking_id,
        original_text=text,
        normalized_text=analysis["normalized_text"],
        detected_language=analysis["language"],
        category=analysis["category"],
        category_label=analysis["category_label"],
        priority=analysis["priority"],
        priority_score=analysis["priority_score"],
        ai_confidence=analysis["confidence"],
        latitude=19.1197 + index * 0.001,
        longitude=72.8468 + index * 0.001,
        display_name="Andheri East, Mumbai",
        embedding=embedding_to_json(embedding),
        status="investigating",
        incident_id=incident.id,
        department_id=water_department.id,
        is_duplicate=False,
        created_at=datetime.utcnow() - timedelta(minutes=index * 12),
    )

    db.add(complaint)

db.commit()
db.close()

print("Seed data inserted successfully.")