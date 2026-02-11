import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CheckInOut from '../components/attendance/CheckInOut';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import AttendanceStats from '../components/attendance/AttendanceStats';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}!</h2>
        <p className="text-muted">
          {user?.department} - {user?.position}
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Check In/Out Section */}
        <div className="dashboard-section">
          <CheckInOut />
        </div>

        {/* Quick Stats Section */}
        <div className="dashboard-section">
          <AttendanceStats />
        </div>

        {/* Recent History Section */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h3>Recent Attendance History</h3>
          </div>
          <AttendanceHistory limit={10} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;