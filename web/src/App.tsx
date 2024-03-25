import { useAtom } from 'jotai';
import './App.css';
import { PreviewView } from './components/organisms/PreviewView';
import {GridView} from './components/organisms/GridView';
import { screenModeAtom } from './store';
import { Header } from './components/molecules/Header';



function App() {
  
  const [screenMode, setScreenMode] = useAtom(screenModeAtom);
  
  return (
    <>
    <Header/>
    <PreviewView/>
    {screenMode === 0 ? null : <GridView/>}
    </>
  );
}

export default App;
