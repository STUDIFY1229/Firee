import { TickData } from '../types';

type TickCallback = (tick: TickData, ticksHistory: TickData[]) => void;
type ConnectionCallback = (status: 'connected' | 'disconnected' | 'simulated') => void;

class DerivWebSocketService {
  private ws: WebSocket | null = null;
  private currentSymbol = 'R_100';
  private tickListeners: Set<TickCallback> = new Set();
  private connectionListeners: Set<ConnectionCallback> = new Set();
  private ticksHistory: TickData[] = [];
  private isConnected = false;
  private isSimulated = false;
  private simulationInterval: number | null = null;
  private reconnectTimer: number | null = null;

  constructor() {
    this.initWebSocket();
  }

  public subscribeTicks(symbol: string, callback: TickCallback) {
    this.tickListeners.add(callback);
    if (this.currentSymbol !== symbol) {
      this.currentSymbol = symbol;
      this.switchMarket(symbol);
    } else {
      // Send current state immediately
      if (this.ticksHistory.length > 0) {
        callback(this.ticksHistory[this.ticksHistory.length - 1], this.ticksHistory);
      }
    }

    return () => {
      this.tickListeners.delete(callback);
    };
  }

  public onConnectionChange(callback: ConnectionCallback) {
    this.connectionListeners.add(callback);
    callback(this.isSimulated ? 'simulated' : this.isConnected ? 'connected' : 'disconnected');
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  public switchMarket(symbol: string) {
    this.currentSymbol = symbol;
    this.ticksHistory = [];

    if (this.ws && this.ws.readyState === WebSocket.OPEN && !this.isSimulated) {
      try {
        // Forget previous tick subscription and subscribe new symbol with 1000 historical ticks
        this.ws.send(JSON.stringify({ forget_all: 'ticks' }));
        this.ws.send(
          JSON.stringify({
            ticks_history: symbol,
            end: 'latest',
            count: 1000,
            style: 'ticks',
            subscribe: 1,
          })
        );
      } catch (err) {
        console.error('Error switching market on WS:', err);
        this.startSimulation(symbol);
      }
    } else {
      this.startSimulation(symbol);
    }
  }

  public getHistory(): TickData[] {
    return this.ticksHistory;
  }

  public getLatestTick(): TickData | null {
    return this.ticksHistory.length > 0 ? this.ticksHistory[this.ticksHistory.length - 1] : null;
  }

  private initWebSocket() {
    if (typeof window === 'undefined') return;

    try {
      this.ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isSimulated = false;
        this.stopSimulation();
        this.notifyConnection('connected');

        // Request 1000 ticks history and live subscription for current symbol
        this.ws?.send(
          JSON.stringify({
            ticks_history: this.currentSymbol,
            end: 'latest',
            count: 1000,
            style: 'ticks',
            subscribe: 1,
          })
        );
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.msg_type === 'history') {
            const history = data.history;
            if (history && Array.isArray(history.prices)) {
              this.ticksHistory = history.prices.map((p: number, index: number) => {
                const epoch = history.times ? history.times[index] : Date.now() / 1000;
                const lastDigit = this.extractLastDigit(p);
                return { epoch, quote: p, lastDigit };
              });

              if (this.ticksHistory.length > 0) {
                const latest = this.ticksHistory[this.ticksHistory.length - 1];
                this.notifyTick(latest);
              }
            }
          } else if (data.msg_type === 'tick') {
            const tick = data.tick;
            if (tick && tick.symbol === this.currentSymbol) {
              const quote = tick.quote;
              const lastDigit = this.extractLastDigit(quote);
              const newTick: TickData = {
                epoch: tick.epoch || Date.now() / 1000,
                quote,
                lastDigit,
              };

              this.ticksHistory.push(newTick);
              if (this.ticksHistory.length > 1000) {
                this.ticksHistory.shift();
              }
              this.notifyTick(newTick);
            }
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Deriv WS error, using live simulated generator:', err);
        this.startSimulation(this.currentSymbol);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnection('disconnected');
        this.startSimulation(this.currentSymbol);
        this.scheduleReconnect();
      };
    } catch (err) {
      console.warn('Could not initialize WebSocket, starting simulation:', err);
      this.startSimulation(this.currentSymbol);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      this.initWebSocket();
    }, 12000);
  }

  private startSimulation(symbol: string) {
    if (this.isSimulated && this.simulationInterval) return;

    this.isSimulated = true;
    this.notifyConnection('simulated');

    // Pre-populate with 1000 simulated ticks if empty or symbol changed
    if (this.ticksHistory.length < 100) {
      let basePrice = 500.0 + Math.random() * 2000;
      const now = Date.now() / 1000;
      const initialTicks: TickData[] = [];

      for (let i = 1000; i >= 0; i--) {
        const change = (Math.random() - 0.495) * 2.5;
        basePrice = Math.max(10, basePrice + change);
        const quote = parseFloat(basePrice.toFixed(2));
        const lastDigit = this.extractLastDigit(quote);
        initialTicks.push({
          epoch: now - i,
          quote,
          lastDigit,
        });
      }
      this.ticksHistory = initialTicks;
      this.notifyTick(initialTicks[initialTicks.length - 1]);
    }

    // Emit a new tick every 1000ms (or 600ms for 1s index)
    const isOneSecond = symbol.includes('1HZ');
    const intervalMs = isOneSecond ? 650 : 1000;

    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = window.setInterval(() => {
      const lastQuote = this.ticksHistory.length > 0 ? this.ticksHistory[this.ticksHistory.length - 1].quote : 1000;
      const change = (Math.random() - 0.495) * (isOneSecond ? 1.2 : 2.8);
      const newQuote = parseFloat((lastQuote + change).toFixed(2));
      const lastDigit = this.extractLastDigit(newQuote);

      const tick: TickData = {
        epoch: Date.now() / 1000,
        quote: newQuote,
        lastDigit,
      };

      this.ticksHistory.push(tick);
      if (this.ticksHistory.length > 1000) {
        this.ticksHistory.shift();
      }
      this.notifyTick(tick);
    }, intervalMs);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private extractLastDigit(price: number): number {
    const str = price.toFixed(2);
    const lastChar = str.charAt(str.length - 1);
    const digit = parseInt(lastChar, 10);
    return isNaN(digit) ? 0 : digit;
  }

  private notifyTick(tick: TickData) {
    this.tickListeners.forEach((cb) => cb(tick, this.ticksHistory));
  }

  private notifyConnection(status: 'connected' | 'disconnected' | 'simulated') {
    this.connectionListeners.forEach((cb) => cb(status));
  }
}

export const derivWsService = new DerivWebSocketService();

// Web Audio sound synthesizer for sound notifications (won/lost/trade)
export function playSoundNotification(type: 'win' | 'loss' | 'tick' | 'trade') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.2); // D6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'loss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.setValueAtTime(220, now + 0.15); // A3
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'trade') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}
