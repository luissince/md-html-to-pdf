from pydantic import BaseModel
from typing import Optional
from src.model.base.margin import Margin
from src.model.enum.size import Size

class Body(BaseModel):
    title: str
    content: str
    css: str
    size: Optional[Size] | None = None
    width: Optional[str] = None
    height: Optional[str] = None
    margin: Margin