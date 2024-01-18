import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph } from '@nodi/core';
import Project from './assets/scripts/service/Project';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userStateAtom } from './store/user';
import { getProject } from './firebase/firebase';




function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] =useState("TtmQukE3aczIe31dTMbE");
  //get useStateAtom from /store
  const [user, setuser] = useAtom(userStateAtom);


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
        // this.$refs.Viewer.update(e.nodes);
      });

      const { jsonUrl } = project;
      if (jsonUrl !== undefined) {
        const { data } = await axios.get(jsonUrl);
        graph.fromJSON(data);
        console.log(data);
      } else {
        graph.fromJSON(doc.json ?? {});
      }

      return Promise.resolve();
    }
    return Promise.reject(new Error('You do not have read access to this project'));
  }


  useEffect(() => {
    const graph = new Graph();
    initializeProject();
  },[]);  

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
    </div>
  );
}

export default App;
