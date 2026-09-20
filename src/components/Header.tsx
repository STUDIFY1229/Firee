import React from 'react';
import {
  Bot,
  PieChart,
  LineChart,
  BookOpen,
  Zap,
  Play,
  Square,
  Activity,
  Volume2,
  VolumeX,
  Layers,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'bot-builder' | 'charts' | 'tutorials' | 'free-bots' | 'dcircles';
  setActiveTab: (tab: 'dashboard' | 'bot-builder' | 'charts' | 'tutorials' | 'free-bots' | 'dcircles') => void;
  isRunning: boolean;
  onToggleRun: () => void;
  balance: number;
  currency: string;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  connectionStatus: 'connected' | 'disconnected' | 'simulated';
  activeBotName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onToggleRun,
  balance,
  currency,
  isAudioEnabled,
  onToggleAudio,
  connectionStatus,
  activeBotName,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/60 shadow-xs shadow-slate-200/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
              id="header-logo-btn"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">DBot</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">PRO</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">Automated Trading</span>
              </div>
            </button>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 px-1 rounded-2xl bg-slate-100/80 p-1 border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              id="tab-btn-dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('bot-builder')}
              id="tab-btn-bot-builder"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bot-builder'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Bot Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              id="tab-btn-charts"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'charts'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('tutorials')}
              id="tab-btn-tutorials"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'tutorials'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tutorials</span>
            </button>

            {/* Next to tutorial tab: FREE BOT */}
            <button
              onClick={() => setActiveTab('free-bots')}
              id="tab-btn-free-bots"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'free-bots'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Free bot</span>
            </button>

            {/* Next to Free bots tab: DCIRCLES */}
            <button
              onClick={() => setActiveTab('dcircles')}
              id="tab-btn-dcircles"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'dcircles'
                  ? 'bg-white text-blue-600 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dcircles</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              id="btn-toggle-audio"
              title={isAudioEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Connection Status */}
            <div
              id="connection-status-indicator"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border border-slate-200/80 bg-white/60"
              title={
                connectionStatus === 'connected'
                  ? 'Connected to Deriv Live WebSocket'
                  : connectionStatus === 'simulated'
                  ? 'Live Simulated Tick Stream Engine Active'
                  : 'Reconnecting...'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : connectionStatus === 'simulated'
                    ? 'bg-blue-500'
                    : 'bg-amber-500 animate-ping'
                }`}
              />
              <span className="text-slate-600">
                {connectionStatus === 'connected' ? 'Deriv WS' : connectionStatus === 'simulated' ? 'Live Stream' : 'Connecting'}
              </span>
            </div>

            {/* Demo Balance Display */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                $
              </div>
              <div className="text-right leading-tight">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Demo Account</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                  {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            {/* Quick Run / Stop Bot button */}
            <button
              onClick={onToggleRun}
              id="header-run-stop-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25 ring-2 ring-rose-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Bot</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
