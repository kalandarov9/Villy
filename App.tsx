
import React, { useState } from 'react';
import { AppView, UserProfile, PoolStats, Payment, PoolIncident } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Claims } from './pages/Claims';
import { AdminPanel } from './pages/AdminPanel';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Mock logged in user
  const [user] = useState<UserProfile>({
    id: 'USR-7721',
    name: 'Alex Sterling',
    email: 'alex@example.tech',
    kycStatus: 'Verified',
    propertyScore: 92,
    monthlyContribution: 84.50,
    poolId: 'AX-900-MUTUAL',
    location: 'Austin, TX (Sector B-12)'
  });

  // Mock global pool stats
  const [poolStats] = useState<PoolStats>({
    totalParticipants: 12450,
    totalPoolValue: 1420500,
    claimsPaidThisYear: 152,
    currentRiskLevel: 'Low',
    solvencyRatio: 118
  });

  // Mock Payments
  const [payments] = useState<Payment[]>([
    { id: 'TX-901', date: '2025-12-01', amount: 84.50, status: 'Completed', type: 'Monthly Contribution' },
    { id: 'TX-852', date: '2025-11-01', amount: 84.50, status: 'Completed', type: 'Monthly Contribution' },
    { id: 'TX-743', date: '2025-10-15', amount: 12.00, status: 'Completed', type: 'Pool Top-up' },
    { id: 'TX-612', date: '2025-10-01', amount: 84.50, status: 'Completed', type: 'Monthly Contribution' },
  ]);

  // Mock Pool Incidents (Accidents nearby)
  const [incidents] = useState<PoolIncident[]>([
    {
      id: 'INC-A1',
      type: 'Flash Flood Damage',
      location: 'Sector B-10 (2mi away)',
      totalLoss: 12400,
      individualImpact: 0.99,
      description: 'Basement flooding due to drainage failure during heavy rainfall. 100% covered by pool.',
      status: 'Resolved',
      date: 'Dec 08, 2025'
    },
    {
      id: 'INC-A2',
      type: 'Smart Lock Hack / Theft',
      location: 'Sector B-12 (Your Block)',
      totalLoss: 4500,
      individualImpact: 0.36,
      description: 'Theft of high-value electronics. Security audit in progress for neighboring units.',
      status: 'Funding',
      date: 'Dec 12, 2025'
    },
    {
      id: 'INC-A3',
      type: 'Power Surge Burnout',
      location: 'Sector B-11 (1mi away)',
      totalLoss: 2100,
      individualImpact: 0.17,
      description: 'Grid instability caused appliance failure. Claim verified via IoT voltage logs.',
      status: 'Verifying',
      date: 'Dec 14, 2025'
    }
  ]);

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            user={user} 
            poolStats={poolStats} 
            payments={payments} 
            incidents={incidents} 
          />
        );
      case AppView.CLAIMS:
        return <Claims user={user} />;
      case AppView.ADMIN:
        if (!isAdminAuthenticated) {
          return (
            <div className="p-8 flex items-center justify-center h-full">
              <div className="text-center space-y-4 glass p-10 rounded-3xl border-indigo-500/30">
                <div className="text-6xl mb-4">🔐</div>
                <h1 className="text-2xl font-bold">Admin Privileges Required</h1>
                <p className="text-zinc-400 max-w-xs">Please provide MFA verification to access global pool administration tools. (MVP Bypass enabled)</p>
                <button 
                  onClick={() => setIsAdminAuthenticated(true)}
                  className="bg-indigo-500 px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Verify MFA Identity
                </button>
              </div>
            </div>
          );
        }
        return <AdminPanel poolStats={poolStats} />;
      default:
        return <Dashboard user={user} poolStats={poolStats} payments={payments} incidents={incidents} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-zinc-100 selection:bg-indigo-500/30">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header/Navbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">NETWORK: <span className="text-green-400">STABLE</span></span>
            <span className="text-xs font-mono text-zinc-500">POOL: <span className="text-indigo-400">{user.poolId}</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
               <span className="text-sm font-bold">{user.name}</span>
               <span className="text-[10px] text-zinc-500">{isAdminAuthenticated ? 'Administrator' : 'Tier 1 Platinum'}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/seed/${user.id}/100`} alt="Avatar" />
             </div>
             {isAdminAuthenticated && (
               <button 
                onClick={() => setIsAdminAuthenticated(false)}
                className="text-xs bg-rose-500/10 text-rose-500 px-2 py-1 rounded border border-rose-500/20"
               >
                 Logout Admin
               </button>
             )}
          </div>
        </div>

        {/* View Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
