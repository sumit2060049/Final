import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeItem, menuItems }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate(item.route);
  };

  return (
    <div className={styles.butnav}>
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`${styles.t} ${
            activeItem === item.name ? styles.active : ''
          }`}
          onClick={() => handleClick(item)}
        >
          <span className={styles.nav}>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
