$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const NAWA_CHEF_ABI = [
    {
      inputs: [
        {internalType: 'contract NarwhaleToken', name: '_narwhale', type: 'address'},
        {internalType: 'address', name: '_devaddr', type: 'address'},
        {internalType: 'uint256', name: '_narwhalePerBlock', type: 'uint256'},
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
        {indexed: true, internalType: 'address', name: 'user', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'previousNarwhalePerBlock', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'newNarwhalePerBlock', type: 'uint256'},
      ],
      name: 'EmissionChange',
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
        {indexed: false, internalType: 'address', name: 'token', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Recovered',
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
      name: 'devFundDivRate',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
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
      inputs: [],
      name: 'narwhale',
      outputs: [{internalType: 'contract NarwhaleToken', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'narwhalePerBlock',
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
      name: 'pendingNarwhale',
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
        {internalType: 'uint256', name: 'accNarwhalePerShare', type: 'uint256'},
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
      inputs: [{internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256'}],
      name: 'setBonusEndBlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_devFundDivRate', type: 'uint256'}],
      name: 'setDevFundDivRate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_narwhalePerBlock', type: 'uint256'}],
      name: 'setNarwhalePerBlock',
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
  const NAWA_CHEF_ADDR = '0xbF528830d505FA8C6Ee2A3C0De92797D278C5478'
  const rewardTokenTicker = 'NAWA'
  const NAWA_CHEF = new ethers.Contract(NAWA_CHEF_ADDR, NAWA_CHEF_ABI, App.provider)
  const rewardsPerWeek = ((((await NAWA_CHEF.narwhalePerBlock()) / 1e18) * 604800) / 13.5) * 10

  await loadChefContract(
    App,
    NAWA_CHEF,
    NAWA_CHEF_ADDR,
    NAWA_CHEF_ABI,
    rewardTokenTicker,
    'narwhale',
    null,
    rewardsPerWeek,
    'pendingNarwhale'
  )

  hideLoading()
}
