import React from 'react';
import { footerLinks } from '../../Layouts/Applayout/common';

const Footer = () => {
  return (
    <section className="footer">
      <div className="box-container">
        {/* Locations */}
        <div className="box">
          <h3>our locations</h3>
          {footerLinks.locations.map((location, index) => (
            <a key={index} href="#">
              <i className={location.icon}></i> {location.name}
            </a>
          ))}
        </div>
        
        {/* Quick Links */}
        <div className="box">
          <h3>quick links</h3>
          {footerLinks.quickLinks.map((link, index) => (
            <a key={index} href={link.link}>
              <i className={link.icon}></i> {link.name}
            </a>
          ))}
        </div>
        
        {/* Extra Links */}
        <div className="box">
          <h3>extra links</h3>
          {footerLinks.extraLinks.map((link, index) => (
            <a key={index} href="#">
              <i className={link.icon}></i> {link.name}
            </a>
          ))}
        </div>
        
        {/* Contact Info */}
        <div className="box">
          <h3>contact info</h3>
          {footerLinks.contactInfo.map((info, index) => (
            <a key={index} href="#">
              <i className={info.icon}></i> {info.value}
            </a>
          ))}
          <img 
            src="https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/worldmap.png" 
            className="map" 
            alt="World Map" 
          />
        </div>
      </div>
      
      {/* Social Share */}
      <div className="share">
        {footerLinks.socialLinks.map((social, index) => (
          <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className={social.icon}></a>
        ))}
      </div>
      
      {/* Credit */}
      <div className="credit">
        created by <span>Misbah Zulfiqar </span>copyright ©2022 all rights reserved!
      </div>
    </section>
  );
};

export default Footer;