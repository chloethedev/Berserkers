var Berserkers = artifacts.require("./Berserkers.sol");

module.exports = function(deployer) {
  deployer.deploy(Berserkers);
};