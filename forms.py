from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField,SubmitField
from wtforms.validators import InputRequired, Length, EqualTo, ValidationError
from models import User
from passlib.hash import pbkdf2_sha256

def invalid_credentials(form, field):
    """ Username and Password checker"""
    username_entered= form.username.data
    password_entered= field.data

    # check whether credentials are valid
    user_object = User.query.filter_by(username = username_entered).first()
    if user_object is None:
        raise ValidationError('Username or password is incorrect')
    elif not pbkdf2_sha256.verify(password_entered, user_object.password):
        raise ValidationError('Username or password is incorrect')



class RegistrationForm(FlaskForm):
    """Registration Form"""

    username = StringField('username', 
    validators=[InputRequired(message="Username Required"),
    Length(min=4, max=25, message="Username must be from 4 to 25 characters")
    ])

    password = PasswordField('password',
    validators=[InputRequired(message="Password Required"),
    Length(min=8, message="Password must be atleast 8 characters")
    ])

    confirm_password = PasswordField('confirm_password', 
    validators=[InputRequired(message="Password Required"),
    EqualTo('password', message='password must match')
    ])

    submit_btn = SubmitField('Register')

# Using custom validators
    def validate_username(self, username):
        user_object = User.query.filter_by(username = username.data).first()
        if user_object:
            raise ValidationError('Username already exist! select a different username.')

class LoginForm(FlaskForm):
    """ Login Form """
    username = StringField('username',
    validators=[InputRequired(message="Username Required")])

    password = PasswordField('password',
    validators=[InputRequired(message='Password Required'), invalid_credentials])

    submit_btn = SubmitField('Login')

        