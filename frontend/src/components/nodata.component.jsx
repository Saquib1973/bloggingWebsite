import React from "react";
import AnimationWrapper from "../common/page-animation";

const NoDataMessage = ({ message }) => {
  return (
    <AnimationWrapper className="text-center w-full p-4 py-8 rounded-md bg-grey/50 mt-4">
      <p className="">{message}</p>
    </AnimationWrapper>
  );
};

export default NoDataMessage;
