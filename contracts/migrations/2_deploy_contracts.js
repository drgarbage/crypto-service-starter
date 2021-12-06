const MainCoin = artifacts.require("MainCoin");
const MainPool = artifacts.require("MainPool");
const NftMarket = artifacts.require("NftMarket");

module.exports = async (deployer) => {
  await deployer.deploy(MainCoin, COIN_NAME, COIN_SYMBOL);
  await deployer.deploy(MainPool, MainCoin.address);
  await deployer.deploy(NftMarket, MainPool.address, MainCoin.address);
};