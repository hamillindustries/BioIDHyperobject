import alfrid, { GL } from "alfrid";

class DrawFloor extends alfrid.Draw {
  constructor() {
    super();

    const s = 4;
    this.setMesh(alfrid.Geom.plane(s, s, 1, "xz"))
      .useProgram(null, alfrid.ShaderLibs.simpleColorFrag)
      .uniform("color", "vec3", [1, 1, 1])
      .uniform("opacity", "float", 0.1);
  }
}

export default DrawFloor;
