import React, { useState } from 'react';
import { Zap, RefreshCcw } from 'lucide-react';

export default function LoanForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    user_id: '',
    income: '',
    credit_score: '',
    dti: '',
    employment_length: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      user_id: formData.user_id,
      income: Number(formData.income),
      credit_score: parseInt(formData.credit_score, 10),
      dti: Number(formData.dti),
      employment_length: parseInt(formData.employment_length, 10)
    });
  };

  const handleReset = () => {
    setFormData({
      user_id: '',
      income: '',
      credit_score: '',
      dti: '',
      employment_length: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 transition-all duration-500 hover:border-white/20">
      
      <div className="flex justify-between items-center border-b border-white/10 pb-5">
        <h2 className="text-xl font-bold text-white tracking-wide">Applicant Data</h2>
        <button 
          type="button" 
          onClick={handleReset} 
          className="text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Purge
        </button>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Reference Handler</label>
          <input 
            required 
            name="user_id"
            type="text" 
            value={formData.user_id}
            onChange={handleChange}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
            placeholder="e.g. USR-0992X" 
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Annual Yield ($)</label>
            <input 
              required 
              name="income"
              type="number" 
              min="1000"
              value={formData.income}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="120000" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Credit Velocity</label>
            <input 
              required 
              name="credit_score"
              type="number" 
              min="300" max="900"
              value={formData.credit_score}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="760" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Debt Index (DTI)</label>
            <input 
              required 
              name="dti"
              type="number" 
              step="0.01" min="0" max="1"
              value={formData.dti}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="0.18" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Tenure (Yrs)</label>
            <input 
              required 
              name="employment_length"
              type="number" 
              min="0"
              value={formData.employment_length}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="4" 
            />
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-6 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-lg py-4 rounded-xl flex justify-center items-center shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:grayscale hover:scale-[1.02] disabled:hover:scale-100 uppercase tracking-widest disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Processing Matrix...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Analyze Loan
          </span>
        )}
      </button>
    </form>
  );
}
