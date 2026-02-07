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

    product_name = data.get("product_name")
    product_quantity = data.get("product_quantity")
    price_per_one = data.get("price_per_one")

    if not all([product_name, product_quantity, price_per_one]):
        return jsonify({"error": "Missing fields"}), 400

    inventory = Inventory.query.filter_by(product_name=product_name).first()

    if inventory:
        inventory.product_quantity += product_quantity
        inventory.price_per_one = price_per_one
    else:
        inventory = Inventory(
            product_name=product_name,
            product_quantity=product_quantity,
            price_per_one=price_per_one
        )
        db.session.add(inventory)

    db.session.commit()

    return jsonify({"message": "Inventory updated successfully"}), 201


# -------------------------
# CREATE TRANSACTION
# -------------------------
@app.route("/transactions", methods=["POST"])
def create_transaction():
    data = request.get_json()

    product_name = data.get("product_name")
    product_quantity = data.get("product_quantity")

    if not all([product_name, product_quantity]):
        return jsonify({"error": "Missing fields"}), 400

    inventory = Inventory.query.filter_by(product_name=product_name).first()

    if not inventory:
        return jsonify({"error": "Product not found in inventory"}), 404

    if inventory.product_quantity < product_quantity:
        return jsonify({"error": "Not enough inventory"}), 400

    total_price = product_quantity * inventory.price_per_one
    inventory.product_quantity -= product_quantity

    transaction = Transaction(
        product_name=product_name,
        product_quantity=product_quantity,
        total_price=total_price,
        time_of_transaction=datetime.utcnow()
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction successful",
        "total_price": total_price
    }), 201


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)