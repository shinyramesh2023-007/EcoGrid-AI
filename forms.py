"""
EcoGrid AI — WTForms definitions (server-side validation + CSRF protection).
"""
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, Regexp


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(message='Enter a valid email address.')])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember me')
    submit = SubmitField('Log In')


class RegisterForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=120)])
    company = StringField('Company', validators=[Optional(), Length(max=160)])
    email = StringField('Email', validators=[DataRequired(), Email(message='Enter a valid email address.')])
    phone = StringField('Phone', validators=[
        Optional(),
        Regexp(r'^[+\d][\d\s-]{7,15}$', message='Enter a valid phone number.')
    ])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, message='Password must be at least 8 characters.')])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(), EqualTo('password', message='Passwords must match.')
    ])
    terms = BooleanField('Terms', validators=[DataRequired(message='You must accept the Terms of Service.')])
    submit = SubmitField('Create Account')


class ContactForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=120)])
    company = StringField('Company', validators=[Optional(), Length(max=160)])
    email = StringField('Email', validators=[DataRequired(), Email(message='Enter a valid email address.')])
    phone = StringField('Phone', validators=[
        Optional(),
        Regexp(r'^[+\d][\d\s-]{7,15}$', message='Enter a valid phone number.')
    ])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10, message='Message should be at least 10 characters.')])
    submit = SubmitField('Send Message')
