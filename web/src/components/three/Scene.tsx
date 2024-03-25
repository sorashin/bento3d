
import { useThree, Canvas, useFrame } from '@react-three/fiber'
import {   Edges, GizmoHelper, GizmoViewport, Html, OrbitControls, Stage } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { atom, useAtom, useAtomValue } from 'jotai';
import { boxConfigAtom, screenModeAtom, selectedColorAtom } from '../../store';
import { elementsAtom } from '../../store/scene';
import { THREEGridEditor } from '../molecules/THREEGridEditor';

const CanvasSetup: React.FC = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.up.set(0, 0, 1);
  }, [camera]);

  return (
    <>
    <color attach="background" args={['#dadada']} />
    {/* <primitive object={new THREE.AxesHelper(10)} /> */}
    <GizmoHelper alignment="bottom-left" margin={[80, 80]} onUpdate={() => {}}>
          <GizmoViewport axisColors={['#FD5B5D', '#38E2B3', '#2B99FF']} labelColor="#fff" />
        </GizmoHelper>
        <group rotation={[Math.PI/2,0,0]} scale={10}>
        <gridHelper args={[20, 20, 0xbbbbbb, 0xcccccc]} />
        </group>
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} makeDefault dampingFactor={0.3} />
    </>
  )
}
const GridEditView: React.FC = () => {
  const { totalWidth, totalHeight } = useAtomValue(boxConfigAtom);
  return (
    <group>
      <Html
      position={[0, 0, totalHeight]}
      rotation={[0, 0, 0]}
      transform
      scale={1.0}
      // occlude="blending"
    >
      <THREEGridEditor/>
    </Html>
    </group>
  )

}
const Annotation: React.FC<{ children: React.ReactNode, position: [number, number, number], onClick: () => void }> = ({ children, position, onClick, ...props }) => {
  
  return (
    <Html
      {...props}
      position={position}
      rotation={[Math.PI/2, 0, 0]}
      transform
      scale={20}
      // occlude="blending"
    >
      <div className="annotation px-4 py-2 rounded-lg text-white bg-content-dark cursor-pointer" onClick={onClick}>
        {children}
      </div>
    </Html>
  )
}

const Content: React.FC<{ group: THREE.Group }> = ({ group }) => {
  const contentRef = useRef<THREE.Group>(null);
  const [, setScreenMode] = useAtom(screenModeAtom);
  const {totalWidth, totalHeight} = useAtomValue(boxConfigAtom)
  
  return(
  <>
  
      <GridEditView/>
    <group ref={contentRef}>
      {/* <Annotation position={[0, 0, totalHeight]} onClick={()=>setScreenMode(1)}>グリッド</Annotation> */}
      {/* <Annotation position={[totalWidth/2, 0, totalHeight/2]} onClick={()=>setScreenMode(2)}>高さ</Annotation> */}
        {group&&group.children.map((element, index) => {
          return(
            <primitive object={element} key={element.uuid} >
              <Edges
                // linewidth={4}
                scale={1.0}
                threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                color="#cccccc"
              />
            </primitive>
          )
        })}
    </group>
    
  </>
  )
}

interface SceneProps {
  group: THREE.Group;
}

export const Scene: React.FC<SceneProps> = ({ group }) => {
  
  return (
    <div className='fixed inset-0'>
      <Canvas camera={{ fov: 50, position: [300, 300, 300] }} >
        <CanvasSetup/>
            <Content group={group}/>
            
          <ambientLight intensity={0.5}/>
          <hemisphereLight intensity={0.5} groundColor="white" />
          <directionalLight position={[10, 15, -10]} intensity={0.8} />
          <spotLight position={[5, 10, -15]} intensity={1} angle={0.1} penumbra={1} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.000001} />
        
        {/* <ArcballControls  enablePan={false} makeDefault /> */}
      </Canvas>
    </div>
  )
}

export default Scene
