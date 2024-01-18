import React, { useEffect, useRef } from 'react';
import { Camera, Quaternion, Vector3 } from 'three';

interface AxisElement {
  type: string;
  x: number;
  y: number;
  z: number;
  set(position: Vector3): void;
  position: Vector3;
}

class Text implements AxisElement {
  type: string;
  x: number;
  y: number;
  z: number;
  content: string;

  constructor(content: string) {
    this.type = 'text';
    this.x = 50;
    this.y = 50;
    this.z = 0;
    this.content = content;
  }

  set(position: Vector3) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
  }

  get position(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

class Circle implements AxisElement {
  type: string;
  x: number;
  y: number;
  z: number;
  cls: string;
  direction: Vector3;

  constructor(cls: string, direction: Vector3) {
    this.type = 'circle';
    this.x = 50;
    this.y = 50;
    this.z = 0;
    this.cls = cls;
    this.direction = direction;
  }

  set(position: Vector3) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
  }

  get position(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

interface AxisProps {
  onClick: (direction: Vector3) => void;
}

const Axis: React.FC<AxisProps> = ({ onClick }) => {
  const lxRef = useRef<SVGLineElement>(null);
  const lyRef = useRef<SVGLineElement>(null);
  const lzRef = useRef<SVGLineElement>(null);

  const elements: AxisElement[] = [];
  const x0 = new Circle('x', new Vector3(-1, 0, 0));
  const x1 = new Circle('x', new Vector3(1, 0, 0));
  const y0 = new Circle('y', new Vector3(0, -1, 0));
  const y1 = new Circle('y', new Vector3(0, 1, 0));
  const z0 = new Circle('z', new Vector3(0, 0, -1));
  const z1 = new Circle('z', new Vector3(0, 0, 1));
  const tx = new Text('X');
  const ty = new Text('Y');
  const tz = new Text('Z');

  useEffect(() => {
    const update = (camera: Camera) => {
      let q = new Quaternion().setFromEuler(camera.rotation);
      q = q.invert();

      const r = 38;
      const off = 50;

      // Sort elements
      const sortedElements: AxisElement[] = [x0, x1, y0, y1, z0, z1].map((c) => {
        const v = c.direction.clone().applyQuaternion(q);
        v.y *= -1;
        v.multiplyScalar(r).addScalar(off);
        c.set(v);
        return c;
      });
      sortedElements.sort((a, b) => {
        return a.z - b.z;
      });

      tx.set(x1.position);
      ty.set(y1.position);
      tz.set(z1.position);

      sortedElements.splice(sortedElements.indexOf(x1) + 1, 0, tx);
      sortedElements.splice(sortedElements.indexOf(y1) + 1, 0, ty);
      sortedElements.splice(sortedElements.indexOf(z1) + 1, 0, tz);

      elements = sortedElements;

      const offset = '50';
      lxRef.current!.setAttribute('x1', `${x1.x}`);
      lxRef.current!.setAttribute('y1', `${x1.y}`);
      lxRef.current!.setAttribute('x2', offset);
      lxRef.current!.setAttribute('y2', offset);

      lyRef.current!.setAttribute('x1', `${y1.x}`);
      lyRef.current!.setAttribute('y1', `${y1.y}`);
      lyRef.current!.setAttribute('x2', offset);
      lyRef.current!.setAttribute('y2', offset);

      lzRef.current.setAttribute('x1', `${z1.x}`);
      lzRef.current.setAttribute('y1', `${z1.y}`);
      lzRef.current.setAttribute('x2', offset);
      lzRef.current.setAttribute('y2', offset);
    };

    // Call the update function with the camera instance
    // Example: update(camera);

    return () => {
      // Clean up any resources if needed
    };
  }, []);

  return (
    <svg className="axis no-select" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <line
          ref={lxRef}
          x1="50"
          y1="50"
          x2="50"
          y2="50"
          strokeWidth="2"
          stroke="#ff2b56"
        />
        <line
          ref={lyRef}
          x1="50"
          y1="50"
          x2="50"
          y2="50"
          strokeWidth="2"
          stroke="#19bf6c"
        />
        <line
          ref={lzRef}
          x1="50"
          y1="50"
          x2="50"
          y2="50"
          strokeWidth="2"
          stroke="#428dff"
        />
        {elements.map((el, idx) => {
          if (el.type === 'circle') {
            return (
              <circle
                key={idx}
                r="10"
                cx={el.x}
                cy={el.y}
                className={el.cls}
                onClick={() => onClick(el.direction)}
              />
            );
          } else if (el.type === 'text') {
            return (
              <text
                key={idx}
                className="text-mono"
                x={el.x}
                y={el.y}
                fontSize="12"
              >
                {el.content}
              </text>
            );
          }
          return null;
        })}
      </g>
    </svg>
  );
};

export default Axis;
