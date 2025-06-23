import React from "react";
import Header from "../header/header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>
        <div style={{ minHeight: "75px", flexShrink: 0 }}>
          <Header />
        </div>
      
        <div style={{ flex: 1, backgroundColor: "#0a0118" }}>
          <Outlet />
        </div>
      </div>

  );
}

export default Layout;
