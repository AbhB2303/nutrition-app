import datetime
from flask import jsonify
from pymongo import MongoClient
import os
from bson import ObjectId
from DocModels.user import UserModel

# Unique Id used is email not objectid

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
    
    # gets the broad categories to pick from
    def get_categories(self):
        NUTRITION_DB = self.client.NutritionDB
        pipeline = [
            {"$group": {"_id": "$FdGrp_desc", "FdGrp_Cd": {"$first": "$FdGrp_Cd"}}},
            {"$sort": {"_id": 1}},
        ]
        aggregate = NUTRITION_DB.FD_GROUP.aggregate(pipeline)
        return list(aggregate)

    # inserts a meal submitted by a user
    def save_meal(self, meal):
        NUTRITION_DB = self.client.NutritionDB
        try:
            NUTRITION_DB.Meals.insert_one(meal)
            # insert meal into user's meals
            NUTRITION_DB.Users.update_one(
                {"email": meal["email"]},
                {"$push": {"meals": meal["_id"]}}
            )
        except Exception as e:
            print(e)
            return jsonify({"error": "Meal not saved"})
        return jsonify({"message": "Meal saved successfully"})

    # get all the meals of a user
    def get_meals(self, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meals = NUTRITION_DB.Meals.find({"email": email})
            meals = list(meals)
            for meal in meals:
                meal["_id"] = str(meal["_id"])
            return list(meals)
        except Exception as e:
            print(e)
            return jsonify({"error": "Meals not found"})

    # get a single meal for a user
    def get_meal(self, meal_id, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meal = NUTRITION_DB.Meals.find_one({"_id": ObjectId(meal_id)})
            if meal is not None:
                meal["_id"] = str(meal["_id"])
                return meal
        except Exception as e:
            print(e)
            return jsonify({"error": "Meal not found"})

    # helper function: return USDA ingredient number
    def get_ingredient_number(self, ingredient):
        NUTRITION_DB = self.client.NutritionDB
        try:
            ingredient = NUTRITION_DB.FOOD_DES.find_one(
                {"Long_Desc": ingredient})
            if ingredient is not None:
                ndb_no = ingredient["NDB_No"]
                return ndb_no
        except Exception as e:
            print(e)
            return jsonify({"error": "Ingredient not found"})

    # get nutrients based on USDA number
    def get_nutrients(self, ingredient, weight, servings, serving_size_unit):
        NUTRITION_DB = self.client.NutritionDB
        try:
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
                # Total = (nutr_val * weight) / 100 in grams
                nutrient_info.append({
                    "Total": round(((float(Nutr_val) * float(weight)) / 100) * float(servings), 2),
                    "Label": Nutr_Desc["NutrDesc"],
                    "Units": Nutr_Desc["Units"],
                })
            info = [{'nutrient_info': nutrient_info},
                    {'serving_size': servings, 'serving_size_unit': serving_size_unit}]
            return info
        except Exception as e:
            print(e)
            return jsonify({"error": "Meal not saved"})

    # returns all available foods
    # breaks USDA Long_Desc field by comma to create dict of item and types
    def get_foods(self, category):
        NUTRITION_DB = self.client.NutritionDB
        # pipeline to get all foods in a category
        pipeline = [
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
            {"$sort": {"_id": 1, "types": 1}},
        ]
        aggregate = NUTRITION_DB.FOOD_DES.aggregate(pipeline)
        return list(aggregate)

    # based on USDA number, returns weight in grams
    def get_serving_size(self, ndb_no):
        NUTRITION_DB = self.client.NutritionDB
        pipeline = [
            {"$match": {"NDB_No": ndb_no}},
            {"$group": {"_id": {"Msre_Desc": "$Msre_Desc", "Gm_Wgt": "$Gm_Wgt"}}}
        ]
        aggregate = NUTRITION_DB.WEIGHT.aggregate(pipeline)
        return list(aggregate)

    # inserts user if record doesn't exist for update
    def save_user(self, user):
        NUTRITION_DB = self.client.NutritionDB
        print(user)
        try:
            update = NUTRITION_DB.Users.find_one({"email": user["email"]})
            if update is not None:
                NUTRITION_DB.Users.update_one(
                    {"email": user["email"]},
                    {"$set": {
                        "username": user["username"],
                        "age": user["age"],
                        "location": user["location"],
                        "weight": user["weight"],
                        "height": user["height"],
                        "goals": user["goals"],
                    }}
                )
            else:
                NUTRITION_DB.Users.insert_one(user)
        except Exception as e:
            print(e)
        return jsonify({"message": "User saved successfully"})

    # gets user by email
    def get_user_from_email(self, email):
        NutritionDB = self.client.NutritionDB
        try:
            user = NutritionDB.Users.find_one({"email": email})
            if user is not None:
                user.pop("meals")
                user.pop("_id")
                user = UserModel(**user)
                return user.to_dict()
        except Exception as e:
            print(e)
            return jsonify({"error": "user not found from email"})

    def record_meal(self, meal):
        NUTRITION_DB = self.client.NutritionDB
        try:
            NUTRITION_DB.RecordedMeals.insert_one(meal)
        except Exception as e:
            print(e)

    def get_recorded_meals(self, email):
        NUTRITION_DB = self.client.NutritionDB
        try:
            meals = NUTRITION_DB.RecordedMeals.find({"email": email})
            meals = list(meals)
            for meal in meals:
                meal["_id"] = str(meal["_id"])
                meal["date"] = datetime.datetime.strptime(
                    meal["date"].strftime("%a, %d %b %Y") + " " + meal["time"].strftime("%H:%M:%S"), '%a, %d %b %Y %H:%M:%S')
                
            meals = sorted(meals, key=lambda k: k['date'])

            return jsonify(meals)
        except Exception as e:
            print(e)
