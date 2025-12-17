import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenViewStore } from "../store/screenViewStore";

function Navbar() {
  const {setNavBarHeight}=useScreenViewStore();
  const ref =useRef(null);
  const navigate = useNavigate();
  const go = (path) => {
    navigate(path);
  };

  useEffect(() => {
    console.log("navbar height",ref.current.offsetHeight);
    setNavBarHeight(ref.current.offsetHeight);
    }, [ref]);

  return (
    <nav
      ref={ref}
      className={`bg-secondary  z-40  w-full `}
    >
      <div className="px-4 mx-auto ">
        <div className="flex items-center justify-between px-6 md:px-16 py-3">
          {/* start area: hamburger (mobile) + logo (clickable) */}
          <div className="flex items-center gap-4">
            <a
              onClick={() => {
                // navigate("/");
              }}
              className="w-44 md:w-56 cursor-pointer group relative "
            >
              <img src="/images/login-logo.png" className="w-full" alt="logo" />
            </a>
          </div>
          </div>
          </div>


    </nav>
  );
}

export default Navbar;

