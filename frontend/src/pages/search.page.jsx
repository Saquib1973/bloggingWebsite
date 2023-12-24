import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "./../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataButton from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);
  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { user } }) => {
        setUsers(user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  let searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data?.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);
  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };
  console.log(users);
  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for '${query}'`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
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
              <LoadMoreDataButton state={blogs} fetchData={searchBlogs} />
            </div>
          </>
          <UserCardWrapper users={users} />
        </InPageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 md:inline-block hidden">
        <h1 className="font-medium text-xl mb-8">
          User Related to '{query}'{" "}
          <i className="fi fi-rr-user text-xl mt-1"></i>
        </h1>
        <UserCardWrapper users={users} />
      </div>
    </section>
  );
};
const UserCardWrapper = ({ users }) => {
  return (
    <>
      {users === null ? (
        <Loader />
      ) : users?.length || users ? (
        users.map((user, index) => (
          <AnimationWrapper
            key={index}
            transition={{ delay: index * 0.08, duration: 1 }}
          >
            <UserCard user={user} />
          </AnimationWrapper>
        ))
      ) : (
        <NoDataMessage message={"No User Found"} />
      )}
    </>
  );
};

export default SearchPage;
