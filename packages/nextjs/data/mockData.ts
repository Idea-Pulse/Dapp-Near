export type TaskStatus = "open" | "in_progress" | "completed";
export type ProjectStatus = "active" | "completed" | "failed";

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: TaskStatus;
  assignee?: string;
  completedDate?: string;
}

export interface ProjectUpdate {
  title: string;
  content: string;
  date: string;
}

export interface Milestone {
  title: string;
  description: string;
  deliverables: string;
  deadline: string;
  status: "pending" | "completed";
}

export interface UnlockSchedule {
  date: string;
  percentage: number;
  unlocked: boolean;
}

export interface UserParticipation {
  projectId: string;
  investedAmount: number;
  tokenAmount: number;
  status: "active" | "completed" | "failed";
  unlockSchedule: UnlockSchedule[];
}

export interface TaskReward {
  amount: number;
  token: string;
}

export interface UserTask {
  taskId: string;
  status: "applied" | "in_progress" | "completed";
  appliedDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  summary: string;
  fundingGoal: number;
  raisedAmount: number;
  endDate: string;
  creator: string;
  category: string;
  status: ProjectStatus;
  tags: string[];
  participants: {
    address: string;
    contribution: number;
  }[];
  tasks: Task[];
  roadmap: Milestone[];
  updates: ProjectUpdate[];
}

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Wildlife Conservation Token (WCT)",
    description:
      "A blockchain-based fundraising mechanism supporting African wildlife conservation efforts. By issuing WCT tokens, we create a transparent and automated way for donors to contribute to wildlife protection through smart contracts.",
    summary: "Blockchain-powered wildlife conservation funding",
    fundingGoal: 100000,
    raisedAmount: 60000,
    endDate: "2025-04-30",
    creator: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    category: "Conservation",
    status: "active",
    tags: ["Wildlife", "Conservation", "Africa", "Token"],
    participants: [
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", contribution: 15000 },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", contribution: 12000 },
      { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", contribution: 8000 },
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", contribution: 5000 },
      { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", contribution: 4500 },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", contribution: 3200 },
      { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", contribution: 2800 },
      { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", contribution: 2500 },
      { address: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8", contribution: 2000 },
      { address: "0x881D40237659C251811CEC9c364ef91dC08D300C", contribution: 1800 },
      { address: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", contribution: 1500 },
      { address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", contribution: 1200 },
      { address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53", contribution: 500 },
    ],
    tasks: [
      {
        id: "1-1",
        title: "Smart Contract Development",
        description: "Develop and audit smart contracts for automated donation distribution to conservation organizations.",
        reward: 5000,
        status: "open",
      },
      {
        id: "1-2",
        title: "Token Distribution System",
        description: "Implement the token distribution mechanism for public sale and conservation partners.",
        reward: 4000,
        status: "in_progress",
        assignee: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
      },
      {
        id: "1-3",
        title: "Product Management",
        description: "Define product roadmap, user stories, and feature prioritization for the WCT platform.",
        reward: 3800,
        status: "open",
      },
      {
        id: "1-4",
        title: "Community Management",
        description: "Develop and execute community engagement strategy across Discord, Telegram, and Twitter.",
        reward: 2500,
        status: "open",
      },
      {
        id: "1-5",
        title: "Business Development",
        description: "Establish partnerships with conservation organizations and potential token holders.",
        reward: 4200,
        status: "open",
      },
      {
        id: "1-6",
        title: "Tokenomics Design",
        description: "Refine token utility, governance mechanisms, and economic incentives for long-term sustainability.",
        reward: 4500,
        status: "open",
      },
      {
        id: "1-7",
        title: "UI/UX Design",
        description: "Create intuitive user interfaces for token purchase, donation tracking, and impact reporting.",
        reward: 3500,
        status: "open",
      },
      {
        id: "1-8",
        title: "Marketing Strategy",
        description: "Develop comprehensive marketing plan for token launch and ongoing adoption.",
        reward: 3200,
        status: "open",
      },
    ],
    roadmap: [
      {
        title: "Research & Concept Development",
        description: "Conduct market research, analyze existing conservation funding models, and develop the token economics framework",
        deliverables: "Market analysis report, Token economics whitepaper, Initial partnership strategy",
        deadline: "2025-03-01",
        status: "completed",
      },
      {
        title: "Smart Contract Development",
        description: "Develop and audit the core smart contracts for token issuance and automated donation distribution",
        deliverables: "ERC-20 token contract, Donation distribution contract, Technical documentation, Security audit report",
        deadline: "2025-03-25",
        status: "pending",
      },
      {
        title: "Platform Development & Testing",
        description: "Build the web platform for token purchase, donation tracking, and impact reporting",
        deliverables: "Web application MVP, User dashboard, Conservation project profiles, Integration with wallet providers",
        deadline: "2025-04-10",
        status: "pending",
      },
      {
        title: "Launch & Initial Distribution",
        description: "Launch the token and platform, begin initial distribution to early backers and conservation partners",
        deliverables: "Public launch event, Initial token distribution, Partnership announcements, Marketing campaign",
        deadline: "2025-04-25",
        status: "pending",
      }
    ],
    updates: [
      {
        title: "Initial Research Completed",
        content: "I've analyzed 15 conservation projects and identified key partnership opportunities with 3 major African wildlife organizations. Preparing outreach strategy now.",
        date: "2025-03-01",
      },
      {
        title: "Partnership Intent Established",
        content: "Received positive responses from 2 conservation organizations. They've expressed interest in our tokenization model. Drafting preliminary agreement terms.",
        date: "2025-03-02",
      },
    ],
  },
  {
    id: "2",
    title: "DeFi Lending Protocol",
    description:
      "A novel lending protocol with dynamic interest rates and multi-token collateral pools. Our system uses advanced algorithms to optimize lending efficiency.",
    summary: "Advanced DeFi lending with dynamic rates",
    fundingGoal: 45000,
    raisedAmount: 12800,
    endDate: "2025-04-15",
    creator: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    category: "DeFi",
    status: "active",
    tags: ["DeFi", "Lending", "Yield"],
    participants: [
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", contribution: 3500 },
      { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", contribution: 2800 },
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", contribution: 1500 },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", contribution: 1200 },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", contribution: 900 },
      { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", contribution: 800 },
      { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", contribution: 600 },
      { address: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8", contribution: 500 },
      { address: "0x881D40237659C251811CEC9c364ef91dC08D300C", contribution: 400 },
      { address: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", contribution: 300 },
      { address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", contribution: 200 },
      { address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53", contribution: 100 },
    ],
    tasks: [
      {
        id: "2-1",
        title: "Interest Rate Model",
        description: "Develop and simulate the dynamic interest rate model.",
        reward: 3000,
        status: "completed",
        assignee: "0x881D40237659C251811CEC9c364ef91dC08D300C",
        completedDate: "2025-03-10",
      },
      {
        id: "2-2",
        title: "Liquidation Engine",
        description: "Implement efficient liquidation mechanisms.",
        reward: 4500,
        status: "open",
      },
      {
        id: "2-3",
        title: "Oracle Integration",
        description: "Integrate price feeds from Chainlink oracles for accurate collateral valuation.",
        reward: 2800,
        status: "open",
      },
      {
        id: "2-4",
        title: "Frontend Dashboard",
        description: "Create user dashboard for lending and borrowing activities.",
        reward: 3200,
        status: "open",
      },
      {
        id: "2-5",
        title: "Smart Contract Testing",
        description: "Write comprehensive test suite for all protocol contracts.",
        reward: 2500,
        status: "open",
      },
    ],
    roadmap: [
      {
        title: "Protocol Design & Modeling",
        description: "Design the interest rate models, collateral mechanisms, and liquidation processes",
        deliverables: "Protocol specification document, Financial risk models, Liquidation mechanism design",
        deadline: "2025-03-01",
        status: "completed",
      },
      {
        title: "Core Contract Development",
        description: "Develop the lending pool contracts, oracle integration, and risk management systems",
        deliverables: "Lending pool contracts, Price oracle integration, Risk parameter configuration, Unit tests",
        deadline: "2025-03-20",
        status: "pending",
      },
      {
        title: "Security Audit & Optimization",
        description: "Conduct comprehensive security audits and optimize gas efficiency",
        deliverables: "External audit report, Gas optimization report, Bug fixes, Final contract documentation",
        deadline: "2025-04-05",
        status: "pending",
      },
      {
        title: "Testnet Deployment & UI Development",
        description: "Deploy to testnet and develop the user interface for lenders and borrowers",
        deliverables: "Testnet deployment, Web application, Analytics dashboard, User documentation",
        deadline: "2025-04-15",
        status: "pending",
      }
    ],
    updates: [
      {
        title: "Algorithm Research Completed",
        content: "I've analyzed 8 existing lending protocols and identified optimization opportunities. The proposed interest rate model could improve efficiency by 15%.",
        date: "2025-02-10",
      },
      {
        title: "Security Framework Outlined",
        content: "Completed preliminary security framework design. Identified 3 top audit firms for future review. Preparing technical specifications for smart contract development.",
        date: "2025-02-25",
      },
    ],
  },
  {
    id: "3",
    title: "NFT Gaming Platform",
    description:
      "Create a cross-chain gaming platform with interoperable NFT assets and play-to-earn mechanics. Features include cross-chain asset transfers and in-game marketplaces.",
    summary: "Cross-chain NFT gaming ecosystem",
    fundingGoal: 60000,
    raisedAmount: 15600,
    endDate: "2025-04-30",
    creator: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    category: "Gaming",
    status: "active",
    tags: ["Gaming", "NFT", "Cross-chain"],
    participants: [
      { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", contribution: 4000 },
      { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", contribution: 3500 },
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", contribution: 2000 },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", contribution: 1800 },
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", contribution: 1200 },
      { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", contribution: 900 },
      { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", contribution: 700 },
      { address: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8", contribution: 500 },
      { address: "0x881D40237659C251811CEC9c364ef91dC08D300C", contribution: 400 },
      { address: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", contribution: 300 },
      { address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", contribution: 200 },
      { address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53", contribution: 100 },
    ],
    tasks: [
      {
        id: "3-1",
        title: "Asset Bridge Implementation",
        description: "Develop cross-chain NFT bridge contracts.",
        reward: 6000,
        status: "open",
      },
      {
        id: "3-2",
        title: "Game Smart Contracts",
        description: "Create core gaming smart contracts.",
        reward: 5500,
        status: "in_progress",
        assignee: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8",
      },
      {
        id: "3-3",
        title: "NFT Rendering Engine",
        description: "Build the engine to render NFT assets in-game across different chains.",
        reward: 4800,
        status: "open",
      },
      {
        id: "3-4",
        title: "Marketplace UI",
        description: "Design and implement the in-game marketplace interface.",
        reward: 3500,
        status: "open",
      },
      {
        id: "3-5",
        title: "Game Economics Design",
        description: "Design tokenomics and in-game economy balancing.",
        reward: 4200,
        status: "open",
      },
      {
        id: "3-6",
        title: "Cross-chain Testing",
        description: "Test NFT transfers and gameplay across multiple test networks.",
        reward: 3800,
        status: "open",
      },
    ],
    roadmap: [
      {
        title: "Game Design & NFT Standard",
        description: "Design core game mechanics and develop the cross-chain NFT standard",
        deliverables: "Game design document, NFT standard specification, Asset interoperability framework",
        deadline: "2025-03-15",
        status: "pending",
      },
      {
        title: "Smart Contract Development",
        description: "Develop the NFT contracts, marketplace, and cross-chain bridge",
        deliverables: "NFT contracts, Marketplace contracts, Bridge contracts, Technical documentation",
        deadline: "2025-03-30",
        status: "pending",
      },
      {
        title: "Game Client Development",
        description: "Develop the game client with wallet integration and NFT visualization",
        deliverables: "Game client prototype, Wallet integration, NFT rendering engine, Basic gameplay features",
        deadline: "2025-04-15",
        status: "pending",
      },
      {
        title: "Testnet Launch & Community Building",
        description: "Launch on testnet and begin building the player community",
        deliverables: "Testnet deployment, Community forum, Discord server, Initial NFT distribution to early adopters",
        deadline: "2025-04-30",
        status: "pending",
      }
    ],
    updates: [
      {
        title: "Game Mechanics Research",
        content: "I've analyzed 12 successful NFT games and identified key engagement patterns. Recommending a hybrid play-to-earn model with focus on asset interoperability.",
        date: "2025-02-05",
      },
      {
        title: "Technical Architecture Draft",
        content: "Completed initial technical architecture for cross-chain NFT standard. Identified ERC-1155 as optimal base with custom extensions for cross-chain functionality.",
        date: "2025-02-20",
      },
    ],
  },
];

// Mock data for dashboard
export const mockUserParticipations: UserParticipation[] = [
  {
    projectId: "1",
    investedAmount: 2000,
    tokenAmount: 2400,
    status: "active",
    unlockSchedule: [
      { date: "2025-03-05", percentage: 10, unlocked: false },
      { date: "2025-03-20", percentage: 10, unlocked: false },
      { date: "2025-04-10", percentage: 20, unlocked: false },
    ],
  },
  {
    projectId: "2",
    investedAmount: 8000,
    tokenAmount: 7600,
    status: "active",
    unlockSchedule: [
      { date: "2025-03-15", percentage: 40, unlocked: false },
      { date: "2025-04-01", percentage: 30, unlocked: false },
      { date: "2025-04-15", percentage: 30, unlocked: false },
    ],
  },
];

export const mockUserTasks: UserTask[] = [
  {
    taskId: "1-1",
    status: "completed",
    appliedDate: "2025-03-01",
  },
  {
    taskId: "2-2",
    status: "in_progress",
    appliedDate: "2025-03-02",
  },
];

// Mock tasks with full details
export const mockTasks = mockProjects.flatMap(project =>
  project.tasks.map(task => ({
    ...task,
    projectId: project.id,
    reward: {
      amount: task.reward,
      token: "USDT",
    },
  })),
);
