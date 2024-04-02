import { useAtom, useAtomValue } from "jotai";
import { boxConfigAtom, colorPaletteAtom } from "../../../src/store"


export const ColorEditor = () => {
    const [, setBoxConfig] = useAtom(boxConfigAtom);


    const colors = useAtomValue(colorPaletteAtom);
    return(
        <div className="flex gap-4">
            {colors.map((color,index) => {
                return <p onClick={()=>(
                    setBoxConfig((prevBoxConfig) => {
                        return {
                            ...prevBoxConfig,
                            colorMode: index
                        }
                    })
                )}>{color.label}</p>
            })}
        </div>
    )
}