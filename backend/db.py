import datetime
from flask import jsonify
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import os
from bson import ObjectId
from DocModels.user import UserModel


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

    def save_meal(self, meal):
        NUTRITION_DB = self.client.NutritionDB
        try:
            NUTRITION_DB.Meals.insert_one(meal)
            # insert meal into user's meals
            NUTRITION_DB.Users.update_one(
                {"email": meal["email"]},
                {"$push": {"meals": meal["_id"]}}
            )
        except DuplicateKeyError:
            return DuplicateKeyError
        return jsonify({"message": "Meal saved successfully"})

    def get_meals(self, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meals = NUTRITION_DB.Meals.find({"email": email})
            meals = list(meals)
            for meal in meals:
                meal["_id"] = str(meal["_id"])
            return jsonify(meals)
        except DuplicateKeyError:
            return DuplicateKeyError

    def get_meal(self, meal_id, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meal = NUTRITION_DB.Meals.find_one({"_id": ObjectId(meal_id)})
            if meal is not None:
                meal["_id"] = str(meal["_id"])
                return meal
        except DuplicateKeyError:
            return DuplicateKeyError

    def get_ingredient_number(self, ingredient):
        NUTRITION_DB = self.client.NutritionDB
        try:
            ingredient = NUTRITION_DB.FOOD_DES.find_one(
                {"Long_Desc": ingredient})
            if ingredient is not None:
                ndb_no = ingredient["NDB_No"]
                return ndb_no
        except DuplicateKeyError:
            return DuplicateKeyError

    def get_nutrients(self, ingredient, weight, servings, serving_size_unit):
        NUTRITION_DB = self.client.NutritionDB
        try:
            print(weight)
            nutrients = NUTRITION_DB.NUT_DATA.find({"NDB_No": ingredient})
            nutrients = list(nutrients)
            nutrient_info = []
            for nutrient in nutrients:
                # nutrient description
                Nutr_Desc = NUTRITION_DB.NUTR_DEF.find_one(
                    {"Nutr_no": nutrient["Nutr_No"]})
                Nutr_val = nutrient["Nutr_Val"]

                # nutr_val is the nutrient value per 100 grams,
                # weight is the actual weight of the ingredient in grams
                nutrient_info.append({
                    "Total": ((float(Nutr_val) * float(weight)) / 100) * float(servings),
                    "Label": Nutr_Desc["NutrDesc"],
                    "Units": Nutr_Desc["Units"],
                })
            info = [{'nutrient_info': nutrient_info},
                    {'serving_size': servings, 'serving_size_unit': serving_size_unit}]
            return info
        except DuplicateKeyError:
            return DuplicateKeyError

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
                                1,
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

    def get_serving_size(self, ndb_no):
        NUTRITION_DB = self.client.NutritionDB
        pipeline = [
            {"$match": {"NDB_No": ndb_no}},
            {"$group": {"_id": {"Msre_Desc": "$Msre_Desc", "Gm_Wgt": "$Gm_Wgt"}}}
        ]
        aggregate = NUTRITION_DB.WEIGHT.aggregate(pipeline)
        return list(aggregate)

    def save_user(self, user):
        NUTRITION_DB = self.client.NutritionDB
        try:
            NUTRITION_DB.Users.insert_one(user)
        except DuplicateKeyError:
            return DuplicateKeyError
        return jsonify({"message": "User saved successfully"})

    def get_user_from_email(self, email):
        NutritionDB = self.client.NutritionDB
        try:
            user = NutritionDB.Users.find_one({"email": email})
            if user is not None:
                user.pop("meals")
                user.pop("_id")
                user = UserModel(**user)
                return user.to_dict()
        except DuplicateKeyError:
            return DuplicateKeyError

    def record_meal(self, meal):
        NUTRITION_DB = self.client.NutritionDB
        try:
            NUTRITION_DB.RecordedMeals.insert_one(meal)
        except DuplicateKeyError:
            return DuplicateKeyError

    def get_recorded_meals(self, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meals = NUTRITION_DB.RecordedMeals.find({"email": email})
            meals = list(meals)
            for meal in meals:
                meal["_id"] = str(meal["_id"])
            return jsonify(meals)
        except DuplicateKeyError:
            return DuplicateKeyError
