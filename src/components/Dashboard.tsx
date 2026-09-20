import React from 'react';
import { BotStrategy, TradeContract } from '../types';
import { FREE_BOTS } from '../data/freeBots';
import {
  Bot,
  Zap,
  PieChart,
  LineChart,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Sparkles,
  Sliders,
  Play,
  Layers,
  Clock,
  Activity,
  History,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: 'dashboard' | 'bot-builder' | 'charts' | 'tutorials' | 'free-bots' | 'dcircles') => void;
  onSelectBot: (bot: BotStrategy, autoRun?: boolean) => void;
  balance: number;
  totalProfit: number;
  winCount: number;
  lossCount: number;
  isRunning: boolean;
  contracts?: TradeContract[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectBot,
  balance,
  totalProfit,
  winCount,
  lossCount,
  isRunning,
  contracts = [],
}) => {
  return (
    <div className="py-6 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Welcome Card with Glassmorphic Soft UI */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-white/95 via-blue-50/80 to-indigo-50/60 backdrop-blur-xl border border-white/80 shadow-xl shadow-blue-500/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Deriv DBot Pro Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Automate Your Trading with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Deriv DBot</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Build custom strategies with the visual Blockly builder, load tested free bots directly into your workspace with zero downloads, or monitor live 1,000-tick digit probabilities in DCircles.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('bot-builder')}
              id="dash-btn-bot-builder"
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Bot Builder Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('free-bots')}
              id="dash-btn-free-bots"
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Free Bots</span>
            </button>

            <button
              onClick={() => onNavigate('dcircles')}
              id="dash-btn-dcircles"
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>DCircles Analyzer</span>
            </button>

            <button
              onClick={() => onNavigate('charts')}
              id="dash-btn-charts"
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LineChart className="w-4 h-4 text-slate-600" />
              <span>Market Charts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo Balance</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              $
            </span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Virtual Practice Account</span>
        </div>

        <div className="rounded-3xl p-5 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit / Loss</span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                totalProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div
            className={`mt-2 text-xl sm:text-2xl font-black font-mono ${
              totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {totalProfit >= 0 ? `+$${totalProfit.toFixed(2)}` : `-$${Math.abs(totalProfit).toFixed(2)}`}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Session trading results</span>
        </div>

        <div className="rounded-3xl p-5 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Win / Loss Trades</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900">
            <span className="text-emerald-600">{winCount}</span> / <span className="text-rose-600">{lossCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {winCount + lossCount > 0
              ? `Win Rate: ${Math.round((winCount / (winCount + lossCount)) * 100)}%`
              : 'No trades yet'}
          </span>
        </div>

        <div className="rounded-3xl p-5 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bot Status</span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                isRunning ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'
              }`}
            />
            <span>{isRunning ? 'Running Live' : 'Ready / Idle'}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {isRunning ? 'Simulating ticks...' : 'Select a bot to execute'}
          </span>
        </div>
      </div>

      {/* Featured Free Bots Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Featured Free Bots</h2>
            <p className="text-xs text-slate-500 font-medium">Verified automated strategies ready to open and run in Bot Builder</p>
          </div>

          <button
            onClick={() => onNavigate('free-bots')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All 4 Bots</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FREE_BOTS.map((bot) => (
            <div
              key={bot.id}
              className="rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {bot.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {bot.winRateEstimate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {bot.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {bot.description}
                </p>

                <div className="mt-3.5 flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span>Market: <strong>{bot.market}</strong></span>
                  <span>Stake: <strong>${bot.recommendedStake}</strong></span>
                  <span>Martingale: <strong>{bot.martingaleMultiplier}x</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectBot(bot, true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-emerald-700" />
                  <span>Quick Run</span>
                </button>

                <button
                  onClick={() => onSelectBot(bot, false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trading Activity (if trades exist) */}
      {contracts.length > 0 && (
        <div className="rounded-3xl p-6 bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Executed Contracts</h3>
            </div>
            <button
              onClick={() => onNavigate('bot-builder')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Open in Bot Builder &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Reference</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Stake</th>
                  <th className="py-2 px-3">Payout</th>
                  <th className="py-2 px-3">Profit</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {contracts.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 font-sans">{c.timestamp}</td>
                    <td className="py-2.5 px-3 text-slate-700">{c.reference}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{c.tradeType}</td>
                    <td className="py-2.5 px-3 text-slate-800">${c.stake.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-800">${c.payout.toFixed(2)}</td>
                    <td
                      className={`py-2.5 px-3 font-bold ${
                        c.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {c.profit >= 0 ? `+$${c.profit.toFixed(2)}` : `-$${Math.abs(c.profit).toFixed(2)}`}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          c.status === 'won'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'lost'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
