import unittest
from datetime import datetime, date
from app import create_app
from app.extensions import db
from app.models import Employee, Attendance

class TestModels(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        
        # Create test employee
        self.employee = Employee(
            employee_id='TEST001',
            name='Test User',
            department='Testing',
            email='test@example.com'
        )
        db.session.add(self.employee)
        db.session.commit()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_employee_creation(self):
        self.assertEqual(self.employee.employee_id, 'TEST001')
        self.assertEqual(self.employee.name, 'Test User')
        self.assertTrue(self.employee.is_active)
    
    def test_attendance_creation(self):
        attendance = Attendance(
            employee_id='TEST001',
            date=date.today(),
            check_in=datetime.now(),
            status='Present'
        )
        db.session.add(attendance)
        db.session.commit()
        
        self.assertEqual(attendance.employee_id, 'TEST001')
        self.assertEqual(attendance.status, 'Present')
    
    def test_employee_to_dict(self):
        employee_dict = self.employee.to_dict()
        
        self.assertIn('employee_id', employee_dict)
        self.assertIn('name', employee_dict)
        self.assertIn('department', employee_dict)
        self.assertEqual(employee_dict['employee_id'], 'TEST001')

if __name__ == '__main__':
    unittest.main()