
import * as THREE from 'three';
export interface IDraggable {
  position: THREE.Vector2;
  prevPosition: THREE.Vector2;
  prevMousePosition: THREE.Vector2;

  prepareDrag(e: MouseEvent): void;
  drag(e: MouseEvent, scale: number): void;

  moveTo(x: number, y: number): void;
  alignTo(x: number, y: number, r: number): void;
}
