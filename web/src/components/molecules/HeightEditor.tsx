import { useAtom } from "jotai";
import { boxConfigAtom, screenModeAtom } from "../../../src/store"


export const HeightEditor = () => {
    const [boxConfig,setBoxConfig] = useAtom(boxConfigAtom);
    return(
        <div className="flex gap-4">
            <input 
                type="number"
                value={boxConfig.depth}
                onChange={(e)=>(
                    setBoxConfig((prevBoxConfig) => {
                        return {
                            ...prevBoxConfig,
                            depth: Number(e.target.value)
                        }
                    })
                )
                }
                />
        </div>
    )
}