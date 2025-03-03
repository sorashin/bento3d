import { FC } from "react";
// define type
type SecondaryButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  width?: number;
  height?: number;
};

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  onClick,
  width,
  height,
}) => {
  return (
    <button
      className="flex gap-2 items-center justify-center px-4 py-2 text-sm text-content-h-a rounded-sm hover:bg-content-xl-a transition"
      style={{ width: width, height: height }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
