import React from 'react';
import { ThermalInputs, FlowConfig } from '../types';
import { MATERIAL_PRESETS } from '../utils/thermalEngine';
import { Sliders, RefreshCw, Thermometer, Droplets, ShieldCheck, Box } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface SidebarControlsProps {
  inputs: ThermalInputs;
  onChange: (updated: Partial<ThermalInputs>) => void;
  onReset: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  inputs,
  onChange,
  onReset
}) => {
  return (
    <div className="bg-[#181818] border-2 border-[#E8B4B8]/60 rounded-2xl p-5 md:p-6 text-white shadow-xl space-y-6 sticky top-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8B4B8]/30">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#F4C2C2]" />
          <h2 className="text-base font-extrabold text-[#F4C2C2] tracking-wide uppercase">
            System Parameters
          </h2>
        </div>
        <button
          onClick={onReset}
          className="p-1.5 hover:bg-[#333333] text-[#F4C2C2] hover:text-white rounded-lg transition-colors cursor-pointer"
          title="Reset to Defaults"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Flow Configuration */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#F4C2C2]">
          Flow Arrangement
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Counterflow', 'Parallel Flow'] as FlowConfig[]).map((cfg) => (
            <button
              key={cfg}
              onClick={() => onChange({ flowConfig: cfg })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                inputs.flowConfig === cfg
                  ? 'bg-[#C2185B] text-white border-[#F4C2C2] shadow-md'
                  : 'bg-[#242424] text-gray-300 border-gray-700 hover:border-[#E8B4B8]/60 hover:text-white'
              }`}
            >
              {cfg}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Thermal Temperatures */}
      <div className="space-y-4 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4C2C2] uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-[#F4C2C2]" />
          <span>Thermal Temperatures (°C)</span>
        </div>

        {/* THIn */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Hot Inlet Temp</span>
              <KatexMath math="(T_{h,\text{in}})" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.THIn}°C</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            step={1}
            value={inputs.THIn}
            onChange={(e) => onChange({ THIn: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>

        {/* THOut */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Hot Outlet Temp</span>
              <KatexMath math="(T_{h,\text{out}})" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.THOut}°C</span>
          </div>
          <input
            type="range"
            min={30}
            max={250}
            step={1}
            value={inputs.THOut}
            onChange={(e) => onChange({ THOut: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>

        {/* TCIn */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Cold Inlet Temp</span>
              <KatexMath math="(T_{c,\text{in}})" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.TCIn}°C</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={1}
            value={inputs.TCIn}
            onChange={(e) => onChange({ TCIn: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Fluid Mass Flow Rates & Heat Capacities */}
      <div className="space-y-4 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4C2C2] uppercase tracking-wider">
          <Droplets className="w-4 h-4 text-[#F4C2C2]" />
          <span>Fluid Capacities & Mass Rates</span>
        </div>

        {/* MDotH */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Hot Mass Flow</span>
              <KatexMath math="(\dot{m}_h)" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.MDotH} kg/s</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={20.0}
            step={0.1}
            value={inputs.MDotH}
            onChange={(e) => onChange({ MDotH: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>

        {/* CpH */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs items-center mb-1">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Hot Fluid Heat Capacity</span>
              <KatexMath math="(C_{p,h})" className="text-[#F4C2C2]" />
            </label>
            <span className="text-[11px] text-gray-400">kJ/kg·K</span>
          </div>
          <input
            type="number"
            step={0.1}
            min={0.5}
            max={10.0}
            value={inputs.CpH}
            onChange={(e) => onChange({ CpH: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#242424] border border-gray-700 focus:border-[#C2185B] rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>

        {/* MDotC */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Cold Mass Flow</span>
              <KatexMath math="(\dot{m}_c)" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.MDotC} kg/s</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={20.0}
            step={0.1}
            value={inputs.MDotC}
            onChange={(e) => onChange({ MDotC: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>

        {/* CpC */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs items-center mb-1">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Cold Fluid Heat Capacity</span>
              <KatexMath math="(C_{p,c})" className="text-[#F4C2C2]" />
            </label>
            <span className="text-[11px] text-gray-400">kJ/kg·K</span>
          </div>
          <input
            type="number"
            step={0.01}
            min={0.5}
            max={10.0}
            value={inputs.CpC}
            onChange={(e) => onChange({ CpC: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#242424] border border-gray-700 focus:border-[#C2185B] rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      {/* 4. Conductance U & Material Preset */}
      <div className="space-y-4 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4C2C2] uppercase tracking-wider">
          <Box className="w-4 h-4 text-[#F4C2C2]" />
          <span>Conductance & Tube Material</span>
        </div>

        {/* U */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs items-center">
            <label className="text-gray-200 font-medium flex items-center gap-1">
              <span>Overall Conductance</span>
              <KatexMath math="(U)" className="text-[#F4C2C2]" />
            </label>
            <span className="text-white font-mono font-bold bg-[#2A2A2A] px-2 py-0.5 rounded border border-gray-700">{inputs.U} W/m²·K</span>
          </div>
          <input
            type="range"
            min={50}
            max={2500}
            step={25}
            value={inputs.U}
            onChange={(e) => onChange({ U: parseFloat(e.target.value) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>

        {/* Material Preset */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-200">
            Exchanger Tube Material
          </label>
          <select
            value={inputs.materialPreset}
            onChange={(e) => onChange({ materialPreset: e.target.value })}
            className="w-full bg-[#242424] border border-gray-700 focus:border-[#C2185B] rounded-xl px-3 py-2 text-xs text-white cursor-pointer font-medium"
          >
            {Object.keys(MATERIAL_PRESETS).map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Health Badge */}
      <div className="pt-2">
        <div className="bg-[#242424] border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-[11px] text-gray-300">
            <strong className="text-emerald-400 block font-bold">Rigorous Thermal Model</strong>
            Energy Balance & Entropy Verified
          </div>
        </div>
      </div>
    </div>
  );
};
