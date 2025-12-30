import React from 'react';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter submitted');
  };

  return (
    <section className="newsletter" id="newsletter">
      <form onSubmit={handleSubmit}>
        <h3>subscribe for latest updates</h3>
        <input 
          type="email" 
          name="email" 
          placeholder="enter your email" 
          className="box" 
          required 
        />
        <input type="submit" value="subscribe" className="btn" />
      </form>
    </section>
  );
};

export default Newsletter;