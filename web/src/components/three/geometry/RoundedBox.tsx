import * as THREE from 'three';
import { useRef, useMemo, useLayoutEffect, ReactElement } from 'react';

interface RoundedBoxProps {
  width?: number;
  height?: number;
  radius?: number;
  depth?: number;
}

export function RoundedBox({
  width = 1,
  height = 1,
  radius = 0.2,
  depth = 1
}: RoundedBoxProps): ReactElement {
  const geometryRef = useRef<THREE.ExtrudeGeometry | null>(null);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, -height / 2 + radius);
    s.lineTo(-width / 2, height / 2 - radius);
    s.absarc(-width / 2 + radius, height / 2 - radius, radius, Math.PI, 0.5 * Math.PI, true);
    s.lineTo(width / 2 - radius, height / 2);
    s.absarc(width / 2 - radius, height / 2 - radius, radius, 0.5 * Math.PI, 0, true);
    s.lineTo(width / 2, -height / 2 + radius);
    s.absarc(width / 2 - radius, -height / 2 + radius, radius, 2 * Math.PI, 1.5 * Math.PI, true);
    s.lineTo(-width / 2 + radius, -height / 2);
    s.absarc(-width / 2 + radius, -height / 2 + radius, radius, 1.5 * Math.PI, Math.PI, true);
    return s;
  }, [width, height, radius]);

  const config = useMemo(() => ({ depth, bevelEnabled: false }), [depth]);

  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.translate(0, 0, -depth / 2);
      geometryRef.current.computeVertexNormals();
    }
  }, [shape, depth]);

  return <extrudeGeometry ref={geometryRef} args={[shape, config]} />;
}
