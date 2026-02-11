import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text = 'Loading...',
  className = '',
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`spinner ${sizeClass} ${colorClass} ${className}`}>
          <div className="spinner-circle"></div>
        </div>
        {text && <div className="loading-text">{text}</div>}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass} ${colorClass} ${className}`}>
        <div className="spinner-circle"></div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;