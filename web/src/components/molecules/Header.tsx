import { useAtom } from "jotai";
import { isFeedbackDialogOpenAtom, isSettingDialogOpenAtom, stepSyncAtom } from "../../store";


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
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useAtom(isSettingDialogOpenAtom)
    const [isFeedbackDialogOpen,setIsFeedbackDialogOpen] = useAtom(isFeedbackDialogOpenAtom)
    return(
        <header className="absolute inset-x-0 top-0 pt-8 px-4 z-20 flex flex-col">
            {/* <KeyManager/> */}
            <div className="flex justify-between md:justify-center items-center gap-2 w-full">
                <NavButton label={'Size'} step={0}/>
                <img src='/icons/chevron-right.svg' alt="" className="w-4 h-4"></img>
                <NavButton label={'Grid'} step={1}/>
                <img src='/icons/chevron-right.svg' alt="" className="w-4 h-4"></img>
                <NavButton label={'Download'} step={2}/>
            </div>
            <div className="flex justify-end mt-4 md:mt-0 md:absolute md:top-8 md:right-8 ">
                <a className="flex gap-2 items-center px-2 py-2 text-sm text-content-dark-a rounded-sm hover:bg-content-extra-light-a transition"
                    href="https://polar-tadpole-97b.notion.site/Bento3D-e40483712b304d389d7c2da26196e113?pvs=4"
                    target="_blank" rel="noreferrer"
                >
                    <img src="/icons/docs.svg" alt="" className="w-6 h-6"/>
                    docs</a>
                    <button className="flex gap-2 items-center px-2 py-2 text-sm text-content-dark-a rounded-sm hover:bg-content-extra-light-a transition"
                    onClick={()=>setIsSettingDialogOpen(true)}
                    >
                        <img src="/icons/gear.svg" alt="" className="w-6 h-6"/>
                        Settings
                    </button>
                    <button className="flex gap-2 items-center px-2 py-2 text-sm text-content-dark-a rounded-sm hover:bg-content-extra-light-a transition"
                        onClick={()=>setIsFeedbackDialogOpen(true)}
                    >
                        😀 Feedback
                    </button>

            </div>
        </header>
    )
}