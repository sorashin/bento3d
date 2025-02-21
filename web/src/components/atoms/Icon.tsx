import { ReactComponent as arrowLeft } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as chevronUp } from "../../assets/icons/chevron-up.svg";
import { ReactComponent as chevronDown } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as chevronRight } from "../../assets/icons/chevron-right.svg";
import { ReactComponent as chevronLeft } from "../../assets/icons/chevron-left.svg";
import { ReactComponent as close } from "../../assets/icons/close.svg";
import { ReactComponent as coffeeDark } from "../../assets/icons/coffee-dark.svg";
import { ReactComponent as docs } from "../../assets/icons/docs.svg";
import { ReactComponent as caseIcon } from "../../assets/icons/case.svg";
import { ReactComponent as thickness } from "../../assets/icons/thickness.svg";
import { ReactComponent as step002 } from "../../assets/icons/step002.svg";
import { ReactComponent as step001 } from "../../assets/icons/step001.svg";
import { ReactComponent as step000 } from "../../assets/icons/step000.svg";
import { ReactComponent as stack } from "../../assets/icons/stack.svg";
import { ReactComponent as lightbulb } from "../../assets/icons/lightbulb.svg";
import { ReactComponent as key } from "../../assets/icons/key.svg";
import { ReactComponent as grid } from "../../assets/icons/grid.svg";
import { ReactComponent as gear } from "../../assets/icons/gear.svg";
import { ReactComponent as download } from "../../assets/icons/download.svg";
import { ReactComponent as trash } from "../../assets/icons/trash.svg";

const icons = {
  arrowLeft,
  chevronUp,
  chevronDown,
  chevronRight,
  chevronLeft,
  close,
  coffeeDark,
  docs,
  download,
  caseIcon,
  trash,
  thickness,
  step002,
  step001,
  step000,
  stack,
  lightbulb,
  key,
  grid,
  gear,
};

type Name = keyof typeof icons;

type Props = {
  name: Name;
  size?: number;
  className?: string;
};

export function Icon({ name, className }: Props) {
  const SvgComponent = icons[name];

  return <SvgComponent className={className} />;
}
