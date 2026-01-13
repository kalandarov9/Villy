
import React, { useState, useEffect } from 'react';
import { PoolStats, UserProfile, Payment, PoolIncident } from '../types';
import { getPoolExplanation } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 7500 },
];

interface DashboardProps {
  user: UserProfile;
  poolStats: PoolStats;
  payments: Payment[];
  incidents: PoolIncident[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, poolStats, payments, incidents }) => {
  const [explanation, setExplanation] = useState<string>('Analyzing pool dynamics...');

  useEffect(() => {
    const fetchExplain = async () => {
      const text = await getPoolExplanation({ ...poolStats, monthlyContribution: user.monthlyContribution });
      setExplanation(text || '');
    };
    fetchExplain();
  }, [poolStats, user]);

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-zinc-400">
          Your membership is active in <span className="text-indigo-400 font-bold">{user.poolId}</span>. 
          Location: <span className="text-white">{user.location}</span>
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Monthly Contribution', value: `$${user.monthlyContribution}`, sub: 'Automatic recurring' },
          { label: 'Total Pool Value', value: `$${poolStats.totalPoolValue.toLocaleString()}`, sub: 'Collective safety net' },
          { label: 'Claims Handled', value: poolStats.claimsPaidThisYear, sub: 'This year' },
          { label: 'Your Risk Score', value: `${user.propertyScore}/100`, sub: 'Updated via AI scan' },
        ].map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl">
            <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-zinc-400 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pool Transparency Math */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold">Pool Liquidity Trends</h2>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Stable Growth</span>
          </div>
          <div className="p-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} />
                <YAxis stroke="#52525b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#818cf8" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-[10px]">✨</div>
            <h2 className="text-lg font-bold">Mutual AI Insights</h2>
          </div>
          <div className="flex-1 text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-line overflow-y-auto max-h-48 scrollbar-hide">
            {explanation}
          </div>
          <div className="pt-4 border-t border-white/5 mt-4">
             <div className="bg-white/5 p-3 rounded-xl border border-white/10">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Your Total Savings</p>
               <p className="text-xl font-bold text-green-400">+$1,420 <span className="text-xs font-normal text-zinc-400">vs traditional</span></p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Community Incidents */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold">Community Incidents <span className="text-zinc-500 text-sm font-normal">(Nearby {user.location})</span></h2>
            <p className="text-xs text-zinc-500 mt-1">Claims covered by your pool in the last 30 days</p>
          </div>
          <div className="p-2">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold group-hover:text-indigo-400 transition-colors">{incident.type}</p>
                    <p className="text-xs text-zinc-500">{incident.location} • {incident.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-400">-${incident.individualImpact.toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Your Share</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">"{incident.description}"</p>
                <div className="mt-3 flex gap-2">
                   <span className="text-[9px] px-2 py-0.5 bg-zinc-800 rounded uppercase font-bold text-zinc-400">{incident.status}</span>
                   <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 rounded uppercase font-bold text-indigo-400">Pool Funded: ${incident.totalLoss.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold">Your Payment History</h2>
            <p className="text-xs text-zinc-500 mt-1">Transparency of your contributions</p>
          </div>
          <div className="divide-y divide-white/5">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                    payment.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {payment.type === 'Monthly Contribution' ? '⚡' : '🔄'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{payment.type}</p>
                    <p className="text-xs text-zinc-500">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">${payment.amount.toFixed(2)}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest ${
                    payment.status === 'Completed' ? 'text-green-500' : 'text-amber-500'
                  }`}>{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors bg-white/5">
            DOWNLOAD ALL RECEIPTS (PDF)
          </button>
        </div>
      </div>
      
      {/* Risk Notifications */}
      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-amber-400 font-bold uppercase text-xs tracking-widest">Seasonal Risk Alert: Storm Front</h3>
          <p className="text-sm text-zinc-300">A potential storm front is approaching your region. Ensure all property sensors are online for 'Safe Haven' contribution discounts.</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors">
          View Mitigation Steps
        </button>
      </div>
    </div>
  );
};
