$(function() {
  consoleInit()
  start(main)
})

const PTS_CHEF_ABI = [
  {
    inputs: [
      {internalType: 'contract PtsToken', name: '_pts', type: 'address'},
      {internalType: 'uint256', name: '_startBlock', type: 'uint256'},
      {internalType: 'uint256', name: '_ptsPerBlock', type: 'uint256'},
      {internalType: 'address', name: '_feeTo', type: 'address'},
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
      {indexed: true, internalType: 'address', name: 'newAddress', type: 'address'},
    ],
    name: 'SetDevAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: true, internalType: 'address', name: 'newAddress', type: 'address'},
    ],
    name: 'SetFeeAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'goosePerBlock', type: 'uint256'},
    ],
    name: 'UpdateEmissionRate',
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
      {internalType: 'contract IBEP20', name: '_lpToken', type: 'address'},
      {internalType: 'uint16', name: '_depositFeeBP', type: 'uint16'},
      {internalType: 'bool', name: '_withUpdate', type: 'bool'},
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'feeAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_from', type: 'uint256'},
      {internalType: 'uint256', name: '_to', type: 'uint256'},
    ],
    name: 'getMultiplier',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'pure',
    type: 'function',
  },
  {inputs: [], name: 'massUpdatePools', outputs: [], stateMutability: 'nonpayable', type: 'function'},
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
    name: 'pendingPts',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IBEP20', name: '', type: 'address'}],
    name: 'poolExistence',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'poolInfo',
    outputs: [
      {internalType: 'contract IBEP20', name: 'lpToken', type: 'address'},
      {internalType: 'uint256', name: 'allocPoint', type: 'uint256'},
      {internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256'},
      {internalType: 'uint256', name: 'accPtsPerShare', type: 'uint256'},
      {internalType: 'uint16', name: 'depositFeeBP', type: 'uint16'},
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
  {
    inputs: [],
    name: 'pts',
    outputs: [{internalType: 'contract PtsToken', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ptsPerBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [
      {internalType: 'uint256', name: '_pid', type: 'uint256'},
      {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
      {internalType: 'uint16', name: '_depositFeeBP', type: 'uint16'},
      {internalType: 'bool', name: '_withUpdate', type: 'bool'},
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_feeAddress', type: 'address'}],
    name: 'setFeeAddress',
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
    inputs: [{internalType: 'uint256', name: '_ptsPerBlock', type: 'uint256'}],
    name: 'updateEmissionRate',
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

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const PTS_CHEF_ADDR = '0x37F3Db236388463751c994F7dddf79E3Dc1b987b'
  const rewardTokenTicker = 'PTS'
  const PTS_CHEF = new ethers.Contract(PTS_CHEF_ADDR, PTS_CHEF_ABI, App.provider)

  const rewardsPerWeek = (((await PTS_CHEF.ptsPerBlock()) / 1e18) * 604800) / 3

  const tokens = {}
  const prices = await getBscPrices()

  await loadBscChefContract(
    App,
    tokens,
    prices,
    PTS_CHEF,
    PTS_CHEF_ADDR,
    PTS_CHEF_ABI,
    rewardTokenTicker,
    'pts',
    null,
    rewardsPerWeek,
    'pendingPts'
  )

  hideLoading()
}
