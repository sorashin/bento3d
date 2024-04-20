import { useAtom } from "jotai";
import { KeyManager } from "./KeyManager";
import { stepSyncAtom } from "../../store";


const NavButton: React.FC<{ label: string,step:number }> = ({ label,step }) => {
    const [currentStep,setStep] = useAtom(stepSyncAtom)
    const isActive = currentStep === step
    return (
        <button className={`w-12 h-12 flex justify-center items-center rounded-lg ${isActive?'bg-emSecondary':'bg-content-light-a'} text-white text-lg font-bold`} onClick={()=>setStep(step)}>
            {step+1}<span className="absolute -bottom-1 text-base text-center text-content-middle-a font-normal">{label}</span>
        </button>
    )
}


export const Header = () => {
    return(
        <header className="absolute inset-x-0 top-0 py-8 z-20 flex justify-center gap-16">
            {/* <KeyManager/> */}
            <NavButton label={'サイズ'} step={0}/>
            <NavButton label={'グリッド'} step={1}/>
            <NavButton label={'ダウンロード'} step={2}/>
        </header>
    )
}