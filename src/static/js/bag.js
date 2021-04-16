$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const BAG_CHEF_ADDR = '0xd7fa57069E4767ddE13aD7970A562c43f03f8365'
  const BAG_CHEF_ABI = [
    {
      inputs: [
        {internalType: 'contract IBagBang', name: '_bagBang', type: 'address'},
        {internalType: 'contract IERC20', name: '_rewardToken', type: 'address'},
        {internalType: 'address', name: '_feeAddress', type: 'address'},
        {internalType: 'uint256', name: '_feeEndBlock', type: 'uint256'},
        {internalType: 'uint256', name: '_rewardStartBlock', type: 'uint256'},
        {internalType: 'uint256', name: '_rewardNumBlocks', type: 'uint256'},
        {internalType: 'uint256', name: '_totalRewards', type: 'uint256'},
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
        {indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Harvest',
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
        {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
        {internalType: 'address', name: '_stakingToken', type: 'address'},
        {internalType: 'uint16', name: '_earlyWithdrawalFeeBP', type: 'uint16'},
        {internalType: 'bool', name: '_withUpdate', type: 'bool'},
      ],
      name: 'addPool',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'bagBang',
      outputs: [{internalType: 'contract IBagBang', name: '', type: 'address'}],
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
      inputs: [],
      name: 'feeEndBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
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
      inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
      name: 'harvest',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: '_stakingToken', type: 'address'}],
      name: 'isDuplicatedPool',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
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
      name: 'pendingReward',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      name: 'poolInfo',
      outputs: [
        {internalType: 'address', name: 'stakingToken', type: 'address'},
        {internalType: 'uint256', name: 'allocPoint', type: 'uint256'},
        {internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256'},
        {internalType: 'uint256', name: 'accRewardPerShare', type: 'uint256'},
        {internalType: 'uint16', name: 'earlyWithdrawalFeeBP', type: 'uint16'},
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
      name: 'rewardEndBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rewardNumBlocks',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rewardPerBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rewardStartBlock',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rewardToken',
      outputs: [{internalType: 'contract IERC20', name: '', type: 'address'}],
      stateMutability: 'view',
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
      inputs: [
        {internalType: 'uint256', name: '_pid', type: 'uint256'},
        {internalType: 'uint256', name: '_allocPoint', type: 'uint256'},
        {internalType: 'uint16', name: '_earlyWithdrawalFeeBP', type: 'uint16'},
      ],
      name: 'setPool',
      outputs: [],
      stateMutability: 'nonpayable',
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
    {
      inputs: [{internalType: 'uint256', name: '_pid', type: 'uint256'}],
      name: 'withdrawAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const BAG_CHEF = new ethers.Contract(BAG_CHEF_ADDR, BAG_CHEF_ABI, App.provider)
  let rewardsPerWeek = (((await BAG_CHEF.rewardPerBlock()) / 1e18) * 604800) / 13.5
  const startBlock = 12213000,
    endBlock = 12293639
  const currentBlock = await App.provider.getBlockNumber()
  if (currentBlock < startBlock || currentBlock > endBlock) {
    rewardsPerWeek = 0
  }
  _print(`Rewards start at block ${startBlock} and end at block ${endBlock}\n`)
  await loadChefContract(
    App,
    BAG_CHEF,
    BAG_CHEF_ADDR,
    BAG_CHEF_ABI,
    'BAG',
    'rewardToken',
    null,
    rewardsPerWeek,
    'pendingReward'
  )

  hideLoading()
}
