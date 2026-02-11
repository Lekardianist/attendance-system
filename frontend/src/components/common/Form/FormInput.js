import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FormInput.css';

const FormInput = React.forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  autoComplete = 'off',
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  prefix,
  suffix,
  min,
  max,
  step,
  rows,
  maxLength,
  showCharCount = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

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
  }, [onChange]);

  const showError = error && (isTouched || isFocused);

  const renderInput = () => {
    const commonProps = {
      ref,
      id: name,
      name,
      type,
      value: value || '',
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder,
      required,
      disabled,
      readOnly,
      autoFocus,
      autoComplete,
      min,
      max,
      step,
      maxLength,
      className: `form-control ${inputClassName} ${showError ? 'error' : ''} ${
        isFocused ? 'focused' : ''
      }`,
      ...props,
    };

    if (type === 'textarea') {
      return <textarea rows={rows || 3} {...commonProps} />;
    }

    return <input {...commonProps} />;
  };

  const charCount = typeof value === 'string' ? value.length : 0;

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
      
      <div className="input-wrapper">
        {prefix && <div className="input-prefix">{prefix}</div>}
        
        {renderInput()}
        
        {suffix && <div className="input-suffix">{suffix}</div>}
        
        {showCharCount && maxLength && (
          <div className="char-count">
            {charCount}/{maxLength}
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

FormInput.propTypes = {
  type: PropTypes.oneOf([
    'text', 'password', 'email', 'number', 'tel', 'url',
    'date', 'time', 'datetime-local', 'month', 'week',
    'search', 'color', 'file', 'range', 'textarea'
  ]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  helperClassName: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
};

FormInput.displayName = 'FormInput';

export default FormInput;