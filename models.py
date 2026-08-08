"""
EcoGrid AI — database models.
Covers: Users, ContactMessages, EnergyUsage, MachineStatus, RenewableEnergy, Alerts, Reports.
"""
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(160), unique=True, nullable=False, index=True)
    company = db.Column(db.String(160))
    phone = db.Column(db.String(30))
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def __repr__(self):
        return f'<User {self.email}>'


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(160))
    email = db.Column(db.String(160), nullable=False)
    phone = db.Column(db.String(30))
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<ContactMessage {self.email}>'


class EnergyUsage(db.Model):
    """Daily plant-level energy usage, used for the dashboard line chart."""
    __tablename__ = 'energy_usage'

    id = db.Column(db.Integer, primary_key=True)
    day_label = db.Column(db.String(10), nullable=False)   # e.g. 'Mon'
    kwh = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)


class MachineStatus(db.Model):
    """Machine health rows, used in the dashboard status list."""
    __tablename__ = 'machine_status'

    id = db.Column(db.Integer, primary_key=True)
    machine_name = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(10), nullable=False)   # ok / warn / crit
    note = db.Column(db.String(120))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


class RenewableEnergy(db.Model):
    """Solar / wind / carbon tracking figures for the dashboard renewable panel."""
    __tablename__ = 'renewable_energy'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=datetime.utcnow)
    solar_kwh_today = db.Column(db.Float, default=0)
    wind_contribution_pct = db.Column(db.Float, default=0)
    co2_avoided_tonnes = db.Column(db.Float, default=0)
    trees_equivalent = db.Column(db.Integer, default=0)


class Alert(db.Model):
    """Abnormal-usage / predictive-maintenance alerts."""
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.String(255))
    severity = db.Column(db.String(10), nullable=False)   # crit / warn / info
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Report(db.Model):
    """Generated report records shown in the 'AI Alerts & Recent Reports' panel."""
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    report_type = db.Column(db.String(40), default='weekly')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
