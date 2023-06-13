from pydantic import BaseModel
from typing import Union


class generate_web(BaseModel):
    text: Union[str, None] = None

    class Config:
        orm_mode = True
