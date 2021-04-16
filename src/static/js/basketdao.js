$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const BASK_CHEF_ADDR = '0xDB9daa0a50B33e4fe9d0ac16a1Df1d335F96595e'
  const BASK_CHEF_ABI = [
    {
      inputs: [
        {internalType: 'contract ERC20', name: '_basket', type: 'address'},
        {internalType: 'address', name: '_timelock', type: 'address'},
        {internalType: 'address', name: '_devaddr', type: 'address'},
        {internalType: 'address', name: '_treasuryaddr', type: 'address'},
        {internalType: 'uint256', name: '_basketPerBlock', type: 'uint256'},
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
      name: 'basket',
      outputs: [{internalType: 'contract ERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basketPerBlock',
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
      inputs: [],
      name: 'devFundRate',
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
      inputs: [],
      name: 'divRate',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      stateMutability: 'pure',
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
      outputs: [{internalType: 'contract IMigrator', name: '', type: 'address'}],
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
      name: 'pendingBasket',
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
        {internalType: 'uint256', name: 'accBasketPerShare', type: 'uint256'},
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
      inputs: [{internalType: 'uint256', name: '_basketPerBlock', type: 'uint256'}],
      name: 'setBasketPerBlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_devaddr', type: 'address'}],
      name: 'setDev',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'contract IMigrator', name: '_migrator', type: 'address'}],
      name: 'setMigrator',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_startBlock', type: 'uint256'}],
      name: 'setStartBlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_treasury', type: 'address'}],
      name: 'setTreasury',
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
      inputs: [],
      name: 'treasuryRate',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'treasuryaddr',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
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
  const BASK_CHEF = new ethers.Contract(BASK_CHEF_ADDR, BASK_CHEF_ABI, App.provider)
  const rewardsPerWeek = ((((await BASK_CHEF.basketPerBlock()) / 1e18) * 604800) / 13.5) * 0.6 //60% of rewards go to stakers

  await loadChefContract(
    App,
    BASK_CHEF,
    BASK_CHEF_ADDR,
    BASK_CHEF_ABI,
    'BASK',
    'basket',
    null,
    rewardsPerWeek,
    'pendingBasket',
    null,
    [1, 2]
  )

  hideLoading()
}
