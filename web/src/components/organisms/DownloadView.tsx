import React, { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  ButtonElements,
  DLButtonElementsAtom,
  bomAtom,
  boxConfigAtom,
  cameraModeAtom,
  showCaseAtom,
} from "../../store";
import ReactGA from "react-ga4";
import { Icon } from "../atoms/Icon";

interface DownloadViewProps {
  elements: ButtonElements[];
  children?: ReactNode;
}

export const DownloadView: React.FC<DownloadViewProps> = ({
  elements,
  children,
}) => {
  const boxConfig = useAtomValue(boxConfigAtom);
  const [DLButtonElements, setDLButtonElements] = useAtom(DLButtonElementsAtom);
  const [bom, setBom] = useAtom(bomAtom);
  const [isShow, setIsShow] = useState(true);
  const [isShowCase, setIsShowCase] = useAtom(showCaseAtom);
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
      {/* <div className='absolute inset-y-0 left-0 w-2/3'>
      {boxConfig.viewMode===2&&<input type="range" min={0} max={100} step={1}
        className='range w-32 z-10 absolute left-1/2 bottom-16 -translate-x-1/2'
        onChange={(e) => {
          // update bomAtom with new value
          setBom(parseInt(e.target.value));
        }}
      />
      }
      </div> */}
      <div
        className={`absolute lg:inset-y-0 h-auto bottom-8 right-0 w-full lg:w-1/2 flex flex-col justify-center lg:px-16 px-8 z-10 ${isShow ? "" : "opacity-0"}`}
      >
        <div className="flex flex-col items-center justify-center w-full h-fit rounded-lg bg-surface-sheet pt-4 px-4 pb-8 shadow-lg">
          <p className="w-full mb-4 py-2 text-center text-xs text-white bg-surface-ev1 rounded-sm">
            Download STLs
          </p>
          <div className="grid grid-cols-2 w-full">
            {elements.map((element, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full relative px-4 py-2 [&>div>div>span]:hidden [&>div>div>button]:absolute [&>div>div>button]:inset-0 [&>div>div>button]:rounded-sm [&>div>div>button]:text-[0px] [&>div>div>button]:bg-transparent [&>div>div>button]:hover:bg-content-xl-a [&>div>div>button]:transition"
                onClick={() => handleClick(element.label)}
              >
                {/* <input type="checkbox" defaultChecked className="checkbox" onClick={()=>toggleVisible(index)}/> */}
                <img
                  src={element.path}
                  alt=""
                  className="lg:w-12 lg:h-12 w-8 h-8 object-contain rounded-sm bg-content-xl"
                />
                <p className="grow ml-2 lg:text-base text-sm">
                  {element.label}
                </p>

                <span
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-content-h-a shadow-sm transition hover:scale-[0.98]"
                  onClick={() => handleClick(element.label)}
                >
                  <Icon className="w-6 h-6" name="download" />
                </span>
                {/* span + button */}
                {element.jsx}
              </div>
            ))}
          </div>

          {isShowCase && (
            <div className="flex flex-row gap-4 w-full mb-4 p-2 text-xs text-content-m-a rounded-md bg-surface-base items-start font-sans mt-4">
              <img
                src="/images/assembly.jpg"
                className="w-24 h-auto rounded-sm"
              />
              <div>
                <p>
                  For outer box assembly, you will need <br />
                  two{" "}
                  <a
                    href="https://amzn.to/412P6zk"
                    target="_blank"
                    className="hover:text-content-h underline"
                    rel="noreferrer"
                  >
                    Parallel Pins M2 × 28mm
                  </a>{" "}
                  and <br />
                  two{" "}
                  <a
                    href="https://amzn.to/3XfHg3d"
                    target="_blank"
                    className="underline hover:text-content-h"
                    rel="noreferrer"
                  >
                    M2 × 30mm bolts
                  </a>
                </p>
                <br />
                <p>
                  The print samples use{" "}
                  <a
                    href="https://amzn.to/3CD0ZTh"
                    target="_blank"
                    className="hover:text-content-h underline"
                    rel="noreferrer"
                  >
                    OVERTURE PLA Matt filament
                  </a>
                </p>
                <br />
                <p>
                  When STLs are broken, <br />
                  repair them on free online tool such as{" "}
                  <a
                    href="https://www.formware.co/onlinestlrepair"
                    className="hover:text-content-h underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FormWare
                  </a>
                </p>
              </div>
            </div>
          )}
          <a
            href="https://buymeacoffee.com/lodgefabq"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row gap-2 w-fit mt-8 px-4 py-2 rounded-sm bg-content-xl-a text-content-middle font-sans transition hover:scale-[0.98]"
          >
            <Icon name="coffeeDark" className="size-6" />
            Donate
          </a>
          <p className="mt-4 font-sans text-xs text-content-l">
            Created by{" "}
            <a
              href="https://twitter.com/52shinNaka"
              target="_blank"
              className="transition hover:scale-[0.98]"
              rel="noreferrer"
            >
              @52shinNaka
            </a>
          </p>
        </div>
      </div>
      {children}
    </>
  );
};
