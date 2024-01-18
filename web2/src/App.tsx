import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph, IElementable } from '@nodi/core';
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

  let viewer: Viewer;
  const [elements, setElements] = useState<IElementable[]>(); //elements for viewer
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
        setElements(viewer.elements);
      });

      const { jsonUrl } = project;
      if (jsonUrl !== undefined) {
        const { data } = await axios.get(jsonUrl);
        graph.fromJSON(data);
        console.log("DATA",data);
      } else {
        graph.fromJSON(doc.json ?? {});
      }

      return Promise.resolve();
    }
    return Promise.reject(new Error('You do not have read access to this project'));
  }


  useEffect(() => {
    // Append Viewer
    const root:HTMLElement|null = document.getElementById('preview');
    viewer = new Viewer(root!);
    
    const graph = new Graph();
    initializeProject();
    

    
    
  },[]);  
  useEffect(() => {
    console.log("ELEMENTS", elements);
  }, [elements]);

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
        <Scene elements={elements!} />
    </div>
  );
}

export default App;
