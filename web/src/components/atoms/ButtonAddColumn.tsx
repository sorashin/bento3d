import { useAtom } from "jotai";
import { gridAtoms, openAIAPIKeyAtom } from "../../store";
import { FC, useMemo, useState } from "react";



export const ButtonAddColumn:FC<{index:number}> = (index) => {
    const [gridState, setGridState] = useAtom(gridAtoms);
    const addRow =()=>{
        setGridState((prevGridState) => {
            //add +1 to prevGridState[index]'s grid division
            const updatedGrid = [...prevGridState];
            updatedGrid[index.index] = {
              ...updatedGrid[index.index],
              division: updatedGrid[index.index].division + 1,
            };
            return updatedGrid;
        })
    }
  return (
    <button 
        className="group absolute inset-x-0 bottom-0 h-1/5 flex flex-row justify-center cursor-pointer "
        onClick={addRow}
    >
        <span 
        className="absolute w-12 h-12 scale-0 -bottom-6 flex justify-center items-center rounded-lg text-lg bg-white group-hover:scale-100 transition"
        >+</span>
          </button>
  );
};
