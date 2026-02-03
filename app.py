from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from auth import auth

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth, url_prefix="/auth")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)