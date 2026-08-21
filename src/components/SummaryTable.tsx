import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { MATERIAL_PRESETS } from '../utils/thermalEngine';
import { Table, Search, Download, Copy, Check, Layers, Cpu, CheckCircle2 } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface SummaryTableProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ inputs, results }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'materials'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!results.valid) return null;

  const matProp = MATERIAL_PRESETS[inputs.materialPreset] || { name: 'Custom', k: 0, desc: '' };

  const tableData = [
    {
      name: "Flow Configuration",
      latex: "\\text{Flow Arrangement}",
      value: inputs.flowConfig,
      unit: "-",
      assessment: inputs.flowConfig === 'Counterflow' ? "Optimal counter-current design (highest LMTD)" : "Co-current flow design (lower LMTD)"
    },
    {
      name: "Hot Inlet Temperature",
      latex: "T_{h,\\text{in}}",
      value: `${inputs.THIn.toFixed(1)}`,
      unit: "°C",
      assessment: "Process stream thermal feed temperature"
    },
    {
      name: "Hot Outlet Temperature",
      latex: "T_{h,\\text{out}}",
      value: `${inputs.THOut.toFixed(1)}`,
      unit: "°C",
      assessment: `Cooled by ΔT = ${(inputs.THIn - inputs.THOut).toFixed(1)}°C`
    },
    {
      name: "Cold Inlet Temperature",
      latex: "T_{c,\\text{in}}",
      value: `${inputs.TCIn.toFixed(1)}`,
      unit: "°C",
      assessment: "Coolant supply inlet temperature"
    },
    {
      name: "Cold Outlet Temperature",
      latex: "T_{c,\\text{out}}",
      value: `${results.TCOut.toFixed(2)}`,
      unit: "°C",
      assessment: `Heated by ΔT = ${(results.TCOut - inputs.TCIn).toFixed(2)}°C`
    },
    {
      name: "Total Heat Duty",
      latex: "Q = \\dot{m} C_p \\Delta T",
      value: `${results.Q_kW.toFixed(2)}`,
      unit: "kW",
      assessment: `Rate of thermal energy exchange (${(results.Q_kW / 1000).toFixed(3)} MW)`
    },
    {
      name: "Log Mean Temperature Diff",
      latex: "\\text{LMTD} = \\Delta T_{lm}",
      value: `${results.LMTD.toFixed(2)}`,
      unit: "°C",
      assessment: "Effective mean thermal driving potential across bundle"
    },
    {
      name: "Overall Heat Transfer Coeff",
      latex: "U",
      value: `${inputs.U}`,
      unit: "W/m²·K",
      assessment: "Bundled convective and conductive conductance"
    },
    {
      name: "Required Surface Area",
      latex: "A = \\frac{Q}{U \\cdot \\text{LMTD}}",
      value: `${results.area.toFixed(2)}`,
      unit: "m²",
      assessment: `Calculated net tube bundle contact area (${(results.area * 10.7639).toFixed(1)} sq ft)`
    },
    {
      name: "Heat Capacity Rate Ratio",
      latex: "C_r = \\frac{C_{\\min}}{C_{\\max}}",
      value: `${results.Cr.toFixed(3)}`,
      unit: "-",
      assessment: `C_min on ${results.Ch < results.Cc ? 'Hot fluid side' : 'Cold fluid side'}`
    },
    {
      name: "Exchanger Effectiveness",
      latex: "\\varepsilon = \\frac{Q}{Q_{\\max}}",
      value: `${results.effectiveness.toFixed(1)}%`,
      unit: "%",
      assessment: results.effectiveness > 65 ? "High thermodynamic recovery efficiency" : "Moderate thermodynamic recovery efficiency"
    },
    {
      name: "Number of Transfer Units",
      latex: "\\text{NTU} = \\frac{UA}{C_{\\min}}",
      value: `${results.NTU.toFixed(2)}`,
      unit: "-",
      assessment: "Dimensionless exchanger thermal size factor"
    },
    {
      name: "Tube Alloy Selection",
      latex: "k_{\\text{wall}}",
      value: matProp.name,
      unit: `k = ${matProp.k} W/m·K`,
      assessment: matProp.desc
    }
  ];

  const filteredData = tableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = tableData.map(r => `${r.name}\t${r.value}\t${r.unit}\t${r.assessment}`).join('\n');
    navigator.clipboard.writeText(`Parameter\tValue\tUnit\tEngineering Assessment\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ["Parameter", "Symbol/Formula", "Value", "Unit", "Engineering Assessment"],
      ...tableData.map(r => [`"${r.name}"`, `"${r.latex}"`, `"${r.value}"`, `"${r.unit}"`, `"${r.assessment}"`])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `heaterellaxx_engineering_matrix_${inputs.flowConfig}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Table Header Bar */}
      <div className="p-6 bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF5F7] border-b border-[#E8B4B8]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C2185B] text-white rounded-xl shadow-sm">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#9C1545] tracking-tight">
                Comprehensive Engineering Data Matrix
              </h3>
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#C2185B]/10 text-[#C2185B] rounded-full border border-[#C2185B]/20">
                Formal Specifications
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Tabulated thermodynamic variables, dimensional parameters, and materials comparison
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-white border border-[#E8B4B8] rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#9C1545]'
              }`}
            >
              Performance Parameters
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#C2185B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#9C1545]'
              }`}
            >
              Tube Materials Comparative
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 bg-white hover:bg-[#FFF0F3] border border-[#E8B4B8] text-[#9C1545] rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            title="Copy Table"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3 py-2 bg-[#C2185B] hover:bg-[#AD1457] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {activeTab === 'matrix' ? (
          <>
            {/* Search Input Filter */}
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter matrix by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl focus:outline-none focus:border-[#C2185B] text-gray-800"
                />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Showing {filteredData.length} of {tableData.length} parameters
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E8B4B8]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1E1E1E] text-[#F4C2C2] uppercase tracking-wider font-extrabold border-b border-[#E8B4B8]">
                  <tr>
                    <th className="py-3 px-4">Parameter Name</th>
                    <th className="py-3 px-4">LaTeX Symbol</th>
                    <th className="py-3 px-4">Calculated Value</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Engineering Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-[#FFF5F7]/70 transition-colors' : 'bg-[#FFF8F9]/50 hover:bg-[#FFF5F7] transition-colors'}
                    >
                      <td className="py-3 px-4 font-bold text-[#1E1E1E]">{row.name}</td>
                      <td className="py-3 px-4 font-serif text-[#9C1545]">
                        <KatexMath math={row.latex} />
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-[#9C1545] text-sm">{row.value}</td>
                      <td className="py-3 px-4 font-medium text-gray-600">{row.unit}</td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{row.assessment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Material Comparison Table */
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF5F7] border border-[#E8B4B8] rounded-xl text-xs text-gray-700">
              <strong className="text-[#9C1545]">Tube Material Study:</strong> Comparing thermal conductivity (<KatexMath math="k" /> in <KatexMath math="\text{W/m}\cdot\text{K}" />) across standard heat exchanger metallurgy alloys. High thermal conductivity minimizes conduction thermal resistance across tube walls.
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E8B4B8]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1E1E1E] text-[#F4C2C2] uppercase tracking-wider font-extrabold border-b border-[#E8B4B8]">
                  <tr>
                    <th className="py-3 px-4">Material Alloy</th>
                    <th className="py-3 px-4">Thermal Conductivity (k)</th>
                    <th className="py-3 px-4">Conduction Resistance</th>
                    <th className="py-3 px-4">Primary Application & Corrosion Resistance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {Object.entries(MATERIAL_PRESETS).map(([key, prop], idx) => {
                    const isCurrent = inputs.materialPreset === key;
                    return (
                      <tr
                        key={key}
                        className={isCurrent ? 'bg-[#FFF0F3] border-l-4 border-l-[#C2185B]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF8F9]/50'}
                      >
                        <td className="py-3 px-4 font-bold text-[#1E1E1E] flex items-center gap-2">
                          {prop.name}
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#C2185B] text-white rounded-md">
                              Active Preset
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#9C1545]">
                          <KatexMath math={`k = ${prop.k}\\text{ W/m}\\cdot\\text{K}`} />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">
                          {prop.k > 300 ? 'Negligible (Super Conductive)' : prop.k > 100 ? 'Very Low' : prop.k > 40 ? 'Moderate' : 'Noticeable'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{prop.desc}</td>
                        <td className="py-3 px-4">
                          {isCurrent ? (
                            <span className="flex items-center gap-1 text-[#15803D] font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4" /> Selected
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Alternative</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
