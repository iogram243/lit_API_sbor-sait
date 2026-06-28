from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routers import auth, dashboard, settings

ROOT_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = ROOT_DIR / "frontend"

app = FastAPI(title="Lit Analytics Prototype", version="0.1.0")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

app.mount("/static", StaticFiles(directory=FRONTEND_DIR / "static"), name="static")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/dashboard")
def dashboard_page():
    return FileResponse(FRONTEND_DIR / "dashboard.html")
