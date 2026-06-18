from flask import Blueprint, request, jsonify
from models import UserType, db
import uuid

user_type_bp = Blueprint("user_type_bp", __name__)

@user_type_bp.route("/user_types", methods=["POST"])
def create_user_type():
    data = request.get_json()
    new_type = UserType(id=uuid.uuid4(), name=data["name"])
    db.session.add(new_type)
    db.session.commit()
    return jsonify({"success": "UserType created", "id": str(new_type.id)}), 201

@user_type_bp.route("/user_types", methods=["GET"])
def get_user_types():
    types = UserType.query.all()
    return jsonify([{"id": str(t.id), "name": t.name} for t in types]), 200

@user_type_bp.route("/user_types/<uuid:id>", methods=["PUT"])
def update_user_type(id):
    user_type = UserType.query.get(id)
    if not user_type:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    user_type.name = data.get("name", user_type.name)
    db.session.commit()
    return jsonify({"success": "UserType updated"}), 200

@user_type_bp.route("/user_types/<uuid:id>", methods=["DELETE"])
def delete_user_type(id):
    user_type = UserType.query.get(id)
    if not user_type:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(user_type)
    db.session.commit()
    return jsonify({"success": "UserType deleted"}), 200
