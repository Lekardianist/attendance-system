import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import DataTable from '../common/Table/DataTable';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays } from 'date-fns';
import './AttendanceHistory.css';

const AttendanceHistory = ({ employeeId: propEmployeeId }) => {
  const { user } = useContext(AuthContext);
  const employeeId = propEmployeeId || user?.employee_id;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const columns = [
    {
      key: 'date',
      title: 'Date',
      type: 'date',
      sortable: true,
      width: '120px',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'check_in',
      title: 'Check In',
      sortable: true,
      render: (value) => value ? format(new Date(`2000-01-01T${value}`), 'HH:mm') : '--:--',
    },
    {
      key: 'check_out',
      title: 'Check Out',
      sortable: true,
      render: (value) => value ? format(new Date(`2000-01-01T${value}`), 'HH:mm') : '--:--',
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'late_minutes',
      title: 'Late (min)',
      sortable: true,
      render: (value) => value > 0 ? value : '-',
    },
    {
      key: 'overtime_minutes',
      title: 'Overtime (min)',
      sortable: true,
      render: (value) => value > 0 ? value : '-',
    },
    {
      key: 'notes',
      title: 'Notes',
      render: (value) => value || '-',
    },
  ];

  useEffect(() => {
    fetchHistory();
  }, [employeeId, startDate, endDate, page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getAttendanceHistory(
        employeeId,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
        page,
        pageSize
      );
      setHistory(response.history);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleExport = async () => {
    try {
      const response = await attendanceService.exportHistory(
        employeeId,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `attendance_history_${employeeId}_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  };

  return (
    <div className="attendance-history">
      <div className="history-header">
        <h3>Attendance History</h3>
        <div className="history-controls">
          <div className="date-range-picker">
            <label>Date Range:</label>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="MMM dd, yyyy"
              className="date-picker-input"
              maxDate={new Date()}
            />
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={handleExport}
            disabled={loading || history.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={history}
        keyField="date"
        pagination
        pageSize={pageSize}
        loading={loading}
        searchable
        onRowClick={(row) => {
          // Optional: Handle row click for details
          console.log('Row clicked:', row);
        }}
        emptyMessage="No attendance records found for the selected period."
      />

      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-label">Total Days</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present Days</div>
          <div className="stat-value">
            {history.filter(h => h.status === 'Present').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Late Days</div>
          <div className="stat-value">
            {history.filter(h => h.status === 'Late').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance Rate</div>
          <div className="stat-value">
            {total > 0
              ? `${Math.round(
                  (history.filter(h => h.status === 'Present' || h.status === 'Late').length / total) * 100
                )}%`
              : '0%'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;