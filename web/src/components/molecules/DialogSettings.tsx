import { UINodeBase } from "@nodi/core";
import { Dialog } from "../atoms/Dialog";
import { useAtom } from "jotai";
import {
  boxConfigAtom,
  isSettingDialogOpenAtom,
  updateIsStackAtom,
} from "../../store";
import { FC } from "react";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { Tooltip } from "react-tooltip";
import { Icon } from "../atoms/Icon";

interface DialogSettingsProps {}

export const DialogSettings: FC<DialogSettingsProps> = ({}) => {
  //get login dialog atom

  const [isOpen, setIsOpen] = useAtom(isSettingDialogOpenAtom);
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);
  const [showCase, setShowCase] = useAtom(updateIsStackAtom);

  const updateThickness = (thickness: number) => {
    if (thickness < 0) return;
    setBoxConfig({
      ...boxConfig,
      partitionThickness: Math.round(thickness * 10) / 10,
    });
  };
  const toggleStack = () => {
    setBoxConfig({ ...boxConfig, isStack: !boxConfig.isStack });
  };
  return (
    <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex flex-col gap-4 px-8 py-8 font-display">
        <h3 className="mb-4 text-lg text-center">Settings</h3>
        <div className="flex items-center justify-between">
          <p className="flex gap-2 items-center text-sm text-content-h">
            <Icon className="w-6 h-6" name="thickness" />
            Thickness
          </p>
          <div className="flex items-center gap-4">
            <PrimaryButton
              onClick={() =>
                updateThickness(boxConfig.partitionThickness - 0.1)
              }
              width={40}
              height={40}
              bgColor={"rgba(0,0,0,.08)"}
            >
              -
            </PrimaryButton>
            <input
              value={boxConfig.partitionThickness}
              className="w-32 h-fill p-2 bg-content-xl-a rounded-sm"
            ></input>
            <PrimaryButton
              onClick={() =>
                updateThickness(boxConfig.partitionThickness + 0.1)
              }
              width={40}
              height={40}
              bgColor={"rgba(0,0,0,.08)"}
            >
              +
            </PrimaryButton>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex gap-2 items-center text-sm text-content-h">
            <Icon className="w-6 h-6" name="caseIcon" />
            Case Preview
          </p>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className={`toggle h-10 w-16 rounded-sm bg-white border-content-middle ${showCase ? "[--tglbg:#333333] hover:[--tglbg:#666666]" : "[--tglbg:#eeeeee] hover:[--tglbg:#dddddd]"}`}
              checked={boxConfig.isOuterCase}
              onClick={() =>
                setShowCase({
                  ...boxConfig,
                  isOuterCase: !boxConfig.isOuterCase,
                })
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex gap-2 items-center text-sm text-content-h">
            <Icon className="w-6 h-6" name="stack" />
            Stackable
          </p>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className={`toggle h-10 w-16 rounded-sm bg-white border-content-middle ${boxConfig.isStack ? "[--tglbg:#333333] hover:[--tglbg:#666666]" : "[--tglbg:#eeeeee] hover:[--tglbg:#dddddd]"} font-sans`}
              checked={boxConfig.isStack}
              onClick={() => toggleStack()}
              disabled={boxConfig.isOuterCase}
              data-tooltip-id={showCase ? "hint-tooltip" : ""}
              data-tooltip-content={
                "stacking is disabled when case preview is enabled"
              }
            />
          </div>
        </div>
        <div
          className="size-8 flex items-center justify-center absolute top-4 right-4 cursor-pointer bg-content-xl-a rounded-full hover:scale-110"
          onClick={() => setIsOpen(false)}
        >
          <Icon name="close" />
        </div>
      </div>
      <Tooltip
        id="hint-tooltip"
        place="right"
        className="font-sans"
        style={{
          backgroundColor: "#1C1C1C",
          color: "#ffffff",
          fontSize: "11px",
          padding: "2px 4px 2px 4px",
          borderRadius: "4px",
          userSelect: "none",
        }}
        noArrow
      />
    </Dialog>
  );
};
