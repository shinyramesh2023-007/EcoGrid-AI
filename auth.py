"""
EcoGrid AI — auth blueprint.
Handles registration, login, logout using Flask-Login sessions.
"""
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from extensions import db
from models import User
from forms import LoginForm, RegisterForm

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    form = RegisterForm()
    if form.validate_on_submit():
        existing = User.query.filter_by(email=form.email.data.strip().lower()).first()
        if existing:
            flash('An account with that email already exists — please log in instead.', 'error')
            return render_template('register.html', form=form)

        user = User(
            full_name=form.full_name.data.strip(),
            email=form.email.data.strip().lower(),
            company=(form.company.data or '').strip(),
            phone=(form.phone.data or '').strip(),
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        flash(f'Welcome to EcoGrid AI, {user.full_name.split(" ")[0]}!', 'success')
        return redirect(url_for('dashboard.index'))

    elif request.method == 'POST':
        flash('Please fix the highlighted fields and try again.', 'error')

    return render_template('register.html', form=form)


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.strip().lower()).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            flash(f'Welcome back, {user.full_name.split(" ")[0]}!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard.index'))
        flash('Invalid email or password.', 'error')

    elif request.method == 'POST':
        flash('Please enter a valid email and password.', 'error')

    return render_template('login.html', form=form)


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('main.index'))
