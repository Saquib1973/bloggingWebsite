import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
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
    fetchUserProfile();
  }, []);
  let {
    personal_info: { username: profile_username, fullname, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links: { joinedAt },
  } = profile;

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center  gap-5 min-w-[250px]">
            <img src={profile_img} alt="" />
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
