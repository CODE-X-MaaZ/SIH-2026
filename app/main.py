from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine
from .routers import (
    ai,
    analytics,
    complaints,
    dashboard,
    incidents,
    maps,
    resolution,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nagrik Radar API",
    description="AI-powered civic incident and resolution intelligence backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router)
app.include_router(ai.router)
app.include_router(incidents.router)
app.include_router(dashboard.router)
app.include_router(maps.router)
app.include_router(resolution.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "name": "Nagrik Radar",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}