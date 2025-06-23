import React from "react";
import Header from "../header/header";
import { Outlet } from "react-router-dom";
import Footer from "../footer/footer";

function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Fixed Header */}
      <div style={{ height: "75px", flexShrink: 0 }}>
        <Header />
      </div>

      {/* Scrollable content */}
      <div style={{ minHeight: "calc(100vh - 75px)", flex: 1 }}>
        <Outlet />
      </div>

      {/* Optional Footer */}
      {/* <div style={{ height: "60px", flexShrink: 0 }}>
        <Footer />
      </div> */}
    </div>
  );
}

export default Layout;
