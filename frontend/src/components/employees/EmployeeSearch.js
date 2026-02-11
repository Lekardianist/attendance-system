import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { employeeService } from '../../services/employeeService';
import EmployeeCard from './EmployeeCard';
import { FaSearch } from 'react-icons/fa';
import './EmployeeSearch.css';

const EmployeeSearch = ({ onSelect, multiSelect = false, excludeIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length < 2) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await employeeService.searchEmployees(term);
        // Filter out excluded IDs
        const filtered = results.filter(emp => !excludeIds.includes(emp.employee_id));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Error searching employees:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [excludeIds]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleSelectEmployee = (employee) => {
    if (multiSelect) {
      const isSelected = selectedEmployees.some(emp => emp.employee_id === employee.employee_id);
      if (isSelected) {
        setSelectedEmployees(prev => prev.filter(emp => emp.employee_id !== employee.employee_id));
      } else {
        setSelectedEmployees(prev => [...prev, employee]);
      }
    } else {
      setSelectedEmployees([employee]);
      setSearchTerm(`${employee.name} (${employee.employee_id})`);
      setShowResults(false);
      if (onSelect) onSelect(employee);
    }
  };

  const handleRemoveSelected = (employeeId) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.employee_id !== employeeId));
  };

  const handleBlur = () => {
    // Delay hiding results to allow click events
    setTimeout(() => setShowResults(false), 200);
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedEmployees([]);
    if (onSelect) onSelect(null);
  };

  return (
    <div className="employee-search">
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search employees by name, ID, email, or department..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchTerm && (
            <button
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {showResults && (
          <div className="search-results">
            {loading ? (
              <div className="search-loading">
                <div className="spinner"></div>
                <span>Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="results-list">
                {searchResults.map(employee => (
                  <div
                    key={employee.employee_id}
                    className={`result-item ${
                      selectedEmployees.some(emp => emp.employee_id === employee.employee_id)
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleSelectEmployee(employee)}
                  >
                    <div className="result-avatar">
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="result-info">
                      <div className="result-name">{employee.name}</div>
                      <div className="result-details">
                        <span className="result-id">{employee.employee_id}</span>
                        <span className="result-department">{employee.department}</span>
                      </div>
                    </div>
                    {selectedEmployees.some(emp => emp.employee_id === employee.employee_id) && (
                      <span className="check-mark">✓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="no-results">
                <p>No employees found</p>
                <p className="no-results-hint">Try different keywords or check spelling</p>
              </div>
            ) : (
              <div className="search-hint">
                <p>Enter at least 2 characters to search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {multiSelect && selectedEmployees.length > 0 && (
        <div className="selected-employees">
          <h4>Selected Employees ({selectedEmployees.length})</h4>
          <div className="selected-list">
            {selectedEmployees.map(employee => (
              <div key={employee.employee_id} className="selected-item">
                <div className="selected-info">
                  <span className="selected-name">{employee.name}</span>
                  <span className="selected-id">{employee.employee_id}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveSelected(employee.employee_id)}
                  aria-label={`Remove ${employee.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onSelect && onSelect(selectedEmployees)}
          >
            Confirm Selection ({selectedEmployees.length})
          </button>
        </div>
      )}

      {!multiSelect && selectedEmployees.length > 0 && (
        <div className="selected-employee-card">
          <EmployeeCard employee={selectedEmployees[0]} />
        </div>
      )}
    </div>
  );
};

EmployeeSearch.propTypes = {
  onSelect: PropTypes.func,
  multiSelect: PropTypes.bool,
  excludeIds: PropTypes.arrayOf(PropTypes.string),
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default EmployeeSearch;