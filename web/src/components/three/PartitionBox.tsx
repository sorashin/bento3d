import { Box, Edges } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { boxConfigAtom, colorPaletteAtom, phantomSizeAtom } from "../../store";
import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";
import { RoundedBox } from "./geometry/RoundedBox";
import * as THREE from "three";
import { group } from "console";
import { HingeGeometry } from "./geometry/Hinge";
import { RoundedLine } from "./geometry/RoundedLine";
import { BoundingBox } from "./BoundingBox";

type PartitionBoxProps = {
  width: number;
  height: number;
  depth: number;
  thickness: number;
};
export const PartitionBox: React.FC<PartitionBoxProps> = ({
  width,
  height,
  depth,
  thickness,
}) => {
  const boxRef = useRef<THREE.Group>(null);
  const partitionRef = useRef<THREE.Mesh>(null);
  const boxConfig = useAtomValue(boxConfigAtom);
  const colorPalette = useAtomValue(colorPaletteAtom);
  const phantomSize = useAtomValue(phantomSizeAtom);
  return (
    <>
      <group position={[0, 0, phantomSize.height / 2 - 50]} ref={boxRef}>
        <mesh ref={partitionRef}>
          <RoundedBox
            width={depth}
            height={width}
            depth={height}
            radius={boxConfig.fillet}
          />
          <meshStandardMaterial color={"#ffffff"} transparent opacity={0.8} />
        </mesh>
        {/* stack部分 */}
        {boxConfig.isStack && (
          <mesh position={[0, 0, -height / 2 - thickness / 2]}>
            <RoundedBox
              width={depth - thickness * 2}
              height={width - thickness * 2}
              depth={thickness}
              radius={boxConfig.fillet}
            />
            <meshStandardMaterial color={"#ffffff"} transparent opacity={0.8} />
          </mesh>
        )}
        {/* <mesh position={[100,0,0]}>
                    <RoundedLine width={depth} height={width} depth={height} radius={boxConfig.fillet}></RoundedLine>
                    <meshStandardMaterial color={'#ffffff'}/>
                </mesh> */}
        {
          // outer
          boxConfig.isOuterCase && (
            <>
              {/* box */}
              <mesh position={[0, 0, 2]}>
                <RoundedBox
                  width={depth + 6}
                  height={width + 6}
                  depth={height + 8}
                  radius={boxConfig.fillet}
                />
                <meshStandardMaterial
                  color={colorPalette[boxConfig.colorMode].primary}
                  transparent
                  opacity={0.2}
                />
                {/* <Edges　scale={1.0}　threshold={15} color={'#999'}/> */}
              </mesh>
              {/* latch */}
              <mesh
                position={[
                  5.8 / 2 + (depth + 6) / 2,
                  0,
                  phantomSize.height / 2 - 22 / 2 + 6,
                ]}
                rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]}
              >
                <RoundedBox
                  width={22}
                  height={5.8}
                  depth={35}
                  radius={boxConfig.fillet}
                />
                <meshStandardMaterial
                  color={colorPalette[boxConfig.colorMode].primary}
                  transparent
                  opacity={0.2}
                />
                {/* <Edges　scale={1.0}　threshold={15} color={'#999'}/> */}
              </mesh>
              {/* hinge */}
              <mesh
                position={[-depth / 2 - 3 - 3, 0, height / 2]}
                rotation={[0.5 * Math.PI, 0, Math.PI]}
              >
                <HingeGeometry depth={29} />
                <meshStandardMaterial
                  color={colorPalette[boxConfig.colorMode].primary}
                  transparent
                  opacity={0.2}
                />
                {/* <Edges　scale={1.0}　threshold={15} color={'#999'}/> */}
              </mesh>
            </>
          )
        }
      </group>
      <BoundingBox target={partitionRef} color1={"#7e5bef"} color2={"#999"} />
    </>
  );
};
