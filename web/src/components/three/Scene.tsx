
import { useThree, Canvas, useFrame } from '@react-three/fiber'
import {   Box, Edges, GizmoHelper, GizmoViewport, Html, OrbitControls, PresentationControls, Stage } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { atom, useAtom, useAtomValue } from 'jotai';
import { DLButtonElementsAtom, boxConfigAtom, cameraModeAtom, colorPaletteAtom, phantomSizeAtom, stepAtom } from '../../store';
import { elementsAtom } from '../../store/scene';
import { MotionValue, animate, useMotionValue } from 'framer-motion';
import { PartitionBox } from './PartitionBox';

const CanvasSetup: React.FC = () => {
  const { camera } = useThree();
  const boxConfig = useAtomValue(boxConfigAtom);

  useLayoutEffect(() => {
    camera.up.set(0, 0, 1);
  }, [camera]);

  return (
    <>
    <color attach="background" args={['#cccccc']} />
    {/* <primitive object={new THREE.AxesHelper(10)} /> */}
    {boxConfig.viewMode===2&&<GizmoHelper alignment="bottom-left" margin={[80, 80]} onUpdate={() => {}} renderOrder={2}>
          <GizmoViewport axisColors={['#FD5B5D', '#38E2B3', '#2B99FF']} labelColor="#fff" />
        </GizmoHelper>}
        <group position={[0,0,-50]} rotation={[Math.PI/2,0,0]} scale={10}>
          <gridHelper args={[20, 20, 0xbbbbbb, 0xcccccc]} />
        </group>
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={boxConfig.viewMode===2?true: false} makeDefault dampingFactor={0.3} />
    </>
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
  const boxConfig = useAtomValue(boxConfigAtom);
  const colorPalette = useAtomValue(colorPaletteAtom);
  const phantomSize = useAtomValue(phantomSizeAtom);
  
  return(
  <>
    {(boxConfig.viewMode===0)&&<PartitionBox depth={phantomSize.depth} width={phantomSize.width} height={phantomSize.height}/>}
    {boxConfig.viewMode===2&&(
      <group ref={contentRef} position={[0,0,-50]}>
      
      {/* <Annotation position={[0, 0, totalHeight]} onClick={()=>setScreenMode(1)}>グリッド</Annotation> */}
      {/* <Annotation position={[totalWidth/2, 0, totalHeight/2]} onClick={()=>setScreenMode(2)}>高さ</Annotation> */}
        {group&&group.children.map((element, index) => {
          return(
            
            <primitive object={element} key={element.uuid} >
                {/* 0 : lid */}
                {/* 1 : box */}
                {/* 2 : shikiri */}
                {/* 3 : latch */}
                
                {(index === 0||index === 1||index === 3)&&<meshStandardMaterial color={`${colorPalette[boxConfig.colorMode].primary}`} />}
                {(index === 2)&&<Edges
                  // linewidth={4}
                  scale={1.0}
                  threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                  color="#aaaaaa"
                />}

              </primitive>
          )


        })}
    </group>
    )}
    
  </>
  )
}

interface SceneProps {
  group?: THREE.Group;
}

export const Scene: React.FC<SceneProps> = ({ group }) => {
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);
  const [phantomSize, setPhantomSize] = useAtom(phantomSizeAtom);
  const [cameraMode, setCameraMode] = useAtom(cameraModeAtom);
  // motionValueを作成
  const cameraX = useMotionValue(300);
  const cameraY = useMotionValue(300);
  const cameraZ = useMotionValue(300);
  useLayoutEffect(() => {
    if(cameraMode === 0){
      animate(cameraX, 300, {duration: .2});
      animate(cameraY, 300, {duration: .2});
      animate(cameraZ, 300, {duration: .2});
    }else if(cameraMode === 1){//Front View
      animate(cameraX, 300, {duration: .2});
      animate(cameraY, 0, {duration: .2});
      animate(cameraZ, 0, {duration: .2});
    }else if(cameraMode === 2){//SideView
      animate(cameraX, 0, {duration: .2});
      animate(cameraY, 300, {duration: .2});
      animate(cameraZ, 0, {duration: .2});
    }
  }, [cameraMode]);

  const syncPhantomSize = () => {
    setPhantomSize((prevPhantomSize) => {
      return {
          ...prevPhantomSize,
          width: boxConfig.totalWidth,
          height: boxConfig.height,
          depth: boxConfig.totalDepth,
      }
  })
  }
  useEffect(() => {
    syncPhantomSize()
  }, [boxConfig.totalDepth, boxConfig.totalWidth, boxConfig.height]);
  const CameraPositionUpdater = ({ x, y, z }: { x: MotionValue, y: MotionValue, z: MotionValue }) => {
    const { camera } = useThree();
    
    useFrame(() => {
      if(boxConfig.viewMode!==2){

        camera.position.x = x.get();
        camera.position.y = y.get();
        camera.position.z = z.get();
        
        camera.updateProjectionMatrix();
      }
    });
  
    return null;
  };
  
  
  return (
    <div className={`fixed  top-0 left-0 ${boxConfig.viewMode===2?'inset-y-0 w-2/3':'inset-0'}`}>
      <Canvas orthographic camera={{ fov: 50, position: [cameraX.get(), cameraY.get(), cameraZ.get()] }}  >
        <CameraPositionUpdater x={cameraX} y={cameraY} z={cameraZ}  />
        <CanvasSetup/>
        <Content group={group!}/>
        
            
          <ambientLight intensity={0.5}/>
          <hemisphereLight intensity={0.5} groundColor="white" />
          <directionalLight position={[100, 150, 1000]} intensity={0.5} />
          <spotLight position={[5000, 1000, 1500]} intensity={.1} angle={0.8} penumbra={1} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.000001} />
        
        {/* <ArcballControls  enablePan={false} makeDefault /> */}
      </Canvas>
      

    </div>
  )
}

export default Scene
