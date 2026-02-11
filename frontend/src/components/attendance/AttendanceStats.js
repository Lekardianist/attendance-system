import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import { format, subMonths } from 'date-fns';
import './AttendanceStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AttendanceStats = ({ employeeId: propEmployeeId }) => {
  const { user } = useContext(AuthContext);
  const employeeId = propEmployeeId || user?.employee_id;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchStats();
  }, [employeeId, timeRange, startDate, endDate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getStatistics(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
        null, // department
        employeeId
      );
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBarChartData = () => {
    if (!stats?.daily_statistics) return null;

    const labels = stats.daily_statistics.map(stat => stat.date);
    const presentData = stats.daily_statistics.map(stat => stat.present);
    const lateData = stats.daily_statistics.map(stat => stat.late);
    const absentData = stats.daily_statistics.map(stat => stat.absent);

    return {
      labels,
      datasets: [
        {
          label: 'Present',
          data: presentData,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
        },
        {
          label: 'Late',
          data: lateData,
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1,
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPieChartData = () => {
    if (!stats?.overall_statistics) return null;

    return {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [
        {
          data: [
            stats.overall_statistics.total_present,
            stats.overall_statistics.total_late,
            stats.overall_statistics.total_absent,
          ],
          backgroundColor: [
            'rgba(40, 167, 69, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(220, 53, 69, 0.7)',
          ],
          borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(220, 53, 69, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getAttendanceRateData = () => {
    if (!stats?.daily_statistics) return null;

    const labels = stats.daily_statistics.map(stat => stat.date);
    const rateData = stats.daily_statistics.map(stat => stat.attendance_rate);

    return {
      labels,
      datasets: [
        {
          label: 'Attendance Rate (%)',
          data: rateData,
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Attendance Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overall Attendance Distribution',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance Rate Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="attendance-stats">
      <div className="stats-header">
        <h3>Attendance Statistics</h3>
        <div className="stats-controls">
          <div className="time-range-selector">
            <button
              className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              className={`range-btn ${timeRange === 'custom' ? 'active' : ''}`}
              onClick={() => setTimeRange('custom')}
            >
              Custom
            </button>
          </div>
          
          {timeRange === 'custom' && (
            <div className="custom-date-range">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                dateFormat="MMM dd, yyyy"
                className="date-picker"
              />
              <span className="date-separator">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                dateFormat="MMM dd, yyyy"
                className="date-picker"
              />
            </div>
          )}
        </div>
      </div>

      {stats && (
        <>
          <div className="overall-stats">
            <div className="stat-card">
              <div className="stat-icon present">
                <span>✓</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.overall_statistics.total_present}</div>
                <div className="stat-label">Present Days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon late">
                <span>⏰</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.overall_statistics.total_late}</div>
                <div className="stat-label">Late Days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon absent">
                <span>✗</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.overall_statistics.total_absent}</div>
                <div className="stat-label">Absent Days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rate">
                <span>%</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.overall_statistics.attendance_rate}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              {getBarChartData() && (
                <Bar data={getBarChartData()} options={barChartOptions} />
              )}
            </div>
            <div className="chart-container">
              {getPieChartData() && (
                <Pie data={getPieChartData()} options={pieChartOptions} />
              )}
            </div>
            <div className="chart-container full-width">
              {getAttendanceRateData() && (
                <Line data={getAttendanceRateData()} options={lineChartOptions} />
              )}
            </div>
          </div>

          <div className="detailed-stats">
            <h4>Daily Statistics</h4>
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Present</th>
                    <th>Late</th>
                    <th>Absent</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.daily_statistics.map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{day.total}</td>
                      <td className="present">{day.present}</td>
                      <td className="late">{day.late}</td>
                      <td className="absent">{day.absent}</td>
                      <td className="rate">{day.attendance_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceStats;