import { motion } from "framer-motion";
import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import { boxConfigAtom, cameraModeAtom, phantomSizeAtom } from "../../store";
import { Icon } from "./Icon";

type RangeSliderHeightProps = {
  max: number;
  min: number;
  label: string;
};
export const RangeSliderHeight: React.FC<RangeSliderHeightProps> = ({
  max,
  min,
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0); // ドラッグ開始時のY座標
  const defaultDepth = 100; // デフォルトのDepth値
  const rulerRange = 400;
  const [value, setValue] = useState(defaultDepth); // 現在の設定値
  const [yPos, setYPos] = useState(defaultDepth); // 現在のボーダー幅
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);
  const [phantomSize, setPhantomSize] = useAtom(phantomSizeAtom);
  const [, setCameraMode] = useAtom(cameraModeAtom);

  const unitRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const length = max - min;

  // Y座標の変化に基づいてボーダーの幅を更新
  const calculateYPos = (currentY: number) => {
    // startYと現在のY座標の差分を計算
    const diffY = currentY - startY;
    // newYPosを-rulerRangeからrulerRangeの範囲にクランプ
    const newYPos = Math.max(-rulerRange, Math.min(rulerRange, diffY));
    // min から max の範囲にnewYPosの値をマッピング
    const mappedValue =
      Math.round(((newYPos + rulerRange) / (rulerRange * 2)) * (max - min)) +
      min;

    setValue(mappedValue);
    setYPos(newYPos);
  };

  const updateBoxConfig = (value: number) => {
    setBoxConfig((prevBoxConfig) => {
      return {
        ...prevBoxConfig,
        height: Number(value),
      };
    });
  };
  const updatePhantomSize = (value: number) => {
    setPhantomSize((prevPhantomSize) => {
      return {
        ...prevPhantomSize,
        height: Number(value),
      };
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      // 数字のみを許可
      const numericValue = Math.floor(Number(newValue)); // 小数点以下を切り捨て
      setPhantomSize((prevPhantomSize) => ({
        ...prevPhantomSize,
        height: numericValue,
      }));
      updateBoxConfig(numericValue);
    } else {
      inputRef.current!.value = String(phantomSize.height);
    }
  };

  useEffect(() => {
    // change useTransform.translateY of unitRef
    unitRef.current!.style.transform = `translateY(${-yPos}px)`;
  }, [yPos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(phantomSize.height);
    }
  }, [phantomSize.height]);

  // initialization
  useEffect(() => {
    calculateYPos(0);
  }, []);

  return (
    <>
      <div
        className={
          "group fixed top-3/4 lg:top-1/2 lg:right-16 right-8 -translate-y-1/2 h-14 transition font-display"
        }
      >
        <div
          className={
            "fixed inset-y-0 flex flex-col justify-center z-10 w-4 lg:-right-16 -right-8 translate-x-[500%] group-hover:translate-x-0 transition-all"
          } //
        >
          <div
            className={`w-4 flex flex-col items-end`}
            style={{ height: `${rulerRange * 2}px`, width: `${16}` }}
            ref={unitRef}
          >
            {/* create span as many as length */}
            {[...Array(length + 1)].map((_, index) => (
              <div
                key={index}
                className={`relative block min-h-[1px] ${index % 10 === 0 ? "w-6" : index % 5 === 0 ? "w-4" : "w-2"} bg-content-h-a`}
                style={{
                  marginBottom: `${(rulerRange * 2 - length) / (length - 1)}px`,
                }}
              >
                {index % 10 === 0 && (
                  <p className="absolute text-overline text-right top-1/2 -translate-y-1/2 -left-6">
                    {min + index}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <Icon
          name="chevronUp"
          className="absolute -top-6 w-full h-4 group-hover:-top-8 transition-all"
        />
        <Icon
          name="chevronDown"
          className="absolute -bottom-6 w-full h-4 group-hover:-bottom-8 transition-all"
        />
        <span className="absolute top-1/2 left-[100%] w-0 h-[1px] bg-content-h group-hover:w-64 transition-all"></span>
        <input
          type="range"
          className="range-slider vertical"
          onMouseEnter={() => {
            setPhantomSize((prevPhantomSize) => {
              //set true
              return {
                ...prevPhantomSize,
                hover: {
                  ...prevPhantomSize.hover,
                  h: true,
                },
              };
            });
          }}
          onMouseLeave={() => {
            setPhantomSize((prevPhantomSize) => {
              //set true
              return {
                ...prevPhantomSize,
                hover: {
                  ...prevPhantomSize.hover,
                  h: false,
                },
              };
            });
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartY(e.clientY); // ドラッグ開始時のY座標を設定

            setCameraMode(1);
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              calculateYPos(e.clientY);
              updatePhantomSize(value);
            }
          }}
          onMouseUp={() => {
            setIsDragging(false);
            updateBoxConfig(value);
            setCameraMode(0);
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
              updatePhantomSize(value);
            }
          }}
          onTouchEnd={() => {
            setIsDragging(false);
            updateBoxConfig(value);
          }}
        />
        <div className="absolute flex flex-col gap-[2px] top-0 left-0 h-[56px] w-[128px] items-center justify-center text-center pointer-events-none  text-white ">
          <p className="text-xs relative text-content-dark-m-a">Height</p>
          <p className="relative items-center flex">
            <input
              type="text"
              className="text-lg max-w-[50px] text-content-white pointer-events-auto bg-transparent hover:bg-content-dark-xl-a rounded-[4px] focus:bg-content-dark-xl-a text-center focus:ring-1 focus:ring-content-dark-l-a focus:outline-none"
              defaultValue={String(phantomSize.height)}
              ref={inputRef}
              onFocus={(e) => e.target.select()}
              onChange={handleInputChange}
            />
            <span className="absolute -right-5 text-overline text-content-dark-m-a">
              mm
            </span>
          </p>
        </div>
      </div>
      {/* <div
            className="fixed right-24 bottom-24 z-10 bg-transparent"
        >
            <p>Y Position : {yPos}</p>
            <p>Height(Value) : {value}</p>
        </div> */}
    </>
  );
};
