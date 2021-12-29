const NftAmazons = artifacts.require("NftAmazons");

module.exports = async (deployer) => {
  await deployer.deploy(NftAmazons);
  const nftAmz = await NftAmazons.deployed();
  nftAmz.setBaseURI("https://cloud-service-crypto.herokuapp.com/api/nft-amazon/");
};