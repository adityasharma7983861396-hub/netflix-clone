import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function NavbarWithoutUser() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const transitionNavBar = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  return (
    <header
      className={`fixed z-50 w-full flex items-center py-4 transition duration-500 ${show ? "bg-black" : "bg-transparent"
        }`}
    >
      <div className="flex-1 ml-8">
        {/* Text logo instead of Netflix image */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-white"
        >
          MovieFlix
        </Link>
      </div>

      <div className="mr-6">
        <Link to="/signin">
          <button className="bg-accent hover:bg-accentDark transition px-8 py-2 rounded-md text-white text-base font-semibold">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
}

export default NavbarWithoutUser;
