import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ALL_MARKETS } from '../data/markets';
import { TickData } from '../types';
import { derivWsService } from '../services/derivWs';
import {
  LineChart,
  CandlestickChart,
  Activity,
  Sliders,
  ChevronDown,
  Maximize2,
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react';

interface TradingChartProps {
  symbol?: string;
  onSelectSymbol?: (symbol: string) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol = 'R_100',
  onSelectSymbol,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbol);
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [currentTick, setCurrentTick] = useState<TickData | null>(null);
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsub = derivWsService.subscribeTicks(selectedSymbol, (tick, history) => {
      setCurrentTick(tick);
      setTicks(history.slice(-100)); // Last 100 ticks for chart
    });
    return () => unsub();
  }, [selectedSymbol]);

  const handleMarketChange = (newSym: string) => {
    setSelectedSymbol(newSym);
    derivWsService.switchMarket(newSym);
    if (onSelectSymbol) onSelectSymbol(newSym);
  };

  // Render HTML5 Canvas Chart for smooth high FPS performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ticks.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 380);

    ctx.clearRect(0, 0, width, height);

    const prices = ticks.map((t) => t.quote);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;

    const padding = { top: 30, bottom: 40, left: 20, right: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Background horizontal grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartH / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Price labels on right
      const priceAtY = maxPrice - (range / gridSteps) * i;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceAtY.toFixed(2), width - padding.right + 8, y + 3);
    }

    if (chartType === 'area') {
      // Area path
      const points = ticks.map((t, idx) => {
        const x = padding.left + (chartW / (ticks.length - 1)) * idx;
        const y = padding.top + chartH - ((t.quote - minPrice) / range) * chartH;
        return { x, y };
      });

      // Gradient Fill
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      const isUp = prices[prices.length - 1] >= prices[0];
      if (isUp) {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, height - padding.bottom);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line Stroke
      ctx.beginPath();
      points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = isUp ? '#10b981' : '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Moving average overlay line if enabled
      if (showIndicators && points.length > 10) {
        ctx.beginPath();
        const period = 10;
        for (let i = period - 1; i < points.length; i++) {
          let sum = 0;
          for (let j = 0; j < period; j++) {
            sum += points[i - j].y;
          }
          const maY = sum / period;
          if (i === period - 1) ctx.moveTo(points[i].x, maY);
          else ctx.lineTo(points[i].x, maY);
        }
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Latest price pulse dot
      const lastPoint = points[points.length - 1];
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = isUp ? '#10b981' : '#3b82f6';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Candlestick rendering (aggregated across tick buckets)
      const bucketSize = 4;
      const numBuckets = Math.floor(ticks.length / bucketSize);
      const candleW = (chartW / numBuckets) * 0.7;

      for (let b = 0; b < numBuckets; b++) {
        const bucketTicks = ticks.slice(b * bucketSize, (b + 1) * bucketSize);
        const open = bucketTicks[0].quote;
        const close = bucketTicks[bucketTicks.length - 1].quote;
        const high = Math.max(...bucketTicks.map((t) => t.quote));
        const low = Math.min(...bucketTicks.map((t) => t.quote));

        const x = padding.left + (chartW / numBuckets) * (b + 0.5);
        const yOpen = padding.top + chartH - ((open - minPrice) / range) * chartH;
        const yClose = padding.top + chartH - ((close - minPrice) / range) * chartH;
        const yHigh = padding.top + chartH - ((high - minPrice) / range) * chartH;
        const yLow = padding.top + chartH - ((low - minPrice) / range) * chartH;

        const isGreen = close >= open;
        const candleColor = isGreen ? '#10b981' : '#ef4444';

        // High-Low Wick
        ctx.strokeStyle = candleColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Candle Body
        ctx.fillStyle = candleColor;
        const topY = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yOpen - yClose));
        ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);
      }
    }
  }, [ticks, chartType, showIndicators]);

  const activeMarket = ALL_MARKETS.find((m) => m.symbol === selectedSymbol) || ALL_MARKETS[4];

  return (
    <div className="py-6 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Chart Card */}
      <div className="rounded-3xl p-6 bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedSymbol}
                onChange={(e) => handleMarketChange(e.target.value)}
                className="appearance-none bg-slate-100/80 hover:bg-slate-100 font-bold text-slate-800 text-sm rounded-xl pl-3.5 pr-9 py-2 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
              >
                {ALL_MARKETS.map((m) => (
                  <option key={m.symbol} value={m.symbol}>
                    {m.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-lg font-black text-slate-900">
                {currentTick ? currentTick.quote.toFixed(2) : '---'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                Digit: {currentTick?.lastDigit ?? '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 text-xs font-bold">
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartType === 'area' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Line / Area
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartType === 'candles' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Candlestick
              </button>
            </div>

            {/* Indicator Toggle */}
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showIndicators
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              SMA (10)
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full h-[380px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Live Tick Stream</span>
            </span>
            {showIndicators && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moving Average (SMA 10)</span>
              </span>
            )}
          </div>

          <div className="font-mono text-[11px]">
            <span>Ticks in view: {ticks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
