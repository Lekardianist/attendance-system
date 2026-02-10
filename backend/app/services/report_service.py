from datetime import datetime, timedelta
import csv
import io
import pandas as pd
from sqlalchemy import func, extract
from ..models import Employee, Attendance, db

class ReportService:
    def generate_daily_report(self, date_str, department=None):
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Get all active employees
        query = Employee.query.filter_by(is_active=True)
        if department:
            query = query.filter_by(department=department)
        
        employees = query.all()
        
        # Get attendance for the date
        attendance_records = Attendance.query.filter_by(date=date).all()
        attendance_dict = {record.employee_id: record for record in attendance_records}
        
        attendance_list = []
        present_count = 0
        absent_count = 0
        late_count = 0
        
        for employee in employees:
            attendance = attendance_dict.get(employee.employee_id)
            
            if attendance and attendance.check_in:
                status = attendance.status
                if status == 'Present' or status == 'Late':
                    present_count += 1
                    if status == 'Late':
                        late_count += 1
                else:
                    absent_count += 1
            else:
                status = 'Absent'
                absent_count += 1
            
            attendance_list.append({
                'employee_id': employee.employee_id,
                'name': employee.name,
                'department': employee.department,
                'check_in': attendance.check_in.strftime('%H:%M:%S') if attendance and attendance.check_in else '-',
                'check_out': attendance.check_out.strftime('%H:%M:%S') if attendance and attendance.check_out else '-',
                'status': status,
                'late_minutes': attendance.late_minutes if attendance else 0,
                'overtime_minutes': attendance.overtime_minutes if attendance else 0
            })
        
        return {
            'total_employees': len(employees),
            'present_count': present_count,
            'absent_count': absent_count,
            'late_count': late_count,
            'attendance_list': attendance_list
        }
    
    def generate_monthly_report(self, year, month, employee_id=None):
        # Get date range for the month
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
        
        # Query attendance
        query = Attendance.query.filter(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
        
        if employee_id:
            query = query.filter_by(employee_id=employee_id)
            employee = Employee.query.filter_by(employee_id=employee_id).first()
            employee_info = employee.to_dict() if employee else None
        else:
            employee_info = None
        
        attendance_records = query.all()
        
        # Group by employee
        employee_attendance = {}
        for record in attendance_records:
            if record.employee_id not in employee_attendance:
                employee_attendance[record.employee_id] = []
            employee_attendance[record.employee_id].append(record.to_dict())
        
        # Calculate statistics
        total_days = (end_date - start_date).days + 1
        work_days = 0
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() < 5:  # Monday to Friday
                work_days += 1
            current_date += timedelta(days=1)
        
        return {
            'year': year,
            'month': month,
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'total_days': total_days,
            'work_days': work_days,
            'employee_info': employee_info,
            'attendance_data': employee_attendance
        }
    
    def generate_employee_summary(self, employee_id, year, month):
        employee = Employee.query.filter_by(employee_id=employee_id).first()
        if not employee:
            return {'error': 'Employee not found'}
        
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
        
        # Get attendance records
        attendance_records = Attendance.query.filter(
            Attendance.employee_id == employee_id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).all()
        
        # Calculate statistics
        total_days = (end_date - start_date).days + 1
        work_days = 0
        present_days = 0
        late_days = 0
        absent_days = 0
        total_late_minutes = 0
        total_overtime_minutes = 0
        
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() < 5:  # Monday to Friday
                work_days += 1
                
                # Find attendance for this date
                attendance = None
                for record in attendance_records:
                    if record.date == current_date:
                        attendance = record
                        break
                
                if attendance and attendance.check_in:
                    present_days += 1
                    if attendance.status == 'Late':
                        late_days += 1
                        total_late_minutes += attendance.late_minutes
                    total_overtime_minutes += attendance.overtime_minutes
                else:
                    absent_days += 1
            
            current_date += timedelta(days=1)
        
        attendance_rate = (present_days / work_days * 100) if work_days > 0 else 0
        
        return {
            'employee': employee.to_dict(),
            'period': {
                'year': year,
                'month': month,
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            },
            'statistics': {
                'total_days': total_days,
                'work_days': work_days,
                'present_days': present_days,
                'late_days': late_days,
                'absent_days': absent_days,
                'attendance_rate': round(attendance_rate, 2),
                'total_late_minutes': total_late_minutes,
                'total_overtime_minutes': total_overtime_minutes,
                'average_late_minutes': round(total_late_minutes / late_days, 2) if late_days > 0 else 0,
                'average_overtime_minutes': round(total_overtime_minutes / present_days, 2) if present_days > 0 else 0
            },
            'attendance_details': [record.to_dict() for record in attendance_records]
        }
    
    def export_daily_report_csv(self, date_str):
        report = self.generate_daily_report(date_str)
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Daily Attendance Report', date_str])
        writer.writerow([])
        writer.writerow(['Summary'])
        writer.writerow(['Total Employees', report['total_employees']])
        writer.writerow(['Present', report['present_count']])
        writer.writerow(['Absent', report['absent_count']])
        writer.writerow(['Late', report['late_count']])
        writer.writerow([])
        
        # Write attendance list
        writer.writerow(['Employee ID', 'Name', 'Department', 'Check In', 'Check Out', 'Status', 'Late Minutes', 'Overtime Minutes'])
        
        for record in report['attendance_list']:
            writer.writerow([
                record['employee_id'],
                record['name'],
                record['department'],
                record['check_in'],
                record['check_out'],
                record['status'],
                record['late_minutes'],
                record['overtime_minutes']
            ])
        
        return output.getvalue()
    
    def export_daily_report_excel(self, date_str):
        report = self.generate_daily_report(date_str)
        
        # Create DataFrame for summary
        summary_data = {
            'Metric': ['Total Employees', 'Present', 'Absent', 'Late'],
            'Value': [
                report['total_employees'],
                report['present_count'],
                report['absent_count'],
                report['late_count']
            ]
        }
        summary_df = pd.DataFrame(summary_data)
        
        # Create DataFrame for attendance list
        attendance_df = pd.DataFrame(report['attendance_list'])
        
        # Create Excel writer
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            attendance_df.to_excel(writer, sheet_name='Attendance Details', index=False)
        
        return output.getvalue()
    
    def get_attendance_statistics(self, start_date_str, end_date_str, department=None):
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        # Query for statistics
        query = db.session.query(
            Attendance.date,
            func.count(Attendance.id).label('total'),
            func.sum((Attendance.status == 'Present').cast(db.Integer)).label('present'),
            func.sum((Attendance.status == 'Late').cast(db.Integer)).label('late'),
            func.sum((Attendance.status == 'Absent').cast(db.Integer)).label('absent')
        ).filter(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
        
        if department:
            query = query.join(Employee).filter(Employee.department == department)
        
        statistics = query.group_by(Attendance.date).order_by(Attendance.date).all()
        
        # Calculate daily statistics
        daily_stats = []
        for stat in statistics:
            daily_stats.append({
                'date': stat.date.strftime('%Y-%m-%d'),
                'total': stat.total,
                'present': stat.present or 0,
                'late': stat.late or 0,
                'absent': stat.absent or 0,
                'attendance_rate': round((stat.present or 0) / stat.total * 100, 2) if stat.total > 0 else 0
            })
        
        # Calculate overall statistics
        total_records = sum(stat.total for stat in statistics)
        total_present = sum(stat.present or 0 for stat in statistics)
        total_late = sum(stat.late or 0 for stat in statistics)
        
        overall_attendance_rate = round(total_present / total_records * 100, 2) if total_records > 0 else 0
        
        return {
            'period': {
                'start_date': start_date_str,
                'end_date': end_date_str
            },
            'daily_statistics': daily_stats,
            'overall_statistics': {
                'total_records': total_records,
                'total_present': total_present,
                'total_late': total_late,
                'total_absent': total_records - total_present,
                'attendance_rate': overall_attendance_rate
            }
        }