import React, { useState } from 'react';
import { Zap, RefreshCcw, Upload, AlertTriangle } from 'lucide-react';

export default function LoanForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    user_id: '',
    income: '',
    credit_score: '',
    dti: '',
    employment_length: '',
    loan_tenure: '',
    currency: 'USD'
  });

  const [payslipFile, setPayslipFile] = useState(null);
  const [fraudAlert, setFraudAlert] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [payslipVerificationData, setPayslipVerificationData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPayslipFile(file);
      setFraudAlert(null);
    } else if (file) {
      alert('Please upload a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFraudAlert(null);

    // Step 1: Check if payslip is uploaded (mandatory)
    if (!payslipFile) {
      setFraudAlert('Payslip PDF is required. Please upload your payslip document.');
      return;
    }

    // Step 2: Verify income with payslip
    setVerifying(true);
    try {
      const formDataPayslip = new FormData();
      formDataPayslip.append('claimed_income', formData.income);
      formDataPayslip.append('document', payslipFile);

      const verifyResponse = await fetch('http://localhost:8000/verify-income', {
        method: 'POST',
        body: formDataPayslip
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.fraud_flag) {
        setFraudAlert(verifyResult.message);
        setVerifying(false);
        return; // Stop submission
      }

      // Store verification data for later use in report
      setPayslipVerificationData(verifyResult.verification_data);

    } catch (error) {
      console.error('Income verification failed:', error);
      setFraudAlert('Failed to verify income document. Please try again.');
      setVerifying(false);
      return;
    }
    setVerifying(false);

    // Step 3: Proceed with normal loan analysis
    const submissionData = {
      user_id: formData.user_id,
      income: Number(formData.income),
      credit_score: parseInt(formData.credit_score, 10),
      dti: Number(formData.dti),
      employment_length: parseInt(formData.employment_length, 10),
      loan_tenure: formData.loan_tenure ? parseInt(formData.loan_tenure, 10) : null,
      currency: formData.currency,
      payslip_verification: payslipVerificationData
    };

    onSubmit(submissionData);
  };

  const handleReset = () => {
    setFormData({
      user_id: '',
      income: '',
      credit_score: '',
      dti: '',
      employment_length: '',
      loan_tenure: '',
      currency: 'USD'
    });
    setPayslipFile(null);
    setFraudAlert(null);
    setPayslipVerificationData(null);
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
        {fraudAlert && (
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-1">Fraud Alert</h3>
              <p className="text-red-300 text-sm">{fraudAlert}</p>
            </div>
          </div>
        )}

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
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Currency</label>
            <select 
              required 
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">
              Annual Income ({formData.currency === 'USD' ? '$' : '₹'})
            </label>
            <input 
              required 
              name="income"
              type="number" 
              min="1000"
              value={formData.income}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder={formData.currency === 'USD' ? '120000' : '10000000'} 
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
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Employment Length (Yrs)</label>
            <input 
              required 
              name="employment_length"
              type="number" 
              min="0"
              max="50"
              value={formData.employment_length}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="5" 
            />
            <p className="text-xs text-slate-500 mt-1">Time at current job</p>
          </div>
          
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">Loan Tenure (Yrs)</label>
            <input 
              name="loan_tenure"
              type="number" 
              min="1"
              max="30"
              value={formData.loan_tenure}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-inner"
              placeholder="15" 
            />
            <p className="text-xs text-slate-500 mt-1">Requested loan term (optional)</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-slate-400 mb-2 uppercase">
            Payslip PDF <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="payslip-upload"
              required
            />
            <label 
              htmlFor="payslip-upload"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-4 text-slate-400 hover:text-white hover:border-amber-500/50 cursor-pointer flex items-center gap-3 transition-all duration-300 shadow-inner hover:bg-slate-900"
            >
              <Upload className="w-5 h-5" />
              <span className="flex-1">
                {payslipFile ? payslipFile.name : 'Upload Payslip Document'}
              </span>
              {payslipFile && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Uploaded
                </span>
              )}
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-1">Required: Upload your payslip to verify income and prevent fraud</p>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading || verifying}
        className="mt-6 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-lg py-4 rounded-xl flex justify-center items-center shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:grayscale hover:scale-[1.02] disabled:hover:scale-100 uppercase tracking-widest disabled:cursor-not-allowed"
      >
        {verifying ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Verifying Income...
          </span>
        ) : isLoading ? (
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
