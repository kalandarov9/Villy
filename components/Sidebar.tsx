
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Overview', icon: '📊' },
    { id: AppView.CLAIMS, label: 'Claims', icon: '📑' },
    { id: AppView.ADMIN, label: 'Admin Panel', icon: '🛠️' },
  ];

  return (
    <div className="w-64 h-screen border-r border-white/10 flex flex-col p-4">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">N</div>
        <span className="text-xl font-bold tracking-tight">NEXUS</span>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
              ? 'bg-white/10 text-white' 
              : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-xs text-indigo-300 font-semibold mb-1 uppercase tracking-wider">Pool Health</p>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 w-4/5"></div>
          </div>
          <p className="text-[10px] text-indigo-400 mt-2">Optimal Liquidity 82%</p>
        </div>
      </div>
    </div>
  );
};
