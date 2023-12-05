from pydantic import BaseModel
from typing import Optional
import datetime
from pydantic.fields import Field


class UserModel(BaseModel):
    username: str = Field(alias="username", default="")
    email: str = Field(alias="email", default="")
    age: Optional[int] = Field(alias="age", default=None)
    location: str = Field(alias="location", default="")
    weight: Optional[int] = Field(alias="weight", default=None)
    height: Optional[int] = Field(alias="height", default=None)
    id: str = Field(alias="_id", default="")
    meals: list = Field(alias="meals", default=[])
    goals: str = Field(alias="goals", default="")

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "age": self.age,
            "location": self.location,
            "weight": self.weight,
            "height": self.height,
            "meals": self.meals,
            "goals": self.goals,
        }

    def __str__(self):
        return str(self.to_dict())
