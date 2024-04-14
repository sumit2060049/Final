import React, { useState, useEffect } from 'react';
import styles from './TrainingCategory.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryExplain, setCategoryExplain] = useState('');
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.user.Designation !== 'Admin') navigate('/');
    } else {
      navigate('/');
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:8087/add-trainingcategory',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryName, categoryExplain }),
        }
      );
      if (response.status === 201) {
        alert('Category added successfully!');
        setCategoryName('');
        setCategoryExplain('');
        fetchCategories(); // Update the list of categories
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message); // Display the message from the server
        setCategoryName('');
        setCategoryExplain('');
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Navbar
        activeItem="Add Training Category"
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

      <div className={styles.tracate}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h2 style={{ color: 'white' }}>Add TrainingCategory</h2>
          <label style={{ color: 'white' }}>
            Category Name:
            <input
              placeholder="Category"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </label>
          <label style={{ color: 'white' }}>
            Category Explanation:
            <input
              placeholder="Explanation"
              type="text"
              value={categoryExplain}
              onChange={(e) => setCategoryExplain(e.target.value)}
              required
            />
          </label>
          <button type="submit">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Add Category
            </span>
          </button>
        </form>
      </div>

      <div className={styles.categories}>
        <h2>Categories</h2>
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
          {categories.map((category) => (
            <li key={category.id} style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Category Name:</span>{' '}
              <span style={{ fontWeight: '500' }}>{category.CategoryName}</span>{' '}
              -{' '}
              <span style={{ fontWeight: 'bold' }}>Category Description:</span>{' '}
              <span style={{ fontWeight: '500' }}>
                {category.CategoryExplain}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AddCategoryForm;
