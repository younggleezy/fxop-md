const fs = require("fs");
const path = require("path");

const libPath = path.join(__dirname);
const files = fs.readdirSync(libPath);
const exportedModules = {};

for (const file of files) {
 const filePath = path.join(libPath, file);
 const fileStats = fs.statSync(filePath);

 if (fileStats.isFile() && path.extname(file) === ".js") {
  const moduleName = path.basename(file, ".js");
  try {
   const moduleExports = require(filePath);
   if (typeof moduleExports === "object" && moduleExports !== null) {
    Object.entries(moduleExports).forEach(([key, value]) => {
     exportedModules[key] = value;
    });
   } else {
    exportedModules[moduleName] = moduleExports;
   }
  } catch (error) {
   console.error(`Failed to load module ${file}:`, error);
  }
 }
}

for (const key of Object.keys(exportedModules)) {
 Object.defineProperty(exportedModules, key, {
  enumerable: false,
  configurable: false,
  writable: false,
 });
}

module.exports = exportedModules;
