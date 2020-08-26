import alfrid, { GL } from "alfrid";

import Config from "./Config";
import vs from "shaders/points.vert";
import fs from "shaders/points.frag";

class DrawPoints extends alfrid.Draw {
  constructor() {
    super();

    const { numParticles: num } = Config;

    const positions = [];
    const uvs = [];
    const indices = [];
    let index = 0;
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        positions.push([Math.random(), Math.random(), Math.random()]);
        uvs.push([i / num, j / num]);
        indices.push(index);
        index++;
      }
    }

    const mesh = new alfrid.Mesh(GL.POINTS);
    mesh.bufferVertex(positions);
    mesh.bufferTexCoord(uvs);
    mesh.bufferIndex(indices);

    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uColor", "vec3", [1, 0, 0])
      .uniform("uOpacity", "float", 1);
  }
}

export default DrawPoints;
