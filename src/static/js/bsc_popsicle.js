$(function() {
  consoleInit()
  start(main)
})

const BSC_ICE_CHEF_ABI = [
  {
    inputs: [
      {internalType: 'contract IERC20', name: '_ice', type: 'address'},
      {internalType: 'uint256', name: '_icePerSecond', type: 'uint256'},
      {internalType: 'uint32', name: '_startTime', type: 'uint32'},
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
    inputs: [
      {internalType: 'uint16', name: '_allocPoint', type: 'uint16'},
      {internalType: 'contract IERC20', name: '_stakingToken', type: 'address'},
      {internalType: 'bool', name: '_withUpdate', type: 'bool'},
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint32', name: 'addSeconds', type: 'uint32'}],
    name: 'changeEndTime',
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
    inputs: [],
    name: 'endTime',
    outputs: [{internalType: 'uint32', name: '', type: 'uint32'}],
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ice',
    outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'icePerSecond',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
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
    name: 'pendingIce',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'poolInfo',
    outputs: [
      {internalType: 'contract IERC20', name: 'stakingToken', type: 'address'},
      {internalType: 'uint256', name: 'stakingTokenTotalAmount', type: 'uint256'},
      {internalType: 'uint256', name: 'accIcePerShare', type: 'uint256'},
      {internalType: 'uint32', name: 'lastRewardTime', type: 'uint32'},
      {internalType: 'uint16', name: 'allocPoint', type: 'uint16'},
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
      {internalType: 'uint16', name: '_allocPoint', type: 'uint16'},
      {internalType: 'bool', name: '_withUpdate', type: 'bool'},
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_icePerSecond', type: 'uint256'},
      {internalType: 'bool', name: '_withUpdate', type: 'bool'},
    ],
    name: 'setIcePerSecond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
    outputs: [{internalType: 'uint32', name: '', type: 'uint32'}],
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
      {internalType: 'uint256', name: 'remainingIceTokenReward', type: 'uint256'},
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

  const BSC_ICE_CHEF_ADDR0 = '0x05200cB2Cee4B6144B2B2984E246B52bB1afcBD0'
  const BSC_ICE_CHEF_ADDR1 = '0x2ccE22c7A4A9f66ee589464D883e85D91F35DD6b'
  const rewardTokenTicker = 'ICE'
  const BSC_ICE_CHEF0 = new ethers.Contract(BSC_ICE_CHEF_ADDR0, BSC_ICE_CHEF_ABI, App.provider)
  const BSC_ICE_CHEF1 = new ethers.Contract(BSC_ICE_CHEF_ADDR1, BSC_ICE_CHEF_ABI, App.provider)

  const rewardsPerWeek0 = ((await BSC_ICE_CHEF0.icePerSecond()) / 1e18) * 604800
  const rewardsPerWeek1 = ((await BSC_ICE_CHEF1.icePerSecond()) / 1e18) * 604800

  const tokens = {}
  const prices = await getBscPrices()

  let p0 = await loadBscPopsicleContract(
    App,
    tokens,
    prices,
    BSC_ICE_CHEF0,
    BSC_ICE_CHEF_ADDR0,
    BSC_ICE_CHEF_ABI,
    rewardTokenTicker,
    'ice',
    null,
    rewardsPerWeek0,
    'pendingIce'
  )
  let p1 = await loadBscPopsicleContract(
    App,
    tokens,
    prices,
    BSC_ICE_CHEF1,
    BSC_ICE_CHEF_ADDR1,
    BSC_ICE_CHEF_ABI,
    rewardTokenTicker,
    'ice',
    null,
    rewardsPerWeek1,
    'pendingIce'
  )

  _print_bold(`Total Staked: $${formatMoney(p0.totalStaked + p1.totalStaked)}`)
  if (p0.totalUserStaked > 0 || p1.totalUserStaked > 0) {
    _print_bold(
      `\nYou are staking a total of $${formatMoney(p0.totalUserStaked + p1.totalUserStaked)} at an average APR of ${(
        p0.averageApr +
        p1.averageApr * 100
      ).toFixed(2)}%`
    )
    _print(
      `Estimated earnings:` +
        ` Day $${formatMoney(
          (p0.totalUserStaked * p0.averageApr) / 365 + (p1.totalUserStaked * p1.averageApr) / 365
        )}` +
        ` Week $${formatMoney((p0.totalUserStaked * p0.averageApr) / 52 + (p1.totalUserStaked * p1.averageApr) / 52)}` +
        ` Year $${formatMoney(p0.totalUserStaked * p0.averageApr + p1.totalUserStaked * p1.averageApr)}\n`
    )
  }

  hideLoading()
}

async function loadBscPopsicleContract(
  App,
  tokens,
  prices,
  chef,
  chefAddress,
  chefAbi,
  rewardTokenTicker,
  rewardTokenFunction,
  rewardsPerBlockFunction,
  rewardsPerWeekFixed,
  pendingRewardsFunction,
  deathPoolIndices
) {
  const chefContract = chef ?? new ethers.Contract(chefAddress, chefAbi, App.provider)

  const poolCount = parseInt(await chefContract.poolLength(), 10)
  const totalAllocPoints = await chefContract.totalAllocPoint()

  var tokens = {}

  const rewardTokenAddress = await chefContract.callStatic[rewardTokenFunction]()
  const rewardToken = await getBscToken(App, rewardTokenAddress, chefAddress)
  const rewardsPerWeek =
    rewardsPerWeekFixed ??
    (((await chefContract.callStatic[rewardsPerBlockFunction]()) / 10 ** rewardToken.decimals) * 604800) / 3

  const poolInfos = await Promise.all(
    [...Array(poolCount).keys()].map(
      async x => await getBscPopsiclePoolInfo(App, chefContract, chefAddress, x, pendingRewardsFunction)
    )
  )

  var tokenAddresses = [].concat.apply(
    [],
    poolInfos.filter(x => x.poolToken).map(x => x.poolToken.tokens)
  )

  await Promise.all(
    tokenAddresses.map(async address => {
      tokens[address] = await getBscToken(App, address, chefAddress)
    })
  )

  if (deathPoolIndices) {
    //load prices for the deathpool assets
    deathPoolIndices
      .map(i => poolInfos[i])
      .map(poolInfo => (poolInfo.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken, 'bsc') : undefined))
  }

  const poolPrices = poolInfos.map(poolInfo =>
    poolInfo.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken, 'bsc') : undefined
  )

  let aprs = []
  for (i = 0; i < poolCount; i++) {
    if (poolPrices[i]) {
      const apr = printChefPool(
        App,
        chefAbi,
        chefAddress,
        prices,
        tokens,
        poolInfos[i],
        i,
        poolPrices[i],
        totalAllocPoints,
        rewardsPerWeek,
        rewardTokenTicker,
        rewardTokenAddress,
        pendingRewardsFunction,
        null,
        null,
        'bsc'
      )
      aprs.push(apr)
    }
  }
  let totalUserStaked = 0,
    totalStaked = 0,
    averageApr = 0
  for (const a of aprs) {
    if (!isNaN(a.totalStakedUsd)) {
      totalStaked += a.totalStakedUsd
    }
    if (a.userStakedUsd > 0) {
      totalUserStaked += a.userStakedUsd
      averageApr += (a.userStakedUsd * a.yearlyAPR) / 100
    }
  }
  averageApr = averageApr / totalUserStaked
  return {prices, totalUserStaked, totalStaked, averageApr}
}

async function getBscPopsiclePoolInfo(App, chefContract, chefAddress, poolIndex, pendingRewardsFunction) {
  const poolInfo = await chefContract.poolInfo(poolIndex)
  if (poolInfo.allocPoint == 0 || poolIndex == 105) {
    return {
      address: poolInfo.stakingToken,
      allocPoints: poolInfo.allocPoint ?? 1,
      poolToken: null,
      userStaked: 0,
      pendingRewardTokens: 0,
      stakedToken: null,
      userLPStaked: 0,
      lastRewardBlock: poolInfo.lastRewardBlock,
    }
  }
  const poolToken = await getBscToken(App, poolInfo.stakingToken, chefAddress)
  const userInfo = await chefContract.userInfo(poolIndex, App.YOUR_ADDRESS)
  const pendingRewardTokens = await chefContract.callStatic[pendingRewardsFunction](poolIndex, App.YOUR_ADDRESS)
  const staked = userInfo.amount / 10 ** poolToken.decimals
  return {
    address: poolInfo.stakingToken,
    allocPoints: poolInfo.allocPoint ?? 1,
    poolToken: poolToken,
    userStaked: staked,
    pendingRewardTokens: pendingRewardTokens / 10 ** 18,
  }
}
