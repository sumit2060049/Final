import React, { useState, useEffect } from 'react';
import styles from './TrainingAssessmentMarks.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const TrainingAssessmentmarks = () => {
  const [userID, setUserID] = useState('');
  const [moduleID, setModuleID] = useState('');
  const [score, setScore] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [assessmentMarks, setAssessmentMarks] = useState([]);
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessmentMarks();
    fetchUsers();
    fetchModules();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

  const fetchAssessmentMarks = async () => {
    try {
      const response = await fetch('http://localhost:8087/assessment-marks');
      if (!response.ok) {
        throw new Error('Failed to fetch assessment marks');
      }
      const data = await response.json();
      setAssessmentMarks(data);
    } catch (error) {
      console.error('Error fetching assessment marks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8087/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
      const response = await fetch('http://localhost:8087/add-assesmentmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, moduleID, score, dateCompleted }),
      });
      if (response.status === 201) {
        alert('Assessment score added successfully!');
        setUserID('');
        setModuleID('');
        setScore('');
        setDateCompleted('');
        fetchAssessmentMarks();
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setUserID('');
        setModuleID('');
        setScore('');
        setDateCompleted('');
      } else {
        throw new Error('Failed to add Amount');
      }
    } catch (error) {
      console.error('Error adding assessment:', error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Navbar
        activeItem="Add Training Score"
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

      <div className={styles.traass}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>Add Training Assessment Marks</h2>
          <label style={{ color: 'white' }}>
            User ID:
            <select
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.UserID} value={user.UserID}>
                  {user.Username}
                </option>
              ))}
            </select>
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
            Score:
            <input
              type="text"
              value={score}
              onChange={(e) => {
                const newScore = e.target.value;
                if (newScore >= 0 && newScore <= 100) {
                  setScore(newScore);
                }
              }}
              required
            />
            <p>Score must be betwwn 0 to 100</p>
          </label>

          <label style={{ color: 'white' }}>
            Date Completed:
            <input
              type="date"
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </label>
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Add Assessment
            </span>
          </button>
        </form>
      </div>
      <div className={styles.assess}>
        <h2>Training Assessment Marks</h2>
        <ul
          style={{
            listStyleType: 'none',
            color: 'black',
            textAlign: 'center',
            gap: '10px',
            borderRadius: '5px',
            padding: '10px',
          }}
        >
          {assessmentMarks.map((mark) => (
            <li key={mark.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>User ID:</span>{' '}
              <span style={{ fontWeight: '500' }}>{mark.UserID}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Module ID:</span>{' '}
              <span style={{ fontWeight: '500' }}>{mark.ModuleID}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Score:</span>{' '}
              <span style={{ fontWeight: '500' }}>{mark.Score}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Date Completed:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {mark.DateCompleted.slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TrainingAssessmentmarks;
