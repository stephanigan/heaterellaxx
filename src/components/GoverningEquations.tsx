import React from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { Calculator } from 'lucide-react';

interface GoverningEquationsProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const GoverningEquations: React.FC<GoverningEquationsProps> = ({ inputs, results }) => {
  if (!results.valid) return null;

  return (
    <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-[#E8B4B8]/60">
        <div className="p-2 bg-[#FFF0F3] rounded-lg text-[#C2185B]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#9C1545]">
            📐 Thermodynamic Governing Equations & Mathematical Proofs
          </h3>
          <p className="text-xs text-gray-600">
            Step-by-step thermal equations with active parameter substitutions
          </p>
        </div>
      </div>

      {/* 1. Heat Duty Rate */}
      <div className="bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C1545]">
            1. Heat Duty Rate Formula (Q)
          </span>
          <span className="text-xs font-mono font-bold text-[#C2185B] bg-white px-2 py-0.5 rounded border border-[#E8B4B8]">
            Q = {results.Q_kW.toFixed(2)} kW
          </span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-gray-200 font-mono text-xs sm:text-sm text-[#1E1E1E] overflow-x-auto">
          {"Q = ṁ_h · C_p,h · (T_h,in - T_h,out) = ṁ_c · C_p,c · (T_c,out - T_c,in)"}
        </div>
        <div className="text-xs text-[#2C2C2C] space-y-1 font-mono">
          <p>
            <strong>Live Substitution:</strong> Q = {inputs.MDotH.toFixed(2)} × {inputs.CpH.toFixed(2)} × ({inputs.THIn.toFixed(1)} - {inputs.THOut.toFixed(1)}) = <strong>{results.Q_kW.toFixed(2)} kW</strong> ({(results.Q_kW / 1000).toFixed(3)} MW)
          </p>
          <p>
            <strong>Cold Outlet Temp (T_c,out):</strong> {inputs.TCIn.toFixed(1)} + ({results.Q_kW.toFixed(2)} / ({inputs.MDotC.toFixed(2)} × {inputs.CpC.toFixed(3)})) = <strong>{results.TCOut.toFixed(2)}°C</strong>
          </p>
        </div>
      </div>

      {/* 2. Log Mean Temperature Difference */}
      <div className="bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C1545]">
            2. Terminal Temp Differences & Log Mean Temp Difference (LMTD)
          </span>
          <span className="text-xs font-mono font-bold text-[#C2185B] bg-white px-2 py-0.5 rounded border border-[#E8B4B8]">
            LMTD = {results.LMTD.toFixed(2)} °C
          </span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-gray-200 font-mono text-xs sm:text-sm text-[#1E1E1E] overflow-x-auto">
          {inputs.flowConfig === 'Counterflow'
            ? "Counterflow: ΔT1 = T_h,in - T_c,out | ΔT2 = T_h,out - T_c,in"
            : "Parallel Flow: ΔT1 = T_h,in - T_c,in | ΔT2 = T_h,out - T_c,out"
          }
          <br />
          {"LMTD = (ΔT1 - ΔT2) / ln(ΔT1 / ΔT2)"}
        </div>
        <div className="text-xs text-[#2C2C2C] space-y-1 font-mono">
          <p>
            <strong>ΔT1:</strong> {results.deltaT1.toFixed(2)}°C &nbsp;|&nbsp; <strong>ΔT2:</strong> {results.deltaT2.toFixed(2)}°C
          </p>
          <p>
            <strong>Calculation:</strong> ({results.deltaT1.toFixed(2)} - {results.deltaT2.toFixed(2)}) / ln({results.deltaT1.toFixed(2)} / {results.deltaT2.toFixed(2)}) = <strong>{results.LMTD.toFixed(2)}°C</strong>
          </p>
        </div>
      </div>

      {/* 3. Surface Area & Effectiveness */}
      <div className="bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C1545]">
            3. Required Heat Surface Area (A) & ε-NTU Effectiveness
          </span>
          <span className="text-xs font-mono font-bold text-[#C2185B] bg-white px-2 py-0.5 rounded border border-[#E8B4B8]">
            A = {results.area.toFixed(2)} m²
          </span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-gray-200 font-mono text-xs sm:text-sm text-[#1E1E1E] overflow-x-auto">
          {"A = (Q × 1000) / (U · LMTD) | ε = (Q / Q_max) × 100% | NTU = (U · A) / (C_min × 1000)"}
        </div>
        <div className="text-xs text-[#2C2C2C] space-y-1 font-mono">
          <p>
            <strong>Surface Area:</strong> ({results.Q_kW.toFixed(2)} × 1000) / ({inputs.U} × {results.LMTD.toFixed(2)}) = <strong>{results.area.toFixed(2)} m²</strong>
          </p>
          <p>
            <strong>Effectiveness:</strong> ε = <strong>{results.effectiveness.toFixed(1)}%</strong> &nbsp;|&nbsp; <strong>NTU:</strong> {results.NTU.toFixed(2)} &nbsp;|&nbsp; <strong>Cr:</strong> {results.Cr.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  );
};
