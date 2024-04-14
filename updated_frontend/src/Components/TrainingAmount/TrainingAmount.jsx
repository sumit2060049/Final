import React, { useState, useEffect } from 'react';
import styles from './TrainingAmount.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const TrainingAmount = () => {
  const [moduleID, setModuleID] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [trainingAmounts, setTrainingAmounts] = useState([]);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainingAmounts();
    fetchModules();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

  const fetchTrainingAmounts = async () => {
    try {
      const response = await fetch('http://localhost:8087/training-amounts');
      if (!response.ok) {
        throw new Error('Failed to fetch training amounts');
      }
      const data = await response.json();
      setTrainingAmounts(data);
    } catch (error) {
      console.error('Error fetching training amounts:', error);
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
      const response = await fetch('http://localhost:8087/add-moduleamount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleID, amount, currency }),
      });

      if (response.status === 201) {
        alert('Amount added successfully!');
        setModuleID('');
        setAmount('');
        setCurrency('');
        fetchTrainingAmounts();
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setModuleID('');
        setAmount('');
        setCurrency('');
      } else {
        throw new Error('Failed to add Amount');
      }
    } catch (error) {
      console.error('Error adding amount:', error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Navbar
        activeItem="Add Training Amount"
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

      <div className={styles.traamo}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>Add Training Amount</h2>
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
            Amount:
            <input
              type="text"
              placeholder="Enter amount spent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label style={{ color: 'white' }}>
            Currency:
            <input
              type="text"
              placeholder="Currency type"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />
          </label>
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Add Amount
            </span>
          </button>
        </form>
      </div>
      <div className={styles.amount}>
        <h2>Training Amounts</h2>
        <ul
          style={{
            color: 'black',
            // backgroundColor: 'blue',
            textAlign: 'center',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {trainingAmounts.map((amount) => (
            <li key={amount.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Module ID:</span>{' '}
              <span style={{ fontWeight: '500' }}>{amount.ModuleID}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Amount Spent:</span>{' '}
              <span style={{ fontWeight: '500' }}>{amount.Amount}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Currency:</span>{' '}
              <span style={{ fontWeight: '500' }}>{amount.Currency}</span>{' '}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TrainingAmount;
