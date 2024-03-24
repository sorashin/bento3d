import { useAtom } from "jotai";
import { screenModeAtom } from "../../../src/store"


export const Header = () => {
    const [screenMode, setScreenMode] = useAtom(screenModeAtom);
    return(
        <header className="absolute inset-x-0 top-16 z-10 text-center">
            {screenMode===0?(
                <div className="flex flex-row ">

                    <button onClick={()=>setScreenMode(1)} className="px-4 py-2">グリッド編集</button>
                    <button onClick={()=>setScreenMode(2)}>高さ編集</button>
                </div>
            ):(
                <button onClick={()=>setScreenMode(0)}><img src="/icons/arrow-left.svg"/></button>
            )}
        </header>
    )
}