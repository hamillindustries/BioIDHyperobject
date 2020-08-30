// SceneApp.js

import alfrid, { Scene, GL } from "alfrid";
import Assets from "./Assets";
import Config from "./Config";
import Settings from "./Settings";
import DrawSave from "./DrawSave";
import DrawTrails from "./DrawTrails";
import { resize } from "./utils";
import { mat4 } from "gl-matrix";
import fsSim from "shaders/sim.frag";

const NUM_SETS = 10;
const TOTAL_FRAMES = 15 * NUM_SETS;

class SceneApp extends Scene {
  constructor(mSceneManager) {
    super();
    this._sceneManager = mSceneManager;
    GL.enableAlphaBlending();
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.radius.value = 13;
    this.camera.setPerspective((45 * Math.PI) / 180, GL.aspectRatio, 1, 30);

    this.mtx = mat4.create();
    mat4.translate(this.mtx, this.mtx, [0, -2.5, 0]);
    this.count = 0;

    this._offset = new alfrid.TweenNumber(1, "linear", 0.005);

    this._index = 0;
    this._nextIndex = 1;

    window.gui.add(this, "next");

    this.resize();
  }

  next() {
    this.close();
    this._nextIndex = this._index === 6 ? 1 : this._index + 1;
  }

  show(mIndex) {
    this.close();
    this._nextIndex = mIndex;
  }

  goto(mIndex) {
    const mSettings = Assets.get(`0${mIndex}`);
    console.log("go to ", mIndex, mSettings);
    for (let s in mSettings) {
      if (s.indexOf("num") === -1) {
        Config[s] = mSettings[s];
      }
    }
    Settings.refresh();

    this._texture = Assets.get(`Project_0${mIndex}`);

    this.regenerate(Config.seed);
    this.open();
    this._index = this._nextIndex;
  }

  open() {
    this._offset.value = 0;
  }

  close() {
    this._offset.value = 1;
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
    this._texture = Assets.get("palette");
  }

  _initViews() {
    console.log("init views");

    this._bCopy = new alfrid.BatchCopy();

    // draw save
    this._drawSave = new DrawSave()
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    // draw sim
    const { dirX, dirY, dirZ, noise } = Config;
    this._drawSim = new alfrid.Draw()
      .setMesh(alfrid.Geom.bigTriangle())
      .useProgram(alfrid.ShaderLibs.bigTriangleVert, fsSim)
      .setClearColor(0, 0, 0, 0)
      .uniform("uGrowDir", "vec3", [dirX, dirY, dirZ])
      .uniform("uSeed", "float", Config.seed)
      .uniform("uNoise", "float", noise);

    // draw trails
    this._drawTrails = new DrawTrails();
    this._drawTrails.uniform("uNumSets", "float", NUM_SETS);
  }

  regenerate(mSeed) {
    this._drawSave
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    this._drawSim.uniform("uSeed", "float", mSeed);
    let i = TOTAL_FRAMES;
    while (i--) {
      this.updatePos();
    }

    this._offset.setTo(1);
    this._offset.value = 0;
  }

  updatePos() {
    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .uniformTexture("texturePos", this._fbo.read.getTexture(0), 0)
      .uniformTexture("textureVel", this._fbo.read.getTexture(1), 1)
      .uniformTexture("textureExtra", this._fbo.read.getTexture(2), 2)
      .draw();

    this._fbo.swap();
  }

  update() {
    if (this._nextIndex !== this._index && this._offset.value >= 1.0) {
      this.goto(this._nextIndex);
    }
  }

  render() {
    GL.clear(0, 0, 0, 1);

    GL.rotate(this.mtx);

    this._drawTrails
      .uniform("uOffset", "float", this._offset.value)
      .uniformTexture("texture", this._texture, 15);
    for (let j = 0; j < NUM_SETS; j++) {
      this._drawTrails.uniform("uSetPercent", "float", j / NUM_SETS);

      for (let i = 0; i < 15; i++) {
        const t = this._fbo.all[i + j * 15 - j].getTexture(0);
        this._drawTrails.uniformTexture(`texture${i}`, t, i);
      }
      this._drawTrails.draw();
    }

    const s = 200;
    GL.viewport(0, 0, s, s);
    this._bCopy.draw(this._texture);
  }

  resize(w, h) {
    resize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
