import { useAtom } from "jotai";
import { screenModeAtom } from "../../../src/store"


export const Header = () => {
    const [screenMode, setScreenMode] = useAtom(screenModeAtom);
    return(
        <header className="absolute inset-x-0 top-16 z-10 text-center">
            {screenMode===0?(
                <div className="flex flex-row gap-4 justify-center">
                    <button onClick={()=>setScreenMode(1)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-sm hover:bg-content-extra-light-a transition">
                        <img src="/icons/grid.svg" alt="" className="w-6 h-6"/>
                        グリッド編集
                    </button>
                    <button onClick={()=>setScreenMode(2)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-sm hover:bg-content-extra-light-a transition">
                        高さ編集
                    </button>
                </div>
            ):(
                <button onClick={()=>setScreenMode(0)}><img src="/icons/arrow-left.svg" alt=""/></button>
            )}
        </header>
    )
}