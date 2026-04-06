import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const { risk_score, confidence, decision, explanation, important_features } = result;

  const decisionStyles = {
    Approve: {
      glow: 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
      accent: 'border-emerald-500/50'
    },
    Review: {
      glow: 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      icon: <ShieldAlert className="w-10 h-10 text-amber-400" />,
      accent: 'border-amber-500/50'
    },
    Reject: {
      glow: 'shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]',
      border: 'border-red-500/30',
      badgeBg: 'bg-red-500/10',
      badgeText: 'text-red-400',
      icon: <ShieldX className="w-10 h-10 text-red-500" />,
      accent: 'border-red-500/50'
    }
  };

  const style = decisionStyles[decision] || decisionStyles.Review;

  return (
    <div className={`backdrop-blur-xl bg-white/5 rounded-3xl ${style.border} ${style.glow} p-8 flex flex-col gap-8 transition-all duration-700 animate-in fade-in zoom-in-95`}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-slate-950 border ${style.border} shadow-inner`}>
            {style.icon}
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-400 tracking-wide uppercase text-xs mb-1">Final Authorization</h2>
            <h1 className={`text-4xl font-black uppercase tracking-tight ${style.badgeText} drop-shadow-md`}>
              {decision}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900/80 px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent w-full opacity-20 group-hover:opacity-100 transition-opacity`}></div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Risk Index</p>
            <p className="text-3xl font-black text-white">{(risk_score * 100).toFixed(1)}<span className="text-lg text-slate-500 ml-1">%</span></p>
          </div>
          <div className="bg-slate-900/80 px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className={`absolute bottom-0 left-0 h-1 w-full opacity-50 bg-amber-500`}></div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Confidence</p>
            <p className="text-3xl font-black text-white">{(confidence * 100).toFixed(1)}<span className="text-lg text-slate-500 ml-1">%</span></p>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-transparent opacity-50"></div>
        <h3 className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            Agent Synthesis
        </h3>
        <p className="text-slate-300 leading-relaxed text-lg font-light">
          {explanation}
        </p>
      </div>

      {/* Features Section */}
      {important_features && important_features.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">SHAP Model Telemetry</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {important_features.map((feature, idx) => (
              <li key={idx} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col gap-1.5 hover:border-amber-500/30 hover:bg-slate-900 transition-all cursor-default group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                  {feature.feature.replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-slate-200 font-medium leading-tight">
                    {feature.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
