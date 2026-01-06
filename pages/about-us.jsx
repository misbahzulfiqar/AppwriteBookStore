import React from "react";
import IconImg from '../images/book-icon.png' 

const AboutUs = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between p-8 md:p-16 text-[#4b3a2a] relative overflow-hidden about-container"
      id="about">
      {/* Left Side */}
      <div className="md:w-1/2 z-10 about-p about-pp">
        <h3 className="text-6xl text-[#8b5a2b] head">
          About Our Bookstore
        </h3>
        <p className="text-[#6f4e37] text-2xl about-p mt-4">
          Welcome to our bookstore! We are passionate about connecting readers with
          amazing books from every genre. Discover your next favorite story here.
        </p>
        <button className="w-60 h-17 bg-[#8b5a2b] text-white text-2xl rounded-xl flex items-center justify-center gap-2 group hover:bg-[#6f4e37] transition about-p">
          Learn More
          <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
            ➜
          </span>
        </button>
      </div>

      {/* Right Side - Floating Image */}
     <div className="flex justify-center items-center relative">
    <img
        src={IconImg} // Your image variable
        alt="Books"
        className="object-cover rounded-xl animate-float"
        style={{ width: '600px', height: '600px', marginTop: '100px'}} // Set size via inline style
    />
    </div>


      {/* Floating animation style */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
