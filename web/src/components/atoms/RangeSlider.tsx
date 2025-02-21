import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState, useEffect, useRef } from 'react';
import { boxConfigAtom, cameraModeAtom, phantomSizeAtom } from '../../store';
import { set } from 'lodash';
import { Toast } from './Toast'
import { Icon } from './Icon';

type RangeSliderProps = {
    max: number;
    min: number;    
    label:string
}
export const RangeSlider: React.FC<RangeSliderProps> = ({max,min,label}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0); // ドラッグ開始時のY座標
  const defaultDepth = 100; // デフォルトのDepth値
  const rulerRange = 400;
  const [value, setValue] = useState(defaultDepth); // 現在のボーダー幅
  const [yPos, setYPos] = useState(defaultDepth); // 現在のボーダー幅
  const [boxConfig,setBoxConfig] = useAtom(boxConfigAtom);
  const [phantomSize,setPhantomSize] = useAtom(phantomSizeAtom);
  const [,setCameraMode] = useAtom(cameraModeAtom);
  const type:number|null = label==='Height' ? 0 : label==='Depth' ? 1 : 'Width' ? 2 : null

  const unitRef = useRef<HTMLDivElement>(null);
  const length = max - min;


  // Y座標の変化に基づいてボーダーの幅を更新
  const calculateYPos = (currentY: number) => {
    // startYと現在のY座標の差分を計算
    const diffY = currentY - startY;
    // newYPosを-rulerRangeからrulerRangeの範囲にクランプ
    const newYPos = Math.max(-rulerRange, Math.min(rulerRange, diffY));
    // 0 から 100 の範囲にnewYPosの値をマッピング
    const mappedValue = Math.round(((newYPos + rulerRange) / (rulerRange * 2)) * (max - min));

    setValue(mappedValue);
    setYPos(newYPos);
  };

  const updateBoxConfig = (value:number) => {
    setBoxConfig((prevBoxConfig) => {
        return {
            ...prevBoxConfig,
            depth: Number(value)
        }
      })
  }
  const updatePhantomSize = (value:number) => {
    setPhantomSize((prevPhantomSize) => {
      return {
          ...prevPhantomSize,
          height: type===0?Number(value):prevPhantomSize.height,
          width: type===1?Number(value):prevPhantomSize.width,
          depth: type===2?Number(value):prevPhantomSize.depth,
      }
  })
}

  useEffect(() => {
    // change useTransform.translateY of unitRef
    if(type===0||1){
      unitRef.current!.style.transform = `translateY(${-yPos}px)`;
    }else if(type===2){
      unitRef.current!.style.transform = `translateX(${-yPos}px)`;
    }
  }, [yPos]);
  // initialization
  useEffect(() => {
    calculateYPos(0)
  }, []);

  if(type===null){
    return null
  }
  return (
    <>
      
        
        <div className={type===0?'group fixed top-1/2 right-32 -translate-y-1/2 h-14 transition':
          type===1?'group fixed top-1/2 left-32 -translate-y-1/2 h-14 transition':
          type===2?'group fixed left-1/2 bottom-32 -translate-x-1/2 w-14 transition':'invisible'
        }>
          <div
        className={type===0?'fixed inset-y-0 flex flex-col justify-center z-10 w-4 -right-32 translate-x-[500%] group-hover:translate-x-0 transition-all'://Height
        type===1?'fixed inset-y-0 flex flex-col justify-center z-10 w-4 left-0 transition-all'://Depth
        type===2?'fixed inset-x-0 flex flex-row justify-center z-10 h-4 bottom-0 transition-all':'invisible'}//Width
      >
        <div 
            className={type===0?`w-4 flex flex-col items-end`:
              type===1?`w-4 flex flex-col items-start`:
              type===2?`h-4 flex flex-row items-end`:'invisible'
            }
            style={{ height: `${type===0||1?rulerRange*2:type===2?16:0}px`,width: `${type===0||1?16:type===2?rulerRange*2:0}px`, }}
            ref={unitRef}
        >
            {/* create span as many as length */}
            {[...Array(length+1)].map((_, index) => (
              <div key={index} className={
                type===0||1?`relative block min-h-[1px] ${index % 10 === 0 ?'w-6':index % 5 === 0 ? 'w-4' : 'w-2'} bg-content-h-a`:
                type===2?`relative block w-[1px] ${index % 10 === 0 ?'h-6':index % 5 === 0 ? 'h-4' : 'h-2'} bg-content-h-a`:''}
                style={{marginBottom:`${(rulerRange*2-length)/(length-1)}px`}}
                >
                  {index % 10 === 0&&<p className='absolute text-sm text-right top-1/2 -translate-y-1/2 -left-8'>{index}</p>}
                </div>
            ))}
        </div>
      </div>
          <Icon name="chevronUp"  className='absolute -top-6 w-full h-4 group-hover:-top-8 transition-all'/>
          <Icon name="chevronDown"  className='absolute -bottom-6 w-full h-4 group-hover:-bottom-8 transition-all'/>
          <span className='absolute top-1/2 left-[100%] w-0 h-[1px] bg-content-h group-hover:w-64 transition-all'></span>
          <input
          type='range'
            className='range-slider'
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartY(e.clientY); // ドラッグ開始時のY座標を設定
              
              if(type===0||2){
                setCameraMode(1)
              }else if(type===1){
                setCameraMode(2)
              }
            }}
            onMouseMove={(e) => {
              if (isDragging) {
                calculateYPos(e.clientY);
                updatePhantomSize(value)
              }
            }}
            onMouseUp={() => {
              setIsDragging(false)
              updateBoxConfig(value)
              setCameraMode(0)
          }}
            onTouchStart={(e) => {
              setIsDragging(true);
              const touchY = e.touches[0].clientY; // タッチ開始時のY座標
              setStartY(touchY);
              
            }}
            onTouchMove={(e) => {
              if (isDragging) {
                const touchY = e.touches[0].clientY;
                calculateYPos(touchY);
                updatePhantomSize(value)
              }
            }}
            onTouchEnd={() => {
              setIsDragging(false)
              updateBoxConfig(value)
          }}
          />
          <p className='absolute inset-0 leading-[56px] text-center h-full text-white text-base pointer-events-none'>{label}</p>
        </div>
        {/* <Toast isOpen={isDragging} value={`${label} : ${value.toString()}`} /> */}
        {/* <div
            className="fixed right-24 bottom-24 z-10 bg-transparent"
        >
            <p>Y Position : {yPos}</p>
            <p>Height(Value) : {value}</p>
        </div> */}
      
    </>
  );
};

