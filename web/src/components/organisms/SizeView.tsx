import {RangeSliderHeight} from '../atoms/RangeSliderHeight';
import { RangeSliderWidth } from '../atoms/RangeSliderWidth';
import { RangeSliderDepth } from '../atoms/RangeSliderDepth';
import { showCaseAtom } from '../../store';
import { useAtom, useAtomValue } from 'jotai';




export const SizeView = () => {
  
  return (
    <>  
        <div className='z-10 absolute'>
          <RangeSliderWidth max={200} min={30} label='Width' />
          <RangeSliderHeight max={250} min={10} label='Height' />
          <RangeSliderDepth max={250} min={30} label='Depth'/>
          
        </div>
    </>
        
  );
};
