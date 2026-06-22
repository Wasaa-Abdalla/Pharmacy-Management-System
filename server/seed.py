import uuid
from datetime import datetime, timedelta
from extensions import db
from app import create_app
from models import (
    UserType, Role, User, UserRoles,
    ProductCategory, BaseUnit, Product,
    ProductStock, Sale, ProductSale
)

def reset_database():
    # Delete all rows from tables in correct dependency order
    db.session.query(ProductSale).delete()
    db.session.query(Sale).delete()
    db.session.query(ProductStock).delete()
    db.session.query(Product).delete()
    db.session.query(ProductCategory).delete()
    db.session.query(BaseUnit).delete()
    db.session.query(UserRoles).delete()
    db.session.query(User).delete()
    db.session.query(Role).delete()
    db.session.query(UserType).delete()
    db.session.commit()

def seed_user_types():
    types = ["Admin", "Pharmacist", "Cashier"]
    for t in types:
        db.session.add(UserType(id=uuid.uuid4(), name=t))
    db.session.commit()

def seed_roles():
    roles = [
        "Manage Users",
        "Manage Stock",
        "Manage Settings",
        "View Reports",
        "Manage Sales"
    ]
    for r in roles:
        db.session.add(Role(id=uuid.uuid4(), name=r))
    db.session.commit()

def seed_admin_user():
    admin_type = UserType.query.filter_by(name="Admin").first()
    admin = User(
        id=uuid.uuid4(),
        username="admin",
        fname="System",
        lname="Administrator",
        email="admin@example.com",
        userTypeId=admin_type.id
    )
    admin.set_password("Admin@123")
    db.session.add(admin)
    db.session.commit()

    # Assign all roles
    for role in Role.query.all():
        admin.roles.append(role)
    db.session.commit()

def seed_product_categories():
    categories = ["Antibiotics", "Painkillers", "Vitamins"]
    for c in categories:
        db.session.add(ProductCategory(id=uuid.uuid4(), name=c))
    db.session.commit()

def seed_base_units():
    units = ["Tablet", "Bottle", "Box"]
    for u in units:
        db.session.add(BaseUnit(id=uuid.uuid4(), name=u))
    db.session.commit()

def seed_products():
    antibiotics = ProductCategory.query.filter_by(name="Antibiotics").first()
    painkillers = ProductCategory.query.filter_by(name="Painkillers").first()
    vitamins = ProductCategory.query.filter_by(name="Vitamins").first()
    tablet = BaseUnit.query.filter_by(name="Tablet").first()
    bottle = BaseUnit.query.filter_by(name="Bottle").first()

    products = [
        ("Amoxicillin 500mg", "AMOX500", "Broad-spectrum antibiotic", antibiotics, tablet),
        ("Ibuprofen 200mg", "IBU200", "Pain relief", painkillers, tablet),
        ("Vitamin C 1000mg", "VITC1000", "Immune booster", vitamins, bottle),
    ]

    for name, sku, desc, cat, unit in products:
        db.session.add(Product(
            id=uuid.uuid4(),
            name=name,
            sku=sku,
            description=desc,
            reorderLevel=50,
            categoryId=cat.id,
            baseUnitId=unit.id
        ))
    db.session.commit()

def seed_stocks():
    product = Product.query.filter_by(sku="AMOX500").first()
    unit = BaseUnit.query.filter_by(name="Tablet").first()
    db.session.add(ProductStock(
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
    ))
    db.session.commit()

def seed_sales():
    product = Product.query.filter_by(sku="AMOX500").first()
    sale = Sale(
        id=uuid.uuid4(),
        date=datetime.utcnow(),
        total_amount=100.0
    )
    db.session.add(sale)
    db.session.commit()

    db.session.add(ProductSale(
        id=uuid.uuid4(),
        sale_id=sale.id,
        product_id=product.id,
        quantity=10
    ))
    db.session.commit()

def run_seed():
    app = create_app()
    with app.app_context():
        reset_database()
        seed_user_types()
        seed_roles()
        seed_admin_user()
        seed_product_categories()
        seed_base_units()
        seed_products()
        seed_stocks()
        seed_sales()
        print("✅ Database reset and seeding complete!")

if __name__ == "__main__":
    run_seed()
