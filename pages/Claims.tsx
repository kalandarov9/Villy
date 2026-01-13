
import React, { useState } from 'react';
import { Claim, UserProfile } from '../types';
import { analyzeClaimWithAI } from '../services/geminiService';

export const Claims: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 'CLM-001',
      userId: user.id,
      type: 'Electronic Failure',
      amount: 1200,
      status: 'Approved',
      description: 'Lightning strike damaged high-end workstation during storm.',
      createdAt: '2025-12-10',
      aiAnalysis: 'High probability of lightning damage based on local weather metadata.'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClaim, setNewClaim] = useState({ description: '', amount: 0, type: 'Water Damage' });
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI check before adding
    const analysis = await analyzeClaimWithAI(newClaim.description, newClaim.amount);
    setActiveAnalysis(analysis || null);
    
    const claim: Claim = {
      id: `CLM-00${claims.length + 1}`,
      userId: user.id,
      type: newClaim.type,
      amount: newClaim.amount,
      status: 'Analyzing',
      description: newClaim.description,
      createdAt: new Date().toISOString().split('T')[0],
      aiAnalysis: analysis || ''
    };
    
    setClaims([claim, ...claims]);
    setIsSubmitting(false);
    setNewClaim({ description: '', amount: 0, type: 'Water Damage' });
    
    // Auto-update status after "processing"
    setTimeout(() => {
      setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'Approved' } : c));
    }, 5000);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Claims Portal</h1>
          <p className="text-zinc-400">Manage your requests or submit a new claim to the pool.</p>
        </div>
        <button 
          onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          Submit New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {claims.map((claim) => (
          <div key={claim.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{claim.type}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  claim.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                  claim.status === 'Analyzing' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {claim.status}
                </span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{claim.description}</p>
              <div className="flex gap-4 text-xs font-mono text-zinc-500">
                <span>ID: {claim.id}</span>
                <span>Requested: ${claim.amount}</span>
                <span>Filed: {claim.createdAt}</span>
              </div>
            </div>
            {claim.aiAnalysis && (
              <div className="md:w-80 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-400 uppercase">
                  <span>✨ AI Adjuster Evaluation</span>
                </div>
                <p className="text-xs text-zinc-300 italic leading-snug">
                  "{claim.aiAnalysis.substring(0, 150)}..."
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div id="claim-form" className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">New Mutual Claim Request</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Claim Category</label>
              <select 
                value={newClaim.type}
                onChange={e => setNewClaim({...newClaim, type: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Water Damage</option>
                <option>Electronic Failure</option>
                <option>Fire & Smoke</option>
                <option>Structural Damage</option>
                <option>Theft</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Estimated Amount ($)</label>
              <input 
                type="number"
                value={newClaim.amount}
                onChange={e => setNewClaim({...newClaim, amount: Number(e.target.value)})}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Describe what happened</label>
            <textarea 
              value={newClaim.description}
              onChange={e => setNewClaim({...newClaim, description: e.target.value})}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Be specific about cause, date, and items affected..."
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isSubmitting ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isSubmitting ? 'AI Adjuster Analyzing...' : 'Submit Claim to Pool'}
          </button>
        </form>
      </div>
    </div>
  );
};
