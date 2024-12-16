import { Variant } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export type FlyingDirection = "left" | "right" | "center";

type FlyingOptions = {
  direction?: FlyingDirection;
};

export const useFlyingItem = ({ direction }: FlyingOptions = {}) => {
  const [animationImages, setAnimationImages] = useState<
    { id: number; isUserAvatar: boolean; randomPattern: Variant }[]
  >([]);
  const nextIdRef = useRef(0);
  const clickCountRef = useRef(0);

  const createRandomMovement = useCallback(() => {
    const getRandomX = () => Math.random() * 20;
    const getFinalX = () => {
      switch (direction) {
        case "left":
          return -50 - Math.random() * 50; 
        case "right":
          return 50 + Math.random() * 50;
        default:
          return 0;
      }
    };

    const movementCount = Math.floor(Math.random() * 3) + 1;

    const xMovements = [0];
    for (let i = 0; i < movementCount; i++) {
      xMovements.push(i % 2 === 0 ? getRandomX() : -getRandomX());
    }
    xMovements.push(getFinalX()); 

    const times = [0];
    for (let i = 1; i < movementCount + 1; i++) {
      times.push(Number((i / (movementCount + 1)).toFixed(2)));
    }
    times.push(1);

    return {
      x: xMovements,
      transition: {
        duration: 1,
        times: times,
        ease: "linear",
      },
    };
  }, [direction]);

  const onFly = useCallback(() => {
    const newId = nextIdRef.current++;
    clickCountRef.current++;
    const isUserAvatar = clickCountRef.current % 5 === 0;
    const randomPattern = createRandomMovement();

    setAnimationImages(prev => [
      ...prev,
      {
        id: newId,
        isUserAvatar,
        randomPattern,
      },
    ]);

    setTimeout(() => {
      setAnimationImages(prev => prev.filter(item => item.id !== newId));
    }, 1000);
  }, [createRandomMovement]);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    return () => clearTimeout(resetTimer);
  }, []);

  return {
    onFly,
    animationImages,
  };
};
