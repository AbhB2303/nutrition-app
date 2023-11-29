from pydantic import BaseModel
from typing import Optional
import datetime
from pydantic.fields import Field


class UserModel(BaseModel):
    username: str = Field(alias="username", default="")
    email: str = Field(alias="email", default="")
    age: int = Field(alias="age", default="")
    location: str = Field(alias="location", default="")
    weight: int = Field(alias="weight", default="")
    height: int = Field(alias="height", default="")
    id: str = Field(alias="_id", default="")
    meals: list = Field(alias="meals", default=[])

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "age": self.age,
            "location": self.location,
            "weight": self.weight,
            "height": self.height,
            "meals": self.meals,
        }

    def __str__(self):
        return str(self.to_dict())
