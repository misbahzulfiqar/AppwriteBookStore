import React from 'react';
import Header from '../../../Components/Header/Header'
import Home from './Home';
import Icons from './Icons';
import Featured from './Featured';
import Newsletter from './Newsletter';
import Deal from './Deal';
import Reviews from './Reviews';
import Feedback from './Feedback';
import Footer from '../../../Components/Footer/Footer';
import BottomNavbar from './BottomNavbar';
import '../Styles/styles.css'

const Main = () => {
  return (
    <>
      <Header />
      <Home />
      <Icons />
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
