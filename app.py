from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from config import Config
from models import db, Inventory, Transaction, Category
from auth import auth
from datetime import datetime, date
import joblib
import os
import pandas as pd

app = Flask(__name__)
app.config.from_object(Config)

# CORS – allow frontend origin, Authorization header, and credentials
cors_origins = app.config.get("CORS_ORIGINS", "*")
CORS(
    app,
    origins=[o.strip() for o in cors_origins.split(",")],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

db.init_app(app)
jwt = JWTManager(app)

# Register auth blueprint under /api/auth
app.register_blueprint(auth, url_prefix="/api/auth")


# ----------------------------------------------------------------
# Centralized error handlers
# ----------------------------------------------------------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


# ================================================================
# CATEGORIES
# ================================================================
@app.route("/api/categories", methods=["GET"])
def get_categories():
    include_deleted = request.args.get("includeDeleted", "false").lower() == "true"
    query = Category.query
    if not include_deleted:
        query = query.filter(Category.status != "deleted")
    categories = query.order_by(Category.id.desc()).all()
    return jsonify([c.to_dict() for c in categories]), 200


@app.route("/api/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip()
    status = data.get("status", "active")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    existing = Category.query.filter(
        db.func.lower(Category.name) == name.lower()
    ).first()
    if existing:
        if existing.status == "deleted":
            existing.name = name
            existing.description = description
            existing.status = status
            db.session.commit()
            return jsonify(existing.to_dict()), 200
        return jsonify({"error": "Category with this name already exists"}), 409

    category = Category(name=name, description=description, status=status)
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@app.route("/api/categories/<int:category_id>", methods=["PUT"])
@jwt_required()
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json() or {}
    if "name" in data:
        name = (data["name"] or "").strip()
        if not name:
            return jsonify({"error": "Category name cannot be empty"}), 400
        dup = Category.query.filter(
            db.func.lower(Category.name) == name.lower(),
            Category.id != category_id,
        ).first()
        if dup:
            return jsonify({"error": "Category with this name already exists"}), 409
        category.name = name
    if "description" in data:
        category.description = (data["description"] or "").strip()
    if "status" in data:
        category.status = data["status"]

    db.session.commit()
    return jsonify(category.to_dict()), 200


@app.route("/api/categories/<int:category_id>", methods=["DELETE"])
@jwt_required()
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    category.status = "deleted"
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200


# ================================================================
# INVENTORY
# ================================================================
@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    query = Inventory.query

    include_deleted = request.args.get("includeDeleted", "false").lower() == "true"
    if not include_deleted:
        query = query.filter(Inventory.status != "deleted")

    search = request.args.get("search", "").strip()
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Inventory.name.ilike(like),
                Inventory.category.ilike(like),
                Inventory.description.ilike(like),
            )
        )

    category = request.args.get("category", "").strip()
    if category:
        query = query.filter(db.func.lower(Inventory.category) == category.lower())

    for param, col, cast_fn in [
        ("minQty", Inventory.quantity, int),
        ("maxQty", Inventory.quantity, int),
        ("minPrice", Inventory.price, float),
        ("maxPrice", Inventory.price, float),
    ]:
        val = request.args.get(param)
        if val not in (None, ""):
            try:
                v = cast_fn(val)
            except (ValueError, TypeError):
                continue
            if "min" in param.lower():
                query = query.filter(col >= v)
            else:
                query = query.filter(col <= v)

    expiry_from = request.args.get("expiryFrom")
    expiry_to = request.args.get("expiryTo")
    if expiry_from:
        try:
            query = query.filter(
                Inventory.expiry >= datetime.strptime(expiry_from, "%Y-%m-%d").date()
            )
        except ValueError:
            pass
    if expiry_to:
        try:
            query = query.filter(
                Inventory.expiry <= datetime.strptime(expiry_to, "%Y-%m-%d").date()
            )
        except ValueError:
            pass

    items = query.order_by(Inventory.id.desc()).all()
    return jsonify([i.to_dict() for i in items]), 200


@app.route("/api/inventory", methods=["POST"])
@jwt_required()
def add_inventory():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    expiry = data.get("expiry")
    quantity = data.get("quantity")
    category = (data.get("category") or "").strip()
    price = data.get("price")
    description = (data.get("description") or "").strip()

    if not all([name, quantity is not None, category, price is not None]):
        return jsonify({"error": "Missing required fields: name, quantity, category, price"}), 400

    try:
        quantity = int(quantity)
        price = float(price)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid quantity or price"}), 400

    expiry_date = None
    if expiry:
        try:
            expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid expiry date format. Use YYYY-MM-DD"}), 400

    inventory = Inventory.query.filter(
        db.func.lower(Inventory.name) == name.lower()
    ).first()

    if inventory:
        inventory.quantity = quantity
        inventory.price = price
        inventory.category = category
        inventory.expiry = expiry_date
        inventory.description = description
        if inventory.status == "deleted":
            inventory.status = "active"
        msg = "Inventory updated successfully"
    else:
        inventory = Inventory(
            name=name,
            expiry=expiry_date,
            quantity=quantity,
            category=category,
            price=price,
            description=description,
            status="active",
        )
        db.session.add(inventory)
        msg = "Inventory created successfully"

    db.session.commit()
    return jsonify({"message": msg, "item": inventory.to_dict()}), 201


@app.route("/api/inventory/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_inventory(item_id):
    inventory = Inventory.query.get(item_id)
    if not inventory:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json() or {}

    if "name" in data:
        inventory.name = (data["name"] or "").strip()
    if "expiry" in data:
        if data["expiry"]:
            try:
                inventory.expiry = datetime.strptime(data["expiry"], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Invalid expiry date format"}), 400
        else:
            inventory.expiry = None
    if "quantity" in data:
        inventory.quantity = int(data["quantity"])
    if "category" in data:
        inventory.category = (data["category"] or "").strip()
    if "price" in data:
        inventory.price = float(data["price"])
    if "description" in data:
        inventory.description = (data["description"] or "").strip()
    if "status" in data:
        inventory.status = data["status"]

    db.session.commit()
    return jsonify({"message": "Inventory updated", "item": inventory.to_dict()}), 200


@app.route("/api/inventory/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_inventory(item_id):
    inventory = Inventory.query.get(item_id)
    if not inventory:
        return jsonify({"error": "Item not found"}), 404

    inventory.status = "deleted"
    db.session.commit()
    return jsonify({"message": "Item deleted"}), 200


# ================================================================
# TRANSACTIONS
# ================================================================
@app.route("/api/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    quantity = data.get("quantity")
    transaction_type = data.get("transaction_type", "sale")

    if not name or quantity is None:
        return jsonify({"error": "Missing required fields: name, quantity"}), 400

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid quantity"}), 400

    if quantity <= 0:
        return jsonify({"error": "Quantity must be positive"}), 400

    inventory = Inventory.query.filter(
        db.func.lower(Inventory.name) == name.lower(),
        Inventory.status != "deleted",
    ).first()

    if not inventory:
        return jsonify({"error": "Item not found in inventory"}), 404

    if transaction_type == "sale":
        if inventory.expiry and inventory.expiry < date.today():
            return jsonify({"error": "Item is expired and cannot be sold"}), 400
        if inventory.quantity < quantity:
            return jsonify(
                {"error": f"Insufficient stock. Available: {inventory.quantity}"}
            ), 400
        inventory.quantity -= quantity
        total_price = round(quantity * inventory.price, 2)
    elif transaction_type == "purchase":
        inventory.quantity += quantity
        total_price = round(-(quantity * inventory.price), 2)
    else:
        return jsonify({"error": "Invalid transaction type. Use 'sale' or 'purchase'"}), 400

    transaction = Transaction(
        product_id=inventory.id,
        product_name=inventory.name,
        transaction_type=transaction_type,
        product_quantity=quantity,
        total_price=total_price,
        time_of_transaction=datetime.utcnow(),
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify(
        {
            "message": "Transaction completed",
            "total_price": total_price,
            "transaction": transaction.to_dict(),
        }
    ), 201

@app.route("/inventory", methods=["GET"])
def get_inventory():
    inventory_items = Inventory.query.all()

    result = []
    for item in inventory_items:
        result.append({
            "id": item.id,
            "name": item.name,
            "expiry": item.expiry.isoformat() if item.expiry else None,
            "quantity": item.quantity,
            "category": item.category,
            "price": item.price,
            "description": item.description
        })

    return jsonify(result), 200

@app.route("/predict", methods=["GET"])
def predict_product():
    sku_id = request.args.get('sku_id')
    date = request.args.get('date')
    temp = request.args.get('temp')
    rain = request.args.get('rain')
    holiday = request.args.get('holiday')

    return jsonify({
        'prediction': predict_from_saved_model(sku_id, date, temp, rain, holiday)
    }), 200


def predict_from_saved_model(sku_id, date, temp, rain, holiday):
    model_path = os.path.join('saved_models', f"{sku_id}.pkl")

    if os.path.exists(model_path):
        model = joblib.load(model_path)

        input_df = pd.DataFrame({
            'ds': [pd.to_datetime(date)],
            'temp_c': [temp],
            'rain_mm': [rain],
            'is_holiday': [holiday]
        })

        forecast = model.predict(input_df)
        return forecast['yhat'].iloc[0]
    else:
        return "Model not found!"

@app.route("/api/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    transactions = Transaction.query.order_by(
        Transaction.time_of_transaction.desc()
    ).all()
    return jsonify([t.to_dict() for t in transactions]), 200


# ================================================================
# EXPIRY RADAR
# ================================================================
@app.route("/api/expiry-radar", methods=["GET"])
def get_expiry_radar():
    try:
        days = int(request.args.get("days", "30"))
    except ValueError:
        days = 30

    category = request.args.get("category", "").strip()

    query = Inventory.query.filter(Inventory.status != "deleted")
    if category:
        query = query.filter(db.func.lower(Inventory.category) == category.lower())

    items = query.all()
    today = date.today()

    expired, expiring_soon, safe = [], [], []

    for item in items:
        d = item.to_dict()
        delta = (item.expiry - today).days if item.expiry else 9999
        d["daysToExpiry"] = delta

        if delta <= 0:
            d["expiryStatus"] = "expired"
            expired.append(d)
        elif delta <= days:
            d["expiryStatus"] = "expiringSoon"
            expiring_soon.append(d)
        else:
            d["expiryStatus"] = "safe"
            safe.append(d)

    expired.sort(key=lambda x: x["daysToExpiry"])
    expiring_soon.sort(key=lambda x: x["daysToExpiry"])
    safe.sort(key=lambda x: x["daysToExpiry"])

    return jsonify(
        {
            "expired": expired,
            "expiringSoon": expiring_soon,
            "safe": safe,
            "counts": {
                "total": len(items),
                "expired": len(expired),
                "expiringSoon": len(expiring_soon),
                "safe": len(safe),
            },
        }
    ), 200


# ----------------------------------------------------------------
# INIT
# ----------------------------------------------------------------
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)