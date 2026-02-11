import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="copyright">
            © {currentYear} Attendance System. All rights reserved.
          </span>
        </div>
        <div className="footer-right">
          <span className="version">v1.0.0</span>
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
          <a href="/terms" className="footer-link">
            Terms of Service
          </a>
          <a href="/help" className="footer-link">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;