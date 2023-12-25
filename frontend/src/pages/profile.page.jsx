import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
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
  const [profile, setProfile] = useState(profileData);
  const [loading, setLoading] = useState(false);
  const fetchUserProfile = () => {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        setLoading(false);
        setProfile(user);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  useEffect(() => {
    resetStates();
    fetchUserProfile();
  }, [profileId]);
  const resetStates = () => {
    setProfile(profileData);
    setLoading(false);
  };
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
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center  gap-5 min-w-[250px]">
            <img
              src={profile_img}
              className="h-48 w-48 rounded-full bg-grey md:w-32 md:h-32"
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
        </section>
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
