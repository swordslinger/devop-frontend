const { transform } = require("@babel/core");

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',

  transform:{
    '^.+\\.jsx?$': 'babel-jest'
  },

  transformIgnorePatterns: [
    'node_modules/(?!axios|other-package-with-esm)'
  ],

}
