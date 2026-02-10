from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..services.attendance_service import AttendanceService
from ..utils.validators import validate_attendance_data

attendance_bp = Blueprint('attendance', __name__)
attendance_service = AttendanceService()

@attendance_bp.route('/check-in', methods=['POST'])
@jwt_required()
def check_in():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    # Use employee ID from token or request body
    employee_id = data.get('employee_id') or current_user.get('employee_id')
    
    if not employee_id:
        return jsonify({'message': 'Employee ID is required'}), 400
    
    try:
        result = attendance_service.check_in(employee_id, data.get('notes'))
        
        if not result['success']:
            return jsonify({'message': result['message']}), 400
        
        return jsonify({
            'message': result['message'],
            'attendance': result['attendance'].to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/check-out', methods=['POST'])
@jwt_required()
def check_out():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    employee_id = data.get('employee_id') or current_user.get('employee_id')
    
    if not employee_id:
        return jsonify({'message': 'Employee ID is required'}), 400
    
    try:
        result = attendance_service.check_out(employee_id, data.get('notes'))
        
        if not result['success']:
            return jsonify({'message': result['message']}), 400
        
        return jsonify({
            'message': result['message'],
            'attendance': result['attendance'].to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/status/today', methods=['GET'])
@jwt_required()
def get_today_status():
    current_user = get_jwt_identity()
    employee_id = request.args.get('employee_id') or current_user.get('employee_id')
    
    if not employee_id:
        return jsonify({'message': 'Employee ID is required'}), 400
    
    try:
        status = attendance_service.get_today_status(employee_id)
        return jsonify(status)
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/history/<employee_id>', methods=['GET'])
@jwt_required()
def get_attendance_history(employee_id):
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 30))
        
        history, total = attendance_service.get_attendance_history(
            employee_id=employee_id,
            start_date=start_date,
            end_date=end_date,
            page=page,
            per_page=per_page
        )
        
        return jsonify({
            'history': [record.to_dict() for record in history],
            'total': total,
            'page': page,
            'per_page': per_page
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/manual', methods=['POST'])
@jwt_required()
def manual_attendance():
    data = request.get_json()
    
    errors = validate_attendance_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        attendance = attendance_service.create_manual_attendance(data)
        
        return jsonify({
            'message': 'Manual attendance recorded successfully',
            'attendance': attendance.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/<attendance_id>', methods=['PUT'])
@jwt_required()
def update_attendance(attendance_id):
    data = request.get_json()
    
    try:
        attendance = attendance_service.update_attendance(attendance_id, data)
        
        if not attendance:
            return jsonify({'message': 'Attendance record not found'}), 404
        
        return jsonify({
            'message': 'Attendance updated successfully',
            'attendance': attendance.to_dict()
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500