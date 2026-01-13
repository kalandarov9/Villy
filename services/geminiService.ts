
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeClaimWithAI = async (claimDescription: string, amount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an AI claims adjuster for a P2P Mutual Insurance platform, analyze this claim:
      Description: ${claimDescription}
      Requested Amount: $${amount}
      
      Provide a professional evaluation including:
      1. Potential legitimacy score (0-100)
      2. Key risk factors
      3. Recommendation for the mutual pool members.
      
      Format the output as clear markdown.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "AI Analysis unavailable at this moment. Manual review required.";
  }
};

export const getPoolExplanation = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain why a user's monthly contribution is $${stats.monthlyContribution} based on these pool stats:
      Total Participants: ${stats.totalParticipants}
      Pool Value: $${stats.totalPoolValue}
      Claims History: ${stats.claimsPaidThisYear}
      Risk Level: ${stats.currentRiskLevel}
      
      Explain the 'Mutual Pool Math' in 3 concise, transparent bullets for a 2026 tech-savvy user.`,
    });
    return response.text;
  } catch (error) {
    return "Calculated based on current pool volume and actuarial risk modeling.";
  }
};
