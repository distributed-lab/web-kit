import fs from "fs"
import path from "path"
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

const packages = fs.readdirSync(path.resolve(__dirname, './packages'))

export default packages.map((pkg) => ({
  input: `./packages/${pkg}/src/index.ts`,
  output: {
    sourcemap: pkg !== "w3p",
    file: `./packages/${pkg}/dist/index.js`,
    name: `DL_${pkg}`,
    format: 'iife'
  },
  plugins:[
    resolve({
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: ['./packages/**/src/test', './packages/**/src/*.test.ts']
    }),
    typescript({
      tsconfig: `./packages/${pkg}/tsconfig.json`,
    }),
    json(),
    terser(),
  ],
  ...(pkg === "w3p" ? {
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@ethersproject/abstract-provider': '@ethersproject/abstract-provider/lib/index.js',
        '@ethersproject/properties': '@ethersproject/properties/lib/index.js',
        'near-api-js': 'near-api-js/dist/near-api-js.js',
      },
    },
  } : {})
}))
