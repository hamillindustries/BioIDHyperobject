import alfrid, { GL } from "alfrid";

import Config from "./Config";
import { random } from "randomutils";
import vs from "shaders/save.vert";
import fs from "shaders/save.frag";

class DrawSave extends alfrid.Draw {
  constructor() {
    super();

    const { numParticles: num } = Config;

    const positions = [];
    const uvs = [];
    const indices = [];
    const normals = [];
    let index = 0;

    const getPos = () => {
      return [random(-1, 1), 0, random(-1, 1)];
    };

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        positions.push(getPos());
        uvs.push([(i / num) * 2 - 1, (j / num) * 2 - 1]);
        normals.push([Math.random(), Math.random(), Math.random()]);
        indices.push(index);
        index++;
      }
    }
    const mesh = new alfrid.Mesh(GL.POINTS);
    mesh.bufferVertex(positions);
    mesh.bufferTexCoord(uvs);
    mesh.bufferNormal(normals);
    mesh.bufferIndex(indices);

    this.useProgram(vs, fs).setMesh(mesh);
  }
}

export default DrawSave;
