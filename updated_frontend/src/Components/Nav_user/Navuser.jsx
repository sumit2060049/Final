import React, { useState } from 'react';
import styles from './Navuser.module.css';
import { useNavigate } from 'react-router-dom';

const Navuser = ({ activeItem, menuItems }) => {


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

export default Navuser;
