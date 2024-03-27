import React, { FC, useEffect, useRef, useState} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gridAtoms, openAIAPIKeyAtom, calculateSizeAction, screenModeAtom } from '../../store';
import { KeyManager } from '../molecules/KeyManager';

import { GridEditor } from '../molecules/GridEditor';
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
  downloadButtonJSX: React.ReactNode;
}

export const ConfigView: FC<ConfigViewProps> = ({ downloadButtonJSX }) => {
  const screenMode = useAtomValue(screenModeAtom);
  const [openList, setOpenList] = useState<boolean[]>([]);
  const title = ['色', 'サイズ'];

  useEffect(() => {
    setOpenList(() => {
      return [...Array(title.length)].map((v, i) => i === screenMode ? true : false)
    })
  }, [screenMode])
  const onClickHandler = (index: number) => {
    setOpenList(openList.map((open, i) => i === index ? !open : false));
    console.log(openList);
  };

  return (
    <div className="absolute inset-y-0 right-0 w-1/2 px-4 flex flex-col items-center justify-center">
      <div className='border-t-[1px] border-content-dark mb-16 w-full'>
        <Menu title={title[0]} index={0} isOpen={openList[0]} onClick={()=> onClickHandler(0)}>
          <div className='px-2 py-8'>
            <ColorEditor/>
          </div>
        </Menu>
        <Menu title={title[1]} index={1} isOpen={openList[1]} onClick={()=> onClickHandler(1)}>
          <div className='px-2 py-16'>
            <GridEditor/>
            {/* <HeightEditor/> */}
          </div>
        </Menu>
      </div>

      
      <div>{downloadButtonJSX}</div>
    </div>
  );
}

