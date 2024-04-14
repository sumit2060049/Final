// import React from 'react'
import styles from './AdminDashboard.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const mockUserData = [
      { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Employee' },
      { id: 2, name: 'User 2', email: 'user2@example.com', role: 'Admin' },
    ];
    setUserData(mockUserData);

    const mockStatistics = {
      totalUsers: 100,
      activeUsers: 80,
    };
    setStatistics(mockStatistics);

    const mockSettings = {
      theme: 'light',
      notifications: true,
    };
    setSettings(mockSettings);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

  const reroutec = () => {
    navigate('/training-category');
  };
  const reroutep = () => {
    navigate('/training-plan');
  };
  const reroutem = () => {
    navigate('/training-module');
  };
  const reroutea = () => {
    navigate('/training-amount');
  };
  const rerouteu = () => {
    navigate('/user-creation');
  };
  const reroutes = () => {
    navigate('/assessment-marks');
  };
  const rerouter = () => {
    navigate('/assessment-report');
  };

  return (
    <>
      <Navbar
        activeItem=""
        menuItems={[
          { name: 'Add User', route: '/user-creation' },
          { name: 'Add Training Category', route: '/training-category' },
          { name: 'Add Training Plan', route: '/training-plan' },
          { name: 'Add Training Module', route: '/training-module' },
          { name: 'Add Training Amount', route: '/training-amount' },
          { name: 'Add Training Score', route: '/assessment-marks' },
          { name: 'Add Training Review', route: '/assessment-report' },
          { name: 'Logout', route: '/' },
        ]}
      />

      <div className={styles.admin_dashboard}>
        <h2>Admin Dashboard</h2>
        <div className={styles.statistics}>
          <h3>Statistics</h3>
          <p>Total Users: {statistics.totalUsers}</p>
          <p>Active Users: {statistics.activeUsers}</p>
        </div>
        <div className={styles.user_management}>
          <h3>User Management</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.settings}>
          <h3>Settings</h3>
          <p>Theme: {settings.theme}</p>
          <p>
            Notifications: {settings.notifications ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
