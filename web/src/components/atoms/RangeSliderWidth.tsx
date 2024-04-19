import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState, useEffect, useRef } from 'react';
import { boxConfigAtom, cameraModeAtom, phantomSizeAtom } from '../../store';
import { set } from 'lodash';
import { Toast } from './Toaster';

type RangeSliderWidthProps = {
    max: number;
    min: number;    
    label:string
}
export const RangeSliderWidth: React.FC<RangeSliderWidthProps> = ({max,min,label}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0); // ドラッグ開始時のY座標
  const defaultDepth = 100; // デフォルトのDepth値
  const rulerRange = 400;
  const [value, setValue] = useState(defaultDepth); // 現在の設定値
  const [xPos, setXPos] = useState(defaultDepth); // 現在のボーダー幅
  const [boxConfig,setBoxConfig] = useAtom(boxConfigAtom);
  const [phantomSize,setPhantomSize] = useAtom(phantomSizeAtom);
  const [,setCameraMode] = useAtom(cameraModeAtom);

  const unitRef = useRef<HTMLDivElement>(null);
  const length = max - min;


  // Y座標の変化に基づいてボーダーの幅を更新
  const calculatexPos = (currentX: number) => {
    // startXと現在のY座標の差分を計算
    const diffX = currentX - startX;
    // newxPosを-rulerRangeからrulerRangeの範囲にクランプ
    const newxPos = Math.max(-rulerRange, Math.min(rulerRange, diffX));
    // min から max の範囲にnewxPosの値をマッピング
    const mappedValue = Math.round(((newxPos + rulerRange) / (rulerRange * 2)) * (max - min))+min;

    setValue(mappedValue);
    setXPos(newxPos);
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
          width:Number(value),
      }
  })
}

  useEffect(() => {
    // change useTransform.translateY of unitRef
      unitRef.current!.style.transform = `translateX(${-xPos}px)`;
  }, [xPos]);
  // initialization
  useEffect(() => {
    calculatexPos(0)
  }, []);

  
  return (
    <>
      
        
        <div className={'group fixed left-1/2 bottom-32 -translate-x-1/2 w-[128px] transition'}>
          <div className={'fixed inset-x-0 flex flex-row justify-center h-4 -bottom-32 translate-y-[500%] group-hover:translate-y-0 transition-all'}>
            <div 
                className={`h-4 flex flex-row items-end`}
                style={{ height: 16,width: `${rulerRange*2}px`}}
                ref={unitRef}
            >
                {/* create span as many as length */}
                {[...Array(length+1)].map((_, index) => (
                  <div key={index} className={`relative block min-w-[1px] ${index % 10 === 0 ?'h-6':index % 5 === 0 ? 'h-4' : 'h-2'} bg-content-dark-a`}
                    style={{marginRight:`${(rulerRange*2-length)/(length-1)}px`}}
                    >
                      {index % 10 === 0&&<p className='absolute text-sm text-center left-1/2 -translate-x-1/2 -top-8'>{min+index}</p>}
                    </div>
                ))}
            </div>
          </div>
          <img src="/icons/chevron-right.svg" alt="" className='absolute -right-6 h-full w-4 group-hover:-right-8 transition-all'/>
          <img src="/icons/chevron-left.svg" alt="" className='absolute -left-6 h-full w-4 group-hover:-left-8 transition-all'/>
          <span className='absolute left-1/2 top-[100%] h-0 w-[1px] bg-content-dark group-hover:h-64 transition-all'></span>
          <input
          type='range'
            className='range-slider'
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.clientX); // ドラッグ開始時のY座標を設定
              
              setCameraMode(1)
            }}
            onMouseMove={(e) => {
              if (isDragging) {
                calculatexPos(e.clientX);
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
              const touchX = e.touches[0].clientX; // タッチ開始時のY座標
              setStartX(touchX);
              
            }}
            onTouchMove={(e) => {
              if (isDragging) {
                const touchX = e.touches[0].clientX;
                calculatexPos(touchX);
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
        <Toast isOpen={isDragging} value={`${label} : ${value.toString()}`} />
        {/* <div
            className="fixed right-24 bottom-24 z-10 bg-transparent"
        >
            <p>Y Position : {xPos}</p>
            <p>Height(Value) : {value}</p>
        </div> */}
      
    </>
  );
};

