
// import js from "@eslint/js";
// // import ts from "@typescript-eslint/eslint-plugin";
// // import reactHooks from "eslint-plugin-react-hooks";

// module.exports = [
//   js.configs.recommended,
//   // ts.configs.recommended,
//   // reactHooks.configs.recommended,
//   {
//     languageOptions: {
//       globals: { browser: true, es2020: true }
//     },
//     // parser: "@typescript-eslint/parser",
//     // parserOptions: {
//     //   ecmaVersion: "latest",
//     //   sourceType: "module",
//     //   warnOnUnsupportedTypeScriptVersion: false,
//     // },
//     // plugins: ["react-refresh"],
//     rules: {
//       "react-refresh/only-export-components": "warn",
//       semi: [2, "always"],
//       quotes: [2, "double"],
//       indent: [2, 2],
//       "jsx-quotes": [2, "prefer-double"],
//       warnOnUnsupportedTypeScriptVersion: 0,
//       // "@typescript-eslint/no-unused-vars": ["war", { ignoreRestSibling: true }],
//     },
//   }
// ];

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': hooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with the new JSX transform
      'react/prop-types': 'off' // Not needed for TypeScript projects
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
  }
);