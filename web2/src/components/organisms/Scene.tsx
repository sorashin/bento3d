
import { Canvas } from '@react-three/fiber'
import {   GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect } from 'react';
import { IElementable } from '@nodi/core';


interface SceneProps {
    elements: IElementable[];
  }
export const Scene: React.FC<SceneProps> = ({ elements }) => {
  
    
  
  return (
    <div className='fixed inset-y-0 right-0 w-1/2'>
      
    <Canvas camera={{ fov: 50, position: [3, 3, 3] }}>
      <color attach="background" args={['#dadada']} />
      <Suspense fallback={null}>
    {/* create <mesh> from elements*/}
    
      <mesh
        scale={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
      
        <ambientLight/>
        <hemisphereLight intensity={0.4} groundColor="white" />
        <directionalLight position={[10, 15, -10]} intensity={0.5} />
        <spotLight position={[5, 10, -15]} intensity={1} angle={0.1} penumbra={1} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.000001} />
      </Suspense>
      {/* <primitive object={new THREE.AxesHelper(10)} /> */}
      <GizmoHelper alignment="bottom-left" margin={[80, 80]} onUpdate={() => {}}>
        <GizmoViewport axisColors={['#FD5B5D', '#38E2B3', '#2B99FF']} labelColor="#fff" />
      </GizmoHelper>
      <gridHelper args={[20, 20, 0xbbbbbb, 0xcccccc]} />
      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} makeDefault dampingFactor={0.3}/>
      {/* <ArcballControls  enablePan={false} makeDefault /> */}
    </Canvas>
    </div>
  )
}

export default Scene
