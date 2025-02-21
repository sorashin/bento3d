import { FC } from "react";
// define type
type PrimaryButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  width?: number;
  height?: number;
  bgColor?: string;
};

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  onClick,
  width,
  height,
  bgColor,
}) => {
  return (
    <button
      className="flex gap-2 items-center justify-center px-4 py-2 text-sm text-content-h-a rounded-sm hover:scale-[0.95] transition"
      style={{ backgroundColor: bgColor, width: width, height: height }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
