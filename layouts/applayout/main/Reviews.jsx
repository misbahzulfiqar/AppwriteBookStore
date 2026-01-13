import React, { useEffect } from 'react';
import { reviews } from '../common';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

const Reviews = () => {
  useEffect(() => {
    const swiper = new Swiper(".reviews-slider", {
      spaceBetween: 10,
      grabCursor: true,
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

    return () => swiper.destroy();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    return stars;
  };

  return (
    <section className="reviews" id="reviews">
      <h1 className="heading">
        <span>client's reviews</span>
      </h1>
      
      <div className="swiper reviews-slider">
        <div className="swiper-wrapper">
          {reviews.map((review) => (
            <div key={review.id} className="swiper-slide box">
              <img 
                src={`https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-store-Website-/main/image/pic-${review.id}.png`} 
                alt={review.name}
              />
              <h3>{review.name}</h3>
              <p>{review.text}</p>
              <div className="stars">
                {renderStars(review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;