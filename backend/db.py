from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import os


class MongoDB:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)
        self.client = None

    def init_app(self, app):
        MONGO_URI = os.environ.get("MONGO_URI")
        self.client = MongoClient(MONGO_URI)
        print("MongoDB initialized")

    def get_client(self):
        return self.client

    def get_categories(self):
        NUTRITION_DB = self.client.NutritionDB
        pipeline = [
            {"$group": {"_id": "$FdGrp_desc", "FdGrp_Cd": {"$first": "$FdGrp_Cd"}}},
        ]
        aggregate = NUTRITION_DB.FD_GROUP.aggregate(pipeline)
        return list(aggregate)

    def get_foods(self, category):
        NUTRITION_DB = self.client.NutritionDB
        pipeline = [
            # Only include documents with FdGrp_Cd equal to the specified category
            {"$match": {"FdGrp_Cd": int(category)}},
            {"$group": {"_id": "$Long_Desc"}},
            {"$project": {
                "food": {
                    "$substr": [
                        "$_id",
                        0,
                        {
                            "$indexOfCP": ["$_id", ","],
                        },
                    ],
                },
                "types": {
                    "$substr": [
                        "$_id",
                        {
                            "$add": [
                                {
                                    "$indexOfCP": ["$_id", ","],
                                },
                                2,
                            ],
                        },
                        {"$strLenCP": "$_id"},
                    ],
                },
            }},
            {"$group": {"_id": "$food", "types": {"$push": "$types"}}},
        ]
        aggregate = NUTRITION_DB.FOOD_DES.aggregate(pipeline)
        return list(aggregate)
