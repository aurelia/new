import eslint from "@eslint/js";
// @if babel
import babelParser from "@babel/eslint-parser";
// @endif
// @if typescript
import tseslint from 'typescript-eslint';
import tsParser from "@typescript-eslint/parser";
// @endif
import globals from "globals";

export default [
  eslint.configs.recommended,
  // @if typescript
  ...tseslint.configs.recommended,
  // @endif
  {
    // @if typescript
    files: ["**/*.ts"],
    // @endif

    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.nodeBuiltin,
        ...globals.browser,
        ...globals.node,
      },

      // @if babel
      parser: babelParser,
      // @endif
      // @if typescript
      parser: tsParser,
      // @endif
      ecmaVersion: 2019,
      sourceType: "module",
    },
  }
];