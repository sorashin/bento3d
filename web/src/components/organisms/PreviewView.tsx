import React, { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import { FrepRenderingQuality, Graph, IElementable, NodeBase, RenderingMode, UINodeBase } from '@nodi/core';
import Project from '../../assets/scripts/service/Project';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { userStateAtom } from '../../store/user';
import { getProject } from '../../firebase/firebase';
import Viewer from '../../assets/scripts/viewer/Viewer';

import { selectedColorAtom } from '../../store';
import { UIsAtom, elementsAtom, groupAtom, nodesAtom, projectPathAtom } from '../../store/scene';
import Editor from '../../assets/scripts/editor/Editor';


export const PreviewView = () => {
  
    const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const path = useAtomValue(projectPathAtom);
  //get useStateAtom from /store
  const [user, setuser] = useAtom(userStateAtom);
  const [group, setGroup] = useAtom(groupAtom); //elements for viewer
  const [elements, setElements] = useAtom(elementsAtom); //elements for viewer
  const [UIs, setUIs] = useAtom(UIsAtom); //elements for viewer
  const [nodes, setNodes] = useAtom(nodesAtom); //elements for viewer 
  const SceneComponent = React.lazy(() => import(`../../components/three/Scene`));


  let viewer: Viewer;
  let editor: Editor;
  const initializeProject = async() => {
    //get current path
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)$/);
      if (path.length > 0) {
        try {

          const { project, doc } = await getProject(path);
          console.log(project);
          await loadProject(project, doc);
        } catch (e) {
          window.alert(e);
        }
      }
      setIsLoading(false);
  };

  const loadProject = async (project: Project, doc: any) => {
    const { jsonUrl } = project;
    if (project.canView(user.uid ?? '')) {
      const graph = new Graph();
      graph.onStartProcess.on(() => {
        setIsProcessing(true);
      });
      graph.onFinishProcess.on(() => {
        setIsProcessing(false)
      });
      graph.onConstructed.on((e) => {
        //TODO
        viewer.update(e.nodes);
        update(e.nodes);
        console.log("VIEWER", viewer);
        console.log("NODES", e.nodes);
        console.log("ELEMENTS", viewer.elements);
        setNodes(e.nodes);
        setGroup(viewer.container);
        setElements(viewer.elements);
    });
    
    if (jsonUrl !== undefined) {
        const { data } = await axios.get(jsonUrl);
        graph.fromJSON(data);
        editor.loadGraph(data);
        console.log("EDITOR" , editor.nodes);
        

      } else {
        graph.fromJSON(doc.json ?? {});
        editor.loadGraph(doc.json ?? {});
        
      }

      return Promise.resolve();
    }
    return Promise.reject(new Error('You do not have read access to this project'));
  }

  const update = (nodes:NodeBase[]) => {
    const uis: UINodeBase[] = nodes.filter(node => (node instanceof UINodeBase) && node.enabled && node.processed) as UINodeBase[];
    setUIs(uis);
    console.log("UIS", UIs);
    
  }

  const UIListItem = ({ uuid, editor, order, length, onOrderChange, onUp, onDown, children }:{uuid:string, editor:boolean, order:number, length:number, onOrderChange?:void, onUp?:void, onDown?:void,children?:HTMLDivElement}) => {
    // setup関数のロジックをここに書く
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (divRef.current) {
        // append child to divRef
        divRef.current.appendChild(children!);
      }
    }, [children]);
  
    return (
      //append child(HTMLDivElement)to div
      <div ref={divRef}></div>
        
      
    );
  };
// UIListItemインスタンスを作成します
const createUIListItem = (ui: UINodeBase, order: number, length: number) => {
  const div = document.createElement('div');
    ui.setupGUIElement(div);
  const instance = <UIListItem
    key={ui.uuid}
    uuid={ui.uuid}
    editor={false}
    order={order}
    length={length}
    
  >{div}</UIListItem>;
  return instance;
  
};
//create react FC for UI
  const UIColorSwitch: React.FC<{}> = ({  }) => {
    const colors = ['#f5f5f5','#5c932e', '#e0b68c', '#788caf', '#C85458', '#E69F41', '#3A3A3A']
    const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);
    useEffect(() => {
      setSelectedColor(colors[0]);
    }, []);
    
    const selectedColorIndex = colors.indexOf(selectedColor);
    return(
      <div className='absolute left-1/2 bottom-20 -translate-x-1/2 z-10 flex gap-2 bg-surface-base p-4 rounded-full'>
        {colors.map((color, index) => <span key={index} className={`block w-8 h-8 rounded-full shadow-inner before:block before:rounded-full before:w-full before:h-full before:border-solid before:border-2 before:border-content-middle before:drop-shadow-md ${selectedColorIndex===index?'before:border-2 before:border-white':''}`} 
        style={{backgroundColor: color}}
        onClick={() => {
          setSelectedColor(colors[index]);
          console.log(colors[index])
        }}
        ></span>)}
      </div>
    )
  }

  const UIButton: React.FC<{ uis: UINodeBase[] }> = ({ uis }) => {
    // uisの中から、labelが"Download BOX.stl"の要素を取り出し、JSXとしてreturnする
    
    const buttonUis = uis.filter(ui => ui.label === 'Download');
    let buttonJSXs:JSX.Element[] = []
    buttonUis.forEach((ui,index) => {
      const button = createUIListItem(ui, index, uis.length)
      buttonJSXs.push(button)
    })
    return(
      <div className="absolute z-10 bottom-8 right-16 text-center">
        {buttonJSXs.map((ui, index) => <span key={index} className='[&>div>div>button]:px-8 [&>div>div>span]:hidden [&>div>div>button]:py-4 [&>div>div>button]:bg-content-dark [&>div>div>button]:rounded-sm [&>div>div>button]:text-xl [&>div>div>button]:text-white'>{ui}</span>)}
      </div>
    )
    
  }

  const UISlider: React.FC<{ uis: UINodeBase[] }> = React.memo(({ uis }) => {
    const sliderUiNodes = uis.filter(ui => ui.label === 'width'|| ui.label === 'height'||ui.label === 'dimension');
    let sliderJSXs:JSX.Element[] = []
    sliderUiNodes.forEach((ui,index) => {
      const slider = createUIListItem(ui, index, uis.length)
      sliderJSXs.push(slider)
    })
    return(
      <div className="relative z-10 w-fit">
        {sliderJSXs.map((ui, index) => <span key={index} className='block mb-4 [&>div>div]:inline-flex [&>div>div]:items-center [&>div>div>input]:range [&>div>div>input]:range-accent [&>div>div>span]:text-content-dark [&>div>div>input]:text-lg'>{ui}</span>)}
      </div>

    )
  })

  const UIGraph: React.FC<{ uis: UINodeBase[] }> = React.memo(({ uis }) => {
    const sliderUiNodes = uis.filter(ui => ui.label === 'baseShape');
    let sliderJSXs:JSX.Element[] = []
    sliderUiNodes.forEach((ui,index) => {
      const slider = createUIListItem(ui, index, uis.length)
      sliderJSXs.push(slider)
    })
    return(
      <div className="relative z-10 w-fit">
        {sliderJSXs.map((ui, index) => <span key={index} className= 'block w-fit [&>div]:w-fit [&>div>div]:w-fit [&>div>div>span]:hidden'>{ui}</span>)}
      </div>

    )
    
  })
  const UIText: React.FC<{ nodes: NodeBase[] }> = ({ nodes }) => {
    // nodesの中から、labelが"Download BOX.stl"の要素を取り出し、JSXとしてreturnする
    // const textUiNodes = nodes.filter(node => node.filename! === 'baseShape');

    return(
      <div className="absolute z-10 bottom-8 right-16 text-center">
        
      </div>
    )
    
  }

  
  


  useEffect(() => {
    // Append Viewer
    const root:HTMLElement|null = document.getElementById('preview');
    const editorRoot:HTMLElement|null = document.getElementById('editor');
    viewer = new Viewer(root!);
    editor = new Editor(editorRoot!);
    // viewer.setRenderingMode(operators.rendering);
    
    initializeProject();
  },[]);  
  
  
  useEffect(() => {
    update(nodes);
    
  }, []);



  return (
    <>
    <div id="preview" className='hidden'></div>
    <div id="editor" className='hidden'></div>
        <Suspense fallback={"loading..."}>
          <SceneComponent group={group!}></SceneComponent>
        </Suspense>
        <UIButton uis={UIs}/>
        <div className='absolute bottom-40 left-1/2 -translate-x-1/2 flex items-center'>
          <UISlider uis={UIs}/>
          <UIGraph uis={UIs}/>
          {/* <UIText nodes={nodes}/> */}
        </div>
    </>
        
  );
};
