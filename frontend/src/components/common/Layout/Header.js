import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import './Header.css';
import { FaUser, FaBell, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <FaBars />
        </button>
        <div className="header-logo">
          <h1>Attendance System</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn notification-btn" aria-label="Notifications">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.department || 'Employee'}</span>
          </div>
          <button
            className="header-btn user-btn"
            onClick={handleProfileClick}
            aria-label="User profile"
          >
            <FaUser />
          </button>

          <div className="dropdown-menu">
            <div className="dropdown-header">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="dropdown-user-info">
                <div className="dropdown-user-name">{user?.name || 'User'}</div>
                <div className="dropdown-user-email">
                  {user?.employee_id || 'ID: N/A'}
                </div>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <button
              className="dropdown-item"
              onClick={handleProfileClick}
            >
              <FaUser className="dropdown-icon" />
              <span>Profile & Settings</span>
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button
              className="dropdown-item logout-item"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="dropdown-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;