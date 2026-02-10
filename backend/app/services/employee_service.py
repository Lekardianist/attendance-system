from datetime import datetime
from sqlalchemy import or_, and_
from ..models import Employee, db

class EmployeeService:
    def get_employees(self, active_only=True, department=None, page=1, per_page=20):
        query = Employee.query
        
        if active_only:
            query = query.filter_by(is_active=True)
        
        if department:
            query = query.filter_by(department=department)
        
        query = query.order_by(Employee.name.asc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return pagination.items, pagination.total
    
    def get_employee_by_id(self, employee_id):
        return Employee.query.filter_by(employee_id=employee_id).first()
    
    def create_employee(self, data):
        employee = Employee(
            employee_id=data['employee_id'],
            name=data['name'],
            department=data.get('department'),
            position=data.get('position'),
            email=data.get('email'),
            phone=data.get('phone'),
            hire_date=datetime.strptime(data['hire_date'], '%Y-%m-%d') if data.get('hire_date') else None
        )
        
        db.session.add(employee)
        db.session.commit()
        
        return employee
    
    def update_employee(self, employee_id, data):
        employee = self.get_employee_by_id(employee_id)
        
        if not employee:
            return None
        
        # Update fields
        if 'name' in data:
            employee.name = data['name']
        if 'department' in data:
            employee.department = data['department']
        if 'position' in data:
            employee.position = data['position']
        if 'email' in data:
            employee.email = data['email']
        if 'phone' in data:
            employee.phone = data['phone']
        if 'is_active' in data:
            employee.is_active = data['is_active']
        
        employee.updated_at = datetime.utcnow()
        db.session.commit()
        
        return employee
    
    def delete_employee(self, employee_id):
        employee = self.get_employee_by_id(employee_id)
        
        if not employee:
            return False
        
        db.session.delete(employee)
        db.session.commit()
        
        return True
    
    def toggle_employee_status(self, employee_id, is_active):
        employee = self.get_employee_by_id(employee_id)
        
        if not employee:
            return None
        
        employee.is_active = is_active
        employee.updated_at = datetime.utcnow()
        db.session.commit()
        
        return employee
    
    def search_employees(self, search_term):
        return Employee.query.filter(
            or_(
                Employee.employee_id.ilike(f'%{search_term}%'),
                Employee.name.ilike(f'%{search_term}%'),
                Employee.email.ilike(f'%{search_term}%'),
                Employee.department.ilike(f'%{search_term}%')
            )
        ).filter_by(is_active=True).all()