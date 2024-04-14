import React, { useEffect, useState } from 'react';
import styles from './UserTrainingProgress.module.css';
import { useNavigate } from 'react-router-dom';
import Navuser from '../Nav_user/Navuser';

const UserTrainingProgress = () => {
  const [userID, setUserID] = useState('');
  const [moduleID, setModuleID] = useState('');
  const [completionStatus, setCompletionStatus] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'User') navigate('/');
      setUserID(user.user.UserID);
    } else {
      navigate('/');
    }
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-modules');
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8087/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          moduleID,
          completionStatus,
          dateCompleted,
        }),
      });

      if (response.status === 201) {
        alert('Progress added successfully!');
        setUserID('');
        setModuleID('');
        setCompletionStatus('');
        setDateCompleted('');
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setUserID('');
        setModuleID('');
        setCompletionStatus('');
        setDateCompleted('');
      } else {
        throw new Error('Failed to add Progress');
      }
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  return (
    <>
      {/* <Navuser/> */}
      <Navuser
        activeItem="User Progress"
        menuItems={[
          { name: 'User Dashboard', route: '/user-dashboard' },
          { name: 'Update Password', route: '/update-pass' },
          { name: 'User Progress', route: '/training-progress' },
          { name: 'Logout', route: '/' },
        ]}
      />
      <div className={styles.usepre}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>Update your Progress</h2>
          <label style={{ color: 'white' }}>
            User ID:
            <input
              style={{ color: '#797979', background: '#ccc' }}
              //style={{color:'white'}}
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
              disabled
            />
          </label>

          <label style={{ color: 'white' }}>
            Module ID:
            <select
              value={moduleID}
              onChange={(e) => setModuleID(e.target.value)}
              required
            >
              <option value="">Select a module</option>
              {modules.map((module) => (
                <option key={module.ModuleID} value={module.ModuleID}>
                  {module.ModuleName}
                </option>
              ))}
            </select>
          </label>
          <label style={{ color: 'white' }}>
            Completion Status:
            <select
              value={completionStatus}
              onChange={(e) => setCompletionStatus(e.target.value)}
              required
            >
              <option value="">Select a module</option>
              <option value="Inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label style={{ color: 'white' }}>
            Date Completed:
            <input
              type="date"
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Set max attribute to today's date
              required
            />
          </label>
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Add Progress
            </span>
          </button>
        </form>
      </div>
    </>
  );
};

export default UserTrainingProgress;
