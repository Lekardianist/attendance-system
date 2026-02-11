import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaIdCard } from 'react-icons/fa';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onClick }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="employee-card" onClick={() => onClick && onClick(employee)}>
      <div className="card-header">
        <div className="employee-avatar">
          {getInitials(employee.name)}
        </div>
        <div className="employee-basic-info">
          <h4 className="employee-name">{employee.name}</h4>
          <div className="employee-id">
            <FaIdCard className="icon" />
            {employee.employee_id}
          </div>
        </div>
        <div className={`status-badge ${employee.is_active ? 'active' : 'inactive'}`}>
          {employee.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="card-body">
        <div className="info-row">
          <FaBuilding className="icon" />
          <div className="info-content">
            <span className="info-label">Department</span>
            <span className="info-value">{employee.department || '-'}</span>
          </div>
        </div>

        <div className="info-row">
          <div className="icon position-icon">💼</div>
          <div className="info-content">
            <span className="info-label">Position</span>
            <span className="info-value">{employee.position || '-'}</span>
          </div>
        </div>

        {employee.email && (
          <div className="info-row">
            <FaEnvelope className="icon" />
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value email">{employee.email}</span>
            </div>
          </div>
        )}

        {employee.phone && (
          <div className="info-row">
            <FaPhone className="icon" />
            <div className="info-content">
              <span className="info-label">Phone</span>
              <span className="info-value">{employee.phone}</span>
            </div>
          </div>
        )}

        {employee.hire_date && (
          <div className="info-row">
            <div className="icon hire-icon">📅</div>
            <div className="info-content">
              <span className="info-label">Hire Date</span>
              <span className="info-value">
                {new Date(employee.hire_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

EmployeeCard.propTypes = {
  employee: PropTypes.shape({
    employee_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    department: PropTypes.string,
    position: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    hire_date: PropTypes.string,
    is_active: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func,
};

export default EmployeeCard;