// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenWrapper {
  using SafeMath for uint256;
  IERC20 public coin;

  constructor(IERC20 _coinAddress) {
    coin = IERC20(_coinAddress);
  }

  uint256 private _totalSupply;
  mapping(address => uint256) private _balances;

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }

  function stake(uint256 amount) public virtual {
    _totalSupply = _totalSupply.add(amount);
    _balances[msg.sender] = _balances[msg.sender].add(amount);
    coin.transferFrom(msg.sender, address(this), amount);
  }

  function unstake(uint256 amount) public virtual {
    _totalSupply = _totalSupply.sub(amount);
    _balances[msg.sender] = _balances[msg.sender].sub(amount);
    coin.transfer(msg.sender, amount);
  }
}

contract MainPool is TokenWrapper, Ownable, AccessControl {
  using SafeMath for uint256;
  bytes32 public constant SERVICE_ROLE = keccak256("SERVICE_ROLE");

  // 1 PREC = 0.005 Points/day

  mapping(address => uint256) public lastUpdateTime;
  mapping(address => uint256) public points;

  uint256 public stakeLimit;
  uint256 public rateNumerator;
  uint256 public rateDenominator;
  uint256 public billingPeriod;

  event Staked(address indexed user, uint256 amount);
  event Unstaked(address indexed user, uint256 amount);
  event Rewarded(address indexed user, uint256 points, bytes data);
  event Consumed(address indexed user, uint256 points, bytes data);

  modifier updateReward(address account) {
    if (account != address(0)) {
      points[account] = earned(account);
      lastUpdateTime[account] = block.timestamp;
    }
    _;
  }

  constructor(IERC20 _coinAddress) TokenWrapper(_coinAddress) {
    // Grant the contract deployer the default admin role
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    // Setup initial formula
    stakeLimit = 10 * 1e8 * 1e18; // unlimited
    rateNumerator = 5;            // 0.005 = 5 / 1000
    rateDenominator = 1000;
    billingPeriod = 86400;
  }

  function earned(address account) public view returns (uint256) {
    // @todo: 改用 profitPerShare 的寫法
    uint256 blockTime = block.timestamp;
    uint256 base = blockTime
      .sub(lastUpdateTime[account])       // 時間差 5 day
      .mul(1e18)                          // 換算幣 5e18
      .div(billingPeriod)                 // 帳期 5e18/86400
      .mul(
        balanceOf(account).div(1e18));   // 本金去掉 1e18 = ex. 1 PREC
    
    return
      points[account].add(
        base
          .mul(rateNumerator)
          .div(rateDenominator)
      );
  }

  function stake(uint256 amount) public override updateReward(msg.sender) {
    require(amount.add(balanceOf(msg.sender)) <= stakeLimit, "Stake more than limits");

    super.stake(amount);
    emit Staked(msg.sender, amount);
  }

  function unstake(uint256 amount) public override updateReward(msg.sender) {
    require(amount > 0, "Cannot withdraw 0");

    super.unstake(amount);
    emit Unstaked(msg.sender, amount);
  }

  function exit() external {
    unstake(balanceOf(msg.sender));
  }

  function alterFormula(
    uint256 nextStakeLimit,
    uint256 nextNumerator,
    uint256 nextDenominator,
    uint256 nextBillingPeriod // 86400
  ) public onlyOwner {
    stakeLimit = nextStakeLimit;
    rateNumerator = nextNumerator;
    rateDenominator = nextDenominator;
    billingPeriod = nextBillingPeriod;
  }

  function reward(address account, uint256 amount, bytes calldata _data) 
    public updateReward(account) onlyRole(SERVICE_ROLE) {
      points[account] = points[account].add(amount);

      emit Rewarded(account, amount, _data);
  }

  function consume(address account, uint256 amount, bytes calldata _data) 
    public updateReward(account) onlyRole(SERVICE_ROLE) {
      require(points[account] > amount, "Not enough points");
      points[account] = points[account].sub(amount);

      emit Consumed(account, amount, _data);
  }

  function registerService(address contractAddress) public {
    grantRole(SERVICE_ROLE, contractAddress);
  }
}