// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../MainPool.sol";

contract ServiceBase {
  MainPool public pool;

  constructor(MainPool _poolAddress) {
    pool = MainPool(_poolAddress);
  }

}