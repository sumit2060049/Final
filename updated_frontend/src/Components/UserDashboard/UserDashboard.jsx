import styles from './UserDashboard.module.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navuser from '../Nav_user/Navuser';

const UserDashboard = () => {
  const [user, setuser] = useState(null);

  const [trainingPlans, setTrainingPlans] = useState([]);
  const [trainingModules, setTrainingModules] = useState([]);
  const [fetchmarks, setFetchmarks] = useState([]);
  const [fetchreport, setFetchreport] = useState([]);

  const navigate = useNavigate();

  const fetchTrainingPlans = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User data not found in local storage');
      }
      const user = JSON.parse(userStr);
      const subroleID = user.user.SubroleID;

      const response = await fetch(
        `http://localhost:8087/training-plan?subroleID=${subroleID}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch training plan');
      }
      const data = await response.json();
      console.log(data);
      setTrainingPlans(data);

      console.log(data.map((plan) => plan.PlanID).join(','));

      const modulesResponse = await fetch(
        `http://localhost:8087/training-module?plansid=${data
          .map((plan) => plan.PlanID)
          .join(',')}`
      );
      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch modules');
      }
      const modulesData = await modulesResponse.json();
      console.log(modulesData);
      setTrainingModules(modulesData);

      const marksPromises = modulesData.map((module) =>
        fetchAssessments(user.user.UserID, module.ModuleID)
      );
      const marksResults = await Promise.all(marksPromises);
      const allMarks = marksResults.flat();
      console.log(allMarks);
      setFetchmarks(allMarks);

      const reportsPromises = modulesData.map((module) =>
        fetchReports(user.user.UserID, module.ModuleID)
      );
      const reportsResults = await Promise.all(reportsPromises);
      const allReports = reportsResults.flat();
      console.log(allReports);
      setFetchreport(allReports);
    } catch (error) {
      console.error('Error fetching training plans:', error);
    }
  };

  const fetchAssessments = async (userID, moduleID) => {
    try {
      const response = await fetch(
        `http://localhost:8087/marks?userID=${userID}&moduleID=${moduleID}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }
  };

  const fetchReports = async (userID, moduleID) => {
    try {
      const response = await fetch(
        `http://localhost:8087/reports?userID=${userID}&moduleID=${moduleID}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();

      console.log('fected data', data);

      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);

      return [];
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setuser(user.user);
      console.log(user.user);
      if (user.user.Designation !== 'User') navigate('/');
    } else {
      navigate('/');
    }

    fetchTrainingPlans();
  }, []);

  return (
    <>
      <Navuser
        activeItem="User Dashboard"
        menuItems={[
          { name: 'User Dashboard', route: '/user-dashboard' },
          { name: 'Update Password', route: '/update-pass' },
          { name: 'User Progress', route: '/training-progress' },
          { name: 'Logout', route: '/' },
        ]}
      />
      <div className={styles.dashboard_container}>
        <div className={styles.user_info}>
          <h1>Welcome,{user && user.Username}</h1>
          <p>
            <span style={{ fontWeight: 'bold' }}>UserID:</span>{' '}
            <span style={{ fontWeight: '500' }}>{user && user.UserID}</span>
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Email:</span>{' '}
            <span style={{ fontWeight: '500' }}>{user && user.Email}</span>
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Designation:</span>{' '}
            <span style={{ fontWeight: '500' }}>
              {user && user.SubroleID === 1
                ? 'Intern'
                : user && user.SubroleID === 2
                ? 'Employee'
                : ''}
            </span>
          </p>
        </div>
        <div className={styles.training_plans}>
          <h2>Training Plans</h2>

          <ul
            style={{
              padding: '10px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            {trainingPlans.map((plan) => (
              <li key={plan.PlanID} style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>Plan ID:</span>{' '}
                <span style={{ fontWeight: '500' }}>{plan.PlanName}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Plan Desc:</span>{' '}
                <span style={{ fontWeight: '500' }}>{plan.Description}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Start Date:</span>{' '}
                <span style={{ fontWeight: '500' }}>
                  {plan.StartDate.slice(0, 10)}
                </span>{' '}
                - <span style={{ fontWeight: 'bold' }}>End Date:</span>{' '}
                <span style={{ fontWeight: '500' }}>
                  {plan.EndDate.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.training_module}>
          <h2>Training Module</h2>

          <ul
            style={{
              padding: '10px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
          >
            {trainingModules.map((module) => (
              <li
                key={module.ModuleID}
                style={{
                  marginBottom: '5px',

                  padding: '5px',
                  borderRadius: '3px',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Module Name:</span>{' '}
                <span style={{ fontWeight: '500' }}>{module.ModuleName}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Module Desc:</span>{' '}
                <span style={{ fontWeight: '500' }}>{module.Description}</span>{' '}
                - <span style={{ fontWeight: 'bold' }}>Plan ID:</span>{' '}
                <span style={{ fontWeight: '500' }}>{module.PlanID}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Module Date:</span>{' '}
                <span style={{ fontWeight: '500' }}>
                  {module.ModuleDate.slice(0, 10)}
                </span>{' '}
                - <span style={{ fontWeight: 'bold' }}>Start Time:</span>{' '}
                <span style={{ fontWeight: '500' }}>{module.StartTime}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>End Time:</span>{' '}
                <span style={{ fontWeight: '500' }}>{module.EndTime}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.performance_dashboard}>
          <h2>Performance Dashboard</h2>

          <ul
            style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}
          >
            {fetchmarks.map((mark) => (
              <li
                key={mark.id}
                style={{
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '5px',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>User ID:</span>{' '}
                <span style={{ fontWeight: '500' }}>{mark.UserID}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Module ID:</span>{' '}
                <span style={{ fontWeight: '500' }}>{mark.ModuleID}</span> -{' '}
                <span style={{ fontWeight: 'bold' }}>Score:</span> -{' '}
                <span style={{ fontWeight: '500' }}>{mark.Score}</span>{' '}
                <span style={{ fontWeight: 'bold' }}>Date Completed:</span>{' '}
                <span style={{ fontWeight: '500' }}>
                  {mark.DateCompleted.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={styles.report_dashboard}
          style={{
            marginTop: '20px',

            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <h2>Reports</h2>
          <ul
            style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}
          >
            {fetchreport.map((report) => (
              <li
                key={report.ReportID}
                style={{
                  marginBottom: '10px',
                  paddingBottom: '10px',
                }}
              >
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
                </span>{' '}
                -{' '}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
