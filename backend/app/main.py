from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine
from app.routers import equipment

@asynccontextmanager
async def lifespan(app):
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    yield
    engine.dispose()

app = FastAPI(title="Order and Inventory Anomaly Detection", lifespan=lifespan)
app.include_router(equipment.router)

@app.get("/api/health")
def health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
