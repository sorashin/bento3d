import { useAtom } from "jotai";
import { openAIAPIKeyAtom } from "../../store";
import { useMemo, useState } from "react";


export const KeyManager = () => {
  
    const [apiKey,setApiKey] = useAtom(openAIAPIKeyAtom);
    const [draftKey,setDraftKey] = useState('');
  return (
    <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="cursor-pointer transition rounded-sm bg-transparent p-2 hover:bg-content-extra-light-a">
              <img src={'/icons/key.svg'} alt='' />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] p-2 mt-2 bg-surface-sheet rounded-sm w-fit cursor-pointer">
              <li className="flex flex-row gap-4">
                <input 
                    type="text"
                    value={draftKey}
                    onChange={(e) => setDraftKey(e.target.value)}
                ></input>
                <button
                    onClick={()=>setApiKey(draftKey)}
                >✓</button>
              </li>
            </ul>
          </div>
  );
};
