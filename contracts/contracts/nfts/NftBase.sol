// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftBase is ERC721, Ownable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private _tokenBaseURI;
  uint256 private _latestTokenID;
  
  constructor(string memory name, string memory symbol, string memory uri) ERC721(name, symbol) {
    _tokenBaseURI = uri;
    _latestTokenID = 0;
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }

  function mint(address owner) public onlyOwner returns (uint256) {
    uint256 tokenId = _latestTokenID + 1;
    _mint(owner, tokenId);
    _latestTokenID = tokenId;
    return tokenId;
  }

  function batchMint(address[] memory owners) public onlyOwner returns (uint256) {
    uint256 beginToken = _latestTokenID + 1;
    for(uint i = 0; i < owners.length; i++) {
      address addr = owners[i];
      uint256 tokenId = beginToken + i;
      _mint(addr, tokenId);
    }
    _latestTokenID = beginToken + owners.length - 1;
    return beginToken + owners.length;
  }

  function burn(uint256 tokenId) public onlyOwner {
    _burn(tokenId);
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    _tokenBaseURI = baseURI;
  }

  function totalSupply() public view returns (uint256) {
    return _latestTokenID;
  }

  function _baseURI() internal view override returns (string memory) {
    return _tokenBaseURI;
  }
}