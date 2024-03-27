import { useAtom } from 'jotai';
import './App.css';
import { PreviewView } from './components/organisms/PreviewView';
import { screenModeAtom } from './store';
import { Header } from './components/molecules/Header';



function App() {
  
  
  return (
    <>
    <Header/>
    <PreviewView/>
    </>
  );
}

export default App;
