import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import FormInput from '../common/Form/FormInput';
import FormSelect from '../common/Form/FormSelect';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import './ManualAttendance.css';

const ManualAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    check_in_time: '',
    check_out_time: '',
    status: 'Present',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getEmployees();
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

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
      date: format(date, 'yyyy-MM-dd')
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.check_in_time && formData.check_out_time) {
      const checkIn = new Date(`2000-01-01T${formData.check_in_time}`);
      const checkOut = new Date(`2000-01-01T${formData.check_out_time}`);
      
      if (checkOut <= checkIn) {
        newErrors.check_out_time = 'Check-out time must be after check-in time';
      }
    }
    
    return newErrors;
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
      await attendanceService.createManualAttendance(formData);
      toast.success('Attendance recorded successfully!');
      resetForm();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      check_in_time: '',
      check_out_time: '',
      status: 'Present',
      notes: '',
    });
    setErrors({});
  };

  const employeeOptions = employees
    .filter(emp => emp.is_active)
    .map(emp => ({
      value: emp.employee_id,
      label: `${emp.name} (${emp.employee_id}) - ${emp.department}`,
    }));

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Late', label: 'Late' },
    { value: 'Absent', label: 'Absent' },
    { value: 'Half-day', label: 'Half Day' },
    { value: 'Leave', label: 'Leave' },
  ];

  return (
    <>
      <div className="manual-attendance">
        <div className="manual-header">
          <h3>Manual Attendance Entry</h3>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Add Manual Entry
          </Button>
        </div>

        <div className="instructions">
          <h4>Instructions:</h4>
          <ul>
            <li>Use this form to manually record attendance for employees.</li>
            <li>You can record check-in, check-out, or both.</li>
            <li>Status will be automatically calculated based on times.</li>
            <li>Use notes field to add any additional information.</li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Manual Attendance Entry"
        size="large"
        confirmText="Save Attendance"
        cancelText="Cancel"
        onConfirm={handleSubmit}
        isLoading={loading}
      >
        <form className="manual-attendance-form">
          <div className="form-row">
            <div className="form-group">
              <FormSelect
                label="Employee *"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                options={employeeOptions}
                error={errors.employee_id}
                required
                searchable
              />
            </div>
            
            <div className="form-group">
              <label>Date *</label>
              <DatePicker
                selected={new Date(formData.date)}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                maxDate={new Date()}
              />
              {errors.date && (
                <div className="error-message">{errors.date}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <FormInput
                label="Check-in Time"
                type="time"
                name="check_in_time"
                value={formData.check_in_time}
                onChange={handleInputChange}
                placeholder="HH:MM"
              />
            </div>
            
            <div className="form-group">
              <FormInput
                label="Check-out Time"
                type="time"
                name="check_out_time"
                value={formData.check_out_time}
                onChange={handleInputChange}
                placeholder="HH:MM"
                error={errors.check_out_time}
              />
            </div>
            
            <div className="form-group">
              <FormSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="form-group">
            <FormInput
              label="Notes"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about this attendance..."
              rows={3}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManualAttendance;