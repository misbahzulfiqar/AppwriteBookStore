import React from 'react';
import { iconsData } from '../common';

const Icons = () => {
  return (
    <section className="icons-container">
      {iconsData.map((icon) => (
        <div key={icon.id} className="icons">
          <i className={icon.icon}></i>
          <div className="content">
            <h3>{icon.title}</h3>
            <p>{icon.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Icons;