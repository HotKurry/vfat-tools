$(function() {
  consoleInit()
  start(main)
})

const USDT_PLATFORM_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'contract IERC20', name: '_token', type: 'address'},
      {internalType: 'string', name: '_lpTokenName', type: 'string'},
      {internalType: 'string', name: '_lpTokenSymbolName', type: 'string'},
      {internalType: 'uint256', name: '_initialTokenToLPTokenRate', type: 'uint256'},
      {internalType: 'contract IFeesModel', name: '_feesModel', type: 'address'},
      {internalType: 'contract IFeesCalculator', name: '_feesCalculator', type: 'address'},
      {internalType: 'contract ICVIOracle', name: '_cviOracle', type: 'address'},
      {internalType: 'contract ILiquidation', name: '_liquidation', type: 'address'},
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'spender', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'cviValue', type: 'uint256'},
    ],
    name: 'ClosePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'lpTokensAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'positionAddress', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'currentPositionBalance', type: 'uint256'},
      {indexed: false, internalType: 'bool', name: 'isBalancePositive', type: 'bool'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
    ],
    name: 'LiquidatePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'cviValue', type: 'uint256'},
    ],
    name: 'OpenPosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'previousOwner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'from', type: 'address'},
      {indexed: true, internalType: 'address', name: 'to', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'lpTokensAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_CVI_VALUE',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE_PERCENTAGE',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_PERCENTAGE',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PRECISION_DECIMALS',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'owner', type: 'address'},
      {internalType: 'address', name: 'spender', type: 'address'},
    ],
    name: 'allowance',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'approve',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'balanceOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyersLockupPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_positionAddress', type: 'address'}],
    name: 'calculatePositionBalance',
    outputs: [
      {internalType: 'uint256', name: 'currentPositionBalance', type: 'uint256'},
      {internalType: 'bool', name: 'isPositive', type: 'bool'},
      {internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_positionAddress', type: 'address'}],
    name: 'calculatePositionPendingFees',
    outputs: [{internalType: 'uint256', name: 'pendingFees', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_positionUnitsAmount', type: 'uint256'},
      {internalType: 'uint16', name: '_minCVI', type: 'uint16'},
    ],
    name: 'closePosition',
    outputs: [{internalType: 'uint256', name: 'tokenAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{internalType: 'uint8', name: '', type: 'uint8'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'subtractedValue', type: 'uint256'},
    ],
    name: 'decreaseAllowance',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_tokenAmount', type: 'uint256'},
      {internalType: 'uint256', name: '_minLPTokenAmount', type: 'uint256'},
    ],
    name: 'deposit',
    outputs: [{internalType: 'uint256', name: 'lpTokenAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdrawAllowed',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLiquidableAddresses',
    outputs: [{internalType: 'address[]', name: '', type: 'address[]'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'addedValue', type: 'uint256'},
    ],
    name: 'increaseAllowance',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialTokenToLPTokenRate',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'lastDepositTimestamp',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address[]', name: '_positionOwners', type: 'address[]'}],
    name: 'liquidatePositions',
    outputs: [{internalType: 'uint256', name: 'finderFeeAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lpsLockupPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_tokenAmount', type: 'uint256'},
      {internalType: 'uint16', name: '_maxCVI', type: 'uint16'},
    ],
    name: 'openPosition',
    outputs: [{internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'positions',
    outputs: [
      {internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'creationTimestamp', type: 'uint256'},
      {internalType: 'uint256', name: 'pendingFees', type: 'uint256'},
      {internalType: 'uint256', name: 'positionAddressesIndex', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'revertLockedTransfered',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newBuyersLockupPeriod', type: 'uint256'}],
    name: 'setBuyersLockupPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract ICVIOracle', name: '_newOracle', type: 'address'}],
    name: 'setCVIOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_newEmergencyWithdrawAllowed', type: 'bool'}],
    name: 'setEmergencyWithdrawAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IFeesCalculator', name: '_newCalculator', type: 'address'}],
    name: 'setFeesCalculator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IFeesCollector', name: '_newCollector', type: 'address'}],
    name: 'setFeesCollector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IFeesModel', name: '_newModel', type: 'address'}],
    name: 'setFeesModel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newLPLockupPeriod', type: 'uint256'}],
    name: 'setLPLockupPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract ILiquidation', name: '_newLiquidation', type: 'address'}],
    name: 'setLiquidation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_revertLockedTransfers', type: 'bool'}],
    name: 'setRevertLockedTransfers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IRewards', name: '_newRewards', type: 'address'}],
    name: 'setRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalBalance',
    outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalBalanceWithAddendum',
    outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalFundingFeesAmount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalPositionUnitsAmount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'recipient', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'transfer',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'sender', type: 'address'},
      {internalType: 'address', name: 'recipient', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'transferFrom',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_tokenAmount', type: 'uint256'},
      {internalType: 'uint256', name: '_maxLPTokenBurnAmount', type: 'uint256'},
    ],
    name: 'withdraw',
    outputs: [
      {internalType: 'uint256', name: 'burntAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'withdrawnAmount', type: 'uint256'},
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_lpTokensAmount', type: 'uint256'}],
    name: 'withdrawLPTokens',
    outputs: [
      {internalType: 'uint256', name: 'burntAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'withdrawnAmount', type: 'uint256'},
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const USDT_REWARDS_CONTRACT_ABI = [
  {
    inputs: [{internalType: 'contract IERC20', name: '_cviToken', type: 'address'}],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'previousOwner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PRECISION_DECIMALS',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_positionUnits', type: 'uint256'},
      {internalType: 'uint256', name: '_positionTimestamp', type: 'uint256'},
    ],
    name: 'calculatePositionReward',
    outputs: [{internalType: 'uint256', name: 'rewardAmount', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [],
    name: 'lastClaimedDay',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastMaxSingleReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRewardMaxLinearGOVI',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRewardMaxLinearPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxClaimPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxDailyReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxRewardTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxRewardTimePercentageGain',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxSingleReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platform',
    outputs: [{internalType: 'contract Platform', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [
      {internalType: 'address', name: '_account', type: 'address'},
      {internalType: 'uint256', name: '_positionUnits', type: 'uint256'},
    ],
    name: 'reward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardCalculationValidTimestamp',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardMaxLinearGOVI',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardMaxLinearPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewarder',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxClaimPeriod', type: 'uint256'}],
    name: 'setMaxClaimPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxDailyReward', type: 'uint256'}],
    name: 'setMaxDailyReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxRewardTime', type: 'uint256'}],
    name: 'setMaxRewardTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxRewardTimePercentageGain', type: 'uint256'}],
    name: 'setMaxRewardTimePercentageGain',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract Platform', name: '_newPlatform', type: 'address'}],
    name: 'setPlatform',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_newMaxSingleReward', type: 'uint256'},
      {internalType: 'uint256', name: '_rewardMaxLinearPositionUnits', type: 'uint256'},
      {internalType: 'uint256', name: '_rewardMaxLinearGOVI', type: 'uint256'},
    ],
    name: 'setRewardCalculationParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_newRewarder', type: 'address'}],
    name: 'setRewarder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'todayClaimedRewards',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'unclaimedPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
]
const ETH_PLATFORM_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'string', name: '_lpTokenName', type: 'string'},
      {internalType: 'string', name: '_lpTokenSymbolName', type: 'string'},
      {internalType: 'uint256', name: '_initialTokenToLPTokenRate', type: 'uint256'},
      {internalType: 'contract IFeesCalculatorV3', name: '_feesCalculator', type: 'address'},
      {internalType: 'contract ICVIOracleV3', name: '_cviOracle', type: 'address'},
      {internalType: 'contract ILiquidationV2', name: '_liquidation', type: 'address'},
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'spender', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint8', name: 'leverage', type: 'uint8'},
      {indexed: false, internalType: 'uint256', name: 'cviValue', type: 'uint256'},
    ],
    name: 'ClosePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'lpTokensAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'positionAddress', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'currentPositionBalance', type: 'uint256'},
      {indexed: false, internalType: 'bool', name: 'isBalancePositive', type: 'bool'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
    ],
    name: 'LiquidatePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint8', name: 'leverage', type: 'uint8'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'cviValue', type: 'uint256'},
    ],
    name: 'OpenPosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'previousOwner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'from', type: 'address'},
      {indexed: true, internalType: 'address', name: 'to', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'lpTokensAmount', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256'},
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_CVI_VALUE',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE_PERCENTAGE',
    outputs: [{internalType: 'uint168', name: '', type: 'uint168'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PRECISION_DECIMALS',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'owner', type: 'address'},
      {internalType: 'address', name: 'spender', type: 'address'},
    ],
    name: 'allowance',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'approve',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'balanceOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyersLockupPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'calculateLatestTurbulenceIndicatorPercent',
    outputs: [{internalType: 'uint16', name: '', type: 'uint16'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_positionAddress', type: 'address'}],
    name: 'calculatePositionBalance',
    outputs: [
      {internalType: 'uint256', name: 'currentPositionBalance', type: 'uint256'},
      {internalType: 'bool', name: 'isPositive', type: 'bool'},
      {internalType: 'uint168', name: 'positionUnitsAmount', type: 'uint168'},
      {internalType: 'uint8', name: 'leverage', type: 'uint8'},
      {internalType: 'uint256', name: 'fundingFees', type: 'uint256'},
      {internalType: 'uint256', name: 'marginDebt', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: '_positionAddress', type: 'address'},
      {internalType: 'uint168', name: '_positionUnitsAmount', type: 'uint168'},
    ],
    name: 'calculatePositionPendingFees',
    outputs: [{internalType: 'uint256', name: 'pendingFees', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint168', name: '_positionUnitsAmount', type: 'uint168'},
      {internalType: 'uint16', name: '_minCVI', type: 'uint16'},
    ],
    name: 'closePosition',
    outputs: [{internalType: 'uint256', name: 'tokenAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'cviSnapshots',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{internalType: 'uint8', name: '', type: 'uint8'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'subtractedValue', type: 'uint256'},
    ],
    name: 'decreaseAllowance',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'minLPTokenAmount', type: 'uint256'},
    ],
    name: 'deposit',
    outputs: [{internalType: 'uint256', name: 'lpTokenAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_minLPTokenAmount', type: 'uint256'}],
    name: 'depositETH',
    outputs: [{internalType: 'uint256', name: 'lpTokenAmount', type: 'uint256'}],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdrawAllowed',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address[]', name: '_positionOwners', type: 'address[]'}],
    name: 'getLiquidableAddresses',
    outputs: [{internalType: 'address[]', name: '', type: 'address[]'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'spender', type: 'address'},
      {internalType: 'uint256', name: 'addedValue', type: 'uint256'},
    ],
    name: 'increaseAllowance',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialTokenToLPTokenRate',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'lastDepositTimestamp',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestOracleRoundId',
    outputs: [{internalType: 'uint80', name: '', type: 'uint80'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestSnapshotTimestamp',
    outputs: [{internalType: 'uint32', name: '', type: 'uint32'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address[]', name: '_positionOwners', type: 'address[]'}],
    name: 'liquidatePositions',
    outputs: [{internalType: 'uint256', name: 'finderFeeAmount', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lpsLockupPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxAllowedLeverage',
    outputs: [{internalType: 'uint8', name: '', type: 'uint8'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint168', name: 'tokenAmount', type: 'uint168'},
      {internalType: 'uint16', name: 'maxCVI', type: 'uint16'},
      {internalType: 'uint168', name: 'maxBuyingPremiumFeePercentage', type: 'uint168'},
      {internalType: 'uint8', name: 'leverage', type: 'uint8'},
    ],
    name: 'openPosition',
    outputs: [{internalType: 'uint168', name: 'positionUnitsAmount', type: 'uint168'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint16', name: '_maxCVI', type: 'uint16'},
      {internalType: 'uint168', name: '_maxBuyingPremiumFeePercentage', type: 'uint168'},
      {internalType: 'uint8', name: '_leverage', type: 'uint8'},
    ],
    name: 'openPositionETH',
    outputs: [{internalType: 'uint256', name: 'positionUnitsAmount', type: 'uint256'}],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'positions',
    outputs: [
      {internalType: 'uint168', name: 'positionUnitsAmount', type: 'uint168'},
      {internalType: 'uint8', name: 'leverage', type: 'uint8'},
      {internalType: 'uint16', name: 'openCVIValue', type: 'uint16'},
      {internalType: 'uint32', name: 'creationTimestamp', type: 'uint32'},
      {internalType: 'uint32', name: 'originalCreationTimestamp', type: 'uint32'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'revertLockedTransfered',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newBuyersLockupPeriod', type: 'uint256'}],
    name: 'setBuyersLockupPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract ICVIOracleV3', name: '_newOracle', type: 'address'}],
    name: 'setCVIOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_newCanPurgeSnapshots', type: 'bool'}],
    name: 'setCanPurgeSnapshots',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_newEmergencyWithdrawAllowed', type: 'bool'}],
    name: 'setEmergencyWithdrawAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IFeesCalculatorV3', name: '_newCalculator', type: 'address'}],
    name: 'setFeesCalculator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IFeesCollector', name: '_newCollector', type: 'address'}],
    name: 'setFeesCollector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newLPLockupPeriod', type: 'uint256'}],
    name: 'setLPLockupPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint80', name: '_newOracleRoundId', type: 'uint80'}],
    name: 'setLatestOracleRoundId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract ILiquidationV2', name: '_newLiquidation', type: 'address'}],
    name: 'setLiquidation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint8', name: '_newMaxAllowedLeverage', type: 'uint8'}],
    name: 'setMaxAllowedLeverage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_revertLockedTransfers', type: 'bool'}],
    name: 'setRevertLockedTransfers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IPositionRewardsV2', name: '_newRewards', type: 'address'}],
    name: 'setRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_newStakingContractAddress', type: 'address'}],
    name: 'setStakingContractAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalBalance',
    outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalBalanceWithAddendum',
    outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalFundingFeesAmount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalLeveragedTokensAmount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalPositionUnitsAmount',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'recipient', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'transfer',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'sender', type: 'address'},
      {internalType: 'address', name: 'recipient', type: 'address'},
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'transferFrom',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_tokenAmount', type: 'uint256'},
      {internalType: 'uint256', name: '_maxLPTokenBurnAmount', type: 'uint256'},
    ],
    name: 'withdraw',
    outputs: [
      {internalType: 'uint256', name: 'burntAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'withdrawnAmount', type: 'uint256'},
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_lpTokensAmount', type: 'uint256'}],
    name: 'withdrawLPTokens',
    outputs: [
      {internalType: 'uint256', name: 'burntAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'withdrawnAmount', type: 'uint256'},
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const ETH_REWARDS_CONTRACT_ABI = [
  {
    inputs: [{internalType: 'contract IERC20', name: '_cviToken', type: 'address'}],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'rewardAmount', type: 'uint256'},
    ],
    name: 'Claimed',
    type: 'event',
    signature: '0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'previousOwner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnershipTransferred',
    type: 'event',
    signature: '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
  },
  {
    inputs: [],
    name: 'PRECISION_DECIMALS',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x60ebfee6',
  },
  {
    inputs: [],
    name: 'lastClaimedDay',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xae7715b1',
  },
  {
    inputs: [],
    name: 'lastMaxSingleReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xe3aa8b48',
  },
  {
    inputs: [],
    name: 'lastRewardMaxLinearGOVI',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xafb03518',
  },
  {
    inputs: [],
    name: 'lastRewardMaxLinearPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x179fd845',
  },
  {
    inputs: [],
    name: 'maxClaimPeriod',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x6ae3484e',
  },
  {
    inputs: [],
    name: 'maxDailyReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x5fb87206',
  },
  {
    inputs: [],
    name: 'maxRewardTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x551996f8',
  },
  {
    inputs: [],
    name: 'maxRewardTimePercentageGain',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xb3b6965a',
  },
  {
    inputs: [],
    name: 'maxSingleReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x9e5f4e9d',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x8da5cb5b',
  },
  {
    inputs: [],
    name: 'platform',
    outputs: [{internalType: 'contract PlatformV2', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x4bde38c8',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x715018a6',
  },
  {
    inputs: [],
    name: 'rewardCalculationValidTimestamp',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x66487d78',
  },
  {
    inputs: [],
    name: 'rewardFactor',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x1c41ef97',
  },
  {
    inputs: [],
    name: 'rewardMaxLinearGOVI',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xca4250a9',
  },
  {
    inputs: [],
    name: 'rewardMaxLinearPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x1057729e',
  },
  {
    inputs: [],
    name: 'rewarder',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xdcc3e06e',
  },
  {
    inputs: [],
    name: 'todayClaimedRewards',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xc4aca6f7',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xf2fde38b',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'unclaimedPositionUnits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xb6929eb4',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_positionUnits', type: 'uint256'},
      {internalType: 'uint256', name: '_positionTimestamp', type: 'uint256'},
    ],
    name: 'calculatePositionReward',
    outputs: [{internalType: 'uint256', name: 'rewardAmount', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x5ffc5424',
  },
  {
    inputs: [
      {internalType: 'address', name: '_account', type: 'address'},
      {internalType: 'uint256', name: '_positionUnits', type: 'uint256'},
      {internalType: 'uint8', name: '_leverage', type: 'uint8'},
    ],
    name: 'reward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x2fc6511c',
  },
  {
    inputs: [],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xb88a802f',
  },
  {
    inputs: [{internalType: 'address', name: '_newRewarder', type: 'address'}],
    name: 'setRewarder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x3a6462e4',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxDailyReward', type: 'uint256'}],
    name: 'setMaxDailyReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x6ee30fd9',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_newMaxSingleReward', type: 'uint256'},
      {internalType: 'uint256', name: '_rewardMaxLinearPositionUnits', type: 'uint256'},
      {internalType: 'uint256', name: '_rewardMaxLinearGOVI', type: 'uint256'},
    ],
    name: 'setRewardCalculationParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xf37bfe2d',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newRewardFactor', type: 'uint256'}],
    name: 'setRewardFactor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x2157c0e7',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxClaimPeriod', type: 'uint256'}],
    name: 'setMaxClaimPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x0598e0bf',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxRewardTime', type: 'uint256'}],
    name: 'setMaxRewardTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x6a538591',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newMaxRewardTimePercentageGain', type: 'uint256'}],
    name: 'setMaxRewardTimePercentageGain',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xe126dad3',
  },
  {
    inputs: [{internalType: 'contract PlatformV2', name: '_newPlatform', type: 'address'}],
    name: 'setPlatform',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x6945c5ea',
  },
]
const GOVI_STAKING_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'contract IERC20', name: '_cviToken', type: 'address'},
      {internalType: 'contract IUniswapV2Router02', name: '_uniswapRouter', type: 'address'},
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'previousOwner', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PRECISION_DECIMALS',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '_newClaimableToken', type: 'address'}],
    name: 'addClaimableToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '_newToken', type: 'address'}],
    name: 'addToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimAllProfits',
    outputs: [{internalType: 'uint256[]', name: '', type: 'uint256[]'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: 'token', type: 'address'}],
    name: 'claimProfit',
    outputs: [{internalType: 'uint256', name: 'profit', type: 'uint256'}],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {inputs: [], name: 'convertFunds', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [],
    name: 'creationTimestamp',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fallbackRecipient',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getClaimableTokens',
    outputs: [{internalType: 'contract IERC20[]', name: '', type: 'address[]'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOtherTokens',
    outputs: [{internalType: 'contract IERC20[]', name: '', type: 'address[]'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: '_account', type: 'address'},
      {internalType: 'contract IERC20', name: '_token', type: 'address'},
    ],
    name: 'profitOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '_removedClaimableToken', type: 'address'}],
    name: 'removeClaimableToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '_removedToken', type: 'address'}],
    name: 'removeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [
      {internalType: 'uint256', name: '_amount', type: 'uint256'},
      {internalType: 'contract IERC20', name: '_token', type: 'address'},
    ],
    name: 'sendProfit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_newLockupTime', type: 'uint256'}],
    name: 'setStakingLockupTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakeLockupTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'stakeTimestamps',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'stakes',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    name: 'totalProfits',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStaked',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {stateMutability: 'payable', type: 'receive'},
]
const GOVI_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'address', name: '_owner', type: 'address'},
      {internalType: 'address', name: '_rewardsDistribution', type: 'address'},
      {internalType: 'address', name: '_rewardsToken', type: 'address'},
      {internalType: 'address', name: '_stakingToken', type: 'address'},
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: false, internalType: 'address', name: 'oldOwner', type: 'address'},
      {indexed: false, internalType: 'address', name: 'newOwner', type: 'address'},
    ],
    name: 'OwnerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'OwnerNominated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, internalType: 'bool', name: 'isPaused', type: 'bool'}],
    name: 'PauseChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: false, internalType: 'address', name: 'token', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'Recovered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256'}],
    name: 'RewardAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256'},
    ],
    name: 'RewardPaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{indexed: false, internalType: 'uint256', name: 'newDuration', type: 'uint256'}],
    name: 'RewardsDurationUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'balanceOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'earned',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [],
    name: 'getRewardForDuration',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastPauseTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastTimeRewardApplicable',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastUpdateTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_owner', type: 'address'}],
    name: 'nominateNewOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nominatedOwner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
    name: 'notifyRewardAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'periodFinish',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: 'tokenAddress', type: 'address'},
      {internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardPerToken',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardPerTokenStored',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardRate',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'rewards',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsDistribution',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsDuration',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'bool', name: '_paused', type: 'bool'}],
    name: 'setPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_rewardsDistribution', type: 'address'}],
    name: 'setRewardsDistribution',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_rewardsDuration', type: 'uint256'}],
    name: 'setRewardsDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'userRewardPerTokenPaid',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const USDT_PLATFORM_CONTRACT_ADDRESS = '0xe0437BeB5bb7Cf980e90983f6029033d710bd1da'
const USDT_REWARDS_CONTRACT_ADDRESS = '0xe9d634d2767079a2bff2ced1584f8f5623492ab4'
const ETH_PLATFORM_CONTRACT_ADDRESS = '0x5005e8Dc0033E78AF80cfc8d10f5163f2FcF0E79'
const ETH_REWARDS_CONTRACT_ADDRESS = '0xd5c0A6094f005D75b6E99a3DA8d0B80127027C99'
const GOVI_STAKING_CONTRACT_ADDRESS = '0xDb3130952eD9b5fa7108deDAAA921ae8f59beaCb'

const GOVI_CONTRACT_ADDRESS = '0xeeaa40b28a2d1b0b08f6f97bb1dd4b75316c6107'
const USDT_CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'
const ETH_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'

const Pools = [
  '0xDB14a3B5BdFd0cD7b2Ef5075b2689290d9eDC915',
  '0x40d203332b0A262F1a371ae9dA1788fe6825A6F6',
  '0xe6e5220291CF78b6D93bd1d08D746ABbC115C64b',
  '0x936Dd3112a9D39Af39aDdA798503D9E7E7975Fb7',
  '0x8eed31C1B0E147E56db836C40129Eeb03cb62abD',
  '0xcF05a60bCBC9c85cb2548DAfDC444c666A8F466a',
].map(a => {
  return {
    address: a,
    abi: GOVI_CONTRACT_ABI,
    stakeTokenFunction: 'stakingToken',
    rewardTokenFunction: 'rewardsToken',
  }
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...\n')

  const usdtPlatformInfo = await getPlatformInfo(
    'USDT',
    USDT_CONTRACT_ADDRESS,
    USDT_PLATFORM_CONTRACT_ADDRESS,
    USDT_PLATFORM_CONTRACT_ABI,
    USDT_REWARDS_CONTRACT_ADDRESS,
    USDT_REWARDS_CONTRACT_ABI,
    App
  )
  const ethPlatformInfo = await getPlatformInfo(
    'ETH',
    ETH_CONTRACT_ADDRESS,
    ETH_PLATFORM_CONTRACT_ADDRESS,
    ETH_PLATFORM_CONTRACT_ABI,
    ETH_REWARDS_CONTRACT_ADDRESS,
    ETH_REWARDS_CONTRACT_ABI,
    App
  )
  await printPlatform(usdtPlatformInfo, App)
  await printPlatform(ethPlatformInfo, App)

  const goviStakingInfo = await getStakingInfo(
    GOVI_CONTRACT_ADDRESS,
    GOVI_STAKING_CONTRACT_ADDRESS,
    GOVI_STAKING_CONTRACT_ABI,
    App
  )
  await printGOVIStaking(goviStakingInfo, App)

  var tokens = {}
  var prices = {
    [USDT_PLATFORM_CONTRACT_ADDRESS]: {usd: getLPTokenUSDPrice(usdtPlatformInfo)},
    [ETH_PLATFORM_CONTRACT_ADDRESS]: {usd: getLPTokenUSDPrice(ethPlatformInfo)},
  }

  let p = await loadMultipleSynthetixPools(App, tokens, prices, Pools)
  _print_bold(`Total staked: $${formatMoney(p.staked_tvl)}`)
  if (p.totalUserStaked > 0) {
    _print(
      `You are staking a total of $${formatMoney(p.totalUserStaked)} at an APR of ${(p.totalAPR * 100).toFixed(2)}%\n`
    )
  }

  hideLoading()
}

async function getPlatformInfo(
  platformName,
  tokenAddress,
  platformAddress,
  platformABI,
  rewardsAddress,
  rewardsABI,
  App
) {
  let priceToken = tokenAddress
  if (tokenAddress == '0x0000000000000000000000000000000000000000') {
    priceToken = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    symbolPromise = (async () => 'ETH')()
    decimalsPromise = (async () => 18)()
    totalSupplyPromise = (async () => 1e8)()
    balancePromise = App.provider.getBalance(App.YOUR_ADDRESS)
    stakedPromise = App.provider.getBalance(platformAddress)
  } else {
    tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, App.provider)
    symbolPromise = tokenContract.symbol()
    decimalsPromise = tokenContract.decimals()
    totalSupplyPromise = tokenContract.totalSupply()
    balancePromise = tokenContract.balanceOf(App.YOUR_ADDRESS)
    stakedPromise = tokenContract.balanceOf(platformAddress)
  }
  pricePromise = lookUpTokenPrices([priceToken])

  const platformContract = new ethers.Contract(platformAddress, platformABI, App.provider)
  const lpSymbolPromise = platformContract.symbol()
  const lpDecimalsPromise = platformContract.decimals()
  const lpBalancePromise = platformContract.balanceOf(App.YOUR_ADDRESS)
  const platformTotalSupplyPromise = platformContract.totalSupply()
  const platformTotalBalancePromise = platformContract.totalBalanceWithAddendum()
  const positionPromise = platformContract.positions(App.YOUR_ADDRESS)
  try {
    pos = await platformContract.calculatePositionBalance(App.YOUR_ADDRESS)
    positionBalance = pos[0]
    positionUnitsAmount = pos[2]
  } catch (error) {
    positionBalance = 0
    positionUnitsAmount = 0
  }

  const rewardsContract = new ethers.Contract(rewardsAddress, rewardsABI, App.provider)
  const unclaimedPositionUnitsPromise = rewardsContract.unclaimedPositionUnits(App.YOUR_ADDRESS)
  const maxClaimPeriodPromise = rewardsContract.maxClaimPeriod()
  const maxDailyRewardPromise = rewardsContract.maxDailyReward()
  const lastClaimedDayPromise = rewardsContract.lastClaimedDay()
  const todayClaimedRewardsPromise = rewardsContract.todayClaimedRewards()

  const calls = [
    pricePromise,
    symbolPromise,
    decimalsPromise,
    totalSupplyPromise,
    balancePromise,
    stakedPromise,
    lpSymbolPromise,
    lpDecimalsPromise,
    lpBalancePromise,
    platformTotalSupplyPromise,
    platformTotalBalancePromise,
    positionPromise,
    unclaimedPositionUnitsPromise,
    maxClaimPeriodPromise,
    maxDailyRewardPromise,
    lastClaimedDayPromise,
    todayClaimedRewardsPromise,
  ]
  const [
    price,
    symbol,
    decimals,
    totalSupply,
    balance,
    staked,
    lpSymbol,
    lpDecimals,
    lpBalance,
    platformTotalSupply,
    platformTotalBalance,
    position,
    unclaimedPositionUnits,
    maxClaimPeriod,
    maxDailyReward,
    lastClaimedDay,
    todayClaimedRewards,
  ] = await Promise.all(calls)

  return {
    platformName,
    rewardsAddress,
    rewardsABI,
    rewardsContract,
    tokenAddress,
    tokenContract,
    platformAddress,
    platformABI,
    platformContract,
    price: price[priceToken].usd,
    symbol,
    decimals,
    totalSupply,
    balance,
    staked,
    lpSymbol,
    lpDecimals,
    lpBalance,
    platformTotalSupply,
    platformTotalBalance,
    positionUnitsAmount,
    positionBalance,
    lastPosCreationTimestamp: position.creationTimestamp,
    unclaimedPositionUnits,
    maxClaimPeriod,
    maxDailyReward,
    lastClaimedDay,
    todayClaimedRewards,
  }
}

async function getStakingInfo(goviAddress, stakingAddress, stakingABI, App) {
  const pricePromise = lookUpTokenPrices([goviAddress])

  const goviContract = new ethers.Contract(goviAddress, ERC20_ABI, App.provider)
  const symbolPromise = goviContract.symbol()
  const decimalsPromise = goviContract.decimals()
  const totalSupplyPromise = goviContract.totalSupply()
  const balancePromise = goviContract.balanceOf(App.YOUR_ADDRESS)
  const stakedPromise = goviContract.balanceOf(stakingAddress)

  const stakingContract = new ethers.Contract(stakingAddress, stakingABI, App.provider)
  const stakedBalancePromise = stakingContract.stakes(App.YOUR_ADDRESS)
  const stakedTotalPromise = stakingContract.totalStaked()
  const claimableTokensPromise = stakingContract.getClaimableTokens()

  const calls = [
    pricePromise,
    symbolPromise,
    decimalsPromise,
    totalSupplyPromise,
    balancePromise,
    stakedPromise,
    stakedBalancePromise,
    stakedTotalPromise,
    claimableTokensPromise,
  ]
  const [
    price,
    symbol,
    decimals,
    totalSupply,
    balance,
    staked,
    stakedBalance,
    stakedTotal,
    claimableTokens,
  ] = await Promise.all(calls)

  const profitCalls = []
  claimableTokens.forEach(tokenAddress => {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, App.provider)
    const tokenSymbolPromise = tokenContract.symbol()
    const tokenDecimalsPromise = tokenContract.decimals()
    const profitPromise = stakingContract.profitOf(App.YOUR_ADDRESS, tokenAddress)
    profitCalls.push(tokenSymbolPromise, tokenDecimalsPromise, profitPromise)
  })
  const response = await Promise.all(profitCalls)
  const tokenProfits = {}
  for (let i = 0; i < claimableTokens.length; i++) {
    tokenProfits[claimableTokens[i]] = {
      symbol: response[3 * i],
      decimals: response[3 * i + 1],
      profit: response[3 * i + 2],
    }
  }

  return {
    goviAddress,
    stakingAddress,
    stakingABI,
    price: price[goviAddress].usd,
    symbol,
    decimals,
    totalSupply,
    balance,
    staked,
    stakedBalance,
    stakedTotal,
    claimableTokens,
    tokenProfits,
  }
}

function getLPTokenUSDPrice(info) {
  const totalBalance = info.platformTotalBalance / 10 ** info.decimals
  const totalSupply = info.platformTotalSupply / 10 ** info.lpDecimals
  return (totalBalance / totalSupply) * info.price
}

async function printPlatform(info, App) {
  const tvl = (info.staked / 10 ** info.decimals) * info.price
  const liquidityLocked = info.platformTotalBalance / 10 ** info.decimals
  const posLocked = (info.staked - info.platformTotalBalance) / 10 ** info.decimals
  _print(`[${info.platformName} Platform] Price: $${formatMoney(info.price)} TVL: $${formatMoney(tvl)}`)
  _print(`Positions Locked: ${posLocked.toFixed(4)} ${info.symbol} ($${formatMoney(posLocked * info.price)})`)
  _print(
    `Liquidity Locked: ${liquidityLocked.toFixed(4)} ${info.symbol} ($${formatMoney(liquidityLocked * info.price)})`
  )
  platformPositions(info, App)
  platformLiquidity(info, App)
  await platform_claim(info, App)
  _print(`<a target="_blank" href="https://etherscan.io/address/${info.platformAddress}#code">Etherscan</a>`)
  _print(`\n`)
}

async function printGOVIStaking(info, App) {
  const tvl = (info.staked / 10 ** info.decimals) * info.price
  const yourShare = info.stakedBalance / 10 ** info.decimals
  const poolShare = (info.stakedBalance / info.stakedTotal) * 100
  const totalStaked = info.stakedTotal / 10 ** info.decimals
  _print(`[${info.symbol} Staking] Price: $${formatMoney(info.price)} TVL: $${formatMoney(tvl)}`)
  _print(`Total Staked: ${totalStaked.toFixed(4)} ($${formatMoney(totalStaked * info.price)})`)
  _print(
    `Your Stake: ${yourShare.toFixed(4)} ${info.symbol} ($${formatMoney(yourShare * info.price)}) (${poolShare.toFixed(
      2
    )}% of the pool)`
  )
  await staking_stake(info, App)
  await staking_unstake(info, App)
  for (const token in info.tokenProfits) await staking_profit(info, token, App)
  await staking_allProfit(info, App)
  _print(`<a target="_blank" href="https://etherscan.io/address/${info.address}#code">Etherscan</a>`)
  _print(`\n`)
}

function platformPositions(info, App) {
  const position = info.positionBalance / 10 ** info.decimals
  const buyLink = `<a target="_blank" href="https://cvi.finance/platform/positions?view=buy&currency=${info.symbol}">[+]</a>`
  const sellLink = `<a target="_blank" href="https://cvi.finance/platform/positions?view=sell&currency=${info.symbol}">[-]</a>`
  _print(`Your Position: ${position.toFixed(4)} ${info.symbol} [${info.positionUnitsAmount}] ${buyLink} ${sellLink}`)
}

function platformLiquidity(info, App) {
  const liquidity = info.lpBalance / 10 ** info.lpDecimals
  const usdLiquidity = liquidity * getLPTokenUSDPrice(info)
  const depositLink = `<a target="_blank" href="https://cvi.finance/platform/liquidity?view=deposit&currency=${info.symbol}">[+]</a>`
  const withdrawLink = `<a target="_blank" href="https://cvi.finance/platform/liquidity?view=withdraw&currency=${info.symbol}">[-]</a>`
  _print(
    `Your Liquidity: ${liquidity.toFixed(4)} ${info.lpSymbol} [$${formatMoney(
      usdLiquidity
    )}] ${depositLink} ${withdrawLink}`
  )
}

function checkClaim(info, reward) {
  if (reward == 0) return {result: 0, reason: 'Nothing to claim'}
  const now = new Date().getTime() / 1000
  const today = Math.floor(now / 86400)
  if (now > info.lastPosCreationTimestamp + info.maxClaimPeriod) return {result: 0, reason: 'Claim too late'}
  if (today <= Math.floor(info.lastPosCreationTimestamp / 86400)) return {result: 0, reason: 'Claim too early'}
  const todayClaimedRewards = today <= info.lastClaimedDay ? info.todayClaimedRewards + reward : reward
  if (todayClaimedRewards > info.maxDailyReward) return {result: 0, reason: 'Not enough daily reward left for today'}
  return {result: 1}
}

async function platform_claim(info, App) {
  const unclaimed = info.unclaimedPositionUnits / 10 ** info.decimals
  const position = info.positionUnitsAmount / 10 ** info.decimals
  const claimableUnits = unclaimed < position ? info.unclaimedPositionUnits : info.positionUnitsAmount
  const reward =
    claimableUnits > 0
      ? await info.rewardsContract.calculatePositionReward(claimableUnits, info.lastPosCreationTimestamp)
      : 0
  const canClaim = checkClaim(info, reward)

  const claim = async function() {
    return await send(info.rewardsAddress, info.rewardsABI, canClaim.result, 'claimReward', [{gasLimit: 2500000}], App)
  }
  const claimableString = `${canClaim.result ? 'Can Claim' : canClaim.reason}`
  _print_link(`Claim Position Reward ${(reward / 10 ** 18).toFixed(4)} GOVI [${claimableString}]`, claim)
}

async function staking_stake(info, App) {
  let availableAmount = info.balance
  let params = [availableAmount, {gasLimit: 2500000}]
  const stake = async function() {
    return await approveSend(info.stakingAddress, info.stakingABI, info.goviAddress, 'stake', params, App)
  }

  _print_link(`Stake ${availableAmount / 10 ** info.decimals} ${info.symbol}`, stake)
}

async function staking_unstake(info, App) {
  let availableAmount = info.stakedBalance
  let params = [availableAmount, {gasLimit: 2500000}]
  const unstake = async function() {
    return await send(info.stakingAddress, info.stakingABI, availableAmount, 'unstake', params, App)
  }

  _print_link(`Unstake ${availableAmount / 10 ** info.decimals} ${info.symbol}`, unstake)
}

async function staking_profit(info, token, App) {
  const symbol = info.tokenProfits[token].symbol
  const decimals = info.tokenProfits[token].decimals
  const profit = info.tokenProfits[token].profit
  const params = [token, {gasLimit: 250000}]

  const claim = async function() {
    return await send(info.stakingAddress, info.stakingABI, profit, 'claimProfit', params, App)
  }

  _print_link(`Claim Token Profit ${profit / 10 ** decimals} ${symbol}`, claim)
}

async function staking_allProfit(info, App) {
  const claimAll = async function() {
    return await send(info.stakingAddress, info.stakingABI, 1, 'claimAllProfits', [{gasLimit: 6000000}], App)
  }

  _print_link(`Claim All Profits`, claimAll)
}

async function send(address, abi, availableAmount, callFunc, params, App) {
  const signer = App.provider.getSigner()
  const contract = new ethers.Contract(address, abi, signer)

  console.log(`send ${callFunc}(${params.join(', ')})`)

  if (availableAmount > 0) {
    showLoading()
    contract[callFunc](...params)
      .then(function(t) {
        return App.provider.waitForTransaction(t.hash)
      })
      .catch(function() {
        hideLoading()
      })
  }
}

const approveSend = async function(address, abi, tokenAddress, callFunc, params, App) {
  const signer = App.provider.getSigner()

  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
  const contract = new ethers.Contract(address, abi, signer)

  const currentTokens = await tokenContract.balanceOf(App.YOUR_ADDRESS)
  const allowedTokens = await tokenContract.allowance(App.YOUR_ADDRESS, address)

  let allow = Promise.resolve()

  if (allowedTokens / 1e18 < currentTokens / 1e18) {
    showLoading()
    allow = tokenContract
      .approve(address, ethers.constants.MaxUint256)
      .then(function(t) {
        return App.provider.waitForTransaction(t.hash)
      })
      .catch(function() {
        hideLoading()
        alert('Try resetting your approval to 0 first')
      })
  }

  if (currentTokens / 1e18 > 0) {
    showLoading()
    allow
      .then(async function() {
        contract[callFunc](...params)
          .then(function(t) {
            App.provider.waitForTransaction(t.hash).then(function() {
              hideLoading()
            })
          })
          .catch(function() {
            hideLoading()
            _print('Something went wrong.')
          })
      })
      .catch(function() {
        hideLoading()
        _print('Something went wrong.')
      })
  } else {
    alert('You have no tokens to stake!!')
  }
}
