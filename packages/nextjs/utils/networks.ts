import { defineChain } from "viem";

export const monadTestnet = defineChain({
  id: 10_143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
      webSocket: ["wss://testnet-rpc.monad.xyz/ws"],
    },
    public: {
      http: ["https://testnet-rpc.monad.xyz"],
      webSocket: ["wss://testnet-rpc.monad.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1234,
    },
  },
});

export const auroraTestnet = defineChain({
  id: 1313161555,
  name: "Aurora Testnet",
  network: "aurora-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.aurora.dev"],
    },
    public: {
      http: ["https://testnet.aurora.dev"],
    },
  },
  blockExplorers: {
    default: {
      name: "Aurora Explorer",
      url: "https://explorer.testnet.aurora.dev",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1234,
    },
  },
  testnet: true,
});

export const flowEvmTestnet = defineChain({
  id: 545,
  name: "Flow EVM Testnet",
  network: "flow-evm-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Flow",
    symbol: "FLOW",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.evm.nodes.onflow.org"],
      webSocket: ["wss://testnet.evm.nodes.onflow.org/ws"],
    },
    public: {
      http: ["https://testnet.evm.nodes.onflow.org"],
      webSocket: ["wss://testnet.evm.nodes.onflow.org/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Flow Explorer",
      url: "https://evm-testnet.flowscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1234,
    },
  },
  testnet: true,
});
