import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import './Modal.css';
import Button from '../Button/Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  showFooter = true,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  cancelVariant = 'secondary',
  isLoading = false,
  disableConfirm = false,
  disableCancel = false,
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const sizeClass = `modal-${size}`;

  const modalContent = (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content ${sizeClass} ${className}`}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {showFooter && (
          <div className="modal-footer">
            <Button
              variant={cancelVariant}
              onClick={handleCancel}
              disabled={disableCancel || isLoading}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                onClick={handleConfirm}
                disabled={disableConfirm || isLoading}
                loading={isLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  showCloseButton: PropTypes.bool,
  showFooter: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmVariant: PropTypes.string,
  cancelVariant: PropTypes.string,
  isLoading: PropTypes.bool,
  disableConfirm: PropTypes.bool,
  disableCancel: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;