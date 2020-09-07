import assets from "./assets-list";
import Assets from "./Assets";
import AssetsLoader from "assets-loader";

const loadAssets = () =>
  new Promise((resolve, reject) => {
    if (assets.length > 0) {
      document.body.classList.add("isLoading");

      new AssetsLoader({
        assets: assets,
      })
        .on("error", (error) => {
          console.log("Error :", error);
        })
        .on("progress", (p) => {
          // console.log('Progress : ', p);
          const loader = document.body.querySelector(".Loading-Bar");
          if (loader) loader.style.width = `${p * 100}%`;
        })
        .on("complete", (o) => {
          resolve(o);
        })
        .start();
    } else {
      resolve([]);
    }
  });

const initAssets = (mAssets) =>
  new Promise((resolve, reject) => {
    // INIT ASSETS
    Assets.init(mAssets);

    resolve();
  });

const preload = () =>
  new Promise((resolve, reject) => {
    loadAssets()
      .then(initAssets)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.log("Error", e);
      });
  });

export default preload;
