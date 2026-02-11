import React, { useState } from 'react';
import DailyReport from '../components/reports/DailyReport';
import MonthlyReport from '../components/reports/MonthlyReport';
import EmployeeSummary from '../components/reports/EmployeeSummary';
import Statistics from '../components/reports/Statistics';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { id: 'daily', label: 'Daily Report' },
    { id: 'monthly', label: 'Monthly Report' },
    { id: 'employee', label: 'Employee Summary' },
    { id: 'statistics', label: 'Statistics' },
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2>Attendance Reports</h2>
        <p className="text-muted">
          Generate and export attendance reports
        </p>
      </div>

      <div className="reports-tabs">
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
          {activeTab === 'daily' && <DailyReport />}
          {activeTab === 'monthly' && <MonthlyReport />}
          {activeTab === 'employee' && <EmployeeSummary />}
          {activeTab === 'statistics' && <Statistics />}
        </div>
      </div>
    </div>
  );
};

export default Reports;