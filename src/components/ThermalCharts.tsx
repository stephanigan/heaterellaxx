import React, { useState } from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { generateTempProfile, generateFlowBenchmark } from '../utils/thermalEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart2, GitCommit, ArrowRight, ArrowLeft, Sliders, Zap, Thermometer, Layers } from 'lucide-react';
import { KatexMath } from './KatexMath';

interface ThermalChartsProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const ThermalCharts: React.FC<ThermalChartsProps> = ({ inputs, results }) => {
  const [activeChartTab, setActiveChartTab] = useState<'profile' | 'flux' | 'schematic' | 'benchmark' | 'inspector'>('profile');
  const [inspectorPosition, setInspectorPosition] = useState<number>(50); // 0% to 100%

  if (!results.valid) return null;

  const tempProfileData = generateTempProfile(inputs, results);
  const benchmark = generateFlowBenchmark(inputs);

  // Inspector calculation at inspectorPosition
  const normX = inspectorPosition / 100.0;
  const localTH = inputs.THIn - (inputs.THIn - inputs.THOut) * normX;
  let localTC = 0;
  if (inputs.flowConfig === 'Counterflow') {
    localTC = results.TCOut - (results.TCOut - inputs.TCIn) * normX;
  } else {
    localTC = inputs.TCIn + (results.TCOut - inputs.TCIn) * normX;
  }
  const localDeltaT = Math.max(0, localTH - localTC);
  const localHeatFlux_kW_m2 = (inputs.U * localDeltaT) / 1000.0; // kW/m²

  const benchmarkData = [
    {
      metric: 'LMTD (°C)',
      Counterflow: benchmark.counterflowLMTD,
      'Parallel Flow': benchmark.parallelValid ? benchmark.parallelLMTD : 0
    },
    {
      metric: 'Required Area (m²)',
      Counterflow: benchmark.counterflowArea,
      'Parallel Flow': benchmark.parallelValid ? benchmark.parallelArea : 0
    }
  ];

  return (
    <div className="bg-white border-2 border-[#E8B4B8] rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header with Visualization Tabs */}
      <div className="p-6 bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF5F7] border-b border-[#E8B4B8]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C2185B] text-white rounded-xl shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#9C1545] tracking-tight">
                Interactive Thermal Visualizers & Flow Physics
              </h3>
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#C2185B]/10 text-[#C2185B] rounded-full border border-[#C2185B]/20">
                Axial Gradients
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Temperature profiles, local heat flux density, physical bundle schematic, and cross-section node inspector
            </p>
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="flex flex-wrap items-center p-1 bg-white border border-[#E8B4B8] rounded-xl shadow-xs self-start md:self-auto gap-1">
          <button
            onClick={() => setActiveChartTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'profile'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545]'
            }`}
          >
            Temperature Profile
          </button>
          <button
            onClick={() => setActiveChartTab('flux')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'flux'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545]'
            }`}
          >
            Heat Flux Profile
          </button>
          <button
            onClick={() => setActiveChartTab('inspector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'inspector'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545]'
            }`}
          >
            Axial Node Inspector
          </button>
          <button
            onClick={() => setActiveChartTab('schematic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'schematic'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545]'
            }`}
          >
            Exchanger Schematic
          </button>
          <button
            onClick={() => setActiveChartTab('benchmark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'benchmark'
                ? 'bg-[#C2185B] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#9C1545]'
            }`}
          >
            Flow Benchmark
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: Temperature Profile Chart */}
        {activeChartTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-gray-600 font-medium">
                Plotting <strong className="text-[#C2185B]">Hot Stream <KatexMath math="T_h(x)" /></strong> (In: {inputs.THIn}°C → Out: {inputs.THOut}°C) vs <strong className="text-[#0284C7]">Cold Stream <KatexMath math="T_c(x)" /></strong> (In: {inputs.TCIn}°C → Out: {results.TCOut.toFixed(1)}°C)
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-[#FFF0F3] px-3 py-1 rounded-lg border border-[#E8B4B8]">
                Configuration: {inputs.flowConfig}
              </span>
            </div>

            <div className="h-80 w-full bg-[#FFF8F9]/30 p-2 rounded-xl border border-[#E8B4B8]/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempProfileData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8B4B8" opacity={0.6} />
                  <XAxis
                    dataKey="lengthPct"
                    tick={{ fontSize: 11, fill: '#1E1E1E' }}
                    label={{ value: 'Normalized Exchanger Bundle Length (x/L)', position: 'insideBottom', offset: -15, fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#1E1E1E' }}
                    label={{ value: 'Fluid Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1E1E',
                      borderColor: '#E8B4B8',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    formatter={(value: any, name: any) => [`${value}°C`, name === 'TH' ? 'Hot Stream (Th)' : 'Cold Stream (Tc)']}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="TH"
                    name="Hot Stream (T_h)"
                    stroke="#C2185B"
                    strokeWidth={3.5}
                    dot={{ r: 3, fill: '#C2185B' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="TC"
                    name="Cold Stream (T_c)"
                    stroke="#0284C7"
                    strokeWidth={3.5}
                    strokeDasharray={inputs.flowConfig === 'Counterflow' ? '5 5' : undefined}
                    dot={{ r: 3, fill: '#0284C7' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: Heat Flux Density Profile */}
        {activeChartTab === 'flux' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-gray-600 font-medium">
                Local Conductive Heat Flux: <KatexMath math="q''(x) = U \cdot [T_h(x) - T_c(x)]" /> [<KatexMath math="\text{kW/m}^2" />]
              </div>
              <span className="text-xs font-mono font-bold text-[#9C1545] bg-[#FFF0F3] px-3 py-1 rounded-lg border border-[#E8B4B8]">
                Overall Conductance: {inputs.U} W/m²·K
              </span>
            </div>

            <div className="h-80 w-full bg-[#FFF8F9]/30 p-2 rounded-xl border border-[#E8B4B8]/50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tempProfileData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                  <defs>
                    <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C2185B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C2185B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8B4B8" opacity={0.6} />
                  <XAxis
                    dataKey="lengthPct"
                    tick={{ fontSize: 11, fill: '#1E1E1E' }}
                    label={{ value: 'Normalized Exchanger Bundle Length (x/L)', position: 'insideBottom', offset: -15, fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#1E1E1E' }}
                    label={{ value: "Heat Flux q'' (kW/m²)", angle: -90, position: 'insideLeft', fill: '#4B5563', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1E1E',
                      borderColor: '#E8B4B8',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    formatter={(value: any) => [`${value} kW/m²`, 'Local Heat Flux']}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="heatFlux_kW_m2"
                    name="Local Heat Flux q''(x)"
                    stroke="#C2185B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#fluxGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: Axial Node Inspector */}
        {activeChartTab === 'inspector' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FFF5F7] border border-[#E8B4B8] rounded-xl text-xs text-gray-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#9C1545]">
                <Sliders className="w-4 h-4" />
                <span>Interactive Bundle Cross-Section Prober</span>
              </div>
              <p>
                Drag the position slider below to inspect the exact local thermal states at any arbitrary axial location <KatexMath math="x/L" /> along the exchanger channel.
              </p>
            </div>

            {/* Slider Control */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8B4B8] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Inlet Header (0% Length)</span>
                <span className="text-base text-[#C2185B] font-extrabold bg-[#FFF0F3] px-3 py-1 rounded-lg border border-[#E8B4B8]">
                  Axial Position: {inspectorPosition}% (x/L = {normX.toFixed(2)})
                </span>
                <span>Exit Header (100% Length)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={inspectorPosition}
                onChange={(e) => setInspectorPosition(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E8B4B8]/40 rounded-lg appearance-none cursor-pointer accent-[#C2185B]"
              />
            </div>

            {/* Live Node Telemetry Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl text-center space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Local Hot Stream</span>
                <p className="text-2xl font-black text-[#C2185B]">
                  {localTH.toFixed(2)} °C
                </p>
                <span className="text-[11px] text-gray-600">
                  <KatexMath math={`T_h(${normX.toFixed(2)})`} />
                </span>
              </div>

              <div className="p-4 bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl text-center space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Local Cold Stream</span>
                <p className="text-2xl font-black text-[#0284C7]">
                  {localTC.toFixed(2)} °C
                </p>
                <span className="text-[11px] text-gray-600">
                  <KatexMath math={`T_c(${normX.toFixed(2)})`} />
                </span>
              </div>

              <div className="p-4 bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl text-center space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Driving Potential</span>
                <p className="text-2xl font-black text-[#1E1E1E]">
                  {localDeltaT.toFixed(2)} °C
                </p>
                <span className="text-[11px] text-gray-600">
                  <KatexMath math="\Delta T(x) = T_h - T_c" />
                </span>
              </div>

              <div className="p-4 bg-[#FFF8F9] border border-[#E8B4B8] rounded-xl text-center space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Local Heat Flux</span>
                <p className="text-2xl font-black text-[#9C1545]">
                  {localHeatFlux_kW_m2.toFixed(2)} kW/m²
                </p>
                <span className="text-[11px] text-gray-600">
                  <KatexMath math="q''(x) = U \cdot \Delta T" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Physical Exchanger Flow Schematic */}
        {activeChartTab === 'schematic' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF5F7] border border-[#E8B4B8] rounded-xl text-xs text-gray-700">
              <strong className="text-[#9C1545]">Physical Flow Architecture:</strong> Visual schematic of the tube bundle demonstrating counter-current vs co-current fluid interaction, heat duty exchange <KatexMath math="Q" />, and terminal temperature differentials.
            </div>

            <div className="bg-[#1E1E1E] text-white p-6 rounded-2xl border-2 border-[#E8B4B8] space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-bold text-[#F4C2C2] uppercase tracking-wider">
                  Exchanger Bundle Channel Schematic
                </span>
                <span className="text-xs font-mono bg-[#C2185B] text-white px-2.5 py-1 rounded-md">
                  {inputs.flowConfig}
                </span>
              </div>

              {/* Hot Channel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4C2C2] font-bold">
                    Hot Inlet (T_h,in): {inputs.THIn}°C
                  </span>
                  <span className="text-gray-400 font-bold flex items-center gap-1">
                    ṁ_h = {inputs.MDotH} kg/s <ArrowRight className="w-4 h-4 text-[#C2185B]" />
                  </span>
                  <span className="text-[#F4C2C2] font-bold">
                    Hot Outlet (T_h,out): {inputs.THOut}°C
                  </span>
                </div>
                <div className="h-10 bg-gradient-to-r from-[#C2185B] via-[#E11D48] to-[#FB7185] rounded-xl p-2 flex items-center justify-between text-white font-bold text-xs shadow-inner">
                  <span>Inlet Channel (x=0)</span>
                  <span className="text-white/80">Hot Process Stream ➔ ➔ ➔</span>
                  <span>Exit Nozzle (x=L)</span>
                </div>
              </div>

              {/* Heat Transfer Core Wall */}
              <div className="py-2 text-center relative flex items-center justify-center">
                <div className="w-full border-t-2 border-dashed border-[#F4C2C2]/40 absolute"></div>
                <div className="relative bg-[#2A2A2A] border border-[#E8B4B8] px-4 py-1 rounded-full text-xs font-bold text-[#F4C2C2] shadow-sm flex items-center gap-2">
                  <span>⚡ Conductive Wall Heat Flux:</span>
                  <KatexMath math={`Q = ${results.Q_kW.toFixed(2)}\\text{ kW}`} className="text-white font-mono" />
                  <span>|</span>
                  <KatexMath math={`U = ${inputs.U}\\text{ W/m}^2\\cdot\\text{K}`} className="text-white font-mono" />
                </div>
              </div>

              {/* Cold Channel */}
              <div className="space-y-2">
                {inputs.flowConfig === 'Counterflow' ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-sky-300 font-bold">
                        Cold Outlet (T_c,out): {results.TCOut.toFixed(1)}°C
                      </span>
                      <span className="text-gray-400 font-bold flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4 text-sky-400" /> ṁ_c = {inputs.MDotC} kg/s (Counterflow)
                      </span>
                      <span className="text-sky-300 font-bold">
                        Cold Inlet (T_c,in): {inputs.TCIn}°C
                      </span>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-700 rounded-xl p-2 flex items-center justify-between text-white font-bold text-xs shadow-inner">
                      <span>Exit Channel (x=0)</span>
                      <span className="text-white/80">⬅ ⬅ ⬅ Coolant Stream (Counter-Current)</span>
                      <span>Inlet Nozzle (x=L)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-sky-300 font-bold">
                        Cold Inlet (T_c,in): {inputs.TCIn}°C
                      </span>
                      <span className="text-gray-400 font-bold flex items-center gap-1">
                        ṁ_c = {inputs.MDotC} kg/s <ArrowRight className="w-4 h-4 text-sky-400" />
                      </span>
                      <span className="text-sky-300 font-bold">
                        Cold Outlet (T_c,out): {results.TCOut.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-sky-700 via-sky-500 to-sky-400 rounded-xl p-2 flex items-center justify-between text-white font-bold text-xs shadow-inner">
                      <span>Inlet Nozzle (x=0)</span>
                      <span className="text-white/80">Coolant Stream (Co-Current) ➔ ➔ ➔</span>
                      <span>Exit Channel (x=L)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Flow Benchmark Chart */}
        {activeChartTab === 'benchmark' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF5F7] border border-[#E8B4B8] rounded-xl text-xs text-gray-700">
              <strong className="text-[#9C1545]">Thermodynamic Benchmark:</strong> Comparing Counterflow vs Parallel Flow for identical thermal duties. Counterflow maximizes <KatexMath math="\text{LMTD}" /> and minimizes required heat surface footprint <KatexMath math="A" />.
            </div>

            <div className="h-80 w-full bg-[#FFF8F9]/30 p-2 rounded-xl border border-[#E8B4B8]/50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8B4B8" opacity={0.6} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#1E1E1E', fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#1E1E1E', fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1E1E',
                      borderColor: '#E8B4B8',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Counterflow" fill="#C2185B" radius={[8, 8, 0, 0]} name="Counterflow (Optimal)" />
                  <Bar dataKey="Parallel Flow" fill="#E8B4B8" radius={[8, 8, 0, 0]} name="Parallel Flow (Co-Current)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
