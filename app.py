"""
EcoGrid AI — Flask application entrypoint.

Run with:
    pip install -r requirements.txt
    python app.py

The app uses SQLite by default (zero setup). To use MySQL in production,
set DATABASE_URL in a .env file (see .env.example) and run database.sql
against your MySQL server first.
"""
import os
from datetime import date
from flask import Flask, render_template
from config import Config
from extensions import db, login_manager, csrf


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Ensure instance folder exists (holds the SQLite file by default)
    os.makedirs(app.instance_path, exist_ok=True)

    # --- Init extensions ---
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    # --- User loader for Flask-Login ---
    from models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # --- Register blueprints ---
    from blueprints.main import main_bp
    from blueprints.auth import auth_bp
    from blueprints.dashboard import dashboard_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)

    # --- Template context (year for footer, current_year, etc.) ---
    @app.context_processor
    def inject_globals():
        return {'current_year': date.today().year}

    # --- Error handlers ---
    @app.errorhandler(404)
    def not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template('500.html'), 500

    # --- Create tables + seed demo data on first run ---
    with app.app_context():
        db.create_all()
        _seed_demo_data()

    return app


def _seed_demo_data():
    """Populate the dashboard with realistic demo rows the first time the app runs."""
    from models import EnergyUsage, MachineStatus, RenewableEnergy, Alert, Report

    if EnergyUsage.query.first() is None:
        usage_rows = [
            ('Mon', 420), ('Tue', 460), ('Wed', 402), ('Thu', 480),
            ('Fri', 512), ('Sat', 300), ('Sun', 260),
        ]
        for day, kwh in usage_rows:
            db.session.add(EnergyUsage(day_label=day, kwh=kwh))

    if MachineStatus.query.first() is None:
        machines = [
            ('CNC Lathe 01', 'ok', 'Normal'),
            ('Compressor B', 'warn', 'Watch'),
            ('Conveyor 3', 'ok', 'Normal'),
            ('Motor Bay 2', 'crit', 'Alert'),
            ('Chiller Unit', 'ok', 'Normal'),
        ]
        for name, status, note in machines:
            db.session.add(MachineStatus(machine_name=name, status=status, note=note))

    if RenewableEnergy.query.first() is None:
        db.session.add(RenewableEnergy(
            solar_kwh_today=142, wind_contribution_pct=6,
            co2_avoided_tonnes=1.8, trees_equivalent=82
        ))

    if Alert.query.first() is None:
        alerts = [
            ('Motor Bay 2', 'Vibration 34% above safe threshold — inspect within 48 hrs.', 'crit'),
            ('Compressor B', 'Idle draw for 42 minutes with no production load.', 'warn'),
            ('Grid Peak Demand', 'Approaching contracted demand limit between 6–7pm.', 'info'),
        ]
        for title, desc, sev in alerts:
            db.session.add(Alert(title=title, description=desc, severity=sev))

    if Report.query.first() is None:
        db.session.add(Report(title='Weekly report generated — Jul 28', report_type='weekly'))
        db.session.add(Report(title='June Carbon Report ready', report_type='carbon'))

    db.session.commit()


app = create_app()

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', True), host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
