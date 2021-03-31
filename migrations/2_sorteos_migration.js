const Sorteos = artifacts.require("Sorteos");

module.exports = function (deployer) {
  deployer.deploy(Sorteos);
};
