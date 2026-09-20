import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { FreeBots } from './components/FreeBots';
import { Dcircles } from './components/Dcircles';
import { BotBuilder } from './components/BotBuilder';
import { TradingChart } from './components/TradingChart';
import { Dashboard } from './components/Dashboard';
import { Tutorials } from './components/Tutorials';
import { FREE_BOTS } from './data/freeBots';
import { ALL_MARKETS } from './data/markets';
import { BotStrategy, TradeContract, JournalLog, TickData } from './types';
import { derivWsService, playSoundNotification } from './services/derivWs';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bot-builder' | 'charts' | 'tutorials' | 'free-bots' | 'dcircles'>('dashboard');
  const [activeStrategy, setActiveStrategy] = useState<BotStrategy>(FREE_BOTS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(10000.0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [winCount, setWinCount] = useState<number>(0);
  const [lossCount, setLossCount] = useState<number>(0);
  const [currentStake, setCurrentStake] = useState<number>(FREE_BOTS[0].recommendedStake);
  const [isRecoveryActive, setIsRecoveryActive] = useState<boolean>(false);
  const [contracts, setContracts] = useState<TradeContract[]>([]);
  const [journalLogs, setJournalLogs] = useState<JournalLog[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'simulated'>('connected');

  // Execution engine state refs
  const pendingTradeRef = useRef<{
    active: boolean;
    stake: number;
    prediction: number;
    contractType: string;
    tradeType: string;
    reference: string;
    entryDigit: number;
  } | null>(null);

  const consecutiveStreakRef = useRef<{ digit: number; streak: number }>({ digit: -1, streak: 0 });

  // Update current stake when strategy changes
  useEffect(() => {
    setCurrentStake(activeStrategy.recommendedStake);
    setIsRecoveryActive(false);
  }, [activeStrategy]);

  // Track WS Connection Status
  useEffect(() => {
    const unsub = derivWsService.onConnectionChange((status) => {
      setConnectionStatus(status);
    });
    return () => unsub();
  }, []);

  // Helper log function
  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const newLog: JournalLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: timeStr,
      type,
      message,
    };
    setJournalLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Bot Trading Execution Engine
  useEffect(() => {
    if (!isRunning) {
      pendingTradeRef.current = null;
      return;
    }

    addLog(`BOT STARTED | ${activeStrategy.name} on ${activeStrategy.market}`, 'info');

    const unsubscribe = derivWsService.subscribeTicks(activeStrategy.market, (tick, history) => {
      if (!isRunning) return;

      const digit = tick.lastDigit;

      // 1. If there's an open trade awaiting evaluation on this tick:
      if (pendingTradeRef.current && pendingTradeRef.current.active) {
        const trade = pendingTradeRef.current;
        pendingTradeRef.current = null; // consume trade

        let isWin = false;
        let payout = 0;
        let profit = 0;

        if (trade.contractType === 'DIGITOVER') {
          // Win if digit is greater than prediction
          isWin = digit > trade.prediction;
          payout = isWin ? trade.stake * 1.45 : 0;
        } else if (trade.contractType === 'DIGITUNDER') {
          isWin = digit < trade.prediction;
          payout = isWin ? trade.stake * 1.45 : 0;
        } else if (trade.contractType === 'DIGITDIFF') {
          // Win if digit differs from prediction
          isWin = digit !== trade.prediction;
          payout = isWin ? trade.stake * 1.098 : 0;
        } else {
          // Default Over 4 / Under 5 or random
          isWin = Math.random() > 0.45;
          payout = isWin ? trade.stake * 1.95 : 0;
        }

        profit = isWin ? payout - trade.stake : -trade.stake;

        // Sound notification
        if (isAudioEnabled) {
          playSoundNotification(isWin ? 'win' : 'loss');
        }

        // Record contract
        const newContract: TradeContract = {
          id: `CNT-${Date.now()}`,
          reference: trade.reference,
          timestamp: new Date().toLocaleTimeString(),
          market: activeStrategy.market,
          tradeType: trade.contractType,
          stake: trade.stake,
          payout: parseFloat(payout.toFixed(2)),
          profit: parseFloat(profit.toFixed(2)),
          status: isWin ? 'won' : 'lost',
          barrier: trade.prediction,
          exitDigit: digit,
        };

        setContracts((prev) => [newContract, ...prev]);

        // Update financial states
        setBalance((prev) => parseFloat((prev + profit).toFixed(2)));
        setTotalProfit((prev) => {
          const nextProfit = parseFloat((prev + profit).toFixed(2));

          // Check Take Profit or Stop Loss
          if (nextProfit >= activeStrategy.takeProfit) {
            addLog(`TAKE PROFIT REACHED (+$${nextProfit.toFixed(2)} >= $${activeStrategy.takeProfit}). Stopping Bot.`, 'success');
            setIsRunning(false);
          } else if (nextProfit <= -activeStrategy.stopLoss) {
            addLog(`STOP LOSS REACHED (-$${Math.abs(nextProfit).toFixed(2)} <= -$${activeStrategy.stopLoss}). Stopping Bot.`, 'error');
            setIsRunning(false);
          }
          return nextProfit;
        });

        if (isWin) {
          setWinCount((prev) => prev + 1);
          addLog(`RESULT: WIN (Exit Digit: ${digit}) | Profit: +$${profit.toFixed(2)}. Resetting to Base Stake.`, 'success');
          setCurrentStake(activeStrategy.recommendedStake);
          setIsRecoveryActive(false);
        } else {
          setLossCount((prev) => prev + 1);
          const nextStake = parseFloat((trade.stake * activeStrategy.martingaleMultiplier).toFixed(2));
          setCurrentStake(nextStake);
          setIsRecoveryActive(true);
          addLog(`RESULT: LOSS (Exit Digit: ${digit}) | Loss: -$${trade.stake.toFixed(2)}. Martingale applied -> Next Stake: $${nextStake.toFixed(2)}.`, 'warn');
        }

        return;
      }

      // 2. Evaluate Strategy Entry Signal
      const botId = activeStrategy.id;
      let shouldEnter = false;
      let contractTypeToBuy = 'DIGITOVER';
      let predictionToUse = 3;

      if (botId === 'free-bot-1') {
        // Digit Over/Under Sniper: entry when digit == 5
        addLog(`SCANNING | Current Digit: ${digit} (Target Entry: 5)`, 'info');
        if (digit === 5) {
          shouldEnter = true;
          contractTypeToBuy = 'DIGITOVER';
          predictionToUse = isRecoveryActive ? 3 : 3;
        }
      } else if (botId === 'free-bot-2') {
        // Adaptive 100-Tick Regime: Over/Under based on recent 20-tick count
        const last20 = history.slice(-20);
        const overCount = last20.filter((t) => t.lastDigit > 2).length;
        const underCount = last20.filter((t) => t.lastDigit < 2).length;

        if (overCount >= 12) {
          shouldEnter = true;
          contractTypeToBuy = 'DIGITOVER';
          predictionToUse = 2;
        } else if (underCount >= 12) {
          shouldEnter = true;
          contractTypeToBuy = 'DIGITUNDER';
          predictionToUse = 2;
        } else {
          addLog(`TICK ${history.length} | Digit: ${digit} | O20: ${overCount}/20, U20: ${underCount}/20 - Waiting for Regime`, 'info');
        }
      } else if (botId === 'free-bot-3') {
        // Dual Over/Under Consecutive Hunter
        const isLow = digit >= 0 && digit <= 2;
        const isHigh = digit >= 7 && digit <= 9;

        if (isLow) {
          shouldEnter = Math.random() > 0.4;
          contractTypeToBuy = 'DIGITOVER';
          predictionToUse = 2;
        } else if (isHigh) {
          shouldEnter = Math.random() > 0.4;
          contractTypeToBuy = 'DIGITUNDER';
          predictionToUse = 7;
        }
      } else if (botId === 'free-bot-4') {
        // Differs Repeat-Streak Hunter: Streak of 3
        const prev = consecutiveStreakRef.current;
        if (prev.digit === digit) {
          prev.streak += 1;
        } else {
          consecutiveStreakRef.current = { digit, streak: 1 };
        }

        addLog(`DIGIT DIFFERS | Digit: ${digit} | Current Repeat Streak: ${consecutiveStreakRef.current.streak}/3`, 'info');

        if (consecutiveStreakRef.current.streak >= 3) {
          shouldEnter = true;
          contractTypeToBuy = 'DIGITDIFF';
          predictionToUse = digit;
          consecutiveStreakRef.current.streak = 0; // reset
        }
      } else {
        // Default generic strategy trigger
        shouldEnter = Math.random() > 0.65;
        contractTypeToBuy = activeStrategy.contractType || 'DIGITOVER';
        predictionToUse = 4;
      }

      // 3. Execute Trade Order
      if (shouldEnter) {
        if (isAudioEnabled) playSoundNotification('trade');
        const refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

        addLog(`SIGNAL TRIGGERED! Purchasing ${contractTypeToBuy} (Barrier: ${predictionToUse}) with Stake $${currentStake.toFixed(2)}`, 'info');

        pendingTradeRef.current = {
          active: true,
          stake: currentStake,
          prediction: predictionToUse,
          contractType: contractTypeToBuy,
          tradeType: contractTypeToBuy,
          reference: refId,
          entryDigit: digit,
        };
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isRunning, activeStrategy, currentStake, isRecoveryActive, isAudioEnabled]);

  const handleToggleRun = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        addLog(`Bot started manually. Current Stake: $${currentStake.toFixed(2)}`, 'info');
      } else {
        addLog('Bot paused/stopped by user.', 'warn');
      }
      return next;
    });
  };

  // Select bot from Free Bot list
  const handleSelectFreeBot = (bot: BotStrategy, autoRun = false) => {
    setActiveStrategy(bot);
    setCurrentStake(bot.recommendedStake);
    setIsRecoveryActive(false);

    // Open on Bot Builder tab as explicitly requested!
    setActiveTab('bot-builder');

    addLog(`Strategy "${bot.name}" loaded into Bot Builder.`, 'info');

    if (autoRun) {
      setIsRunning(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f9] via-[#e8eff8] to-[#f4f7fc] text-slate-800 flex flex-col font-sans pb-10">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        balance={balance}
        currency="USD"
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        connectionStatus={connectionStatus}
        activeBotName={activeStrategy.name}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectBot={handleSelectFreeBot}
            balance={balance}
            totalProfit={totalProfit}
            winCount={winCount}
            lossCount={lossCount}
            isRunning={isRunning}
            contracts={contracts}
          />
        )}

        {activeTab === 'bot-builder' && (
          <BotBuilder
            activeStrategy={activeStrategy}
            onUpdateStrategy={(updated) => {
              setActiveStrategy(updated);
              setCurrentStake(updated.recommendedStake);
              addLog(`Strategy parameters updated for ${updated.name}`, 'info');
            }}
            isRunning={isRunning}
            onToggleRun={handleToggleRun}
            contracts={contracts}
            totalProfit={totalProfit}
            winCount={winCount}
            lossCount={lossCount}
            journalLogs={journalLogs}
            onSelectStrategy={handleSelectFreeBot}
          />
        )}

        {activeTab === 'charts' && (
          <TradingChart
            symbol={activeStrategy.market}
            onSelectSymbol={(sym) => {
              setActiveStrategy((prev) => ({
                ...prev,
                market: sym,
                marketDisplayName: ALL_MARKETS.find((m) => m.symbol === sym)?.displayName || sym,
              }));
            }}
          />
        )}

        {activeTab === 'tutorials' && <Tutorials />}

        {/* NEW TAB: FREE BOT */}
        {activeTab === 'free-bots' && (
          <FreeBots
            onSelectBot={handleSelectFreeBot}
            activeBotId={activeStrategy.id}
          />
        )}

        {/* NEW TAB: DCIRCLES (0-9 Digits 1000 Ticks Analyzer) */}
        {activeTab === 'dcircles' && <Dcircles />}
      </main>
    </div>
  );
}
