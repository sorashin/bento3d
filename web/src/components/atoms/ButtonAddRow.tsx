import { useAtom, useAtomValue } from "jotai";
import { boxConfigAtom, gridAtoms, openAIAPIKeyAtom, updateGridAtomsAction } from "../../store";
import { useEffect, useMemo, useState } from "react";



export const ButtonAddRow = () => {
    const boxConfig = useAtomValue(boxConfigAtom);
    const [, setGridState] = useAtom(gridAtoms);
    const [, calculateSize] = useAtom(updateGridAtomsAction);
    const addRow =()=>{
        setGridState((prevGridState) => {
            const updatedGrid = [...prevGridState];

            updatedGrid.push({
                index: updatedGrid.length,
                label: '',
                width: 100,
                depth: 100,
                division: 1,
                wFixed: false
            });
            return updatedGrid;
          });
          calculateSize(boxConfig);
    }
    
  return (
    <button 
        className="group absolute inset-y-0 right-0 w-1/5 flex items-center cursor-pointer "
        onClick={addRow}
    >
        <span 
        className="absolute w-12 h-12 -right-6 flex lg:scale-0 justify-center items-center rounded-lg text-content-dark font-sans text-lg bg-white group-hover:scale-95 transition"
        >+</span>
          </button>
  );
};

