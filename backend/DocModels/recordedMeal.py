from pydantic import BaseModel
import datetime
from pydantic.fields import Field


class RecordedMeal(BaseModel):
    meal_id: str = None
    time: datetime.datetime = Field(
        alias="time", default=datetime.datetime.now())
    date: datetime.datetime = Field(
        alias="date", default=datetime.datetime.now())
    email: str = None

    def to_dict(self):
        return {
            "meal_id": self.meal_id,
            "time": self.time,
            "email": self.email,
            "date": self.date,
        }

    def __str__(self):
        return str(self.to_dict())
