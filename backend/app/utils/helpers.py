import json
from datetime import datetime, date
from decimal import Decimal

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

def format_date(date_obj, format_str='%Y-%m-%d'):
    if not date_obj:
        return None
    return date_obj.strftime(format_str)

def format_time(time_obj, format_str='%H:%M:%S'):
    if not time_obj:
        return None
    return time_obj.strftime(format_str)

def calculate_age(birth_date):
    if not birth_date:
        return None
    
    today = date.today()
    age = today.year - birth_date.year
    
    # Adjust if birthday hasn't occurred this year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    
    return age

def paginate_query(query, page, per_page):
    return query.paginate(page=page, per_page=per_page, error_out=False)

def get_pagination_info(pagination):
    return {
        'page': pagination.page,
        'per_page': pagination.per_page,
        'total': pagination.total,
        'pages': pagination.pages,
        'has_prev': pagination.has_prev,
        'has_next': pagination.has_next,
        'prev_num': pagination.prev_num,
        'next_num': pagination.next_num
    }

def safe_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default