import { useAtom } from "jotai";
import { boxConfigAtom, screenModeAtom } from "../../../src/store"


export const HeightEditor = () => {
    const [boxConfig,setBoxConfig] = useAtom(boxConfigAtom);
    return(
        <div className="flex gap-4">
            <input 
                type="number"
                value={boxConfig.height}
                onChange={(e)=>(
                    setBoxConfig((prevBoxConfig) => {
                        return {
                            ...prevBoxConfig,
                            height: Number(e.target.value)
                        }
                    })
                )
                }
                />
        </div>
    )
}