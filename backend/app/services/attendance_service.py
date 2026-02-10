from datetime import datetime, date, time
from sqlalchemy import and_, or_
from ..models import Employee, Attendance, db
from ..utils.date_utils import is_weekend, get_working_hours

class AttendanceService:
    def check_in(self, employee_id, notes=None):
        today = date.today()
        
        # Check if employee exists and is active
        employee = Employee.query.filter_by(employee_id=employee_id, is_active=True).first()
        if not employee:
            return {'success': False, 'message': 'Employee not found or inactive'}
        
        # Check if already checked in today
        existing = Attendance.query.filter_by(
            employee_id=employee_id,
            date=today
        ).first()
        
        if existing and existing.check_in:
            return {'success': False, 'message': 'Already checked in today'}
        
        # Create or update attendance record
        if existing:
            attendance = existing
        else:
            attendance = Attendance(employee_id=employee_id, date=today)
        
        attendance.check_in = datetime.now()
        attendance.notes = notes
        attendance.calculate_status()
        
        if not existing:
            db.session.add(attendance)
        
        db.session.commit()
        
        return {
            'success': True,
            'message': 'Check-in successful',
            'attendance': attendance
        }
    
    def check_out(self, employee_id, notes=None):
        today = date.today()
        
        attendance = Attendance.query.filter_by(
            employee_id=employee_id,
            date=today
        ).first()
        
        if not attendance:
            return {'success': False, 'message': 'No check-in record found for today'}
        
        if attendance.check_out:
            return {'success': False, 'message': 'Already checked out today'}
        
        attendance.check_out = datetime.now()
        if notes:
            attendance.notes = notes if not attendance.notes else f"{attendance.notes}; {notes}"
        
        # Recalculate status with check-out time
        attendance.calculate_status()
        
        db.session.commit()
        
        return {
            'success': True,
            'message': 'Check-out successful',
            'attendance': attendance
        }
    
    def get_today_status(self, employee_id):
        today = date.today()
        
        attendance = Attendance.query.filter_by(
            employee_id=employee_id,
            date=today
        ).first()
        
        employee = Employee.query.filter_by(employee_id=employee_id).first()
        
        if not employee:
            return {
                'has_checked_in': False,
                'has_checked_out': False,
                'error': 'Employee not found'
            }
        
        if attendance:
            return {
                'has_checked_in': attendance.check_in is not None,
                'has_checked_out': attendance.check_out is not None,
                'check_in_time': attendance.check_in.strftime('%H:%M:%S') if attendance.check_in else None,
                'check_out_time': attendance.check_out.strftime('%H:%M:%S') if attendance.check_out else None,
                'status': attendance.status,
                'late_minutes': attendance.late_minutes,
                'overtime_minutes': attendance.overtime_minutes,
                'notes': attendance.notes
            }
        
        return {
            'has_checked_in': False,
            'has_checked_out': False,
            'employee': employee.to_dict()
        }
    
    def get_attendance_history(self, employee_id, start_date=None, end_date=None, page=1, per_page=30):
        query = Attendance.query.filter_by(employee_id=employee_id)
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Attendance.date >= start_date)
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Attendance.date <= end_date)
        
        query = query.order_by(Attendance.date.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return pagination.items, pagination.total
    
    def create_manual_attendance(self, data):
        employee_id = data['employee_id']
        date_str = data['date']
        
        # Check if record already exists
        existing = Attendance.query.filter_by(
            employee_id=employee_id,
            date=datetime.strptime(date_str, '%Y-%m-%d').date()
        ).first()
        
        if existing:
            attendance = existing
        else:
            attendance = Attendance(
                employee_id=employee_id,
                date=datetime.strptime(date_str, '%Y-%m-%d').date()
            )
        
        # Set check-in time if provided
        if data.get('check_in_time'):
            check_in_str = f"{date_str} {data['check_in_time']}"
            attendance.check_in = datetime.strptime(check_in_str, '%Y-%m-%d %H:%M:%S')
        
        # Set check-out time if provided
        if data.get('check_out_time'):
            check_out_str = f"{date_str} {data['check_out_time']}"
            attendance.check_out = datetime.strptime(check_out_str, '%Y-%m-%d %H:%M:%S')
        
        attendance.status = data.get('status', 'Present')
        attendance.notes = data.get('notes')
        
        # Calculate if times are provided
        if attendance.check_in:
            attendance.calculate_status()
        
        if not existing:
            db.session.add(attendance)
        
        db.session.commit()
        
        return attendance
    
    def update_attendance(self, attendance_id, data):
        attendance = Attendance.query.get(attendance_id)
        
        if not attendance:
            return None
        
        # Update fields
        if 'check_in_time' in data:
            check_in_str = f"{attendance.date.strftime('%Y-%m-%d')} {data['check_in_time']}"
            attendance.check_in = datetime.strptime(check_in_str, '%Y-%m-%d %H:%M:%S')
        
        if 'check_out_time' in data:
            check_out_str = f"{attendance.date.strftime('%Y-%m-%d')} {data['check_out_time']}"
            attendance.check_out = datetime.strptime(check_out_str, '%Y-%m-%d %H:%M:%S')
        
        if 'status' in data:
            attendance.status = data['status']
        
        if 'notes' in data:
            attendance.notes = data['notes']
        
        # Recalculate if times are updated
        if 'check_in_time' in data or 'check_out_time' in data:
            attendance.calculate_status()
        
        attendance.updated_at = datetime.utcnow()
        db.session.commit()
        
        return attendance