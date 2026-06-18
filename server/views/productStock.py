from flask import Blueprint, request, jsonify
from models import ProductStock, Product, BaseUnit, db
import uuid
from datetime import datetime

product_stock_bp = Blueprint("product_stock_bp", __name__)

@product_stock_bp.route("/product_stocks", methods=["POST"])
def create_stock():
    data = request.get_json()
    product = Product.query.get(data["productId"])
    unit = BaseUnit.query.get(data["unitLevelId"])
    if not product or not unit:
        return jsonify({"error": "Invalid productId or unitLevelId"}), 400

    new_stock = ProductStock(
        id=uuid.uuid4(),
        productId=product.id,
        quantity=data["quantity"],
        unitLevelId=unit.id,
        batchNumber=data["batchNumber"],
        expiryDate=datetime.fromisoformat(data["expiryDate"]),
        supplierName=data["supplierName"],
        supplierPhone=data["supplierPhone"],
        requisitionReceipt=data["requisitionReceipt"],
        buyingPrice=data["buyingPrice"],
        sellingPrice=data["sellingPrice"]
    )
    db.session.add(new_stock)
    db.session.commit()
    return jsonify({"success": "Stock created", "id": str(new_stock.id)}), 201

@product_stock_bp.route("/product_stocks", methods=["GET"])
def get_stocks():
    stocks = ProductStock.query.all()
    return jsonify([
        {
            "id": str(s.id),
            "product": s.product.name if s.product else None,
            "quantity": s.quantity,
            "batchNumber": s.batchNumber,
            "expiryDate": s.expiryDate.isoformat(),
            "supplierName": s.supplierName,
            "supplierPhone": s.supplierPhone,
            "buyingPrice": s.buyingPrice,
            "sellingPrice": s.sellingPrice
        } for s in stocks
    ]), 200

@product_stock_bp.route("/product_stocks/<uuid:stock_id>", methods=["GET"])
def get_stock(stock_id):
    stock = ProductStock.query.get(stock_id)
    if not stock:
        return jsonify({"error": "ProductStock not found"}), 404

    return jsonify({
        "id": str(stock.id),
        "product": stock.product.name if stock.product else None,
        "quantity": stock.quantity,
        "batchNumber": stock.batchNumber,
        "expiryDate": stock.expiryDate.isoformat(),
        "supplierName": stock.supplierName,
        "supplierPhone": stock.supplierPhone,
        "buyingPrice": stock.buyingPrice,
        "sellingPrice": stock.sellingPrice
    }), 200


@product_stock_bp.route("/product_stocks/product/<uuid:product_id>", methods=["GET"])
def get_stocks_by_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    stocks = ProductStock.query.filter_by(productId=product.id).all()
    return jsonify([
        {
            "id": str(s.id),
            "productId": str(s.productId),
            "productName": product.name,
            "quantity": s.quantity,
            "batchNumber": s.batchNumber,
            "expiryDate": s.expiryDate.isoformat(),
            "supplierName": s.supplierName,
            "supplierPhone": s.supplierPhone,
            "buyingPrice": s.buyingPrice,
            "sellingPrice": s.sellingPrice
        }
        for s in stocks
    ]), 200


@product_stock_bp.route("/product_stocks/<uuid:id>", methods=["PUT"])
def update_stock(id):
    stock = ProductStock.query.get(id)
    if not stock:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    stock.quantity = data.get("quantity", stock.quantity)
    stock.supplierName = data.get("supplierName", stock.supplierName)
    stock.supplierPhone = data.get("supplierPhone", stock.supplierPhone)
    db.session.commit()
    return jsonify({"success": "Stock updated"}), 200

@product_stock_bp.route("/product_stocks/<uuid:id>", methods=["DELETE"])
def delete_stock(id):
    stock = ProductStock.query.get(id)
    if not stock:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(stock)
    db.session.commit()
    return jsonify({"success": "Stock deleted"}), 200
