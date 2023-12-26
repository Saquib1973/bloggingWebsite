import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "./../common/date";
import BlogInteraction from "../components/blog-interaction.component";
export const blogStructure = {
  title: "",
  description: "",
  content: [],
  tags: [],
  author: {
    personal_info: {},
  },
  banner: "",
  publishedAt: "",
};

const BlogPage = () => {
  let { id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;
  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id: id })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  console.log(blog);
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <img
            src={banner}
            className="aspect-video rounded-md bg-grey"
            alt=""
          />
          <div className="mt-12">
            <h2>{title}</h2>
            <div className="flex max-sm:flex-col group justify-between my-8 bg-grey/40 p-4 py-8 rounded-md ">
              <div className="flex  gap-5 items-start">
                <img
                  src={profile_img}
                  className="w-12 h-12 rounded-full p-0.5 group-hover:bg-red/80 transition-all duration-500"
                  alt=""
                />
                <p className="capitalize">
                  {fullname}
                  <br />@
                  <Link
                    to={`/user/${author_username}`}
                    className="underline underline-offset-2 lowercase"
                  >
                    {author_username}
                  </Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published On : {getDay(publishedAt)}
              </p>
            </div>
          </div>
          <BlogInteraction />
        </div>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
