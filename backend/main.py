import datetime
import os
from flask_cors import CORS
from flask import Flask, request
from DocModels.recordedMeal import RecordedMeal
from db import MongoDB
from flask import jsonify
import requests
import json
from DocModels.meal import MealModel
from DocModels.user import UserModel


def create_app():
    # create and configure the app
    app = Flask(__name__)

    # enable CORS
    CORS(app, resources={r'/*': {'origins': '*'}})

    client_origin_url = os.environ.get("CLIENT_ORIGIN_URL")
    MONGO_URI = os.environ.get("MONGO_URI")

    if not MONGO_URI or not client_origin_url:
        raise ValueError(
            "Please set MONGO_URI and CLIENT_ORIGIN_URL environment variables")

    with app.app_context():
        mongo = MongoDB(MONGO_URI)
        mongo.init_app(app)
        app.mongo = mongo

    # a simple page that says hello
    @app.route('/food_categories')
    def get_categories():
        foods = app.mongo.get_categories()
        return jsonify(foods)

    @app.route('/foods/<category>')
    def get_foods(category):
        foods = app.mongo.get_foods(category)
        # print(foods)
        return jsonify(foods)

    @app.route('/serving_size/', methods=['POST'])
    def get_serving_size():
        item_name = request.form['item_name']
        print(item_name)
        ndb_no = app.mongo.get_ingredient_number(item_name)
        serving_size = app.mongo.get_serving_size(ndb_no)
        print(serving_size)
        return jsonify(serving_size)

    @app.route('/scan/<upc>')
    def get_nutrition_info(upc):
        headers = {
            'x-app-id': "f8499843",
            'x-app-key': "6122254cc1b366d473e77828810a74b7",
            'x-remote-user-id': '0',
        }

        url = "https://trackapi.nutritionix.com/v2/search/item?upc=" + upc
        response = requests.request("GET", url, headers=headers)
        json_data = json.loads(response.text)
        return json_data

    @app.route('/save_meal/<email>', methods=['POST'])
    def save_meals(email):
        # get nutrients for meal
        ingredients = json.loads(request.form['MealIngredients'])
        print(ingredients)
        meal = MealModel(created_at=datetime.datetime.now(
        ), updated_at=datetime.datetime.now(), email=email, MealIngredients=ingredients, MealName=request.form['MealName'])
        try:
            meals = app.mongo.save_meal(meal.to_dict())
            return meals
        except Exception as e:
            print(e)
            return jsonify({"message": "Error saving meal"}), 500

    @app.route('/get_meals/<email>', methods=['GET'])
    def get_meals(email):
        try:
            meals = app.mongo.get_meals(email)
            return jsonify(meals)
        except Exception as e:
            print(e)
            return jsonify({"message": "Error getting meals"}), 500

    @app.route('/get_meal_nutrients/<email>/<meal_id>', methods=['GET'])
    def get_meal_nutrients(meal_id, email):
        meal = app.mongo.get_meal(meal_id, email)
        nutrients_data = []
        for ingredient in meal["MealIngredients"]:
            ndb_no = app.mongo.get_ingredient_number(ingredient["Long_Desc"])
            nutrients_data.append(app.mongo.get_nutrients(
                ndb_no, ingredient["weight_in_grams"], ingredient["serving_size"], serving_size_unit=ingredient["unit_name"]))
        return jsonify(nutrients_data)

    @app.route('/get_all_meal_with_nutrients/<email>', methods=['GET'])
    def get_all_meal_with_nutrients(email):
        meals = app.mongo.get_meals(email)
        meals_data = []
        for meal in meals:
            all_nutrient_total = {}
            for ingredient in meal["MealIngredients"]:
                ndb_no = app.mongo.get_ingredient_number(
                    ingredient["Long_Desc"])
                nutrients = app.mongo.get_nutrients(
                    ndb_no, ingredient["weight_in_grams"], ingredient["serving_size"], serving_size_unit=ingredient["unit_name"])
                # add nutrients in loop
                nutrients = nutrients[0]["nutrient_info"]
                for nutrient in nutrients:
                    if nutrient["Label"] in all_nutrient_total:
                        all_nutrient_total[nutrient
                                           ["Label"]] += nutrient["Total"]
                    else:
                        all_nutrient_total[nutrient
                                           ["Label"]] = nutrient["Total"]
            meals_data.append({"meal": meal, "nutrients": all_nutrient_total})
        return jsonify(meals_data)

    @app.route('/create_user', methods=['POST'])
    def create_user():
        user = UserModel(**request.form)
        try:
            user = app.mongo.save_user(user.to_dict())
        except Exception as e:
            print(e)
            return jsonify({"message": "Error saving user"}), 500
        return {"message": "User saved successfully"}

    @app.route('/get_user/<email>', methods=['GET'])
    def get_user(email):
        try:
            user = app.mongo.get_user_from_email(email)
            return jsonify(user)
        except Exception as e:
            print(e)
            return jsonify({"message": "Error getting user"}), 500

    @app.route('/record_meal', methods=['POST'])
    def record_meal():
        date = datetime.datetime.strptime(
            request.form["date"], '%a, %d %b %Y %H:%M:%S %Z')
        time = datetime.datetime.strptime(
            request.form["time"], '%a, %d %b %Y %H:%M:%S %Z')

        meal = RecordedMeal(
            date=date, time=time, email=request.form["email"], meal_id=request.form["meal_id"])
        print(meal)
        try:
            meal = app.mongo.record_meal(meal.to_dict())
        except Exception as e:
            print(e)
            return jsonify({"message": "Error saving meal"}), 500
        return {"message": "Meal saved successfully"}

    @app.route('/get_recorded_meals/<email>', methods=['GET'])
    def get_recorded_meals(email):
        try:
            meals = app.mongo.get_recorded_meals(email)
            return meals
        except Exception as e:
            print(e)
            return jsonify({"message": "Error getting meals"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    print(" Starting app...")
    app.run(host="0.0.0.0", port=4200)
