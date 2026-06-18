from flask import Blueprint, jsonify, request
from sqlalchemy import func
from extensions import db
from models import Sale, ProductSale, ProductStock, Product

reports_bp = Blueprint("reports_bp", __name__)

# ------------------ Sales Reports ------------------
@reports_bp.route("/reports/sales/<period>", methods=["GET"])
def sales_report(period):
    """
    period can be: daily, weekly, monthly, yearly
    """
    if period == "daily":
        group_expr = func.date(Sale.date)
    elif period == "weekly":
        group_expr = func.date_trunc("week", Sale.date)
    elif period == "monthly":
        group_expr = func.date_trunc("month", Sale.date)
    elif period == "yearly":
        group_expr = func.date_trunc("year", Sale.date)
    else:
        return jsonify({"error": "Invalid period"}), 400

    results = db.session.query(
        group_expr.label("period"),
        func.sum(Sale.total_amount).label("total_sales")
    ).group_by(group_expr).order_by(group_expr).all()

    return jsonify([
        {"period": str(r.period), "total_sales": float(r.total_sales)}
        for r in results
    ]), 200


# ------------------ Stock Usage Reports ------------------
@reports_bp.route("/reports/stock", methods=["GET"])
def stock_usage_report():
    results = db.session.query(
        Product.name.label("product"),
        func.sum(ProductStock.quantity).label("stock_quantity"),
        func.coalesce(func.sum(ProductSale.quantity), 0).label("sold_quantity")
    ).outerjoin(ProductStock, Product.id == ProductStock.productId)\
     .outerjoin(ProductSale, Product.id == ProductSale.product_id)\
     .group_by(Product.name).all()

    return jsonify([
        {
            "product": r.product,
            "stock_quantity": int(r.stock_quantity or 0),
            "sold_quantity": int(r.sold_quantity or 0)
        }
        for r in results
    ]), 200


# ------------------ Profit & Loss Reports ------------------
@reports_bp.route("/reports/profit-loss", methods=["GET"])
def profit_loss_report():
    results = db.session.query(
        Product.name.label("product"),
        func.sum(ProductSale.quantity * ProductStock.sellingPrice).label("revenue"),
        func.sum(ProductSale.quantity * ProductStock.buyingPrice).label("cost")
    ).join(ProductSale, Product.id == ProductSale.product_id)\
     .join(ProductStock, Product.id == ProductStock.productId)\
     .group_by(Product.name).all()

    report = []
    for r in results:
        revenue = float(r.revenue or 0)
        cost = float(r.cost or 0)
        profit = revenue - cost
        report.append({
            "product": r.product,
            "revenue": revenue,
            "cost": cost,
            "profit": profit
        })

    return jsonify(report), 200

# ------------------ stock-Alerts Reports ------------------
@reports_bp.route("/reports/stock-alerts", methods=["GET"])
def stock_alerts():
    results = db.session.query(
        Product.id,
        Product.name,
        func.coalesce(func.sum(ProductStock.quantity), 0).label("current_stock"),
        Product.reorderLevel
    ).outerjoin(ProductStock, Product.id == ProductStock.productId)\
     .group_by(Product.id, Product.name, Product.reorderLevel)\
     .having(func.coalesce(func.sum(ProductStock.quantity), 0) <= Product.reorderLevel)\
     .all()

    return jsonify([
        {
            "product": r.name,
            "current_stock": int(r.current_stock or 0),
            "reorder_level": r.reorderLevel
        }
        for r in results
    ]), 200

# ------------------ stock-Expiring Reports ------------------
@reports_bp.route("/reports/expiring", methods=["GET"])
def expiring_drugs():
    from datetime import datetime, timedelta
    cutoff = datetime.now() + timedelta(days=30)

    results = db.session.query(
        Product.name,
        ProductStock.batchNumber,
        ProductStock.expiryDate,
        ProductStock.quantity
    ).join(ProductStock, Product.id == ProductStock.productId)\
     .filter(ProductStock.expiryDate <= cutoff)\
     .all()

    return jsonify([
        {
            "product": r.name,
            "batch_number": r.batchNumber,
            "expiry_date": r.expiryDate.isoformat(),
            "quantity": r.quantity
        }
        for r in results
    ]), 200
