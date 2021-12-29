// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// ERC721 = 0x80ac58cd, ERC1155 = 0xd9b67a26

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libs/ServiceBase.sol";

contract NftMarket is ServiceBase {
  using SafeMath for uint256;

  IERC20 money;
  uint256 public listFee;
  uint256 public bidFee;
  uint256 public commissionRateNumerator;
  uint256 public commissionRateDenominator;
  uint256 public maxBookDuration;
  uint256 public maxBidDuration;

  constructor(MainPool pool, IERC20 mainCoin) ServiceBase(pool) {
    money = mainCoin;
    listFee = 1 * 1e14; // 0.0001 ether
    bidFee = 1 * 1e14; // 0.0001 ether
    commissionRateNumerator = 2; // 2%
    commissionRateDenominator = 100;
    maxBookDuration = 86400 * 30 * 6; // six month
    maxBidDuration = 86400 * 30 * 6; // six month
  }
  
  struct Book {
    address nftContract;
    uint256 tokenId;
    uint256 price;
    uint256 stamp;
    uint256 due;
  }

  struct Bid {
    bytes32 bookId;
    address buyer;
    uint256 price;
    uint256 stamp;
    uint256 due;
  }

  mapping(bytes32 => Book) public books;
  mapping(bytes32 => Bid) public biddings;

  event Booked(bytes32 indexed bookId, address indexed seller, uint256 price);
  event Bidded(bytes32 indexed bookId, address indexed buyer, uint256 price);
  event Dealed(bytes32 indexed bookId, address indexed seller, address indexed buyer, uint256 price);

  modifier isValidBid(bytes32 bidId) {
    Bid memory bidding = biddings[bidId];
    require(biddingIndex(bidding.bookId, bidding.buyer) == bidId, "Invalid Bid");
    require(block.timestamp < bidding.due, "This bid has expired.");
    _;
  }

  modifier isValidBook(bytes32 bookId) {
    Book memory booking = books[bookId];
    IERC721 nftContract = IERC721(booking.nftContract);

    require(address(nftContract) != address(0), "NFT Contract unavailable");
    require(nftContract.getApproved(booking.tokenId) == address(this), "Owner hasn't grant permission for sell");
    require(block.timestamp < booking.due, "This price has expired.");
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

  function book(address nftContract, uint256 tokenId, uint256 price, uint256 duration) public returns (bytes32) {
    // todo: add list fee
    require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Callee doesn't own this token");
    require(IERC721(nftContract).getApproved(tokenId) == address(this), "Not having approval of this token.");
    require(duration < maxBookDuration, "Exceed maximum selling duration.");

    bytes32 bookId = index(nftContract, tokenId);
    books[bookId].nftContract = nftContract;
    books[bookId].tokenId = tokenId;
    books[bookId].price = price;
    books[bookId].stamp = block.timestamp;
    books[bookId].due = duration.add(block.timestamp);

    emit Booked(bookId, msg.sender, price);

    return bookId;
  }

  function cancelBook(bytes32 bookId) public {
    require(IERC721(books[bookId].nftContract).ownerOf(books[bookId].tokenId) == msg.sender, "Callee doesn't own this token");
    books[bookId].price = 0;
    books[bookId].stamp = 0;
    books[bookId].due = 0;
  }

  function bid(bytes32 bookId, uint256 price, uint256 duration) public returns (bytes32) {
    // todo: add bid fee
    uint256 allowance = money.allowance(msg.sender, address(this));
    require(allowance > price, "Allowance not enough for this bid");
    require(duration < maxBidDuration, "Exceed maximum bid duration.");
    
    bytes32 bidId = biddingIndex(bookId, msg.sender);
    biddings[bidId].bookId = bookId;
    biddings[bidId].buyer = msg.sender;
    biddings[bidId].price = price;
    biddings[bidId].stamp = block.timestamp;
    biddings[bidId].due = duration.add(block.timestamp);

    emit Bidded(bookId, msg.sender, price);

    return bidId;
  }

  function cancelBid(bytes32 bidId) public {
    require(biddings[bidId].buyer == msg.sender, "Callee doesn't own this bid.");
    biddings[bidId].price = 0;
    biddings[bidId].stamp = 0;
    biddings[bidId].due = 0;
  }

  function sell(bytes32 bidId) public isValidBid(bidId) isValidBook(biddings[bidId].bookId) {
    Bid memory bidding = biddings[bidId];
    Book memory booking = books[bidding.bookId];
    IERC721 nftContract = IERC721(booking.nftContract);
    address seller = nftContract.ownerOf(booking.tokenId);
    require(seller == msg.sender, "Callee doesn't own this token.");

    _deal(bidding.bookId, nftContract, booking.tokenId, seller, bidding.buyer, bidding.price);
  }

  function buy(bytes32 bookId) public isValidBook(bookId){
    Book memory booking = books[bookId];
    IERC721 nftContract = IERC721(booking.nftContract);
    address seller = nftContract.ownerOf(booking.tokenId);
    _deal(bookId, nftContract, booking.tokenId, seller, msg.sender, booking.price);
  }

  function _deal(bytes32 bookId, IERC721 nftContract, uint256 tokenId, address seller, address buyer, uint256 amount) private {
    require(money.balanceOf(buyer) >= amount, "Buyer doesn't have enough money to pay.");
    require(money.allowance(buyer, address(this)) >= amount, "Buyer allowance isn't enough.");
    require(nftContract.getApproved(tokenId) == address(this), "Doesn't have approval of this token.");

    // todo: calculate commission to NftMarket
    // todo: calculate roality to NftContract Owner

    money.transferFrom(buyer, seller, amount);
    nftContract.safeTransferFrom(seller, buyer, tokenId);

    emit Dealed(bookId, seller, buyer, amount);
  }
}