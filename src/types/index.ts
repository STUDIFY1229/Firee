export interface BotStrategy {
  id: string;
  name: string;
  tag: string;
  category: 'Digits' | 'Over/Under' | 'Differs' | 'Adaptive';
  market: string;
  marketDisplayName: string;
  tradeType: string;
  contractType: string;
  description: string;
  features: string[];
  recommendedStake: number;
  martingaleMultiplier: number;
  takeProfit: number;
  stopLoss: number;
  xmlContent: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  winRateEstimate: string;
  recoveryType: string;
}

export interface DigitStat {
  digit: number;
  count: number;
  percentage: number;
  rank: 'highest' | 'second-highest' | 'lowest' | 'second-lowest' | 'normal';
}

export interface MarketOption {
  symbol: string;
  displayName: string;
  category: 'Volatility' | 'Volatility (1s)' | 'Jump' | 'Step';
  pipSize: number;
}

export interface TickData {
  epoch: number;
  quote: number;
  lastDigit: number;
}

export interface TradeContract {
  id: string;
  reference: string;
  timestamp: string;
  market: string;
  tradeType: string;
  stake: number;
  payout: number;
  profit: number;
  status: 'won' | 'lost' | 'open';
  barrier?: number | string;
  exitDigit?: number;
}

export interface JournalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}
