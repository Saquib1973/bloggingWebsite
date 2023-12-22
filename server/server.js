import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import serviceAccountKey from "./serviceKey.json" assert { type: "json" };
import aws from "aws-sdk";
//Schema Imports
import User from "./Schema/User.js";
import { nanoid } from "nanoid";
import cors from "cors";
import { getAuth } from "firebase-admin/auth";
//Regex
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

let PORT = 3000;

const server = express();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
server.use(cors());
dotenv.config();
server.use(express.json());
//connect database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      autoIndex: true,
    });
    console.log("Db connection established");
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();

//setting up aws bucket
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "blogging-website-saquib",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg", // Update this line
  });
};
//REST APIs

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "no access token" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "access token is invalid" });
    }
    req.user = req.id;
    next();
  });
};

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token: access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

//upload image url
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

//Signup
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let usernameExist = await User.exists({
    "personal_info.username": username,
  });
  if (usernameExist) {
    username = username + nanoid().substring(0, 5);
  }
  return username;
};

server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;
  //validating the form
  if (fullname.length < 3)
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 characters long" });
  if (!email.length) return res.status(403).json({ error: "Enter email" });
  if (!emailRegex.test(email))
    return res.status(403).json({ error: "Email is not valid" });
  if (!passwordRegex.test(password))
    return res.status(403).json({
      error:
        "Password should be 6 to 12 character long with a numeric , 1 lowercase and 1 uppercase letter",
    });
  //hashing and creating user
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) return res.status(err).json({ error: err.message });
    const userExist = await User.findOne({ "personal_info.email": email });
    if (userExist)
      return res
        .status(400)
        .json({ error: "Email already in Use , Please Login" });
    let username = await generateUsername(email);
    let user = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(user));
      })
      .catch((err) => {
        if (err.code === 11000)
          return res.status(500).json({ error: "Email already exists" });
        return res.status(500).json({ error: err.message });
      });
    console.log(hashedPassword);
  });
});

server.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) return res.status(403).json({ error: "Email not found" });
      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err)
            return res.status(403).json({ error: "error occured while login" });
          if (!result)
            return res.status(403).json({ error: "Password mismatch" });
          else return res.status(200).json(formatDataToSend(user));
        });
      } else {
        return res.status(403).json({
          error:
            "A google account with this email already exists, Login using google auth",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;
  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      // picture = picture.replace("s96-c", "s384-c");
      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(404).json({ error: err.message });
        });
      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without google authentication , please login with password",
          });
        }
      } else {
        //signup
        let username = await generateUsername(email);
        user = new User({
          personal_info: {
            fullname: name,
            email,
            username,
          },
          google_auth: true,
        });
        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ err: err.message });
          });
      }
      return res.status(200).json(formatDataToSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        err: "Failed to authenticate you with google , try with some other google account",
      });
    });
});

server.post("/create-blog", verifyJwt, (req, res) => {
  return res.json(req.body);
});

//Listening backend
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
