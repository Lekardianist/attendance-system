import React, { createContext, useState, useContext } from 'react';
import { employeeService } from '../services/employeeService';
import { AuthContext } from './AuthContext';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchEmployees = async (params = {}) => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees(
        params.activeOnly,
        params.department,
        params.page,
        params.perPage
      );
      setEmployees(response.employees);
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async (employeeId) => {
    setLoading(true);
    try {
      const employee = await employeeService.getEmployeeById(employeeId);
      setSelectedEmployee(employee);
      return employee;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (data) => {
    setLoading(true);
    try {
      const response = await employeeService.createEmployee(data);
      await fetchEmployees();
      return response;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (employeeId, data) => {
    setLoading(true);
    try {
      const response = await employeeService.updateEmployee(employeeId, data);
      await fetchEmployees();
      if (selectedEmployee?.employee_id === employeeId) {
        setSelectedEmployee(response.employee);
      }
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (employeeId) => {
    setLoading(true);
    try {
      const response = await employeeService.deleteEmployee(employeeId);
      await fetchEmployees();
      if (selectedEmployee?.employee_id === employeeId) {
        setSelectedEmployee(null);
      }
      return response;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (employeeId, isActive) => {
    setLoading(true);
    try {
      let response;
      if (isActive) {
        response = await employeeService.activateEmployee(employeeId);
      } else {
        response = await employeeService.deactivateEmployee(employeeId);
      }
      await fetchEmployees();
      return response;
    } catch (error) {
      console.error('Error toggling employee status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    employees,
    selectedEmployee,
    loading,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
    setSelectedEmployee,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};