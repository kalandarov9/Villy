
import React, { useState } from 'react';
import { PoolStats, Claim } from '../types';

interface AdminPanelProps {
  poolStats: PoolStats;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ poolStats }) => {
  const [globalClaims, setGlobalClaims] = useState<Claim[]>([
    { id: 'CLM-902', userId: 'USR-112', userName: 'Sarah Connor', type: 'Theft', amount: 3500, status: 'Pending Review', description: 'Burglary reported in Sector A-1. Police report attached.', createdAt: '2025-12-14', aiAnalysis: 'Legitimacy score: 88%. Police report OCR verified.' },
    { id: 'CLM-903', userId: 'USR-445', userName: 'John Doe', type: 'Water Damage', amount: 1200, status: 'Analyzing', description: 'Pipe burst in kitchen.', createdAt: '2025-12-15', aiAnalysis: 'Detecting potential maintenance neglect patterns.' },
  ]);

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    setGlobalClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-zinc-400 font-mono text-xs mt-1">NEXUS CORE v2.5 // SECURE SESSION ACTIVE</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md border border-indigo-500/20 text-xs font-bold uppercase">Solvency: {poolStats.solvencyRatio}%</span>
          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-md border border-green-500/20 text-xs font-bold uppercase">Nodes: Active</span>
        </div>
      </header>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500">
          <p className="text-sm text-zinc-500">Global Pool Value</p>
          <p className="text-3xl font-bold font-mono">${poolStats.totalPoolValue.toLocaleString()}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-amber-500">
          <p className="text-sm text-zinc-500">Pending KYC</p>
          <p className="text-3xl font-bold font-mono">24</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-rose-500">
          <p className="text-sm text-zinc-500">Claims in Queue</p>
          <p className="text-3xl font-bold font-mono">{globalClaims.filter(c => c.status !== 'Approved').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Claims Processing Queue</h2>
          <div className="space-y-4">
            {globalClaims.map(claim => (
              <div key={claim.id} className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">{claim.type}</p>
                    <h3 className="text-lg font-bold">{claim.userName} <span className="text-zinc-500 text-sm font-normal">#{claim.userId}</span></h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-mono">${claim.amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      claim.status === 'Approved' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{claim.status}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4 italic leading-relaxed">"{claim.description}"</p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                  <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">AI Recommendation</p>
                  <p className="text-xs text-zinc-300 leading-snug">{claim.aiAnalysis}</p>
                </div>
                {claim.status === 'Pending Review' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(claim.id, 'Approved')}
                      className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg text-sm transition-colors"
                    >
                      Approve Payout
                    </button>
                    <button 
                      onClick={() => handleAction(claim.id, 'Rejected')}
                      className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-lg text-sm border border-rose-500/20 transition-colors"
                    >
                      Reject Claim
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Settings */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold">Pool Controls</h2>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <label className="text-[10px] text-zinc-500 uppercase block mb-2">Base Contribution Mult.</label>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg font-bold">1.25x</span>
                  <input type="range" className="accent-indigo-500" />
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <label className="text-[10px] text-zinc-500 uppercase block mb-2">AI Sensitivity Level</label>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg font-bold">High</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-zinc-800 border border-white/10"></div>
                    <div className="w-4 h-4 rounded bg-indigo-500"></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20">
              Apply Global Changes
            </button>
          </div>

          <div className="glass p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold">Audit Log</h2>
            <div className="space-y-3">
              {[
                { event: 'Parameters adjusted', user: 'Admin-01', time: '10m ago' },
                { event: 'Batch payout AX-44', user: 'System', time: '1h ago' },
                { event: 'KYC Override', user: 'Compliance', time: '3h ago' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                   <div className="text-zinc-300">
                     <span className="font-bold">{log.event}</span> by <span className="text-indigo-400">{log.user}</span>
                   </div>
                   <div className="text-zinc-500">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
