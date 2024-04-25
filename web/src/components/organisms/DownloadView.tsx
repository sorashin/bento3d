import React, { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { ButtonElements, DLButtonElementsAtom, cameraModeAtom } from '../../store';
import SupportButton from '../atoms/SupportButton';


interface DownloadViewProps {
  elements: ButtonElements[];
  children?: ReactNode;
}

export const DownloadView:React.FC<DownloadViewProps> = ({elements,children}) => {
  
  const [DLButtonElements,setDLButtonElements] = useAtom(DLButtonElementsAtom)
  // useEffect(() => {
  //   setDLButtonElements(elements)
  // }, [elements])
  // useEffect(()=>{
  //   console.log(DLButtonElements)
  // },[DLButtonElements])
  
  const toggleVisible = (index:number) => {
    setDLButtonElements((prevDLButtonElements) => {
      return prevDLButtonElements.map((element,i) => {
          return {
              ...element,
              visible: i===index? !element.visible : element.visible
          }
      })
    })
  }
  return (
    <>
      <div className='absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center px-16 z-10'>
        <div className='flex flex-col items-center justify-center w-full h-fit rounded-lg bg-surface-sheet pt-4 px-4 pb-8 shadow-lg'>
          <div
            className='flex flex-row gap-2 mb-4 p-4 text-xs text-content-middle-a rounded-md bg-surface-base '
          >
            <img src="/icons/lightbulb.svg" alt="" />
            <p className='h-fill'>仕切り部分はサポート不要です。<br/>ケース部分のプリントのコツや注意事項に関しては、<a href='https://www.notion.so/Bento3D-e40483712b304d389d7c2da26196e113' className='text-primary' target='_blank' rel="noreferrer">こちらのガイド</a>をご覧ください</p>
          </div>
          {elements.map((element, index) => (
              <div key={index} className='flex justify-between items-center w-full relative px-4 py-2 [&>div>div>span]:hidden [&>div>div>button]:absolute [&>div>div>button]:inset-0 [&>div>div>button]:rounded-sm [&>div>div>button]:text-[0px] [&>div>div>button]:bg-transparent [&>div>div>button]:hover:bg-content-extra-light-a [&>div>div>button]:transition'>
                {/* <input type="checkbox" defaultChecked className="checkbox" onClick={()=>toggleVisible(index)}/> */}
                <img 
                  src={element.path} alt=''
                  className="w-12 h-12 object-contain rounded-sm bg-content-extra-light"
                  />
                <p className="grow ml-2">{element.label}</p>
                
                <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-content-dark-a shadow-sm transition hover:scale-[0.98]">
                  <img className='w-6 h-6' src="/icons/download.svg" alt="" />
                </span>
                {/* span + button */}
                {element.jsx}
              </div>
            ))}
            <a href='https://buymeacoffee.com/lodgefabq' target='_blank' rel="noreferrer"
              className='flex flex-row gap-2 w-fit mt-4 px-4 py-2 rounded-sm bg-content-dark-a text-white font-sans shadow-md transition hover:scale-[0.98]'
            ><img src="/icons/coffee.svg" alt="" />開発を支援する</a>
            <p className='mt-4 font-sans text-xs text-content-light'>Created by <a href="https://twitter.com/52shinNaka" target='_blank' className='transition hover:scale-[0.98]' rel="noreferrer">@52shinNaka</a></p>
        </div>
        
      </div>
      {children}
    </>
  );
};
