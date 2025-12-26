import React, { useState, useEffect, useContext } from "react";
import { Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../../Context/UserContext";

function Navbar({ playPage }) {
  const { User } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (User?.photoURL) {
      setProfilePic(User.photoURL);
    }

    const transitionNavBar = () => {
      setShow(window.scrollY > 80);
    };

    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, [User]);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Fade>
      <header
        className={`fixed top-0 z-10 w-full ${playPage ? "backdrop-blur-sm" : ""
          }`}
      >
        <nav
          className={`transition duration-500 ${show ? "bg-black" : "bg-transparent"
            }`}
        >
          <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="text-2xl font-bold tracking-wide text-white"
                >
                  MovieFlix
                </Link>

                <div className="hidden md:block ml-10">
                  <div className="flex items-center space-x-4">
                    {["/", "/series", "/history", "/liked", "/mylist"].map(
                      (path, index) => (
                        <Link
                          key={index}
                          to={path}
                          className="px-3 py-2 text-sm font-medium text-white transition hover:text-accent"
                        >
                          {["Home", "Series", "History", "Liked", "My List"][index]}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-4">
                <Link to="/search" className="text-white hover:text-accent">
                  🔍
                </Link>

                {User && (
                  <span className="hidden md:block text-white">
                    {User.displayName}
                  </span>
                )}

                <div className="relative group">
                  <Link to="/profile">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        profilePic ||
                        "https://www.citypng.com/public/uploads/preview/profile-user-round-blue-icon-symbol-download-png-11639594337tco5j3n0ix.png"
                      }
                      alt="User profile"
                    />
                  </Link>

                  <ul className="absolute right-0 hidden w-40 mt-2 text-white bg-stone-900 rounded group-hover:block">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-stone-800"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signin"
                        className="block px-4 py-2 hover:bg-stone-800"
                      >
                        Add User
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left hover:bg-stone-800"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden text-white"
                >
                  {isOpen ? "✖" : "☰"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Transition
            show={isOpen}
            enter="transition duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="md:hidden bg-black">
              {["/", "/series", "/history", "/liked", "/mylist"].map(
                (path, index) => (
                  <Link
                    key={index}
                    to={path}
                    className="block px-4 py-2 text-white hover:bg-accent"
                  >
                    {["Home", "Series", "History", "Liked", "My List"][index]}
                  </Link>
                )
              )}
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-white hover:bg-accent"
              >
                Sign Out
              </button>
            </div>
          </Transition>
        </nav>
      </header>
    </Fade>
  );
}

export default Navbar;
