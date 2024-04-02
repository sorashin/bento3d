import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { calculateSizeAction, gridAtoms, openAIAPIKeyAtom} from "../../store";
import { ButtonAddRow } from "../atoms/ButtonAddRow";

export const THREEGridEditor: React.FC = () => {
    const [gridState, setGridState] = useAtom(gridAtoms);
  const [{totalWidth, mm2pixel, totalHeight}, calculateSize] = useAtom(calculateSizeAction);
  const apiKey = useAtomValue(openAIAPIKeyAtom);
  const outerElement = useRef<HTMLDivElement>(null);
  // gridAtomsの0番目の要素のwidthを変更する関数
  const updateSize = (gridIndex:number,newWidth:number, newHeight:number) => {
    setGridState((prevGridState) => {
      const updatedGrid = [...prevGridState];
      updatedGrid[gridIndex] = {
        ...updatedGrid[gridIndex],
        width: newWidth,
        height: newHeight,
      };
      return updatedGrid;
    });
  };
  const updateLabel = (gridIndex:number,newLabel:string) => {
    setGridState((prevGridState) => {
      const updatedGrid = [...prevGridState];
      updatedGrid[gridIndex] = {
        ...updatedGrid[gridIndex],
        label: newLabel,
      };
      return updatedGrid;
    });
  };
  const getSize = async (gridIndex:number) => {
  
    if (gridState[gridIndex].label === '') {
      alert('OPENAIのAPIキーを入力してください');
      return;
    };
    // if gridState[gridIndex].label was Number + " "+Number format, then return
    if (gridState[gridIndex].label.match(/^\d+\s\d+$/)) {
      console.log('size set');
      const size = gridState[gridIndex].label.split(' ');
      updateSize(gridIndex, Number(size[0]), Number(size[1]));
      return;
    }

    
    //API呼び出し用の情報定義
    
    const url = 'https://api.openai.com/v1/chat/completions';
    const method = 'POST';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    let body = JSON.stringify(
      {
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "Return a typical size(Height(mm), Width(mm), Depth(mm)) and image url of a certain object input by user. When you have specific size value, return them with the following json format `{height:value, width:value, depth:value, image:imageURL}`. Only number is allowed on value. Only valid image URL searched on wikipedia is allewed on imageURL"
          },
          {
            "role": "user",
            "content": gridState[gridIndex].label
          }
        ]
      }
    );
  
    //API呼び出し、結果をJSON形式に変換
    const resMessage = await fetch(url, {method, headers, body});
    const resMessageJson = await resMessage.json();
    console.log(resMessageJson);
    const size = JSON.parse(resMessageJson.choices[0].message.content);
    console.log(size);
    updateSize(gridIndex, size.width, size.height)
    
    
    
    
  }

    useEffect(()=>{
      //get pixel width of outerElement
      if(outerElement.current){
        calculateSize(outerElement.current.clientWidth);
      }
      console.log(gridState)
    },[gridState])
  
    return(
        <motion.div 
            layout 
            className='relative flex flex-row gap-4 p-4 w-10/12 rounded-md bg-content-extra-light-a' 
            ref={outerElement}
            animate={{ width: totalWidth, height: totalHeight}}
        >
        <p className='absolute -top-8 text-center'>{totalWidth} mm</p>
        {gridState.map((row, index) => {
          return (
            <div key={index} className='relative rounded-md flex flex-col gap-4'>
              <motion.div 
                className='group relative bg-emSecondary rounded-md'
                initial={false}
                animate={{ width: row.width, height: row.height}}
              >
                <div className="w-full h-full invisible flex flex-col justify-center items-center group-hover:visible">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateLabel(index,e.target.value)}
                    className='rounded-sm w-2/3 bg-[rgba(255,255,255,.16)] p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20'
                    //trigger getSize(index) on press Enter key
                    onKeyPress={(e) => e.key === 'Enter' && getSize(index)}
                  />
                  <button onClick={()=>getSize(index)}>生成</button>
                  <p className='absolute top-4 left-auto right-auto'>{row.width}mm</p>
                  <p className='absolute right-4 top-auto bottom-auto'>{row.height}mm</p>
                  
                  <button
                    onClick={
                      //remove gridState[index]
                      ()=>{
                        setGridState((prevGridState) => {
                          const updatedGrid = [...prevGridState];
                          updatedGrid.splice(index, 1);
                          return updatedGrid;
                        });
                      }
                    }
                  >
                    <img src="/icons/trash.svg" alt=''/>
                  </button>
                </div>
              </motion.div>
              <div className='w-full bg-content-light flex-1 rounded-md'>
                
              </div>
              <ButtonAddRow/>
            </div>
          );
        })}
      </motion.div>
    )
}