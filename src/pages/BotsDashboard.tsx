import React, { useState, useEffect } from "react";
import { Search, Filter, LayoutGrid, List, Settings, Play, Pause, Pencil, Copy, Trash2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

// Default mock bots data (fallback)
const defaultBots = [
  {
    id: 1,
    name: "MyDCA-1",
    pair: "BTCUSDT",
    strategy: "DCA-Smart",
    totalValue: "$190.00",
    totalInvestment: "$150.00",
    realizedPnl: "+$40.00",
    totalReturn: "+25.7%",
    chart: true,
    status: "Active",
    statusColor: "bg-green-500",
    runtime: "10d 7h 30m",
    account: "My Account",
    paused: false,
    statusSince: "Active since: 17th July 2024",
    botId: "1220-2148",
    investmentFrequency: "Daily",
    nextBuySignal: "Next buy signal in 2h 30m",
    count: "15",
  },
  {
    id: 2,
    name: "MyDCA-2",
    pair: "ETHUSDT",
    strategy: "DCA-Smart",
    totalValue: "$125.00",
    totalInvestment: "$200.00",
    realizedPnl: "-$75.00",
    totalReturn: "-39.2%",
    chart: true,
    status: "Paused",
    statusColor: "bg-yellow-400",
    runtime: "5d 2h 10m",
    account: "My Account",
    paused: true,
    statusSince: "Paused: 10th May 2024",
    botId: "1220-2149",
    investmentFrequency: "Weekly",
    nextBuySignal: "Paused",
    count: "8",
  },
  {
    id: 3,
    name: "MyDCA-1",
    pair: "XRPUSDT",
    strategy: "DCA-Smart",
    totalValue: "$190.00",
    totalInvestment: "$150.00",
    realizedPnl: "+$40.00",
    totalReturn: "+27.5%",
    chart: true,
    status: "Active",
    statusColor: "bg-green-500",
    runtime: "4d 7h 50m",
    account: "My Account",
    paused: false,
    statusSince: "Active since: 12th July 2025",
    botId: "1260-4248",
    investmentFrequency: "Daily",
    nextBuySignal: "Next buy signal in 12 hours 40 mins",
    count: "14",
  },
  {
    id: 4,
    name: "MyDCA-1",
    pair: "BTCUSDT",
    strategy: "DCA-Smart",
    totalValue: "$0.00",
    totalInvestment: "$0.00",
    realizedPnl: "$0.00",
    totalReturn: "0%",
    chart: false,
    status: "Error",
    statusColor: "bg-red-500 border-2 border-orange-400",
    runtime: "0d 0h 0m",
    account: "My Account",
    paused: false,
    statusSince: "Error occurred",
    botId: "1260-4248",
    investmentFrequency: "N/A",
    nextBuySignal: "N/A",
    count: "0",
    errorMessage: "Unable to fetch API & Secret key from your selected broker!",
    errorCode: "504 ByBit",
    errorAction: "Click here to reconnect.",
  },
];

// Mini chart component
const MiniChart: React.FC<{ isPositive: boolean }> = ({ isPositive }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background line */}
    <line x1="5" y1="15" x2="75" y2="15" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2,2" />
    {/* Chart line */}
    <path 
      d={isPositive 
        ? "M5 20 L20 18 L35 12 L50 8 L65 5 L75 3" 
        : "M5 5 L20 8 L35 12 L50 18 L65 22 L75 25"
      } 
      stroke={isPositive ? "#10B981" : "#EF4444"} 
      strokeWidth="2" 
      fill="none"
    />
  </svg>
);

const RedesignedBotCard: React.FC<{ 
  bot: any; 
  onPauseResume: (botId: number) => void;
  onModify: (botId: number) => void;
  onReplicate: (botId: number) => void;
  onDelete: (botId: number) => void;
  calculateRuntime: (bot: any) => string;
  getStatusSince: (bot: any) => string;
}> = ({ bot, onPauseResume, onModify, onReplicate, onDelete, calculateRuntime, getStatusSince }) => (
  <div className="bg-white border rounded-lg shadow-sm p-8 pr-20 flex flex-col gap-6 min-w-[350px] max-w-[420px] mx-auto relative">
    {/* Settings and graph icons absolutely positioned in right padding */}
    <div className="absolute top-8 right-6 flex flex-col items-center gap-3">
      <button className="text-gray-400 hover:text-gray-600" title="Settings">
        <Settings className="h-5 w-5" />
      </button>
      <div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="5" width="2" height="14" rx="1" fill="#0094FF" />
          <rect x="8" y="7" width="8" height="2" rx="1" fill="#0094FF" />
          <rect x="8" y="11" width="12" height="2" rx="1" fill="#0094FF" />
          <rect x="8" y="15" width="5" height="2" rx="1" fill="#0094FF" />
        </svg>
      </div>
    </div>
    {/* Header: Two columns */}
    <div className="flex justify-between items-start gap-6 w-full">
      {/* Left: Bot name, status, runtime */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400 mb-1">Bot name</div>
        <div className="text-2xl font-bold text-gray-900 leading-tight mb-1 truncate">{bot.name}</div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block w-2 h-2 rounded-full ${bot.statusColor}`}></span>
          <span className="text-sm font-medium text-gray-700">{bot.status}</span>
        </div>
        <div className="text-xs text-gray-500 mb-1">{getStatusSince(bot)}</div>
        <div className="text-xs text-gray-500">Runtime: {calculateRuntime(bot)}</div>
      </div>
      {/* Right: Bot asset, account, type, right-aligned and flush with card edge */}
      <div className="flex flex-col items-end min-w-[120px]">
        <div className="text-xs text-gray-400 mb-1">Bot asset</div>
        <span className="text-lg font-bold text-gray-800 tracking-wide mb-1">{bot.pair}</span>
        <span className="text-xs text-blue-700 underline cursor-pointer mb-1">{bot.account}</span>
        <span className="text-xs text-gray-500">Type: <span className="font-semibold text-gray-700">{bot.strategy}</span></span>
      </div>
    </div>
    {/* Divider */}
    <div className="border-b border-gray-200"></div>
    {/* Details: Two columns */}
    <div className="flex gap-8 items-center">
      {/* Left: Values */}
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <div className="text-xs text-gray-400">Total value</div>
          <div className="text-green-700 font-bold text-2xl">{bot.totalValue}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Realized PnL</div>
          <div className="text-green-700 font-bold text-xl">{bot.realizedPnl}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total return</div>
          <div className="text-green-700 font-bold text-xl">{bot.totalReturn}</div>
        </div>
      </div>
      {/* Right: Investment and Chart */}
      <div className="flex-1 flex flex-col items-end gap-2">
        <div>
          <div className="text-xs text-gray-400 text-right">Total investment</div>
          <div className="text-black font-bold text-2xl">{bot.totalInvestment}</div>
        </div>
        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 mt-2">
          {/* Replace with real chart later */}
          Chart
        </div>
      </div>
    </div>
    {/* Divider */}
    <div className="border-b border-gray-200"></div>
    {/* Actions: Large, spaced-out, icons with labels below */}
    <div className="w-full px-4">
              <div className="flex gap-8 flex-1 justify-center">
          <div className="flex flex-col items-center w-24">
            {bot.paused ? (
              <>
                <button 
                  onClick={() => onPauseResume(bot.id)}
                  className="text-green-600 hover:text-green-800 text-2xl mb-1"
                >
                  <Play className="h-6 w-6" />
                </button>
                <span className="text-xs font-semibold text-green-600 whitespace-nowrap">Resume bot</span>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onPauseResume(bot.id)}
                  className="text-orange-500 hover:text-orange-700 text-2xl mb-1"
                >
                  <Pause className="h-6 w-6" />
                </button>
                <span className="text-xs font-semibold text-orange-500 whitespace-nowrap">Pause bot</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center w-24">
            <button 
              onClick={() => onModify(bot.id)}
              className="text-blue-600 hover:text-blue-800 text-2xl mb-1"
            >
              <Pencil className="h-6 w-6" />
            </button>
            <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">Modify bot</span>
          </div>
          <div className="flex flex-col items-center w-24">
            <button 
              onClick={() => onReplicate(bot.id)}
              className="text-cyan-600 hover:text-cyan-800 text-2xl mb-1"
            >
              <Copy className="h-6 w-6" />
            </button>
            <span className="text-xs font-semibold text-cyan-600 whitespace-nowrap">Replicate bot</span>
          </div>
          <div className="flex flex-col items-center w-24">
            <button 
              onClick={() => onDelete(bot.id)}
              className="text-red-600 hover:text-red-800 text-2xl mb-1"
            >
              <Trash2 className="h-6 w-6" />
            </button>
            <span className="text-xs font-semibold text-red-600 whitespace-nowrap">Stop & delete</span>
          </div>
        </div>
    </div>
  </div>
);

interface BotsDashboardProps {
  bots?: any[];
}

const BotsDashboard: React.FC<BotsDashboardProps> = ({ bots = [] }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedBotId, setExpandedBotId] = useState<number | null>(1); // First row expanded by default
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    botType: 'all',
    asset: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update times every minute for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update times
      setSearchTerm(prev => prev); // This triggers a re-render
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddNewBot = () => {
    // Navigate to dashboard with a parameter to force empty state
    navigate('/dashboard?new=true');
  };

  // Bot action handlers
  const handlePauseResume = (botId: number) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;
    
    const newPausedState = !bot.paused;
    const currentTime = new Date();
    
    const updatedBots = bots.map(bot => {
      if (bot.id === botId) {
        let totalPausedTime = bot.totalPausedTime || 0;
        let lastPausedAt = bot.lastPausedAt;
        
        if (newPausedState) {
          // Bot is being paused
          lastPausedAt = currentTime.toISOString();
        } else {
          // Bot is being resumed - calculate total paused time
          if (lastPausedAt) {
            const pausedDuration = currentTime.getTime() - new Date(lastPausedAt).getTime();
            totalPausedTime += pausedDuration;
            lastPausedAt = null;
          }
        }
        
        return {
          ...bot,
          paused: newPausedState,
          status: newPausedState ? 'Paused' : 'Active',
          statusColor: newPausedState ? 'bg-yellow-400' : 'bg-green-500',
          lastStatusChange: currentTime.toISOString(),
          lastPausedAt: lastPausedAt,
          totalPausedTime: totalPausedTime,
          nextBuySignal: newPausedState ? 'Paused' : `Next buy signal in ${bot.investmentFrequency || '1Day'}`
        };
      }
      return bot;
    });
    
    // Update localStorage
    localStorage.setItem('deployedBots', JSON.stringify(updatedBots));
    
    // Show toast notification
    toast.success(
      newPausedState ? `${bot.name} has been paused` : `${bot.name} has been resumed`,
      {
        description: newPausedState ? "Bot is now paused and will not execute trades" : "Bot is now active and will continue trading"
      }
    );
    
    // Force a reload to update the UI
    window.location.reload();
  };

  const handleModify = (botId: number) => {
    // Navigate to bot setup with the bot data for modification
    const botToModify = bots.find(bot => bot.id === botId);
    if (botToModify) {
      // Store the bot data for modification
      localStorage.setItem('modifyBotData', JSON.stringify(botToModify));
      toast.info("Opening bot modification form", {
        description: `You can now modify ${botToModify.name} settings`
      });
      // Navigate to dashboard with modify parameter
      navigate('/dashboard?modify=true');
    }
  };

  const handleReplicate = (botId: number) => {
    const botToReplicate = bots.find(bot => bot.id === botId);
    if (botToReplicate) {
      const currentTime = new Date();
      // Create a copy of the bot with a new ID and name
      const replicatedBot = {
        ...botToReplicate,
        id: Date.now(),
        name: `${botToReplicate.name}-Copy`,
        botId: `bot-${Date.now()}`,
        status: 'Active',
        statusColor: 'bg-green-500',
        paused: false,
        totalValue: botToReplicate.totalInvestment, // Reset to initial investment
        realizedPnl: '$0.00',
        totalReturn: '0%',
        count: '0',
        // Reset timestamp fields for new bot
        createdAt: currentTime.toISOString(),
        lastStatusChange: currentTime.toISOString(),
        totalPausedTime: 0,
        lastPausedAt: null
      };
      
      // Add to localStorage
      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      existingBots.push(replicatedBot);
      localStorage.setItem('deployedBots', JSON.stringify(existingBots));
      
      // Show toast notification
      toast.success("Bot replicated successfully", {
        description: `${replicatedBot.name} has been created with the same settings`
      });
      
      // Force a reload to update the UI
      window.location.reload();
    }
  };

  const handleDelete = (botId: number) => {
    const botToDelete = bots.find(bot => bot.id === botId);
    if (!botToDelete) return;
    
    if (window.confirm(`Are you sure you want to stop and delete ${botToDelete.name}? This action cannot be undone.`)) {
      // Remove bot from localStorage
      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      const updatedBots = existingBots.filter((bot: any) => bot.id !== botId);
      localStorage.setItem('deployedBots', JSON.stringify(updatedBots));
      
      // Show toast notification
      toast.success("Bot deleted successfully", {
        description: `${botToDelete.name} has been stopped and removed from your dashboard`
      });
      
      // Force a reload to update the UI
      window.location.reload();
    }
  };

  // Filter and search logic
  const filteredBots = bots.filter(bot => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || bot.status === filters.status;
    
    // Bot type filter
    const matchesBotType = filters.botType === 'all' || bot.strategy.includes(filters.botType);
    
    // Asset filter
    const matchesAsset = filters.asset === 'all' || bot.pair === filters.asset;
    
    return matchesSearch && matchesStatus && matchesBotType && matchesAsset;
  });

  // Get unique assets for filter dropdown
  const uniqueAssets = [...new Set(bots.map(bot => bot.pair))];
  const uniqueBotTypes = [...new Set(bots.map(bot => bot.strategy.replace('DCA-', '')))];

  // Utility functions for time calculations
  const formatRuntime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString();
  };

  const calculateRuntime = (bot: any): string => {
    if (!bot.createdAt) return "0d 0h 0m";
    
    const now = new Date();
    const created = new Date(bot.createdAt);
    const totalPausedTime = bot.totalPausedTime || 0;
    
    // If currently paused, add current pause duration
    let currentPauseTime = 0;
    if (bot.paused && bot.lastPausedAt) {
      currentPauseTime = now.getTime() - new Date(bot.lastPausedAt).getTime();
    }
    
    const totalTime = now.getTime() - created.getTime() - totalPausedTime - currentPauseTime;
    return formatRuntime(Math.max(0, totalTime));
  };

  const getStatusSince = (bot: any): string => {
    if (!bot.lastStatusChange) return "Just now";
    
    const statusText = bot.paused ? "Paused since" : "Active since";
    const timeAgo = formatTimeAgo(bot.lastStatusChange);
    
    return `${statusText}: ${timeAgo}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-green-600 text-2xl font-bold">My Dashboard</h1>
        <button 
          onClick={handleAddNewBot}
          className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-50 font-medium"
        >
          Add new bot
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-8 border-b border-gray-200">
        <button className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-semibold">Current bots</button>
        <button className="py-3 px-2 text-gray-500">Past bots</button>
        <button className="py-3 px-2 text-gray-500">Performance</button>
      </div>

      {/* Search, Filter, View Toggle */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-8">
        {/* Search bar left-aligned */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search bots..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded pl-9 pr-3 py-2 w-full" 
          />
        </div>
        {/* Filter and Grid/List toggle right-aligned */}
        <div className="flex items-center gap-4 ml-4">
          <div className="relative filter-dropdown">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 font-medium relative" 
              title="Filter"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {/* Show notification badge when any filter is active */}
              {(filters.status !== 'all' || filters.botType !== 'all' || filters.asset !== 'all') && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                >
                  {((filters.status !== 'all' ? 1 : 0) + 
                    (filters.botType !== 'all' ? 1 : 0) + 
                    (filters.asset !== 'all' ? 1 : 0))
                  }
                </Badge>
              )}
            </button>
            
            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Error">Error</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bot Type</label>
                    <select 
                      value={filters.botType}
                      onChange={(e) => setFilters({...filters, botType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Types</option>
                      {uniqueBotTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                    <select 
                      value={filters.asset}
                      onChange={(e) => setFilters({...filters, asset: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Assets</option>
                      {uniqueAssets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setFilters({status: 'all', botType: 'all', asset: 'all'});
                        setSearchTerm('');
                      }}
                      className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center border rounded bg-white overflow-hidden">
            <button className={`p-2 text-gray-500 hover:bg-gray-100 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`} title="Grid view" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className={`p-2 text-gray-500 hover:bg-gray-100 border-l ${viewMode === 'list' ? 'bg-gray-100' : ''}`} title="List view" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content: grid or list view */}
      {viewMode === 'grid' ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 flex flex-wrap justify-center gap-8">
          {filteredBots.length > 0 ? (
            filteredBots.map((bot) => (
              <RedesignedBotCard 
                key={bot.id} 
                bot={bot} 
                onPauseResume={handlePauseResume}
                onModify={handleModify}
                onReplicate={handleReplicate}
                onDelete={handleDelete}
                calculateRuntime={calculateRuntime}
                getStatusSince={getStatusSince}
              />
            ))
          ) : (
            <div className="text-center py-12">
              {bots.length === 0 ? (
                <>
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-green-600 text-2xl font-bold mb-8">Select an instrument to get started</h2>
                    {/* 2x3 Grid of Instrument Buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {/* Top Row */}
                      <button className="bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Dollar Cost Average
                      </button>
                      <button className="bg-blue-800 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-900 transition-colors">
                        Trade or Invest
                      </button>
                      <button className="bg-purple-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                        Portfolio or Rebalancer
                      </button>
                      {/* Bottom Row */}
                      <button className="bg-orange-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                        Proprietary
                      </button>
                      <button className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                        Investoaccumulator
                      </button>
                      <button className="bg-gray-800 text-white px-6 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Buy & Hold
                      </button>
                    </div>
                  </div>
                  {/* Robot Icon and Text - now truly below the instrument selection */}
                  <div className="flex flex-col items-center mt-24">
                    <div className="w-20 h-20 mb-6">
                      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Robot head */}
                        <rect x="12" y="8" width="40" height="32" rx="4" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                        {/* Robot eyes */}
                        <circle cx="22" cy="20" r="2" fill="#9CA3AF"/>
                        <circle cx="42" cy="20" r="2" fill="#9CA3AF"/>
                        {/* Robot mouth */}
                        <rect x="28" y="28" width="8" height="2" fill="#9CA3AF"/>
                        {/* Robot body */}
                        <rect x="20" y="40" width="24" height="16" rx="2" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                        {/* Robot arms */}
                        <rect x="8" y="44" width="8" height="4" rx="2" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                        <rect x="48" y="44" width="8" height="4" rx="2" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                        {/* Robot legs */}
                        <rect x="24" y="56" width="6" height="8" rx="2" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                        <rect x="34" y="56" width="6" height="8" rx="2" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 text-lg">Nothing to robo here.</p>
                  </div>
                </>
              ) : (
                // Original filter message when bots exist but filters don't match
                <>
                  <p className="text-gray-500 text-lg">No bots found matching your filters</p>
                  <button 
                    onClick={() => {
                      setFilters({status: 'all', botType: 'all', asset: 'all'});
                      setSearchTerm('');
                    }}
                    className="mt-4 text-green-600 hover:text-green-700 underline"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
          {/* Table Header */}
          <div className="flex items-start mb-4">
            {/* Sr. header outside the box */}
            <div className="w-16 pl-4 text-xs text-gray-500 font-medium">Sr.</div>
            
            {/* Main header starting with Status */}
            <div className="flex-1 grid grid-cols-9 gap-4 text-xs text-gray-500 font-medium px-4">
              <div>Status</div>
              <div>Name</div>
              <div>Asset</div>
              <div>Equity curve</div>
              <div>Original capital ($)</div>
              <div>Total return ($)</div>
              <div>P&L ($)</div>
              <div>P&L (%)</div>
              <div>Actions</div>
            </div>
          </div>

                    {/* Bot Cards */}
          <div className="space-y-4">
            {filteredBots.length > 0 ? (
              filteredBots.map((bot, idx) => {
                const expanded = expandedBotId === bot.id;
                const isPositive = parseFloat(bot.totalReturn.replace('%', '')) > 0;
                
                return (
                  <div key={bot.id} className="flex items-start">
                    {/* Sr. column outside the box */}
                    <div className="w-16 pt-4 pl-4 font-semibold text-gray-900">{idx + 1}</div>
                    
                    {/* Main card box starting with Status */}
                    <div 
                      className={`flex-1 rounded-lg border-2 ${
                        bot.status === 'Active' 
                          ? 'border-green-200 bg-white' 
                          : bot.status === 'Paused'
                          ? 'border-yellow-200 bg-yellow-50'
                          : bot.status === 'Error'
                          ? 'bg-[#de3835]'
                          : ''
                      } ${bot.status === 'Completed' ? 'border-blue-200 bg-blue-50' : ''} overflow-hidden`}
                    >
                      {/* Summary Row */}
                      <div className="grid grid-cols-9 gap-4 items-center p-4">
                        <div className="py-3 px-2">
                          <div className="flex flex-col items-start gap-1">
                            <span className="flex items-center gap-1">
                              {bot.status === 'Error' ? (
                                <div className="w-2 h-2 rounded-full bg-purple-500 border-2 border-orange-400"></div>
                              ) : (
                                <span className={`inline-block w-2 h-2 rounded-full ${bot.statusColor}`}></span>
                              )}
                              <span className={`text-sm font-medium ${bot.status === 'Error' ? 'text-white' : 'text-gray-700'}`}>{bot.status === 'Error' ? 'Error!' : bot.status}</span>
                            </span>
                            <span className={`text-xs ${bot.status === 'Error' ? 'text-white' : 'text-gray-500'}`}>ID:{bot.botId}</span>
                          </div>
                        </div>
                        <div className={`font-bold ${bot.status === 'Error' ? 'text-white' : 'text-gray-900'}`}>{bot.name}</div>
                        <div className={`font-bold ${bot.status === 'Error' ? 'text-white' : 'text-gray-800'}`}>{bot.pair}</div>
                        {bot.status === 'Error' ? (
                          <>
                            <div className="col-span-5">
                              <div className="bg-white rounded p-3 text-center">
                                <div className="text-sm text-gray-700 font-medium mb-1">
                                  {bot.errorMessage}
                                </div>
                                <div className="flex justify-center gap-2">
                                  <span className="text-xs text-gray-600">Error code: {bot.errorCode}</span>
                                  <button className="text-xs text-blue-600 underline hover:text-blue-800">
                                    {bot.errorAction}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              {bot.chart ? (
                                <MiniChart isPositive={isPositive} />
                              ) : (
                                <div className="w-24 h-6 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                                  N/A
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-black text-lg">{bot.totalInvestment.replace('$', '')}</div>
                            <div className="flex items-center gap-1">
                              <span className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-600'}`}>{bot.totalValue.replace('$', '')}</span>
                              {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-700" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-600'}`}>{bot.realizedPnl.replace('$', '')}</span>
                              {isPositive ? (
                                <ArrowUp className="h-4 w-4 text-green-700" />
                              ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
                                {bot.totalReturn.replace('%', '')}
                              </span>
                              {isPositive ? (
                                <ArrowUp className="h-4 w-4 text-green-700" />
                              ) : (
                                <ArrowDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-gray-600" title="Settings">
                            <Settings className="h-5 w-5" strokeWidth={1.5} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title={expanded ? 'Collapse' : 'Expand'}
                            onClick={() => setExpandedBotId(expanded ? null : bot.id)}
                          >
                            {expanded ? <ChevronUp className="h-5 w-5" strokeWidth={1.5} /> : <ChevronDown className="h-5 w-5" strokeWidth={1.5} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expanded && (
                        <div className="border-t border-gray-200 bg-gray-50 py-6 px-1">
                          <div className="flex">
                            {/* Status & Runtime */}
                            <div className="flex-shrink-0 pr-16">
                                                          <div className="text-xs text-gray-500 mb-1">{getStatusSince(bot)}</div>
                            <div className="text-xs text-gray-500">Runtime: {calculateRuntime(bot)}</div>
                            </div>

                            {/* Investment Frequency, Next Buy Signal, Count */}
                            <div className="flex-shrink-0 pr-8">
                              <div className="flex items-center gap-16 mb-2">
                                <div className="flex-shrink-0 pr-4 pl-10">
                                  <div className="text-sm font-medium text-gray-700">{bot.investmentFrequency}</div>
                                  <div className="text-sm font-medium text-gray-700">{bot.nextBuySignal}</div>
                                </div>
                                <div className="flex-shrink-0 pr-4">
                                  <div className="text-xs text-gray-400 mb-1">Count</div>
                                  <div className="text-sm font-medium text-gray-700">{bot.count}</div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 pl-6">
                              <div className="flex gap-16">
                                <div className="flex flex-col items-center">
                                  {bot.paused ? (
                                    <>
                                      <button 
                                        onClick={() => handlePauseResume(bot.id)}
                                        className="text-green-600 hover:text-green-800 mb-1"
                                      >
                                        <Play className="h-5 w-5" />
                                      </button>
                                      <span className="text-xs font-semibold text-green-600">Resume bot</span>
                                    </>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => handlePauseResume(bot.id)}
                                        className="text-orange-500 hover:text-orange-700 mb-1"
                                      >
                                        <Pause className="h-5 w-5" />
                                      </button>
                                      <span className="text-xs font-semibold text-orange-500">Pause bot</span>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-col items-center">
                                  <button 
                                    onClick={() => handleModify(bot.id)}
                                    className="text-blue-600 hover:text-blue-800 mb-1"
                                  >
                                    <Pencil className="h-5 w-5" />
                                  </button>
                                  <span className="text-xs font-semibold text-blue-600">Modify bot</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <button 
                                    onClick={() => handleReplicate(bot.id)}
                                    className="text-cyan-600 hover:text-cyan-800 mb-1"
                                  >
                                    <Copy className="h-5 w-5" />
                                  </button>
                                  <span className="text-xs font-semibold text-cyan-600">Replicate bot</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <button 
                                    onClick={() => handleDelete(bot.id)}
                                    className="text-red-600 hover:text-red-800 mb-1"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                  <span className="text-xs font-semibold text-red-600">Stop & delete</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No bots found matching your filters</p>
                <button 
                  onClick={() => {
                    setFilters({status: 'all', botType: 'all', asset: 'all'});
                    setSearchTerm('');
                  }}
                  className="mt-4 text-green-600 hover:text-green-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BotsDashboard;
