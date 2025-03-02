import { useAtom } from "jotai";
import { stepSyncAtom } from "../../store";
import { Icon } from "../atoms/Icon";
import { useMemo } from "react";
import { Tooltip } from "react-tooltip";

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
  return (
    <header className="absolute inset-x-0 top-0 pt-8 px-4 flex flex-col justify-between z-20">
      {/* <KeyManager/> */}

      <div className="flex justify-between md:justify-center items-center gap-2 w-full font-display">
        <NavButton label={"Size"} step={0} />
        <Icon name="chevronRight" className="w-4 h-4"></Icon>
        <NavButton label={"Grid"} step={1} />
        <Icon name="chevronRight" className="w-4 h-4"></Icon>
        <NavButton label={"Download"} step={2} />
      </div>
    </header>
  );
};
