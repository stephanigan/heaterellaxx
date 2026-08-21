import React, { useState, useMemo } from 'react';
import { ThermalInputs } from './types';
import { calculateThermalPerformance } from './utils/thermalEngine';
import { Header } from './components/Header';
import { SidebarControls } from './components/SidebarControls';
import { KPICards } from './components/KPICards';
import { SummaryTable } from './components/SummaryTable';
import { ThermalCharts } from './components/ThermalCharts';
import { AIEngineeringAssistant } from './components/AIEngineeringAssistant';
import { ExportModal } from './components/ExportModal';
import { AlertCircle, FileText, Flame, Sparkles } from 'lucide-react';

const DEFAULT_INPUTS: ThermalInputs = {
  flowConfig: 'Counterflow',
  THIn: 150,
  THOut: 80,
  TCIn: 20,
  MDotH: 2.0,
  CpH: 2.1,
  MDotC: 2.5,
  CpC: 4.184,
  U: 500,
  materialPreset: 'Copper (High Conductivity k=385 W/m·K)'
};

export default function App() {
  const [inputs, setInputs] = useState<ThermalInputs>(DEFAULT_INPUTS);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleInputChange = (updated: Partial<ThermalInputs>) => {
    setInputs(prev => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  // Thermal calculations
  const results = useMemo(() => {
    return calculateThermalPerformance(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#FDF2F4] text-[#2C2C2C] font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Header Banner */}
        <Header />

        {/* Action Toolbar */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsExportOpen(true)}
            disabled={!results.valid}
            className="px-4 py-2 bg-[#C2185B] hover:bg-[#AD1457] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Pitch Report</span>
          </button>
        </div>

        {/* Main Grid: Sidebar + Results Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Controls (4 cols on lg) */}
          <div className="lg:col-span-4">
            <SidebarControls
              inputs={inputs}
              onChange={handleInputChange}
              onReset={handleReset}
            />
          </div>

          {/* Results & Calculations Area (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Thermodynamic Error Banner */}
            {!results.valid && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-red-900 shadow-md animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-900 mb-1">
                      Thermodynamic Calculation Error
                    </h3>
                    <p className="text-sm text-red-800 font-medium leading-relaxed mb-3">
                      {results.errorMsg}
                    </p>
                    <div className="bg-white/80 border border-red-200 rounded-xl p-3 text-xs text-red-900">
                      <strong>💡 Troubleshooting Guidance:</strong> Adjust inputs in the <strong>⚙️ System Configuration</strong> sidebar:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Ensure Hot Inlet Temp (T_h_in) &gt; Hot Outlet Temp (T_h_out).</li>
                        <li>Ensure Cold Inlet Temp (T_c_in) &lt; Hot Inlet Temp (T_h_in).</li>
                        <li>Increase cold fluid flow rate (m_dot_c) or reduce hot flow rate (m_dot_h) to avoid temperature cross.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Banner if valid but constrained */}
            {results.valid && results.warningMsg && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900 shadow-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs font-medium">{results.warningMsg}</p>
              </div>
            )}

            {/* Active Valid Analysis Dashboard */}
            {results.valid && (
              <>
                {/* 1. Metric KPI Cards */}
                <KPICards results={results} />

                {/* 2. Interactive Plotly / Recharts Visualizations */}
                <ThermalCharts inputs={inputs} results={results} />

                {/* 3. Detailed Engineering Summary Data Table */}
                <SummaryTable inputs={inputs} results={results} />

                {/* 4. AI Engineering Assistant & Decision Support */}
                <AIEngineeringAssistant inputs={inputs} results={results} />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#DDA7A5]/40 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[#2C2C2C]">
            <Flame className="w-4 h-4 text-[#C2185B]" />
            <span>heaterellaxx</span> — Heat Analyzer & Exchanger Engine
          </div>
          <div className="text-gray-500">
            Precision Thermal Modeling • LMTD & ε-NTU Algorithms
          </div>
        </footer>
      </div>

      {/* Export Report Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        inputs={inputs}
        results={results}
      />
    </div>
  );
}
