/* eslint-env node */
module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: [
      "react-refresh",
      "react-hooks",
      "@typescript-eslint",
      "prettier",
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended", // enables plugin + sets 'prettier' last
    ],
    rules: {
      // Prettier errors will show as ESLint errors
      "prettier/prettier": "error",
  
      // React Refresh plugin - only warn in dev
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
  
      // Example: you can tweak TS strictness here if needed
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  };
  