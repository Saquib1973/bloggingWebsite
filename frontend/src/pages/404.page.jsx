import React, { useContext } from "react";
import pageNotFoundImg from "../imgs/404.png";
import fullLogo from "../imgs/full-logo.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { ThemeContext } from "../App";
import darkPageNotFound from "../imgs/404-light.png"
const PageNotFound = () => {
  let { theme } = useContext(ThemeContext)
  return (
    <AnimationWrapper>
      <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
        <img
          src={theme === "light" ? pageNotFoundImg : darkPageNotFound}
          className={`select-none  border-2 border-grey w-72 aspect-square object-cover rounded-md `}
          alt=""
        />
        <h1 className="text-4xl font-gelasio leading-[45px]">Page Not Found</h1>
        <p className="text-xl text-dark-grey leading-7 -mt-8">
          Page you are looking for does not exist go back to{" "}
          <Link to={"/"} className="text-blac underline">
            Home Page
          </Link>
        </p>
        <div className="mt-auto">
          <img
            src={fullLogo}
            className={`h-8 object-contain block mx-auto select-none ${theme !== 'light' ? "invert" : ""}`}
            alt=""
          />
          <p className="mt-5 text-dark-grey tracking-widest">
            Read-Write-Live Blogs
          </p>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PageNotFound;
