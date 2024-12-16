import { AnimatePresence, motion, Variant, Variants } from "framer-motion";
import { useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface FlyingItemProps {
  children: ReactNode;
  animationImages: {
    id: number;
    isUserAvatar: boolean;
    randomPattern: Variant;
  }[];
  variants?: Variants;
  className?: string;
  anchorRef: React.RefObject<HTMLElement>;
  itemClassName?: string;
  size?: {
    width: number | string;
    height: number | string;
  };
}

const defaultVariants: Variants = {
  initial: { x: 0, y: 0, opacity: 0.7 },
  animate: {
    y: [0, -700],
    transition: {
      duration: 3,
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0 },
};

const defaultStyles = {
  container: {
    position: 'fixed',
    zIndex: 9999,
  } as const,
  item: {
    position: 'absolute',
    willChange: 'transform',
    transform: 'translateX(-50%)',
    backfaceVisibility: 'hidden',
    left: '50%',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  } as const,
  innerContainer: {
    position: 'relative',
    transform: 'translateZ(0)',
  } as const,
};

export const FlyingItem = ({
  children,
  animationImages,
  variants,
  className = "",
  itemClassName = "",
  anchorRef,
  size,
}: FlyingItemProps) => {
  const getAnchorPosition = useCallback(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      return {
        left: rect.left + rect.width / 2,
        top: rect.top,
      };
    }
    return {
      left: 0,
      top: 0,
    };
  }, [anchorRef]);

  return createPortal(
    <div
      className={`flyer-container ${className}`}
      style={{
        ...defaultStyles.container,
        ...getAnchorPosition(),
      }}
    >
      <AnimatePresence>
        {animationImages.map(({ id, randomPattern }) => (
          <motion.div
            key={id}
            className={`flyer-item ${itemClassName}`}
            style={{
              ...defaultStyles.item,
              ...(size && {
                width: size.width,
                height: size.height,
              }),
            }}
            variants={{
              ...defaultVariants,
              randomMovement: randomPattern,
              ...variants,
            }}
            initial="initial"
            animate={["animate", "randomMovement"]}
            exit="exit"
          >
            <div className="flyer-inner-container" style={defaultStyles.innerContainer}>
              {children}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
};