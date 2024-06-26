
import { animate, useInView, useIsomorphicLayoutEffect } from "framer-motion";
import { useRef } from "react";

const AnimatedCounter = ({ from, to, animationOptions }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    // Set initial value
    element.textContent = String(from);

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 0.5,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = formatNumber(value.toFixed(0));
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, inView, from, to]);

  return <span ref={ref} />;
};

export default AnimatedCounter;
