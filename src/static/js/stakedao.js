$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const SDT_CHEF_ABI = [
    {
      inputs: [
        {internalType: 'contract StakeDaoToken', name: '_sdt', type: 'address'},
        {internalType: 'address', name: '_devaddr', type: 'address'},
        {internalType: 'uint256', name: '_sdtPerBlock', type: 'uint256'},
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
      name: 'pendingSdt',
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
        {internalType: 'uint256', name: 'accSdtPerShare', type: 'uint256'},
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
      inputs: [],
      name: 'sdt',
      outputs: [{internalType: 'contract StakeDaoToken', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'sdtPerBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
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
      inputs: [{internalType: 'uint256', name: '_sdtPerBlock', type: 'uint256'}],
      name: 'setSdtPerBlock',
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
  const xSDT_STAKING_ABI = [
    {
      inputs: [{internalType: 'contract IERC20', name: '_sdt', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
        {indexed: true, internalType: 'address', name: 'spender', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
      ],
      name: 'Approval',
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
      inputs: [{indexed: true, internalType: 'address', name: 'newRewardDistributor', type: 'address'}],
      name: 'RewardDistributorSet',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'from', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'sdtAmount', type: 'uint256'},
      ],
      name: 'SdtFeeReceived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'staker', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'xsdtReceived', type: 'uint256'},
      ],
      name: 'Stake',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'from', type: 'address'},
        {indexed: true, internalType: 'address', name: 'to', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'value', type: 'uint256'},
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'unstaker', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'sdtReceived', type: 'uint256'},
      ],
      name: 'Unstake',
      type: 'event',
    },
    {
      inputs: [
        {internalType: 'address', name: 'owner', type: 'address'},
        {internalType: 'address', name: 'spender', type: 'address'},
      ],
      name: 'allowance',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'spender', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'approve',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'nonpayable',
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
      name: 'decimals',
      outputs: [{internalType: 'uint8', name: '', type: 'uint8'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'spender', type: 'address'},
        {internalType: 'uint256', name: 'subtractedValue', type: 'uint256'},
      ],
      name: 'decreaseAllowance',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
      name: 'enter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'spender', type: 'address'},
        {internalType: 'uint256', name: 'addedValue', type: 'uint256'},
      ],
      name: 'increaseAllowance',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_share', type: 'uint256'}],
      name: 'leave',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{internalType: 'string', name: '', type: 'string'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_balance', type: 'uint256'}],
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
      name: 'sdt',
      outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
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
      name: 'symbol',
      outputs: [{internalType: 'string', name: '', type: 'string'}],
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
        {internalType: 'address', name: 'recipient', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'transfer',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'sender', type: 'address'},
        {internalType: 'address', name: 'recipient', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'transferFrom',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const SDT_CHEF_ADDR = '0xfEA5E213bbD81A8a94D0E1eDB09dBD7CEab61e1c'
  const xSDT_CHEF_ADDR = '0xaC14864ce5A98aF3248Ffbf549441b04421247D3'
  const rewardTokenTicker = 'SDT'
  const SDT_CHEF = new ethers.Contract(SDT_CHEF_ADDR, SDT_CHEF_ABI, App.provider)
  const xSDT_CHEF = new ethers.Contract(xSDT_CHEF_ADDR, xSDT_STAKING_ABI, App.provider)
  const rewardsPerWeek = (((await SDT_CHEF.sdtPerBlock()) / 1e18) * 604800) / 13.5 //2x bonus

  //using the CRV price for sdve-CRV
  const extraPrices = await lookUpTokenPrices(['0xd533a949740bb3306d119cc777fa900ba034cd52'])
  extraPrices['0x478bBC744811eE8310B461514BDc29D03739084D'] = extraPrices['0xd533a949740bb3306d119cc777fa900ba034cd52']
  await loadChefContract(
    App,
    SDT_CHEF,
    SDT_CHEF_ADDR,
    SDT_CHEF_ABI,
    rewardTokenTicker,
    'sdt',
    null,
    rewardsPerWeek,
    'pendingSdt',
    extraPrices
  )

  await loadXSDTContract(App, xSDT_CHEF, xSDT_CHEF_ADDR, xSDT_STAKING_ABI, rewardTokenTicker, 'sdt')

  hideLoading()
}

async function loadXSDTContract(App, chef, chefAddress, chefAbi, rewardTokenTicker, rewardTokenFunction) {
  const chefContract = chef ?? new ethers.Contract(chefAddress, chefAbi, App.provider)

  _print(`\n`)

  var tokens = {}

  const rewardTokenAddress = await chefContract.callStatic[rewardTokenFunction]()

  const poolInfo = await getXSDTPoolInfo(App, chefContract, chefAddress, rewardTokenAddress)

  let prices = await lookUpTokenPrices([rewardTokenAddress])

  const poolPrices = poolInfo.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken) : undefined

  const userStakedUsd = poolInfo.userStaked * poolPrices.price

  const userStakedPct = (userStakedUsd / poolPrices.staked_tvl) * 100

  printXSDTPool(App, chefAbi, chefAddress, prices, tokens, poolInfo, poolPrices, rewardTokenTicker, rewardTokenAddress)
  _print(
    `You are staking ${poolInfo.userStaked.toFixed(2)} ${rewardTokenTicker} ($${formatMoney(
      userStakedUsd
    )}), ${userStakedPct.toFixed(2)}% of the pool.`
  )
}

async function getXSDTPoolInfo(app, chefContract, chefAddress, tokenAddress) {
  const poolToken = await getToken(app, tokenAddress, chefAddress)
  const balanceOf = await chefContract.balanceOf(app.YOUR_ADDRESS)
  const staked = balanceOf / 10 ** poolToken.decimals
  return {
    address: tokenAddress,
    poolToken: poolToken,
    userStaked: staked,
  }
}

function printXSDTPool(
  App,
  chefAbi,
  chefAddr,
  prices,
  tokens,
  poolInfo,
  poolPrices,
  rewardTokenTicker,
  rewardTokenAddress
) {
  const sp = poolInfo.stakedToken == null ? null : getPoolPrices(tokens, prices, poolInfo.stakedToken)
  const userStaked = poolInfo.userLPStaked ?? poolInfo.userStaked
  const rewardPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd
  const staked_tvl = sp?.staked_tvl ?? poolPrices.staked_tvl
  poolPrices.print_price()
  sp?.print_price()
}
