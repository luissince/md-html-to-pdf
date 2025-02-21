from pydantic import BaseModel

class Margin(BaseModel):
    top: int
    bottom: int
    left: int
    right: int