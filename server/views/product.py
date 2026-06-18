from flask import Blueprint, request, jsonify
from models import Product, ProductCategory, BaseUnit, db
import uuid

product_bp = Blueprint("product_bp", __name__)

@product_bp.route("/products", methods=["POST"])
def create_product():
    data = request.get_json()
    category = ProductCategory.query.get(data["categoryId"])
    unit = BaseUnit.query.get(data["baseUnitId"])
    if not category or not unit:
        return jsonify({"error": "Invalid categoryId or baseUnitId"}), 400

    new_product = Product(
        id=uuid.uuid4(),
        name=data["name"],
        sku=data["sku"],
        description=data["description"],
        reorderLevel=data["reorderLevel"],
        categoryId=category.id,
        baseUnitId=unit.id
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"success": "Product created", "id": str(new_product.id)}), 201

@product_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": str(p.id),
            "name": p.name,
            "sku": p.sku,
            "description": p.description,
            "reorderLevel": p.reorderLevel,
            "category": p.category.name if p.category else None,
            "baseUnit": p.base_unit.name if p.base_unit else None,
            # include stock info (take latest batch or aggregate)
            "stocks": [
                {
                    "id": str(s.id),
                    "quantity": s.quantity,
                    "batchNumber": s.batchNumber,
                    "expiryDate": s.expiryDate.isoformat(),
                    "supplierName": s.supplierName,
                    "supplierPhone": s.supplierPhone,
                    "buyingPrice": s.buyingPrice,
                    "sellingPrice": s.sellingPrice,
                }
                for s in p.stocks
            ]
        } for p in products
    ]), 200


@product_bp.route("/products/<uuid:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": str(product.id),
        "name": product.name,
        "sku": product.sku,
        "description": product.description,
        "reorderLevel": product.reorderLevel,
        "category": product.category.name if product.category else None,
        "baseUnit": product.base_unit.name if product.base_unit else None,
        "stocks": [
            {
                "id": str(s.id),
                "quantity": s.quantity,
                "batchNumber": s.batchNumber,
                "expiryDate": s.expiryDate.isoformat(),
                "supplierName": s.supplierName,
                "supplierPhone": s.supplierPhone,
                "buyingPrice": s.buyingPrice,
                "sellingPrice": s.sellingPrice,
            }
            for s in product.stocks
        ]
    }), 200



@product_bp.route("/products/<uuid:id>", methods=["PUT"])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    # Update basic fields
    product.name = data.get("name", product.name)
    product.sku = data.get("sku", product.sku)
    product.description = data.get("description", product.description)
    product.reorderLevel = data.get("reorderLevel", product.reorderLevel)

    # ✅ Update category if provided
    if "categoryId" in data:
        category = ProductCategory.query.get(data["categoryId"])
        if not category:
            return jsonify({"error": "Invalid categoryId"}), 400
        product.categoryId = category.id

    # ✅ Update base unit if provided
    if "baseUnitId" in data:
        unit = BaseUnit.query.get(data["baseUnitId"])
        if not unit:
            return jsonify({"error": "Invalid baseUnitId"}), 400
        product.baseUnitId = unit.id

    db.session.commit()
    return jsonify({"success": "Product updated"}), 200


@product_bp.route("/products/<uuid:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": "Product deleted"}), 200
