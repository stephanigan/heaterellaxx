import React, { useState, useMemo } from 'react';
import { ThermalInputs } from './types';
import { calculateThermalPerformance } from './utils/thermalEngine';
import { Header } from './components/Header';
import { SidebarControls } from './components/SidebarControls';
import { KPICards } from './components/KPICards';
import { SummaryTable } from './components/SummaryTable';
import { ThermalCharts } from './components/ThermalCharts';
import { GoverningEquations } from './components/GoverningEquations';
import { AIEngineeringAssistant } from './components/AIEngineeringAssistant';
import { ExportModal } from './components/ExportModal';
import {
  AlertCircle,
  FileText,
  Flame,
  LayoutDashboard,
  Calculator,
  Table,
  Bot,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

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

type AppTab = 'dashboard' | 'equations' | 'matrix' | 'ai' | 'all';

export default function App() {
  const [inputs, setInputs] = useState<ThermalInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
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
    <div className="min-h-screen bg-[#FDF2F4] text-[#1E1E1E] font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Header Banner */}
        <Header />

        {/* Master Navigation & Action Toolbar */}
        <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Academic Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFF5F7] border border-[#E8B4B8] rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Overview & Visualizers</span>
            </button>

            <button
              onClick={() => setActiveTab('equations')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'equations'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>2. LaTeX Equations & Proofs</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>3. Data Matrix & Alloys</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>4. AI Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#1E1E1E] text-[#F4C2C2] shadow-xs'
                  : 'text-gray-600 hover:text-[#9C1545]'
              }`}
              title="View all modules in one comprehensive sheet"
            >
              <Layers className="w-4 h-4" />
              <span>All-In-One</span>
            </button>
          </div>

          {/* Export Report Action */}
          <button
            onClick={() => setIsExportOpen(true)}
            disabled={!results.valid}
            className="px-4 py-2.5 bg-[#C2185B] hover:bg-[#AD1457] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
          >
            <Award className="w-4 h-4" />
            <span>Generate Academic Pitch Report</span>
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
              onSelectPreset={(preset) => handleInputChange(preset.inputs)}
            />
          </div>

          {/* Results & Calculations Area (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Thermodynamic Error Banner */}
            {!results.valid && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-red-900 shadow-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-900 mb-1">
                      Thermodynamic Boundary Constraint Violated
                    </h3>
                    <p className="text-sm text-red-800 font-medium leading-relaxed mb-3">
                      {results.errorMsg}
                    </p>
                    <div className="bg-white border border-red-200 rounded-xl p-3 text-xs text-red-900">
                      <strong>💡 Troubleshooting Guidance:</strong> Adjust inputs in the <strong>⚙️ System Parameters</strong> sidebar:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Ensure Hot Inlet Temp (T_h_in) &gt; Hot Outlet Temp (T_h_out).</li>
                        <li>Ensure Cold Inlet Temp (T_c_in) &lt; Hot Inlet Temp (T_h_in).</li>
                        <li>Increase cold fluid flow rate (ṁ_c) or reduce hot flow rate (ṁ_h) to avoid temperature cross.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Banner if valid but constrained */}
            {results.valid && results.warningMsg && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-900 shadow-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs font-semibold">{results.warningMsg}</p>
              </div>
            )}

            {/* Active Valid Analysis Dashboard */}
            {results.valid && (
              <>
                {/* TAB 1: Dashboard Overview */}
                {(activeTab === 'dashboard' || activeTab === 'all') && (
                  <div className="space-y-6">
                    {/* Metric KPI Cards */}
                    <KPICards results={results} />

                    {/* Interactive Visualizations & Flow Schematic */}
                    <ThermalCharts inputs={inputs} results={results} />
                  </div>
                )}

                {/* TAB 2: LaTeX Equations & Proofs */}
                {(activeTab === 'equations' || activeTab === 'all') && (
                  <div className="space-y-6">
                    <GoverningEquations inputs={inputs} results={results} />
                  </div>
                )}

                {/* TAB 3: Data Matrix & Metallurgy */}
                {(activeTab === 'matrix' || activeTab === 'all') && (
                  <div className="space-y-6">
                    <SummaryTable inputs={inputs} results={results} />
                  </div>
                )}

                {/* TAB 4: AI Engineering Advisor */}
                {(activeTab === 'ai' || activeTab === 'all') && (
                  <div className="space-y-6">
                    <AIEngineeringAssistant inputs={inputs} results={results} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#E8B4B8]/60 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[#1E1E1E]">
            <Flame className="w-4 h-4 text-[#C2185B]" />
            <span>heaterellaxx</span> — Precision Heat Exchanger Engineering Engine
          </div>
          <div className="text-gray-500 font-medium">
            Rigorous Thermal Physics • LMTD & ε-NTU Algorithms • LaTeX Formulations
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
