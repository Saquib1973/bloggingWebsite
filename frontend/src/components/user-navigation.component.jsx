import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  // @Context
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);
  // @Functions
  // signout function
  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };
  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className={"absolute right-0 z-50 mt-2"}
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200  text-left">
        <Link to={"/editor"} className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          Write
        </Link>
        <Link to={`/user/${username}`} className="link flex gap-2 pl-8 py-4">
          <i className="fi fi-rr-user"></i>
          Profile
        </Link>
        <Link to={`/dashboard/blog`} className="link flex gap-2 pl-8 py-4">
          <i className="fi fi-rr-dashboard"></i>
          Dashboard
        </Link>
        <Link
          to={`/settings/edit-profile`}
          className="link flex gap-2 pl-8 py-4"
        >
          <i className="fi fi-rr-settings"></i>
          Settings
        </Link>
        <span className="absolute border-t border-grey w-[100%]"></span>
        <button
          className="text-left p-4 hover:bg-red/90 w-full pl-8 group hover:text-white"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mb-1">SignOut</h1>
          <p className="text-dark-grey group-hover:text-white duration-200">
            @{username}
          </p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
