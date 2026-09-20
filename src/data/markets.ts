import { MarketOption } from '../types';

export const ALL_MARKETS: MarketOption[] = [
  // Standard Volatilities
  { symbol: 'R_10', displayName: 'Volatility 10 Index', category: 'Volatility', pipSize: 3 },
  { symbol: 'R_25', displayName: 'Volatility 25 Index', category: 'Volatility', pipSize: 3 },
  { symbol: 'R_50', displayName: 'Volatility 50 Index', category: 'Volatility', pipSize: 4 },
  { symbol: 'R_75', displayName: 'Volatility 75 Index', category: 'Volatility', pipSize: 4 },
  { symbol: 'R_100', displayName: 'Volatility 100 Index', category: 'Volatility', pipSize: 2 },

  // Volatilities (1s)
  { symbol: '1HZ10V', displayName: 'Volatility 10 (1s) Index', category: 'Volatility (1s)', pipSize: 2 },
  { symbol: '1HZ25V', displayName: 'Volatility 25 (1s) Index', category: 'Volatility (1s)', pipSize: 2 },
  { symbol: '1HZ50V', displayName: 'Volatility 50 (1s) Index', category: 'Volatility (1s)', pipSize: 2 },
  { symbol: '1HZ75V', displayName: 'Volatility 75 (1s) Index', category: 'Volatility (1s)', pipSize: 2 },
  { symbol: '1HZ100V', displayName: 'Volatility 100 (1s) Index', category: 'Volatility (1s)', pipSize: 2 },

  // Jump Indices
  { symbol: 'JD10', displayName: 'Jump 10 Index', category: 'Jump', pipSize: 2 },
  { symbol: 'JD25', displayName: 'Jump 25 Index', category: 'Jump', pipSize: 2 },
  { symbol: 'JD50', displayName: 'Jump 50 Index', category: 'Jump', pipSize: 2 },
  { symbol: 'JD75', displayName: 'Jump 75 Index', category: 'Jump', pipSize: 2 },
  { symbol: 'JD100', displayName: 'Jump 100 Index', category: 'Jump', pipSize: 2 },

  // Step Indices
  { symbol: 'stpRNG', displayName: 'Step Index', category: 'Step', pipSize: 1 },
  { symbol: 'step_200', displayName: 'Step Index 200', category: 'Step', pipSize: 2 },
  { symbol: 'step_500', displayName: 'Step Index 500', category: 'Step', pipSize: 2 },
];
