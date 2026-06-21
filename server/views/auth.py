from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_mail import Message
from extensions import mail, db
from models import User, TokenBlocklist, UserSchema
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
import uuid
from functools import wraps

auth_bp = Blueprint("auth_bp", __name__)

# ==================== ROLE-BASED DECORATOR =============================

def roles_required(*required_roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)  # identity is already a string UUID
            if not user:
                return jsonify({"error": "User not found"}), 404

            user_roles = {role.name for role in user.roles}
            if not any(role in user_roles for role in required_roles):
                return jsonify({"error": "Access forbidden: insufficient role"}), 403

            return fn(*args, **kwargs)
        return decorated_function
    return wrapper

# ==================== AUTH =============================

# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        # send login notification email
#         msg = Message(
#             subject="Login Notification",
#             recipients=[user.email],
#             body=f"""
# Hello {user.fname} {user.lname},

# You have just logged into the application using your email: {user.email}.
# If this was not you, please secure your account immediately.

# Best regards,
# Your Application Team
# """
#         )
#         mail.send(msg)

        # Return full user object with roles
        user_schema = UserSchema()
        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user_schema.dump(user)
        }), 200
    else:
        return jsonify({"error": "Wrong credentials"}), 401


# REFRESH AUTH TOKEN
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(current_user_id))
    return jsonify({"access_token": access_token}), 200


# FETCH CURRENT USER
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)  # identity is already a string UUID

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_schema = UserSchema()
    return jsonify(user_schema.dump(user)), 200


# LOGOUT
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "JWT revoked"}), 200


# ==================== EXAMPLE PROTECTED ROUTE =============================

@auth_bp.route("/manage-users", methods=["GET"])
@roles_required("Manage Users")
def manage_users_route():
    return jsonify({"message": "Welcome, you have Manage Users access."}), 200
