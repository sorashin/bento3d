import { useAtom } from "jotai";
import {
  isFeedbackDialogOpenAtom,
  isSettingDialogOpenAtom,
  isUpdatesDrawerOpenAtom,
  stepSyncAtom,
} from "../../store";
import { Icon } from "../atoms/Icon";
import { useMemo } from "react";
import { Tooltip } from "react-tooltip";
import updates from "../../assets/jsons/updates.json";

const NavButton: React.FC<{ label: string; step: number }> = ({
  label,
  step,
}) => {
  const [currentStep, setStep] = useAtom(stepSyncAtom);
  const isActive = currentStep === step;
  const icon = useMemo(() => {
    switch (step) {
      case 0:
        return "step000";
      case 1:
        return "step001";
      case 2:
        return "step002";
      default:
        return "step000";
    }
  }, [step]);

  return (
    <button
      className={`w-fit p-2 flex justify-center items-center gap-2 rounded-sm ${isActive ? "bg-[rgba(255,255,255,.56)] shadow-sm" : "transparent shadow-none hover:bg-[rgba(255,255,255,.16)]"} text-content-h text-xs  transition-all`}
      onClick={() => setStep(step)}
    >
      <Icon name={icon} className="w-6 h-6" />
      {label}
    </button>
  );
};

export const Header = () => {
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useAtom(
    isSettingDialogOpenAtom,
  );
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

  return (
    <header className="absolute inset-x-0 top-0 pt-8 px-4 z-20 flex flex-col justify-between">
      {/* <KeyManager/> */}
      <div className="flex justify-between items-center gap-2 md:mt-0 md:absolute md:left-8">
        <h1 className="flex gap-1 items-center">
          <span className="-indent-96 absolute">Bento3d</span>
          <img src="/logo.svg" alt="bento3d" className="w-32 h-auto" />
        </h1>
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
      <div className="flex justify-between md:justify-center items-center gap-2 w-full font-display">
        <NavButton label={"Size"} step={0} />
        <Icon name="chevronRight" className="w-4 h-4"></Icon>
        <NavButton label={"Grid"} step={1} />
        <Icon name="chevronRight" className="w-4 h-4"></Icon>
        <NavButton label={"Download"} step={2} />
      </div>
      <div className="flex justify-end mt-4 md:mt-0 md:absolute md:top-8 md:right-8 font-display">
        <button
          className="flex gap-2 items-center px-2 py-2 text-sm text-content-h-a rounded-sm hover:bg-content-xl-a transition"
          onClick={() => setIsSettingDialogOpen(true)}
        >
          <Icon name="gear" className="w-6 h-6" />
          Settings
        </button>
      </div>
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
    </header>
  );
};
