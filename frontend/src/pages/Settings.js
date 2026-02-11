import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import FormInput from '../components/common/Form/FormInput';
import Button from '../components/common/Button/Button';
import toast from 'react-hot-toast';
import { FaUser, FaBell, FaShield, FaPalette, FaLanguage, FaSave } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminders: true,
    weeklyReports: false,
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // TODO: Implement password change API
    toast.success('Password changed successfully!');
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement notification settings API
    toast.success('Notification settings saved!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'security', label: 'Security', icon: <FaShield /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { id: 'language', label: 'Language', icon: <FaLanguage /> },
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email || user?.employee_id}</p>
            </div>
          </div>

          <div className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              <form onSubmit={handleProfileSubmit}>
                <div className="form-grid">
                  <FormInput
                    label="Full Name"
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    <FaSave /> Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-grid">
                  <FormInput
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <FormInput
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    helperText="Minimum 8 characters with at least one uppercase letter, one lowercase letter, and one number"
                  />
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <form onSubmit={handleNotificationSubmit}>
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email Notifications</h4>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Push Notifications</h4>
                      <p>Receive notifications in your browser</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Attendance Reminders</h4>
                      <p>Get reminders to check in/out</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="attendanceReminders"
                        checked={notificationSettings.attendanceReminders}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Weekly Reports</h4>
                      <p>Receive weekly attendance reports</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="weeklyReports"
                        checked={notificationSettings.weeklyReports}
                        onChange={handleNotificationChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Dark Mode</h4>
                    <p>Switch between light and dark theme</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Compact View</h4>
                    <p>Use a more compact layout</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="compactView"
                      onChange={() => {}}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Language Settings */}
          {activeTab === 'language' && (
            <div className="settings-section">
              <h3>Language</h3>
              <div className="language-options">
                <label className="language-option">
                  <input type="radio" name="language" defaultChecked />
                  <span className="language-label">English (US)</span>
                </label>
                <label className="language-option">
                  <input type="radio" name="language" />
                  <span className="language-label">Indonesian</span>
                </label>
                <label className="language-option">
                  <input type="radio" name="language" />
                  <span className="language-label">Japanese</span>
                </label>
              </div>
              <div className="form-actions">
                <Button variant="primary">
                  Save Language Preference
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;