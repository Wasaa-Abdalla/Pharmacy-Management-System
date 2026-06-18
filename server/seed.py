import uuid
from datetime import datetime, timedelta
from extensions import db
from app import create_app
from models import (
    UserType, Role, User, ProductCategory, BaseUnit,
    Product, ProductStock, Sale, ProductSale
)

def seed_user_types():
    types = ["Admin", "Pharmacist", "Cashier"]
    for t in types:
        if not UserType.query.filter_by(name=t).first():
            db.session.add(UserType(id=uuid.uuid4(), name=t))
    db.session.commit()

def seed_roles():
    roles = ["Manage Users", "Manage Stock", "Dispense Product", "View Reports"]
    for r in roles:
        if not Role.query.filter_by(name=r).first():
            db.session.add(Role(id=uuid.uuid4(), name=r))
    db.session.commit()

def seed_admin_user():
    admin_type = UserType.query.filter_by(name="Admin").first()
    if admin_type and not User.query.filter_by(email="admin@example.com").first():
        admin = User(
            id=uuid.uuid4(),
            username="admin",
            fname="System",
            lname="Administrator",
            email="admin@example.com",
            userTypeId=admin_type.id
        )
        admin.set_password("Admin@123")  # secure default password
        db.session.add(admin)
        db.session.commit()

        # Assign all roles to admin
        for role in Role.query.all():
            admin.roles.append(role)
        db.session.commit()

def seed_product_categories():
    categories = ["Antibiotics", "Painkillers", "Vitamins"]
    for c in categories:
        if not ProductCategory.query.filter_by(name=c).first():
            db.session.add(ProductCategory(id=uuid.uuid4(), name=c))
    db.session.commit()

def seed_base_units():
    units = ["Tablet", "Bottle", "Box"]
    for u in units:
        if not BaseUnit.query.filter_by(name=u).first():
            db.session.add(BaseUnit(id=uuid.uuid4(), name=u))
    db.session.commit()

def seed_products():
    category = ProductCategory.query.filter_by(name="Antibiotics").first()
    unit = BaseUnit.query.filter_by(name="Tablet").first()
    if category and unit and not Product.query.filter_by(sku="AMOX500").first():
        product = Product(
            id=uuid.uuid4(),
            name="Amoxicillin 500mg",
            sku="AMOX500",
            description="Broad-spectrum antibiotic",
            reorderLevel=50,
            categoryId=category.id,
            baseUnitId=unit.id
        )
        db.session.add(product)
        db.session.commit()

def seed_stocks():
    product = Product.query.filter_by(sku="AMOX500").first()
    unit = BaseUnit.query.filter_by(name="Tablet").first()
    if product and unit and not ProductStock.query.filter_by(batchNumber="BATCH001").first():
        stock = ProductStock(
            id=uuid.uuid4(),
            productId=product.id,
            quantity=1000,
            unitLevelId=unit.id,
            batchNumber="BATCH001",
            expiryDate=datetime.utcnow() + timedelta(days=365),
            supplierName="Pharma Supplier Ltd",
            supplierPhone="0712345678",
            requisitionReceipt="REQ001",
            buyingPrice=5.0,
            sellingPrice=10.0
        )
        db.session.add(stock)
        db.session.commit()

def run_seed():
    app = create_app()
    with app.app_context():
        seed_user_types()
        seed_roles()
        seed_admin_user()
        seed_product_categories()
        seed_base_units()
        seed_products()
        seed_stocks()
        print("✅ Seeding complete!")

if __name__ == "__main__":
    run_seed()
