$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const MINT_FARMING_ABI = [
    {
      inputs: [
        {internalType: 'address', name: '_owner', type: 'address'},
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
      inputs: [
        {indexed: false, internalType: 'uint256', name: 'rewardsPerInterval', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'interval', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'rewardRate', type: 'uint256'},
      ],
      name: 'RewardRateUpdated',
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
      name: 'lastBalance',
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
      inputs: [
        {internalType: 'uint256', name: 'rewardsPerInterval', type: 'uint256'},
        {internalType: 'uint256', name: 'interval', type: 'uint256'},
      ],
      name: 'setRewardRate',
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
      inputs: [
        {internalType: 'address', name: 'account', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'transferMintTokens',
      outputs: [],
      stateMutability: 'nonpayable',
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

  const MINT_CONTRACT_ADDRESS = '0xEC9f78cDE5E37774208708c8b10EE6C1d8c7619e'

  const rewardTokenFunction = 'rewardsToken'

  const stakeTokenFunction = 'stakingToken'

  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...\n')

  var tokens = {}
  var prices = {}

  let p = await loadSynthetixPool(
    App,
    tokens,
    prices,
    MINT_FARMING_ABI,
    MINT_CONTRACT_ADDRESS,
    rewardTokenFunction,
    stakeTokenFunction
  )
  _print_bold(`Total staked: $${formatMoney(p.staked_tvl)}`)
  if (p.totalUserStaked > 0) {
    _print(
      `You are staking a total of $${formatMoney(p.totalUserStaked)} at an APR of ${(p.totalAPR * 100).toFixed(2)}%\n`
    )
  }

  hideLoading()
}
