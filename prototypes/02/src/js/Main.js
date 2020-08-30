import SceneApp from "./SceneApp";
import SceneManager from "./scenes/SceneManager";

class MainApp {
  constructor() {
    this._sceneManager = new SceneManager();
    this.scene = new SceneApp(this._sceneManager);
  }
}

export default MainApp;
