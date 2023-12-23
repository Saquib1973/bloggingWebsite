import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPostCard from "../components/nobanner-blog-post.component";
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  let categories = [
    "programming",
    "jee",
    "religion",
    "youtube",
    "travel",
    "finance",
  ];
  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  const fetchLatestBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data: { blogs } }) => {
        setBlogs(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data: { blogs } }) => {
        setTrendingBlogs(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadBlogByCategory = () => {};
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          {/* Latest blogs */}
          <InPageNavigation
            routes={["home", "trending blog"]}
            defaultHidden={["trending blog"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, index) => (
                  <AnimationWrapper
                    key={index}
                    transition={{ delay: index * 0.25, duration: 1 }}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                ))
              )}
            </>
            <>
              {trendingBlogs === null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, index) => (
                  <AnimationWrapper
                    key={index}
                    transition={{ delay: index * 0.25, duration: 1 }}
                  >
                    <MinimalBlogPostCard blog={blog} index={index} />
                  </AnimationWrapper>
                ))
              )}
            </>
          </InPageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium mb-8 text-xl">
                Stories from all interests
              </h1>
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="tag"
                    onClick={loadBlogByCategory}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-sr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs.map((blog, index) => (
                <AnimationWrapper
                  key={index}
                  transition={{ delay: index * 0.25, duration: 1 }}
                >
                  <MinimalBlogPostCard blog={blog} index={index} />
                </AnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
