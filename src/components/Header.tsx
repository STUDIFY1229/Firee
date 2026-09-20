import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  PieChart,
  LineChart,
  BookOpen,
  Zap,
  Play,
  Square,
  Volume2,
  VolumeX,
  Layers,
  ChevronDown,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Settings,
  X,
  Key,
  ExternalLink,
  Check
} from 'lucide-react';
import { DerivAuthUser, DerivAccount } from '../types';

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
  authUser: DerivAuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
  onSwitchAccount: (account: DerivAccount) => void;
  onSetManualToken: (token: string) => void;
  appId: string;
  onUpdateAppId: (appId: string) => void;
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
  authUser,
  onLogin,
  onLogout,
  onSwitchAccount,
  onSetManualToken,
  appId,
  onUpdateAppId,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [tempAppId, setTempAppId] = useState(appId);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveAppId = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAppId.trim()) {
      onUpdateAppId(tempAppId.trim());
      setIsSettingsModalOpen(false);
    }
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTokenInput.trim()) {
      onSetManualToken(manualTokenInput.trim());
      setManualTokenInput('');
      setIsSettingsModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-white/60 shadow-xs shadow-slate-200/50">
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
                <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">Deriv Third-Party Platform</span>
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
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              id="btn-toggle-audio"
              title={isAudioEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Deriv Connection Indicator */}
            <div
              id="connection-status-indicator"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border border-slate-200/80 bg-white/60"
              title={
                connectionStatus === 'connected'
                  ? `Connected to Deriv Live WebSocket (App ID: ${appId})`
                  : connectionStatus === 'simulated'
                  ? 'Simulated Tick Stream Active'
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
              <span className="text-slate-600 font-mono text-[11px]">
                {connectionStatus === 'connected' ? 'Deriv WS' : connectionStatus === 'simulated' ? 'Live Stream' : 'Connecting'}
              </span>
            </div>

            {/* DERIV OAUTH AUTHENTICATION SECTION */}
            {authUser ? (
              /* Authenticated User Pill + Dropdown */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  id="deriv-account-pill-btn"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                    authUser.isVirtual
                      ? 'bg-sky-100 text-sky-700 border border-sky-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {authUser.isVirtual ? 'Demo' : 'Real'}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-[11px] font-bold text-slate-700 block font-mono">
                      {authUser.loginid}
                    </span>
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Account Switcher Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/70 p-3 z-50 animate-fadeIn space-y-3">
                    <div className="border-b border-slate-100 pb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deriv Account</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Authenticated
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900 font-mono flex items-center justify-between">
                        <span>{authUser.loginid}</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {authUser.isVirtual ? 'Virtual' : 'Real'}
                        </span>
                      </div>
                      {authUser.email && (
                        <span className="text-xs text-slate-500 block truncate">{authUser.email}</span>
                      )}
                    </div>

                    {/* Linked Deriv Accounts to Switch */}
                    {authUser.accounts && authUser.accounts.length > 1 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Switch Account</span>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {authUser.accounts.map((acct) => (
                            <button
                              key={acct.account}
                              onClick={() => {
                                onSwitchAccount(acct);
                                setIsAccountMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                                acct.account === authUser.loginid
                                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  acct.isVirtual ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {acct.isVirtual ? 'DEMO' : 'REAL'}
                                </span>
                                <span>{acct.account}</span>
                              </div>
                              {acct.account === authUser.loginid && (
                                <Check className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Deriv API & App ID Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        id="btn-deriv-logout"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log out from Deriv</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated: Prominent "Login with Deriv" OAuth Button */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onLogin}
                  id="btn-deriv-oauth-login"
                  title={`Login via Deriv OAuth (App ID: ${appId})`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#ff444f] hover:bg-[#e03a44] text-white shadow-md shadow-[#ff444f]/25 transition-all cursor-pointer group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Login with Deriv</span>
                </button>

                {/* Settings / API Key Button */}
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  id="btn-open-deriv-settings"
                  title="Configure Deriv App ID or API Token"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}

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

      {/* MODAL: Deriv OAuth App ID & API Configuration */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-[#ff444f] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deriv Authentication Setup</h3>
                  <p className="text-xs text-slate-500">Third-party OAuth & API configuration</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* OAuth Login Direct Action */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-950 uppercase tracking-wide">Direct Deriv OAuth</span>
                <span className="text-[10px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                Clicking below redirects you directly to Deriv’s official login portal. Once authorized, Deriv returns you here with your Demo & Real accounts and live balances loaded.
              </p>
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  onLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-[#ff444f] hover:bg-[#e03a44] text-white shadow-md shadow-[#ff444f]/20 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Authorize with Deriv (App ID: {appId})</span>
              </button>
            </div>

            {/* Custom App ID Form */}
            <form onSubmit={handleSaveAppId} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deriv App ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempAppId}
                    onChange={(e) => setTempAppId(e.target.value)}
                    placeholder="e.g. 1089 or your registered App ID"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Default: <strong>1089</strong> (Deriv standard third-party ID)
                </span>
              </div>
            </form>

            {/* Fallback: Direct API Token Entry */}
            <form onSubmit={handleManualTokenSubmit} className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Or Paste Deriv API Token (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={manualTokenInput}
                    onChange={(e) => setManualTokenInput(e.target.value)}
                    placeholder="Enter your Deriv API token"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Useful if testing in environments where OAuth redirect is restricted.
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

