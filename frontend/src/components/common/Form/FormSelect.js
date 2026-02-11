import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FormSelect.css';

const FormSelect = React.forwardRef(({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  multiple = false,
  searchable = false,
  className = '',
  selectClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  optionGroups,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  }, [props.onFocus]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    setIsTouched(true);
    if (onBlur) onBlur(e);
  }, [onBlur]);

  const handleChange = useCallback((e) => {
    if (onChange) onChange(e);
    if (searchable) setSearchTerm('');
  }, [onChange, searchable]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const showError = error && (isTouched || isFocused);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const getSelectedLabels = () => {
    if (multiple && Array.isArray(value)) {
      return value
        .map(val => {
          const option = options.find(opt => opt.value === val);
          return option ? option.label : val;
        })
        .join(', ');
    }
    
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  return (
    <div className={`form-group ${className} ${disabled ? 'disabled' : ''}`}>
      {label && (
        <label
          htmlFor={name}
          className={`form-label ${labelClassName} ${required ? 'required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="select-wrapper">
        {searchable && (
          <div className="select-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              onFocus={handleFocus}
            />
          </div>
        )}
        
        <select
          ref={ref}
          id={name}
          name={name}
          value={value || (multiple ? [] : '')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          multiple={multiple}
          className={`form-select ${selectClassName} ${showError ? 'error' : ''} ${
            isFocused ? 'focused' : ''
          }`}
          {...props}
        >
          {!multiple && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          
          {optionGroups ? (
            Object.entries(optionGroups).map(([groupLabel, groupOptions]) => (
              <optgroup key={groupLabel} label={groupLabel}>
                {groupOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            filteredOptions.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          )}
        </select>
        
        {!multiple && !searchable && (
          <div className="select-arrow">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        
        {multiple && (
          <div className="selected-values">
            {getSelectedLabels() || placeholder}
          </div>
        )}
      </div>
      
      {showError && (
        <div className={`error-message ${errorClassName}`}>{error}</div>
      )}
      
      {helperText && !showError && (
        <div className={`helper-text ${helperClassName}`}>{helperText}</div>
      )}
    </div>
  );
});

FormSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  helperClassName: PropTypes.string,
  optionGroups: PropTypes.object,
};

FormSelect.displayName = 'FormSelect';

export default FormSelect;