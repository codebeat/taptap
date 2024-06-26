import React from "react";
import { motion } from "framer-motion";
function Waitlist() {
  return (
    <div className="flex bg-black h-screen w-full  flex-col items-center justify-center px-4">
      <motion.h1
        className="font-sfSemi text-white text-6xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        Waitlist.
      </motion.h1>
      <motion.h1
        className=" text-white text-lg text-center mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        TapTap is currently accepting invites only. Apply for waitlist or ask a
        friend for invite.
      </motion.h1>
      <motion.div
        className=""
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <motion.button
          initial={{ "--x": "100%", scale: 1 }}
          animate={{ "--x": "-100%" }}
          whileTap={{ scale: 0.97 }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1,
            type: "spring",
            stiffness: 20,
            damping: 15,
            mass: 2,
            scale: {
              type: "spring",
              stiffness: 10,
              damping: 5,
              mass: 0.1,
            },
          }}
          className="px-6 py-2 rounded-md relative radial-gradient my-6"
        >
          <span className="text-white/85 text-xl tracking-wide  h-full w-full block relative linear-mask">
            Join Waitlist
          </span>
          <span className="block absolute inset-0 rounded-md p-px linear-overlay" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Waitlist;
