// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// ERC721 = 0x80ac58cd, ERC1155 = 0xd9b67a26

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./libs/ServiceBase.sol";

contract NftMarket is ServiceBase {

  IERC20 money;

  constructor(MainPool pool, IERC20 mainCoin) ServiceBase(pool) {
    money = mainCoin;
  }
  
  struct Book {
    address nftContract;
    uint256 tokenId;
    uint256 price;
    uint256 stamp;
  }

  struct Bid {
    bytes32 bookId;
    address buyer;
    uint256 price;
  }

  mapping(bytes32 => Book) public books;
  mapping(bytes32 => Bid) public biddings;

  event Booked(bytes32 indexed bookId, address indexed seller, uint256 price);
  event Bidded(bytes32 indexed bookId, address indexed buyer, uint256 price);
  event Dealed(bytes32 indexed bookId, address indexed seller, address indexed buyer, uint256 price);

  modifier isValidBid(bytes32 bidId) {
    Bid memory bidding = biddings[bidId];
    require(biddingIndex(bidding.bookId, bidding.buyer) == bidId, "Invalid Bid");
    _;
  }

  modifier isValidBook(bytes32 bookId) {
    Book memory booking = books[bookId];
    IERC721 nftContract = IERC721(booking.nftContract);

    require(address(nftContract) != address(0), "NFT Contract unavailable");
    require(nftContract.ownerOf(booking.tokenId) == msg.sender, "Callee doesn't own this token");
    require(nftContract.getApproved(booking.tokenId) == address(this), "Owner hasn't grant permission for sell");
    _;
  }

  function index(address nftContract, uint256 tokenId) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nftContract, tokenId));
  }

  function biddingIndex(bytes32 bookId, address buyer) public view returns (bytes32) {
    return keccak256(abi.encodePacked(bookId, books[bookId].stamp, buyer));
  }

  function priceOf(address nftContract, uint256 tokenId) public view returns (uint256) {
    return books[index(nftContract, tokenId)].price;
  }

  function book(address nftContract, uint256 tokenId, uint256 price) public returns (bytes32) {
    require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Callee doesn't own this token");

    bytes32 bookId = index(nftContract, tokenId);
    books[bookId].nftContract = nftContract;
    books[bookId].tokenId = tokenId;
    books[bookId].price = price;
    books[bookId].stamp = block.timestamp;

    IERC721(nftContract).approve(address(this), tokenId);

    emit Booked(bookId, msg.sender, price);

    return bookId;
  }

  function bid(bytes32 bookId, uint256 price) public returns (bytes32) {
    uint256 allowance = money.allowance(msg.sender, address(this));
    if(allowance < price) {
      uint256 offset = price - allowance;
      money.approve(address(this), offset);
    }

    bytes32 bidId = biddingIndex(bookId, msg.sender);
    biddings[bidId].bookId = bookId;
    biddings[bidId].buyer = msg.sender;
    biddings[bidId].price = price;

    emit Bidded(bookId, msg.sender, price);

    return bidId;
  }

  function sell(bytes32 bidId) public isValidBid(bidId) isValidBook(biddings[bidId].bookId) {
    
    Bid memory bidding = biddings[bidId];
    Book memory booking = books[bidding.bookId];
    IERC721 nftContract = IERC721(booking.nftContract);

    require(money.balanceOf(bidding.buyer) >= bidding.price, "Buyer doesn't have enough money to pay");

    address owner = nftContract.ownerOf(booking.tokenId);

    money.transferFrom(bidding.buyer, address(this), bidding.price);
    nftContract.safeTransferFrom(owner, bidding.buyer, booking.tokenId);
    money.transferFrom(address(this), owner, bidding.price);

    emit Dealed(bidding.bookId, owner, bidding.buyer, bidding.price);
  }

  function buy(bytes32 bookId) public isValidBook(bookId){
    Book memory booking = books[bookId];
    IERC721 nftContract = IERC721(booking.nftContract);
    address owner = nftContract.ownerOf(booking.tokenId);

    money.transfer(owner, booking.price);
    nftContract.safeTransferFrom(owner, msg.sender, booking.tokenId);

    emit Dealed(bookId, owner, msg.sender, booking.price);
  }
}