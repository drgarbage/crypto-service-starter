const MainCoin = artifacts.require("MainCoin");
const NftMarket = artifacts.require("NftMarket");
const NftAmazons = artifacts.require("NftAmazons");

contract("NftMarket", (accounts) => {

  it("Direct Purchase", async () => {

    const PRICE = web3.utils.toWei('1');
    const [seller, buyer] = accounts;
    const coin = await MainCoin.deployed();
    const market = await NftMarket.deployed();
    const nftc = await NftAmazons.deployed();
    const MINTER_ROLE = await nftc.MINTER_ROLE();
    
    await nftc.grantRole(MINTER_ROLE, seller);
    await coin.transfer(buyer, PRICE, {from:seller});

    let balanceOfSeller = await coin.balanceOf(seller);
    let balanceOfBuyer = await coin.balanceOf(buyer);

    expect((balanceOfSeller).gt(PRICE));
    expect((balanceOfBuyer).eq(PRICE));
    
    let rs = null;
    let tokenId = (await nftc.totalSupply()).toNumber() + 1;
    rs = await nftc.mint(seller, {from:seller});
    rs = await nftc.approve(market.address, 1, {from:seller});
    rs = await market.book(nftc.address, tokenId, PRICE, '86400');
    let bookId = rs.logs[0].args.bookId;
    let bookInfo = await market.books(bookId);
    rs = await coin.approve(market.address, bookInfo.price, {from:buyer});
    rs = await market.buy(bookId, {from:buyer});
    let owner = await nftc.ownerOf(tokenId);

    expect(owner).to.be.equal(buyer);
  })


});