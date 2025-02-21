import { useAtom } from "jotai";
import {
  boxConfigAtom,
  isFeedbackDialogOpenAtom,
  isSettingDialogOpenAtom,
  isUpdatesDrawerOpenAtom,
} from "../../store";
import { useEffect, useState } from "react";
import { Icon, IconName } from "../atoms/Icon";
import { Tooltip } from "react-tooltip";

const modes = [
  {
    label: "Tray",
    img: "bentoPartition",
    sampleImg: ["/images/trays/000.jpg", "/images/trays/004.jpg"],
  },
  {
    label: "Tray & Box",
    img: "bentoBox",
    sampleImg: [
      "/images/cases/000.jpg",
      "/images/cases/001.jpg",
      "/images/cases/002.jpg",
    ],
  },
];

export const LeftMenu = () => {
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);

  const [currentMode, setCurrentMode] = useState(1);
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useAtom(
    isSettingDialogOpenAtom,
  );
  useEffect(() => {
    setBoxConfig({
      ...boxConfig,
      isOuterCase: currentMode === 1 ? true : false,
    });
  }, [currentMode]);
  return (
    <div className="absolute top-8 left-8 z-20 w-64 flex gap-2 items-center">
      {/* <h1 className="flex gap-1 items-center">
          <span className="-indent-96 absolute">Bento3d</span>
          <img src="/logo.svg" alt="bento3d" className="w-32 h-auto" />
        </h1> */}

      <button className="b-button bg-transparent flex flex-row items-center gap-2 min-w-[180px] hover:bg-[rgba(255,255,255,.56)] px-4 b-dropdown group border-[1px] border-content-l-a">
        <Icon
          name={modes[currentMode].img as IconName}
          className="w-8 h-8 stroke-[4px] stroke-content-m"
        />
        <p className="flex-grow text-left font-semibold text-content-h-a">
          {modes[currentMode].label}
        </p>

        <Icon
          name="chevronDown"
          className="size-4 text-content-m group-hover:translate-y-0.5 transition-all"
        />
        <div className="b-dropdown-contents left-0 top-[calc(100%+8px)] origin-[20%_0%] bg-surface-base shadow-lg rounded-sm p-2">
          <ul className="flex flex-row gap-2">
            {modes.map((mode, index) => (
              <li
                key={index}
                className="flex flex-col items-center gap-2 w-[240px] hover:bg-[rgba(255,255,255,.72)] group child-group p-2 rounded-[6px]"
                onClick={() => setCurrentMode(index)}
              >
                <p className="w-full text-left text-lg mb-4 ml-2 mt-2 font-semibold text-content-h-a">
                  {mode.label}
                </p>
                <Icon
                  name={mode.img as IconName}
                  className="size-2/3 stroke-[2px] stroke-content-m mb-4"
                />
                <div className="grid grid-cols-3 gap-1 w-full">
                  {mode.sampleImg.map((img, index) => (
                    <img
                      src={img}
                      className="size-full rounded-sm filter saturate-60 opacity-80 mix-blend-multiply child-group-hover:saturate-100 child-group-hover:opacity-100"
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </button>
      <button
        className="b-button bg-transparent"
        onClick={() => setIsSettingDialogOpen(true)}
        data-tooltip-content={"setting"}
        data-tooltip-id={"setting-tooltip"}
      >
        <Icon name="config" className="w-4 h-4 text-content-m-a"></Icon>
      </button>
      <Tooltip
        id="setting-tooltip"
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
    </div>
  );
};
