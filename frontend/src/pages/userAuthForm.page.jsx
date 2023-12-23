import React, { useContext, useEffect, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";
const UserAuthForm = ({ type }) => {
  // Context
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  // UseRef
  let authForm = useRef();

  // Server call out function
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then((response) => {
        const data = response.data;
        if (data) {
          storeInSession("user", JSON.stringify(data));
          setUserAuth(data);
        } else {
          toast.error("Unexpected server response. Please try again.");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      });
  };

  // Handle form submit for registration or login of a user
  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { fullname, email, password } = formData;
    // Frontend validations
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (fullname) {
      if (fullname?.length < 3)
        return toast.error("Fullname must be at least 3 characters long");
    }
    if (!email?.length) return toast.error("Enter email address");
    if (!emailRegex.test(email)) return toast.error("Email is not valid");
    if (!passwordRegex.test(password) && type !== "sign-in")
      return toast.error(
        "Password should be 6 to 12 character long with a numeric , 1 lowercase and 1 uppercase letter"
      );
    userAuthThroughServer(serverRoute, formData);
  };
  // Hanlde Google auth registration and login
  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user && user.accessToken ? user.accessToken : "",
        };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Trouble with google auth");
        return console.log(err);
      });
  };
  return access_token ? (
    <Navigate to={"/"} />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} action="" className="w-[80%] group max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>
          {type !== "sign-in" && (
            <InputBox
              name={"fullname"}
              type="text"
              placeholder="Full Name"
              icon={"fi-rr-user"}
            />
          )}
          <InputBox
            name={"email"}
            type="email"
            placeholder="Email"
            icon={"fi-rr-envelope"}
          />
          <InputBox
            name={"password"}
            type="password"
            placeholder="Password"
            icon={"fi-rr-key"}
          />
          <button
            className="btn-dark center mt-10"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="p-2 px-4 rounded-md w-auto bg-red/75 text-center tracking-tight sm:tracking-wider font-extralight text-white mt-5 mx-10">
            It's recommended to{" "}
            <Link
              className="underline underline-offset-2 italic"
              to={"/signup"}
            >
              Register
            </Link>
            {" or "}
            <Link
              className="underline underline-offset-2 italic"
              to={"/signin"}
            >
              Login
            </Link>{" "}
            {"with your google account.  "}
            <Link to={"/help"} className="underline">
              Help?
            </Link>
          </div>
          <i className="mt-7 animate-bounce fi fi-sr-down flex items-center justify-center text-2xl "></i>
          <div className="w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            or
            <hr className="w-1/2 border-black" />
          </div>
          <button
            className="btn-dark flex items-center gap-4 w-auto sm:w-[90%] justify-center center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" alt="google image" />
            Continue with google
          </button>
          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have and account ?
              <Link
                to={"/signup"}
                className="underline text-black text-xl ml-1"
              >
                Join us today.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have and account ?
              <Link
                to={"/signin"}
                className="underline text-black text-xl ml-1"
              >
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
