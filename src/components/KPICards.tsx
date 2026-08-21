import React from 'react';
import { ThermalResults } from '../types';
import { Flame, Thermometer, Layers, Percent } from 'lucide-react';

interface KPICardsProps {
  results: ThermalResults;
}

export const KPICards: React.FC<KPICardsProps> = ({ results }) => {
  if (!results.valid) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Heat Duty */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold uppercase text-[#C2185B] tracking-wider">
            Total Heat Rate (Q)
          </span>
          <div className="p-2 bg-[#FFF5F7] rounded-lg text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#2C2C2C]">
          {results.Q_kW.toFixed(2)}
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-between">
          <span>kW Thermal Power</span>
          <span className="text-[#C2185B] font-mono font-bold">{(results.Q_kW / 1000).toFixed(3)} MW</span>
        </div>
      </div>

      {/* 2. Log Mean Temperature Difference */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold uppercase text-[#C2185B] tracking-wider">
            Log Mean Temp Diff (LMTD)
          </span>
          <div className="p-2 bg-[#FFF5F7] rounded-lg text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
            <Thermometer className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#2C2C2C]">
          {results.LMTD.toFixed(2)}
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-between">
          <span>°C Driving Force</span>
          <span className="text-gray-700 font-mono">ΔT1: {results.deltaT1.toFixed(1)}°</span>
        </div>
      </div>

      {/* 3. Required Surface Area */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold uppercase text-[#C2185B] tracking-wider">
            Required Surface Area (A)
          </span>
          <div className="p-2 bg-[#FFF5F7] rounded-lg text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#2C2C2C]">
          {results.area.toFixed(2)}
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-between">
          <span>m² Exchanger Footprint</span>
          <span className="text-[#C2185B] font-mono font-bold">U: {results.area > 0 ? (results.Q_kW*1000 / (results.area * results.LMTD)).toFixed(0) : 0} W/m²K</span>
        </div>
      </div>

      {/* 4. Thermal Effectiveness */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold uppercase text-[#C2185B] tracking-wider">
            Exchanger Effectiveness (ε)
          </span>
          <div className="p-2 bg-[#FFF5F7] rounded-lg text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#2C2C2C]">
          {results.effectiveness.toFixed(1)}%
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center justify-between">
          <span>ε-NTU Method</span>
          <span className="text-[#C2185B] font-mono font-bold">NTU: {results.NTU.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
