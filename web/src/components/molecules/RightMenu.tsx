import React, { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  ButtonElements,
  DLButtonElementsAtom,
  bomAtom,
  boxConfigAtom,
  isFeedbackDialogOpenAtom,
  isUpdatesDrawerOpenAtom,
} from "../../store";
import ReactGA from "react-ga4";
import { Icon } from "../atoms/Icon";
import updates from "../../assets/jsons/updates.json";
import { Tooltip } from "react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Ad } from "../atoms/Ad";

interface RightMenuProps {
  elements: ButtonElements[];
  children?: ReactNode;
  step: number;
}

export const RightMenu: React.FC<RightMenuProps> = ({
  elements,
  children,
  step,
}) => {
  const boxConfig = useAtomValue(boxConfigAtom);
  const [DLButtonElements, setDLButtonElements] = useAtom(DLButtonElementsAtom);
  const [bom, setBom] = useAtom(bomAtom);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useAtom(
    isFeedbackDialogOpenAtom,
  );
  const [isUpdatesDrawerOpen, setIsUpdatesDrawerOpen] = useAtom(
    isUpdatesDrawerOpenAtom,
  );
  const latestUpdate = updates.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
  const isNew =
    new Date().getTime() - new Date(latestUpdate.date).getTime() <=
    7 * 24 * 60 * 60 * 1000;

  const handleClick = (label: string) => {
    console.log("clicked!", label);
    ReactGA.event({
      category: "Download Button",
      action: `W:${boxConfig.totalWidth} H:${boxConfig.height} D:${boxConfig.totalDepth}`,
      label: label,
    });
  };

  return (
    <>
      <motion.div
        className={`absolute h-auto top-8 right-8 w-full md:w-[240px] py-2 z-20 bg-surface-sheet-l rounded-md backdrop-blur-sm flex flex-col gap-2 items-center justify-center`}
        layout
      >
        <motion.div
          className="flex flex-row justify-between w-full px-2"
          layout
        >
          <div className="flex flex-row">
            {/* <a
              href="https://buymeacoffee.com/lodgefabq"
              target="_blank"
              rel="noreferrer"
              className="b-button flex bg-transparent"
              data-tooltip-content={"Support us"}
              data-tooltip-id={"hint-tooltip"}
            >
              <Icon name="coffeeDark" className="size-5" />
            </a>
            <a
              href="https://buymeacoffee.com/lodgefabq"
              target="_blank"
              rel="noreferrer"
              className="b-button flex bg-transparent"
              data-tooltip-content={"Support us"}
              data-tooltip-id={"hint-tooltip"}
            >
              <Icon name="coffeeDark" className="size-5" />
            </a> */}
          </div>
          <div className="flex justify-end">
            <button
              className="b-button bg-transparent"
              onClick={() => setIsFeedbackDialogOpen(true)}
              data-tooltip-content={"Feedback"}
              data-tooltip-id={"hint-tooltip"}
            >
              💬
            </button>
            <button
              className="b-button bg-transparent relative"
              onClick={() => setIsUpdatesDrawerOpen(true)}
              data-tooltip-content={"Updates"}
              data-tooltip-id={"hint-tooltip"}
            >
              📣
              {isNew && (
                <span className="size-2 rounded-full bg-system-error-h absolute bottom-1.5 right-1.5 border-spacing-1 border-system-error-l"></span>
              )}
            </button>
            <a
              className="b-button bg-transparent"
              href="https://polar-tadpole-97b.notion.site/Bento3D-e40483712b304d389d7c2da26196e113?pvs=4"
              target="_blank"
              rel="noreferrer"
              data-tooltip-content={"Document"}
              data-tooltip-id={"hint-tooltip"}
            >
              📖
            </a>
          </div>
        </motion.div>
        {step === 2 && (
          <motion.div
            className="pt-2 border-t-[0.5px] border-content-xl-a"
            layout
          >
            <p className="w-full my-2 text-center text-xs text-content-m-a font-display">
              Download STLs
            </p>
            <div className="grid grid-cols-3 gap-1 w-full p-2 border-b-[0.5px] border-content-xl-a pb-4 mb-2">
              {elements.map((element, index) => (
                <div
                  key={index}
                  className={`p-1 flex flex-col gap-1 justify-between items-center w-full relative [&>div>div>span]:hidden [&>div>div>button]:absolute [&>div>div>button]:inset-0 [&>div>div>button]:rounded-sm [&>div>div>button]:text-[0px] [&>div>div>button]:bg-transparent [&>div>div>button]:hover:bg-surface-sheet-m [&>div>div>button]:transition ${index === 0 ? "col-span-3" : ""}`}
                  onClick={() => handleClick(element.label)}
                >
                  {/* <input type="checkbox" defaultChecked className="checkbox" onClick={()=>toggleVisible(index)}/> */}
                  <img
                    src={element.path}
                    alt=""
                    className={`object-contain rounded-sm z-10 pointer-events-none ${index === 0 ? "w-32" : "size-16"}`}
                  />
                  <span
                    className="flex items-center justify-center rounded-[6px] bg-content-h-a shadow-sm w-full transition py-1 text-white text-sm z-10 pointer-events-none"
                    onClick={() => handleClick(element.label)}
                  >
                    <Icon className="size-4 stroke-[1px]" name="download" />
                    {element.label}
                  </span>
                  {/* span + button */}
                  {element.jsx}
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col items-end px-2">
              <p className="flex flex-row items-center gap-1 text-sm relative group py-0.5 text-content-m w-fit">
                <a
                  href="https://polar-tadpole-97b.notion.site/Bento3D-e40483712b304d389d7c2da26196e113#9d32764885c746438fa229644e0149f9"
                  target="_blank"
                  rel="noreferrer"
                >
                  Assembly Tips
                </a>
                <Icon name="arrowUpRight" className="size-5" />
                <span className="absolute left-0 bottom-0 w-0 border-b-[1px] border-content-l group-hover:w-full transition-all"></span>
              </p>
              <p className="flex flex-row items-center gap-1 text-sm relative group py-0.5 mb-2 text-content-m w-fit">
                <a href="https://polar-tadpole-97b.notion.site/Bento3D-e40483712b304d389d7c2da26196e113#d826cb9d4d844200a0fbd5f7df783f14">
                  How to fix broken STLs
                </a>
                <Icon name="arrowUpRight" className="size-5" />
                <span className="absolute left-0 bottom-0 w-0 border-b-[1px] border-content-l group-hover:w-full transition-all"></span>
              </p>
            </div>
          </motion.div>
        )}
        <Ad />

        <Tooltip
          id="hint-tooltip"
          place="bottom"
          className="text-xs"
          style={{
            backgroundColor: "#1C1C1C",
            color: "#ffffff",
            fontSize: "12px",
            padding: "2px 4px 2px 4px",
            borderRadius: "4px",
            userSelect: "none",
          }}
          noArrow
        />
      </motion.div>

      {step === 2 && children}
    </>
  );
};
