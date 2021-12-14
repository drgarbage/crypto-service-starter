const NftAmazons = artifacts.require("NftAmazons");

module.exports = async (deployer) => {
  await deployer.deploy(NftAmazons);
};