import React from 'react';
import { ThermalInputs, FlowConfig } from '../types';
import { MATERIAL_PRESETS } from '../utils/thermalEngine';
import { Settings, RefreshCw, Thermometer, Droplets, ShieldAlert } from 'lucide-react';

interface SidebarControlsProps {
  inputs: ThermalInputs;
  onChange: (updated: Partial<ThermalInputs>) => void;
  onReset: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({ inputs, onChange, onReset }) => {
  return (
    <div className="bg-[#2C2C2C] border-2 border-[#DDA7A5] rounded-2xl p-5 shadow-xl text-white space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDA7A5]/40">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#F4C2C2]" />
          <h2 className="text-lg font-bold text-[#F4C2C2] tracking-wide">⚙️ System Configuration</h2>
        </div>
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-[#3D1C28] hover:bg-[#C2185B] border border-[#DDA7A5]/50 text-[#F4C2C2] hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
          title="Reset Parameters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Flow Configuration */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#F4C2C2]">
          Flow Configuration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Counterflow', 'Parallel Flow'] as FlowConfig[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ flowConfig: mode })}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                inputs.flowConfig === mode
                  ? 'bg-[#C2185B] text-white border-[#F4C2C2] shadow-md'
                  : 'bg-[#1A1A1A] text-gray-300 border-gray-700 hover:border-[#DDA7A5]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Thermal Temperature Controls */}
      <div className="space-y-4 pt-2 border-t border-[#DDA7A5]/20">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#DDA7A5] uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-[#F4C2C2]" />
          <span>Thermal Temperatures (°C)</span>
        </div>

        {/* THIn */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Hot Inlet Temp (T_h_in)</label>
            <span className="text-white font-mono font-bold">{inputs.THIn}°C</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Hot Outlet Temp (T_h_out)</label>
            <span className="text-white font-mono font-bold">{inputs.THOut}°C</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Cold Inlet Temp (T_c_in)</label>
            <span className="text-white font-mono font-bold">{inputs.TCIn}°C</span>
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

      {/* 3. Fluid Flow Rates & Properties */}
      <div className="space-y-4 pt-2 border-t border-[#DDA7A5]/20">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#DDA7A5] uppercase tracking-wider">
          <Droplets className="w-4 h-4 text-[#F4C2C2]" />
          <span>Fluid Flow & Heat Capacity</span>
        </div>

        {/* MDotH */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Hot Fluid Flow (m_dot_h)</label>
            <span className="text-white font-mono font-bold">{inputs.MDotH} kg/s</span>
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
          <label className="block text-xs font-semibold text-[#F4C2C2]">Hot Fluid Cp (kJ/kg·K)</label>
          <input
            type="number"
            step={0.1}
            min={0.5}
            max={10.0}
            value={inputs.CpH}
            onChange={(e) => onChange({ CpH: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#1A1A1A] border border-gray-700 focus:border-[#C2185B] rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>

        {/* MDotC */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Cold Fluid Flow (m_dot_c)</label>
            <span className="text-white font-mono font-bold">{inputs.MDotC} kg/s</span>
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
          <label className="block text-xs font-semibold text-[#F4C2C2]">Cold Fluid Cp (C_p_c kJ/kg·K)</label>
          <input
            type="number"
            step={0.01}
            min={0.5}
            max={10.0}
            value={inputs.CpC}
            onChange={(e) => onChange({ CpC: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#1A1A1A] border border-gray-700 focus:border-[#C2185B] rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>

        {/* U */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="text-[#F4C2C2] font-semibold">Heat Transfer Coeff (U)</label>
            <span className="text-white font-mono font-bold">{inputs.U} W/m²·K</span>
          </div>
          <input
            type="range"
            min={10}
            max={2000}
            step={10}
            value={inputs.U}
            onChange={(e) => onChange({ U: parseInt(e.target.value, 10) })}
            className="w-full accent-[#C2185B] cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Equipment Preset */}
      <div className="space-y-2 pt-2 border-t border-[#DDA7A5]/20">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#F4C2C2]">
          Material / Tube Preset
        </label>
        <select
          value={inputs.materialPreset}
          onChange={(e) => onChange({ materialPreset: e.target.value })}
          className="w-full bg-[#1A1A1A] border border-[#DDA7A5]/50 focus:border-[#C2185B] rounded-lg px-3 py-2 text-xs text-white font-medium"
        >
          {Object.keys(MATERIAL_PRESETS).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
