import { useAtom } from "jotai";
import { screenModeAtom } from "../../../src/store"


export const HeightEditor = () => {
    const [screenMode, setScreenMode] = useAtom(screenModeAtom);
    return(
        <div className="flex gap-4">
            豆乳　抹茶　黒糖
        </div>
    )
}