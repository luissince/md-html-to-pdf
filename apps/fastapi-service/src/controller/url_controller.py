from fastapi import APIRouter
import requests
from src.services import url_service
from src.model.base.body import Body

router = APIRouter()

@router.post("/pdf")
async def pdf(body: Body):
    return await url_service.pdf(body)