import React, { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
const BlogInteraction = () => {
  const location = useLocation();

  let {
    blog,
    blog: {
      title,
      blog_id,
      activity: { total_likes, total_comments },
      activity,
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    likeByUser,
    setLikeByUser,
  } = useContext(BlogContext);
  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);
  const handleLike = () => {
    if (access_token) {
      //like the blog
      setLikeByUser((prev) => !prev);
      !likeByUser ? total_likes++ : total_likes--;
      setBlog({ ...blog, activity: { ...activity, total_likes } });
    } else {
      //not logged in
      toast.error("Please login to like this blog");
    }
  };
  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-6 items-center">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              likeByUser ? "bg-red/40 text-red" : "bg-grey/80"
            } group transition-all`}
            onClick={handleLike}
          >
            <i
              className={`fi fi-${
                likeByUser ? "sr" : "rr"
              }-heart group-active:text-red transition-all duration-200`}
            ></i>
          </button>
          <p className="text-dark-grey text-xl">{total_likes}</p>
          <button className="w-10 h-10 rounded-full flex items-center bg-grey/80 justify-center">
            <i className="fi fi-rr-comment"></i>
          </button>
          <p className="text-dark-grey text-xl">{total_comments}</p>
        </div>
        <div className="flex gap-6 items-center">
          {username === author_username && (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=https://blogig.vercel.app${location.pathname}`}
            className="mt-1"
            target="_blank"
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter "></i>
          </Link>
          <i
            className="fi fi-rr-share text-xl cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://blogig.vercel.app${location.pathname}`
              );
              toast.success("Link Copied", {
                position: "bottom-center",
              });
            }}
          ></i>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
