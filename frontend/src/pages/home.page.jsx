import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPostCard from "../components/nobanner-blog-post.component";
import {
  activeTabLineRef,
  activeTabRef,
} from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataButton from "../components/load-more.component";
const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  let categories = [
    "programming",
    "jee",
    "religion",
    "youtube",
    "travel",
    "finance",
  ];
  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);
  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        console.log("data", data.blogs);
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data?.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchLatestBlogs = async ({ page = 1 }) => {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data?.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatedData);
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
  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          {/* Latest blogs */}
          <InPageNavigation
            routes={[pageState, "trending blog"]}
            defaultHidden={["trending blog"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : !blogs?.results.length || !blogs ? (
                <NoDataMessage message={"No Blogs Available"} />
              ) : (
                blogs.results.map((blog, index) => (
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
              <div className="flex justify-center py-2">
                <LoadMoreDataButton
                  state={blogs}
                  fetchData={
                    pageState === "home"
                      ? fetchLatestBlogs
                      : fetchBlogsByCategory
                  }
                />
              </div>
            </>
            <>
              {trendingBlogs === null ? (
                <Loader />
              ) : !trendingBlogs?.length ? (
                <NoDataMessage message={"No Trending Blogs"} />
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
                    className={`tag transition-all duration-500 ${
                      pageState === category ? "bg-black text-white" : ""
                    }`}
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
              {trendingBlogs === null ? (
                <Loader />
              ) : !trendingBlogs ? (
                <NoDataMessage message={"No Trending Blogs "} />
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
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
