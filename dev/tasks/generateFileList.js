const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

const SOURCE_PATH = "./public/images/projects";
const TARGET_PATH = "./src/data";

const getDirectories = function (src, callback) {
  glob(src + "/**/*", callback);
};

getDirectories(SOURCE_PATH, (err, files) => {
  if (err) {
    console.log("error getting files", err);
    return;
  }

  const projects = [];

  const regexp = new RegExp(/(jpg|mp4)/i);
  files = files.filter((f) => regexp.test(f));

  files.forEach((f) => {
    const t = f.split("projects/")[1];
    const a = t.split("/");
    const index = parseInt(a[0]) - 1;
    const path = a[1];
    console.log(index, path);
    if (projects[index] === undefined) {
      projects[index] = [];
    }
    projects[index].push(path);
  });

  const data = JSON.stringify(projects, null, 4);
  fs.writeFileSync(path.resolve(TARGET_PATH, "files.json"), data);
});
