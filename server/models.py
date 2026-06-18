import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from marshmallow import Schema, fields
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

# ------------------ UserType ------------------
class UserType(db.Model):
    __tablename__ = "user_types"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False, unique=True)
    users = db.relationship("User", backref="user_type", lazy=True)

# ------------------ Role ------------------
class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False, unique=True)

# ------------------ User ------------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(50), nullable=False, unique=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    userTypeId = db.Column(UUID(as_uuid=True), db.ForeignKey("user_types.id"), nullable=False)
    password_hash = db.Column(db.String(500))

    roles = db.relationship("Role", secondary="user_roles", backref="users", cascade="all, delete")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# ------------------ UserRoles (association table) ------------------
class UserRoles(db.Model):
    __tablename__ = "user_roles"
    userId = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    roleId = db.Column(UUID(as_uuid=True), db.ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)

# ------------------ ProductCategory ------------------
class ProductCategory(db.Model):
    __tablename__ = "product_categories"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False, unique=True)

    products = db.relationship("Product", backref="category", lazy=True)

# ------------------ BaseUnits ------------------
class BaseUnit(db.Model):
    __tablename__ = "base_units"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False, unique=True)

    products = db.relationship("Product", backref="base_unit", lazy=True)
    stocks = db.relationship("ProductStock", backref="unit_level", lazy=True)

# ------------------ Product ------------------
class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(200), nullable=False, unique=True)
    sku = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    reorderLevel = db.Column(db.Integer, nullable=False)

    categoryId = db.Column(UUID(as_uuid=True), db.ForeignKey("product_categories.id"), nullable=False)
    baseUnitId = db.Column(UUID(as_uuid=True), db.ForeignKey("base_units.id"), nullable=False)

    stocks = db.relationship("ProductStock", backref="product", lazy=True)
    sales = db.relationship("ProductSale", backref="product", lazy=True)

# ------------------ ProductStock ------------------
class ProductStock(db.Model):
    __tablename__ = "product_stocks"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    productId = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unitLevelId = db.Column(UUID(as_uuid=True), db.ForeignKey("base_units.id"), nullable=False)
    batchNumber = db.Column(db.String(250), nullable=False)
    expiryDate = db.Column(db.DateTime, nullable=False)
    supplierName = db.Column(db.String(250), nullable=False)
    supplierPhone = db.Column(db.String(50), nullable=False)
    requisitionReceipt = db.Column(db.String(250), nullable=False)
    buyingPrice = db.Column(db.Float, nullable=False)
    sellingPrice = db.Column(db.Float, nullable=False)

# ------------------ Sale ------------------
class Sale(db.Model):
    __tablename__ = "sales"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float, nullable=False)

    items = db.relationship("ProductSale", backref="sale", lazy=True)

# ------------------ ProductSale ------------------
class ProductSale(db.Model):
    __tablename__ = "product_sales"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sale_id = db.Column(UUID(as_uuid=True), db.ForeignKey("sales.id"), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)



class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)





# ------------------ Role Schema ------------------
class RoleSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)

# ------------------ UserType Schema ------------------
class UserTypeSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)

# ------------------ User Schema ------------------
class UserSchema(Schema):
    id = fields.UUID(dump_only=True)
    username = fields.Str(required=True)
    fname = fields.Str(required=True)
    lname = fields.Str(required=True)
    email = fields.Email(required=True)
    roles = fields.List(fields.Nested(RoleSchema), dump_only=True)

# ------------------ ProductCategory Schema ------------------
class ProductCategorySchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    products = fields.List(fields.Nested(lambda: ProductSchema(exclude=("category",))), dump_only=True)

# ------------------ BaseUnit Schema ------------------
class BaseUnitSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    products = fields.List(fields.Nested(lambda: ProductSchema(exclude=("base_unit",))), dump_only=True)

# ------------------ Product Schema ------------------
class ProductSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    sku = fields.Str(required=True)
    description = fields.Str(required=True)
    reorderLevel = fields.Int(required=True)

    category = fields.Nested(ProductCategorySchema, dump_only=True)
    categoryId = fields.UUID(load_only=True, required=True)

    base_unit = fields.Nested(BaseUnitSchema, dump_only=True)
    baseUnitId = fields.UUID(load_only=True, required=True)

    stocks = fields.List(fields.Nested(lambda: ProductStockSchema(exclude=("product",))), dump_only=True)

# ------------------ ProductStock Schema ------------------
class ProductStockSchema(Schema):
    id = fields.UUID(dump_only=True)
    product = fields.Nested(ProductSchema, dump_only=True)
    productId = fields.UUID(load_only=True, required=True)
    quantity = fields.Int(required=True)
    unit_level = fields.Nested(BaseUnitSchema, dump_only=True)
    unitLevelId = fields.UUID(load_only=True, required=True)
    batchNumber = fields.Str(required=True)
    expiryDate = fields.DateTime(required=True)
    supplierName = fields.Str(required=True)
    supplierPhone = fields.Str(required=True)
    requisitionReceipt = fields.Str(required=True)
    buyingPrice = fields.Float(required=True)
    sellingPrice = fields.Float(required=True)

# ------------------ ProductSale Schema ------------------
class ProductSaleSchema(Schema):
    id = fields.UUID(dump_only=True)
    sale = fields.Nested(lambda: SaleSchema(exclude=("items",)), dump_only=True)
    sale_id = fields.UUID(load_only=True, required=True)
    product = fields.Nested(ProductSchema, dump_only=True)
    product_id = fields.UUID(load_only=True, required=True)
    quantity = fields.Int(required=True)

# ------------------ Sale Schema ------------------
class SaleSchema(Schema):
    id = fields.UUID(dump_only=True)
    date = fields.DateTime(dump_only=True)
    total_amount = fields.Float(required=True)
    items = fields.List(fields.Nested(ProductSaleSchema), dump_only=True)


# ------------------ TokenBlocklist Schema ------------------
class TokenBlocklistSchema(Schema):
    id = fields.Int(dump_only=True)
    jti = fields.Str(required=True)
    created_at = fields.DateTime(required=True)