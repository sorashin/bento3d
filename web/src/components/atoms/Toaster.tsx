import { useAtom } from "jotai";
import { gridAtoms, openAIAPIKeyAtom } from "../../store";
import { FC, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// define type
type ToastProps = {
    isOpen: boolean;
    value: string;
};

export const Toast:FC<ToastProps> = ({isOpen, value}) => {
    // create isShow flag with useMemo
        
      return(
        <AnimatePresence>
            {isOpen&&<motion.div 
                className="fixed flex justify-center inset-x-0 bottom-64"
                initial="hidden"
                exit="hidden"
                variants={{
                    show: { y: 0, opacity: 1 },
                    hidden: { y: 20, opacity: 0 },
                }}
                animate={isOpen ? "show" : "animate"}
                transition={{
                    type: "spring",
                    damping: 40,
                    stiffness: 400,
                }}
                >
                    <p
                        className="w-fit p-4 rounded-sm bg-content-light-a text-white text-lg font-semibold"
                    >{value}mm</p></motion.div>}
        </AnimatePresence>
      );
};
