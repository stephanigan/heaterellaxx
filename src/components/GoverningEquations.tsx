import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { Calculator, BookOpen, CheckCircle2, ChevronRight, Layers, HelpCircle, Activity } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface GoverningEquationsProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const GoverningEquations: React.FC<GoverningEquationsProps> = ({ inputs, results }) => {
  const [activeProof, setActiveProof] = useState<'all' | 'duty' | 'lmtd' | 'area' | 'ntu'>('all');

  if (!results.valid) return null;

  return (
    <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF5F7] border-b border-[#E8B4B8]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C2185B] text-white rounded-xl shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#9C1545] tracking-tight">
                Thermodynamic Governing Equations & Mathematical Proofs
              </h3>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-[#C2185B]/10 text-[#C2185B] rounded-full border border-[#C2185B]/20">
                Rigorous Heat Transfer
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Formal LaTeX mathematical formulations with dynamic input variable substitutions
            </p>
          </div>
        </div>

        {/* Proof Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8B4B8] rounded-xl shadow-xs self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveProof('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeProof === 'all'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
            }`}
          >
            All Proofs
          </button>
          <button
            onClick={() => setActiveProof('duty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeProof === 'duty'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
            }`}
          >
            Heat Duty (Q)
          </button>
          <button
            onClick={() => setActiveProof('lmtd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeProof === 'lmtd'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
            }`}
          >
            LMTD (ΔT_lm)
          </button>
          <button
            onClick={() => setActiveProof('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeProof === 'area'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
            }`}
          >
            Surface Area (A)
          </button>
          <button
            onClick={() => setActiveProof('ntu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeProof === 'ntu'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545] hover:bg-[#FFF0F3]'
            }`}
          >
            ε-NTU Method
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Heat Duty Rate Equations */}
        {(activeProof === 'all' || activeProof === 'duty') && (
          <div className="bg-[#FFF8F9] border-2 border-[#E8B4B8]/80 rounded-2xl p-5 space-y-4 hover:border-[#C2185B]/60 transition-all">
            <div className="flex items-center justify-between border-b border-[#E8B4B8]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9C1545] text-white text-xs font-extrabold">
                  1
                </span>
                <span className="text-sm font-extrabold text-[#9C1545] tracking-wide uppercase">
                  Heat Duty Rate Balance Equations (Q)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-white px-2.5 py-1 rounded-lg border border-[#E8B4B8] shadow-xs">
                Q = {results.Q_kW.toFixed(2)} kW
              </span>
            </div>

            {/* LaTeX Formula Block */}
            <div className="bg-white p-4 rounded-xl border border-[#E8B4B8] shadow-xs flex flex-col items-center justify-center gap-2">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest self-start">
                Governing First Law of Thermodynamics:
              </p>
              <KatexMath
                math="Q = \dot{m}_h \cdot C_{p,h} \cdot \left(T_{h,\text{in}} - T_{h,\text{out}}\right) = \dot{m}_c \cdot C_{p,c} \cdot \left(T_{c,\text{out}} - T_{c,\text{in}}\right)"
                block
                className="text-sm sm:text-base font-bold text-[#1E1E1E]"
              />
            </div>

            {/* Live Step-by-Step Substitution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-[#1E1E1E] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#9C1545]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Hot Fluid Heat Release:</span>
                </div>
                <div className="bg-[#FFF5F7] p-2 rounded border border-[#E8B4B8]/50 overflow-x-auto">
                  <KatexMath
                    math={`Q = (${inputs.MDotH.toFixed(2)}\\text{ kg/s}) \\times (${inputs.CpH.toFixed(2)}\\text{ kJ/kg}\\cdot\\text{K}) \\times (${inputs.THIn.toFixed(1)} - ${inputs.THOut.toFixed(1)})^\\circ\\text{C}`}
                  />
                </div>
                <p className="text-gray-700 font-medium">
                  Result: <strong className="text-[#9C1545]">{results.Q_kW.toFixed(2)} kW</strong> ({(results.Q_kW / 1000).toFixed(3)} MW)
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-[#1E1E1E] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#9C1545]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Cold Fluid Temperature Rise (T_c_out):</span>
                </div>
                <div className="bg-[#FFF5F7] p-2 rounded border border-[#E8B4B8]/50 overflow-x-auto">
                  <KatexMath
                    math={`T_{c,\\text{out}} = ${inputs.TCIn.toFixed(1)} + \\frac{${results.Q_kW.toFixed(2)}}{${inputs.MDotC.toFixed(2)} \\times ${inputs.CpC.toFixed(3)}} = ${results.TCOut.toFixed(2)}^\\circ\\text{C}`}
                  />
                </div>
                <p className="text-gray-700 font-medium">
                  Coolant Heating Range: <strong className="text-[#0284C7]">+{(results.TCOut - inputs.TCIn).toFixed(1)}°C</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. LMTD Formulations */}
        {(activeProof === 'all' || activeProof === 'lmtd') && (
          <div className="bg-[#FFF8F9] border-2 border-[#E8B4B8]/80 rounded-2xl p-5 space-y-4 hover:border-[#C2185B]/60 transition-all">
            <div className="flex items-center justify-between border-b border-[#E8B4B8]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9C1545] text-white text-xs font-extrabold">
                  2
                </span>
                <span className="text-sm font-extrabold text-[#9C1545] tracking-wide uppercase">
                  Terminal Temperature Differences & Log Mean Temp Difference (LMTD)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-white px-2.5 py-1 rounded-lg border border-[#E8B4B8] shadow-xs">
                ΔT_lm = {results.LMTD.toFixed(2)} °C
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8B4B8] shadow-xs flex flex-col items-center justify-center gap-2">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest self-start">
                Effective Thermal Driving Force:
              </p>
              <KatexMath
                math="\text{LMTD} = \Delta T_{lm} = \frac{\Delta T_1 - \Delta T_2}{\ln\left(\frac{\Delta T_1}{\Delta T_2}\right)}"
                block
                className="text-sm sm:text-base font-bold text-[#1E1E1E]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-[#1E1E1E] space-y-1.5">
                <span className="font-bold text-[#9C1545]">
                  Active Flow Mode: {inputs.flowConfig}
                </span>
                <div className="bg-[#FFF5F7] p-2 rounded border border-[#E8B4B8]/50 overflow-x-auto space-y-1">
                  {inputs.flowConfig === 'Counterflow' ? (
                    <>
                      <div><KatexMath math={`\\Delta T_1 = T_{h,\\text{in}} - T_{c,\\text{out}} = ${inputs.THIn.toFixed(1)} - ${results.TCOut.toFixed(1)} = ${results.deltaT1.toFixed(2)}^\\circ\\text{C}`} /></div>
                      <div><KatexMath math={`\\Delta T_2 = T_{h,\\text{out}} - T_{c,\\text{in}} = ${inputs.THOut.toFixed(1)} - ${inputs.TCIn.toFixed(1)} = ${results.deltaT2.toFixed(2)}^\\circ\\text{C}`} /></div>
                    </>
                  ) : (
                    <>
                      <div><KatexMath math={`\\Delta T_1 = T_{h,\\text{in}} - T_{c,\\text{in}} = ${inputs.THIn.toFixed(1)} - ${inputs.TCIn.toFixed(1)} = ${results.deltaT1.toFixed(2)}^\\circ\\text{C}`} /></div>
                      <div><KatexMath math={`\\Delta T_2 = T_{h,\\text{out}} - T_{c,\\text{out}} = ${inputs.THOut.toFixed(1)} - ${results.TCOut.toFixed(1)} = ${results.deltaT2.toFixed(2)}^\\circ\\text{C}`} /></div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-[#1E1E1E] space-y-1.5">
                <span className="font-bold text-[#9C1545]">
                  Logarithmic Mean Resolution:
                </span>
                <div className="bg-[#FFF5F7] p-2 rounded border border-[#E8B4B8]/50 overflow-x-auto">
                  <KatexMath
                    math={`\\text{LMTD} = \\frac{${results.deltaT1.toFixed(2)} - ${results.deltaT2.toFixed(2)}}{\\ln\\left(\\frac{${results.deltaT1.toFixed(2)}}{${results.deltaT2.toFixed(2)}}\\right)} = ${results.LMTD.toFixed(2)}^\\circ\\text{C}`}
                  />
                </div>
                <p className="text-gray-700 font-medium">
                  Driving Temperature gradient: <strong>{results.LMTD.toFixed(2)}°C</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Surface Area & Sizing */}
        {(activeProof === 'all' || activeProof === 'area') && (
          <div className="bg-[#FFF8F9] border-2 border-[#E8B4B8]/80 rounded-2xl p-5 space-y-4 hover:border-[#C2185B]/60 transition-all">
            <div className="flex items-center justify-between border-b border-[#E8B4B8]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9C1545] text-white text-xs font-extrabold">
                  3
                </span>
                <span className="text-sm font-extrabold text-[#9C1545] tracking-wide uppercase">
                  Heat Transfer Surface Area Requirement (A)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-white px-2.5 py-1 rounded-lg border border-[#E8B4B8] shadow-xs">
                A = {results.area.toFixed(2)} m²
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8B4B8] shadow-xs flex flex-col items-center justify-center gap-2">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest self-start">
                Required Exchanger Area Relation:
              </p>
              <KatexMath
                math="A = \frac{Q}{U \cdot \text{LMTD}} = \frac{Q_{\text{watts}}}{U \cdot \Delta T_{lm}} \quad [\text{m}^2]"
                block
                className="text-sm sm:text-base font-bold text-[#1E1E1E]"
              />
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-[#1E1E1E] space-y-2">
              <span className="font-bold text-[#9C1545]">
                Engineering Computation:
              </span>
              <div className="bg-[#FFF5F7] p-2.5 rounded border border-[#E8B4B8]/50 overflow-x-auto">
                <KatexMath
                  math={`A = \\frac{(${results.Q_kW.toFixed(2)} \\times 10^3\\text{ W})}{(${inputs.U}\\text{ W/m}^2\\cdot\\text{K}) \\times (${results.LMTD.toFixed(2)}^\\circ\\text{C})} = \\mathbf{${results.area.toFixed(2)}\\text{ m}^2}`}
                  block
                />
              </div>
              <p className="text-gray-700 text-center font-medium pt-1">
                With overall conductance <KatexMath math={`U = ${inputs.U}\\text{ W/m}^2\\cdot\\text{K}`} />, the bundle requires <strong className="text-[#9C1545]">{results.area.toFixed(2)} square meters</strong> of thermal contact area.
              </p>
            </div>
          </div>
        )}

        {/* 4. ε-NTU Effectiveness Method */}
        {(activeProof === 'all' || activeProof === 'ntu') && (
          <div className="bg-[#FFF8F9] border-2 border-[#E8B4B8]/80 rounded-2xl p-5 space-y-4 hover:border-[#C2185B]/60 transition-all">
            <div className="flex items-center justify-between border-b border-[#E8B4B8]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9C1545] text-white text-xs font-extrabold">
                  4
                </span>
                <span className="text-sm font-extrabold text-[#9C1545] tracking-wide uppercase">
                  Number of Transfer Units (NTU) & Effectiveness (ε) Method
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-white px-2.5 py-1 rounded-lg border border-[#E8B4B8] shadow-xs">
                ε = {results.effectiveness.toFixed(1)}% | NTU = {results.NTU.toFixed(2)}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8B4B8] shadow-xs space-y-2">
              <KatexMath
                math="C_{\min} = \min\left(\dot{m}_h C_{p,h}, \dot{m}_c C_{p,c}\right), \quad Q_{\max} = C_{\min}\left(T_{h,\text{in}} - T_{c,\text{in}}\right)"
                block
                className="text-xs sm:text-sm font-bold text-[#1E1E1E]"
              />
              <KatexMath
                math="\varepsilon = \frac{Q}{Q_{\max}} \times 100\%, \quad \text{NTU} = \frac{U \cdot A}{C_{\min} \times 1000}, \quad C_r = \frac{C_{\min}}{C_{\max}}"
                block
                className="text-xs sm:text-sm font-bold text-[#1E1E1E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-center space-y-1">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Min Heat Capacity</span>
                <p className="font-bold text-[#9C1545] text-sm">
                  <KatexMath math={`C_{\\min} = ${results.Cmin.toFixed(2)}\\text{ kW/K}`} />
                </p>
                <p className="text-[11px] text-gray-600">Side: {results.Ch < results.Cc ? 'Hot Fluid' : 'Cold Fluid'}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-center space-y-1">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Maximum Possible Heat</span>
                <p className="font-bold text-[#9C1545] text-sm">
                  <KatexMath math={`Q_{\\max} = ${results.QMax.toFixed(2)}\\text{ kW}`} />
                </p>
                <p className="text-[11px] text-gray-600">Theoretical Limit</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-center space-y-1">
                <span className="text-gray-500 font-semibold uppercase text-[10px]">Capacity Ratio</span>
                <p className="font-bold text-[#9C1545] text-sm">
                  <KatexMath math={`C_r = ${results.Cr.toFixed(3)}`} />
                </p>
                <p className="text-[11px] text-gray-600">Dimensionless</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
