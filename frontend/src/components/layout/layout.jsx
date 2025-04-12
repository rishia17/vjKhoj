import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="card" style={{backgroundColor:"#0a0118"}}>
      <Header />
      <div style={{ minHeight: "70vh" }}>
        <div className="container">
          {" "}
        <Outlet />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
      <Footer />
      </div>
    </div>
  );
}

export default Layout