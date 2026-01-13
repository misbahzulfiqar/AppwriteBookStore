import React from 'react';

const Deal = () => {
  return (
    <section className="deal" id="deal">
      <div className="content">
        <h3>deal of the day</h3>
        <h1>upto Free For Today</h1>
        <p>Checkout before this deal expires at midnight.</p>
        <a href="#" className="btn">Read Now</a>
      </div>
      <div className="image">
        <img 
          src="https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-store-Website-/main/image/deal-img.jpg" 
          alt="Deal of the day" 
        />
      </div>
    </section>
  );
};

export default Deal;