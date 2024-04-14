import React, { useState, useEffect } from 'react';
import styles from './TrainingPlan.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const TrainingPlan = () => {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subroleID, setSubroleID] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [trainingPlans, setTrainingPlans] = useState([]);
  const navigate = useNavigate();

  const [subroles, setSubroles] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-plans');
      if (!response.ok) {
        throw new Error('Failed to fetch training plans');
      }
      const data = await response.json();
      setTrainingPlans(data);
    } catch (error) {
      console.error('Error fetching training plans:', error);
    }
  };

  const fetchSubroles = async () => {
    try {
      const response = await fetch('http://localhost:8087/subroles');
      if (!response.ok) {
        throw new Error('Failed to fetch subroles');
      }
      const data = await response.json();
      setSubroles(data);
    } catch (error) {
      console.error('Error fetching subroles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchTrainingPlans();
    fetchSubroles();
    fetchCategories();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8087/add-trainingplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          description,
          startDate,
          endDate,
          subroleID,
          categoryID,
        }),
      });

      if (response.status === 201) {
        alert('Plan added successfully!');
        setPlanName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setSubroleID('');
        setCategoryID('');
        fetchTrainingPlans();
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setPlanName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setSubroleID('');
        setCategoryID('');
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Navbar
        activeItem="Add Training Plan"
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

      <div className={styles.trapla}>
        <div className={styles.form_container}>
          <h2 style={{ color: 'white' }}>Add Training Plan</h2>
          <form onSubmit={handleSubmit}>
            <label style={{ color: 'white' }}>
              Plan Name:
              <input
                type="text"
                placeholder="Plan Name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Description:
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </label>
            <label style={{ color: 'white' }}>
              Subrole ID:
              <select
                value={subroleID}
                onChange={(e) => setSubroleID(e.target.value)}
                required
              >
                <option value="">Select subrole</option>
                {subroles.map((subrole) => (
                  <option key={subrole.SubroleID} value={subrole.SubroleID}>
                    {subrole.SubroleName}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ color: 'white' }}>
              Category ID:
              <select
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Add Plan
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className={styles.plan}>
        <h2>Training Plans</h2>
        <ul
          style={{
            color: 'black',
            // backgroundColor: 'blue',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
          }}
        >
          {trainingPlans.map((plan) => (
            <li key={plan.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Plan Name:</span>{' '}
              <span style={{ fontWeight: '500' }}>{plan.PlanName}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
              <span style={{ fontWeight: '500' }}>{plan.Description}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Start Date:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {plan.StartDate.slice(0, 10)}
              </span>{' '}
              - <span style={{ fontWeight: 'bold' }}>End Date:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {plan.EndDate.slice(0, 10)}
              </span>{' '}
              - <span style={{ fontWeight: 'bold' }}>For:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {plan && plan.SubroleID === 1
                  ? 'Intern'
                  : plan && plan.SubroleID === 2
                  ? 'Employee'
                  : ''}
              </span>{' '}
              - <span style={{ fontWeight: 'bold' }}>Category:</span>{' '}
              <span style={{ fontWeight: '500' }}>{plan.CategoryID}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TrainingPlan;
