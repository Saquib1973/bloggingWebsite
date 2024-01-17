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
import ShowLogo from "./components/show-logo.component";
import BlogPage from "./pages/blog.page";
import LoginPage from "./pages/login.page";
import SignUp from "./pages/signUp.page";
import { Dev } from "./pages/dev.page";
import SideNav from "./components/sidenavbar.component";

export const UserContext = createContext({});
export const ThemeContext = createContext({});
const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark").matches;


export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const App = () => {
  // themeInSession ? themeInSession : "light"
  let { pathname } = useLocation();
  const [userAuth, setUserAuth] = useState({});
  let themeInSession = lookInSession("theme");
  const [theme, setTheme] = useState(() => themeInSession ? themeInSession : darkThemePreference() ? "dark" : 'light')
  const [showLogo, setShowLogo] = useState(true);
  useEffect(() => {
    let userInSession = lookInSession("user");
    setUserAuth(
      userInSession ? JSON.parse(userInSession) : { access_token: null }
    );

  }, [sessionStorage]);
  useEffect(() => {


    if (themeInSession) {
      setTheme(themeInSession);
      document.body.setAttribute('data-theme', theme);

    } else {

      document.body.setAttribute('data-theme', theme);
    }
  }, [])

  useEffect(() => {
    if (pathname === "/") {
      const hideLogoTimeout = setTimeout(() => {
        setShowLogo(false);
      }, 4000);

      return () => clearTimeout(hideLogoTimeout);
    } else {
      setShowLogo(false);
    }
  }, [pathname]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }} >

      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        {showLogo ? (
          <ShowLogo />
        ) : (
          <Routes>

            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:blog_id" element={<Editor />} />
            <Route path="/" element={<Navbar showLogo={showLogo} />}>
              <Route index element={<Home />} />
              <Route path="/settings" element={<SideNav />}>
                <Route path="edit-profile" element={<h1>Edit Profile Page</h1>} />
                <Route path="change-password" element={<h1>Change Password Page</h1>} />
              </Route>
              {/* <Route path="signin" element={<UserAuthForm type={"sign-in"} />} /> */}
              {/* <Route path="signup" element={<UserAuthForm type={"sign-up"} />} /> */}
              <Route path="auth/signin" element={<LoginPage />} />
              <Route path="auth/signup" element={<SignUp />} />
              <Route path="search/:query" element={<SearchPage />} />
              <Route path="help" element={<Help />} />
              <Route path="user/:id" element={<ProfilePage />} />
              <Route path="blogs/:id" element={<BlogPage />} />
              <Route path="dev" element={<Dev />} />

              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        )}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
