import React, { useState } from 'react';
import styles from './LoginSignup.module.css';
import { useNavigate } from 'react-router-dom';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [forgotemail, forgotsetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:8087/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      console.log(data);
      console.log('now');
      localStorage.setItem('user', JSON.stringify(data));

      if (data.message === 'Authentication successful') {
        setAuthenticated(true);
        setError('');
        console.log(data.user.Designation);
        if (data.user.Designation === 'Admin') {
          navigate('/admin-dashboard');
        } else if (
          data.user.Designation === 'User' &&
          data.user.IsChanged === 0
        ) {
          navigate('/update-pass');
        } else if (
          data.user.Designation === 'User' &&
          data.user.IsChanged === 1
        ) {
          navigate('/user-dashboard');
        }
      } else {
        setAuthenticated(false);
        setError('Invalid email or password');
      }
    } catch (error) {
      setAuthenticated(false);
      setError(error.message || 'An error occurred');
    }
  };

  const handnav = () => {
    setShowDialog(true); // Show the dialog when user clicks "Click Here"
  };

  const handleDialogSubmit = async () => {
    setError('');
    setShowDialog(false); // Close the dialog

    try {
      const response = await fetch('http://localhost:8087/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forgotemail }),
      });
      console.log(response);
      console.log(response.ok);

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      const data = await response.json();
      console.log(data);
      // Handle success message
    } catch (error) {
      setError(error.message || 'An error occurred while updating password');
    }
  };

  return (
    <div className={styles.container}>
      {showDialog && (
        <div className={styles.dialog}>
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotemail}
            onChange={(e) => forgotsetEmail(e.target.value)}
          />
          <button onClick={handleDialogSubmit}>Submit</button>
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.text}>{action}</div>
        <div className={styles.underline}></div>
      </div>
      <div className={styles.inputs}>
        {action === 'Login' ? (
          <div></div>
        ) : (
          <div className={styles.input}>
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className={styles.input}>
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.input}>
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.forgot_password}>
        Forgot Password?{' '}
        <span className={styles.click} onClick={handnav}>
          Click Here!
        </span>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {authenticated && (
        <div className={styles.success}>You are signed in!</div>
      )}
      <div className={styles.submit} onClick={handleSubmit}>
        {action}
      </div>
    </div>
  );
};

export default LoginSignup;
