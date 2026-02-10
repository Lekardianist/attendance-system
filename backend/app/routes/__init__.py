from .auth import auth_bp
from .employees import employees_bp
from .attendance import attendance_bp
from .reports import reports_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(employees_bp, url_prefix='/api/employees')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')