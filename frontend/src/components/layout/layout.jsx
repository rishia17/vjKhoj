import React from "react";
import Header from "../header/header";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>
        {
          !isChatPage &&

          <div style={{ minHeight: "75px", flexShrink: 0 }}>
            <Header />
          </div>
        }
      
        <div style={{ flex: 1, backgroundColor: "black" }}>
          <Outlet />
        </div>
      </div>

  );
}

export default Layout;
