import React, { useState, useEffect, useMemo } from 'react';
import { ALL_MARKETS } from '../data/markets';
import { TickData } from '../types';
import { derivWsService } from '../services/derivWs';
import { ChevronDown } from 'lucide-react';

export const Dcircles: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('R_100');
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [currentTick, setCurrentTick] = useState<TickData | null>(null);
  const sampleTarget = 1000; // 1,000 ticks rolling buffer

  // Subscribe to live ticks
  useEffect(() => {
    const unsubscribe = derivWsService.subscribeTicks(selectedSymbol, (tick, history) => {
      setCurrentTick(tick);
      // Rolling 1000 ticks buffer
      setTicks(history.slice(-1000));
    });

    return () => {
      unsubscribe();
    };
  }, [selectedSymbol]);

  // Handle market change
  const handleMarketChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    derivWsService.switchMarket(symbol);
  };

  // Calculate digit frequency statistics over 1000 ticks
  const digitStats = useMemo(() => {
    const total = ticks.length || 1;
    const counts: number[] = Array(10).fill(0);

    ticks.forEach((t) => {
      if (t.lastDigit >= 0 && t.lastDigit <= 9) {
        counts[t.lastDigit]++;
      }
    });

    const stats = counts.map((count, digit) => ({
      digit,
      count,
      percentage: (count / total) * 100,
      rank: 'normal' as 'highest' | 'second-highest' | 'lowest' | 'second-lowest' | 'normal',
    }));

    // Sort to determine ranks
    const sortedIndices = [...stats.keys()].sort((a, b) => stats[b].count - stats[a].count);

    if (ticks.length > 0) {
      stats[sortedIndices[0]].rank = 'highest';
      stats[sortedIndices[1]].rank = 'second-highest';
      stats[sortedIndices[sortedIndices.length - 2]].rank = 'second-lowest';
      stats[sortedIndices[sortedIndices.length - 1]].rank = 'lowest';
    }

    return stats;
  }, [ticks]);

  // Even / Odd percentages
  const { evenPercentage, oddPercentage, evenCount, oddCount } = useMemo(() => {
    const total = ticks.length || 1;
    let evens = 0;
    let odds = 0;

    ticks.forEach((t) => {
      if (t.lastDigit % 2 === 0) evens++;
      else odds++;
    });

    return {
      evenCount: evens,
      oddCount: odds,
      evenPercentage: parseFloat(((evens / total) * 100).toFixed(2)),
      oddPercentage: parseFloat(((odds / total) * 100).toFixed(2)),
    };
  }, [ticks]);

  const currentDigit = currentTick?.lastDigit ?? (ticks.length > 0 ? ticks[ticks.length - 1].lastDigit : 0);

  // Styling for circles and bars:
  // Green = Most appearing
  // Blue = Second most appearing
  // Red = Least appearing
  // Yellow = Second least appearing
  // Moving cursor = halo glow on active tick
  const getCircleConfig = (item: (typeof digitStats)[0], isCursor: boolean) => {
    if (isCursor) {
      return {
        border: 'border-[2.5px] border-pink-500 ring-4 ring-pink-400/35 shadow-[0_0_24px_rgba(236,72,153,0.45)]',
        text: 'text-pink-600',
        barColor: 'bg-pink-500',
        hasHalo: true,
      };
    }

    switch (item.rank) {
      case 'highest':
        // Most appearing: Green
        return {
          border: 'border-[2.5px] border-emerald-500 shadow-sm shadow-emerald-500/10',
          text: 'text-emerald-600',
          barColor: 'bg-emerald-500',
          hasHalo: false,
        };
      case 'second-highest':
        // Second most appearing: Blue
        return {
          border: 'border-[2.5px] border-blue-500 shadow-sm shadow-blue-500/10',
          text: 'text-blue-600',
          barColor: 'bg-blue-500',
          hasHalo: false,
        };
      case 'second-lowest':
        // Second least appearing: Yellow
        return {
          border: 'border-[2.5px] border-amber-400 shadow-sm shadow-amber-500/10',
          text: 'text-amber-600',
          barColor: 'bg-amber-400',
          hasHalo: false,
        };
      case 'lowest':
        // Least appearing: Red
        return {
          border: 'border-[2.5px] border-rose-500 shadow-sm shadow-rose-500/10',
          text: 'text-rose-600',
          barColor: 'bg-rose-500',
          hasHalo: false,
        };
      default:
        // Normal
        return {
          border: 'border-[2px] border-slate-200/90 shadow-sm',
          text: 'text-slate-900',
          barColor: 'bg-slate-200',
          hasHalo: false,
        };
    }
  };

  return (
    <div className="py-6 px-3 sm:px-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* 0 TO 9 CIRCLES DIGITS (1000 TICKS) */}
      <div className="rounded-3xl p-6 sm:p-10 bg-white/95 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Digits 0–9
          </h1>
          <span className="text-xs sm:text-sm font-medium text-slate-400">
            Live • latest {sampleTarget.toLocaleString()} ticks
          </span>
        </div>

        {/* 10 Circles: Row 1 = 0..4, Row 2 = 5..9 */}
        <div className="grid grid-cols-5 gap-3 sm:gap-6 md:gap-8 justify-items-center max-w-3xl mx-auto">
          {digitStats.map((item) => {
            const isCursor = currentDigit === item.digit;
            const config = getCircleConfig(item, isCursor);

            return (
              <div
                key={item.digit}
                id={`circle-digit-${item.digit}`}
                className="relative w-full max-w-[110px] sm:max-w-[135px] md:max-w-[150px] aspect-square flex items-center justify-center"
              >
                {/* Moving Cursor Halo */}
                {config.hasHalo && (
                  <div className="absolute inset-0 rounded-full bg-pink-400/25 blur-md -z-10 animate-pulse pointer-events-none" />
                )}

                {/* Circle Container */}
                <div
                  className={`w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2 transition-all duration-200 ${config.border}`}
                >
                  {/* Digit Number */}
                  <span className={`text-2xl sm:text-3xl md:text-4xl font-extrabold leading-none ${config.text}`}>
                    {item.digit}
                  </span>

                  {/* Percentage */}
                  <span className="text-xs sm:text-sm font-semibold font-mono text-slate-700 mt-1">
                    {item.percentage.toFixed(2)}%
                  </span>

                  {/* Color bar representing rank */}
                  <div className={`w-6 sm:w-8 h-1 rounded-full mt-1.5 ${config.barColor}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
            <span>Green: Most appearing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-blue-500" />
            <span>Blue: Second most appearing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-amber-400" />
            <span>Yellow: Second least appearing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-rose-500" />
            <span>Red: Least appearing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-pink-300" />
            <span>Moving cursor</span>
          </div>
        </div>
      </div>

      {/* BELOW DIGITS: EVEN / ODD PERCENTAGES */}
      <div className="rounded-3xl p-6 bg-white/95 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">
            Even / Odd Percentages
          </h2>
          <span className="text-xs font-mono font-medium text-slate-400">
            Based on {sampleTarget} ticks
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          {/* Even */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100">
            <span className="text-xs uppercase font-bold text-blue-700 block">Even</span>
            <span className="text-3xl font-black font-mono text-blue-900 mt-1 block">
              {evenPercentage.toFixed(2)}%
            </span>
            <span className="text-xs font-medium text-blue-600 mt-0.5 block">
              {evenCount} / {ticks.length || 1000} ticks
            </span>
          </div>

          {/* Odd */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100">
            <span className="text-xs uppercase font-bold text-indigo-700 block">Odd</span>
            <span className="text-3xl font-black font-mono text-indigo-900 mt-1 block">
              {oddPercentage.toFixed(2)}%
            </span>
            <span className="text-xs font-medium text-indigo-600 mt-0.5 block">
              {oddCount} / {ticks.length || 1000} ticks
            </span>
          </div>
        </div>

        {/* Visual percentage distribution bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${evenPercentage}%` }}
            />
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${oddPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* MARKET CHOOSER: ALL VOLATILITIES, JUMP, AND STEP INDEX */}
      <div className="rounded-3xl p-6 bg-white/95 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 space-y-3">
        <label htmlFor="dcircles-market-select" className="text-sm font-extrabold text-slate-900 block">
          Choose Market (All Volatilities, Jump, and Step Index)
        </label>

        <div className="relative">
          <select
            id="dcircles-market-select"
            value={selectedSymbol}
            onChange={(e) => handleMarketChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-900 text-sm rounded-2xl pl-4 pr-10 py-3 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
          >
            {/* Volatilities */}
            <optgroup label="Volatility Indices">
              {ALL_MARKETS.filter((m) => m.category === 'Volatility').map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.displayName} ({m.symbol})
                </option>
              ))}
            </optgroup>

            {/* 1s Volatilities */}
            <optgroup label="Volatility Indices (1s)">
              {ALL_MARKETS.filter((m) => m.category === 'Volatility (1s)').map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.displayName} ({m.symbol})
                </option>
              ))}
            </optgroup>

            {/* Jump Indices */}
            <optgroup label="Jump Indices">
              {ALL_MARKETS.filter((m) => m.category === 'Jump').map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.displayName} ({m.symbol})
                </option>
              ))}
            </optgroup>

            {/* Step Indices */}
            <optgroup label="Step Indices">
              {ALL_MARKETS.filter((m) => m.category === 'Step').map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.displayName} ({m.symbol})
                </option>
              ))}
            </optgroup>
          </select>

          <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
