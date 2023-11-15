module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:css-import-order/recommended",
    "plugin:jsx-a11y/strict"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react-refresh",
    "react",
    "react-hooks",
    "import",
    "css-import-order"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "max-len": ["warn", {"code": 150}],
    "no-unused-vars": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-max-props-per-line": ["error", {"maximum": 3}],
    "react/jsx-no-constructed-context-values": "error",
    "@typescript-eslint/ban-ts-comment": ["error", {"ts-ignore": "allow-with-description"}],
    "@typescript-eslint/no-unused-vars": "off", // Already covered by no-unused-vars
    "import/order": ["error", {
      "groups": [
        "external",
        "internal"
      ],
      "pathGroups": [
        {
          "pattern": "(^@)|(^\\w)",
          "group": "external"
        },
        {
          "pattern": "^\\.(\\.)?",
          "group": "internal"
        }
      ],
      "newlines-between": "always",
      "alphabetize": {"order": "asc"}
    }],
    "react-refresh/only-export-components": ["warn", {allowConstantExport: true}],
  }
}
