import React, { FC, useEffect, useRef, useState} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gridAtoms, openAIAPIKeyAtom, updateBoxConfigAtomsAction, screenModeAtom, boxConfigAtom, isDownloadDialogOpenAtom } from '../../store';

import { GridEditorClassic } from '../molecules/GridEditorClassic';
import { motion } from 'framer-motion';
import { ColorEditor } from '../molecules/ColorEditor';
import { HeightEditor } from '../molecules/HeightEditor';


const Menu: FC<{children:React.ReactNode, index:number, title:string, onClick:()=>void, isOpen:boolean}> = ({children, index, onClick, isOpen,title}) => {
  
  
  
  return (
    <div className='border-b-[1px] border-content-dark h-fit w-full'>
      <div onClick={()=> onClick()} 
      className={`${"accBlock__btn"} ${isOpen? "isClicked" :""} px-1 py-4 text-lg text-content-dark cursor-pointer`}
      >{title}</div>
      <motion.div key="accordion" animate={{height:isOpen ? "auto": "0"}} transition={{duration:0.3}}
      className="overflow-y-clip h-0" layout>
        {children}
      </motion.div>
    </div>
  );
};

//define type of ConfigView
export type ConfigViewProps = {
}

export const ConfigView: FC<ConfigViewProps> = () => {
  const [boxConfig,setBoxConfig] = useAtom(boxConfigAtom);
  const [openList, setOpenList] = useState<boolean[]>([]);
  const [isDialogDownloadOpen, setIsDialogDownloadOpen] = useAtom(isDownloadDialogOpenAtom);
  const title = ['色', 'サイズ','高さ'];

  useEffect(() => {
    setOpenList(() => {
      return [...Array(title.length)].map((v, i) => i === boxConfig.viewMode ? true : false)
    })
  }, [boxConfig.viewMode])
  const onClickHandler = (index: number) => {
    setOpenList(openList.map((open, i) => i === index ? !open : false));
    //update boxConfig.viewMode adn set index number
    setBoxConfig({...boxConfig, viewMode: index});

    
  };

  return (
    <div className="absolute bottom-0 h-1/2 w-full lg:h-full lg:inset-y-0 lg:right-0 lg:w-1/2 px-4 py-4 flex flex-col items-center justify-end lg:justify-center">
      <div className='border-t-[1px] border-content-dark mb-16 w-full'>
        <Menu title={title[0]} index={0} isOpen={openList[0]} onClick={()=> onClickHandler(0)}>
          <div className='px-2 py-8'>
            <ColorEditor/>
          </div>
        </Menu>
        <Menu title={title[1]} index={1} isOpen={openList[1]} onClick={()=> onClickHandler(1)}>
          <div className='px-2 py-16'>
            <GridEditorClassic/>
            {/* <HeightEditor/> */}
          </div>
        </Menu>
        <Menu title={title[2]} index={2} isOpen={openList[2]} onClick={()=> onClickHandler(2)}>
          <div className='px-2 py-16'>
            <HeightEditor/>
          </div>
        </Menu>
      </div>
      <button
        onClick={()=>setIsDialogDownloadOpen(true)}
        className='w-fit bg-content-dark text-white font-medium text-lg px-4 py-2 rounded-sm cursor-pointer hover:bg-content-dark-a transition'
      >DOWNLOAD</button>
      
    </div>
  );
}

