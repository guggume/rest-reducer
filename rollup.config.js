import resolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'lib/index.js',
  output: {
    file: pkg.module,
    exports: 'named',
    format: 'cjs'
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    })
  ]
};