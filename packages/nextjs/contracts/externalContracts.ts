import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";


    const externalContracts = {
   1313161555: {
   ProjectToken: {
     address: "0x12088E3a2C13c44c2fE8368F85a25A1fc4845c77", 
     abi: [
   {
       "inputs": [
           {
               "internalType": "string",
               "name": "name",
               "type": "string"
           },
           {
               "internalType": "string",
               "name": "symbol",
               "type": "string"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "constructor"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": true,
               "internalType": "address",
               "name": "owner",
               "type": "address"
           },
           {
               "indexed": true,
               "internalType": "address",
               "name": "spender",
               "type": "address"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "value",
               "type": "uint256"
           }
       ],
       "name": "Approval",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "spender",
               "type": "address"
           },
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           }
       ],
       "name": "approve",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "approveAndReward",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "completeTask",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "string",
               "name": "title",
               "type": "string"
           },
           {
               "internalType": "string",
               "name": "description",
               "type": "string"
           },
           {
               "internalType": "uint256",
               "name": "stakingAmount",
               "type": "uint256"
           }
       ],
       "name": "createTask",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "spender",
               "type": "address"
           },
           {
               "internalType": "uint256",
               "name": "subtractedValue",
               "type": "uint256"
           }
       ],
       "name": "decreaseAllowance",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "spender",
               "type": "address"
           },
           {
               "internalType": "uint256",
               "name": "addedValue",
               "type": "uint256"
           }
       ],
       "name": "increaseAllowance",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": true,
               "internalType": "address",
               "name": "previousOwner",
               "type": "address"
           },
           {
               "indexed": true,
               "internalType": "address",
               "name": "newOwner",
               "type": "address"
           }
       ],
       "name": "OwnershipTransferred",
       "type": "event"
   },
   {
       "inputs": [],
       "name": "renounceOwnership",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "address",
               "name": "staker",
               "type": "address"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "RewardClaimed",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           }
       ],
       "name": "setRewardPerTask",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "address",
               "name": "staker",
               "type": "address"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "Staked",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "stakeForTask",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           },
           {
               "indexed": false,
               "internalType": "address",
               "name": "assignee",
               "type": "address"
           }
       ],
       "name": "TaskAssigned",
       "type": "event"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           },
           {
               "indexed": false,
               "internalType": "address",
               "name": "assignee",
               "type": "address"
           }
       ],
       "name": "TaskCompleted",
       "type": "event"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           },
           {
               "indexed": false,
               "internalType": "string",
               "name": "title",
               "type": "string"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "stakingAmount",
               "type": "uint256"
           }
       ],
       "name": "TaskCreated",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "to",
               "type": "address"
           },
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           }
       ],
       "name": "transfer",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": true,
               "internalType": "address",
               "name": "from",
               "type": "address"
           },
           {
               "indexed": true,
               "internalType": "address",
               "name": "to",
               "type": "address"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "value",
               "type": "uint256"
           }
       ],
       "name": "Transfer",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "from",
               "type": "address"
           },
           {
               "internalType": "address",
               "name": "to",
               "type": "address"
           },
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           }
       ],
       "name": "transferFrom",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "newOwner",
               "type": "address"
           }
       ],
       "name": "transferOwnership",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": false,
               "internalType": "address",
               "name": "staker",
               "type": "address"
           },
           {
               "indexed": false,
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           }
       ],
       "name": "UnstakedTokens",
       "type": "event"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "unstakeTokens",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "owner",
               "type": "address"
           },
           {
               "internalType": "address",
               "name": "spender",
               "type": "address"
           }
       ],
       "name": "allowance",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "account",
               "type": "address"
           }
       ],
       "name": "balanceOf",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "decimals",
       "outputs": [
           {
               "internalType": "uint8",
               "name": "",
               "type": "uint8"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "staker",
               "type": "address"
           }
       ],
       "name": "getStakeInfo",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           },
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           },
           {
               "internalType": "uint256",
               "name": "timestamp",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           }
       ],
       "name": "getTask",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "id",
               "type": "uint256"
           },
           {
               "internalType": "string",
               "name": "title",
               "type": "string"
           },
           {
               "internalType": "string",
               "name": "description",
               "type": "string"
           },
           {
               "internalType": "uint256",
               "name": "stakingAmount",
               "type": "uint256"
           },
           {
               "internalType": "address",
               "name": "assignee",
               "type": "address"
           },
           {
               "internalType": "bool",
               "name": "completed",
               "type": "bool"
           },
           {
               "internalType": "bool",
               "name": "rewarded",
               "type": "bool"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "name",
       "outputs": [
           {
               "internalType": "string",
               "name": "",
               "type": "string"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "owner",
       "outputs": [
           {
               "internalType": "address",
               "name": "",
               "type": "address"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "rewardPerTask",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "address",
               "name": "",
               "type": "address"
           }
       ],
       "name": "stakes",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "amount",
               "type": "uint256"
           },
           {
               "internalType": "uint256",
               "name": "taskId",
               "type": "uint256"
           },
           {
               "internalType": "uint256",
               "name": "timestamp",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "symbol",
       "outputs": [
           {
               "internalType": "string",
               "name": "",
               "type": "string"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "taskCount",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "name": "taskPendingReward",
       "outputs": [
           {
               "internalType": "bool",
               "name": "",
               "type": "bool"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "name": "tasks",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "id",
               "type": "uint256"
           },
           {
               "internalType": "string",
               "name": "title",
               "type": "string"
           },
           {
               "internalType": "string",
               "name": "description",
               "type": "string"
           },
           {
               "internalType": "uint256",
               "name": "stakingAmount",
               "type": "uint256"
           },
           {
               "internalType": "address",
               "name": "assignee",
               "type": "address"
           },
           {
               "internalType": "bool",
               "name": "completed",
               "type": "bool"
           },
           {
               "internalType": "bool",
               "name": "rewarded",
               "type": "bool"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "totalStaked",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [],
       "name": "totalSupply",
       "outputs": [
           {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
           }
       ],
       "stateMutability": "view",
       "type": "function"
   }
    ]
     ,
   },
   Crowdfunding: {
     address: "0xa79909A50Eb9bc9436a09f7F209f684885cBb55c", // 替换为您的Crowdfunding合约地址
     abi: [
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   }
               ],
               "name": "claimTokens",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   }
               ],
               "name": "closeFunding",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "string",
                       "name": "title",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "description",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "aiPrototypeUrl",
                       "type": "string"
                   },
                   {
                       "internalType": "uint256",
                       "name": "fundingGoal",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "tokenPrice",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "duration",
                       "type": "uint256"
                   },
                   {
                       "internalType": "address",
                       "name": "projectToken",
                       "type": "address"
                   }
               ],
               "name": "createProject",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "_usdcToken",
                       "type": "address"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "constructor"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "totalRaised",
                       "type": "uint256"
                   },
                   {
                       "indexed": false,
                       "internalType": "bool",
                       "name": "successful",
                       "type": "bool"
                   }
               ],
               "name": "FundingClosed",
               "type": "event"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   }
               ],
               "name": "invest",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "investor",
                       "type": "address"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "tokensClaimable",
                       "type": "uint256"
                   }
               ],
               "name": "InvestmentReceived",
               "type": "event"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "previousOwner",
                       "type": "address"
                   },
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "newOwner",
                       "type": "address"
                   }
               ],
               "name": "OwnershipTransferred",
               "type": "event"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "indexed": false,
                       "internalType": "string",
                       "name": "title",
                       "type": "string"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "fundingGoal",
                       "type": "uint256"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "tokenPrice",
                       "type": "uint256"
                   }
               ],
               "name": "ProjectCreated",
               "type": "event"
           },
           {
               "inputs": [],
               "name": "renounceOwnership",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "investor",
                       "type": "address"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   }
               ],
               "name": "TokensClaimed",
               "type": "event"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "newOwner",
                       "type": "address"
                   }
               ],
               "name": "transferOwnership",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "internalType": "address",
                       "name": "recipient",
                       "type": "address"
                   }
               ],
               "name": "withdrawFunds",
               "outputs": [],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   },
                   {
                       "internalType": "address",
                       "name": "investor",
                       "type": "address"
                   }
               ],
               "name": "getInvestment",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "tokensClaimable",
                       "type": "uint256"
                   },
                   {
                       "internalType": "bool",
                       "name": "claimed",
                       "type": "bool"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   }
               ],
               "name": "getProject",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "id",
                       "type": "uint256"
                   },
                   {
                       "internalType": "string",
                       "name": "title",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "description",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "aiPrototypeUrl",
                       "type": "string"
                   },
                   {
                       "internalType": "uint256",
                       "name": "fundingGoal",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "raisedAmount",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "tokenPrice",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "endTime",
                       "type": "uint256"
                   },
                   {
                       "internalType": "bool",
                       "name": "fundingClosed",
                       "type": "bool"
                   },
                   {
                       "internalType": "address",
                       "name": "projectToken",
                       "type": "address"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   },
                   {
                       "internalType": "address",
                       "name": "",
                       "type": "address"
                   }
               ],
               "name": "investments",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "tokensClaimable",
                       "type": "uint256"
                   },
                   {
                       "internalType": "bool",
                       "name": "claimed",
                       "type": "bool"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   }
               ],
               "name": "isFundingActive",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "projectId",
                       "type": "uint256"
                   }
               ],
               "name": "isFundingSuccessful",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "owner",
               "outputs": [
                   {
                       "internalType": "address",
                       "name": "",
                       "type": "address"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "projectCount",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   }
               ],
               "name": "projects",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "id",
                       "type": "uint256"
                   },
                   {
                       "internalType": "string",
                       "name": "title",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "description",
                       "type": "string"
                   },
                   {
                       "internalType": "string",
                       "name": "aiPrototypeUrl",
                       "type": "string"
                   },
                   {
                       "internalType": "uint256",
                       "name": "fundingGoal",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "raisedAmount",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "tokenPrice",
                       "type": "uint256"
                   },
                   {
                       "internalType": "uint256",
                       "name": "endTime",
                       "type": "uint256"
                   },
                   {
                       "internalType": "bool",
                       "name": "fundingClosed",
                       "type": "bool"
                   },
                   {
                       "internalType": "address",
                       "name": "projectToken",
                       "type": "address"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "usdcToken",
               "outputs": [
                   {
                       "internalType": "contract IERC20",
                       "name": "",
                       "type": "address"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           }
       ]
     ,
   },
   MockUSDC: {
     address: "0x7BbEb6d259f4d264caDFfB9F4DD34A5AbB4a924e", // 替换为您的MockUSDC合约地址
     abi: [
           {
               "inputs": [],
               "stateMutability": "nonpayable",
               "type": "constructor"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "owner",
                       "type": "address"
                   },
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "spender",
                       "type": "address"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "value",
                       "type": "uint256"
                   }
               ],
               "name": "Approval",
               "type": "event"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "spender",
                       "type": "address"
                   },
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   }
               ],
               "name": "approve",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "spender",
                       "type": "address"
                   },
                   {
                       "internalType": "uint256",
                       "name": "subtractedValue",
                       "type": "uint256"
                   }
               ],
               "name": "decreaseAllowance",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "spender",
                       "type": "address"
                   },
                   {
                       "internalType": "uint256",
                       "name": "addedValue",
                       "type": "uint256"
                   }
               ],
               "name": "increaseAllowance",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "to",
                       "type": "address"
                   },
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   }
               ],
               "name": "transfer",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "anonymous": false,
               "inputs": [
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "from",
                       "type": "address"
                   },
                   {
                       "indexed": true,
                       "internalType": "address",
                       "name": "to",
                       "type": "address"
                   },
                   {
                       "indexed": false,
                       "internalType": "uint256",
                       "name": "value",
                       "type": "uint256"
                   }
               ],
               "name": "Transfer",
               "type": "event"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "from",
                       "type": "address"
                   },
                   {
                       "internalType": "address",
                       "name": "to",
                       "type": "address"
                   },
                   {
                       "internalType": "uint256",
                       "name": "amount",
                       "type": "uint256"
                   }
               ],
               "name": "transferFrom",
               "outputs": [
                   {
                       "internalType": "bool",
                       "name": "",
                       "type": "bool"
                   }
               ],
               "stateMutability": "nonpayable",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "owner",
                       "type": "address"
                   },
                   {
                       "internalType": "address",
                       "name": "spender",
                       "type": "address"
                   }
               ],
               "name": "allowance",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [
                   {
                       "internalType": "address",
                       "name": "account",
                       "type": "address"
                   }
               ],
               "name": "balanceOf",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "decimals",
               "outputs": [
                   {
                       "internalType": "uint8",
                       "name": "",
                       "type": "uint8"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "name",
               "outputs": [
                   {
                       "internalType": "string",
                       "name": "",
                       "type": "string"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "symbol",
               "outputs": [
                   {
                       "internalType": "string",
                       "name": "",
                       "type": "string"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           },
           {
               "inputs": [],
               "name": "totalSupply",
               "outputs": [
                   {
                       "internalType": "uint256",
                       "name": "",
                       "type": "uint256"
                   }
               ],
               "stateMutability": "view",
               "type": "function"
           }
       ]
     ,
   },
   },
    } as const;

export default externalContracts satisfies GenericContractsDeclaration;