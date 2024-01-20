import React, { ReactNode, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FrepRenderingQuality, Graph, IElementable, NodeBase, RenderingMode, UINodeBase } from '@nodi/core';
import Project from './assets/scripts/service/Project';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userStateAtom } from './store/user';
import { getProject } from './firebase/firebase';
import Viewer from './assets/scripts/viewer/Viewer';
import Scene from './components/organisms/Scene';



function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] =useState("TtmQukE3aczIe31dTMbE");
  //get useStateAtom from /store
  const [user, setuser] = useAtom(userStateAtom);
  const [group, setGroup] = useState<THREE.Group>(); //elements for viewer
  const [UIs, setUIs] = useState<UINodeBase[]>([]); //elements for viewer
  const [nodes, setNodes] = useState<NodeBase[]>([]); //elements for viewer 
  const [uiListeners, setUiListeners] = useState<(() => void)[]>([]); //elements for viewer

  let viewer: Viewer;
  const operators = {
    quality: FrepRenderingQuality.Normal,
    rendering: RenderingMode.Standard,
    grid: true,
    boundingBox: false,
    fullscreen: false
  };



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
        
        console.log("VIEWER", viewer);
        console.log("NODES", e.nodes);
        setNodes(e.nodes);
        setGroup(viewer.container);
        // const geometries = elements.map(element => element.geometry);
      });

      const { jsonUrl } = project;
      if (jsonUrl !== undefined) {
        const { data } = await axios.get(jsonUrl);
        graph.fromJSON(data);
      } else {
        graph.fromJSON(doc.json ?? {});
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

//create react FC for UI
  const ParametersUIs: React.FC<{ uis: UINodeBase[] }> = ({ uis }) => {
    const [uiItems, setUiItems] = useState<JSX.Element[]>([]);

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
      
      setUiItems(prevItems => [...prevItems, instance]);
    };
    
    useEffect(() => {
      uis.forEach((ui, order) => {
        const found = uiItems.find(item => item.key === ui.uuid);
        if (found !== undefined) {
          return;
        }

        createUIListItem(ui, order, uis.length);
      });
    }, [uis, uiItems]);

    return (
      <ul className='fixed top-0 z-10'>
        {uiItems.map((ui, index) => <li key={index}>{ui}</li>)}
      </ul>
    )
  }
  


  useEffect(() => {
    // Append Viewer
    const root:HTMLElement|null = document.getElementById('preview');
    viewer = new Viewer(root!);
    viewer.setRenderingMode(operators.rendering);
    
    const graph = new Graph();
    initializeProject();
  },[]);  
  
  
  useEffect(() => {
    update(nodes);
  }, [nodes]);
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <div id="preview" className='fixed inset-y-0 left-0 w-1/2'></div>
        <Scene  group={group!} />
        {UIs&&<ParametersUIs uis={UIs}/>}
    </div>
  );
}

export default App;
