$(function() {
  consoleInit()
  start(main)
})

const COM_CHEF_ABI = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      {type: 'address', name: '_com', internalType: 'contract Complus'},
      {type: 'address', name: '_devaddr', internalType: 'address'},
      {type: 'uint256', name: '_comPerBlock', internalType: 'uint256'},
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
      {type: 'address', name: '_lpToken', internalType: 'contract IARC20'},
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
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'contract Complus'}],
    name: 'com',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'uint256', name: '', internalType: 'uint256'}],
    name: 'comPerBlock',
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
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'dev',
    inputs: [{type: 'address', name: '_devaddr', internalType: 'address'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'address'}],
    name: 'devaddr',
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
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'migrate',
    inputs: [{type: 'uint256', name: '_pid', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{type: 'address', name: '', internalType: 'contract IMigratorCom'}],
    name: 'migrator',
    inputs: [],
  },
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
    name: 'pendingCom',
    inputs: [
      {type: 'uint256', name: '_pid', internalType: 'uint256'},
      {type: 'address', name: '_user', internalType: 'address'},
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {type: 'address', name: 'lpToken', internalType: 'contract IARC20'},
      {type: 'uint256', name: 'allocPoint', internalType: 'uint256'},
      {type: 'uint256', name: 'lastRewardBlock', internalType: 'uint256'},
      {type: 'uint256', name: 'accComPerShare', internalType: 'uint256'},
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
    name: 'setComPerBlock',
    inputs: [{type: 'uint256', name: '_newPerBlock', internalType: 'uint256'}],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setMigrator',
    inputs: [{type: 'address', name: '_migrator', internalType: 'contract IMigratorCom'}],
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
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'updatePool',
    inputs: [{type: 'uint256', name: '_pid', internalType: 'uint256'}],
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

  const COM_CHEF_ADDR = '0xa329D806fbC80a14415588334ae4b205813C6BB2'
  const rewardTokenTicker = 'COM'
  const COM_CHEF = new ethers.Contract(COM_CHEF_ADDR, COM_CHEF_ABI, App.provider)

  const blocksPerSeconds = await getAverageBlockTime(App)

  const rewardsPerWeek = (((await COM_CHEF.comPerBlock()) / 1e18) * 604800) / blocksPerSeconds

  const tokens = {}
  const prices = await getAvaxPrices()

  await loadAvaxChefContract(
    App,
    tokens,
    prices,
    COM_CHEF,
    COM_CHEF_ADDR,
    COM_CHEF_ABI,
    rewardTokenTicker,
    'com',
    null,
    rewardsPerWeek,
    'pendingCom'
  )

  hideLoading()
}
