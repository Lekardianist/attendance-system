from datetime import datetime, time
from .extensions import db
from .utils.date_utils import get_working_hours

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    position = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    phone = db.Column(db.String(20))
    hire_date = db.Column(db.Date, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attendances = db.relationship('Attendance', backref='employee_ref', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'name': self.name,
            'department': self.department,
            'position': self.position,
            'email': self.email,
            'phone': self.phone,
            'hire_date': self.hire_date.strftime('%Y-%m-%d') if self.hire_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), db.ForeignKey('employee.employee_id'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    check_in = db.Column(db.DateTime)
    check_out = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='Present')  # Present, Late, Absent, Half-day, Leave
    late_minutes = db.Column(db.Integer, default=0)
    overtime_minutes = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('employee_id', 'date', name='unique_attendance_per_day'),
    )
    
    def calculate_status(self, expected_check_in=time(9, 0)):
        if not self.check_in:
            self.status = 'Absent'
            return
        
        check_in_time = self.check_in.time()
        if check_in_time > expected_check_in:
            late_minutes = (check_in_time.hour * 60 + check_in_time.minute) - \
                          (expected_check_in.hour * 60 + expected_check_in.minute)
            self.late_minutes = late_minutes
            self.status = 'Late' if late_minutes <= 30 else 'Half-day'
        else:
            self.status = 'Present'
        
        # Calculate overtime if checked out
        if self.check_out:
            working_hours = get_working_hours(self.check_in, self.check_out)
            if working_hours.total_seconds() / 3600 > 9:  # More than 9 hours
                self.overtime_minutes = int((working_hours.total_seconds() / 3600 - 9) * 60)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'check_in': self.check_in.strftime('%H:%M:%S') if self.check_in else None,
            'check_out': self.check_out.strftime('%H:%M:%S') if self.check_out else None,
            'status': self.status,
            'late_minutes': self.late_minutes,
            'overtime_minutes': self.overtime_minutes,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class AttendanceSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.String(200))
    description = db.Column(db.String(200))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @staticmethod
    def get_setting(key, default=None):
        setting = AttendanceSettings.query.filter_by(key=key).first()
        return setting.value if setting else default

class LeaveRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), db.ForeignKey('employee.employee_id'), nullable=False)
    leave_type = db.Column(db.String(20))  # Sick, Annual, Personal, etc.
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending')  # Pending, Approved, Rejected
    approved_by = db.Column(db.String(100))
    approved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)