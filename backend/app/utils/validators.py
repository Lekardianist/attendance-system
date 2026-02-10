import re
from datetime import datetime

def validate_email(email):
    if not email:
        return True  # Email is optional
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    if not phone:
        return True  # Phone is optional
    
    # Basic phone validation - adjust as needed
    pattern = r'^[\d\s\-\+\(\)]{10,20}$'
    return re.match(pattern, phone) is not None

def validate_employee_data(data):
    errors = []
    
    if not data.get('employee_id'):
        errors.append('Employee ID is required')
    
    if not data.get('name'):
        errors.append('Name is required')
    
    if data.get('email') and not validate_email(data['email']):
        errors.append('Invalid email format')
    
    if data.get('phone') and not validate_phone(data['phone']):
        errors.append('Invalid phone number format')
    
    if data.get('hire_date'):
        try:
            datetime.strptime(data['hire_date'], '%Y-%m-%d')
        except ValueError:
            errors.append('Invalid hire date format. Use YYYY-MM-DD')
    
    return errors

def validate_attendance_data(data):
    errors = []
    
    if not data.get('employee_id'):
        errors.append('Employee ID is required')
    
    if not data.get('date'):
        errors.append('Date is required')
    else:
        try:
            datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            errors.append('Invalid date format. Use YYYY-MM-DD')
    
    if data.get('check_in_time'):
        try:
            datetime.strptime(data['check_in_time'], '%H:%M:%S')
        except ValueError:
            errors.append('Invalid check-in time format. Use HH:MM:SS')
    
    if data.get('check_out_time'):
        try:
            datetime.strptime(data['check_out_time'], '%H:%M:%S')
        except ValueError:
            errors.append('Invalid check-out time format. Use HH:MM:SS')
    
    return errors

def validate_password(password):
    if len(password) < 8:
        return 'Password must be at least 8 characters long'
    
    if not any(c.isupper() for c in password):
        return 'Password must contain at least one uppercase letter'
    
    if not any(c.islower() for c in password):
        return 'Password must contain at least one lowercase letter'
    
    if not any(c.isdigit() for c in password):
        return 'Password must contain at least one digit'
    
    return None