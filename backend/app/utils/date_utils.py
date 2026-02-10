from datetime import datetime, timedelta, time

def is_weekend(date_obj):
    return date_obj.weekday() >= 5  # 5 = Saturday, 6 = Sunday

def is_holiday(date_obj, holidays=None):
    if not holidays:
        return False
    return date_obj in holidays

def get_working_days(start_date, end_date, holidays=None):
    if holidays is None:
        holidays = []
    
    days = 0
    current_date = start_date
    
    while current_date <= end_date:
        if not is_weekend(current_date) and current_date not in holidays:
            days += 1
        current_date += timedelta(days=1)
    
    return days

def get_working_hours(check_in, check_out):
    if not check_in or not check_out:
        return timedelta()
    
    # Calculate lunch break (12:00-13:00)
    lunch_start = datetime.combine(check_in.date(), time(12, 0))
    lunch_end = datetime.combine(check_in.date(), time(13, 0))
    
    # Adjust if check-in/check-out during lunch
    if check_in >= lunch_start and check_in < lunch_end:
        check_in = lunch_end
    
    if check_out > lunch_start and check_out <= lunch_end:
        check_out = lunch_start
    
    # Calculate total time
    total_time = check_out - check_in
    
    # Subtract lunch break if work spans lunch time
    if check_in < lunch_end and check_out > lunch_start:
        lunch_overlap = min(lunch_end, check_out) - max(lunch_start, check_in)
        total_time -= max(timedelta(), lunch_overlap)
    
    return total_time

def get_next_workday(date_obj, holidays=None):
    next_day = date_obj + timedelta(days=1)
    
    while is_weekend(next_day) or (holidays and next_day in holidays):
        next_day += timedelta(days=1)
    
    return next_day

def format_duration(minutes):
    if not minutes:
        return "0m"
    
    hours = minutes // 60
    mins = minutes % 60
    
    if hours > 0:
        return f"{hours}h {mins}m"
    else:
        return f"{mins}m"