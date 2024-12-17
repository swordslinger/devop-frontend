const { transform } = require("@babel/core");

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',

  transform:{
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!vee-validate|axios|other-package-with-esm)'
 ],

 moduleFileExtensions:['js', 'vue', 'json'],
  testEnvironment: 'jsdom'

}
