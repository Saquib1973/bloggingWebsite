import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPostCard = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;
  return (
    <Link
      to={`/blogs/${id}`}
      className={`flex gap-5 mb-4 hover:drop-shadow-md group`}
    >
      <h1 className="blog-index group-hover:text-black transition-all duration-500">
        {index < 10 ? "0" + (index + 1) : index}
      </h1>
      <div>
        <div className="flex gap-2 items-center mb-7 text-dark-grey  ">
          <img
            src={profile_img}
            className="w-6 h-6 rounded-full p-0.5 group-hover:bg-red transition-all duration-500"
            alt=""
          />
          <p className="line-clamp-1 group-hover:text-black">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPostCard;
