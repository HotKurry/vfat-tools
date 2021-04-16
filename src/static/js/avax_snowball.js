$(function() {
  consoleInit()
  start(main)
})

//this is the site https://snowballfinance.info/staking/
//there is another contract with 3 more pools
//I have to put it in AVAX Index
const SNOB_CHEF_ABI = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      {type: 'address', name: '_snowball', internalType: 'contract Snowball'},
      {type: 'address', name: '_devfund', internalType: 'address'},
      {type: 'address', name: '_treasury', internalType: 'address'},
      {type: 'uint256', name: '_snowballPerBlock', internalType: 'uint256'},
      {type: 'uint256', name: '_startBlock', internalType: 'uint256'},
      {type: 'uint256', name: '_bonusEndBlock', internalType: 'uint256'},
    ],
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {type: 'address', name: 'user', internalType: 'address', indexed: true},
      {type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true},
      {type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false},
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyWithdraw',
    inputs: [
      {type: 'address', name: 'user', internalType: 'address', indexed: true},
      {type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true},
      {type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false},
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {type: 'address', name: 'previousOwner', internalType: 'address', indexed: true},
      {type: 'address', name: 'newOwner', internalType: 'address', indexed: true},
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Recovered',
    inputs: [
      {type: 'address', name: 'token', internalType: 'address', indexed: false},
      {type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false},
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {type: 'address', name: 'user', internalType: 'address', indexed: true},
      {type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true},
      {type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false},
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'BONUS_MULTIPLIER',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'add',
    inputs: [
      {type: 'uint256', name: '_allocPoint', internalType: 'uint256'},
      {type: 'address', name: '_lpToken', internalType: 'contract IERC20'},
      {type: 'bool', name: '_withUpdate', internalType: 'bool'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'bonusEndBlock',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'deposit',
    inputs: [
      {type: 'uint256', name: '_pid', internalType: 'uint256'},
      {type: 'uint256', name: '_amount', internalType: 'uint256'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'devFundDivRate',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'address'}],
    name: 'devfund',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'emergencyWithdraw',
    inputs: [{type: 'uint256', name: '_pid', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'getMultiplier',
    inputs: [
      {type: 'uint256', name: '_from', internalType: 'uint256'},
      {type: 'uint256', name: '_to', internalType: 'uint256'},
    ],
  },
  {type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'massUpdatePools', inputs: []},
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'address'}],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'pendingSnowball',
    inputs: [
      {type: 'uint256', name: '_pid', internalType: 'uint256'},
      {type: 'address', name: '_user', internalType: 'address'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {type: 'address', name: 'lpToken', internalType: 'contract IERC20'},
      {type: 'uint256', name: 'allocPoint', internalType: 'uint256'},
      {type: 'uint256', name: 'lastRewardBlock', internalType: 'uint256'},
      {type: 'uint256', name: 'accSnowballPerShare', internalType: 'uint256'},
    ],
    name: 'poolInfo',
    inputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'poolLength',
    inputs: [],
  },
  {type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'renounceOwnership', inputs: []},
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'set',
    inputs: [
      {type: 'uint256', name: '_pid', internalType: 'uint256'},
      {type: 'uint256', name: '_allocPoint', internalType: 'uint256'},
      {type: 'bool', name: '_withUpdate', internalType: 'bool'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setBonusEndBlock',
    inputs: [{type: 'uint256', name: '_bonusEndBlock', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setDevFundDivRate',
    inputs: [{type: 'uint256', name: '_devFundDivRate', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setSnowballPerBlock',
    inputs: [{type: 'uint256', name: '_snowballPerBlock', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setTreasuryDivRate',
    inputs: [{type: 'uint256', name: '_treasuryDivRate', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'contract Snowball'}],
    name: 'snowball',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'snowballPerBlock',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'startBlock',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'totalAllocPoint',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [{type: 'address', name: 'newOwner', internalType: 'address'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'address'}],
    name: 'treasury',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'treasuryDivRate',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateDevfund',
    inputs: [{type: 'address', name: '_devfund', internalType: 'address'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updatePool',
    inputs: [{type: 'uint256', name: '_pid', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updateTreasury',
    inputs: [{type: 'address', name: '_treasury', internalType: 'address'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {type: 'uint256', name: 'amount', internalType: 'uint256'},
      {type: 'uint256', name: 'rewardDebt', internalType: 'uint256'},
    ],
    name: 'userInfo',
    inputs: [
      {type: 'uint256', name: '', internalType: 'uint256'},
      {type: 'address', name: '', internalType: 'address'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdraw',
    inputs: [
      {type: 'uint256', name: '_pid', internalType: 'uint256'},
      {type: 'uint256', name: '_amount', internalType: 'uint256'},
    ],
  },
]

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const SNOB_CHEF_ADDR = '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375'
  const rewardTokenTicker = 'SNOB'
  const SNOB_CHEF = new ethers.Contract(SNOB_CHEF_ADDR, SNOB_CHEF_ABI, App.provider)

  const blockNum = await App.provider.getBlockNumber()
  const multiplier = await SNOB_CHEF.getMultiplier(blockNum, blockNum + 1)

  const blocksPerSeconds = await getAverageBlockTime(App)

  const rewardsPerWeek = ((((await SNOB_CHEF.snowballPerBlock()) / 1e18) * 604800) / blocksPerSeconds) * multiplier

  const tokens = {}
  const prices = await getAvaxPrices()

  await loadAvaxChefContract(
    App,
    tokens,
    prices,
    SNOB_CHEF,
    SNOB_CHEF_ADDR,
    SNOB_CHEF_ABI,
    rewardTokenTicker,
    'snowball',
    null,
    rewardsPerWeek,
    'pendingSnowball',
    null,
    [0]
  )

  hideLoading()
}
