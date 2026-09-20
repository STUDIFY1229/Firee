import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  PlayCircle,
  FileCheck,
  Zap,
  Target
} from 'lucide-react';

export const Tutorials: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'strategies' | 'faq' | 'bot-guide'>('strategies');

  const strategies = [
    {
      title: 'Martingale Strategy',
      badge: 'Aggressive Recovery',
      description:
        'A classical compounding recovery system where the stake is multiplied (usually by 2x) after each consecutive loss to recoup all previous losses in a single winning trade.',
      formula: 'Next Stake = Current Stake × Multiplier (e.g., $1 → $2 → $4 → $8)',
      bestFor: 'High win-rate contracts (Digit Differs, Over 2, Under 7)',
      pros: 'Recovers all losses instantly on first win',
      cons: 'Risk of exponential stake growth on long loss streaks',
    },
    {
      title: "D'Alembert System",
      badge: 'Linear Conservative',
      description:
        'A progressive staking method that adds 1 unit of stake after a loss and subtracts 1 unit after a win. Much safer than Martingale because stake increases linearly rather than exponentially.',
      formula: 'Loss: Stake + Base Unit | Win: Stake - Base Unit',
      bestFor: '50/50 contracts (Even/Odd, Matches/Differs, Over 4/Under 5)',
      pros: 'Smooth equity curve, low drawdown risk',
      cons: 'Requires equal number of wins to reach target profit',
    },
    {
      title: "Oscar's Grind",
      badge: 'Profit Target Oriented',
      description:
        'A conservative strategy aimed at making exactly 1 unit of profit per cycle. After a loss, stake remains constant until a win occurs, at which point stake increases by 1 unit.',
      formula: 'Hold stake on loss; increase by +1 unit only after winning',
      bestFor: 'Even/Odd, Digit Over 4 / Under 5',
      pros: 'Very low drawdown risk and highly structured',
      cons: 'Takes more trades to recover extended drawdown periods',
    },
    {
      title: '1-3-2-6 Progression',
      badge: 'Positive Trend Surfer',
      description:
        'A positive progression strategy where stakes increase only during winning streaks (1 unit, then 3, then 2, then 6). Upon any loss or after completing 4 consecutive wins, stake resets to 1 unit.',
      formula: 'Sequence: 1 unit → 3 units → 2 units → 6 units on wins; reset on any loss',
      bestFor: 'Consecutive streaks & high momentum markets',
      pros: 'Caps risk on losses while leveraging winning streaks',
      cons: 'Loss on the 4th trade gives up accumulated cycle profits',
    },
  ];

  const faqs = [
    {
      q: 'How do I load a Free Bot into the Bot Builder?',
      a: 'Navigate to the "Free bot" tab in the top navigation bar, browse the 4 curated bots (Digit Sniper, Adaptive Regime, Dual Hunter, Differs Streak), and click "Open in Bot Builder". The strategy blocks and variables will automatically populate your visual workspace ready to run.',
    },
    {
      q: 'How does DCircles calculate digit percentages using 1000 ticks?',
      a: 'DCircles continuously maintains a rolling buffer of exactly 1,000 real-time market ticks from Deriv. For every tick, it extracts the last digit (0-9) and calculates the exact occurrence percentage out of 1,000. It then colors the most appearing digit green, 2nd most blue, 2nd least yellow, and least appearing red.',
    },
    {
      q: 'What does the moving cursor in DCircles indicate?',
      a: 'The moving cursor acts as an active live tracking radar: whenever a new tick arrives, the circular cursor smoothly jumps to the corresponding digit circle with a glowing pulse, allowing you to visually see repeating digit clusters and momentum.',
    },
    {
      q: 'Can I change the market to Volatilities, Jump, or Step indices?',
      a: 'Yes! In both DCircles and Bot Builder, you can choose from all standard Volatility indices (10 to 100), 1-second Volatilities (10 (1s) to 100 (1s)), Jump indices (10 to 100), and Step indices (Step, Step 200, Step 500).',
    },
    {
      q: 'Do I need to download any files or HTML to use the bots?',
      a: 'No! All bots run directly inside the browser application with zero downloads required. You simply click "Open in Bot Builder" or "Run Now" on any bot card, and it loads instantly into the interactive Blockly workspace ready to trade.',
    },
  ];

  return (
    <div className="py-6 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/95 via-blue-50/80 to-indigo-50/50 backdrop-blur-xl border border-white/80 shadow-xl shadow-blue-500/5">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-2.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>DBot Knowledge Base & Strategy Academy</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tutorials, Strategies & Guides
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Learn the mathematical foundations behind automated trading bots, explore risk management formulas, and
            discover how to use DCircles 1,000-tick statistical data to enhance your trading edge.
          </p>

          {/* Sub Navigation */}
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('strategies')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'strategies'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Money Management Strategies
            </button>
            <button
              onClick={() => setActiveTab('bot-guide')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'bot-guide'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              How Bots Work (Blocks)
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>
        </div>
      </div>

      {/* Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategies.map((strat, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{strat.title}</h3>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {strat.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{strat.description}</p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 font-mono text-xs text-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Formula</span>
                <div>{strat.formula}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                  <span className="font-bold block text-[10px] uppercase text-emerald-600">Advantages</span>
                  <span>{strat.pros}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-900">
                  <span className="font-bold block text-[10px] uppercase text-rose-600">Consideration</span>
                  <span>{strat.cons}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bot Guide Tab */}
      {activeTab === 'bot-guide' && (
        <div className="rounded-3xl p-8 bg-white/90 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">The 4 Core Execution Stages of a Deriv Bot</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Trade Setup</h4>
              <p className="text-xs text-slate-600">
                Defines the market symbol, trade type (Over/Under, Differs, Even/Odd), and initial variables like Base Stake and Martingale multiplier.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Tick Watcher</h4>
              <p className="text-xs text-slate-600">
                Runs on every single incoming price tick. Inspects the last digit, accumulates streak counters, and evaluates range gates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Purchase Entry</h4>
              <p className="text-xs text-slate-600">
                Once entry conditions are met (e.g. Digit equals entry point or streak reaches trigger), arms and fires the buy order.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">After-Purchase</h4>
              <p className="text-xs text-slate-600">
                Inspects win/loss result. Applies Martingale multiplier or recovery flags, checks Take Profit / Stop Loss, and triggers Trade Again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-100/60 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
