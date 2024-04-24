import {RangeSliderHeight} from '../atoms/RangeSliderHeight';
import { RangeSliderWidth } from '../atoms/RangeSliderWidth';
import { RangeSliderDepth } from '../atoms/RangeSliderDepth';
import { showCaseAtom } from '../../store';
import { useAtom, useAtomValue } from 'jotai';




export const SizeView = () => {
  const [showCase, setShowCase] = useAtom(showCaseAtom);
  return (
    <>  
        <div className='z-10 absolute'>
          <RangeSliderWidth max={200} min={50} label='Width' />
          <RangeSliderHeight max={250} min={10} label='Height' />
          <RangeSliderDepth max={250} min={50} label='Depth'/>
          <div className='fixed flex gap-2 items-center bottom-8 right-8 text-xs text-content-light-a'>
            <label>Partition</label>
            <input type="checkbox" className="toggle  [--tglbg:#eeeeee] hover:[--tglbg:#dddddd] bg-content-dark border-content-middle" 
            checked={showCase} 
            onClick={()=> setShowCase(!showCase)}/>
            <label>Case</label>
          </div>
        </div>
    </>
        
  );
};
