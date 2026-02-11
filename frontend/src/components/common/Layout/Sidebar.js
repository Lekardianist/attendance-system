import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <FaTachometerAlt />,
      exact: true,
    },
    {
      path: '/attendance',
      label: 'Attendance',
      icon: <FaCalendarAlt />,
    },
    {
      path: '/employees',
      label: 'Employees',
      icon: <FaUsers />,
      adminOnly: true,
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: <FaChartBar />,
      adminOnly: true,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FaCog />,
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h3>Attendance</h3>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {isOpen && (
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.department || 'Employee'}</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {isOpen && (
            <div className="sidebar-version">
              <span>Version 1.0.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;