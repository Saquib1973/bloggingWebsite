import React from "react";
import { motion } from "framer-motion";
import Logo from "../imgs/full-logo.png";

const ShowLogo = () => {
  const color = ["bg-red/20", "bg-purple/20", "bg-twitter/20"];
  let bgColor = color[Math.floor(Math.random() * 3) + 1];
  return (
    <div className="flex items-center min-h-screen">
      {/* Black div */}
      <motion.div
        className={`fixed z-10 top-0 left-0 w-full h-full ${
          !bgColor ? "bg-dark-grey/20" : bgColor
        }`}
        initial={{ opacity: 0, y: 1200 }}
        animate={{ opacity: 0.5, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.5 }}
      />
      <motion.div
        className={`fixed z-10 top-0 left-0 w-full h-full ${
          !bgColor ? "bg-dark-grey/20" : bgColor
        }`}
        initial={{ opacity: 0, y: -1200 }}
        animate={{ opacity: 0.5, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.8, delay: 0.2 }}
      />
      <div className="w-full z-30 flex items-center justify-center  flex-col relative">
        <motion.img
          className="w-[30%] md:w-[20%] min-[1100px]:w-[10%]  m-auto"
          src={Logo}
          alt=""
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 100 }}
          transition={{ duration: 3 }}
        />
        <motion.p
          className=" absolute top-40 text-center text-sm text-dark-grey tracking-widest"
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 0.5, y: 10 }}
          transition={{ duration: 3 }}
        >
          Read-Write-Live Blogs
        </motion.p>
      </div>
    </div>
  );
};

export default ShowLogo;
