import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBT_d-YXlzt1M1E4__7t2mIoPAHzKLPQJ4",
  authDomain: "bloggingwebsite-saquib.firebaseapp.com",
  projectId: "bloggingwebsite-saquib",
  storageBucket: "bloggingwebsite-saquib.appspot.com",
  messagingSenderId: "440534119540",
  appId: "1:440534119540:web:0115785c57f9e531cb8d21",
  measurementId: "G-Q3N4D617DP",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => console.log(err));
  return user;
};
