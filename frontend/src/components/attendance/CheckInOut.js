import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';
import Button from '../common/Button/Button';
import './CheckInOut.css';

const CheckInOut = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const response = await attendanceService.getTodayStatus(user.employee_id);
      setStatus(response);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await attendanceService.checkIn(user.employee_id, notes);
      toast.success('Checked in successfully!');
      fetchTodayStatus();
      setNotes('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceService.checkOut(user.employee_id, notes);
      toast.success('Checked out successfully!');
      fetchTodayStatus();
      setNotes('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'status-badge present';
      case 'late':
        return 'status-badge late';
      case 'absent':
        return 'status-badge absent';
      case 'half-day':
        return 'status-badge half-day';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="check-in-out">
      <div className="attendance-card">
        <div className="attendance-header">
          <h3>Today's Attendance</h3>
          <div className="current-time">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="attendance-status">
          <div className="status-info">
            <div className="info-item">
              <span className="info-label">Employee ID:</span>
              <span className="info-value">{user.employee_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{user.department}</span>
            </div>
          </div>

          <div className="time-display">
            <div className="time-box">
              <div className="time-label">Check In</div>
              <div className="time-value">
                {formatTime(status?.check_in_time)}
              </div>
            </div>
            <div className="time-separator">→</div>
            <div className="time-box">
              <div className="time-label">Check Out</div>
              <div className="time-value">
                {formatTime(status?.check_out_time)}
              </div>
            </div>
          </div>

          {status?.status && (
            <div className="status-display">
              <div className={getStatusBadgeClass(status.status)}>
                {status.status}
              </div>
              {status.late_minutes > 0 && (
                <div className="late-info">
                  Late by {status.late_minutes} minutes
                </div>
              )}
              {status.overtime_minutes > 0 && (
                <div className="overtime-info">
                  Overtime: {status.overtime_minutes} minutes
                </div>
              )}
            </div>
          )}
        </div>

        <div className="attendance-controls">
          <div className="notes-input">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about today's attendance..."
              rows="3"
            />
          </div>

          <div className="action-buttons">
            <Button
              variant="success"
              onClick={handleCheckIn}
              disabled={status?.has_checked_in || loading}
              loading={loading}
              fullWidth
            >
              {status?.has_checked_in ? 'Already Checked In' : 'Check In'}
            </Button>
            <Button
              variant="warning"
              onClick={handleCheckOut}
              disabled={!status?.has_checked_in || status?.has_checked_out || loading}
              loading={loading}
              fullWidth
            >
              {status?.has_checked_out ? 'Already Checked Out' : 'Check Out'}
            </Button>
          </div>
        </div>

        <div className="attendance-rules">
          <h4>Attendance Rules</h4>
          <ul>
            <li>Check-in time: 9:00 AM</li>
            <li>Check-out time: 6:00 PM</li>
            <li>Late arrival (after 9:30 AM) counts as half-day</li>
            <li>Minimum working hours: 8 hours</li>
            <li>Overtime is calculated after 9 working hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;