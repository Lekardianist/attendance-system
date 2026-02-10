from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta
import io
from ..services.report_service import ReportService

reports_bp = Blueprint('reports', __name__)
report_service = ReportService()

@reports_bp.route('/daily', methods=['GET'])
@jwt_required()
def daily_report():
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        department = request.args.get('department')
        
        report = report_service.generate_daily_report(date_str, department)
        
        return jsonify({
            'date': date_str,
            'total_employees': report['total_employees'],
            'present_count': report['present_count'],
            'absent_count': report['absent_count'],
            'late_count': report['late_count'],
            'attendance_list': report['attendance_list']
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@reports_bp.route('/monthly', methods=['GET'])
@jwt_required()
def monthly_report():
    try:
        year = int(request.args.get('year', datetime.now().year))
        month = int(request.args.get('month', datetime.now().month))
        employee_id = request.args.get('employee_id')
        
        report = report_service.generate_monthly_report(year, month, employee_id)
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@reports_bp.route('/employee-summary/<employee_id>', methods=['GET'])
@jwt_required()
def employee_summary(employee_id):
    try:
        year = int(request.args.get('year', datetime.now().year))
        month = int(request.args.get('month', datetime.now().month))
        
        summary = report_service.generate_employee_summary(employee_id, year, month)
        
        return jsonify(summary)
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@reports_bp.route('/export/daily', methods=['GET'])
@jwt_required()
def export_daily_report():
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        export_format = request.args.get('format', 'csv')
        
        if export_format == 'csv':
            csv_data = report_service.export_daily_report_csv(date_str)
            return send_file(
                io.BytesIO(csv_data.encode()),
                mimetype='text/csv',
                as_attachment=True,
                download_name=f'attendance_report_{date_str}.csv'
            )
        elif export_format == 'excel':
            excel_data = report_service.export_daily_report_excel(date_str)
            return send_file(
                io.BytesIO(excel_data),
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                as_attachment=True,
                download_name=f'attendance_report_{date_str}.xlsx'
            )
        else:
            return jsonify({'message': 'Unsupported format'}), 400
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@reports_bp.route('/statistics', methods=['GET'])
@jwt_required()
def attendance_statistics():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        department = request.args.get('department')
        
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        statistics = report_service.get_attendance_statistics(start_date, end_date, department)
        
        return jsonify(statistics)
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500