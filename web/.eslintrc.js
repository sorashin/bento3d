/**
 * ESLint の設定です。ドキュメントは以下です。
 * https://eslint.org/docs/latest/use/configure/
 */
module.exports = {
  extends: [
    /**
     * 以下 2 つは Create React App のデフォルトの ESLint の設定です。
     * Create React App ではこれを拡張する形で設定することを推奨しています。
     * そのため以下 2 つは消さずに、config を追加する際はその下に記載してください。
     * 詳細は以下ドキュメントを参照してください。
     * https://create-react-app.dev/docs/setting-up-your-editor
     * https://github.com/facebook/create-react-app/tree/main/packages/eslint-config-react-app
     */
    "react-app",
    "react-app/jest",
    // "plugin:tailwindcss/recommended",
    "prettier",
  ],
  // rules: {
  //   "tailwindcss/no-custom-classname": "off",
  //   "tailwindcss/classnames-order": "off", // クラス順序の強制を無効化
  // },
  // plugins: ["tailwindcss"],
  ignorePatterns: [
    "/.eslintrc.js",
    "/build/", // ビルド出力
  ],
};
