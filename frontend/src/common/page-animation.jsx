import React, { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = forwardRef(
  (
    {
      children,
      initial = { opacity: 0 },
      animate = { opacity: 1 },
      transition = { duration: 1 },
      keyValue,
      className,
    },
    ref
  ) => {
    return (
      <AnimatePresence>
        <motion.div
          initial={initial}
          animate={animate}
          transition={transition}
          key={keyValue}
          className={className}
          ref={ref}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
);

export default AnimationWrapper;
