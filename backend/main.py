import os
from flask_cors import CORS
from flask import Flask
from db import MongoDB
from flask import jsonify


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
        return jsonify(foods)

    return app


app = create_app()

if __name__ == "__main__":
    #    app = create_app()
    print(" Starting app...")
    app.run(host="0.0.0.0", port=5000)
