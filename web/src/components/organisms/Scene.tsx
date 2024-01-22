
import { useThree, Canvas, useFrame } from '@react-three/fiber'
import {   Edges, GizmoHelper, GizmoViewport, OrbitControls, Stage } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IElementable } from '@nodi/core';
import * as THREE from 'three';
import { JSX } from 'react/jsx-runtime';
import { Bounds} from '@react-three/drei'


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
        <group rotation={[Math.PI/2,0,0]}>
        <gridHelper args={[20, 20, 0xbbbbbb, 0xcccccc]} />
        </group>
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} makeDefault dampingFactor={0.3} />
    </>
  )
}

const Content: React.FC<{ group: THREE.Group }> = ({ group }) => {
  const contentRef = useRef<THREE.Group>(null);
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
            {group && (
              //apply hotpink color to group
              group.children.map((child, index) => {
                return(
              <primitive object={child} key={index} >
                {/* <meshStandardMaterial transparent opacity={0.1}/> */}
                <meshStandardMaterial color={new THREE.Color("rgb(210, 182, 196)")}/>
                {/* set #333333 color to <Edge> */}

                <Edges color={new THREE.Color("rgb(196, 196, 196)")}/>

              </primitive>
                )
              })
            )}
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
        
        <Suspense fallback={null}>
          <Stage shadows={"contact"}>
            <Content group={group}/>
          </Stage>
          <ambientLight />
          <hemisphereLight intensity={0.4} groundColor="white" />
          <directionalLight position={[10, 15, -10]} intensity={0.5} />
          <spotLight position={[5, 10, -15]} intensity={1} angle={0.1} penumbra={1} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.000001} />
        </Suspense>
        
        {/* <ArcballControls  enablePan={false} makeDefault /> */}
      </Canvas>
    </div>
  )
}

export default Scene
