import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from views import *
from extensions import db, ma, jwt, mail, migrate   # import extensions here
from models import Role, User, UserRoles, ProductCategory, BaseUnit, Product, ProductStock, Sale, ProductSale


# Load environment variables from .env
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)
    migrate.init_app(app, db)



    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(role_bp)
    app.register_blueprint(user_type_bp)
    app.register_blueprint(base_unit_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(product_category_bp)
    app.register_blueprint(product_stock_bp)
    app.register_blueprint(product_sale_bp)
    app.register_blueprint(sale_bp)
    app.register_blueprint(reports_bp)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
