from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from ..models import Employee, db
from ..services.employee_service import EmployeeService
from ..utils.validators import validate_employee_data

employees_bp = Blueprint('employees', __name__)
employee_service = EmployeeService()

@employees_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    try:
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        department = request.args.get('department')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        employees, total = employee_service.get_employees(
            active_only=active_only,
            department=department,
            page=page,
            per_page=per_page
        )
        
        return jsonify({
            'employees': [emp.to_dict() for emp in employees],
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/<employee_id>', methods=['GET'])
@jwt_required()
def get_employee(employee_id):
    employee = employee_service.get_employee_by_id(employee_id)
    
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    
    return jsonify(employee.to_dict())

@employees_bp.route('/', methods=['POST'])
@jwt_required()
def create_employee():
    data = request.get_json()
    
    # Validate data
    errors = validate_employee_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        employee = employee_service.create_employee(data)
        return jsonify({
            'message': 'Employee created successfully',
            'employee': employee.to_dict()
        }), 201
        
    except IntegrityError:
        return jsonify({'message': 'Employee ID or Email already exists'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/<employee_id>', methods=['PUT'])
@jwt_required()
def update_employee(employee_id):
    data = request.get_json()
    
    try:
        employee = employee_service.update_employee(employee_id, data)
        
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        return jsonify({
            'message': 'Employee updated successfully',
            'employee': employee.to_dict()
        })
        
    except IntegrityError:
        return jsonify({'message': 'Email already exists'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/<employee_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(employee_id):
    try:
        success = employee_service.delete_employee(employee_id)
        
        if not success:
            return jsonify({'message': 'Employee not found'}), 404
        
        return jsonify({'message': 'Employee deleted successfully'})
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/<employee_id>/activate', methods=['POST'])
@jwt_required()
def activate_employee(employee_id):
    try:
        employee = employee_service.toggle_employee_status(employee_id, True)
        
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        return jsonify({
            'message': 'Employee activated successfully',
            'employee': employee.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/<employee_id>/deactivate', methods=['POST'])
@jwt_required()
def deactivate_employee(employee_id):
    try:
        employee = employee_service.toggle_employee_status(employee_id, False)
        
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        return jsonify({
            'message': 'Employee deactivated successfully',
            'employee': employee.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500