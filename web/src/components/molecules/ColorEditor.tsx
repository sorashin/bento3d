import { useAtom, useAtomValue } from "jotai";
import { boxConfigAtom, colorPaletteAtom } from "../../../src/store";

export const ColorEditor = () => {
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);

  const colors = useAtomValue(colorPaletteAtom);
  return (
    <div className="flex gap-4 text-center">
      {colors.map((color, index) => {
        return (
          <p
            onClick={() =>
              setBoxConfig((prevBoxConfig) => {
                return {
                  ...prevBoxConfig,
                  colorMode: index,
                };
              })
            }
          >
            <img
              src={`/images/cases/00${index}.jpg`}
              className={`${boxConfig.colorMode === index ? "border-2" : "border-0"} w-24 h-24 rounded-md border-white`}
              alt=""
            />
            {color.label}
          </p>
        );
      })}
    </div>
  );
};
