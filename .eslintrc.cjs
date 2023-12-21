module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.js", "./**/*.cjs"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
    "quote-props": "off",
    "@typescript-eslint/quote-props": "off",
    semi: "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-empty": "warn",
    "@typescript-eslint/array-type": "off",
    "react/prop-types": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "prefer-const": "warn",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "no-empty-pattern": "off",
    "@typescript-eslint/no-misused-promises": [
      "warn",
      {
        checksVoidReturn: false,
      },
    ],
  },
};
