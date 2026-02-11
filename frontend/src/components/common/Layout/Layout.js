import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoadingSpinner from '../Loading/LoadingSpinner';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="app-layout">
      <Header
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;