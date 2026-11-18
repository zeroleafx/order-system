from typing import Annotated

from fastapi import APIRouter, Depends, Path, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Equipment


class EquipmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    equipment_id: int
    name: str
    category: str
    daily_rate: int
    description: str
    is_listed: bool


class EquipmentError(BaseModel):
    error_code: str
    message: str
    details: dict[str, int]


class EquipmentRoute(APIRoute):
    def get_route_handler(self):
        handle_request = super().get_route_handler()

        async def handle_equipment_request(request: Request):
            try:
                return await handle_request(request)
            except RequestValidationError:
                return JSONResponse(
                    status_code=422,
                    content={
                        "error_code": "validation_error",
                        "message": "器材編號必須是有效的正整數",
                        "details": {},
                    },
                )

        return handle_equipment_request


router = APIRouter(prefix="/api/v1/equipment", tags=["equipment"], route_class=EquipmentRoute)
DatabaseSession = Annotated[Session, Depends(get_db)]
EquipmentId = Annotated[int, Path(ge=1, le=2**63 - 1)]


@router.get("", response_model=list[EquipmentRead])
def list_equipment(db: DatabaseSession):
    query = select(Equipment).where(Equipment.is_listed.is_(True)).order_by(Equipment.equipment_id)
    return db.scalars(query).all()


@router.get(
    "/{equipment_id}",
    response_model=EquipmentRead,
    responses={404: {"model": EquipmentError}, 422: {"model": EquipmentError}},
)
def get_equipment(equipment_id: EquipmentId, db: DatabaseSession):
    query = select(Equipment).where(
        Equipment.equipment_id == equipment_id,
        Equipment.is_listed.is_(True),
    )
    equipment = db.scalar(query)
    if equipment is None:
        return JSONResponse(
            status_code=404,
            content={
                "error_code": "equipment_not_found",
                "message": "找不到上架的器材",
                "details": {"equipment_id": equipment_id},
            },
        )
    return equipment
