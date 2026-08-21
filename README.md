# 🔥 heaterellaxx | Heat Analyzer

> *"From Heat Equations to Real Engineering Decisions."*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35+-FF4B4B?style=flat&logo=streamlit&logoColor=white)](https://streamlit.io)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**heaterellaxx** is a heat exchanger engineering engine and thermal analyzer designed for chemical engineers, mechanical researchers, and thermal designers. It blends rigorous second-law thermodynamic validation, LMTD, and $\epsilon$-NTU performance calculations with a distinct **"Girly + High-Tech Engineering"** visual aesthetic (Rose Gold `#DDA7A5`, Deep Blush `#F4C2C2`, Sleek Magenta `#C2185B`, and Charcoal Steel `#2C2C2C`).

---

## 🌟 Key Capabilities

- **⚡ Precision Thermal Solvers**:
  - **Log Mean Temperature Difference (LMTD)**: Robust calculations with automated singularity handling for $\Delta T_1 = \Delta T_2$ to prevent division-by-zero.
  - **$\epsilon$-NTU Method**: Computes thermal effectiveness ($\epsilon$), Number of Transfer Units (NTU), heat capacity rates ($C_h, C_c$), and heat capacity rate ratios ($C_r = C_{\min}/C_{\max}$).
  - **Exchanger Sizing**: Determines total heat duty ($Q$ in kW/MW) and required surface area ($A$ in $\text{m}^2$).

- **🔄 Flow Configuration Benchmark**:
  - Direct comparative benchmarking between **Counterflow** and **Parallel Flow** for identical heat duty and fluid flow conditions.
  - Real-time display of area savings and thermal driving force gains.

- **🛡️ Physical & Second-Law Error Prevention**:
  - Real-time thermodynamic boundary checks:
    - Enforces $T_{h,\text{in}} > T_{h,\text{out}}$ and $T_{c,\text{in}} < T_{h,\text{in}}$.
    - Detects parallel flow temperature crossing ($T_{c,\text{out}} > T_{h,\text{out}}$).
    - Detects thermodynamic boundary violations ($T_{c,\text{out}} > T_{h,\text{in}}$).
  - Flags thermal pinch-point warnings when $\Delta T_{\min} < 5^\circ\text{C}$ to avoid thermal stagnation.

- **📈 Interactive Visualizations**:
  - Continuous temperature distribution curves for hot and cold fluids along the normalized exchanger length.
  - Grouped bar charts comparing LMTD and heat surface area across configurations.

- **🧱 Material Conductivity Database**:
  - Built-in tube material presets:
    - **Copper** ($k = 385\text{ W/m}\cdot\text{K}$) — High conductivity, compact units
    - **Aluminum Alloy** ($k = 205\text{ W/m}\cdot\text{K}$) — Lightweight performance
    - **Stainless Steel** ($k = 16\text{ W/m}\cdot\text{K}$) — High corrosion resistance
    - **Titanium Alloy** ($k = 22\text{ W/m}\cdot\text{K}$) — Marine & aggressive fluid resistance

- **📋 Pitch-Ready Data & Automated Diagnostics**:
  - Searchable parameter table with instant copy-to-clipboard and CSV download.
  - Automated AI Engineering Diagnostic Report and downloadable pitch summary reports.

---

## 📐 Thermodynamic Governing Equations

### 1. Heat Duty ($Q$)
$$Q = \dot{m}_h \cdot C_{p,h} \cdot (T_{h,\text{in}} - T_{h,\text{out}}) = \dot{m}_c \cdot C_{p,c} \cdot (T_{c,\text{out}} - T_{c,\text{in}}) \quad [\text{kW}]$$

### 2. Temperature Differences ($\Delta T_1, \Delta T_2$)
- **Counterflow**:
  $$\Delta T_1 = T_{h,\text{in}} - T_{c,\text{out}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{in}}$$
- **Parallel Flow**:
  $$\Delta T_1 = T_{h,\text{in}} - T_{c,\text{in}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{out}}$$

### 3. Log Mean Temperature Difference ($\text{LMTD}$)
$$\text{LMTD} = \begin{cases} \Delta T_1 & \text{if } \Delta T_1 = \Delta T_2 \\ \frac{\Delta T_1 - \Delta T_2}{\ln(\Delta T_1 / \Delta T_2)} & \text{otherwise} \end{cases}$$

### 4. Required Heat Transfer Area ($A$)
$$A = \frac{Q \times 1000}{U \cdot \text{LMTD}} \quad [\text{m}^2]$$

### 5. Effectiveness ($\epsilon$) & NTU
$$C_h = \dot{m}_h \cdot C_{p,h}, \quad C_c = \dot{m}_c \cdot C_{p,c}$$
$$C_{\min} = \min(C_h, C_c), \quad C_{\max} = \max(C_h, C_c), \quad C_r = \frac{C_{\min}}{C_{\max}}$$
$$Q_{\max} = C_{\min} \cdot (T_{h,\text{in}} - T_{c,\text{in}})$$
$$\epsilon = \frac{Q}{Q_{\max}} \times 100\%$$
$$\text{NTU} = \frac{U \cdot A}{C_{\min} \times 1000}$$

---

## 🚀 Quick Start

You can run **heaterellaxx** using either the Python Streamlit engine or the React/TypeScript web application.

### Option A: Python / Streamlit Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/heaterellaxx.git
   cd heaterellaxx
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch the Streamlit app**:
   ```bash
   streamlit run heaterellaxx.py
   ```
   *or*
   ```bash
   streamlit run app.py
   ```

---

### Option B: React + TypeScript Web Application

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
├── heaterellaxx.py             # Streamlit main application script
├── app.py                      # Streamlit entry point wrapper
├── requirements.txt            # Python dependencies (Streamlit, Pandas, NumPy, Plotly)
├── package.json                # Node.js dependencies (React, Vite, Tailwind, Recharts)
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite + Tailwind build configuration
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Main application dashboard layout
│   ├── index.css               # Tailwind CSS theme styling
│   ├── types.ts                # TypeScript interfaces & thermal models
│   ├── utils/
│   │   └── thermalEngine.ts    # LMTD, ε-NTU, & boundary calculation engine
│   └── components/
│       ├── Header.tsx          # Rose Gold / High-Tech banner & instructions
│       ├── SidebarControls.tsx # Parameter sliders & material selection
│       ├── KPICards.tsx        # Styled metric KPI cards (Q, LMTD, Area, ε)
│       ├── ThermalCharts.tsx   # Temperature profiles & flow benchmarks (Recharts)
│       ├── SummaryTable.tsx    # Detailed engineering parameters & CSV export
│       ├── AIEngineeringAssistant.tsx # Automated diagnostics & pinch point feedback
│       └── ExportModal.tsx     # Technical calculation summary & TXT export
└── README.md                   # Project documentation
```

---

## 🎨 Theme Palette & Design System

| Element | Color Hex | Sample |
| :--- | :--- | :--- |
| **Primary Accent** | `#C2185B` | Rose Magenta |
| **Secondary Accent** | `#DDA7A5` | Soft Rose Gold |
| **Highlight & Cards** | `#F4C2C2` / `#FFF5F7` | Deep Blush / Warm Pink |
| **Canvas Background** | `#FDF2F4` | Soft Tint |
| **Structure & Sidebar** | `#2C2C2C` | Charcoal Steel |

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
