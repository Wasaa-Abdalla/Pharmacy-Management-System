from flask import Blueprint, request, jsonify
from models import Sale, ProductSale, Product, db
import uuid
from sqlalchemy import func
from datetime import datetime

sale_bp = Blueprint("sale_bp", __name__)

# ------------------ Create Sale ------------------
@sale_bp.route("/sales", methods=["POST"])
def create_sale():
    data = request.get_json()

    # Create the sale record
    new_sale = Sale(
        id=uuid.uuid4(),
        date=datetime.utcnow(),
        total_amount=data["total_amount"]
    )
    db.session.add(new_sale)
    db.session.flush()  # ensures new_sale.id is available

    # Save each product in the cart
    items = data.get("items", [])
    for item in items:
        product_sale = ProductSale(
            id=uuid.uuid4(),
            sale_id=new_sale.id,
            product_id=item["product_id"],
            quantity=item.get("quantity", 1)
        )
        db.session.add(product_sale)

    db.session.commit()

    return jsonify({
        "success": "Sale created",
        "id": str(new_sale.id),
        "items": items
    }), 201

# ------------------ Get All Sales ------------------
@sale_bp.route("/sales", methods=["GET"])
def get_sales():
    sales = Sale.query.all()
    return jsonify([
        {
            "id": str(s.id),
            "date": s.date.isoformat(),
            "total_amount": s.total_amount,
            "items": [
                {
                    "product_id": str(i.product_id),
                    "product": i.product.name,
                    "quantity": i.quantity
                }
                for i in s.items
            ]
        }
        for s in sales
    ]), 200

# ------------------ Get Sales By Id ------------------
@sale_bp.route("/sales/<uuid:id>", methods=["GET"])
def get_sale_by_id(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({"error": "Sale not found"}), 404

    return jsonify({
        "id": str(sale.id),
        "date": sale.date.isoformat(),
        "total_amount": sale.total_amount,
        "items": [
            {
                "product_id": str(i.product_id),
                "product": i.product.name,
                "quantity": i.quantity
            }
            for i in sale.items
        ]
    }), 200


# ------------------ Update Sale ------------------
@sale_bp.route("/sales/<uuid:id>", methods=["PUT"])
def update_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    sale.total_amount = data.get("total_amount", sale.total_amount)

    # Optional: update items if provided
    if "items" in data:
        # Clear existing items
        ProductSale.query.filter_by(sale_id=sale.id).delete()
        # Add new items
        for item in data["items"]:
            product_sale = ProductSale(
                id=uuid.uuid4(),
                sale_id=sale.id,
                product_id=item["product_id"],
                quantity=item.get("quantity", 1)
            )
            db.session.add(product_sale)

    db.session.commit()
    return jsonify({"success": "Sale updated"}), 200

# ------------------ Delete Sale ------------------
@sale_bp.route("/sales/<uuid:id>", methods=["DELETE"])
def delete_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({"error": "Not found"}), 404

    # Delete associated items first
    ProductSale.query.filter_by(sale_id=sale.id).delete()
    db.session.delete(sale)
    db.session.commit()
    return jsonify({"success": "Sale deleted"}), 200
