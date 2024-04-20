import React, { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { GridEditor } from '../molecules/GridEditor';




export const GridView = () => {
  
    

  return (
    <div className='absolute inset-0 flex items-center justify-center z-10'>
      <div className='w-1/2 h-1/2'>
        <GridEditor/>
      </div>
    </div>
        
  );
};
