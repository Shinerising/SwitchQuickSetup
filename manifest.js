import fs from "fs";
import path from "path";
import rcedit from "rcedit";

const getFiles = (folder, filter) => {
    return fs.readdirSync(folder).filter(item => filter.test(item)).map(item => path.join(folder, item));
};

for(const file of getFiles("./bin", /\.exe$/i)){
  await rcedit(file, {
    "version-string": process.env.npm_package_version,
    "file-version": process.env.npm_package_version,
    "product-version": process.env.npm_package_version,
    icon: "./app.ico"
  });
}
