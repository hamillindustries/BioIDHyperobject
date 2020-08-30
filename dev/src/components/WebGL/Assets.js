// Assets.js

import assetsToLoad from "./assets-list";
import { GLTexture } from "alfrid";

const Assets = {};
let _assets = [];
let assets;

const getAsset = function (id) {
  return assets.find((a) => a.id === id).file;
};

const getExtension = function (mFile) {
  const ary = mFile.split(".");
  return ary[ary.length - 1];
};

Assets.init = function (mAssets) {
  assets = mAssets;
  let hdrCubemaps = {};
  _assets = assetsToLoad.map((o) => {
    const ext = getExtension(o.url);
    const file = getAsset(o.id);
    let texture;

    switch (ext) {
      case "jpg":
      case "png":
        texture = new GLTexture(file);
        return {
          id: o.id,
          file: texture,
        };
        break;
    }
  });

  if (_assets.length > 0) {
    console.debug("ASSETS:");
    console.table(_assets);
  }
};

Assets.get = function (mId) {
  return _assets.find((a) => {
    return a.id === mId;
  }).file;
};

export default Assets;
