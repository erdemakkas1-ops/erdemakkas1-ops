import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'paket/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // react-three-fiber uses intrinsic JSX elements with props like `position`, `args`, `intensity`
  { rules: { 'react/no-unknown-property': 'off' } },
];
export default config;
