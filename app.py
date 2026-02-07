from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
from config import Config
from models import db, Inventory, Transaction
from auth import auth
from datetime import datetime
import joblib
import os
import pandas as pd

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

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)