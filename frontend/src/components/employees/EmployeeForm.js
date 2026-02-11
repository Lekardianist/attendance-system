import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import FormInput from '../common/Form/FormInput';
import FormSelect from '../common/Form/FormSelect';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hire_date: format(new Date(), 'yyyy-MM-dd'),
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'Customer Support',
    'Research & Development',
    'Administration',
  ];

  const positions = [
    'Software Engineer',
    'Senior Software Engineer',
    'Team Lead',
    'Project Manager',
    'Product Manager',
    'Marketing Specialist',
    'Sales Executive',
    'HR Manager',
    'Finance Analyst',
    'Operations Manager',
    'System Administrator',
    'Customer Support Representative',
    'Research Scientist',
    'Administrative Assistant',
    'Director',
    'Vice President',
    'CEO',
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        hire_date: employee.hire_date || format(new Date(), 'yyyy-MM-dd'),
        is_active: employee.is_active,
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      hire_date: format(date, 'yyyy-MM-dd')
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    return newErrors;
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPhone = (phone) => {
    const re = /^[\d\s\-\+\(\)]{10,20}$/;
    return re.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      if (employee) {
        // Update existing employee
        await employeeService.updateEmployee(employee.employee_id, formData);
        toast.success('Employee updated successfully!');
      } else {
        // Create new employee
        await employeeService.createEmployee(formData);
        toast.success('Employee created successfully!');
      }
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      const message = error.response?.data?.message || 
                     (employee ? 'Failed to update employee' : 'Failed to create employee');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map(dept => ({
    value: dept,
    label: dept,
  }));

  const positionOptions = positions.map(pos => ({
    value: pos,
    label: pos,
  }));

  const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <FormInput
            label="Employee ID *"
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            placeholder="EMP001"
            error={errors.employee_id}
            required
            disabled={!!employee} // Cannot change ID for existing employees
          />
        </div>
        
        <div className="form-group">
          <FormInput
            label="Full Name *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            error={errors.name}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <FormSelect
            label="Department *"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            options={departmentOptions}
            error={errors.department}
            required
            searchable
          />
        </div>
        
        <div className="form-group">
          <FormSelect
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            options={positionOptions}
            searchable
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@company.com"
            error={errors.email}
          />
        </div>
        
        <div className="form-group">
          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            error={errors.phone}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Hire Date</label>
          <DatePicker
            selected={new Date(formData.hire_date)}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            maxDate={new Date()}
          />
        </div>
        
        <div className="form-group">
          <FormSelect
            label="Status"
            name="is_active"
            value={formData.is_active}
            onChange={handleInputChange}
            options={statusOptions}
          />
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {employee ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

EmployeeForm.propTypes = {
  employee: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeeForm;