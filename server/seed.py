from datetime import datetime, timedelta
from app import create_app
from extensions import db
from models import (
    UserType, Role, User, ProductCategory, BaseUnit,
    Product, ProductStock, Sale, ProductSale
)

def seed_user_types():
    types = ["Admin", "Pharmacist"]
    for t in types:
        if not UserType.query.filter_by(name=t).first():
            db.session.add(UserType(name=t))
    db.session.commit()

def seed_roles():
    roles = ["Manage Users", "Manage Stock", "Dispense Product"]
    for r in roles:
        if not Role.query.filter_by(name=r).first():
            db.session.add(Role(name=r))
    db.session.commit()

def seed_users():
    admin_type = UserType.query.filter_by(name="Admin").first()
    pharmacist_type = UserType.query.filter_by(name="Pharmacist").first()

    if not User.query.filter_by(username="admin").first():
        admin_user = User(
            username="admin",
            fname="System",
            lname="Admin",
            email="admin@pharmacy.com",
            userTypeId=admin_type.id
        )
        admin_user.set_password("admin123")
        admin_user.roles = Role.query.all()
        db.session.add(admin_user)

    if not User.query.filter_by(username="pharma").first():
        pharma_user = User(
            username="pharma",
            fname="John",
            lname="Doe",
            email="pharma@pharmacy.com",
            userTypeId=pharmacist_type.id
        )
        pharma_user.set_password("pharma123")
        pharma_role = Role.query.filter_by(name="Dispense Product").first()
        pharma_user.roles.append(pharma_role)
        db.session.add(pharma_user)

    db.session.commit()

def seed_product_categories():
    categories = ["Antibiotics", "Painkillers", "Vitamins"]
    for c in categories:
        if not ProductCategory.query.filter_by(name=c).first():
            db.session.add(ProductCategory(name=c))
    db.session.commit()

def seed_base_units():
    units = ["Tablet", "Capsule", "Bottle"]
    for u in units:
        if not BaseUnit.query.filter_by(name=u).first():
            db.session.add(BaseUnit(name=u))
    db.session.commit()

def seed_products():
    antibiotics = ProductCategory.query.filter_by(name="Antibiotics").first()
    painkillers = ProductCategory.query.filter_by(name="Painkillers").first()
    vitamins = ProductCategory.query.filter_by(name="Vitamins").first()

    tablet = BaseUnit.query.filter_by(name="Tablet").first()
    capsule = BaseUnit.query.filter_by(name="Capsule").first()
    bottle = BaseUnit.query.filter_by(name="Bottle").first()

    products = [
        # Antibiotics
        ("Amoxicillin", "AMOX100", "Broad-spectrum antibiotic", 50, antibiotics.id, tablet.id),
        ("Ciprofloxacin", "CIP200", "Used for bacterial infections", 30, antibiotics.id, tablet.id),
        ("Azithromycin", "AZI300", "Macrolide antibiotic", 40, antibiotics.id, capsule.id),

        # Painkillers
        ("Paracetamol", "PARA500", "Pain reliever and fever reducer", 100, painkillers.id, tablet.id),
        ("Ibuprofen", "IBU400", "NSAID for pain and inflammation", 80, painkillers.id, tablet.id),
        ("Diclofenac", "DIC100", "Anti-inflammatory painkiller", 60, painkillers.id, capsule.id),

        # Vitamins
        ("Vitamin C", "VITC100", "Immune booster", 200, vitamins.id, tablet.id),
        ("Vitamin D", "VITD200", "Supports bone health", 150, vitamins.id, capsule.id),
        ("Multivitamin Syrup", "MULTI300", "General health supplement", 50, vitamins.id, bottle.id),
    ]

    for name, sku, desc, reorder, cat_id, unit_id in products:
        if not Product.query.filter_by(name=name).first():
            db.session.add(Product(
                name=name,
                sku=sku,
                description=desc,
                reorderLevel=reorder,
                categoryId=cat_id,
                baseUnitId=unit_id
            ))
    db.session.commit()

def seed_product_stocks():
    product = Product.query.filter_by(name="Amoxicillin").first()
    unit = BaseUnit.query.filter_by(name="Tablet").first()
    if product and not ProductStock.query.filter_by(productId=product.id, batchNumber="BATCH001").first():
        stock = ProductStock(
            productId=product.id,
            quantity=200,
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

def seed_sales():
    product = Product.query.filter_by(name="Amoxicillin").first()
    if product:
        sale = Sale(
            date=datetime.utcnow(),
            total_amount=20.0
        )
        db.session.add(sale)
        db.session.commit()

        sale_item = ProductSale(
            sale_id=sale.id,
            product_id=product.id,
            quantity=2
        )
        db.session.add(sale_item)
        db.session.commit()

def run_seed():
    app = create_app()
    with app.app_context():
        seed_user_types()
        seed_roles()
        seed_users()
        seed_product_categories()
        seed_base_units()
        seed_products()
        seed_product_stocks()
        seed_sales()
        print("Database seeded successfully!")

if __name__ == "__main__":
    run_seed()
