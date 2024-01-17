import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataButton from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import PageNotFound from "./404.page";
export const profileData = {
  personal_info: {
    fullname: "",
    email: "",
    username: "",
    bio: "",
    profile_img: "",
  },
  social_links: {
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    github: "",
    website: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  _id: "",
  joinedAt: "",
};
const ProfilePage = () => {
  let {
    userAuth: { username },
  } = useContext(UserContext);
  let { id: profileId } = useParams();
  const [profileLoaded, setProfileLoaded] = useState("");
  const [profile, setProfile] = useState(profileData);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState(null);
  const fetchBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs?.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
        formatedData.user_id = user_id;
        setBlogs(formatedData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const fetchUserProfile = () => {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user !== null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        fetchBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const resetStates = () => {
    setProfile(profileData);
    setBlogs(null);
    setLoading(false);
  };
  useEffect(() => {
    if (profileLoaded !== profileId) {
      setBlogs(null);
    }
    if (blogs === null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);
  let {
    personal_info: { username: profile_username, fullname, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="h-full group flex flex-col max-md:items-center  gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:border-grey md:sticky md:top[100px] md:py-10">
            <img
              src={profile_img}
              className="h-48 w-48 rounded-full md:w-32 md:h-32 p-2 bg-grey transition-all duration-500 group-hover:bg-red/80"
              alt=""
            />
            <h1 className="text-dark-grey text-2xl font-medium">
              @{profile_username}
            </h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} blogs -{" "}
              {total_reads.toLocaleString()} reads
            </p>
            <div className="flex gap-4 mt-2">
              {profileId === username && (
                <Link
                  to={"/settings/edit-profile"}
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              )}
            </div>
            <AboutUser
              bio={bio}
              joinedAt={joinedAt}
              className={"max-md:hidden"}
              socialLinks={social_links}
            />
          </div>
          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["blogs published", "about"]}
              defaultHidden={["about"]}
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
                  <LoadMoreDataButton state={blogs} fetchData={fetchBlogs} />
                </div>
              </>
              <>
                <AboutUser
                  bio={bio}
                  socialLinks={social_links}
                  joinedAt={joinedAt}
                />
              </>
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
