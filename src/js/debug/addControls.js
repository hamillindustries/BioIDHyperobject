// addControls.js

import Settings from "../Settings";
import Config from "../Config";
import { saveJson } from "../utils";

const addControls = (scene) => {
  const oControl = {
    save: () => {
      saveJson(Config, "Settings");
    },
  };

  setTimeout(() => {
    gui
      .add(Config, "numParticles", 1, 64)
      .step(1)
      .onFinishChange(Settings.reload);
    gui.add(Config, "dirX", -2, 2).onFinishChange(Settings.reload);
    gui.add(Config, "dirY", 0, 2).onFinishChange(Settings.reload);
    gui.add(Config, "dirZ", -2, 2).onFinishChange(Settings.reload);
    gui.add(Config, "noise", 0, 3).onFinishChange(Settings.reload);
    gui
      .add(Config, "seed", 0, 500)
      .step(1)
      .onFinishChange(() => {
        scene.regenerate();
        Settings.refresh();
      });
    gui.add(oControl, "save").name("Save Settings");
    gui.add(Settings, "reset").name("Reset Default");
  }, 200);
};

export default addControls;
