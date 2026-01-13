import React, { useEffect } from 'react';
import { bookImages } from '../common';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

const Home = () => {
  useEffect(() => {
    // Initialize Swiper
    const swiper = new Swiper(".books-slider", {
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <section className="home" id="home" style={{paddingTop: '100px'}}>
      <div className="row">
        <div className="content">
          <h3>Memorable, Ties to Light</h3>
          <p>
            A name that shines as brightly as the stories within, illuminating every reader’s journey. Discover a world of books where knowledge and imagination meet in a warm, glowing embrace.
          </p>
          <a href="#" className="btn">Read Now</a>
        </div>
        
        <div className="swiper books-slider">
          <div className="swiper-wrapper">
            {bookImages.map((img, index) => (
              <a key={index} href="#" className="swiper-slide">
                <img src={img} alt={`Book ${index + 1}`} />
              </a>
            ))}
          </div>
          <img 
            src="https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-store-Website-/main/image/stand.png" 
            className="stand" 
            alt="Book Stand" 
          />
        </div>
      </div>
    </section>
  );
};

export default Home;