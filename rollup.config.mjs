import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
        declaration: true,
        declarationDir: 'dist/types',
        rootDir: 'src'
      }),
      terser(),
    ],
    external: [
      'react', 
      'react-dom', 
      'framer-motion',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts()],
  },
];
