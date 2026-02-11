import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeService';
import DataTable from '../common/Table/DataTable';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import EmployeeForm from './EmployeeForm';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaUserPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    activeOnly: true,
  });
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [filters, page]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees(
        filters.activeOnly,
        filters.department || undefined,
        page,
        pageSize
      );
      setEmployees(response.employees);
      setTotal(response.total);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await employeeService.getEmployees(false);
      const uniqueDepartments = [...new Set(response.employees.map(emp => emp.department))].filter(Boolean);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const columns = [
    {
      key: 'employee_id',
      title: 'Employee ID',
      sortable: true,
      width: '120px',
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="employee-name">
          <div className="name">{value}</div>
          <div className="email">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      sortable: true,
    },
    {
      key: 'position',
      title: 'Position',
      sortable: true,
    },
    {
      key: 'hire_date',
      title: 'Hire Date',
      type: 'date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'is_active',
      title: 'Status',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn toggle-btn"
            onClick={() => handleToggleStatus(row)}
            title={row.is_active ? 'Deactivate' : 'Activate'}
          >
            {row.is_active ? <FaToggleOn /> : <FaToggleOff />}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteClick(row)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleToggleStatus = async (employee) => {
    try {
      if (employee.is_active) {
        await employeeService.deactivateEmployee(employee.employee_id);
        toast.success('Employee deactivated');
      } else {
        await employeeService.activateEmployee(employee.employee_id);
        toast.success('Employee activated');
      }
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to update employee status');
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await employeeService.deleteEmployee(employeeToDelete.employee_id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleFormSuccess = () => {
    fetchEmployees();
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  return (
    <div className="employee-list">
      <div className="list-header">
        <h3>Employees</h3>
        <Button
          variant="primary"
          onClick={handleAddNew}
        >
          <FaUserPlus /> Add Employee
        </Button>
      </div>

      <div className="list-filters">
        <div className="filter-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="filter-select"
          >
            {departmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="activeOnly"
              checked={filters.activeOnly}
              onChange={handleFilterChange}
            />
            Show Active Only
          </label>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        keyField="employee_id"
        pagination
        pageSize={pageSize}
        loading={loading}
        searchable
        onPageChange={setPage}
        currentPage={page}
        total={total}
        emptyMessage="No employees found"
        className="employees-table"
      />

      {/* Employee Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="large"
        showFooter={false}
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false);
            setSelectedEmployee(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setEmployeeToDelete(null);
        }}
        title="Confirm Delete"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        confirmVariant="danger"
      >
        <div className="delete-confirmation">
          <p>
            Are you sure you want to delete employee{' '}
            <strong>{employeeToDelete?.name}</strong> (ID: {employeeToDelete?.employee_id})?
          </p>
          <p className="warning-text">
            This action cannot be undone. All attendance records for this employee will also be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;