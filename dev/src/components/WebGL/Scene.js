import alfrid, { GL } from "alfrid";
import { mat4 } from "gl-matrix";
import Settings from "./Settings";
import Config from "./Config";
import Assets from "./Assets";
import preload from "./preload";

// draws
import DrawSave from "./DrawSave";
import DrawTrails from "./DrawTrails";
import fsSim from "./shaders/sim.frag";

const NUM_SETS = 10;
const TOTAL_FRAMES = 15 * NUM_SETS;

class Scene {
  constructor() {
    this.canvas = document.createElement("canvas");
    GL.init(this.canvas, { alpha: false });
    GL.enableAlphaBlending();
    GL.enable(GL.DEPTH_TEST);

    // camera
    this.camera = new alfrid.CameraPerspective();
    this.camera.setPerspective((45 * Math.PI) / 180, GL.aspectRatio, 1, 30);
    this.orbitalControl = new alfrid.OrbitalControl(this.camera, window, 15);
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.radius.value = 15;
    this.orbitalControl.radius.limit(10, 20);
    this.orbitalControl.radius.easing = 0.025;
    this.orbitalControl.lockRotation(true);

    this.control = new alfrid.OrbitalControl(null, window, 0.01);
    this.control.lockZoom(true);
    this.control.rx.easing = this.control.ry.easing = 0.05;
    const r = 0.5;
    this.control.rx.limit(-r, r);

    // states
    this._index = 0;
    this._nextIndex = 0;

    this.mtx = mat4.create();
    this.mtxTranslate = mat4.create();
    mat4.translate(this.mtxTranslate, this.mtxTranslate, [-3.5, -2.5, 0]);

    this._offset = new alfrid.TweenNumber(1, "linear", 0.005);
    // this._offset = new alfrid.EaseNumber(1, 0.005);

    preload().then(
      () => this._init(),
      (e) => {
        console.log("Error", e);
      }
    );
  }

  _init() {
    this._initTextures();
    this._initViews();

    alfrid.Scheduler.addEF(() => this.render());
  }

  // public methods
  show(mIndex) {
    // console.log("show", mIndex);
    if (this._index > 0) {
      this.close();
    }
    this._nextIndex = mIndex;
  }

  goto(mIndex) {
    if (mIndex < 1) {
      this._index = mIndex;
      return;
    }
    const oSetting = Settings[mIndex - 1];
    // console.log("goto", mIndex);
    // console.log("using texture", `Project_0${mIndex}`);
    this._texture = Assets.get(`Project_0${mIndex}`);

    this.regenerate(oSetting);
    this.open();
    this._index = this._nextIndex;
  }

  open() {
    this.orbitalControl.radius.setTo(18);
    this.orbitalControl.radius.value = 15;
    this.control.rx.setTo(0);
    this.control.ry.setTo(0);
    this._offset.speed = 0.005;
    this._offset.value = 0;
  }

  close() {
    this._offset.speed = 0.01;
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
  }

  // init draw calls
  _initViews() {
    this._bAxis = new alfrid.BatchAxis();
    this._bCopy = new alfrid.BatchCopy();

    // draw save
    this._drawSave = new DrawSave()
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    // draw sim
    this._drawSim = new alfrid.Draw()
      .setMesh(alfrid.Geom.bigTriangle())
      .useProgram(alfrid.ShaderLibs.bigTriangleVert, fsSim)
      .setClearColor(0, 0, 0, 0);

    // draw trails
    this._drawTrails = new DrawTrails();
    this._drawTrails.uniform("uNumSets", "float", NUM_SETS);
  }

  regenerate(mSettings) {
    this._drawSave
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    const { dirX, dirY, dirZ, noise, seed } = mSettings;
    // console.log("regenerate", mSettings);
    this._drawSim
      .uniform("uNoise", "float", noise)
      .uniform("uGrowDir", "vec3", [dirX, dirY, dirZ])
      .uniform("uSeed", "float", seed);
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
    mat4.lookAt(this.mtx, this.control.position, [0, 0, 0], [0, 1, 0]);
    mat4.mul(this.mtx, this.mtxTranslate, this.mtx);
  }

  render() {
    this.update();
    GL.viewport(0, 0, GL.width, GL.height);
    GL.clear(0, 0, 0, 1);
    GL.setMatrices(this.camera);
    GL.rotate(this.mtx);

    if (this._index === 0) {
      return;
    }

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

    // const s = 200;
    // GL.viewport(0, 0, s, s);
    // this._bCopy.draw(this._texture);
  }

  resize(w, h) {
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default Scene;
