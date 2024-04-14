import React, { useState, useEffect } from 'react';
import styles from './UserReport.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const UserReport = () => {
  const [userID, setUserID] = useState('');
  // const [assessmentID, setAssessmentID] = useState('');
  const [moduleID, setModuleID] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [users, setUsers] = useState([]);
  // const [assessments, setAssessments] = useState([]);
  const [reports, setReports] = useState([]);
  const [modules, setModules] = useState([]);
  const [marks, setMarks] = useState([]); // New state variable for marks
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    //  fetchAssessments();
    fetchReports();
    fetchModules();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
      setUserID(user.user.UserID);
    } else {
      navigate('/');
    }
  }, []);

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

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8087/getuser-report');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/marks?userID=${userID}&moduleID=${moduleID}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch marks');
      }
      const data = await response.json();
      console.log(data);
      setMarks(data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8087/user-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          moduleID,
          reportDate,
          summary,
          recommendations,
        }),
      });
      // alert('Report added successfully!');
      // setUserID('');
      // setAssessmentID('');
      // setReportDate('');
      // setSummary('');
      // setRecommendations('');
      if (response.status === 201) {
        alert('Report added successfully!');
        setUserID('');
        // setAssessmentID('');
        setModuleID('');
        setReportDate('');
        setSummary('');
        setRecommendations('');
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setUserID('');
        // setAssessmentID('');
        setModuleID('');
        setReportDate('');
        setSummary('');
        setRecommendations('');
      } else {
        throw new Error('Failed to add Amount');
      }
    } catch (error) {
      console.error('Error adding report:', error);
    }
  };

  return (
    <>
      <Navbar
        activeItem="Add Training Review"
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

      <div className={styles.trarep}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>Add Report</h2>
          <label style={{ color: 'white' }}>
            User ID:
            <select
              value={userID}
              onChange={(e) => {
                setUserID(e.target.value);
                setMarks(null); // Reset marks when user changes
              }}
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
              onChange={(e) => {
                setModuleID(e.target.value);
                setMarks(null); // Reset marks when module changes
              }}
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
          <button type="button" onClick={fetchMarks}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Fetch Marks
            </span>
          </button>
          {marks && (
            <div>
              <h3>Marks</h3>
              {marks.map((mark) => (
                <div key={mark.AssessmentID}>
                  <p>User ID: {userID}</p>
                  <p>Module ID: {moduleID}</p>
                  <p>Assessment ID: {mark.AssessmentID}</p>
                  <p>Score: {mark.Score}</p>
                </div>
              ))}
            </div>
          )}
          <label style={{ color: 'white' }}>
            Report Date:
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Set max attribute to today's date
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </label>
          <label style={{ color: 'white' }}>
            Summary:
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </label>
          <label style={{ color: 'white' }}>
            Recommendations:
            <input
              type="text"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              required
            />
          </label>
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Add Report
            </span>
          </button>
        </form>
      </div>
      <div className={styles.report}>
        <h2>Reports</h2>
        <ul
          style={{
            listStyleType: 'none',
            color: 'black',
            // backgroundColor: 'lightgray',
            textAlign: 'center',
            padding: '10px',
            gap: '10px',
            borderRadius: '5px',
          }}
        >
          {reports.map((report) => (
            <li key={report.ReportID} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>User ID:</span>{' '}
              <span style={{ fontWeight: '500' }}>{report.UserID}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Module ID:</span>{' '}
              <span style={{ fontWeight: '500' }}>{report.ModuleID}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Report Date:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {report.ReportDate.slice(0, 10)}
              </span>{' '}
              - <span style={{ fontWeight: 'bold' }}>Summary:</span>{' '}
              <span style={{ fontWeight: '500' }}>{report.Summary}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Recommendations:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {report.Recommendations}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserReport;
