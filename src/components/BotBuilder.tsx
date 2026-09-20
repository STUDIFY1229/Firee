import React, { useState, useEffect } from 'react';
import { BotStrategy, TradeContract, JournalLog } from '../types';
import { ALL_MARKETS } from '../data/markets';
import { FREE_BOTS } from '../data/freeBots';
import {
  Play,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderOpen,
  Save,
  Trash2,
  Code,
  Sliders,
  ChevronRight,
  Layers,
  Sparkles,
  HelpCircle,
  Settings,
  Check,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
  History,
  Terminal,
  ChevronDown
} from 'lucide-react';

interface BotBuilderProps {
  activeStrategy: BotStrategy;
  onUpdateStrategy: (updated: BotStrategy) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  contracts: TradeContract[];
  totalProfit: number;
  winCount: number;
  lossCount: number;
  journalLogs?: JournalLog[];
  onSelectStrategy?: (strategy: BotStrategy) => void;
}

export const BotBuilder: React.FC<BotBuilderProps> = ({
  activeStrategy,
  onUpdateStrategy,
  isRunning,
  onToggleRun,
  contracts,
  totalProfit,
  winCount,
  lossCount,
  journalLogs = [],
  onSelectStrategy,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<'trade-params' | 'strategy-vars' | 'tick-conditions' | 'recovery-rules'>('trade-params');

  // Editable parameters
  const [baseStake, setBaseStake] = useState<number>(activeStrategy.recommendedStake);
  const [martingale, setMartingale] = useState<number>(activeStrategy.martingaleMultiplier);
  const [takeProfit, setTakeProfit] = useState<number>(activeStrategy.takeProfit);
  const [stopLoss, setStopLoss] = useState<number>(activeStrategy.stopLoss);
  const [selectedMarket, setSelectedMarket] = useState<string>(activeStrategy.market);
  const [predictionDigit, setPredictionDigit] = useState<number>(
    activeStrategy.id === 'digit-over-under-sniper' ? 3 :
    activeStrategy.id === 'adaptive-over-under-regime' ? 2 :
    activeStrategy.id === 'digit-differs-repeat-hunter' ? 5 : 4
  );

  // Keep local inputs synchronized if active strategy changes
  useEffect(() => {
    setBaseStake(activeStrategy.recommendedStake);
    setMartingale(activeStrategy.martingaleMultiplier);
    setTakeProfit(activeStrategy.takeProfit);
    setStopLoss(activeStrategy.stopLoss);
    setSelectedMarket(activeStrategy.market);
  }, [activeStrategy.id]);

  const handleApplyParams = () => {
    onUpdateStrategy({
      ...activeStrategy,
      recommendedStake: baseStake,
      martingaleMultiplier: martingale,
      takeProfit,
      stopLoss,
      market: selectedMarket,
      marketDisplayName: ALL_MARKETS.find((m) => m.symbol === selectedMarket)?.displayName || selectedMarket,
    });
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') setZoomLevel((prev) => Math.min(prev + 0.1, 1.4));
    else if (direction === 'out') setZoomLevel((prev) => Math.max(prev - 0.1, 0.7));
    else setZoomLevel(1);
  };


  const toolboxCategories = [
    { id: 'trade-params', label: '1. Trade Setup', icon: Settings, color: 'text-blue-600', blockId: 'trade_def' },
    { id: 'strategy-vars', label: '2. Strategy Variables', icon: Sliders, color: 'text-indigo-600', blockId: 'init_vars' },
    { id: 'tick-conditions', label: '3. Watch & Entry Logic', icon: Layers, color: 'text-emerald-600', blockId: 'before_purchase' },
    { id: 'recovery-rules', label: '4. Restart & Recovery', icon: RotateCcw, color: 'text-amber-600', blockId: 'after_purchase' },
  ];

  return (
    <div className="py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-4 animate-fadeIn">
      {/* Builder Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Strategy Selector Dropdown */}
              <select
                value={activeStrategy.id}
                onChange={(e) => {
                  const targetBot = FREE_BOTS.find((b) => b.id === e.target.value);
                  if (targetBot && onSelectStrategy) {
                    onSelectStrategy(targetBot);
                  } else if (targetBot) {
                    onUpdateStrategy(targetBot);
                  }
                }}
                className="font-bold text-sm sm:text-base text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
                title="Switch Active Strategy"
              >
                {FREE_BOTS.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>

              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                {activeStrategy.contractType}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Market: <strong className="text-slate-800">{activeStrategy.marketDisplayName}</strong>
            </span>
          </div>
        </div>

        {/* Center / Right Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom controls */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/70">
            <button
              onClick={() => handleZoom('in')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className="px-2 py-1 text-xs font-mono font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>


          {/* Quick Run button */}
          <button
            onClick={onToggleRun}
            id="btn-bot-builder-run"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 ring-2 ring-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Execution</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run This Bot</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Interactive Stages Toolbox & Configurator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Stage Selector Tabs */}
          <div className="rounded-3xl p-4 bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Blockly Stages & Inspector
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {toolboxCategories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : cat.color}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Parameters Card based on selected stage */}
          <div className="rounded-3xl p-5 bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {activeCategory === 'trade-params' && 'Stage 1: Trade Setup'}
                  {activeCategory === 'strategy-vars' && 'Stage 2: Strategy Variables'}
                  {activeCategory === 'tick-conditions' && 'Stage 3: Watch & Entry Rules'}
                  {activeCategory === 'recovery-rules' && 'Stage 4: Restart & Recovery'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Interactive
              </span>
            </div>

            {/* STAGE 1 CONTENT */}
            {activeCategory === 'trade-params' && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Trading Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {ALL_MARKETS.map((m) => (
                      <option key={m.symbol} value={m.symbol}>
                        {m.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Trade Type</span>
                    <span className="font-bold text-slate-800">{activeStrategy.tradeType}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Contract</span>
                    <span className="font-bold text-blue-700">{activeStrategy.contractType}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
                  <p className="leading-relaxed">
                    <strong>Deriv Rule:</strong> Restart trading is enabled by default to ensure continuous tick monitoring without interruption.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 2 CONTENT */}
            {activeCategory === 'strategy-vars' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Base Stake ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.35"
                      value={baseStake}
                      onChange={(e) => setBaseStake(parseFloat(e.target.value) || 0.35)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Martingale (x)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={martingale}
                      onChange={(e) => setMartingale(parseFloat(e.target.value) || 2)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Take Profit ($)</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 10)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-emerald-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Stop Loss ($)</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(parseFloat(e.target.value) || 10)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-rose-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3 CONTENT */}
            {activeCategory === 'tick-conditions' && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prediction Barrier / Target Digit</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPredictionDigit(num)}
                        className={`py-1.5 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all ${
                          predictionDigit === num
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                  <p><strong>Trigger Condition:</strong> {activeStrategy.features[0] || 'Evaluates real-time digit match'}</p>
                  <p><strong>Secondary Filter:</strong> {activeStrategy.features[1] || 'Adaptive 100-tick regime detection'}</p>
                </div>
              </div>
            )}

            {/* STAGE 4 CONTENT */}
            {activeCategory === 'recovery-rules' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    On Win:
                  </p>
                  <p>Reset stake to base ${baseStake.toFixed(2)} USD, reset recovery counters, and trade again.</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    On Loss:
                  </p>
                  <p>
                    Multiply stake by {martingale}x ({activeStrategy.recoveryType}), engage dynamic barrier recovery.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleApplyParams}
              id="btn-apply-strategy-params"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply to Workspace</span>
            </button>
          </div>

          {/* Execution Real-time Metrics Card */}
          <div className="rounded-3xl p-5 bg-white/90 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Live Run Statistics</span>
              {isRunning && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Bot Running
                </span>
              )}
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Net P&L</span>
                <span
                  className={`text-base font-black font-mono ${
                    totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {totalProfit >= 0 ? `+$${totalProfit.toFixed(2)}` : `-$${Math.abs(totalProfit).toFixed(2)}`}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Won / Lost</span>
                <span className="text-base font-black font-mono text-slate-800">
                  <span className="text-emerald-600">{winCount}</span> / <span className="text-rose-600">{lossCount}</span>
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Win Rate</span>
                <span className="text-base font-black font-mono text-blue-600">
                  {winCount + lossCount > 0
                    ? `${Math.round((winCount / (winCount + lossCount)) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Workspace Blocks Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl p-6 bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 min-h-[560px] relative overflow-hidden flex flex-col justify-between animate-fadeIn">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Block Stack Container with Scaling */}
            <div
              className="relative z-10 transition-transform origin-top-left space-y-4"
              style={{ transform: `scale(${zoomLevel})` }}
            >
                {/* BLOCK 1: Trade Definition Root Block */}
                <div
                  onClick={() => setActiveCategory('trade-params')}
                  className={`rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 shadow-md border-t-4 border-blue-400 max-w-xl cursor-pointer hover:shadow-xl transition-all ${
                    activeCategory === 'trade-params' ? 'ring-2 ring-blue-300 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-500/50 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-300" />
                      <span className="font-extrabold text-sm tracking-wide">1. TRADE DEFINITION</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-900/50 px-2 py-0.5 rounded-md text-blue-200">
                      id="trade_def"
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono bg-blue-950/40 p-3 rounded-xl border border-blue-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Market:</span>
                      <span className="font-bold text-white bg-blue-600/60 px-2 py-0.5 rounded">
                        {activeStrategy.market} ({activeStrategy.marketDisplayName})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Trade Type:</span>
                      <span className="font-bold text-white bg-blue-600/60 px-2 py-0.5 rounded">
                        {activeStrategy.tradeType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Contract Type:</span>
                      <span className="font-bold text-amber-300 bg-blue-600/60 px-2 py-0.5 rounded">
                        {activeStrategy.contractType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Restart on Error:</span>
                      <span className="text-emerald-400 font-bold">TRUE</span>
                    </div>
                  </div>
                </div>

                {/* BLOCK 2: Initialization / Parameters Block */}
                <div
                  onClick={() => setActiveCategory('strategy-vars')}
                  className={`rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 shadow-md border-t-4 border-indigo-400 max-w-xl ml-4 sm:ml-6 cursor-pointer hover:shadow-xl transition-all ${
                    activeCategory === 'strategy-vars' ? 'ring-2 ring-indigo-300 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-500/50 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-300" />
                      <span className="font-extrabold text-sm tracking-wide">2. STRATEGY VARIABLES & INITIALIZATION</span>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-900/50 px-2 py-0.5 rounded-md text-indigo-200">
                      id="init_vars"
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-indigo-950/40 p-3 rounded-xl border border-indigo-400/20">
                    <div>
                      <span className="text-indigo-200 block text-[10px]">Base Stake:</span>
                      <span className="text-emerald-300 font-bold text-sm">${baseStake.toFixed(2)} USD</span>
                    </div>
                    <div>
                      <span className="text-indigo-200 block text-[10px]">Martingale Multiplier:</span>
                      <span className="text-amber-300 font-bold text-sm">{martingale}x</span>
                    </div>
                    <div>
                      <span className="text-indigo-200 block text-[10px]">Take Profit Limit:</span>
                      <span className="text-emerald-300 font-bold text-sm">${takeProfit.toFixed(2)} USD</span>
                    </div>
                    <div>
                      <span className="text-indigo-200 block text-[10px]">Stop Loss Threshold:</span>
                      <span className="text-rose-300 font-bold text-sm">${stopLoss.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* BLOCK 3: Watch / Tick Analysis Block */}
                <div
                  onClick={() => setActiveCategory('tick-conditions')}
                  className={`rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-4 shadow-md border-t-4 border-emerald-400 max-w-xl ml-8 sm:ml-12 cursor-pointer hover:shadow-xl transition-all ${
                    activeCategory === 'tick-conditions' ? 'ring-2 ring-emerald-300 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/50 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-300" />
                      <span className="font-extrabold text-sm tracking-wide">3. WATCH / TICK SCANNING & ENTRY</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-900/50 px-2 py-0.5 rounded-md text-emerald-200">
                      id="before_purchase"
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono bg-emerald-950/40 p-3 rounded-xl border border-emerald-400/20">
                    <p className="text-emerald-100 font-sans leading-relaxed">
                      <strong>Entry Trigger:</strong> {activeStrategy.features[0] || 'Scans last tick digit conditions'}
                    </p>
                    <p className="text-emerald-200 font-sans text-[11px]">
                      <strong>Recovery Mechanism:</strong> {activeStrategy.recoveryType}
                    </p>
                  </div>
                </div>

                {/* BLOCK 4: After Purchase / Results & Trade Again Block */}
                <div
                  onClick={() => setActiveCategory('recovery-rules')}
                  className={`rounded-2xl bg-gradient-to-r from-amber-700 to-orange-700 text-white p-4 shadow-md border-t-4 border-amber-400 max-w-xl ml-12 sm:ml-16 cursor-pointer hover:shadow-xl transition-all ${
                    activeCategory === 'recovery-rules' ? 'ring-2 ring-amber-300 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/50 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-300" />
                      <span className="font-extrabold text-sm tracking-wide">4. AFTER PURCHASE: RESULT HANDLER</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-900/50 px-2 py-0.5 rounded-md text-amber-200">
                      id="after_purchase"
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono bg-amber-950/40 p-3 rounded-xl border border-amber-400/20">
                    <div className="text-amber-100 font-sans">
                      • <strong>On Win:</strong> Reset Stake to ${baseStake.toFixed(2)}, Reset recovery flag, notify & Trade Again
                    </div>
                    <div className="text-amber-100 font-sans">
                      • <strong>On Loss:</strong> Multiply Stake by {martingale}x, switch to recovery mode & Trade Again
                    </div>
                    <div className="text-amber-100 font-sans">
                      • <strong>Limits:</strong> Stop when Total Profit &ge; ${takeProfit} or Total Loss &le; -${stopLoss}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Status bar */}
              <div className="relative z-10 pt-4 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>All strategy blocks validated and running directly in-app</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>Blocks: 4 Connected</span>
                  <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
