$(function() {
  consoleInit()
  start(main)
})

async function loadPool(App, tokens, prices, stakingAbi, stakingAddress, rewardTokenFunction, stakeTokenFunction) {
  const STAKING_POOL = new ethers.Contract(stakingAddress, stakingAbi, App.provider)

  const stakeTokenAddress = await STAKING_POOL.callStatic[stakeTokenFunction]()

  const rewardTokenAddress = await STAKING_POOL.callStatic[rewardTokenFunction]()

  var stakeToken = await getToken(App, stakeTokenAddress, stakingAddress)

  if (stakeTokenAddress.toLowerCase() === rewardTokenAddress.toLowerCase()) {
    stakeToken.staked = (await STAKING_POOL.totalSupply()) / 10 ** stakeToken.decimals
  }

  var newPriceAddresses = stakeToken.tokens.filter(x => !getParameterCaseInsensitive(prices, x))
  var newPrices = await lookUpTokenPrices(newPriceAddresses)
  for (const key in newPrices) {
    if (newPrices[key]) prices[key] = newPrices[key]
  }

  var newTokenAddresses = stakeToken.tokens.filter(x => !getParameterCaseInsensitive(tokens, x))
  for (const address of newTokenAddresses) {
    tokens[address] = await getToken(App, address, stakingAddress)
  }
  if (!getParameterCaseInsensitive(tokens, rewardTokenAddress)) {
    tokens[rewardTokenAddress] = await getToken(App, rewardTokenAddress, stakingAddress)
  }
  const rewardToken = getParameterCaseInsensitive(tokens, rewardTokenAddress)

  const rewardTokenTicker = rewardToken.symbol

  const poolPrices = getPoolPrices(tokens, prices, stakeToken)

  const stakingTokenTicker = poolPrices.stakingTokenTicker

  const stakeTokenPrice = prices[stakeTokenAddress]?.usd ?? getParameterCaseInsensitive(prices, stakeTokenAddress)?.usd
  const rewardTokenPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd

  // Find out reward rate
  const weeklyRewards = await get_synth_weekly_rewards(STAKING_POOL)

  const usdPerWeek = weeklyRewards * rewardTokenPrice

  const staked_tvl = poolPrices.staked_tvl

  const userStaked = (await STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 10 ** stakeToken.decimals

  const userUnstaked = stakeToken.unstaked

  const earned = (await STAKING_POOL.earned(App.YOUR_ADDRESS)) / 10 ** rewardToken.decimals

  poolPrices.print_price()
  _print(`${rewardTokenTicker} Per Week: ${weeklyRewards.toFixed(2)} ($${formatMoney(usdPerWeek)})`)
  const weeklyAPR = (usdPerWeek / staked_tvl) * 100
  const dailyAPR = weeklyAPR / 7
  const yearlyAPR = weeklyAPR * 52
  _print(`APR: Day ${dailyAPR.toFixed(2)}% Week ${weeklyAPR.toFixed(2)}% Year ${yearlyAPR.toFixed(2)}%`)
  const userStakedUsd = userStaked * stakeTokenPrice
  const userStakedPct = (userStakedUsd / staked_tvl) * 100
  _print(
    `You are staking ${userStaked.toFixed(10)} ${stakingTokenTicker} ` +
      `$${formatMoney(userStakedUsd)} (${userStakedPct.toFixed(2)}% of the pool).`
  )
  if (userStaked > 0) {
    const userWeeklyRewards = (userStakedPct * weeklyRewards) / 100
    const userDailyRewards = userWeeklyRewards / 7
    const userYearlyRewards = userDailyRewards * 365
    _print(
      `Estimated ${rewardTokenTicker} earnings:` +
        ` Day ${userDailyRewards.toFixed(2)} ($${formatMoney(userDailyRewards * rewardTokenPrice)})` +
        ` Week ${userWeeklyRewards.toFixed(2)} ($${formatMoney(userWeeklyRewards * rewardTokenPrice)})` +
        ` Year ${userYearlyRewards.toFixed(2)} ($${formatMoney(userYearlyRewards * rewardTokenPrice)})`
    )
  }
  const approveTENDAndStake = async function() {
    return rewardsContract_stake(stakeTokenAddress, stakingAddress, App)
  }
  const unstake = async function() {
    return rewardsContract_unstake(stakingAddress, App)
  }
  const claim = async function() {
    return rewardsContract_claim(stakingAddress, App)
  }
  const exit = async function() {
    return rewardsContract_exit(stakingAddress, App)
  }
  const revoke = async function() {
    return rewardsContract_resetApprove(stakeTokenAddress, stakingAddress, App)
  }
  _print_link(`Stake ${userUnstaked.toFixed(10)} ${stakingTokenTicker}`, approveTENDAndStake)
  _print_link(`Unstake ${userStaked.toFixed(10)} ${stakingTokenTicker}`, unstake)
  _print_link(`Claim ${earned.toFixed(10)} ${rewardTokenTicker}`, claim)
  _print_link(`Revoke (set approval to 0)`, revoke)
  _print_link(`Exit`, exit)
  _print(`\n`)

  return {
    staked_tvl: poolPrices.staked_tvl,
  }
}

async function loadBoardroom(App, tokens, prices) {
  const BOARDROOM_ADDRESS = '0x0fd00d909e72840f48663f03cb2f104c1c0dd05d'
  const BOARDROOM = new ethers.Contract(BOARDROOM_ADDRESS, BOARDROOM_ABI, App.provider)
  const share = await BOARDROOM.share()
  const SHARE = new ethers.Contract(share, ERC20_ABI, App.provider)
  const userUnstaked = (await SHARE.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const sharePrice = getParameterCaseInsensitive(prices, share)?.usd
  const userStaked = (await BOARDROOM.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const userStakedUsd = userStaked * sharePrice
  const totalStaked = (await BOARDROOM.totalSupply()) / 1e18
  const totalStakedUsd = totalStaked * sharePrice
  const userPct = (userStaked / totalStaked) * 100
  const earned = (await BOARDROOM.earned(App.YOUR_ADDRESS)) / 1e18
  _print(`Boardroom`)
  _print(`There is a total ${totalStaked.toFixed(2)} RBS ($${formatMoney(totalStakedUsd)}) staked in the Boardroom.`)
  _print(`You are staking ${userStaked} RBS ($${formatMoney(userStakedUsd)}), ${userPct.toFixed(2)}% of the pool.`)

  const approveTENDAndStake = async () => rewardsContract_stake(share, BOARDROOM_ADDRESS, App)
  const unstake = async () => rewardsContract_unstake(BOARDROOM_ADDRESS, App)
  const claim = async () => rewardsContract_claim(BOARDROOM_ADDRESS, App)
  const exit = async () => rewardsContract_exit(BOARDROOM_ADDRESS, App)
  const revoke = async () => rewardsContract_resetApprove(share, BOARDROOM_ADDRESS, App)

  _print_link(`Stake ${userUnstaked.toFixed(2)} RBS`, approveTENDAndStake)
  _print_link(`Unstake ${userStaked.toFixed(2)} RBS`, unstake)
  _print_link(`Claim ${earned.toFixed(10)} RBTC`, claim)
  _print_link(`Revoke (set approval to 0)`, revoke)
  _print_link(`Exit`, exit)
  _print(`\n`)
}

async function main() {
  const REBITCOIN_WBTCRBTC_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisShare_', type: 'address'},
        {internalType: 'address', name: 'lptoken_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisShare',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'initreward',
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
      inputs: [],
      name: 'lpt',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
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
      inputs: [],
      name: 'periodFinish',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const REBITCOIN_WBTCRBS_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisShare_', type: 'address'},
        {internalType: 'address', name: 'lptoken_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisShare',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
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
      inputs: [],
      name: 'lpt',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
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
      inputs: [],
      name: 'periodFinish',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  const REBITCOIN_WBTC_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisCash_', type: 'address'},
        {internalType: 'address', name: 'wbtc_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisCash',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'deposits',
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
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'wbtc',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const REBITCOIN_DAI_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisCash_', type: 'address'},
        {internalType: 'address', name: 'dai_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisCash',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'dai',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'deposits',
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
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const REBITCOIN_USDT_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisCash_', type: 'address'},
        {internalType: 'address', name: 'usdt_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisCash',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'deposits',
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
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'usdt',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const REBITCOIN_USDC_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisCash_', type: 'address'},
        {internalType: 'address', name: 'usdc_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisCash',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'deposits',
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
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'usdc',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const REBITCOIN_UNI_ABI = [
    {
      inputs: [
        {internalType: 'address', name: 'basisCash_', type: 'address'},
        {internalType: 'address', name: 'uni_', type: 'address'},
        {internalType: 'uint256', name: 'starttime_', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      inputs: [],
      name: 'DURATION',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'account', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'basisCash',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'deposits',
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
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [],
      name: 'rewardDistribution',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
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
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'rewards',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_rewardDistribution', type: 'address'}],
      name: 'setRewardDistribution',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'starttime',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'uni',
      outputs: [{internalType: 'contractIERC20', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '', type: 'address'}],
      name: 'userRewardPerTokenPaid',
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
      name: 'rewardPerToken',
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
    {
      inputs: [{internalType: 'uint256', name: 'amount', type: 'uint256'}],
      name: 'stake',
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
    {inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      name: 'notifyRewardAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  const CONTRACTS = [
    {
      address: '0x79758a515aabb6051039375b3192f7efea8341b4',
      abi: REBITCOIN_WBTCRBS_ABI,
      rewardToken: 'basisShare',
      stakeToken: 'lpt',
    },
    {
      address: '0x807d33b4da47ca514c2816625398f4bf59e9534c',
      abi: REBITCOIN_WBTCRBTC_ABI,
      rewardToken: 'basisShare',
      stakeToken: 'lpt',
    },
    {
      address: '0x111618e39d9a915d39101cca57302de88816c718',
      abi: REBITCOIN_WBTC_ABI,
      rewardToken: 'basisCash',
      stakeToken: 'wbtc',
    },
    {
      address: '0xcf6ef934341515b88d7e9012786042c7c5f5953c',
      abi: REBITCOIN_DAI_ABI,
      rewardToken: 'basisCash',
      stakeToken: 'dai',
    },
    {
      address: '0x8de24a847afc896f77dcc6829730cfc63c859052',
      abi: REBITCOIN_USDC_ABI,
      rewardToken: 'basisCash',
      stakeToken: 'usdc',
    },
    {
      address: '0x5055d827777047fd8c91c19113bcc0eb4edc477f',
      abi: REBITCOIN_USDT_ABI,
      rewardToken: 'basisCash',
      stakeToken: 'usdt',
    },
    {
      address: '0x5a13450279ef9250fec892190611ff63a75d0127',
      abi: REBITCOIN_UNI_ABI,
      rewardToken: 'basisCash',
      stakeToken: 'uni',
    },
  ]

  const App = await init_ethers()
  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...\n')

  var tokens = {}
  var prices = {}
  var totalStaked = 0

  for (const c of CONTRACTS) {
    try {
      const {staked_tvl} = await loadPool(App, tokens, prices, c.abi, c.address, c.rewardToken, c.stakeToken)
      totalStaked += staked_tvl
    } catch (ex) {
      console.error(ex)
    }
  }
  await loadBoardroom(App, tokens, prices)

  _print_bold(`Total staked: $${formatMoney(totalStaked)}`)

  hideLoading()
}
