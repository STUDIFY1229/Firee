import React from 'react';
import { BotStrategy } from '../types';
import { FREE_BOTS } from '../data/freeBots';
import { ArrowRight, Cpu, TrendingUp } from 'lucide-react';

interface FreeBotsProps {
  onSelectBot: (bot: BotStrategy) => void;
  activeBotId: string;
}

export const FreeBots: React.FC<FreeBotsProps> = ({ onSelectBot, activeBotId }) => {
  return (
    <div className="py-6 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Free Bots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click any bot to open it directly in Bot Builder.
          </p>
        </div>
      </div>

      {/* List of bots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FREE_BOTS.map((bot) => {
          const isActive = bot.id === activeBotId;

          return (
            <div
              key={bot.id}
              onClick={() => onSelectBot(bot)}
              className={`rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 backdrop-blur-xl border ${
                isActive
                  ? 'bg-white/95 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-400/40'
                  : 'bg-white/90 hover:bg-white border-white/90 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{bot.category}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700">
                      {bot.contractType}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{bot.winRateEstimate}</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {bot.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {bot.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Market</span>
                    <span className="font-bold text-slate-800 truncate block">{bot.marketDisplayName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Stake</span>
                    <span className="font-mono font-bold text-slate-800">${bot.recommendedStake.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Recovery</span>
                    <span className="font-mono font-bold text-slate-800">{bot.martingaleMultiplier}x</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">
                  {isActive ? 'Active in Builder' : 'Open on Bot Builder'}
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
