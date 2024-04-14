import React, { useState, useEffect } from 'react';
import styles from './TrainingModule.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const AddModuleForm = () => {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [planID, setPlanID] = useState('');
  const [moduleDate, setModuleDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [trainingModules, setTrainingModules] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainingModules();
    fetchPlans();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-plans');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchTrainingModules = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-modules');
      if (!response.ok) {
        throw new Error('Failed to fetch training modules');
      }
      const data = await response.json();
      setTrainingModules(data);
    } catch (error) {
      console.error('Error fetching training modules:', error);
    }
  };

  const fetchPlanDetails = async (planID) => {
    try {
      const response = await fetch(
        `http://localhost:8087/plans-detail/${planID}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch plan details');
      }
      const data = await response.json();
      setSelectedPlan(data);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      setSelectedPlan(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      new Date(`1970-01-01T${startTime}:00Z`) >=
      new Date(`1970-01-01T${endTime}:00Z`)
    ) {
      alert('End time must be greater than start time');
      return;
    }
    try {
      const response = await fetch('http://localhost:8087/add-trainingmodule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleName,
          description,
          planID,
          moduleDate,
          startTime,
          endTime,
        }),
      });
      if (response.status === 201) {
        alert('Module added successfully!');
        setModuleName('');
        setDescription('');
        setPlanID('');
        setModuleDate('');
        setStartTime('');
        setEndTime('');
        fetchTrainingModules();
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setModuleName('');
        setDescription('');
        setPlanID('');
        setModuleDate('');
        setStartTime('');
        setEndTime('');
        fetchTrainingModules();
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Navbar
        activeItem="Add Training Module"
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

      <div>
        <div className={styles.tramod}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h2 style={{ color: 'white' }}>Add Training Module</h2>
            <label style={{ color: 'white' }}>
              Module Name:
              <input
                placeholder="Name"
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Description:
              <input
                placeholder="Desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Plan ID:
              <select
                value={planID}
                onChange={(e) => {
                  setPlanID(e.target.value);
                  fetchPlanDetails(e.target.value);
                }}
                required
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan.PlanID} value={plan.PlanID}>
                    {plan.PlanName}
                  </option>
                ))}
              </select>
            </label>
            {selectedPlan && (
              <div>
                <h3>Selected Plan Details:</h3>

                <p>Start Date: {selectedPlan.StartDate.slice(0, 10)}</p>
                <p>End Date: {selectedPlan.EndDate.slice(0, 10)}</p>
                <p>SubroleID: {selectedPlan.SubroleID}</p>
              </div>
            )}

            <label style={{ color: 'white' }}>
              Module Date:
              <input
                type="date"
                value={moduleDate}
                onChange={(e) => setModuleDate(e.target.value)}
                min={selectedPlan && selectedPlan.StartDate.slice(0, 10)}
                max={selectedPlan && selectedPlan.EndDate.slice(0, 10)}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="09:30"
                max="18:30"
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              End Time:
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="09:30"
                max="18:30"
                required
              />
            </label>
            <button type="submit">
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Add Module
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className={styles.module}>
        <h2>Training Modules</h2>
        <ul
          style={{
            color: 'black',
            // backgroundColor: 'blue',
            textAlign: 'center',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {trainingModules.map((module) => (
            <li key={module.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Module Name:</span>{' '}
              <span style={{ fontWeight: '500' }}>{module.ModuleName}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
              <span style={{ fontWeight: '500' }}>{module.Description}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>PlanID:</span>{' '}
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
    </>
  );
};

export default AddModuleForm;
