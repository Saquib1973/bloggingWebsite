import React from "react";
import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ bio, socialLinks, joinedAt, className }) => {
  return (
    <div className={`w-[90%] md:mt-7 ${className}`}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to Read here"}
      </p>
      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(socialLinks).map((social, index) => {
          let link = socialLinks[social];
          return link ? (
            <Link key={index} to={link} target="_blank">
              <i
                className={`fi ${
                  social !== "website" ? "fi-brands" : "fi-rr"
                }-${
                  social !== "website" ? social : "globe"
                } text-2xl hover:text-black transition-all`}
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>
      <p className="text-xl leading-7 text-dark-grey">
        Joined on {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
