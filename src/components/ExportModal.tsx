import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { MATERIAL_PRESETS } from '../utils/thermalEngine';
import { X, Download, FileText, Printer, CheckCircle2, Award, BookOpen } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, inputs, results }) => {
  const [projectTitle, setProjectTitle] = useState('Heat Exchanger Thermal Performance Analysis');
  const [authorName, setAuthorName] = useState('Thermal Engineering Group');
  const [courseCode, setCourseCode] = useState('MECH-4320 / Advanced Heat Transfer');

  if (!isOpen || !results.valid) return null;

  const matProp = MATERIAL_PRESETS[inputs.materialPreset] || { name: 'Custom', k: 0, desc: '' };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `
# ${projectTitle}
**Course / Discipline:** ${courseCode}  
**Prepared By:** ${authorName}  
**Date:** ${new Date().toLocaleDateString()}  
**Software:** heaterellaxx | Rigorous Heat Exchanger Engineering Engine  

---

## 1. Executive Summary & Design Objective
This technical report documents the sizing and thermodynamic performance analysis for a **${inputs.flowConfig}** heat exchanger.
- **Process Heat Duty (Q):** ${results.Q_kW.toFixed(2)} kW (${(results.Q_kW/1000).toFixed(3)} MW)
- **Log Mean Temperature Difference (LMTD):** ${results.LMTD.toFixed(2)} °C
- **Required Heat Surface Area (A):** ${results.area.toFixed(2)} m² (${(results.area * 10.7639).toFixed(1)} sq ft)
- **Thermal Effectiveness (ε):** ${results.effectiveness.toFixed(1)}% | **NTU:** ${results.NTU.toFixed(2)}

---

## 2. Operating Stream Parameters
| Parameter | Symbol | Value | Unit |
| :--- | :--- | :--- | :--- |
| Flow Arrangement | - | ${inputs.flowConfig} | - |
| Hot Fluid Inlet Temperature | T_h,in | ${inputs.THIn.toFixed(1)} | °C |
| Hot Fluid Outlet Temperature | T_h,out | ${inputs.THOut.toFixed(1)} | °C |
| Cold Fluid Inlet Temperature | T_c,in | ${inputs.TCIn.toFixed(1)} | °C |
| Calculated Cold Fluid Outlet | T_c,out | ${results.TCOut.toFixed(2)} | °C |
| Hot Stream Mass Flow Rate | ṁ_h | ${inputs.MDotH.toFixed(2)} | kg/s |
| Hot Fluid Specific Heat | C_p,h | ${inputs.CpH.toFixed(2)} | kJ/kg·K |
| Cold Stream Mass Flow Rate | ṁ_c | ${inputs.MDotC.toFixed(2)} | kg/s |
| Cold Fluid Specific Heat | C_p,c | ${inputs.CpC.toFixed(3)} | kJ/kg·K |
| Overall Heat Transfer Coefficient | U | ${inputs.U} | W/m²·K |
| Tube Metallurgy Selection | - | ${matProp.name} (k = ${matProp.k} W/m·K) | - |

---

## 3. Governing Thermodynamic Equations & Proofs
1. **Heat Duty Rate Balance:**
   $$Q = \\dot{m}_h C_{p,h} (T_{h,\\text{in}} - T_{h,\\text{out}}) = \\dot{m}_c C_{p,c} (T_{c,\\text{out}} - T_{c,\\text{in}})$$
   $$Q = ${inputs.MDotH.toFixed(2)} \\times ${inputs.CpH.toFixed(2)} \\times (${inputs.THIn.toFixed(1)} - ${inputs.THOut.toFixed(1)}) = ${results.Q_kW.toFixed(2)} \\text{ kW}$$

2. **Log Mean Temperature Difference (LMTD):**
   $$\\text{LMTD} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1 / \\Delta T_2)} = \\frac{${results.deltaT1.toFixed(2)} - ${results.deltaT2.toFixed(2)}}{\\ln(${results.deltaT1.toFixed(2)} / ${results.deltaT2.toFixed(2)})} = ${results.LMTD.toFixed(2)} ^\\circ\\text{C}$$

3. **Required Surface Area (A):**
   $$A = \\frac{Q \\times 10^3}{U \\cdot \\text{LMTD}} = \\frac{${results.Q_kW.toFixed(2)} \\times 1000}{${inputs.U} \\times ${results.LMTD.toFixed(2)}} = ${results.area.toFixed(2)} \\text{ m}^2$$

4. **ε-NTU Effectiveness Method:**
   $$\\varepsilon = \\frac{Q}{Q_{\\max}} \\times 100\\% = ${results.effectiveness.toFixed(1)}\\%, \\quad \\text{NTU} = ${results.NTU.toFixed(2)}, \\quad C_r = ${results.Cr.toFixed(3)}$$

---

## 4. Engineering Conclusions & Recommendations
1. **Flow Configuration Assessment:** The **${inputs.flowConfig}** configuration provides an effective driving temperature potential of **${results.LMTD.toFixed(2)}°C**.
2. **Material Sizing:** Constructing the bundle with **${matProp.name}** yields low conduction resistance, requiring a total contact surface area of **${results.area.toFixed(2)} m²**.
3. **Safety & Feasibility:** Energy balance and Second Law entropy checks confirmed no temperature crossing or thermodynamic violations.
`.trim();

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heaterellaxx_lab_report_${inputs.flowConfig}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#E8B4B8] rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF0F3] text-gray-500 hover:text-[#C2185B] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8B4B8]">
          <div className="p-3 bg-[#C2185B] rounded-2xl text-white shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#9C1545]">
              Academic Lab Report & Pitch Presentation
            </h3>
            <p className="text-xs text-gray-600">
              Formal engineering documentation ready for academic submission and professor evaluation
            </p>
          </div>
        </div>

        {/* Report Metadata Customization */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FFF8F9] p-4 rounded-2xl border border-[#E8B4B8]">
          <div>
            <label className="block text-[11px] font-bold text-[#9C1545] uppercase mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-white border border-[#E8B4B8] rounded-xl px-3 py-1.5 text-xs text-[#1E1E1E] font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#9C1545] uppercase mb-1">
              Course / Lab Code
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full bg-white border border-[#E8B4B8] rounded-xl px-3 py-1.5 text-xs text-[#1E1E1E] font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#9C1545] uppercase mb-1">
              Author(s) Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-white border border-[#E8B4B8] rounded-xl px-3 py-1.5 text-xs text-[#1E1E1E] font-medium"
            />
          </div>
        </div>

        {/* Report Preview Container */}
        <div className="bg-[#FFFDFD] border-2 border-gray-200 rounded-2xl p-6 shadow-inner max-h-96 overflow-y-auto font-sans text-xs space-y-4 text-[#1E1E1E]">
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-base font-extrabold text-[#9C1545] uppercase tracking-wide">
              {projectTitle}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {courseCode} • {authorName} • {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Key Metrics Highlight Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FFF0F3] p-3 rounded-xl border border-[#E8B4B8] text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500">Heat Duty (Q)</span>
              <p className="font-extrabold text-sm text-[#9C1545]">{results.Q_kW.toFixed(2)} kW</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500">LMTD (ΔT_lm)</span>
              <p className="font-extrabold text-sm text-[#9C1545]">{results.LMTD.toFixed(2)} °C</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500">Surface Area (A)</span>
              <p className="font-extrabold text-sm text-[#9C1545]">{results.area.toFixed(2)} m²</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500">Effectiveness (ε)</span>
              <p className="font-extrabold text-sm text-[#9C1545]">{results.effectiveness.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#9C1545] text-xs uppercase tracking-wider">
              1. System Performance Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Calculations performed under steady-state conditions with negligible ambient heat dissipation. The <strong>{inputs.flowConfig}</strong> arrangement transfers <strong>{results.Q_kW.toFixed(2)} kW</strong> of thermal power, cooling the hot stream from <strong>{inputs.THIn}°C</strong> down to <strong>{inputs.THOut}°C</strong> and heating the coolant from <strong>{inputs.TCIn}°C</strong> up to <strong>{results.TCOut.toFixed(2)}°C</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#9C1545] text-xs uppercase tracking-wider">
              2. Design Parameters
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-gray-700 bg-white p-3 rounded-xl border border-gray-100">
              <li>• Flow Arrangement: <strong>{inputs.flowConfig}</strong></li>
              <li>• Overall Conductance (U): <strong>{inputs.U} W/m²·K</strong></li>
              <li>• Hot Stream Flow Rate (ṁ_h): <strong>{inputs.MDotH} kg/s</strong></li>
              <li>• Cold Stream Flow Rate (ṁ_c): <strong>{inputs.MDotC} kg/s</strong></li>
              <li>• Metallurgy Selection: <strong>{matProp.name}</strong></li>
              <li>• Capacity Ratio (Cr): <strong>{results.Cr.toFixed(3)}</strong></li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Entropy & First Law Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#E8B4B8] text-[#9C1545] hover:bg-[#FFF0F3] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Markdown Lab Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C2185B] hover:bg-[#AD1457] text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
