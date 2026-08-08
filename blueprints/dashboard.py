"""
EcoGrid AI — dashboard blueprint.
Renders the live-preview SaaS dashboard using seeded database rows,
and exposes a small JSON API for the same data (useful for the charts
or for wiring up a real IoT feed later).
"""
from flask import Blueprint, render_template, jsonify
from flask_login import current_user
from models import EnergyUsage, MachineStatus, RenewableEnergy, Alert, Report

dashboard_bp = Blueprint('dashboard', __name__)


def _serialize_dashboard():
    usage = EnergyUsage.query.order_by(EnergyUsage.id.asc()).all()
    machines = MachineStatus.query.order_by(MachineStatus.id.asc()).all()
    renewable = RenewableEnergy.query.order_by(RenewableEnergy.id.desc()).first()
    alerts = Alert.query.order_by(Alert.created_at.desc()).limit(5).all()
    reports = Report.query.order_by(Report.created_at.desc()).limit(5).all()

    return {
        'usage': [{'day': u.day_label, 'kwh': u.kwh} for u in usage],
        'machines': [{'name': m.machine_name, 'status': m.status, 'note': m.note} for m in machines],
        'renewable': {
            'solar_kwh_today': renewable.solar_kwh_today if renewable else 0,
            'wind_contribution_pct': renewable.wind_contribution_pct if renewable else 0,
            'co2_avoided_tonnes': renewable.co2_avoided_tonnes if renewable else 0,
            'trees_equivalent': renewable.trees_equivalent if renewable else 0,
        },
        'alerts': [{'title': a.title, 'description': a.description, 'severity': a.severity} for a in alerts],
        'reports': [{'title': r.title, 'type': r.report_type} for r in reports],
    }


@dashboard_bp.route('/dashboard')
def index():
    data = _serialize_dashboard()
    return render_template(
        'dashboard.html',
        usage=data['usage'],
        machines=data['machines'],
        renewable=data['renewable'],
        alerts=data['alerts'],
        reports=data['reports'],
        user=current_user if current_user.is_authenticated else None,
    )


@dashboard_bp.route('/api/dashboard/summary')
def api_summary():
    """JSON endpoint — same data the dashboard page renders. Ready for a real IoT feed."""
    return jsonify(_serialize_dashboard())
