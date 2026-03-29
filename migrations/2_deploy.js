const GovFundAllocation = artifacts.require("GovFundAllocation");

module.exports = function(deployer) {
  deployer.deploy(GovFundAllocation);
};