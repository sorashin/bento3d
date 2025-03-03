import * as THREE from "three";
import { useRef, useMemo, useLayoutEffect, ReactElement } from "react";

interface HingeGeometryProps {
  width?: number;
  height?: number;
  depth?: number;
}

export function HingeGeometry({
  width = 1,
  height = 1,
  depth = 1,
}: HingeGeometryProps): ReactElement {
  const geometryRef = useRef<THREE.ExtrudeGeometry | null>(null);
  const shape = useMemo(() => {
    const radius = 3;
    const s = new THREE.Shape();
    s.moveTo(-3, 6);
    // s.lineTo(1.5, 1.5);
    s.absarc(0, 0, radius, 0.25 * Math.PI, 1.75 * Math.PI, true);
    // s.lineTo(1.5, -1.5);
    s.lineTo(-3, -6);
    s.lineTo(-3, 6);
    return s;
  }, [width, height]);

  const config = useMemo(() => ({ depth, bevelEnabled: false }), [depth]);

  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.translate(0, 0, -depth / 2);
      geometryRef.current.computeVertexNormals();
    }
  }, [shape, depth]);

  return <extrudeGeometry ref={geometryRef} args={[shape, config]} />;
}
