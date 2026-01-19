import React, { useRef, createContext, useContext, useCallback } from "react"
import { motion, AnimatePresence, useSpring, useMotionTemplate, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const BorderGlideContext = createContext(undefined)

const useBorderGlideContext = () => {
  const context = useContext(BorderGlideContext)
  if (!context) {
    throw new Error("BorderGlide components must be used within BorderGlide")
  }
  return context
}

const MovingBorder = ({ children, duration = 3000, rx = "1.5rem", ry = "1.5rem", color = "#3b82f6", width = "12rem", height = "0.5rem", opacity = 0.8 }) => {
  const pathRef = useRef(null)
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  const time = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5
  })

  const animate = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current
    const speed = 1000 / duration
    time.set(elapsed * speed)
    animationRef.current = requestAnimationFrame(animate)
  }, [time, duration])

  React.useLayoutEffect(() => {
    startTimeRef.current = Date.now()
    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    };
  }, [animate])

  const progress = useTransform(time, (val) => {
    if (!pathRef.current) return 0
    const length = pathRef.current.getTotalLength()
    return (val % length)
  })

  const x = useTransform(progress, (val) => {
    if (!pathRef.current) return 0
    return pathRef.current.getPointAtLength(val).x;
  })

  const y = useTransform(progress, (val) => {
    if (!pathRef.current) return 0
    return pathRef.current.getPointAtLength(val).y;
  })

  const angle = useTransform(progress, (val) => {
    if (!pathRef.current) return 0
    const length = pathRef.current.getTotalLength()
    const p1 = pathRef.current.getPointAtLength(val)
    const p2 = pathRef.current.getPointAtLength((val + 1) % length)
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  })

  const transform = useMotionTemplate`
    translateX(${x}px) 
    translateY(${y}px) 
    translateX(-50%) 
    translateY(-50%) 
    rotate(${angle}deg)
  `

  const getBackgroundStyle = (color) => {
    if (color.includes('gradient') || color.includes('linear-gradient') || color.includes('radial-gradient') || color.includes('conic-gradient')) {
      return color
    }
    return `radial-gradient(${color} 40%, transparent 60%)`
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full pointer-events-none"
        style={{ willChange: "auto" }}>
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
          style={{ willChange: "auto" }} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform,
          willChange: "transform"
        }}>
        <div
          className="rounded-full"
          style={{
            height,
            width,
            opacity,
            background: getBackgroundStyle(color),
            borderRadius: "50%"
          }} />
      </motion.div>
    </>
  );
}

const BorderGlide = ({
  children,
  className,
  autoPlayInterval = 5000,
  borderDuration = 3000,
  borderColor = "#3b82f6",
  borderWidth = "6rem",
  borderHeight = "6rem",
  borderOpacity = 0.8,
}) => {
  const currentIndexRef = useRef(0)
  const directionRef = useRef(0)
  const autoPlayRef = useRef(null)
  const forceUpdateRef = useRef(0)
  const [, setForceUpdate] = React.useReducer((x) => x + 1, 0)

  const childrenArray = React.Children.toArray(children)
  const totalItems = childrenArray.length

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity

  const triggerUpdate = useCallback(() => {
    forceUpdateRef.current += 1
    setForceUpdate()
  }, [])

  const paginate = useCallback((newDirection) => {
    directionRef.current = newDirection
    if (newDirection === 1) {
      currentIndexRef.current = currentIndexRef.current === totalItems - 1 ? 0 : currentIndexRef.current + 1
    } else {
      currentIndexRef.current = currentIndexRef.current === 0 ? totalItems - 1 : currentIndexRef.current - 1
    }
    triggerUpdate()
  }, [totalItems, triggerUpdate])

  const handleDragEnd = useCallback((e, {
    offset,
    velocity
  }) => {
    const swipe = swipePower(offset.x, velocity.x)
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1)
    }
  }, [paginate])

  const setupAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    if (autoPlayInterval > 0 && totalItems > 1) {
      autoPlayRef.current = setInterval(() => {
        paginate(1)
      }, autoPlayInterval)
    }
  }, [autoPlayInterval, totalItems, paginate])

  React.useLayoutEffect(() => {
    setupAutoPlay()
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    };
  }, [setupAutoPlay])

  const contextValue = {
    currentIndex: currentIndexRef,
    direction: directionRef,
    handleDragEnd,
    totalItems,
    triggerUpdate,
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: "0%",
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    }),
  }

  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  }

  return (
    <BorderGlideContext.Provider value={contextValue}>
      <div className={cn("relative w-full", className)}>
        <div
          className="relative w-full h-full overflow-hidden rounded-xl bg-transparent p-[2px]">
          <div className="absolute inset-0 pointer-events-none">
            <MovingBorder
              duration={borderDuration}
              rx="0.75rem"
              ry="0.75rem"
              color={borderColor}
              width={borderWidth}
              height={borderHeight}
              opacity={borderOpacity}>
              <div />
            </MovingBorder>
          </div>
          <div
            className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-[#09090b] backdrop-blur-sm">
            <AnimatePresence initial={false} custom={directionRef.current} mode="wait">
              <motion.div
                key={currentIndexRef.current}
                custom={directionRef.current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform"
                style={{ willChange: "transform" }}>
                {childrenArray[currentIndexRef.current]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BorderGlideContext.Provider>
  );
}

const BorderGlideCard = ({
  children,
  className,
}) => {
  return (
    <Card
      className={cn(
        "bg-transparent border shadow-none text-foreground w-full h-full",
        className
      )}>
      {children}
    </Card>
  );
}

const BorderGlideContent = ({
  children,
  className,
}) => {
  return (
    <CardContent className={cn("p-0 w-full h-full", className)}>
      {children}
    </CardContent>
  );
}

const BorderGlideHeader = ({
  children,
  className,
}) => {
  return (
    <CardHeader className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </CardHeader>
  );
}

const BorderGlideFooter = ({
  children,
  className,
}) => {
  return (
    <CardFooter className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </CardFooter>
  );
}

const BorderGlideTitle = ({
  children,
  className,
}) => {
  return (
    <CardTitle className={cn("font-semibold leading-none tracking-tight", className)}>
      {children}
    </CardTitle>
  );
}

const BorderGlideDescription = ({
  children,
  className,
}) => {
  return (
    <CardDescription className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </CardDescription>
  );
}

export {
  BorderGlide,
  BorderGlideCard,
  BorderGlideContent,
  BorderGlideHeader,
  BorderGlideFooter,
  BorderGlideTitle,
  BorderGlideDescription
};