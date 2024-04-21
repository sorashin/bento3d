import {RangeSliderHeight} from '../atoms/RangeSliderHeight';
import { RangeSliderWidth } from '../atoms/RangeSliderWidth';
import { RangeSliderDepth } from '../atoms/RangeSliderDepth';




export const SizeView = () => {
  
  return (
    <>  
        <div className='z-10 absolute'>
          <RangeSliderWidth max={200} min={50} label='Width'/>
          <RangeSliderHeight max={250} min={30} label='Height'/>
          <RangeSliderDepth max={250} min={50} label='Depth'/>
        </div>
    </>
        
  );
};
