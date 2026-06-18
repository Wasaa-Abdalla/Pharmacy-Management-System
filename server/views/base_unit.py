from flask import Blueprint, request, jsonify
from models import BaseUnit, db
import uuid

base_unit_bp = Blueprint("base_unit_bp", __name__)

@base_unit_bp.route("/base_units", methods=["POST"])
def create_unit():
    data = request.get_json()
    new_unit = BaseUnit(id=uuid.uuid4(), name=data["name"])
    db.session.add(new_unit)
    db.session.commit()
    return jsonify({"success": "BaseUnit created", "id": str(new_unit.id)}), 201

@base_unit_bp.route("/base_units", methods=["GET"])
def get_units():
    units = BaseUnit.query.all()
    results = [
        {
            "id": str(u.id),
            "name": u.name
        }
        for u in units
    ]

    return jsonify(results), 200

@base_unit_bp.route("/base_units/<uuid:id>", methods=["PUT"])
def update_unit(id):
    unit = BaseUnit.query.get(id)
    if not unit:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    unit.name = data.get("name", unit.name)
    db.session.commit()
    return jsonify({"success": "BaseUnit updated"}), 200

@base_unit_bp.route("/base_units/<uuid:id>", methods=["DELETE"])
def delete_unit(id):
    unit = BaseUnit.query.get(id)
    if not unit:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(unit)
    db.session.commit()
    return jsonify({"success": "BaseUnit deleted"}), 200
