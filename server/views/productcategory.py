from flask import Blueprint, request, jsonify
from models import ProductCategory, db
import uuid

product_category_bp = Blueprint("product_category_bp", __name__)

@product_category_bp.route("/product_categories", methods=["POST"])
def create_category():
    data = request.get_json()
    new_cat = ProductCategory(id=uuid.uuid4(), name=data["name"])
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({"success": "Category created", "id": str(new_cat.id)}), 201

@product_category_bp.route("/product_categories", methods=["GET"])
def get_categories():
    cats = ProductCategory.query.all()
    return jsonify([{"id": str(c.id), "name": c.name} for c in cats]), 200

@product_category_bp.route("/product_categories/<uuid:id>", methods=["PUT"])
def update_category(id):
    cat = ProductCategory.query.get(id)
    if not cat:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    cat.name = data.get("name", cat.name)
    db.session.commit()
    return jsonify({"success": "Category updated"}), 200

@product_category_bp.route("/product_categories/<uuid:id>", methods=["DELETE"])
def delete_category(id):
    cat = ProductCategory.query.get(id)
    if not cat:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(cat)
    db.session.commit()
    return jsonify({"success": "Category deleted"}), 200
