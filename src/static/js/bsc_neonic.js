$(function() {
  consoleInit()
  start(main)
})

const NEONIC_CHEF_ABI = [
  {
    inputs: [
      {internalType: 'contract NeonToken', name: '_neon', type: 'address'},
      {internalType: 'address', name: '_devAddr', type: 'address'},
      {internalType: 'address', name: '_holdersAddress', type: 'address'},
      {internalType: 'address', name: '_feeAddress', type: 'address'},
      {internalType: 'uint256', name: '_neonPerBlock', type: 'uint256'},
      {internalType: 'uint256', name: '_startBlock', type: 'uint256'},
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
    name: 'NEON_PER_BLOCK_MAX',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NEON_PER_BLOCK_MIN',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
      {internalType: 'contract IERC20', name: '_lpToken', type: 'address'},
      {internalType: 'uint16', name: '_depositFeeBP', type: 'uint16'},
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'contract IERC20', name: '_lpToken', type: 'address'}],
    name: 'checkPoolDuplicate',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decreaseEmissionRateAutomatically',
    outputs: [{internalType: 'bool', name: '', type: 'bool'}],
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
    inputs: [{internalType: 'address', name: '_devAddr', type: 'address'}],
    name: 'dev',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devAddr',
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
  {
    inputs: [{internalType: 'address', name: '_holdersAddress', type: 'address'}],
    name: 'holders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'holdersAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastUpdateEmissionRate',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'massUpdatePools', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [],
    name: 'neon',
    outputs: [{internalType: 'contract NeonToken', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'neonPerBlock',
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
    inputs: [
      {internalType: 'uint256', name: '_pid', type: 'uint256'},
      {internalType: 'address', name: '_user', type: 'address'},
    ],
    name: 'pendingNeon',
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
      {internalType: 'uint256', name: 'accNeonPerShare', type: 'uint256'},
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
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [
      {internalType: 'uint256', name: '_pid', type: 'uint256'},
      {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
      {internalType: 'uint16', name: '_depositFeeBP', type: 'uint16'},
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
    inputs: [{internalType: 'bool', name: '_decreaseEmissionRateAutomatically', type: 'bool'}],
    name: 'setUpdateDecreaseEmissionRateAutomatically',
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
    inputs: [{internalType: 'uint256', name: '_neonPerBlock', type: 'uint256'}],
    name: 'updateEmissionRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {inputs: [], name: 'updateEmissionRateIfNeccessary', outputs: [], stateMutability: 'nonpayable', type: 'function'},
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
      {internalType: 'uint256', name: 'lastDeposit', type: 'uint256'},
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

  const NEONIC_CHEF_ADDR = '0x045502ee488806bdf22928b6228bdd162b5056f6'
  const rewardTokenTicker = 'NEON'
  const NEONIC_CHEF = new ethers.Contract(NEONIC_CHEF_ADDR, NEONIC_CHEF_ABI, App.provider)

  const rewardsPerWeek = (((await NEONIC_CHEF.neonPerBlock()) / 1e18) * 604800) / 3

  const tokens = {}
  const prices = await getBscPrices()

  await loadBscChefContract(
    App,
    tokens,
    prices,
    NEONIC_CHEF,
    NEONIC_CHEF_ADDR,
    NEONIC_CHEF_ABI,
    rewardTokenTicker,
    'neon',
    null,
    rewardsPerWeek,
    'pendingNeon'
  )

  hideLoading()
}
