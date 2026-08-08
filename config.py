"""
EcoGrid AI — Flask configuration
Reads settings from environment variables (see .env.example).
Falls back to safe local-dev defaults so the app runs with zero setup.
"""
import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))


class Config:
    # --- Core ---
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-this-in-production')
    WTF_CSRF_ENABLED = True

    # --- Database ---
    # Default: SQLite file under /instance — zero-config, works out of the box.
    # To use MySQL instead, set DATABASE_URL in .env, e.g.:
    #   mysql+pymysql://ecogrid_user:password@localhost/ecogrid_db
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'ecogrid.db')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- Session / cookies ---
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 60 * 60 * 24 * 14  # 14 days

    # --- Mail placeholders (contact form logging only by default) ---
    MAIL_ENABLED = os.environ.get('MAIL_ENABLED', 'false').lower() == 'true'

    DEBUG = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
