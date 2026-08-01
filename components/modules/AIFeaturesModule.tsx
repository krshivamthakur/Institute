'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Sparkles, Bot, AlertTriangle, Scan, Calendar, Cpu, CheckCircle2 } from 'lucide-react';

export function AIFeaturesModule() {
  const { students } = useIMS();
  const [aiRunning, setAiRunning] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const handleRunAiPredictor = () => {
    setAiRunning(true);
    setTimeout(() => {
      setAiRunning(false);
      setPredictionResult('🤖 AI Risk Predictor Analysis Complete: Student Rohan Gupta (2026-EC-015) has a 78% probability of academic drop due to 74.2% attendance. Early counseling intervention recommended.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" /> Artificial Intelligence (AI) Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            EduBot assistant, AI attendance analytics, student performance prediction models, OCR document scanner, and AI conflict-free timetable generator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Performance Predictor */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Cpu className="h-5 w-5 text-amber-400" /> Student Dropout Risk Predictor
            </div>
            <p className="text-xs text-slate-400">
              Analyzes historical attendance, mid-term test scores, and LMS activity using machine learning.
            </p>
          </div>
          <button
            onClick={handleRunAiPredictor}
            disabled={aiRunning}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
          >
            {aiRunning ? 'Executing Neural Network...' : 'Run AI Risk Analytics'}
          </button>
        </div>

        {/* AI Timetable Generator */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Calendar className="h-5 w-5 text-indigo-400" /> Conflict-Free AI Timetable Generator
            </div>
            <p className="text-xs text-slate-400">
              Auto-allocates faculty slots, lab rooms, and lecture halls without overlapping collisions.
            </p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
            Auto-Generate Timetable
          </button>
        </div>

        {/* OCR Scanner */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Scan className="h-5 w-5 text-purple-400" /> OCR Document Scanning
            </div>
            <p className="text-xs text-slate-400">
              Extracts student data automatically from uploaded Aadhar cards and 10th/12th marksheets.
            </p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
            Scan Document with OCR
          </button>
        </div>
      </div>

      {predictionResult && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-semibold animate-in fade-in">
          {predictionResult}
        </div>
      )}
    </div>
  );
}
