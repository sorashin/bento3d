import React, { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FrepRenderingQuality, Graph, IElementable, NodeBase, RenderingMode, UINodeBase, UINumber } from '@nodi/core';
import Project from './assets/scripts/service/Project';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { userStateAtom } from './store/user';
import { getProject } from './firebase/firebase';
import Viewer from './assets/scripts/viewer/Viewer';
import { gridAtoms, openAIAPIKeyAtom } from './store';
import { UIsAtom, elementsAtom, groupAtom, nodesAtom, projectPathAtom } from './store/scene';
import { KeyManager } from './components/molecules/KeyManager';



function BoxApp() { 
  const [gridState, setGridState] = useAtom(gridAtoms);
  const apiKey = useAtomValue(openAIAPIKeyAtom);
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
            "content": "Return a typical size(Height(mm), Width(mm), Depth(mm)) of a certain object input by user. When you have specific size value, return them with the following json format `{height:value, width:value, depth:value}`"
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

  return (
    <div className="App absolute inset-0 bg-surface-base">
      <header className="align-center">
        Generate BOX
        <KeyManager/>
      </header>
      <div>
        {gridState.map((grid, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                value={grid.label}
                onChange={(e) => updateLabel(index,e.target.value)}
              />
              <button onClick={()=>getSize(index)}>生成</button>
              <p>{grid.width}</p>
              <p>{grid.height}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoxApp;
