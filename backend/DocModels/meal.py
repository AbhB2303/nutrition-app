from pydantic import BaseModel
from typing import Optional
import datetime


class MealModel(BaseModel):
    MealName: str = None
    email: str = None
    MealIngredients: list = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    Nutrients: Optional[dict] = None

    def to_dict(self):
        return {
            "MealName": self.MealName,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "Nutrients": self.Nutrients,
            "MealIngredients": self.MealIngredients,
        }

    def __str__(self):
        return str(self.to_dict())
