$(function() {
  consoleInit()
  start(main)
})

const RUNE_CHEF_ABI = [
  {
    inputs: [
      {internalType: 'contract TirRune', name: '_rune', type: 'address'},
      {internalType: 'address', name: '_devAddress', type: 'address'},
      {internalType: 'address', name: '_vaultAddress', type: 'address'},
      {internalType: 'address', name: '_charityAddress', type: 'address'},
      {internalType: 'address', name: '_voidAddress', type: 'address'},
      {internalType: 'uint256', name: '_runePerBlock', type: 'uint256'},
      {internalType: 'uint256', name: '_startBlock', type: 'uint256'},
      {internalType: 'contract IBEP20', name: '_withdrawFeeToken', type: 'address'},
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
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
    ],
    name: 'WithdrawFee',
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
    inputs: [],
    name: 'charityAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'charityDepositPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'charityMintPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devDepositPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devMintPercent',
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
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'poolInfo',
    outputs: [
      {internalType: 'contract IBEP20', name: 'lpToken', type: 'address'},
      {internalType: 'uint256', name: 'allocPoint', type: 'uint256'},
      {internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256'},
      {internalType: 'uint256', name: 'accRunePerShare', type: 'uint256'},
      {internalType: 'uint16', name: 'depositFeeBP', type: 'uint16'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [],
    name: 'rune',
    outputs: [{internalType: 'contract TirRune', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'runePerBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
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
    inputs: [],
    name: 'vaultAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultDepositPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultMintPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultWithdrawPercent',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voidAddress',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    inputs: [
      {internalType: 'uint256', name: '_from', type: 'uint256'},
      {internalType: 'uint256', name: '_to', type: 'uint256'},
    ],
    name: 'getMultiplier',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_pid', type: 'uint256'},
      {internalType: 'address', name: '_user', type: 'address'},
    ],
    name: 'pendingRune',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {inputs: [], name: 'massUpdatePools', outputs: [], stateMutability: 'nonpayable', type: 'function'},
  {
    inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
    name: 'updatePool',
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
    inputs: [
      {internalType: 'uint256', name: '_pid', type: 'uint256'},
      {internalType: 'uint256', name: '_amount', type: 'uint256'},
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{internalType: 'uint256', name: '_runePerBlock', type: 'uint256'}],
    name: 'updateEmissionRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_vaultWithdrawPercent', type: 'uint256'}],
    name: 'setWithdrawFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: '_vaultAddress', type: 'address'},
      {internalType: 'address', name: '_charityAddress', type: 'address'},
      {internalType: 'address', name: '_devAddress', type: 'address'},
      {internalType: 'uint256', name: '_vaultMintPercent', type: 'uint256'},
      {internalType: 'uint256', name: '_charityMintPercent', type: 'uint256'},
      {internalType: 'uint256', name: '_devMintPercent', type: 'uint256'},
      {internalType: 'uint256', name: '_vaultDepositPercent', type: 'uint256'},
      {internalType: 'uint256', name: '_charityDepositPercent', type: 'uint256'},
      {internalType: 'uint256', name: '_devDepositPercent', type: 'uint256'},
    ],
    name: 'setInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: '_vaultAddress', type: 'address'},
      {internalType: 'address', name: '_charityAddress', type: 'address'},
      {internalType: 'address', name: '_devAddress', type: 'address'},
      {internalType: 'address', name: '_botAddress', type: 'address'},
      {internalType: 'uint256', name: '_vaultFee', type: 'uint256'},
      {internalType: 'uint256', name: '_charityFee', type: 'uint256'},
      {internalType: 'uint256', name: '_devFee', type: 'uint256'},
      {internalType: 'uint256', name: '_botFee', type: 'uint256'},
    ],
    name: 'rune_proxy_setFeeInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_account', type: 'address'}],
    name: 'rune_proxy_addExcluded',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_account', type: 'address'}],
    name: 'rune_proxy_removeExcluded',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_account', type: 'address'}],
    name: 'rune_proxy_addBot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_account', type: 'address'}],
    name: 'rune_proxy_removeBot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {inputs: [], name: 'throwRuneInTheVoid', outputs: [], stateMutability: 'nonpayable', type: 'function'},
]

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const RUNE_CHEF_ADDR = '0xfa0235fe0f2b684221a18a0220ca30170455790c'
  const rewardTokenTicker = 'TIR'
  const RUNE_CHEF = new ethers.Contract(RUNE_CHEF_ADDR, RUNE_CHEF_ABI, App.provider)

  const rewardsPerWeek = (((await RUNE_CHEF.runePerBlock()) / 1e18) * 604800) / 3

  const tokens = {}
  const prices = await getBscPrices()

  await loadBscChefContract(
    App,
    tokens,
    prices,
    RUNE_CHEF,
    RUNE_CHEF_ADDR,
    RUNE_CHEF_ABI,
    rewardTokenTicker,
    'rune',
    null,
    rewardsPerWeek,
    'pendingRune'
  )

  hideLoading()
}
