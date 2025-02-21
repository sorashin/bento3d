"use client";

import { useAtom } from "jotai";
import { AnimatePresence, animate, motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  className,
}: DrawerProps) => {
  // OUTSIDE_CLICK
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutSideClick = (event: { target: any }) => {
      if (!drawerRef.current?.contains(event.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [drawerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          initial="hidden"
          exit="hidden"
          variants={{
            show: { x: 0, opacity: 1 },
            hidden: { x: -60, opacity: 0 },
          }}
          animate={isOpen ? "show" : "animate"}
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 400,
          }}
          className={`fixed inset-0 z-20 left-0 flex h-full w-1/4 flex-col gap-4 lg:max-w-screen-sm ${className} backdrop-blur-md from-surface-base/80 to-surface-base/0 bg-gradient-to-r`}
        >
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/0 backdrop-blur-sm"> */}
          {children}
          {/* </div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
