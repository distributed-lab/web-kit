const fs = require('fs');
const { replaceTscAliasPaths } = require('tsc-alias')

const writeFile = (path, data) => {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) throw err
  })
}

module.exports = function postBuild(dirpath) {
  writeFile(`${dirpath}/dist/esm/package.json`, {
    "type": "module",
  })
  writeFile(`${dirpath}/dist/cjs/package.json`, {
    "type": "commonjs",
  })

  fs.copyFile(`${dirpath}/package.json`, `${dirpath}/dist/package.json`, (err) => {
    if (err) throw err;
  })

  const tsconfigPath = `${dirpath}/tsconfig.json`

  replaceTscAliasPaths({
    tsconfigPath: tsconfigPath,
    outDir: `${dirpath}}/dist/esm`,
  })
  replaceTscAliasPaths({
    tsconfigPath: tsconfigPath,
    outDir: `${dirpath}}/dist/cjs`,
  })
  replaceTscAliasPaths({
    tsconfigPath: tsconfigPath,
    outDir: `${dirpath}}/dist/types`,
  })
}
