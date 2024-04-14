import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UpdatePassword.module.css';
import { useNavigate } from 'react-router-dom';
import Navuser from '../Nav_user/Navuser';

const UpdatePassword = () => {
  const [Email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'User') navigate('/');
      setEmail(user.user.Email);
    } else {
      navigate('/');
    }
  }, []);

  const updatePassword = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8087/update-password',
        { Email, newPassword }
      );
      console.log(response);
      setMessage(response.data.message);
      localStorage.setItem('user', '');
      alert(response.data.message + '!! please login again');
      navigate('/');
      // localStorage.setItem("user","");
    } catch (error) {
      setMessage('Failed to update password');
    }
  };

  return (
    <>
      {/* <Navuser/> */}
      <Navuser
        activeItem="Update Password"
        menuItems={[
          { name: 'User Dashboard', route: '/user-dashboard' },
          { name: 'Update Password', route: '/update-pass' },
          { name: 'User Progress', route: '/training-progress' },
          { name: 'Logout', route: '/' },
        ]}
      />
      <div className={styles.container}>
        <h2 style={{ color: 'white' }}>Update Password</h2>
        <div className={styles.input_group}>
          <input
            style={{ color: '#797979', background: '#ccc' }}
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className={styles.input_group}>
          <input
            type="password"
            placeholder="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.input_group}>
          <button onClick={updatePassword}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Update Password
            </span>
          </button>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </>
  );
};

export default UpdatePassword;
