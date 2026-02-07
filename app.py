from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
from config import Config
from models import db, Inventory, Transaction
from auth import auth
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth, url_prefix="/auth")


# -------------------------
# ADD INVENTORY (LOGIN REQUIRED)
# -------------------------
@app.route("/inventory", methods=["POST"])
@jwt_required()
def add_inventory():
    data = request.get_json()

    name = data.get("name")
    expiry = data.get("expiry")  # YYYY-MM-DD
    quantity = data.get("quantity")
    category = data.get("category")
    price = data.get("price")
    description = data.get("description")

    if not all([name, quantity, category, price]):
        return jsonify({"error": "Missing required fields"}), 400

    expiry_date = None
    if expiry:
        expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()

    inventory = Inventory.query.filter_by(name=name).first()

    if inventory:
        inventory.quantity += quantity
        inventory.price = price
        inventory.category = category
        inventory.expiry = expiry_date
        inventory.description = description
    else:
        inventory = Inventory(
            name=name,
            expiry=expiry_date,
            quantity=quantity,
            category=category,
            price=price,
            description=description
        )
        db.session.add(inventory)

    db.session.commit()

    return jsonify({"message": "Inventory saved successfully"}), 201


# -------------------------
# CREATE TRANSACTION
# -------------------------
@app.route("/transactions", methods=["POST"])
def create_transaction():
    data = request.get_json()

    name = data.get("name")
    quantity = data.get("quantity")

    if not all([name, quantity]):
        return jsonify({"error": "Missing fields"}), 400

    inventory = Inventory.query.filter_by(name=name).first()

    if not inventory:
        return jsonify({"error": "Item not found"}), 404

    if inventory.expiry and inventory.expiry < datetime.utcnow().date():
        return jsonify({"error": "Item is expired"}), 400

    if inventory.quantity < quantity:
        return jsonify({"error": "Insufficient stock"}), 400

    total_price = quantity * inventory.price

    inventory.quantity -= quantity

    transaction = Transaction(
        product_name=name,
        product_quantity=quantity,
        total_price=total_price,
        time_of_transaction=datetime.utcnow()
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction completed",
        "total_price": total_price
    }), 201


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)