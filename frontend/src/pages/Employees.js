import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeSearch from '../components/employees/EmployeeSearch';
import Button from '../components/common/Button/Button';
import Modal from '../components/common/Modal/Modal';
import EmployeeForm from '../components/employees/EmployeeForm';
import { FaUserPlus, FaSearch } from 'react-icons/fa';
import './Employees.css';

const Employees = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEmployeeSelect = (employee) => {
    if (employee) {
      navigate(`/employees/${employee.employee_id}`);
    }
  };

  const handleAddEmployee = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h2>Employee Management</h2>
        <div className="header-actions">
          <Button
            variant="outline-primary"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FaSearch /> Search
          </Button>
          <Button
            variant="primary"
            onClick={handleAddEmployee}
          >
            <FaUserPlus /> Add Employee
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="search-section">
          <h3>Search Employees</h3>
          <EmployeeSearch
            onSelect={handleEmployeeSelect}
            multiSelect={false}
          />
        </div>
      )}

      <div className="content-section">
        <EmployeeList />
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Employee"
        size="large"
        showFooter={false}
      >
        <EmployeeForm
          onSuccess={handleFormSuccess}
          onClose={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default Employees;