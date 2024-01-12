import React from "react";
import { motion } from "framer-motion";

const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
};

const Background = ({ where, height = "h-full" }) => {
    return (
        <div className={`absolute left-0 top-0 ${height} w-full dark:bg-black bg-white  dark:bg-dot-white bg-dot-purple -z-10 flex items-center justify-center`}>
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(circle_at_center,transparent_10%,black)]"></div>
        </div>
    );
}

export default Background;
