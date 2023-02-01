/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  arrowParens: 'always',
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
};
