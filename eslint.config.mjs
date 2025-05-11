// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginAstro from 'eslint-plugin-astro';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const compat = new FlatCompat({
//     baseDirectory: __dirname
// });

export default [
    ...eslintPluginAstro.configs.recommended,
    {
        rules: {}
    }
];
