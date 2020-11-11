const PeerDepsExternalsPlugin = require("peer-deps-externals-webpack-plugin");

module.exports = {
  plugins: [new PeerDepsExternalsPlugin()]
};