import { useAtom } from "jotai";
import { isFeedbackDialogOpenAtom, isSettingDialogOpenAtom, stepSyncAtom } from "../../store";
import { Icon } from "../atoms/Icon";
import { useMemo } from "react";


const NavButton: React.FC<{ label: string,step:number }> = ({ label,step }) => {
    const [currentStep,setStep] = useAtom(stepSyncAtom)
    const isActive = currentStep === step
    const icon = useMemo    (()=>{
        switch(step){
            case 0:
                return 'step000'
            case 1:
                return 'step001'
            case 2:
                return 'step002'
            default:
                return 'step000'
        }
    },[step])

    return (
        <button className={`w-fit p-2 flex justify-center items-center gap-2 rounded-sm ${isActive?'bg-[rgba(255,255,255,.56)] shadow-sm':'transparent shadow-none hover:bg-[rgba(255,255,255,.16)]'} text-content-h text-xs  transition-all`} onClick={()=>setStep(step)}>
            <Icon name={icon} className="w-6 h-6"/>
            {label}
        </button>
    )
}



export const Header = () => {
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useAtom(isSettingDialogOpenAtom)
    const [isFeedbackDialogOpen,setIsFeedbackDialogOpen] = useAtom(isFeedbackDialogOpenAtom)
    return(
        <header className="absolute inset-x-0 top-0 pt-8 px-4 z-20 flex flex-col">
            {/* <KeyManager/> */}
            <h1>Bento3d
                <Icon name="arrowLeft" className="w-8 h-8 text-content-xxl-a"/>
            </h1>
            <div className="flex justify-between md:justify-center items-center gap-2 w-full">
                <NavButton label={'Size'} step={0}/>
                <Icon name='chevronRight' className="w-4 h-4"></Icon>
                <NavButton label={'Grid'} step={1}/>
                <Icon name='chevronRight' className="w-4 h-4"></Icon>
                <NavButton label={'Download'} step={2}/>
            </div>
            <div className="flex justify-end mt-4 md:mt-0 md:absolute md:top-8 md:right-8 ">
                <a className="flex gap-2 items-center px-2 py-2 text-sm text-content-h-a rounded-sm hover:bg-content-xl-a transition"
                    href="https://polar-tadpole-97b.notion.site/Bento3D-e40483712b304d389d7c2da26196e113?pvs=4"
                    target="_blank" rel="noreferrer"
                >
                    <Icon name="docs" className="w-6 h-6"/>
                    docs</a>
                    <button className="flex gap-2 items-center px-2 py-2 text-sm text-content-h-a rounded-sm hover:bg-content-xl-a transition"
                    onClick={()=>setIsSettingDialogOpen(true)}
                    >
                        <Icon name="gear" className="w-6 h-6"/>
                        Settings
                    </button>
                    <button className="flex gap-2 items-center px-2 py-2 text-sm text-content-h-a rounded-sm hover:bg-content-xl-a transition"
                        onClick={()=>setIsFeedbackDialogOpen(true)}
                    >
                        😀 Feedback
                    </button>

            </div>
        </header>
    )
}