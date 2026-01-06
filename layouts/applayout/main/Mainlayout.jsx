import React from 'react';
import Header from '../../../components/header/Header'
import Home from './Home';
import Featured from './Featured';
import Newsletter from './Newsletter';
import Deal from './Deal';
import Reviews from './Reviews';
import Feedback from './Feedback';
import Footer from '../../../components/footer/Footer';
import BottomNavbar from './BottomNavbar';
import '../styles/styles.css'
import AboutUs from '../../../pages/about-us';

const Main = () => {
  return (
    <>
      <Header />
      <Home />
      <AboutUs />
      <Featured />
      <Newsletter />
      <Deal />
      <Reviews />
      <Feedback />
      <Footer />
      <BottomNavbar />
    </>
  );
};

export default Main;
