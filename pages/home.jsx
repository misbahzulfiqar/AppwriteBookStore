import React from "react";
import Home from "../layouts/applayout/main/Home";
import AboutUs from "../pages/about-us";
import Featured from "../layouts/applayout/main/Featured";
import Newsletter from "../layouts/applayout/main/Newsletter";
import Deal from "../layouts/applayout/main/Deal";
import Reviews from "../layouts/applayout/main/Reviews";
import Feedback from "../layouts/applayout/main/Feedback";
import PublicBookListWrapper from "../components/library/PublicBookListWrapper";

const HomePage = () => {
  return (
    <div>
      <Home />
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Public Library</h2>
        <PublicBookListWrapper />
      </section>
      <AboutUs />
      <Featured />
      <Newsletter />
      <Deal />
      <Reviews />
      <Feedback />
    </div>
  );
};

export default HomePage;
