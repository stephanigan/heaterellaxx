import React from 'react';
import { Flame, Sparkles, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* Main Rose Gold & Charcoal Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C2C2C] via-[#3D1C28] to-[#2C2C2C] border-2 border-[#DDA7A5] rounded-2xl p-6 md:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#C2185B]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C2185B]/30 border border-[#DDA7A5]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F4C2C2] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C2C2]" />
              Girly + High-Tech Engineering
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#F4C2C2] tracking-tight flex items-center gap-3">
              heaterellaxx
              <Flame className="w-8 h-8 text-[#C2185B] fill-[#C2185B] animate-pulse" />
            </h1>
            <p className="text-lg md:text-xl font-semibold text-[#DDA7A5] mt-1">
              🔥 Heat Analyzer — Heat Exchanger Engineering Engine
            </p>
            <p className="text-sm italic text-gray-300 mt-1">
              "From Heat Equations to Real Engineering Decisions."
            </p>
          </div>

          <div className="bg-[#2C2C2C]/80 border border-[#DDA7A5]/50 rounded-xl p-3.5 text-right hidden sm:block">
            <div className="text-xs text-[#DDA7A5] font-mono">STATUS: OPERATIONAL</div>
            <div className="text-sm font-bold text-[#F4C2C2] mt-0.5">LMTD & ε-NTU Solver</div>
            <div className="text-xs text-gray-400">Precision Thermal Analysis</div>
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-[#FFF5F7] border-l-4 border-l-[#C2185B] border-t border-r border-b border-[#DDA7A5] rounded-xl p-5 shadow-sm text-[#2C2C2C]">
        <div className="flex items-center gap-2 font-bold text-[#C2185B] text-base mb-2">
          <BookOpen className="w-5 h-5 text-[#C2185B]" />
          <span>✨ How to Use heaterellaxx</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          1. Select flow configuration (Counterflow vs Parallel Flow) and set thermal parameters in the <strong>⚙️ System Configuration</strong> sidebar.<br />
          2. Inspect calculated metrics: <strong>Heat Duty (Q)</strong>, <strong>Log Mean Temp Difference (LMTD)</strong>, <strong>Required Surface Area (A)</strong>, and <strong>Thermal Effectiveness (ε)</strong>.<br />
          3. Analyze fluid temperature profiles along exchanger length and compare flow benchmark metrics in the interactive charts.<br />
          4. Expand the <strong>🤖 AI Engineering Interpretation & Decision Support</strong> section for detailed thermal diagnostics and material guidance.
        </p>
      </div>
    </div>
  );
};
