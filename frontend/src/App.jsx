import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import Help from "./pages/help.page";
import Home from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import Logo from "./imgs/full-logo.png"; // Import your logo component
import { motion } from "framer-motion";

export const UserContext = createContext({});

const App = () => {
  let { pathname } = useLocation();
  const [userAuth, setUserAuth] = useState({});
  const [showLogo, setShowLogo] = useState(true);
  useEffect(() => {
    let userInSession = lookInSession("user");
    setUserAuth(
      userInSession ? JSON.parse(userInSession) : { access_token: null }
    );
    if (pathname === "/") {
      const hideLogoTimeout = setTimeout(() => {
        setShowLogo(false);
      }, 4000);

      return () => clearTimeout(hideLogoTimeout);
    } else {
      setShowLogo(false);
    }
  }, [sessionStorage, pathname]);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {showLogo ? (
        <div className="flex items-center min-h-screen">
          {/* Black div */}
          <motion.div
            className="fixed z-10 top-0 left-0 w-full h-full bg-dark-grey/20"
            initial={{ opacity: 0, y: 1300 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.9 }}
          />
          <motion.div
            className="fixed z-20 top-0 left-0 w-full h-full bg-dark-grey/20"
            initial={{ opacity: 0, x: -1300 }}
            animate={{ opacity: 0.5, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.9, delay: 0.1 }}
          />
          <div className="w-full z-30 flex items-center justify-center  flex-col relative">
            <motion.img
              className="w-[30%] md:w-[20%] min-[1100px]:w-[10%]  m-auto"
              src={Logo}
              alt=""
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 100 }}
              transition={{ duration: 3 }}
            />
            <motion.p
              className=" absolute top-40 text-center text-sm text-dark-grey tracking-widest"
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 0.5, y: 10 }}
              transition={{ duration: 3 }}
            >
              Read-Write-Live Blogs
            </motion.p>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/" element={<Navbar showLogo={showLogo} />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<UserAuthForm type={"sign-in"} />} />
            <Route path="signup" element={<UserAuthForm type={"sign-up"} />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="help" element={<Help />} />
            <Route path="user/:id" element={<ProfilePage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      )}
    </UserContext.Provider>
  );
};

export default App;
