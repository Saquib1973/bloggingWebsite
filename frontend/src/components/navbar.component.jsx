import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const userNavPanelRef = useRef(null);
  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  // Code to handle on outside click events on navigationPanel
  const handleClick = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };
  const closeUserNavPanel = () => {
    setUserNavPanel(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userNavPanelRef.current &&
        !userNavPanelRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          closeUserNavPanel();
        }, 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userNavPanelRef]);

  return (
    <>
      <nav className="navbar">
        <Link className="flex-none w-10" to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
        <div
          className={`
            absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw]
            md:border-0 md:relative md:inset-0 md:p-0 md:w-auto md:show ${
              searchBoxVisibility ? "show" : "hide"
            }
          `}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-2xl placeholder:text-dark-grey
            md:pl-12"
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey h-12 w-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>
          <>
            <Link
              to={"/editor"}
              className="hidden md:flex gap-2 link rounded-md hover:drop-shadow-sm"
            >
              <p>Write</p>
              <i className="fi fi-rr-file-edit"></i>
            </Link>
            {access_token ? (
              <>
                <Link to={"/dashboard/notification"}>
                  <button className="w-12 h-12 rounded-full bg-grey hover:bg-black/10 relative">
                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  </button>
                </Link>
                <div className="relative cursor-pointer" onClick={handleClick}>
                  <div
                    className="w-12 h-12 mt-1 relative"
                    ref={userNavPanelRef}
                  >
                    <img
                      src={profile_img}
                      className="w-full h-full object-cover rounded-full"
                      alt=""
                    />
                    {userNavPanel && <UserNavigationPanel />}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link className="btn-dark py-2 " to={"/signin"}>
                  SignIn
                </Link>
                <Link className="btn-light py-2 hidden md:block" to={"/signup"}>
                  SignUp
                </Link>
              </>
            )}
          </>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
