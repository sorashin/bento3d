import { useAtom } from "jotai";
import { KeyManager } from "./KeyManager";
import { stepSyncAtom } from "../../store";


const NavButton: React.FC<{ label: string,step:number }> = ({ label,step }) => {
    const [currentStep,setStep] = useAtom(stepSyncAtom)
    const isActive = currentStep === step
    return (
        <button className={`w-fit p-2 flex justify-center items-center gap-2 rounded-sm ${isActive?'bg-[rgba(255,255,255,.56)] shadow-sm':'transparent shadow-none hover:bg-[rgba(255,255,255,.16)]'} text-content-dark text-xs  transition-all`} onClick={()=>setStep(step)}>
            <img src={`/icons/step00${step}.svg`} alt="" className="w-6 h-6"/>
            {label}
        </button>
    )
}



export const Header = () => {
    return(
        <header className="absolute inset-x-0 top-0 pt-8 z-20 flex justify-center items-center gap-2">
            {/* <KeyManager/> */}
            <NavButton label={'Size'} step={0}/>
            <img src='/icons/chevron-right.svg' alt="" className="w-4 h-4"></img>
            <NavButton label={'Grid'} step={1}/>
            <img src='/icons/chevron-right.svg' alt="" className="w-4 h-4"></img>
            <NavButton label={'Download'} step={2}/>
        </header>
    )
}