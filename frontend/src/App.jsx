import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import Help from "./pages/help.page";
import Home from "./pages/home.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  useEffect(() => {
    let userInSession = lookInSession("user");
    // console.log("User in session:", userInSession);
    setUserAuth(
      userInSession ? JSON.parse(userInSession) : { access_token: null }
    );
  }, [sessionStorage]);
  // console.log("User in Auth:", userAuth);

  // console.log("userAuth @App.jsx", userAuth);
  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<UserAuthForm type={"sign-in"} />} />
          <Route path="signup" element={<UserAuthForm type={"sign-up"} />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
