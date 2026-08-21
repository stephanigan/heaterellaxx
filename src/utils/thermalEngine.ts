import { ThermalInputs, ThermalResults, MaterialProp, FlowBenchmark, TempProfilePoint } from '../types';

export const MATERIAL_PRESETS: Record<string, MaterialProp> = {
  "Copper (High Conductivity k=385 W/m·K)": {
    name: "Copper",
    k: 385,
    desc: "Excellent thermal conductivity, ideal for compact high-efficiency units."
  },
  "Aluminum Alloy (Conductivity k=205 W/m·K)": {
    name: "Aluminum Alloy",
    k: 205,
    desc: "Lightweight with strong thermal conductivity."
  },
  "Stainless Steel (Moderate k=16 W/m·K)": {
    name: "Stainless Steel",
    k: 16,
    desc: "High corrosion resistance, suitable for harsh chemical environments."
  },
  "Titanium Alloy (Specialized k=22 W/m·K)": {
    name: "Titanium Alloy",
    k: 22,
    desc: "Extreme resistance to marine seawater and aggressive fluids."
  }
};

export function calculateThermalPerformance(inputs: ThermalInputs): ThermalResults {
  const { flowConfig, THIn, THOut, TCIn, MDotH, CpH, MDotC, CpC, U } = inputs;

  // Check 1: THIn must be strictly greater than THOut
  if (THIn <= THOut) {
    return {
      valid: false,
      errorMsg: `⛔ Invalid Temperature Constraint: Hot fluid inlet temperature (${THIn.toFixed(1)}°C) must be strictly greater than hot fluid outlet temperature (${THOut.toFixed(1)}°C).`,
      Q_kW: 0, TCOut: 0, deltaT1: 0, deltaT2: 0, LMTD: 0, area: 0,
      Ch: 0, Cc: 0, Cmin: 0, Cmax: 0, Cr: 0, QMax: 0, effectiveness: 0, NTU: 0
    };
  }

  // Check 2: TCIn must be strictly lower than THIn
  if (TCIn >= THIn) {
    return {
      valid: false,
      errorMsg: `⛔ Thermodynamic Violation: Cold fluid inlet temperature (${TCIn.toFixed(1)}°C) must be strictly lower than hot fluid inlet temperature (${THIn.toFixed(1)}°C).`,
      Q_kW: 0, TCOut: 0, deltaT1: 0, deltaT2: 0, LMTD: 0, area: 0,
      Ch: 0, Cc: 0, Cmin: 0, Cmax: 0, Cr: 0, QMax: 0, effectiveness: 0, NTU: 0
    };
  }

  // Hot fluid heat capacity rate & duty
  const Ch = MDotH * CpH; // kW/K
  const Q_kW = Ch * (THIn - THOut); // kW

  // Cold fluid heat capacity rate & outlet temp
  const Cc = MDotC * CpC; // kW/K
  const TCOut = TCIn + (Q_kW / Cc);

  // Check 3: Cold outlet cannot exceed thermodynamic bounds
  let warningMsg: string | undefined = undefined;
  if (flowConfig === "Counterflow" && TCOut > THIn) {
    return {
      valid: false,
      errorMsg: `⚠️ Thermodynamic Boundary Exceeded: Calculated Cold Outlet Temp (${TCOut.toFixed(1)}°C) exceeds Hot Inlet Temp (${THIn.toFixed(1)}°C). Reduce hot flow rate or increase cold flow rate.`,
      Q_kW, TCOut, deltaT1: 0, deltaT2: 0, LMTD: 0, area: 0,
      Ch, Cc, Cmin: 0, Cmax: 0, Cr: 0, QMax: 0, effectiveness: 0, NTU: 0
    };
  } else if (flowConfig === "Parallel Flow" && TCOut > THOut) {
    return {
      valid: false,
      errorMsg: `⚠️ Parallel Flow Temperature Cross: In Parallel Flow, Cold Outlet Temp (${TCOut.toFixed(1)}°C) cannot exceed Hot Outlet Temp (${THOut.toFixed(1)}°C). Switch to Counterflow or adjust mass flow rates.`,
      Q_kW, TCOut, deltaT1: 0, deltaT2: 0, LMTD: 0, area: 0,
      Ch, Cc, Cmin: 0, Cmax: 0, Cr: 0, QMax: 0, effectiveness: 0, NTU: 0
    };
  }

  // Delta T definitions
  let deltaT1 = 0;
  let deltaT2 = 0;

  if (flowConfig === "Counterflow") {
    deltaT1 = THIn - TCOut;
    deltaT2 = THOut - TCIn;
  } else {
    deltaT1 = THIn - TCIn;
    deltaT2 = THOut - TCOut;
  }

  if (deltaT1 <= 0 || deltaT2 <= 0) {
    return {
      valid: false,
      errorMsg: `⛔ Temperature Pinch/Cross Error: ΔT1 = ${deltaT1.toFixed(2)}°C, ΔT2 = ${deltaT2.toFixed(2)}°C. Heat exchanger cannot operate under these bounds. Switch to Counterflow or adjust parameters.`,
      Q_kW, TCOut, deltaT1, deltaT2, LMTD: 0, area: 0,
      Ch, Cc, Cmin: 0, Cmax: 0, Cr: 0, QMax: 0, effectiveness: 0, NTU: 0
    };
  }

  // LMTD calculation with edge case handling for deltaT1 == deltaT2
  let LMTD = 0;
  if (Math.abs(deltaT1 - deltaT2) < 1e-5) {
    LMTD = deltaT1;
  } else {
    LMTD = (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2);
  }

  // Surface Area A = Q_watts / (U * LMTD)
  const Q_watts = Q_kW * 1000.0;
  const area = Q_watts / (U * LMTD);

  // Effectiveness calculation
  const Cmin = Math.min(Ch, Cc);
  const Cmax = Math.max(Ch, Cc);
  const Cr = Cmax > 0 ? Cmin / Cmax : 0;
  const QMax = Cmin * (THIn - TCIn);
  const effectiveness = QMax > 0 ? (Q_kW / QMax) * 100.0 : 0;
  const NTU = Cmin > 0 ? (U * area) / (Cmin * 1000.0) : 0;

  return {
    valid: true,
    warningMsg,
    Q_kW,
    TCOut,
    deltaT1,
    deltaT2,
    LMTD,
    area,
    Ch,
    Cc,
    Cmin,
    Cmax,
    Cr,
    QMax,
    effectiveness,
    NTU
  };
}

export function generateTempProfile(inputs: ThermalInputs, results: ThermalResults): TempProfilePoint[] {
  if (!results.valid) return [];

  const { flowConfig, THIn, THOut, TCIn } = inputs;
  const { TCOut } = results;

  const points: TempProfilePoint[] = [];
  const steps = 50;

  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const TH = THIn - (THIn - THOut) * x;
    
    let TC = 0;
    if (flowConfig === "Counterflow") {
      // Cold fluid flows right to left (enters x=1, exits x=0)
      TC = TCOut - (TCOut - TCIn) * x;
    } else {
      // Parallel flow (enters x=0, exits x=1)
      TC = TCIn + (TCOut - TCIn) * x;
    }

    points.push({
      x,
      lengthPct: `${Math.round(x * 100)}%`,
      TH: Number(TH.toFixed(2)),
      TC: Number(TC.toFixed(2))
    });
  }

  return points;
}

export function generateFlowBenchmark(inputs: ThermalInputs): FlowBenchmark {
  const { THIn, THOut, TCIn, MDotH, CpH, MDotC, CpC, U } = inputs;

  const Ch = MDotH * CpH;
  const Q_kW = Ch * (THIn - THOut);
  const Cc = MDotC * CpC;
  const TCOut = TCIn + (Q_kW / Cc);
  const Q_watts = Q_kW * 1000.0;

  // Counterflow
  const cfT1 = THIn - TCOut;
  const cfT2 = THOut - TCIn;
  let cfLMTD = 0;
  if (cfT1 > 0 && cfT2 > 0) {
    cfLMTD = Math.abs(cfT1 - cfT2) < 1e-5 ? cfT1 : (cfT1 - cfT2) / Math.log(cfT1 / cfT2);
  }
  const cfArea = cfLMTD > 0 ? Q_watts / (U * cfLMTD) : 0;

  // Parallel
  const pfT1 = THIn - TCIn;
  const pfT2 = THOut - TCOut;
  const pfValid = pfT1 > 0 && pfT2 > 0 && TCOut <= THOut;
  let pfLMTD = 0;
  if (pfValid) {
    pfLMTD = Math.abs(pfT1 - pfT2) < 1e-5 ? pfT1 : (pfT1 - pfT2) / Math.log(pfT1 / pfT2);
  }
  const pfArea = pfLMTD > 0 ? Q_watts / (U * pfLMTD) : 0;

  return {
    counterflowLMTD: Number(cfLMTD.toFixed(2)),
    counterflowArea: Number(cfArea.toFixed(2)),
    parallelLMTD: Number(pfLMTD.toFixed(2)),
    parallelArea: Number(pfArea.toFixed(2)),
    parallelValid: pfValid
  };
}
