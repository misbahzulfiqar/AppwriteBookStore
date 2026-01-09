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
import PublicBookListWrapper from '../../../components/library/PublicBookListWrapper';

const Main = () => {
  return (
    <>
      <Header />
      <Home />
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Public Library
        </h2>
        <PublicBookListWrapper />
      </section>
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
