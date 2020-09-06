import alfrid from "alfrid";
import Config from "./Config.js";
import vs from "./shaders/trails.vert";
import fs from "./shaders/trails.frag";

class DrawTrails extends alfrid.Draw {
  constructor() {
    super();

    const positions = [];
    const uvs = [];
    const indices = [];
    let count = 0;

    const num = 14;
    const numSides = 4;

    for (let i = 0; i < num; i++) {
      // console.log(i + 1);
      for (let j = 0; j < numSides; j++) {
        positions.push([i, j, 0]);
        positions.push([i + 1, j, 0]);
        positions.push([i + 1, j + 1, 0]);
        positions.push([i, j + 1, 0]);

        uvs.push([i / num, j / numSides]);
        uvs.push([(i + 1) / num, j / numSides]);
        uvs.push([(i + 1) / num, (j + 1) / numSides]);
        uvs.push([i / num, (j + 1) / numSides]);

        indices.push(count * 4 + 0);
        indices.push(count * 4 + 1);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 0);
        indices.push(count * 4 + 2);
        indices.push(count * 4 + 3);

        count++;
      }
    }

    const mesh = new alfrid.Mesh();
    mesh.bufferVertex(positions);
    mesh.bufferTexCoord(uvs);
    mesh.bufferIndex(indices);

    // instancing
    const { numParticles } = Config;
    const posOffsets = [];
    for (let i = 0; i < numParticles; i++) {
      for (let j = 0; j < numParticles; j++) {
        posOffsets.push([
          i / numParticles,
          j / numParticles,
          Math.random(),
          Math.random(),
        ]);
      }
    }
    mesh.bufferInstance(posOffsets, "aPosOffset");

    this.setMesh(mesh).useProgram(vs, fs).uniform("uRadius", "float", 0.015);
  }
}

export default DrawTrails;
