
export enum AppView {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CLAIMS = 'CLAIMS',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  propertyScore: number;
  monthlyContribution: number;
  poolId: string;
  location: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Monthly Contribution' | 'Adjustment' | 'Pool Top-up';
}

export interface PoolIncident {
  id: string;
  type: string;
  location: string;
  totalLoss: number;
  individualImpact: number;
  description: string;
  status: 'Resolved' | 'Funding' | 'Verifying';
  date: string;
}

export interface Claim {
  id: string;
  userId: string;
  userName?: string; // For admin view
  type: string;
  amount: number;
  status: 'Draft' | 'Analyzing' | 'Approved' | 'Rejected' | 'Pending Review';
  description: string;
  aiAnalysis?: string;
  createdAt: string;
}

export interface PoolStats {
  totalParticipants: number;
  totalPoolValue: number;
  claimsPaidThisYear: number;
  currentRiskLevel: 'Low' | 'Medium' | 'High';
  solvencyRatio: number; // New for admin
}
