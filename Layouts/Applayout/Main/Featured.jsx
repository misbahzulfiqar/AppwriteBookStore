import React, { useEffect } from 'react';
import { featuredBooks } from '../common';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

const Featured = () => {
  useEffect(() => {
    const swiper = new Swiper(".featured-slider", {
      spaceBetween: 10,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        450: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      },
    });

    return () => swiper.destroy();
  }, []);

  return (
    <section className="featured" id="featured">
      <h1 className="heading">
        <span>featured books</span>
      </h1>
      
      <div className="swiper featured-slider">
        <div className="swiper-wrapper">
          {featuredBooks.map((book) => (
            <div key={book.id} className="swiper-slide box">
              <div className="icons">
                <a href="#" className="fas fa-search"></a>
                <a href="#" className="fas fa-eye"></a>
              </div>
              
              <div className="image">
                <a href="./product.html">
                  <img 
                    src={`https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-${book.id}.png`} 
                    alt={book.title}
                  />
                </a>
              </div>
              
              <div className="content">
                <h3>{book.title}</h3>
                <a href="./cart.html" className="btn">Read Now</a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </section>
  );
};

export default Featured;
