// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MainCoin is ERC20, Ownable {

  constructor (string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(_msgSender(), 300000000 * 1e18);
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function burn(uint256 amount) public onlyOwner {
    _burn(_msgSender(), amount);
  }
    
}