from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import Employee
from ..extensions import db
from ..utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)

# Simple authentication - in production, use proper auth with hashed passwords
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('employee_id'):
        return jsonify({'message': 'Employee ID is required'}), 400
    
    employee = Employee.query.filter_by(employee_id=data['employee_id']).first()
    
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    
    if not employee.is_active:
        return jsonify({'message': 'Employee account is inactive'}), 403
    
    # In a real app, verify password here
    access_token = create_access_token(identity={
        'employee_id': employee.employee_id,
        'name': employee.name,
        'department': employee.department
    })
    
    return jsonify({
        'access_token': access_token,
        'employee': employee.to_dict()
    })

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    employee = Employee.query.filter_by(employee_id=current_user['employee_id']).first()
    
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    
    return jsonify(employee.to_dict())