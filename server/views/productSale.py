from flask import Blueprint, request, jsonify
from models import ProductSale, Product, Sale, db
import uuid

product_sale_bp = Blueprint("product_sale_bp", __name__)

@product_sale_bp.route("/product_sales", methods=["POST"])
def create_product_sale():
    data = request.get_json()
    product = Product.query.get(data["product_id"])
    sale = Sale.query.get(data["sale_id"])
    if not product or not sale:
        return jsonify({"error": "Invalid product_id or sale_id"}), 400

    new_item = ProductSale(
        id=uuid.uuid4(),
        sale_id=sale.id,
        product_id=product.id,
        quantity=data["quantity"]
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"success": "ProductSale created", "id": str(new_item.id)}), 201

@product_sale_bp.route("/product_sales", methods=["GET"])
def get_product_sales():
    items = ProductSale.query.all()
    return jsonify([
        {
            "id": str(i.id),
            "sale_id": str(i.sale_id),
            "product": i.product.name if i.product else None,
            "quantity": i.quantity
        } for i in items
    ]), 200

@product_sale_bp.route("/product_sales/<uuid:id>", methods=["PUT"])
def update_product_sale(id):
    item = ProductSale.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    item.quantity = data.get("quantity", item.quantity)
    db.session.commit()
    return jsonify({"success": "ProductSale updated"}), 200

@product_sale_bp.route("/product_sales/<uuid:id>", methods=["DELETE"])
def delete_product_sale(id):
    item = ProductSale.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": "ProductSale deleted"}), 200
