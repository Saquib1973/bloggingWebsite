import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "./../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "./../components/blog-post.component";
import toast, { Toaster } from "react-hot-toast";
import { scrollToTop } from "../App";
import { motion, useScroll, useSpring } from "framer-motion";
import BlogContent from "../components/blog-content.component";

export const blogStructure = {
  title: "",
  description: "",
  content: [],
  tags: [],
  activity: {},
  author: {
    personal_info: {},
  },
  banner: "",
  publishedAt: "",
};
export const BlogContext = createContext({});

const BlogPage = () => {
  let { id: blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeByUser, setLikeByUser] = useState(false);

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
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(async ({ data: { blog } }) => {
        await axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog?.tags[0],
            limit: 2,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data?.blogs);
          })
          .catch(
            ({
              response: {
                data: { error },
              },
            }) => {
              console.log(error);
            }
          );
        setBlog(blog);
        setLoading(false);
      })
      .catch(
        ({
          response: {
            data: { error },
          },
        }) => {
          setLoading(false);
          toast.error(
            error.includes("Cannot read properties")
              ? "Invalid url"
              : "Something went wrong"
          );
          console.log(error);
        }
      );
  };
  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  };
  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  return (
    <AnimationWrapper>
      <Toaster />
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ blog, setBlog, likeByUser, setLikeByUser }}
        >
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <motion.div
              className=" top-[80px] left-0 right-0 fixed h-1 bg-red/80 origin-left"
              style={{ scaleX }}
            />
            <img
              src={banner}
              className="aspect-video rounded-md bg-grey"
              alt=""
            />
            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex max-sm:flex-col group justify-between my-8 bg-grey/40 p-4 py-8 pt-10 rounded-xl ">
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
                      onClick={scrollToTop}
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
            {/* Blog Content */}
            <div className="my-12 font-gelasio blog-page-content">
              {content[0]?.blocks.map((block, index) => {
                return (
                  <div key={index} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>
            <BlogInteraction />
            {similarBlogs !== null && similarBlogs.length && (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, index) => {
                  let {
                    author: { personal_info },
                  } = blog;
                  return (
                    <AnimationWrapper
                      key={index}
                      transition={{ duration: 1, delay: index * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
