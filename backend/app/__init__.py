from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .extensions import db, migrate
from .routes import register_blueprints
import os

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    from .config import config
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    JWTManager(app)
    
    # Create instance folder
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Register blueprints
    register_blueprints(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app