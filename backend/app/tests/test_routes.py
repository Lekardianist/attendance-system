import unittest
import json
from datetime import datetime
from app import create_app
from app.extensions import db
from app.models import Employee

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        
        # Create test data
        self.test_employee = Employee(
            employee_id='TEST001',
            name='Test User',
            department='Testing',
            email='test@example.com'
        )
        db.session.add(self.test_employee)
        db.session.commit()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_get_employees(self):
        response = self.client.get('/api/employees/')
        self.assertEqual(response.status_code, 401)  # Unauthorized without JWT
    
    def test_create_employee(self):
        new_employee = {
            'employee_id': 'TEST002',
            'name': 'New Test User',
            'department': 'Development',
            'email': 'newtest@example.com'
        }
        
        response = self.client.post(
            '/api/employees/',
            data=json.dumps(new_employee),
            content_type='application/json'
        )
        
        # Should be unauthorized without JWT
        self.assertEqual(response.status_code, 401)
    
    def test_login(self):
        login_data = {
            'employee_id': 'TEST001'
        }
        
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        # Login should work with test employee
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('access_token', data)

if __name__ == '__main__':
    unittest.main()