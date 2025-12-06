"use client";

import React, { useId } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/shared/utils";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = React.useState(false);

  React.useEffect(() => {
    setInit(true);
  }, []);

  const controls = useAnimation();

  const particles = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < (particleDensity || 100); i++) {
        list.push({
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            size: Math.random() * ((maxSize || 5) - (minSize || 1)) + (minSize || 1),
            duration: Math.random() * 20 + (speed || 50),
            delay: Math.random() * 5,
        });
    }
    return list;
  }, [maxSize, minSize, particleDensity, speed]);

  if (init) {
    return (
      <div className={cn("absolute inset-0 mask-image:radial-gradient(300px_circle_at_center,white,transparent)", className)}>
        {particles.map((particle, idx) => (
            <motion.span
                key={idx}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                }}
                transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                }}
                style={{
                    position: "absolute",
                    top: particle.y,
                    left: particle.x,
                    width: particle.size,
                    height: particle.size,
                    borderRadius: "50%",
                    backgroundColor: particleColor || "#FFFFFF",
                }}
            />
        ))}
      </div>
    );
  }
  return <></>;
};
