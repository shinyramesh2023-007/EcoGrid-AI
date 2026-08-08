"""
EcoGrid AI — shared extension instances.
Kept in their own module to avoid circular imports between app.py / models.py / blueprints.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf import CSRFProtect

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()

login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access that page.'
login_manager.login_message_category = 'error'
