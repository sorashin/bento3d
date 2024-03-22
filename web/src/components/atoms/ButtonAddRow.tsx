import { useAtom } from "jotai";
import { gridAtoms, openAIAPIKeyAtom } from "../../store";
import { useMemo, useState } from "react";



export const ButtonAddRow = () => {
    const [gridState, setGridState] = useAtom(gridAtoms);
    const addRow =()=>{
        setGridState((prevGridState) => {
            const updatedGrid = [...prevGridState];
            updatedGrid.push({
                index: updatedGrid.length,
                label: '',
                width: 100,
                height: 100,
                grid: 1
            });
            return updatedGrid;
          });
    }
  return (
    <button 
        className="group absolute inset-y-0 right-0 w-12 flex items-center cursor-pointer "
        onClick={addRow}
    >
        <span 
        className="absolute w-12 h-12 scale-0 -right-6 flex justify-center items-center rounded-lg text-lg bg-white group-hover:scale-100 transition"
        >+</span>
          </button>
  );
};
