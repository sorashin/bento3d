import React, { useEffect, useRef} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gridAtoms, openAIAPIKeyAtom, calculateSizeAction, screenModeAtom } from '../../store';
import { KeyManager } from '../molecules/KeyManager';

import { GridEditor } from '../molecules/GridEditor';



export const GridView = () => {
  const [,setScreenMode] = useAtom(screenModeAtom);
  

  return (
    <div className="absolute inset-y-0 right-0 w-2/3 px-4 flex flex-col items-center justify-center bg-[#dadada]">
      <div className="mb-4">
        グリッドの設定
        <KeyManager/>
      </div>
      <GridEditor></GridEditor>
      <button
        className='px-4 py-2 bg-content-dark text-white rounded-lg mt-4'
        onClick={()=>setScreenMode(0)}
      >
        CONFIRM
      </button>
    </div>
  );
}

