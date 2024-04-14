import React, { useEffect, useState } from 'react';
import styles from './UserCreation.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const UserCreation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubroles();
    fetchUsers();
    const userStr = localStorage.getItem('user');
    // let user;
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

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

  const [users, setUsers] = useState([]);
  const [subroles, setSubroles] = useState([]);
  const [userData, setUserData] = useState({
    Username: '',
    Email: '',
    Designation: '',
    Password: Math.random().toString(36).slice(-8),
    IsChanged: '0',
    SubroleID: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8087/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      console.log(data);
      console.log(data.message);

      if (data.status) {
        alert('User created successfully');
        fetchUsers(); // Update the list of users
      } else if (
        data.status === false &&
        data.message === 'Email already exists'
      ) {
        alert('Email already exists');
      } else {
        alert('Failed to create user');
      }

      setUserData({
        Username: '',
        Email: '',
        Designation: '',
        Password: '',
        IsChanged: '',
        SubroleID: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create user');
    }
  };

  return (
    <>
      <Navbar
        activeItem="Add User"
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

      <div className={styles.usecre}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>UserCreation</h2>
          <label style={{ color: 'white' }}>
            Username:
            <input
              type="text"
              name="Username"
              value={userData.Username}
              onChange={handleChange}
            />
          </label>
          <br />
          <label style={{ color: 'white' }}>
            Email:
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label style={{ color: 'white' }}>
            Role:
            <select
              name="Designation"
              value={userData.Designation}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </label>
          <br />

          <div className={styles.input}>
            <label style={{ color: 'white' }}>
              Subrole:
              <select
                name="SubroleID"
                value={userData.SubroleID}
                onChange={handleChange}
              >
                <option value="">Select subrole</option>
                {subroles.map((subrole) => (
                  <option key={subrole.SubroleID} value={subrole.SubroleID}>
                    {subrole.SubroleName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <br />
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Create User
            </span>
          </button>
        </form>
      </div>
      <div className={styles.user}>
        <h2>Users</h2>
        <ul
          style={{
            color: 'black',
            // backgroundColor: 'lightgray',
            textAlign: 'center',
            padding: '10px',
            gap: '10px',
            borderRadius: '5px',
          }}
        >
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Username:</span>{' '}
              <span style={{ fontWeight: '500' }}>{user.Username}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Email:</span>{' '}
              <span style={{ fontWeight: '500' }}>{user.Email}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>Designation:</span>{' '}
              <span style={{ fontWeight: '500' }}>{user.Designation}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserCreation;
