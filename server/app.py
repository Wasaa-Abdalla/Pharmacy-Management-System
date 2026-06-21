import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from views import *
from extensions import db, ma, jwt, mail, migrate
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

    # ✅ Allow frontend domain + localhost dev
    CORS(app, origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "https://pms-client-stun.onrender.com"
    ])

    migrate.init_app(app, db)

    # ✅ Register blueprints directly under "/"
    app.register_blueprint(auth_bp, url_prefix="/")
    app.register_blueprint(user_bp, url_prefix="/")
    app.register_blueprint(role_bp, url_prefix="/")
    app.register_blueprint(user_type_bp, url_prefix="/")
    app.register_blueprint(base_unit_bp, url_prefix="/")
    app.register_blueprint(product_bp, url_prefix="/")
    app.register_blueprint(product_category_bp, url_prefix="/")
    app.register_blueprint(product_stock_bp, url_prefix="/")
    app.register_blueprint(product_sale_bp, url_prefix="/")
    app.register_blueprint(sale_bp, url_prefix="/")
    app.register_blueprint(reports_bp, url_prefix="/")

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
