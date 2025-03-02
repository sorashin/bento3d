import { Edges, Html } from "@react-three/drei";
import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo, useRef } from "react";
import * as THREE from "three";
import { boxConfigAtom, cameraModeAtom, phantomSizeAtom } from "../../store";

interface SizeProps {
  label: string;
  sublabel: string;
  posX: number;
  posY: number;
  posZ: number;
  color1: string;
  color2: string;
  visible: boolean;
}
//選択してるmeshの寸法を表示するコンポーネント
const Size: FC<SizeProps> = ({
  label,
  sublabel,
  posX,
  posY,
  posZ,
  color1,
  color2,
  visible,
}) => {
  const cameraMode = useAtomValue(cameraModeAtom);
  const boxConfig = useAtomValue(boxConfigAtom);
  // const typeを定義
  // labelに"W"が含まれれば0、"H"が含まれれば1、"D"が含まれれば2
  const type = label.includes("W") ? 0 : label.includes("H") ? 1 : 2;
  if (!visible) {
    return null;
  }
  return (
    <group position={[posX, posY, posZ]}>
      <Html
        center
        zIndexRange={[0, 5]}
        transform={cameraMode === 0}
        rotation={[
          type === 1 ? -Math.PI * 0.5 : 0,
          0,
          type === 0 ? Math.PI * 0.5 : Math.PI * 1,
        ]}
        position={[
          type === 1 ? 30 : type === 0 ? 10 : 0,
          type === 2 ? 10 : 0,
          0,
        ]}
        scale={20}
      >
        <p
          className="flex flex-col items-center rounded-sm  px-2 text-center text-xs text-white text-nowrap"
          style={{ color: `${color2}` }}
        >
          {boxConfig.isOuterCase ? sublabel : label}
        </p>
      </Html>
    </group>
  );
};

interface BoundingBoxProps {
  target: React.MutableRefObject<THREE.Object3D | null>;
  color1: string;
  color2: string;
  edgeOnly?: boolean;
}

export const BoundingBox = ({
  target,
  color1,
  color2,
  edgeOnly,
}: BoundingBoxProps) => {
  const phantomSize = useAtomValue(phantomSizeAtom);
  const cameraMode = useAtomValue(cameraModeAtom);
  // const boundingBoxRef = useRef<THREE.Mesh>(null);
  //   define target as props of box

  const box = useMemo(() => {
    if (!target.current) return null;
    const bbox = new THREE.Box3().setFromObject(target.current!);
    const bCenter = new THREE.Vector3();
    bCenter.x = (bbox.max.x + bbox.min.x) / 2;
    bCenter.y = (bbox.max.y + bbox.min.y) / 2;
    bCenter.z = (bbox.max.z + bbox.min.z) / 2;

    // Get the size
    // make a BoxBufferGeometry of the same size as Box3
    const dimensions = new THREE.Vector3().subVectors(bbox.max, bbox.min);
    const geometry = new THREE.BoxGeometry(
      dimensions.x,
      dimensions.y,
      dimensions.z,
    );

    return { geometry, bCenter, dimensions, bbox };
  }, [
    target.current,
    phantomSize.width,
    phantomSize.height,
    phantomSize.depth,
  ]);
  if (!box) {
    return null;
  }

  return (
    <group>
      {/* <mesh
        scale={1.0}
        geometry={box!.geometry}
        // rotation={rotation}
        position={box!.bCenter}
      >
        <meshBasicMaterial
          // color={"red"}
          wireframe
          visible={false}
        ></meshBasicMaterial>
        <Edges
          scale={1.001}
          threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={color1}
        />
      </mesh> */}

      <Size
        label={`D:${phantomSize.depth}mm`}
        posX={box!.bCenter.x}
        posY={box!.bbox.max.y}
        posZ={box!.bbox.min.z}
        color1={color1}
        color2={color2}
        sublabel={`Case D：${phantomSize.depth + 3.5 * 2 + 6 * 2}mm`}
        visible={cameraMode !== 1 && !edgeOnly}
      />
      <Size
        label={`W:${phantomSize.width}mm`}
        posX={box!.bbox.max.x}
        posY={box!.bCenter.y}
        posZ={box!.bbox.min.z}
        color1={color1}
        color2={color2}
        sublabel={`Case W：${phantomSize.width + 3.5 * 2}mm`}
        visible={cameraMode !== 2 && !edgeOnly}
      />
      <Size
        label={`H:${phantomSize.height}mm`}
        posX={box!.bbox.max.x}
        posY={box!.bbox.min.y}
        posZ={box!.bCenter.z}
        color1={color1}
        color2={color2}
        sublabel={`Case H：${phantomSize.height + 6 + 2}mm`}
        visible={!edgeOnly}
      />
    </group>
  );
};
