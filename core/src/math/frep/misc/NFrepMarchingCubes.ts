import { BufferAttribute, BufferGeometry, Matrix4, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { NPoint } from '../../geometry/NPoint';
import { NFace } from '../../geometry/mesh/NFace';
import { NMesh } from '../../geometry/mesh/NMesh';
import { NMathHelper } from '../../NMathHelper';
import { NFrep } from '../NFrep';
import { FrepRenderProps, NFrepTexture } from './NFrepTexture';
import MarchingCubesWorker, { MarchingCubesProps } from '@/src/workers/MarchingCubes.worker';

type MCResult = {
  triangles: Float32Array;
  min: Vector3;
  max: Vector3;
};

export class NFrepMarchingCubes {
  public async execute (frep: NFrep, resolution: number, padding: number = 0): Promise<{
    result: MCResult[];
    dw: number;
  }> {
    const { min, max } = frep.boundingBox.getMinMax();
    const pad = new Vector3(padding, padding, padding);
    min.sub(pad);
    max.add(pad);

    // Split a volume in x direction
    const wh = resolution * resolution;
    const threshold = 16384; // 2 ^ 14;
    const divisions = Math.ceil(wh / threshold);
    const dw = Math.floor(resolution / divisions);
    const indices = [...Array(divisions).keys()];

    const size = max.clone().sub(min);
    const ds = size.x / divisions;
    const u = ds / dw;
    // const u = ds / resolution;

    // Render in current thread
    const textures = indices.map((idx) => {
      const min0 = min.clone().add(new Vector3(ds * idx, 0, 0));
      const max0 = min0.clone().add(new Vector3(ds + u, size.y, size.z));
      const texture = new NFrepTexture();
      const props = {
        frep, min: min0, max: max0, width: dw, height: resolution, depth: resolution
      };
      const buffer = texture.build(props);
      return {
        buffer,
        props
      };
    });

    const promises = textures.map((t) => {
      const { buffer, props } = t;
      return this.marchingCubes(buffer, props);
    });
    const result = await Promise.all(promises);
    return {
      result, dw
    };
  }

  private marchingCubes (buffer: Float32Array, props: FrepRenderProps): Promise<MCResult> {
    // const texture = new NFrepTexture();
    // const buffer = texture.build(props);
    const { min, max, width, height, depth } = props;
    return new Promise((resolve) => {
      const worker = new MarchingCubesWorker();
      worker.addEventListener('message', (e: any) => {
        const { data } = e as { data: { triangles: Float32Array; } };
        resolve({
          triangles: data.triangles,
          min,
          max
        });
      });
      worker.postMessage({
        buffer, width, height, depth
      } as MarchingCubesProps);
    });
  }

  public mesh (result: MCResult[], dw: number, resolution: number): Mesh[] {
    const iW = 1 / dw;
    const iR = 1 / resolution;

    return result.map((r) => {
      const { triangles, min, max } = r;
      const size = max.clone().sub(min);
      const T = new Matrix4().makeTranslation(min.x, min.y, min.z);
      const S = new Matrix4().makeScale(size.x * iW, size.y * iR, size.z * iR);
      const m = new Matrix4();
      m.multiply(T);
      m.multiply(S);
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(triangles, 3));
      geometry.applyMatrix4(m);
      return new Mesh(geometry, new MeshStandardMaterial({}));
    });
  }

  public build (result: MCResult[], dw: number, resolution: number): NMesh {
    const mesh = new NMesh();
    const iW = 1 / dw;
    const iR = 1 / resolution;

    result.forEach((r) => {
      const { triangles, min, max } = r;

      const size = max.clone().sub(min);
      const T = new Matrix4().makeTranslation(min.x, min.y, min.z);
      const S = new Matrix4().makeScale(size.x * iW, size.y * iR, size.z * iR);
      const m = new Matrix4();
      m.multiply(T);
      m.multiply(S);

      const n = triangles.length;
      for (let i = 0; i < n; i += 9) {
        const ax = triangles[i];
        const ay = triangles[i + 1];
        const az = triangles[i + 2];
        const bx = triangles[i + 3];
        const by = triangles[i + 4];
        const bz = triangles[i + 5];
        const cx = triangles[i + 6];
        const cy = triangles[i + 7];
        const cz = triangles[i + 8];
        const a = new NPoint(ax, ay, az).applyMatrix4(m);
        const b = new NPoint(bx, by, bz).applyMatrix4(m);
        const c = new NPoint(cx, cy, cz).applyMatrix4(m);
        const n = NMathHelper.normalFrom3Points(a, c, b);
        const idx = mesh.vertices.length;
        mesh.vertices.push(a, b, c);
        mesh.normals.push(n, n, n);
        mesh.faces.push(new NFace(idx, idx + 2, idx + 1));
      }
    });

    return mesh;
  }
}
