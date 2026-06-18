from flask import Blueprint, request, jsonify
from models import User, Role, UserType,UserSchema, db
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity


user_bp = Blueprint("user_bp", __name__)

# ==================== USER =============================

# ADD A USER (Admin chooses userType)
@user_bp.route("/usersByAdmin", methods=["POST"])
def add_user():
    data = request.get_json()

    requested_type = data.get("userType")
    if not requested_type:
        return jsonify({"error": "userType is required"}), 400

    user_type = UserType.query.filter_by(name=requested_type).first()
    if not user_type:
        return jsonify({"error": f"UserType '{requested_type}' not found. Seed user types first."}), 400

    new_user = User(
        id=uuid.uuid4(),
        username=data["username"],
        fname=data["fname"],
        lname=data["lname"],
        email=data["email"],
        userTypeId=user_type.id,
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": f"{requested_type} user created successfully",
        "id": str(new_user.id)
    }), 201


# ADD AN ADMIN USER (Admin type, gets all roles)
@user_bp.route("/users/admin", methods=["POST"])
def add_admin_user():
    data = request.get_json()

    user_type = UserType.query.filter_by(name="Admin").first()
    if not user_type:
        return jsonify({"error": "Admin userType not found. Seed user types first."}), 400

    new_admin = User(
        id=uuid.uuid4(),
        username=data["username"],
        fname=data["fname"],
        lname=data["lname"],
        email=data["email"],
        userTypeId=user_type.id,
    )
    new_admin.set_password(data["password"])

    # Assign all roles
    new_admin.roles = Role.query.all()

    db.session.add(new_admin)
    db.session.commit()

    user_schema = UserSchema()
    return jsonify(user_schema.dump(new_admin)), 201



# ADD A PHARMACIST USER (default, limited role)
@user_bp.route("/users/pharmacist", methods=["POST"])
def add_pharmacist_user():
    data = request.get_json()

    user_type = UserType.query.filter_by(name="Pharmacist").first()
    if not user_type:
        return jsonify({"error": "Pharmacist userType not found. Seed user types first."}), 400

    new_pharma = User(
        id=uuid.uuid4(),
        username=data["username"],
        fname=data["fname"],
        lname=data["lname"],
        email=data["email"],
        userTypeId=user_type.id,
    )
    new_pharma.set_password(data["password"])

    # Assign only "Dispense Product" role
    dispense_role = Role.query.filter_by(name="Dispense Product").first()
    if dispense_role:
        new_pharma.roles.append(dispense_role)

    db.session.add(new_pharma)
    db.session.commit()

    return jsonify({"success": "Pharmacist user created successfully", "id": str(new_pharma.id)}), 201


# FETCH ALL USERS
@user_bp.route("/users", methods=["GET"])
def fetch_users():
    users = User.query.all()
    results = [
        {
            "id": str(u.id),
            "username": u.username,
            "fname": u.fname,
            "lname": u.lname,
            "email": u.email,
            "userType": u.user_type.name if u.user_type else None,
            "roles": [role.name for role in u.roles]
        }
        for u in users
    ]
    return jsonify(results), 200


# FETCH SINGLE USER
@user_bp.route("/users/<uuid:id>", methods=["GET"])
def fetch_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User does not exist"}), 404
    return jsonify({
        "id": str(user.id),
        "username": user.username,
        "fname": user.fname,
        "lname": user.lname,
        "email": user.email,
        "userType": user.user_type.name if user.user_type else None,
        "roles": [role.name for role in user.roles]
    }), 200


# UPDATE USER
@user_bp.route("/users/<uuid:id>", methods=["PUT"])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.fname = data.get("fname", user.fname)
    user.lname = data.get("lname", user.lname)
    user.email = data.get("email", user.email)

    db.session.commit()
    return jsonify({"success": "User updated successfully"}), 200


# DELETE USER
@user_bp.route("/users/<uuid:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "The user you want to delete does not exist"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted successfully"}), 200


# ADD ROLE TO USER
@user_bp.route("/users/<uuid:id>/roles", methods=["POST"])
def add_role_to_user(id):
    data = request.get_json()
    role_name = data.get("roleName")
    if not role_name:
        return jsonify({"error": "roleName is required"}), 400

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": f"Role '{role_name}' not found"}), 404

    if role in user.roles:
        return jsonify({"error": f"User already has role '{role_name}'"}), 400

    user.roles.append(role)
    db.session.commit()

    return jsonify({
        "success": f"Role '{role_name}' added to user",
        "roles": [r.name for r in user.roles]
    }), 200


# REMOVE ROLE FROM USER
@user_bp.route("/users/<uuid:id>/roles/<string:role_name>", methods=["DELETE"])
def remove_role_from_user(id, role_name):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": f"Role '{role_name}' not found"}), 404

    if role not in user.roles:
        return jsonify({"error": f"User does not have role '{role_name}'"}), 400

    user.roles.remove(role)
    db.session.commit()

    return jsonify({
        "success": f"Role '{role_name}' removed from user",
        "roles": [r.name for r in user.roles]
    }), 200
