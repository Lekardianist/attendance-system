import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { employeeService } from '../services/employeeService';
import toast from 'react-hot-toast';
import Button from '../components/common/Button/Button';
import FormInput from '../components/common/Form/FormInput';
import EmployeeSearch from '../components/employees/EmployeeSearch';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setError('Please enter Employee ID');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(employeeId);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleEmployeeSelect = (employee) => {
    if (employee) {
      setEmployeeId(employee.employee_id);
      setShowSearch(false);
    }
  };

  const demoEmployees = [
    { id: 'EMP001', name: 'John Doe', department: 'Engineering' },
    { id: 'EMP002', name: 'Jane Smith', department: 'Marketing' },
    { id: 'EMP003', name: 'Mike Johnson', department: 'Sales' },
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <h1>Attendance System</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Please enter your Employee ID to continue</p>
        </div>

        <div className="login-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${!showSearch ? 'active' : ''}`}
                  onClick={() => setShowSearch(false)}
                >
                  Enter ID
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${showSearch ? 'active' : ''}`}
                  onClick={() => setShowSearch(true)}
                >
                  Search Employee
                </button>
              </div>

              {showSearch ? (
                <div className="search-section">
                  <label className="form-label">Find Your Account</label>
                  <EmployeeSearch
                    onSelect={handleEmployeeSelect}
                    excludeIds={[]}
                  />
                  {employeeId && (
                    <div className="selected-id">
                      Selected ID: <strong>{employeeId}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="input-section">
                  <FormInput
                    type="text"
                    label="Employee ID"
                    name="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter your employee ID"
                    error={error}
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Login
            </Button>
          </form>

          <div className="demo-info">
            <p className="demo-title">Demo Credentials:</p>
            <div className="demo-list">
              {demoEmployees.map(emp => (
                <div
                  key={emp.id}
                  className="demo-item"
                  onClick={() => setEmployeeId(emp.id)}
                >
                  <span className="demo-id">{emp.id}</span>
                  <span className="demo-name">{emp.name}</span>
                  <span className="demo-dept">{emp.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2024 Attendance System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;