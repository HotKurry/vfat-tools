$(function() {
  consoleInit()
  start(main)
})

async function main() {
  const App = await init_ethers()

  _print(`Initialized ${App.YOUR_ADDRESS}\n`)
  _print('Reading smart contracts...\n')

  const vUSDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  const vDAI = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const vUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  const vLPAddr = '0x0c2445bec45c443c58f44f8e0a5796960e052d63'

  const factoryABI = [
    {inputs: [], stateMutability: 'nonpayable', type: 'constructor'},
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
        {indexed: true, internalType: 'address', name: 'approved', type: 'address'},
        {indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'owner', type: 'address'},
        {indexed: true, internalType: 'address', name: 'operator', type: 'address'},
        {indexed: false, internalType: 'bool', name: 'approved', type: 'bool'},
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{indexed: false, internalType: 'address', name: 'instance', type: 'address'}],
      name: 'InstanceAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{indexed: false, internalType: 'address', name: 'instance', type: 'address'}],
      name: 'InstanceRemoved',
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
        {indexed: true, internalType: 'bytes32', name: 'name', type: 'bytes32'},
        {indexed: true, internalType: 'address', name: 'template', type: 'address'},
      ],
      name: 'TemplateActive',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'bytes32', name: 'name', type: 'bytes32'},
        {indexed: true, internalType: 'address', name: 'template', type: 'address'},
      ],
      name: 'TemplateAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, internalType: 'address', name: 'from', type: 'address'},
        {indexed: true, internalType: 'address', name: 'to', type: 'address'},
        {indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'activeTemplate',
      outputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'bytes32', name: 'name', type: 'bytes32'},
        {internalType: 'address', name: 'template', type: 'address'},
      ],
      name: 'addTemplate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'owner', type: 'address'}],
      name: 'balanceOf',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'baseURI',
      outputs: [{internalType: 'string', name: '', type: 'string'}],
      stateMutability: 'view',
      type: 'function',
    },
    /*{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"create","outputs":[{"internalType":"address","name":"vault","type":"address"}],"stateMutability":"nonpayable","type":"function"},
     */ {
      inputs: [],
      name: 'create',
      outputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'bytes32', name: 'salt', type: 'bytes32'}],
      name: 'create2',
      outputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'bytes', name: '', type: 'bytes'},
        {internalType: 'bytes32', name: 'salt', type: 'bytes32'},
      ],
      name: 'create2',
      outputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'bytes32', name: 'name', type: 'bytes32'}],
      name: 'createSelected',
      outputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'bytes32', name: 'name', type: 'bytes32'},
        {internalType: 'bytes32', name: 'salt', type: 'bytes32'},
      ],
      name: 'createSelected2',
      outputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'tokenId', type: 'uint256'}],
      name: 'getApproved',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTemplate',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'user', type: 'address'},
        {internalType: 'uint256', name: 'index', type: 'uint256'},
      ],
      name: 'getUserVault',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
      name: 'instanceAt',
      outputs: [{internalType: 'address', name: 'instance', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'instanceCount',
      outputs: [{internalType: 'uint256', name: 'count', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'owner', type: 'address'},
        {internalType: 'address', name: 'operator', type: 'address'},
      ],
      name: 'isApprovedForAll',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'instance', type: 'address'}],
      name: 'isInstance',
      outputs: [{internalType: 'bool', name: 'validity', type: 'bool'}],
      stateMutability: 'view',
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
      inputs: [],
      name: 'nameCount',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      name: 'names',
      outputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
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
      inputs: [{internalType: 'uint256', name: 'tokenId', type: 'uint256'}],
      name: 'ownerOf',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [
        {internalType: 'address', name: 'from', type: 'address'},
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'from', type: 'address'},
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
        {internalType: 'bytes', name: '_data', type: 'bytes'},
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'bytes32', name: 'name', type: 'bytes32'}],
      name: 'setActive',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'operator', type: 'address'},
        {internalType: 'bool', name: 'approved', type: 'bool'},
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'bytes4', name: 'interfaceId', type: 'bytes4'}],
      name: 'supportsInterface',
      outputs: [{internalType: 'bool', name: '', type: 'bool'}],
      stateMutability: 'view',
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
      inputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
      name: 'templates',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
      name: 'tokenByIndex',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'owner', type: 'address'},
        {internalType: 'uint256', name: 'index', type: 'uint256'},
      ],
      name: 'tokenOfOwnerByIndex',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'tokenId', type: 'uint256'}],
      name: 'tokenURI',
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
        {internalType: 'address', name: 'from', type: 'address'},
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'tokenId', type: 'uint256'},
      ],
      name: 'transferFrom',
      outputs: [],
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
    {
      inputs: [
        {internalType: 'address', name: '', type: 'address'},
        {internalType: 'uint256', name: '', type: 'uint256'},
      ],
      name: 'userIndex',
      outputs: [{internalType: 'address', name: '', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'user', type: 'address'}],
      name: 'vaultCount',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  const hypervisorABI = [
    {
      inputs: [
        {internalType: 'address', name: 'ownerAddress', type: 'address'},
        {internalType: 'address', name: 'rewardPoolFactory', type: 'address'},
        {internalType: 'address', name: 'powerSwitchFactory', type: 'address'},
        {internalType: 'address', name: 'stakingToken', type: 'address'},
        {internalType: 'address', name: 'rewardToken', type: 'address'},
        {
          components: [
            {internalType: 'uint256', name: 'floor', type: 'uint256'},
            {internalType: 'uint256', name: 'ceiling', type: 'uint256'},
            {internalType: 'uint256', name: 'time', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.RewardScaling',
          name: 'rewardScaling',
          type: 'tuple',
        },
        {internalType: 'uint256', name: '_stakeLimit', type: 'uint256'},
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [{indexed: false, internalType: 'address', name: 'token', type: 'address'}],
      name: 'BonusTokenRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'rewardPool', type: 'address'},
        {indexed: false, internalType: 'address', name: 'powerSwitch', type: 'address'},
      ],
      name: 'HypervisorCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
        {indexed: false, internalType: 'uint256', name: 'duration', type: 'uint256'},
      ],
      name: 'HypervisorFunded',
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
        {indexed: false, internalType: 'address', name: 'vault', type: 'address'},
        {indexed: false, internalType: 'address', name: 'recipient', type: 'address'},
        {indexed: false, internalType: 'address', name: 'token', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'RewardClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'vault', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Staked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'vault', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Unstaked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{indexed: false, internalType: 'address', name: 'factory', type: 'address'}],
      name: 'VaultFactoryRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{indexed: false, internalType: 'address', name: 'factory', type: 'address'}],
      name: 'VaultFactoryRemoved',
      type: 'event',
    },
    {
      inputs: [],
      name: 'BASE_SHARES_PER_WEI',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAX_REWARD_TOKENS',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAX_STAKES_PER_VAULT',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: 'unlockedRewards', type: 'uint256'},
        {internalType: 'uint256', name: 'stakeAmount', type: 'uint256'},
        {internalType: 'uint256', name: 'stakeDuration', type: 'uint256'},
        {internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'},
        {
          components: [
            {internalType: 'uint256', name: 'floor', type: 'uint256'},
            {internalType: 'uint256', name: 'ceiling', type: 'uint256'},
            {internalType: 'uint256', name: 'time', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.RewardScaling',
          name: 'rewardScaling',
          type: 'tuple',
        },
      ],
      name: 'calculateReward',
      outputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {internalType: 'uint256', name: 'amount', type: 'uint256'},
            {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.StakeData[]',
          name: 'stakes',
          type: 'tuple[]',
        },
        {internalType: 'uint256', name: 'unstakeAmount', type: 'uint256'},
        {internalType: 'uint256', name: 'unlockedRewards', type: 'uint256'},
        {internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'},
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
        {
          components: [
            {internalType: 'uint256', name: 'floor', type: 'uint256'},
            {internalType: 'uint256', name: 'ceiling', type: 'uint256'},
            {internalType: 'uint256', name: 'time', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.RewardScaling',
          name: 'rewardScaling',
          type: 'tuple',
        },
      ],
      name: 'calculateRewardFromStakes',
      outputs: [
        {
          components: [
            {internalType: 'uint256', name: 'lastStakeAmount', type: 'uint256'},
            {internalType: 'uint256', name: 'newStakesCount', type: 'uint256'},
            {internalType: 'uint256', name: 'reward', type: 'uint256'},
            {internalType: 'uint256', name: 'newTotalStakeUnits', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.RewardOutput',
          name: 'out',
          type: 'tuple',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'uint256', name: 'start', type: 'uint256'},
        {internalType: 'uint256', name: 'end', type: 'uint256'},
      ],
      name: 'calculateStakeUnits',
      outputs: [{internalType: 'uint256', name: 'stakeUnits', type: 'uint256'}],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {internalType: 'uint256', name: 'amount', type: 'uint256'},
            {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.StakeData[]',
          name: 'stakes',
          type: 'tuple[]',
        },
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
      ],
      name: 'calculateTotalStakeUnits',
      outputs: [{internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'}],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {internalType: 'uint256', name: 'duration', type: 'uint256'},
            {internalType: 'uint256', name: 'start', type: 'uint256'},
            {internalType: 'uint256', name: 'shares', type: 'uint256'},
          ],
          internalType: 'struct IHypervisor.RewardSchedule[]',
          name: 'rewardSchedules',
          type: 'tuple[]',
        },
        {internalType: 'uint256', name: 'rewardBalance', type: 'uint256'},
        {internalType: 'uint256', name: 'sharesOutstanding', type: 'uint256'},
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
      ],
      name: 'calculateUnlockedRewards',
      outputs: [{internalType: 'uint256', name: 'unlockedRewards', type: 'uint256'}],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'uint256', name: 'duration', type: 'uint256'},
      ],
      name: 'fund',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
      name: 'getBonusTokenAtIndex',
      outputs: [{internalType: 'address', name: 'bonusToken', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getBonusTokenSetLength',
      outputs: [{internalType: 'uint256', name: 'length', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'stakeAmount', type: 'uint256'},
      ],
      name: 'getCurrentStakeReward',
      outputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getCurrentTotalStakeUnits',
      outputs: [{internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getCurrentUnlockedRewards',
      outputs: [{internalType: 'uint256', name: 'unlockedRewards', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      name: 'getCurrentVaultReward',
      outputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      name: 'getCurrentVaultStakeUnits',
      outputs: [{internalType: 'uint256', name: 'stakeUnits', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'stakeAmount', type: 'uint256'},
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
      ],
      name: 'getFutureStakeReward',
      outputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'timestamp', type: 'uint256'}],
      name: 'getFutureTotalStakeUnits',
      outputs: [{internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'timestamp', type: 'uint256'}],
      name: 'getFutureUnlockedRewards',
      outputs: [{internalType: 'uint256', name: 'unlockedRewards', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
      ],
      name: 'getFutureVaultReward',
      outputs: [{internalType: 'uint256', name: 'reward', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
      ],
      name: 'getFutureVaultStakeUnits',
      outputs: [{internalType: 'uint256', name: 'stakeUnits', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getHypervisorData',
      outputs: [
        {
          components: [
            {internalType: 'address', name: 'stakingToken', type: 'address'},
            {internalType: 'address', name: 'rewardToken', type: 'address'},
            {internalType: 'address', name: 'rewardPool', type: 'address'},
            {
              components: [
                {internalType: 'uint256', name: 'floor', type: 'uint256'},
                {internalType: 'uint256', name: 'ceiling', type: 'uint256'},
                {internalType: 'uint256', name: 'time', type: 'uint256'},
              ],
              internalType: 'struct IHypervisor.RewardScaling',
              name: 'rewardScaling',
              type: 'tuple',
            },
            {internalType: 'uint256', name: 'rewardSharesOutstanding', type: 'uint256'},
            {internalType: 'uint256', name: 'totalStake', type: 'uint256'},
            {internalType: 'uint256', name: 'totalStakeUnits', type: 'uint256'},
            {internalType: 'uint256', name: 'lastUpdate', type: 'uint256'},
            {
              components: [
                {internalType: 'uint256', name: 'duration', type: 'uint256'},
                {internalType: 'uint256', name: 'start', type: 'uint256'},
                {internalType: 'uint256', name: 'shares', type: 'uint256'},
              ],
              internalType: 'struct IHypervisor.RewardSchedule[]',
              name: 'rewardSchedules',
              type: 'tuple[]',
            },
          ],
          internalType: 'struct IHypervisor.HypervisorData',
          name: 'hypervisor',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getPowerController',
      outputs: [{internalType: 'address', name: 'controller', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getPowerSwitch',
      outputs: [{internalType: 'address', name: 'powerSwitch', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'vault', type: 'address'}],
      name: 'getVaultData',
      outputs: [
        {
          components: [
            {internalType: 'uint256', name: 'totalStake', type: 'uint256'},
            {
              components: [
                {internalType: 'uint256', name: 'amount', type: 'uint256'},
                {internalType: 'uint256', name: 'timestamp', type: 'uint256'},
              ],
              internalType: 'struct IHypervisor.StakeData[]',
              name: 'stakes',
              type: 'tuple[]',
            },
          ],
          internalType: 'struct IHypervisor.VaultData',
          name: 'vaultData',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
      name: 'getVaultFactoryAtIndex',
      outputs: [{internalType: 'address', name: 'factory', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getVaultFactorySetLength',
      outputs: [{internalType: 'uint256', name: 'length', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isOffline',
      outputs: [{internalType: 'bool', name: 'status', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isOnline',
      outputs: [{internalType: 'bool', name: 'status', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isShutdown',
      outputs: [{internalType: 'bool', name: 'status', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'target', type: 'address'}],
      name: 'isValidAddress',
      outputs: [{internalType: 'bool', name: 'validity', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'target', type: 'address'}],
      name: 'isValidVault',
      outputs: [{internalType: 'bool', name: 'validity', type: 'bool'}],
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
    {inputs: [], name: 'rageQuit', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [{internalType: 'address', name: 'bonusToken', type: 'address'}],
      name: 'registerBonusToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'factory', type: 'address'}],
      name: 'registerVaultFactory',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'factory', type: 'address'}],
      name: 'removeVaultFactory',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'address', name: 'recipient', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'rescueTokensFromRewardPool',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'bytes', name: 'permission', type: 'bytes'},
      ],
      name: 'stake',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'stakeLimit',
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
        {internalType: 'address', name: 'vault', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'bytes', name: 'permission', type: 'bytes'},
      ],
      name: 'unstakeAndClaim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: '_stakeLimit', type: 'uint256'}],
      name: 'updateStakeLimit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  const visorABI = [
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'delegate', type: 'address'},
        {indexed: false, internalType: 'address', name: 'token', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Locked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'delegate', type: 'address'},
        {indexed: false, internalType: 'address', name: 'token', type: 'address'},
        {indexed: false, internalType: 'bool', name: 'notified', type: 'bool'},
        {indexed: false, internalType: 'string', name: 'reason', type: 'string'},
      ],
      name: 'RageQuit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {indexed: false, internalType: 'address', name: 'delegate', type: 'address'},
        {indexed: false, internalType: 'address', name: 'token', type: 'address'},
        {indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'Unlocked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'LOCK_TYPEHASH',
      outputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'RAGEQUIT_GAS',
      outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'UNLOCK_TYPEHASH',
      outputs: [{internalType: 'bytes32', name: '', type: 'bytes32'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'VERSION',
      outputs: [{internalType: 'string', name: '', type: 'string'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'delegate', type: 'address'},
        {internalType: 'address', name: 'token', type: 'address'},
      ],
      name: 'calculateLockID',
      outputs: [{internalType: 'bytes32', name: 'lockID', type: 'bytes32'}],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [],
      name: 'checkBalances',
      outputs: [{internalType: 'bool', name: 'validity', type: 'bool'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'address', name: 'delegate', type: 'address'},
      ],
      name: 'getBalanceDelegated',
      outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'address', name: 'token', type: 'address'}],
      name: 'getBalanceLocked',
      outputs: [{internalType: 'uint256', name: 'balance', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{internalType: 'uint256', name: 'index', type: 'uint256'}],
      name: 'getLockAt',
      outputs: [
        {
          components: [
            {internalType: 'address', name: 'delegate', type: 'address'},
            {internalType: 'address', name: 'token', type: 'address'},
            {internalType: 'uint256', name: 'balance', type: 'uint256'},
          ],
          internalType: 'struct IUniversalVault.LockData',
          name: 'lockData',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getLockSetCount',
      outputs: [{internalType: 'uint256', name: 'count', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getNonce',
      outputs: [{internalType: 'uint256', name: 'nonce', type: 'uint256'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'bytes32', name: 'eip712TypeHash', type: 'bytes32'},
        {internalType: 'address', name: 'delegate', type: 'address'},
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'uint256', name: 'nonce', type: 'uint256'},
      ],
      name: 'getPermissionHash',
      outputs: [{internalType: 'bytes32', name: 'permissionHash', type: 'bytes32'}],
      stateMutability: 'view',
      type: 'function',
    },
    {inputs: [], name: 'initialize', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [], name: 'initializeLock', outputs: [], stateMutability: 'nonpayable', type: 'function'},
    {
      inputs: [
        {internalType: 'bytes32', name: 'permissionHash', type: 'bytes32'},
        {internalType: 'bytes', name: 'signature', type: 'bytes'},
      ],
      name: 'isValidSignature',
      outputs: [{internalType: 'bytes4', name: '', type: 'bytes4'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'bytes', name: 'permission', type: 'bytes'},
      ],
      name: 'lock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'nft',
      outputs: [{internalType: 'address', name: 'nftAddress', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{internalType: 'address', name: 'ownerAddress', type: 'address'}],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'delegate', type: 'address'},
        {internalType: 'address', name: 'token', type: 'address'},
      ],
      name: 'rageQuit',
      outputs: [
        {internalType: 'bool', name: 'notified', type: 'bool'},
        {internalType: 'string', name: 'error', type: 'string'},
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'transferERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'to', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
      ],
      name: 'transferETH',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {internalType: 'address', name: 'token', type: 'address'},
        {internalType: 'uint256', name: 'amount', type: 'uint256'},
        {internalType: 'bytes', name: 'permission', type: 'bytes'},
      ],
      name: 'unlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {stateMutability: 'payable', type: 'receive'},
  ]

  const DAI_Hypervisor = new ethcall.Contract('0xF178d88D2F6F97CA32F92b465987068e1Cce41c5', hypervisorABI)
  const USDC_Hypervisor = new ethcall.Contract('0x96C105E9e9eAb36eb8e2f851A5dabFbBd397c085', hypervisorABI)
  const USDT_Hypervisor = new ethcall.Contract('0xEBaE3CB14CE6C2F26B40b747fd92cCaf03B98659', hypervisorABI)
  const VISR_ETH_Hypervisor = new ethcall.Contract('0x64fcDD0DE44f4bd04c039B0664FB95EF033D4efb', hypervisorABI)
  const VISORFACTORY = '0xaE03233307865623Aaef76Da9ADe669b86e6F20A'
  const visorfactory = new ethers.Contract(VISORFACTORY, factoryABI, App.provider)
  const unixTimeNow = Math.floor(Date.now() / 1000)

  const mintNFT = async function() {
    const signer = App.provider.getSigner()
    const vf = new ethers.Contract(VISORFACTORY, factoryABI, signer)
    let allow = Promise.resolve()
    showLoading()
    allow = vf
      .create()
      .then(function(t) {
        return App.provider.waitForTransaction(t.hash)
      })
      .catch(function() {
        hideLoading()
        alert('something bad happened')
      })
  }
  _print_link('Mint NFT', mintNFT)

  const vaultIndex = await visorfactory.vaultCount(App.YOUR_ADDRESS)
  let myDAI = 0,
    myUSDC = 0,
    myUSDT = 0,
    myLP = 0
  let myVaultAddr = 'N/A'
  if (vaultIndex > 0) {
    myVaultAddr = await visorfactory.userIndex(App.YOUR_ADDRESS, vaultIndex - 1)
    const myVault = new ethcall.Contract(myVaultAddr, visorABI)
    ;[myDAI, myUSDC, myUSDT, myLP] = await App.ethcallProvider.all([
      myVault.getBalanceLocked(vDAI),
      myVault.getBalanceLocked(vUSDC),
      myVault.getBalanceLocked(vUSDT),
      myVault.getBalanceLocked(vLPAddr),
    ])
  }

  const visorPrice = (await lookUpTokenPrices(['0xf938424f7210f31df2aee3011291b658f872e91e']))[
    '0xf938424f7210f31df2aee3011291b658f872e91e'
  ]['usd']

  if (myVaultAddr === 'N/A') {
    _print('No user vault found, calculating APR based on test vault.')
    myVaultAddr = '0x675ACde86DffE354e175E7dCb95E71f9902477D7'
    const myVault = new ethcall.Contract(myVaultAddr, visorABI)
    ;[myDAI, myUSDC, myUSDT, myLP] = await App.ethcallProvider.all([
      myVault.getBalanceLocked(vDAI),
      myVault.getBalanceLocked(vUSDC),
      myVault.getBalanceLocked(vUSDT),
      myVault.getBalanceLocked(vLPAddr),
    ])
    _print('')
  }

  _print(`My vault: ${myVaultAddr}`)
  _print('My Locked Balance:')
  _print(`   DAI: ${ethers.utils.formatEther(myDAI)}`)
  _print(`  USDC: ${ethers.utils.formatUnits(myUSDC, 6)}`)
  _print(`  USDT: ${ethers.utils.formatUnits(myUSDT, 6)}`)
  _print(`    LP: ${ethers.utils.formatEther(myLP)}`)
  _print('')

  _print('Future Vault Rewards:')

  const [daiFuture7, daiFuture14, daiFuture30] = await App.ethcallProvider.all([
    DAI_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 604800),
    DAI_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 1209600),
    DAI_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 2592000),
  ])
  const dai_apyish_weekly = ((((daiFuture7 / 1e18) * visorPrice) / (myDAI / 1e18)) * 100).toString().substring(0, 5)
  const dai_apyish_biweekly = ((((daiFuture14 / 1e18) * visorPrice) / (myDAI / 1e18)) * 100).toString().substring(0, 5)
  const dai_apyish_monthly = ((((daiFuture30 / 1e18) * visorPrice) / (myDAI / 1e18)) * 100).toString().substring(0, 5)
  _print('  DAI:')
  _print(
    `    7 Days:  ${ethers.utils
      .formatEther(daiFuture7)
      .toString()
      .substring(0, 5)} VISR | Return: ${dai_apyish_weekly.toString().substring(0, 5)}%`
  )
  _print(
    `    14 Days: ${ethers.utils
      .formatEther(daiFuture14)
      .toString()
      .substring(0, 5)} VISR | Return: ${dai_apyish_biweekly.toString().substring(0, 5)}%`
  )
  _print(
    `    30 Days: ${ethers.utils
      .formatEther(daiFuture30)
      .toString()
      .substring(0, 5)} VISR | Return: ${dai_apyish_monthly.toString().substring(0, 5)}%`
  )

  const [usdcFuture7, usdcFuture14, usdcFuture30] = await App.ethcallProvider.all([
    USDC_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 604800),
    USDC_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 1209600),
    USDC_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 2592000),
  ])
  const usdc_apyish_weekly = ((((usdcFuture7 / 1e18) * visorPrice) / (myUSDC / 1e6)) * 100).toString().substring(0, 5)
  const usdc_apyish_biweekly = ((((usdcFuture14 / 1e18) * visorPrice) / (myUSDC / 1e6)) * 100)
    .toString()
    .substring(0, 5)
  const usdc_apyish_monthly = ((((usdcFuture30 / 1e18) * visorPrice) / (myUSDC / 1e6)) * 100).toString().substring(0, 5)
  _print('  USDC:')
  _print(
    `    7 Days:  ${ethers.utils
      .formatEther(usdcFuture7)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdc_apyish_weekly.toString().substring(0, 5)}%`
  )
  _print(
    `    14 Days: ${ethers.utils
      .formatEther(usdcFuture14)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdc_apyish_biweekly.toString().substring(0, 5)}%`
  )
  _print(
    `    30 Days: ${ethers.utils
      .formatEther(usdcFuture30)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdc_apyish_monthly.toString().substring(0, 5)}%`
  )

  const [usdtFuture7, usdtFuture14, usdtFuture30] = await App.ethcallProvider.all([
    USDT_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 604800),
    USDT_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 1209600),
    USDT_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 2592000),
  ])
  const usdt_apyish_weekly = ((((usdtFuture7 / 1e18) * visorPrice) / (myUSDT / 1e6)) * 100).toString().substring(0, 5)
  const usdt_apyish_biweekly = ((((usdtFuture14 / 1e18) * visorPrice) / (myUSDT / 1e6)) * 100)
    .toString()
    .substring(0, 5)
  const usdt_apyish_monthly = ((((usdtFuture30 / 1e18) * visorPrice) / (myUSDT / 1e6)) * 100).toString().substring(0, 5)
  _print('  USDT:')
  _print(
    `    7 Days:  ${ethers.utils
      .formatEther(usdtFuture7)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdt_apyish_weekly.toString().substring(0, 5)}%`
  )
  _print(
    `    14 Days: ${ethers.utils
      .formatEther(usdtFuture14)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdt_apyish_biweekly.toString().substring(0, 5)}%`
  )
  _print(
    `    30 Days: ${ethers.utils
      .formatEther(usdtFuture30)
      .toString()
      .substring(0, 5)} VISR | Return: ${usdt_apyish_monthly.toString().substring(0, 5)}%`
  )

  const prices = {},
    tokens = {}
  const lpToken = await getToken(App, vLPAddr, myVaultAddr)
  await getNewPricesAndTokens(App, tokens, prices, lpToken.tokens, myVaultAddr)
  const poolPrices = getPoolPrices(tokens, prices, lpToken)
  const lpPrice = poolPrices.price

  const [lpFuture7, lpFuture14, lpFuture30] = await App.ethcallProvider.all([
    VISR_ETH_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 604800),
    VISR_ETH_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 1209600),
    VISR_ETH_Hypervisor.getFutureVaultReward(myVaultAddr, unixTimeNow + 2592000),
  ])
  const lp_apyish_weekly = ((((lpFuture7 / 1e18) * visorPrice) / ((myLP / 1e18) * lpPrice)) * 100)
    .toString()
    .substring(0, 5)
  const lp_apyish_biweekly = ((((lpFuture14 / 1e18) * visorPrice) / ((myLP / 1e18) * lpPrice)) * 100)
    .toString()
    .substring(0, 6)
  const lp_apyish_monthly = ((((lpFuture30 / 1e18) * visorPrice) / ((myLP / 1e18) * lpPrice)) * 100)
    .toString()
    .substring(0, 7)
  _print('  LP:')
  _print(
    `    7 Days:  ${ethers.utils
      .formatEther(lpFuture7)
      .toString()
      .substring(0, 5)} VISR | Return: ${lp_apyish_weekly.toString().substring(0, 5)}%`
  )
  _print(
    `    14 Days: ${ethers.utils
      .formatEther(lpFuture14)
      .toString()
      .substring(0, 5)} VISR | Return: ${lp_apyish_biweekly.toString().substring(0, 6)}%`
  )
  _print(
    `    30 Days: ${ethers.utils
      .formatEther(lpFuture30)
      .toString()
      .substring(0, 5)} VISR | Return: ${lp_apyish_monthly.toString().substring(0, 7)}%`
  )

  hideLoading()
}
