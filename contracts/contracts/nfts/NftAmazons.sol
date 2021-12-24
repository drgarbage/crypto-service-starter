// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NftBase.sol";

contract NftAmazons is NftBase {
  constructor() 
    NftBase("Amazons", "AMZ", "https://cloud-service-crypto.herokuapp.com/api/nft-amazon/") { }
}