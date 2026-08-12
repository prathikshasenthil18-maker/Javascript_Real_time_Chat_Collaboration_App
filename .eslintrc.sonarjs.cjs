module.exports = {
  root: true,
  env: { es2022: true, node: true },
  plugins: ["sonarjs"],
  extends: ["plugin:sonarjs/recommended-legacy"],
  ignorePatterns: ["node_modules/", "coverage/", "reports/", "frontend_js/dist/"],
  rules: { "sonarjs/cognitive-complexity": ["error", 15] },
};
