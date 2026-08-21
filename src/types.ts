export type FlowConfig = 'Counterflow' | 'Parallel Flow';

export interface ThermalInputs {
  flowConfig: FlowConfig;
  THIn: number;       // Hot inlet temp (°C)
  THOut: number;      // Hot outlet temp (°C)
  TCIn: number;       // Cold inlet temp (°C)
  MDotH: number;      // Hot fluid mass flow rate (kg/s)
  CpH: number;        // Hot fluid specific heat (kJ/kg·K)
  MDotC: number;      // Cold fluid mass flow rate (kg/s)
  CpC: number;        // Cold fluid specific heat (kJ/kg·K)
  U: number;          // Overall heat transfer coefficient (W/m²·K)
  materialPreset: string;
}

export interface MaterialProp {
  name: string;
  k: number; // thermal conductivity W/m·K
  desc: string;
}

export interface ThermalResults {
  valid: boolean;
  errorMsg?: string;
  warningMsg?: string;
  Q_kW: number;
  TCOut: number;
  deltaT1: number;
  deltaT2: number;
  LMTD: number;
  area: number;
  Ch: number;
  Cc: number;
  Cmin: number;
  Cmax: number;
  Cr: number;
  QMax: number;
  effectiveness: number;
  NTU: number;
}

export interface FlowBenchmark {
  counterflowLMTD: number;
  counterflowArea: number;
  parallelLMTD: number;
  parallelArea: number;
  parallelValid: boolean;
}

export interface TempProfilePoint {
  x: number;          // Normalized length 0 to 1
  lengthPct: string;  // E.g. "50%"
  TH: number;         // Hot fluid temp (°C)
  TC: number;         // Cold fluid temp (°C)
}
