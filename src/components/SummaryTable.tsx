import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { MATERIAL_PRESETS } from '../utils/thermalEngine';
import { Table, Search, Download, Copy, Check } from 'lucide-react';

interface SummaryTableProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ inputs, results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!results.valid) return null;

  const matProp = MATERIAL_PRESETS[inputs.materialPreset] || { name: 'Custom', k: 0, desc: '' };

  const tableData = [
    { parameter: "Flow Configuration", value: inputs.flowConfig, unit: "-", assessment: "Optimal flow arrangement selected" },
    { parameter: "Hot Fluid Inlet Temp (T_h_in)", value: `${inputs.THIn.toFixed(1)}`, unit: "°C", assessment: "Primary thermal energy source" },
    { parameter: "Hot Fluid Outlet Temp (T_h_out)", value: `${inputs.THOut.toFixed(1)}`, unit: "°C", assessment: `Cooled by ${(inputs.THIn - inputs.THOut).toFixed(1)}°C` },
    { parameter: "Cold Fluid Inlet Temp (T_c_in)", value: `${inputs.TCIn.toFixed(1)}`, unit: "°C", assessment: "Coolant supply temperature" },
    { parameter: "Cold Fluid Outlet Temp (T_c_out)", value: `${results.TCOut.toFixed(1)}`, unit: "°C", assessment: `Heated by ${(results.TCOut - inputs.TCIn).toFixed(1)}°C` },
    { parameter: "Total Heat Rate (Q)", value: `${results.Q_kW.toFixed(2)}`, unit: "kW", assessment: "Transferred thermal power duty" },
    { parameter: "Log Mean Temp Difference (LMTD)", value: `${results.LMTD.toFixed(2)}`, unit: "°C", assessment: "Effective thermal driving force" },
    { parameter: "Overall Heat Transfer Coeff (U)", value: `${inputs.U}`, unit: "W/m²·K", assessment: "Overall conductance rating" },
    { parameter: "Required Heat Surface Area (A)", value: `${results.area.toFixed(2)}`, unit: "m²", assessment: "Calculated exchanger footprint" },
    { parameter: "Heat Capacity Rate Ratio (C_r)", value: `${results.Cr.toFixed(3)}`, unit: "-", assessment: `C_min/C_max ratio (C_min = ${results.Ch < results.Cc ? 'Hot' : 'Cold'} side)` },
    { parameter: "Exchanger Effectiveness (ε)", value: `${results.effectiveness.toFixed(1)}%`, unit: "%", assessment: results.effectiveness > 60 ? "High thermodynamic efficiency" : "Moderate thermodynamic efficiency" },
    { parameter: "Number of Transfer Units (NTU)", value: `${results.NTU.toFixed(2)}`, unit: "-", assessment: "Dimensionless exchanger size factor" },
    { parameter: "Tube Material Preset", value: matProp.name, unit: `k=${matProp.k} W/mK`, assessment: matProp.desc }
  ];

  const filteredData = tableData.filter(item =>
    item.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = tableData.map(r => `${r.parameter}\t${r.value}\t${r.unit}\t${r.assessment}`).join('\n');
    navigator.clipboard.writeText(`Parameter\tValue\tUnit\tEngineering Assessment\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ["Parameter", "Value", "Unit", "Engineering Assessment"],
      ...tableData.map(r => [`"${r.parameter}"`, `"${r.value}"`, `"${r.unit}"`, `"${r.assessment}"`])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `heaterellaxx_summary_${inputs.flowConfig}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border-2 border-[#DDA7A5] rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#DDA7A5]/30">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-[#C2185B]" />
          <h3 className="text-lg font-bold text-[#2C2C2C]">📋 Detailed Engineering Data Summary</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-[#FFF5F7] border border-[#DDA7A5] rounded-lg focus:outline-none focus:border-[#C2185B] text-gray-800 w-48"
            />
          </div>

          <button
            onClick={handleCopy}
            className="p-2 bg-[#FFF5F7] hover:bg-[#C2185B] hover:text-white border border-[#DDA7A5] text-[#C2185B] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Copy Table"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="p-2 bg-[#C2185B] hover:bg-[#AD1457] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Pandas Dataframe Styled Table */}
      <div className="overflow-x-auto rounded-xl border border-[#DDA7A5]/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#2C2C2C] text-[#F4C2C2] uppercase tracking-wider font-extrabold border-b border-[#DDA7A5]">
            <tr>
              <th className="py-3 px-4">Parameter</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Unit</th>
              <th className="py-3 px-4">Engineering Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FDF2F4]/50 hover:bg-[#FFF5F7]'}>
                <td className="py-2.5 px-4 font-bold text-[#2C2C2C]">{row.parameter}</td>
                <td className="py-2.5 px-4 font-mono font-extrabold text-[#C2185B]">{row.value}</td>
                <td className="py-2.5 px-4 font-medium text-gray-500">{row.unit}</td>
                <td className="py-2.5 px-4 text-gray-700">{row.assessment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
