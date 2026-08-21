import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { MATERIAL_PRESETS, generateFlowBenchmark } from '../utils/thermalEngine';
import { Bot, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Lightbulb, Shield, Zap } from 'lucide-react';

interface AIEngineeringAssistantProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const AIEngineeringAssistant: React.FC<AIEngineeringAssistantProps> = ({ inputs, results }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!results.valid) return null;

  const minDeltaT = Math.min(results.deltaT1, results.deltaT2);
  const benchmark = generateFlowBenchmark(inputs);
  const matProp = MATERIAL_PRESETS[inputs.materialPreset] || { name: 'Custom', k: 0, desc: '' };

  const lmtdDiffPct = benchmark.parallelValid && benchmark.parallelLMTD > 0
    ? (((benchmark.counterflowLMTD - benchmark.parallelLMTD) / benchmark.parallelLMTD) * 100).toFixed(1)
    : 'N/A';

  const areaSavedPct = benchmark.parallelValid && benchmark.parallelArea > 0
    ? (((benchmark.parallelArea - benchmark.counterflowArea) / benchmark.parallelArea) * 100).toFixed(1)
    : 'N/A';

  return (
    <div className="bg-white border-2 border-[#DDA7A5] rounded-2xl overflow-hidden shadow-md mb-8">
      {/* Expander Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-[#2C2C2C] to-[#3D1C28] text-white p-5 flex items-center justify-between hover:opacity-95 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#C2185B] rounded-xl text-white shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4C2C2] flex items-center gap-2">
              🤖 AI Engineering Interpretation & Decision Support
            </h3>
            <p className="text-xs text-[#DDA7A5] mt-0.5">
              Automated thermal diagnostics, pinch point analysis & material optimization recommendations
            </p>
          </div>
        </div>
        <div className="p-1.5 bg-[#1A1A1A] rounded-lg text-[#F4C2C2] border border-[#DDA7A5]/40">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expander Content */}
      {isOpen && (
        <div className="p-6 bg-[#FFF5F7]/30 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Pinch Temperature Analysis */}
            <div className="bg-white border border-[#DDA7A5] rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#C2185B]">
                <Zap className="w-4 h-4" />
                <span>Pinch Point & Thermal Driving Force</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Minimum temperature difference (ΔT min): <strong className="font-mono text-[#2C2C2C]">{minDeltaT.toFixed(2)}°C</strong>.
              </p>
              {minDeltaT < 5 ? (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pinch Point Warning:</strong> ΔT min &lt; 5°C requires very large surface area ({results.area.toFixed(1)} m²) or high velocities to prevent thermal stagnation.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Healthy Thermal Pinch:</strong> Robust temperature driving force ensures reliable heat exchange with minimal risk of thermal crossover.
                  </span>
                </div>
              )}
            </div>

            {/* 2. Flow Configuration Efficiency */}
            <div className="bg-white border border-[#DDA7A5] rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#C2185B]">
                <Lightbulb className="w-4 h-4" />
                <span>Flow Configuration Optimization</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Active Mode: <strong className="text-[#C2185B]">{inputs.flowConfig}</strong>.
              </p>
              {benchmark.parallelValid ? (
                <p className="text-xs text-gray-600 leading-relaxed">
                  Counterflow achieves <strong>{lmtdDiffPct}% higher LMTD</strong> than Parallel flow for this thermal duty, reducing required tube surface area by <strong>{areaSavedPct}%</strong>.
                </p>
              ) : (
                <p className="text-xs text-amber-700 leading-relaxed bg-amber-50 p-2 rounded border border-amber-200">
                  Parallel flow is thermodynamically impossible for these temperatures due to temperature crossing! Counterflow is required.
                </p>
              )}
            </div>
          </div>

          {/* 3. Material Conductivity & Construction Recommendation */}
          <div className="bg-white border border-[#DDA7A5] rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#C2185B]">
              <Shield className="w-4 h-4" />
              <span>Material Selection & Insulation Insights</span>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed space-y-1">
              <p>
                <strong>Selected Alloy:</strong> {matProp.name} (k = {matProp.k} W/m·K).
              </p>
              <p className="text-gray-600">{matProp.desc}</p>
              <p className="text-gray-600 pt-1 border-t border-gray-100">
                💡 <strong>Engineering Recommendation:</strong> {inputs.flowConfig === 'Parallel Flow' ? 'Switching to Counterflow configuration will optimize thermal recovery and minimize overall footprint.' : 'Counterflow configuration maximizes thermodynamic efficiency and minimizes shell & tube manufacturing cost.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
