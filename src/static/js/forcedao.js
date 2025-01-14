$(function() {
  consoleInit()
  start(main)
})

const FORCE_CONTRACT_ABI = [
  {
    inputs: [
      {internalType: 'address', name: '_rewardToken', type: 'address'},
      {internalType: 'address', name: '_lpToken', type: 'address'},
      {internalType: 'uint256', name: '_duration', type: 'uint256'},
      {internalType: 'address', name: '_rewardDistribution', type: 'address'},
      {internalType: 'address', name: '_storage', type: 'address'},
      {internalType: 'address', name: '_sourceVault', type: 'address'},
      {internalType: 'address', name: '_migrationStrategy', type: 'address'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'account', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'legacyShare', type: 'uint256'},
      {indexed: false, internalType: 'uint256', name: 'newShare', type: 'uint256'},
    ],
    name: 'Migrated',
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
    name: 'RewardDenied',
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
    inputs: [
      {indexed: true, internalType: 'address', name: 'smartContractAddress', type: 'address'},
      {indexed: true, internalType: 'address', name: 'smartContractInitiator', type: 'address'},
    ],
    name: 'SmartContractRecorded',
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
  {
    constant: true,
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'balanceOf',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'canMigrate',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'controller',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'duration',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: 'account', type: 'address'}],
    name: 'earned',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'exit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'getReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'governance',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastTimeRewardApplicable',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastUpdateTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lpToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'migrate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'migrationStrategy',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
    name: 'notifyRewardAmount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'periodFinish',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'pullFromStrategy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: 'recipient', type: 'address'}],
    name: 'pushReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardDistribution',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardPerToken',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardPerTokenStored',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardRate',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'rewards',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'bool', name: '_canMigrate', type: 'bool'}],
    name: 'setCanMigrate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
    name: 'setRewardDistribution',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: '_store', type: 'address'}],
    name: 'setStorage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'sourceVault',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
    name: 'stake',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'store',
    outputs: [{internalType: 'contract Storage', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'userRewardPerTokenPaid',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const Pools = [
  '0xDAa207f43B3F31f14216A181047EC0D596DD1713', //x3CRV
  '0x45E60E1bee16Df15f2b87F15F2Acba6F3869462c', //USDC
  '0xe87e8E44fA0eE3aBDf10fc2c719Fc9ffDdB48b5F', //USDT
  '0x469034dc349101007903A0e99F2A2569c2130CbB', //DAI
  '0x2E411e3c25CA31a2811d8B85c9f7A9a3f4826C8e', //ETH-USDT (slp)
  '0xC7A9B95b15056CAF5B8FA551b3bC3e10c7798FEf', //ETH-USDC (slp)
  '0x5Bf886f98d83E53AAB06f831b8A153430de6c847', //ETH-DAI  (slp)
].map(a => {
  return {
    address: a,
    abi: FORCE_CONTRACT_ABI,
    stakeTokenFunction: 'lpToken',
    rewardTokenFunction: 'rewardToken',
  }
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...\n')

  var tokens = {}
  var prices = {}

  let p = await loadMultipleSynthetixPools(App, tokens, prices, Pools)
  _print_bold(`Total staked: $${formatMoney(p.staked_tvl)}`)
  if (p.totalUserStaked > 0) {
    _print(
      `You are staking a total of $${formatMoney(p.totalUserStaked)} at an APR of ${(p.totalAPR * 100).toFixed(2)}%\n`
    )
  }

  hideLoading()
}
