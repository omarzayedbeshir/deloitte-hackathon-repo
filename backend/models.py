from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True, default="")
    status = db.Column(db.String(20), nullable=False, default="active")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description or "",
            "status": self.status,
        }


class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sku_id = db.Column(db.String(20), unique=True, nullable=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    expiry = db.Column(db.Date, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="active")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "sku_id": self.sku_id or "",
            "name": self.name,
            "expiry": self.expiry.isoformat() if self.expiry else None,
            "quantity": self.quantity,
            "category": self.category,
            "price": self.price,
            "description": self.description or "",
            "status": self.status,
        }


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    product_name = db.Column(db.String(120), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)
    product_quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    time_of_transaction = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "product_id": str(self.product_id),
            "product_name": self.product_name,
            "transaction_type": self.transaction_type,
            "product_quantity": self.product_quantity,
            "total_price": self.total_price,
            "time_of_transaction": self.time_of_transaction.isoformat(),
        }
