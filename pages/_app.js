import "../styles/globals.scss";
import React from "react";
import Header from "../components/common/Header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div className="container-fluid row m-0 p-0 mt-5 mb-5">
        <div className="col-0 col-lg-2" />
        <div className="col-12 col-lg-8 shadow p-5 h-100 round bg-19 text-light center-cnt">
          <Component {...pageProps} />
        </div>
        <div className="col-0 col-lg-2" />
      </div>
    </>
  );
}

export default MyApp;
