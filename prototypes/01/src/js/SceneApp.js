// SceneApp.js

import alfrid, { Scene, GL } from "alfrid";
import ViewObjModel from "./ViewObjModel";
import Assets from "./Assets";
import Config from "./Config";
import DrawFloor from "./DrawFloor";
import DrawSave from "./DrawSave";
import DrawPoints from "./DrawPoints";
import DrawTrails from "./DrawTrails";
import { saveImage, resize, getDateString } from "./utils";
import { mat4 } from "gl-matrix";
import fsSim from "shaders/sim.frag";

let hasSaved = false;
const NUM_SETS = 10;
const TOTAL_FRAMES = 15 * NUM_SETS;

class SceneApp extends Scene {
  constructor() {
    super();
    GL.enableAlphaBlending();
    // this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
    // this.orbitalControl.radius.value = 5;

    this.orbitalControl.rx.setTo(0.3);
    this.orbitalControl.ry.setTo(0.3);
    this.orbitalControl.radius.setTo(13);
    this.camera.setPerspective((45 * Math.PI) / 180, GL.aspectRatio, 1, 30);

    this.mtx = mat4.create();
    mat4.translate(this.mtx, this.mtx, [0, -3, 0]);
    this.count = 0;

    this.resize();
  }

  _initTextures() {
    const { numParticles: num } = Config;

    const oSettings = {
      type: GL.FLOAT,
      minFilter: GL.NEAREST,
      magFilter: GL.NEAREST,
    };
    // init fboArray
    this._fbo = new alfrid.FboArray(TOTAL_FRAMES, num, num, oSettings, 3);
  }

  _initViews() {
    console.log("init views");

    this._bCopy = new alfrid.BatchCopy();
    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
    this._bBall = new alfrid.BatchBall();

    this._drawFloor = new DrawFloor();

    // draw save
    new DrawSave()
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    // draw sim
    this._drawSim = new alfrid.Draw()
      .setMesh(alfrid.Geom.bigTriangle())
      .useProgram(alfrid.ShaderLibs.bigTriangleVert, fsSim)
      .setClearColor(0, 0, 0, 0)
      .uniform("uSeed", "float", Math.random() * 0xff);

    // draw trails
    this._drawTrails = new DrawTrails();
    this._drawTrails.uniform("uNumSets", "float", NUM_SETS);

    // debug POINTS
    this._drawPoints = new DrawPoints();

    let i = TOTAL_FRAMES;
    while (i--) {
      this.updatePos();
    }
  }

  updatePos() {
    if (this.count++ > TOTAL_FRAMES - 1) {
      return;
    }

    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .uniformTexture("texturePos", this._fbo.read.getTexture(0), 0)
      .uniformTexture("textureVel", this._fbo.read.getTexture(1), 1)
      .uniformTexture("textureExtra", this._fbo.read.getTexture(2), 2)
      .draw();

    this._fbo.swap();
  }

  render() {
    GL.clear(0, 0, 0, 1);

    GL.rotate(this.mtx);
    // this._bAxis.draw();
    // this._bDots.draw();

    this._drawPoints.uniform("uViewport", "vec2", [GL.width, GL.height]);
    /*
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      this._drawPoints
        .uniformTexture("texturePos", this._fbo.all[i].getTexture(0), 0)
        .uniformTexture("textureExtra", this._fbo.all[i].getTexture(2), 2)
        .draw();
    }
*/
    for (let j = 0; j < NUM_SETS; j++) {
      this._drawTrails.uniform("uSetPercent", "float", j / NUM_SETS);
      for (let i = 0; i < 15; i++) {
        const t = this._fbo.all[i + j * 15 - j].getTexture(0);
        this._drawTrails.uniformTexture(`texture${i}`, t, i);
      }
      this._drawTrails.draw();
    }

    // this._drawFloor.draw();

    if (!hasSaved) {
      saveImage(GL.canvas, getDateString());
      hasSaved = true;
    }

    // debug
    // const s = 100;
    // GL.viewport(0, 0, s, s);
    // this._bCopy.draw(this._fbo.read.getTexture(0));
    // GL.viewport(s, 0, s, s);
    // this._bCopy.draw(this._fbo.read.getTexture(2));
  }

  resize(w, h) {
    resize(1080, 1350);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
