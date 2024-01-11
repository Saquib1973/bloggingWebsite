// #Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import serviceAccountKey from "./serviceKey.json" assert { type: "json" };
import aws from "aws-sdk";
import { getAuth } from "firebase-admin/auth";
import { nanoid } from "nanoid";
import cors from "cors";
//#Schema Imports
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import Notification from "./Schema/Notification.js"
import Comment from "./Schema/Comment.js"

//#Regex
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// #Constants
let PORT = 3000;

// #Initialization
const server = express();
server.use(cors());
dotenv.config();
server.use(express.json());
// Google auth initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
//setting up aws bucket
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
/*------------------------------------Functions------------------------------------- */
// function to generate a url on which image to be uploaded
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
// function to verify jwt token
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
    req.user = user.id;
    next();
  });
};
// function to hanlde formData to be sent
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
// function to handle username creation
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
/* --------------------------------------Routes------------------------------------ */
//route to upload image url
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});
//route to signup
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
  });
});
// route to signin
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
// route to signin or register using google auth
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
// route to create a blog
server.post("/create-blog", verifyJwt, (req, res) => {
  let authorId = req.user;
  let { title, description, banner, tags, content, draft, id } = req.body;
  // validations
  if (!title.length) {
    return res
      .status(403)
      .json({ error: "You must provide a title to publish a blog" });
  }
  if (!draft) {
    if (!description.length || description.length > 200) {
      return res.status(403).json({
        error: "You must provide a blog description under 200 character",
      });
    }
    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "You must provide a blog banner to publish a blog" });
    }
    if (!content.blocks.length) {
      return res.status(403).json({ error: "You must provide a blog content" });
    }
    if (!tags.length || tags.length > 10) {
      return res
        .status(403)
        .json({ error: "You must provide atmost 10 tags to publish a blog" });
    }
    tags = tags.map((tag) => tag.toLowerCase());
  }

  let blogId =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();
  if (id) {
    Blog.findOneAndUpdate(
      { blog_id: blogId },
      {
        title,
        description,
        banner,
        content,
        draft: Boolean(draft),
        tags,
      }
    )
      .then(() => {
        return res.status(200).json({
          id: blogId,
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: error });
      });
  } else {
    const blog = new Blog({
      title,
      description,
      banner,
      content,
      tags,
      author: authorId,
      blog_id: blogId,
      draft: Boolean(draft),
    });
    blog
      .save()
      .then((blog) => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        )
          .then((user) => {
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.message });
      });
  }
});
//  route to get all blogs
server.post("/latest-blogs", (req, res) => {
  let { page } = req.body;

  const maxLimit = 4;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img  personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title description banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// route to get trending blogs
server.get("/trending-blogs", (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img  personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to search blogs depending on factors like tag, query, page, author . Also we can set the limit on the blogs to be fetched
server.post("/search-blogs", (req, res) => {
  let { tag, query, page, author, limit, eliminate_blog } = req.body;
  let maxLimit = limit ? limit : 4;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if (author) {
    findQuery = { author, draft: false };
  }
  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img  personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title description banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to get the total count of the latest blogs
server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to get the count of the blogs searched based on the given parameters previously
server.post("/search-blogs-count", (req, res) => {
  let { tag, query, author } = req.body;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if (author) {
    findQuery = { author, draft: false };
  }
  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to get a searched user based on the search query provided by user , only limited data of user is brought as we dont need all informations
server.post("/search-users", (req, res) => {
  let { query } = req.body;
  User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(50)
    .select(
      "personal_info.username personal_info.fullname personal_info.profile_img -_id"
    )
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to get complete detail of a user based on his user id
server.post("/get-profile", (req, res) => {
  let { username } = req.body;
  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -blogs ")
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});
// Route to get a particular complete blog
server.post("/get-blog", (req, res) => {
  let { blog_id, draft, mode } = req.body;
  const inceremetVal = mode !== "edit" ? 1 : 0;
  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": inceremetVal } }
  )
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .select(
      "title description content banner activity publishedAt  blog_id tags"
    )
    .then((blog) => {
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": inceremetVal } }
      ).catch((err) => {
        return res.status(500).json({ error: err.message });
      });
      if (blog.draft && !draft) {
        return res.status(500).json({ error: "You can not access draft blog" });
      }
      return res.status(200).json({ blog });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
//Route to handle like of posts
server.post('/like-blog', verifyJwt, (req, res) => {
  let user_id = req.user;
  let { _id, likeByUser } = req.body;
  let incrementValue = !likeByUser ? 1 : -1;
  Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementValue } }).then(blog => {
    if (!likeByUser) {
      let like = new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id,
      })
      like.save().then(notification => {
        return res.status(200).json({
          liked_by_user: true
        })
      });
    } else {
      Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" }).then(data => {
        return res.status(200).json({
          liked_by_user: false
        })
      }).catch(err => {
        return res.status(500).json({
          error: err.message
        })
      })
    }
  })
})

server.post('/isLikedByUser', verifyJwt, (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;
  Notification.exists({ user: user_id, type: 'like', blog: _id }).then(result => {
    return res.status(200).json(
      { result }
    )
  }).catch(err => {
    return res.status(500).json({ error: err.message })
  })
})

server.post('/add-comment', verifyJwt, (req, res) => {
  let user_id = req.user;
  let { _id, comment, blog_author } = req.body
  console.log(comment)
  if (!comment.length) return res.status(403).json({ error: 'Write something to leave a comment' })
  // Creating a comment doc
  let commentObj = new Comment({ blog_id: _id, blog_author, comment, commented_by: user_id })
  commentObj.save().then(commentFile => {
    let { comment, commentedAt, children } = commentFile;
    Blog.findOneAndUpdate({ _id }, { $push: { "comments": commentFile._id }, $inc: { "activity.total_comments": 1 } }, { "activity.total_parents_comments": 1 }).then(blog => {
      console.log('New Comment created')
    }).catch(err => {
      console.log(err)

      return res.status(500).json({ error: err.message })
    });
    let notificationObj = {
      type: "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id
    }
    new Notification(notificationObj).save().then(notification => {
      console.log('Notification created')
    }).catch(err => {
      return res.status(500).json({ error: err.message })
    });
    return res.status(200).json({ comment, commentedAt, _id: commentFile._id, user_id, children })
  }).catch(err => {
    console.log(err)
    return res.status(500).json({ error: err.message })
  })


})
server.post('/get-blog-comments', (req, res) => {
  let { blog_id, skip } = req.body
  let maxLimit = 5;
  Comment.find({ blog_id, isReply: false }).populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img").skip(skip).limit(maxLimit).sort({
    'commentedAt': -1
  }).then(comment => {
    return res.status(200).json(comment)
  }).catch(err => {
    return res.status(500).json({ error: err.message })
  })
})

/* -------------------------------Database connection-------------------------------- */
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
// Health check endpoint
server.get("/health", (req, res) => {
  res.status(200).send("OK");
});
// Error handling for unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the error appropriately
});
// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  // Perform cleanup tasks and close connections
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});
// Listening backend
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
