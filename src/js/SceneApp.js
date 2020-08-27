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
    this.orbitalControl.rx.value = 0.3;
    this.orbitalControl.radius.value = 13;
    this.camera.setPerspective((45 * Math.PI) / 180, GL.aspectRatio, 1, 30);

    this.mtx = mat4.create();
    mat4.translate(this.mtx, this.mtx, [0, -3, 0]);
    this.count = 0;

    this._offset = new alfrid.TweenNumber(1, "linear", 0.005);

    this.resize();
    const { gui } = window;
    gui.add(this, "toggle");

    this.toggle();

    this.enableDropImage();
  }

  enableDropImage() {
    this.canvasImg = document.createElement("canvas");
    this.canvasImg.width = this._texture.width;
    this.canvasImg.height = this._texture.height;
    this.ctxImg = this.canvasImg.getContext("2d");
    const dropArea = window;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    const handleDrop = (e) => {
      let dt = e.dataTransfer;
      let files = dt.files;
      const file = files[0];

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let img = document.createElement("img");

        img.onload = () => {
          if (
            img.width === this._texture.width &&
            img.height === this._texture.height
          ) {
            this._texture.updateTexture(img);
          } else {
            this.ctxImg.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              this.canvasImg.width,
              this.canvasImg.height
            );

            this._texture.updateTexture(this.canvasImg);
          }
        };
        img.src = reader.result;
      };
    };

    dropArea.addEventListener("drop", handleDrop, false);
  }

  toggle() {
    this._offset.value = this._offset.targetValue === 1 ? 0 : 1;
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
    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
    this._bBall = new alfrid.BatchBall();

    this._drawFloor = new DrawFloor();

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
    this._drawTrails
      .uniform("uNumSets", "float", NUM_SETS)
      .uniformTexture("texture", this._texture, 15);

    // debug POINTS
    this._drawPoints = new DrawPoints();

    let i = TOTAL_FRAMES;
    while (i--) {
      this.updatePos();
    }
  }

  regenerate() {
    this._drawSave
      .bindFrameBuffer(this._fbo.read)
      .setClearColor(0, 0, 0, 1)
      .draw();

    this._drawSim.uniform("uSeed", "float", Config.seed);
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
    this._drawTrails.uniform("uOffset", "float", this._offset.value);
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
      // saveImage(GL.canvas, getDateString());
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
    resize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
