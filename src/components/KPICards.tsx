import React from 'react';
import { ThermalResults } from '../types';
import { Flame, Thermometer, Layers, Percent, ShieldCheck, Zap, Gauge } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface KPICardsProps {
  results: ThermalResults;
}

export const KPICards: React.FC<KPICardsProps> = ({ results }) => {
  if (!results.valid) return null;

  return (
    <div className="space-y-4">
      {/* 4 Primary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Heat Duty */}
        <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#C2185B]/60 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#9C1545] tracking-wider">
                  Total Heat Rate
                </span>
                <span className="text-[11px] font-serif font-bold text-[#C2185B]">
                  <KatexMath math="(Q)" />
                </span>
              </div>
              <div className="p-2 bg-[#FFF0F3] rounded-xl text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E1E1E] tracking-tight">
              {results.Q_kW.toFixed(2)}
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span>kW Thermal Duty</span>
            <span className="text-[#C2185B] font-mono font-bold bg-[#FFF0F3] px-2 py-0.5 rounded border border-[#E8B4B8]/40">
              {(results.Q_kW / 1000).toFixed(3)} MW
            </span>
          </div>
        </div>

        {/* 2. Log Mean Temperature Difference */}
        <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#C2185B]/60 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#9C1545] tracking-wider">
                  Log Mean Temp Diff
                </span>
                <span className="text-[11px] font-serif font-bold text-[#C2185B]">
                  <KatexMath math="(\Delta T_{lm})" />
                </span>
              </div>
              <div className="p-2 bg-[#FFF0F3] rounded-xl text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E1E1E] tracking-tight">
              {results.LMTD.toFixed(2)}
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span>°C Driving Force</span>
            <span className="text-gray-800 font-mono font-bold">
              ΔT₁: {results.deltaT1.toFixed(1)}° | ΔT₂: {results.deltaT2.toFixed(1)}°
            </span>
          </div>
        </div>

        {/* 3. Required Surface Area */}
        <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#C2185B]/60 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#9C1545] tracking-wider">
                  Required Surface Area
                </span>
                <span className="text-[11px] font-serif font-bold text-[#C2185B]">
                  <KatexMath math="(A)" />
                </span>
              </div>
              <div className="p-2 bg-[#FFF0F3] rounded-xl text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E1E1E] tracking-tight">
              {results.area.toFixed(2)}
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span>m² Exchanger Size</span>
            <span className="text-[#0284C7] font-mono font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {(results.area * 10.7639).toFixed(1)} ft²
            </span>
          </div>
        </div>

        {/* 4. Thermal Effectiveness */}
        <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#C2185B]/60 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-[#9C1545] tracking-wider">
                  Exchanger Effectiveness
                </span>
                <span className="text-[11px] font-serif font-bold text-[#C2185B]">
                  <KatexMath math="(\varepsilon)" />
                </span>
              </div>
              <div className="p-2 bg-[#FFF0F3] rounded-xl text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1E1E1E] tracking-tight">
              {results.effectiveness.toFixed(1)}%
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span>ε-NTU Metric</span>
            <span className="text-[#C2185B] font-mono font-bold bg-[#FFF0F3] px-2 py-0.5 rounded border border-[#E8B4B8]/40">
              NTU: {results.NTU.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Second-Law & Exergy Telemetry Strip */}
      <div className="bg-[#1E1E1E] text-white border-2 border-[#E8B4B8] rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-extrabold text-[#F4C2C2] uppercase tracking-wider">
            2nd Law & Exergy Performance:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-gray-400">Entropy Gen Rate (<KatexMath math="\dot{S}_{\text{gen}}" className="text-white" />):</span>
            <span className="font-mono font-bold text-emerald-400">{results.S_gen_kW_K.toFixed(4)} kW/K</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-gray-400">Exergy Destroyed (<KatexMath math="\dot{E}_{x,\text{dest}}" className="text-white" />):</span>
            <span className="font-mono font-bold text-amber-300">{results.Ex_dest_kW.toFixed(2)} kW</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-gray-400">Exergetic Efficiency (<KatexMath math="\eta_{\text{ex}}" className="text-white" />):</span>
            <span className="font-mono font-bold text-[#F4C2C2]">{results.exergyEfficiency.toFixed(1)}%</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-gray-400">Pinch Approach (<KatexMath math="\Delta T_{\min}" className="text-white" />):</span>
            <span className="font-mono font-bold text-sky-300">{results.pinchPointDeltaT.toFixed(1)}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
