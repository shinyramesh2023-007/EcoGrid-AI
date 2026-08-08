"""
EcoGrid AI — main blueprint.
Public marketing pages: home, about, features, technologies, contact, privacy, terms.
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from extensions import db
from models import ContactMessage
from forms import ContactForm

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    return render_template('index.html')


@main_bp.route('/about')
def about():
    return render_template('about.html')


@main_bp.route('/features')
def features():
    return render_template('features.html')


@main_bp.route('/technologies')
def technologies():
    return render_template('technologies.html')


@main_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        msg = ContactMessage(
            name=form.name.data.strip(),
            company=(form.company.data or '').strip(),
            email=form.email.data.strip().lower(),
            phone=(form.phone.data or '').strip(),
            message=form.message.data.strip(),
        )
        db.session.add(msg)
        db.session.commit()
        flash("Thanks — your message has been received. We'll get back to you within 1 business day.", 'success')
        return redirect(url_for('main.contact'))
    elif request.method == 'POST':
        flash('Please fix the highlighted fields before sending.', 'error')
    return render_template('contact.html', form=form)


@main_bp.route('/privacy')
def privacy():
    return render_template('privacy.html')


@main_bp.route('/terms')
def terms():
    return render_template('terms.html')


@main_bp.route('/newsletter', methods=['POST'])
def newsletter():
    # Demo-only endpoint; wire up to a real ESP/mailing list provider in production.
    email = request.form.get('email', '').strip()
    if email:
        flash('Subscribed! Check your inbox for a confirmation email.', 'success')
    return redirect(request.referrer or url_for('main.index'))
