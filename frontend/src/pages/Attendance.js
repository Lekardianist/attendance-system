import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckInOut from '../components/attendance/CheckInOut';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import AttendanceStats from '../components/attendance/AttendanceStats';
import ManualAttendance from '../components/attendance/ManualAttendance';
import Button from '../components/common/Button/Button';
import './Attendance.css';

const Attendance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('check');

  const tabs = [
    { id: 'check', label: 'Check In/Out' },
    { id: 'history', label: 'History' },
    { id: 'stats', label: 'Statistics' },
    { id: 'manual', label: 'Manual Entry', adminOnly: true },
  ];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/reports')}
        >
          View Reports
        </Button>
      </div>

      <div className="attendance-tabs">
        <div className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'check' && <CheckInOut />}
          {activeTab === 'history' && <AttendanceHistory />}
          {activeTab === 'stats' && <AttendanceStats />}
          {activeTab === 'manual' && <ManualAttendance />}
        </div>
      </div>
    </div>
  );
};

export default Attendance;