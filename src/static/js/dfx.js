$(function() {
  consoleInit()
  start(main)
})

const DFX_ABI = [
  {
    inputs: [
      {internalType: 'address', name: '_owner', type: 'address'},
      {internalType: 'address', name: '_rewardsToken', type: 'address'},
      {internalType: 'address', name: '_stakingToken', type: 'address'},
    ],
    payable: false,
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
  {
    constant: false,
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
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
    name: 'getRewardForDuration',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastPauseTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
    constant: false,
    inputs: [{internalType: 'address', name: '_owner', type: 'address'}],
    name: 'nominateNewOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nominatedOwner',
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
    name: 'paused',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
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
    inputs: [
      {internalType: 'address', name: 'tokenAddress', type: 'address'},
      {internalType: 'uint256', name: 'tokenAmount', type: 'uint256'},
    ],
    name: 'recoverERC20',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'rewards',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardsDuration',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rewardsToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'bool', name: '_paused', type: 'bool'}],
    name: 'setPaused',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{internalType: 'uint256', name: '_rewardsDuration', type: 'uint256'}],
    name: 'setRewardsDuration',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
    name: 'stakingToken',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
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
  '0x1Bd4F9e718442A1c9F14cc04a235119e3C0d2Cf2',
  '0xd1681390a5aC8A60D4392EB3C22CA662B2Db68D7',
  '0x0a6d3EB98AbB3754e54ABEE7dA2DDaA892Ecb980',
].map(a => {
  return {
    address: a,
    abi: DFX_ABI,
    stakeTokenFunction: 'stakingToken',
    rewardTokenFunction: 'rewardsToken',
  }
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...\n')

  let tokens = {}
  let prices = {}

  const SUSHI_CHEF_ADDR = '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd'
  const SUSHI_CHEF_ABI = [
    {
      inputs: [
        {internalType: 'contract SushiToken', name: '_sushi', type: 'address'},
        {internalType: 'address', name: '_devaddr', type: 'address'},
        {internalType: 'uint256', name: '_sushiPerBlock', type: 'uint256'},
        {internalType: 'uint256', name: '_startBlock', type: 'uint256'},
        {internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'user', type: 'address'},
        {indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'user', type: 'address'},
        {indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'EmergencyWithdraw',
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
        {indexed: true, internalType: 'address', name: 'user', type: 'address'},
        {indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Withdraw',
      type: 'event',
    },
    {
      inputs: [],
      name: 'BONUS_MULTIPLIER',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
        {internalType: 'contract IERC20', name: '_lpToken', type: 'address'},
        {internalType: 'bool', name: '_withUpdate', type: 'bool'},
      ],
      name: 'add',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'bonusEndBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: '_pid', type: 'uint256'},
        {internalType: 'uint256', name: '_amount', type: 'uint256'},
      ],
      name: 'deposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_devaddr', type: 'address'}],
      name: 'dev',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'devaddr',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
      name: 'emergencyWithdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: '_from', type: 'uint256'},
        {internalType: 'uint256', name: '_to', type: 'uint256'},
      ],
      name: 'getMultiplier',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'massUpdatePools', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
      name: 'migrate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'migrator',
      outputs: [{internalType: 'contract IMigratorChef', name: '', type: 'address'}],
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
        {internalType: 'uint256', name: '_pid', type: 'uint256'},
        {internalType: 'address', name: '_user', type: 'address'},
      ],
      name: 'pendingSushi',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      name: 'poolInfo',
      outputs: [
        {internalType: 'contract IERC20', name: 'lpToken', type: 'address'},
        {internalType: 'uint256', name: 'allocPoint', type: 'uint256'},
        {internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256'},
        {internalType: 'uint256', name: 'accSushiPerShare', type: 'uint256'},
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'poolLength',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [
        {internalType: 'uint256', name: '_pid', type: 'uint256'},
        {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
        {internalType: 'bool', name: '_withUpdate', type: 'bool'},
      ],
      name: 'set',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'contract IMigratorChef', name: '_migrator', type: 'address'}],
      name: 'setMigrator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'startBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'sushi',
      outputs: [{internalType: 'contract SushiToken', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'sushiPerBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalAllocPoint',
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
      inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
      name: 'updatePool',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: '', type: 'uint256'},
        {internalType: 'address', name: '', type: 'address'},
      ],
      name: 'userInfo',
      outputs: [
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'uint256', name: 'rewardDebt', type: 'uint256'},
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: '_pid', type: 'uint256'},
        {internalType: 'uint256', name: '_amount', type: 'uint256'},
      ],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  await loadSingleChefPool(
    App,
    tokens,
    prices,
    null,
    SUSHI_CHEF_ADDR,
    SUSHI_CHEF_ABI,
    'SUSHI',
    'sushi',
    'sushiPerBlock',
    null,
    'pendingSushi',
    172
  )

  let p = await loadMultipleSynthetixPools(App, tokens, prices, Pools)
  _print_bold(`Total staked: $${formatMoney(p.staked_tvl)}`)
  if (p.totalUserStaked > 0) {
    _print(
      `You are staking a total of $${formatMoney(p.totalUserStaked)} at an APR of ${(p.totalAPR * 100).toFixed(2)}%\n`
    )
  }

  hideLoading()
}
