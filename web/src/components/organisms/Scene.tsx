
import { useThree, Canvas, useFrame } from '@react-three/fiber'
import {   Edges, GizmoHelper, GizmoViewport, OrbitControls, Stage } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IElementable } from '@nodi/core';
import * as THREE from 'three';
import { JSX } from 'react/jsx-runtime';
import { Bounds} from '@react-three/drei'
import { DoubleSide } from 'three';
import { Plant } from '../three/Plant';
import { useAtom, useAtomValue } from 'jotai';
import { selectedColorAtom } from '../../store';
import { Tray } from '../three/Tray';
import { elementsAtom } from '../../store/scene';

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

const Content: React.FC<{ group: THREE.Group }> = ({ group }) => {
  const contentRef = useRef<THREE.Group>(null);
  const elements = useAtomValue(elementsAtom);
  const [color,] = useAtom(selectedColorAtom);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const rotationSpeed = 0.2; // 回転速度

    // Z軸周りに回転
    if (contentRef.current) {
      contentRef.current.rotation.z = elapsedTime * rotationSpeed;
    }
  });
  return(
    <group ref={contentRef}>
        {elements.map((element, index) => {
          //delete element before render

          return(
            <primitive object={element} key={index} />
          )
        })}
        
              <Tray/>
            {/* <mesh>
              <boxGeometry args={[10, 10, 10]} />
              <meshStandardMaterial color={new THREE.Color(`${color}`)} />
            </mesh> */}
    </group>
  )
}

interface SceneProps {
  group: THREE.Group;
}

export const Scene: React.FC<SceneProps> = ({ group }) => {
  return (
    <div className='fixed inset-0'>
      <Canvas camera={{ fov: 50, position: [300, 300, 300] }}>
        <CanvasSetup/>
        
            <Content group={group}/>
            {/* <Plant/> */}
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
