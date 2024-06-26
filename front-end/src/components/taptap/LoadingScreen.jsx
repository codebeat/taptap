import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LoadingScreen({ isloaded, reURL='' }) {
  const words = ["Our", "Robo", "is", "waking", "up...."];
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();

  const duration = 100;

  const startAnimation = useCallback(() => {
    const word = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating)
      setTimeout(() => {
        startAnimation();
      }, duration);
  }, [isAnimating, duration, startAnimation]);

  useEffect(() => {
    setTimeout(() => {


     if(reURL!='') navigate(reURL);
    }, 2000);
  }, [navigate, reURL]);

  if (isloaded) {
    return (
      <div className="flex bg-black h-screen w-full flex-col items-center justify-center">
        <AnimatePresence
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration
              : 0.1,
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            exit={{
              opacity: 0,
              y: -40,
              x: 40,
              filter: "blur(8px)",
              scale: 2,
              position: "absolute",
            }}
            className={
              "z-10 inline-block relative text-left text-[#0FF378] text-4xl font-sfSemi px-2"
            }
            key={currentWord}
          >
            {currentWord.split("").map((letter, index) => (
              <motion.span
                key={currentWord + index}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  } else {
    return null;
  }
}

export default LoadingScreen;
