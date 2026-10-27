import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import create_engine, text

engine = create_engine(os.getenv("DATABASE_URL", "sqlite:///./orders.db"), connect_args={"check_same_thread": False})

@asynccontextmanager
async def lifespan(app):
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    yield
    engine.dispose()

app = FastAPI(title="Order and Inventory Anomaly Detection", lifespan=lifespan)

@app.get("/api/health")
def health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
