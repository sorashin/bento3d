import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { boxConfigAtom, updateBoxConfigAtomsAction, gridAtoms, openAIAPIKeyAtom, screenModeAtom } from "../../store";
import { ButtonAddRow } from "../atoms/ButtonAddRow";
import { ButtonAddColumn } from "../atoms/ButtonAddColumn";
import { DimElement } from "../atoms/DimElement";

export const GridEditorClassic: React.FC = () => {
    const [gridState, setGridState] = useAtom(gridAtoms);
  const [{totalWidth, mm2pixel,totalDepth, fillet, partitionThickness}, calculateSize] = useAtom(updateBoxConfigAtomsAction);
  const [,setScreenMode] = useAtom(screenModeAtom);
  const apiKey = useAtomValue(openAIAPIKeyAtom);
  const outerElement = useRef<HTMLDivElement>(null);
  // gridAtomsの0番目の要素のwidthを変更する関数
  const updateSize = (gridIndex:number,newWidth:number, newHeight:number) => {
    setGridState((prevGridState) => {
      const updatedGrid = [...prevGridState];
      updatedGrid[gridIndex] = {
        ...updatedGrid[gridIndex],
        width: newWidth,
        depth: newHeight,
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
    },[gridState])
  
    return(
        <motion.div 
          layout 
          className='relative flex flex-row gap-4 p-4 w-full rounded-md bg-content-extra-light-a border-[1px] border-content-dark' 
          ref={outerElement}
          style={{ padding: 2*mm2pixel, gap: 2*mm2pixel, borderRadius: fillet*mm2pixel}} 
        >
          <DimElement 
                    value={totalDepth} 
                    onChange={function (e: any): void {
                      gridState.map((row, index) => {
                        updateSize(index,row.width,Number(e.target.value))
                      })
                    } } 
                    isVertical={true}
                    />
        
        {/* 
        <p className='absolute -left-8 top-1/2'>{totalDepth} mm</p>
        <p className='absolute -left-8 -top-8'>縮尺 {mm2pixel}</p> */}
        {gridState.map((row, index) => {
          return (
            <div key={index} className='relative flex flex-col gap-4 '>
              <motion.div 
                className='relative flex flex-col'
                layout
                initial={false}
                animate={{ width: row.width*mm2pixel, height: (totalDepth-2*partitionThickness)*mm2pixel}}
                style={{ borderRadius: fillet*mm2pixel, gap: 2*mm2pixel}} 
              >
                  <DimElement 
                    value={row.width} 
                    onChange={function (e: any): void {updateSize(index,Number(e.target.value),row.depth)} } 
                    isVertical={false}                    
                    />
                    
                  {/* create for loop to create row.division number of divs */}
                  {Array.from(Array(row.division).keys()).map((i) => (
                    <motion.div 
                      key={i} 
                      initial={false}
                      animate={{ height: (totalDepth-(2+row.division-1)*partitionThickness)/row.division*mm2pixel,borderRadius: fillet*mm2pixel} }
                      className="group w-full flex flex-col justify-center items-center border-[1px] border-content-dark"
                    >
                      {/* <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateLabel(index,e.target.value)}
                        className='rounded-sm w-2/3 bg-[rgba(255,255,255,.16)] p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20'
                        //trigger getSize(index) on press Enter key
                        onKeyPress={(e) => e.key === 'Enter' && getSize(index)}
                      />
                      <button onClick={()=>getSize(index)}>生成</button> */}
                      <div className="invisible group-hover:visible transition">
                        {!(gridState.length===1&&row.division===1)&&<button
                          onClick={
                            //remove gridState[index]
                            ()=>{
                              if(row.division === 1){
                              setGridState((prevGridState) => {
                                const updatedGrid = [...prevGridState];
                                updatedGrid.splice(index, 1);
                                return updatedGrid;
                              })
                              }else if(row.division > 1){
                                setGridState((prevGridState) => {
                                  const updatedGrid = [...prevGridState];
                                  updatedGrid[index] = {
                                    ...updatedGrid[index],
                                    division: updatedGrid[index].division - 1,
                                  };
                                  return updatedGrid;
                                });
                              };
                            }
                          }
                        >
                          <img src="/icons/trash.svg" alt=''/>
                        </button>}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
              <ButtonAddRow/>
              <ButtonAddColumn index={index}/>
            </div>
          );
        })}
      </motion.div>
    )
}