from flask import Blueprint, request, jsonify
from models import Role, db
import uuid

role_bp = Blueprint("role_bp", __name__)

@role_bp.route("/roles", methods=["POST"])
def create_role():
    data = request.get_json()
    new_role = Role(id=uuid.uuid4(), name=data["name"])
    db.session.add(new_role)
    db.session.commit()
    return jsonify({"success": "Role created", "id": str(new_role.id)}), 201

@role_bp.route("/roles", methods=["GET"])
def get_roles():
    roles = Role.query.all()
    return jsonify([{"id": str(r.id), "name": r.name} for r in roles]), 200

@role_bp.route("/roles/<uuid:id>", methods=["PUT"])
def update_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    role.name = data.get("name", role.name)
    db.session.commit()
    return jsonify({"success": "Role updated"}), 200

@role_bp.route("/roles/<uuid:id>", methods=["DELETE"])
def delete_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(role)
    db.session.commit()
    return jsonify({"success": "Role deleted"}), 200
