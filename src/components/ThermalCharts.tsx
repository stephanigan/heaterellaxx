import React from 'react';
import { ThermalInputs, ThermalResults } from '../types';
import { generateTempProfile, generateFlowBenchmark } from '../utils/thermalEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface ThermalChartsProps {
  inputs: ThermalInputs;
  results: ThermalResults;
}

export const ThermalCharts: React.FC<ThermalChartsProps> = ({ inputs, results }) => {
  if (!results.valid) return null;

  const tempProfileData = generateTempProfile(inputs, results);
  const benchmark = generateFlowBenchmark(inputs);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Temperature Profile */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDA7A5]/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C2185B]" />
            <h3 className="text-base font-bold text-[#2C2C2C]">
              1. Temperature Profile along Exchanger Length
            </h3>
          </div>
          <span className="text-xs font-bold text-[#C2185B] bg-[#FFF5F7] px-2.5 py-1 rounded-full border border-[#DDA7A5]">
            {inputs.flowConfig}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempProfileData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4C2C2" opacity={0.5} />
              <XAxis
                dataKey="lengthPct"
                tick={{ fontSize: 11, fill: '#2C2C2C' }}
                label={{ value: 'Normalized Exchanger Length (0 = Inlet, 1 = Outlet)', position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 11 }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#2C2C2C' }}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2C2C2C',
                  borderColor: '#DDA7A5',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any) => [`${value}°C`, name === 'TH' ? 'Hot Fluid (T_h)' : 'Cold Fluid (T_c)']}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="TH"
                name="Hot Fluid (T_h)"
                stroke="#C2185B"
                strokeWidth={3.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="TC"
                name="Cold Fluid (T_c)"
                stroke="#2563EB"
                strokeWidth={3.5}
                strokeDasharray={inputs.flowConfig === 'Counterflow' ? '5 5' : undefined}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Flow Benchmark */}
      <div className="bg-white border-2 border-[#DDA7A5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDA7A5]/30">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#C2185B]" />
            <h3 className="text-base font-bold text-[#2C2C2C]">
              2. Flow Configuration Benchmark (Counterflow vs Parallel)
            </h3>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4C2C2" opacity={0.5} />
              <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#2C2C2C' }} />
              <YAxis tick={{ fontSize: 11, fill: '#2C2C2C' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2C2C2C',
                  borderColor: '#DDA7A5',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Counterflow" fill="#C2185B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Parallel Flow" fill="#DDA7A5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
