import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

# ------------------------------------------------------------------------------
# 1. PAGE CONFIGURATION & CUSTOM CSS ("GIRLY + HIGH-TECH ENGINEERING" THEME)
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="heaterellaxx | Heat Analyzer",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling for Girly + High-Tech aesthetic
st.markdown("""
<style>
    /* Theme Color Variables */
    :root {
        --primary-accent: #C2185B;
        --secondary-rose: #DDA7A5;
        --blush-pink: #F4C2C2;
        --bg-light: #FDF2F4;
        --card-bg: #FFFFFF;
        --charcoal: #2C2C2C;
    }
    
    .stApp {
        background-color: #FDF2F4;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Sidebar Customization */
    [data-testid="stSidebar"] {
        background-color: #2C2C2C !important;
        border-right: 2px solid #DDA7A5;
    }
    
    [data-testid="stSidebar"] * {
        color: #F8E8EE !important;
    }

    [data-testid="stSidebar"] .stSelectbox label, 
    [data-testid="stSidebar"] .stSlider label,
    [data-testid="stSidebar"] .stNumberInput label {
        color: #F4C2C2 !important;
        font-weight: 600;
    }

    /* Metric Display Cards */
    .metric-card {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #DDA7A5;
        box-shadow: 0 4px 12px rgba(194, 24, 91, 0.08);
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(194, 24, 91, 0.15);
    }

    .metric-label {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #C2185B;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
    }

    .metric-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: #2C2C2C;
    }

    .metric-unit {
        font-size: 0.9rem;
        color: #6B7280;
        font-weight: 500;
    }

    /* Main Header Styling */
    .main-header {
        background: linear-gradient(135deg, #2C2C2C 0%, #3D1C28 100%);
        border: 2px solid #DDA7A5;
        border-radius: 16px;
        padding: 24px 32px;
        color: white;
        margin-bottom: 24px;
        box-shadow: 0 8px 20px rgba(44, 44, 44, 0.15);
    }

    .main-title {
        color: #F4C2C2;
        font-size: 2.4rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: -0.5px;
    }

    .sub-title {
        color: #DDA7A5;
        font-size: 1.15rem;
        font-weight: 600;
        margin-top: 4px;
    }

    .tagline {
        color: #E5E7EB;
        font-size: 0.95rem;
        font-style: italic;
        margin-top: 8px;
    }

    /* Instruction Banner */
    .instruction-box {
        background-color: #FFF5F7;
        border-left: 5px solid #C2185B;
        border-top: 1px solid #DDA7A5;
        border-right: 1px solid #DDA7A5;
        border-bottom: 1px solid #DDA7A5;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 24px;
        color: #2C2C2C;
    }

    /* Streamlit Containers & Expanders */
    .stExpander {
        background-color: #FFFFFF !important;
        border: 1px solid #DDA7A5 !important;
        border-radius: 12px !important;
    }

    .stButton > button {
        background-color: #C2185B !important;
        color: white !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 600 !important;
    }
</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 2. MAIN HEADER & USER INSTRUCTIONS
# ------------------------------------------------------------------------------
st.markdown("""
<div class="main-header">
    <div class="main-title">heaterellaxx</div>
    <div class="sub-title">🔥 Heat Analyzer — Heat Exchanger Engineering Engine</div>
    <div class="tagline">"From Heat Equations to Real Engineering Decisions."</div>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="instruction-box">
    <h4 style="margin-top:0; color:#C2185B;">✨ How to Use heaterellaxx</h4>
    <p style="margin-bottom:0;">
        1. Adjust fluid temperatures, mass flow rates, and heat transfer coefficients in the <strong>⚙️ System Configuration</strong> sidebar.<br>
        2. Toggle between <strong>Counterflow</strong> and <strong>Parallel Flow</strong> configurations to analyze thermal performance.<br>
        3. Inspect <strong>LMTD</strong>, <strong>Heat Duty (Q)</strong>, <strong>Required Surface Area (A)</strong>, and <strong>Thermal Effectiveness (ε)</strong>.<br>
        4. Explore temperature distribution profiles and compare benchmark performance metrics in the interactive charts below.
    </p>
</div>
""", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 3. SIDEBAR INPUT CONTROLS
# ------------------------------------------------------------------------------
st.sidebar.markdown("### ⚙️ System Configuration")

flow_config = st.sidebar.selectbox(
    "Flow Configuration",
    options=["Counterflow", "Parallel Flow"],
    index=0,
    help="Select fluid direction flow arrangement"
)

st.sidebar.markdown("---")
st.sidebar.markdown("#### 🌡️ Thermal Parameters")

T_h_in = st.sidebar.number_input(
    "Hot Fluid Inlet Temp (T_h_in) [°C]",
    min_value=50.0, max_value=300.0, value=150.0, step=1.0,
    help="Supply temperature of hot process fluid"
)

T_h_out = st.sidebar.number_input(
    "Hot Fluid Outlet Temp (T_h_out) [°C]",
    min_value=30.0, max_value=250.0, value=80.0, step=1.0,
    help="Target outlet temperature of hot process fluid"
)

T_c_in = st.sidebar.number_input(
    "Cold Fluid Inlet Temp (T_c_in) [°C]",
    min_value=5.0, max_value=100.0, value=20.0, step=1.0,
    help="Inlet temperature of cooling fluid"
)

st.sidebar.markdown("---")
st.sidebar.markdown("#### 💧 Fluid Properties & Flow")

m_dot_h = st.sidebar.slider(
    "Hot Fluid Mass Flow Rate (m_dot_h) [kg/s]",
    min_value=0.1, max_value=20.0, value=2.0, step=0.1
)

C_p_h = st.sidebar.number_input(
    "Hot Fluid Specific Heat (C_p_h) [kJ/kg·K]",
    min_value=0.5, max_value=10.0, value=2.1, step=0.1,
    help="Default ~2.1 kJ/kg·K for thermal oil or ~4.18 for water"
)

m_dot_c = st.sidebar.slider(
    "Cold Fluid Mass Flow Rate (m_dot_c) [kg/s]",
    min_value=0.1, max_value=20.0, value=2.5, step=0.1
)

C_p_c = st.sidebar.number_input(
    "Cold Fluid Specific Heat (C_p_c) [kJ/kg·K]",
    min_value=0.5, max_value=10.0, value=4.184, step=0.01,
    help="Default 4.184 kJ/kg·K for Water"
)

U = st.sidebar.slider(
    "Overall Heat Transfer Coeff (U) [W/m²·K]",
    min_value=10, max_value=2000, value=500, step=10
)

st.sidebar.markdown("---")
st.sidebar.markdown("#### 🧱 Equipment & Tube Material")

material_preset = st.sidebar.selectbox(
    "Material / Tube Preset",
    options=[
        "Copper (High Conductivity k=385 W/m·K)",
        "Aluminum Alloy (Conductivity k=205 W/m·K)",
        "Stainless Steel (Moderate k=16 W/m·K)",
        "Titanium Alloy (Specialized k=22 W/m·K)"
    ],
    index=0
)

material_props = {
    "Copper (High Conductivity k=385 W/m·K)": {"k": 385, "desc": "Excellent thermal conductivity, ideal for compact high-efficiency units."},
    "Aluminum Alloy (Conductivity k=205 W/m·K)": {"k": 205, "desc": "Lightweight with strong thermal conductivity."},
    "Stainless Steel (Moderate k=16 W/m·K)": {"k": 16, "desc": "High corrosion resistance, suitable for harsh chemical environments."},
    "Titanium Alloy (Specialized k=22 W/m·K)": {"k": 22, "desc": "Extreme resistance to marine seawater and aggressive fluids."}
}

# ------------------------------------------------------------------------------
# 4. ENGINEERING LOGIC & ERROR HANDLING
# ------------------------------------------------------------------------------
valid = True
error_msg = ""

# Check 1: T_h_in must be strictly greater than T_h_out
if T_h_in <= T_h_out:
    valid = False
    error_msg = f"⛔ Invalid Temperature Constraint: Hot inlet temperature ({T_h_in}°C) must be strictly greater than hot outlet temperature ({T_h_out}°C)."

# Check 2: T_c_in must be strictly lower than T_h_in
elif T_c_in >= T_h_in:
    valid = False
    error_msg = f"⛔ Thermodynamic Violation: Cold fluid inlet temperature ({T_c_in}°C) must be strictly lower than hot fluid inlet temperature ({T_h_in}°C)."

if not valid:
    st.error(error_msg)
    st.info("💡 **Troubleshooting Guidance:** Adjust the temperature sliders/inputs in the sidebar so that T_h_in > T_h_out and T_c_in < T_h_in.")
    st.stop()

# Thermal Calculations
# Heat Duty from Hot Side: Q = m_dot_h * C_p_h * (T_h_in - T_h_out) [kW]
C_h = m_dot_h * C_p_h  # kW/K
Q_kW = C_h * (T_h_in - T_h_out)  # kW

# Cold fluid outlet temperature
C_c = m_dot_c * C_p_c  # kW/K
T_c_out = T_c_in + (Q_kW / C_c)

# Check 3: Outlet temperature of cold fluid cannot exceed thermodynamic limit
if flow_config == "Counterflow" and T_c_out > T_h_in:
    st.warning(f"⚠️ Thermodynamic Boundary Exceeded: Calculated Cold Outlet Temp ({T_c_out:.1f}°C) exceeds Hot Inlet Temp ({T_h_in}°C). Reduce hot flow rate or increase cold flow rate.")
    st.stop()
elif flow_config == "Parallel Flow" and T_c_out > T_h_out:
    st.warning(f"⚠️ Parallel Flow Temperature Cross: In Parallel Flow, Cold Outlet Temp ({T_c_out:.1f}°C) cannot exceed Hot Outlet Temp ({T_h_out}°C). Switch to Counterflow or adjust mass flow rates.")
    st.stop()

# Temperature Differences
if flow_config == "Counterflow":
    delta_T1 = T_h_in - T_c_out
    delta_T2 = T_h_out - T_c_in
else: # Parallel Flow
    delta_T1 = T_h_in - T_c_in
    delta_T2 = T_h_out - T_c_out

# Check for temperature cross / invalid delta T
if delta_T1 <= 0 or delta_T2 <= 0:
    st.error(f"⛔ Temperature Pinch/Cross Error: ΔT1 = {delta_T1:.2f}°C, ΔT2 = {delta_T2:.2f}°C. Heat exchanger cannot operate under these temperature bounds. Try switching to Counterflow or adjusting flow rates.")
    st.stop()

# LMTD Calculation with edge case handling (division by zero when delta_T1 == delta_T2)
if abs(delta_T1 - delta_T2) < 1e-5:
    LMTD = delta_T1
else:
    LMTD = (delta_T1 - delta_T2) / np.log(delta_T1 / delta_T2)

# Required Heat Transfer Area
Q_watts = Q_kW * 1000.0
Area = Q_watts / (U * LMTD)  # m²

# Effectiveness calculation (ε - NTU method)
C_min = min(C_h, C_c)
C_max = max(C_h, C_c)
C_r = C_min / C_max if C_max > 0 else 0
Q_max = C_min * (T_h_in - T_c_in)  # kW
effectiveness = (Q_kW / Q_max * 100.0) if Q_max > 0 else 0.0
NTU = (U * Area) / (C_min * 1000.0) if C_min > 0 else 0.0

# ------------------------------------------------------------------------------
# 5. RESULTS DISPLAY & SUMMARY TABLE
# ------------------------------------------------------------------------------
st.markdown("### 📊 Key Performance Metrics")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Total Heat Duty (Q)</div>
        <div class="metric-value">{Q_kW:.2f}</div>
        <div class="metric-unit">kW ({Q_kW/1000:.3f} MW)</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Log Mean Temp Diff (LMTD)</div>
        <div class="metric-value">{LMTD:.2f}</div>
        <div class="metric-unit">°C</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Required Surface Area (A)</div>
        <div class="metric-value">{Area:.2f}</div>
        <div class="metric-unit">m²</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Thermal Effectiveness (ε)</div>
        <div class="metric-value">{effectiveness:.1f}%</div>
        <div class="metric-unit">NTU: {NTU:.2f}</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Detailed Engineering Table
st.markdown("#### 📋 Detailed Thermal Summary")

summary_data = [
    {"Parameter": "Flow Configuration", "Value": flow_config, "Unit": "-", "Engineering Assessment": "Optimal flow arrangement selected"},
    {"Parameter": "Hot Fluid Inlet Temp (T_h_in)", "Value": f"{T_h_in:.1f}", "Unit": "°C", "Engineering Assessment": "Primary thermal energy source"},
    {"Parameter": "Hot Fluid Outlet Temp (T_h_out)", "Value": f"{T_h_out:.1f}", "Unit": "°C", "Engineering Assessment": f"Cooled by {T_h_in - T_h_out:.1f}°C"},
    {"Parameter": "Cold Fluid Inlet Temp (T_c_in)", "Value": f"{T_c_in:.1f}", "Unit": "°C", "Engineering Assessment": "Coolant supply condition"},
    {"Parameter": "Cold Fluid Outlet Temp (T_c_out)", "Value": f"{T_c_out:.1f}", "Unit": "°C", "Engineering Assessment": f"Heated by {T_c_out - T_c_in:.1f}°C"},
    {"Parameter": "Total Heat Rate (Q)", "Value": f"{Q_kW:.2f}", "Unit": "kW", "Engineering Assessment": "Transferred thermal power"},
    {"Parameter": "Log Mean Temp Difference (LMTD)", "Value": f"{LMTD:.2f}", "Unit": "°C", "Engineering Assessment": "Effective temperature driving force"},
    {"Parameter": "Overall Heat Transfer Coeff (U)", "Value": f"{U}", "Unit": "W/m²·K", "Engineering Assessment": "Overall thermal conductance"},
    {"Parameter": "Required Heat Surface Area (A)", "Value": f"{Area:.2f}", "Unit": "m²", "Engineering Assessment": "Calculated heat exchanger footprint"},
    {"Parameter": "Heat Capacity Rate Ratio (C_r)", "Value": f"{C_r:.3f}", "Unit": "-", "Engineering Assessment": f"C_min/C_max ratio (C_min = {'Hot' if C_h < C_c else 'Cold'} side)"},
    {"Parameter": "Exchanger Effectiveness (ε)", "Value": f"{effectiveness:.1f}", "Unit": "%", "Engineering Assessment": "High thermodynamic efficiency" if effectiveness > 60 else "Moderate efficiency"},
    {"Parameter": "Number of Transfer Units (NTU)", "Value": f"{NTU:.2f}", "Unit": "-", "Engineering Assessment": "Dimensionless exchanger size parameter"},
    {"Parameter": "Tube Material", "Value": material_preset.split('(')[0].strip(), "Unit": "-", "Engineering Assessment": material_props[material_preset]["desc"]}
]

df_summary = pd.DataFrame(summary_data)
st.dataframe(df_summary, use_container_width=True, hide_index=True)

# CSV and Report Download Buttons
btn_col1, btn_col2 = st.columns([1, 1])

with btn_col1:
    csv_data = df_summary.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download Summary as CSV",
        data=csv_data,
        file_name=f"heaterellaxx_summary_{flow_config.lower().replace(' ', '_')}.csv",
        mime="text/csv"
    )

report_text = f"""================================================================================
heaterellaxx | HEAT EXCHANGER THERMAL CALCULATION REPORT
================================================================================
Flow Configuration: {flow_config}
Material Preset: {material_preset}

1. OPERATING PARAMETERS
Hot Fluid Inlet Temp (T_h_in)  : {T_h_in:.1f}°C
Hot Fluid Outlet Temp (T_h_out): {T_h_out:.1f}°C
Cold Fluid Inlet Temp (T_c_in) : {T_c_in:.1f}°C
Hot Fluid Flow Rate (m_dot_h)  : {m_dot_h:.2f} kg/s (Cp = {C_p_h:.2f} kJ/kg·K)
Cold Fluid Flow Rate (m_dot_c) : {m_dot_c:.2f} kg/s (Cp = {C_p_c:.3f} kJ/kg·K)
Overall Heat Transfer Coeff (U): {U} W/m²·K

2. THERMAL PERFORMANCE RESULTS
Total Heat Duty Rate (Q)       : {Q_kW:.2f} kW ({Q_kW/1000:.3f} MW)
Cold Fluid Outlet (T_c_out)    : {T_c_out:.1f}°C
Delta T1 (ΔT1)                 : {delta_T1:.2f}°C
Delta T2 (ΔT2)                 : {delta_T2:.2f}°C
Log Mean Temp Difference (LMTD): {LMTD:.2f}°C
Required Surface Area (A)      : {Area:.2f} m²
Effectiveness (ε)              : {effectiveness:.1f}%
Number of Transfer Units (NTU) : {NTU:.2f}
================================================================================"""

with btn_col2:
    st.download_button(
        label="📄 Download Technical Pitch Report (.txt)",
        data=report_text,
        file_name=f"heaterellaxx_report_{flow_config.lower().replace(' ', '_')}.txt",
        mime="text/plain"
    )

# ------------------------------------------------------------------------------
# 6. INTERACTIVE PLOTLY VISUALIZATIONS
# ------------------------------------------------------------------------------
st.markdown("### 📈 Thermal Visualizations")

chart_col1, chart_col2 = st.columns(2)

color_hot = "#C2185B"      # Sleek Rose Magenta
color_cold = "#2563EB"     # Royal Blue / Slate contrast
color_rose = "#DDA7A5"     # Rose Gold accent
color_charcoal = "#2C2C2C" # Charcoal Steel

with chart_col1:
    st.markdown("##### 1. Temperature Profile along Exchanger Length")
    
    x = np.linspace(0, 1, 100)
    T_h_profile = T_h_in - (T_h_in - T_h_out) * x
    
    if flow_config == "Counterflow":
        T_c_profile = T_c_out - (T_c_out - T_c_in) * x
    else: # Parallel Flow
        T_c_profile = T_c_in + (T_c_out - T_c_in) * x
        
    fig_temp = go.Figure()
    
    fig_temp.add_trace(go.Scatter(
        x=x, y=T_h_profile,
        mode='lines',
        name='Hot Fluid (T_h)',
        line=dict(color=color_hot, width=3.5)
    ))
    
    fig_temp.add_trace(go.Scatter(
        x=x, y=T_c_profile,
        mode='lines',
        name='Cold Fluid (T_c)',
        line=dict(color=color_cold, width=3.5, dash='dash' if flow_config == 'Counterflow' else 'solid')
    ))
    
    fig_temp.update_layout(
        title=f"Fluid Temperature Curves ({flow_config})",
        xaxis_title="Normalized Exchanger Length (0 = Inlet, 1 = Outlet)",
        yaxis_title="Temperature (°C)",
        template="plotly_white",
        font=dict(family="Inter, sans-serif", color=color_charcoal),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#FFF5F7",
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    
    st.plotly_chart(fig_temp, use_container_width=True)

with chart_col2:
    st.markdown("##### 2. Flow Configuration Benchmark (Counterflow vs Parallel)")
    
    # Calculate Counterflow
    cf_dT1 = T_h_in - T_c_out
    cf_dT2 = T_h_out - T_c_in
    cf_lmtd = (cf_dT1 - cf_dT2) / np.log(cf_dT1 / cf_dT2) if abs(cf_dT1 - cf_dT2) > 1e-5 else cf_dT1
    cf_area = Q_watts / (U * cf_lmtd) if cf_lmtd > 0 else 0
    
    # Calculate Parallel
    pf_dT1 = T_h_in - T_c_in
    pf_dT2 = T_h_out - T_c_out
    pf_valid = pf_dT1 > 0 and pf_dT2 > 0 and T_c_out <= T_h_out
    
    if pf_valid:
        pf_lmtd = (pf_dT1 - pf_dT2) / np.log(pf_dT1 / pf_dT2) if abs(pf_dT1 - pf_dT2) > 1e-5 else pf_dT1
        pf_area = Q_watts / (U * pf_lmtd) if pf_lmtd > 0 else 0
    else:
        pf_lmtd = 0
        pf_area = 0

    categories = ['Log Mean Temp Diff (°C)', 'Required Surface Area (m²)']
    
    fig_bench = go.Figure(data=[
        go.Bar(
            name='Counterflow',
            x=categories,
            y=[cf_lmtd, cf_area],
            marker_color=color_hot,
            text=[f"{cf_lmtd:.1f} °C", f"{cf_area:.2f} m²"],
            textposition='auto'
        ),
        go.Bar(
            name='Parallel Flow',
            x=categories,
            y=[pf_lmtd, pf_area] if pf_valid else [0, 0],
            marker_color=color_rose,
            text=[f"{pf_lmtd:.1f} °C" if pf_valid else "N/A", f"{pf_area:.2f} m²" if pf_valid else "N/A (Cross)"],
            textposition='auto'
        )
    ])
    
    fig_bench.update_layout(
        title="LMTD & Area Comparison Benchmark",
        barmode='group',
        template="plotly_white",
        font=dict(family="Inter, sans-serif", color=color_charcoal),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#FFF5F7",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    
    st.plotly_chart(fig_bench, use_container_width=True)

# ------------------------------------------------------------------------------
# 7. AI ENGINEERING ASSISTANT & DECISION SUPPORT
# ------------------------------------------------------------------------------
with st.expander("🤖 AI Engineering Interpretation & Decision Support", expanded=True):
    min_dT = min(delta_T1, delta_T2)
    
    lmtd_gain = f"{(cf_lmtd - pf_lmtd)/pf_lmtd*100:.1f}% higher LMTD" if pf_valid and pf_lmtd > 0 else "Optimal"
    area_savings = f"{((pf_area - cf_area)/pf_area*100):.1f}%" if pf_valid and pf_area > 0 else "N/A"
    
    st.markdown(f"""
    #### 💡 Automated Thermal Diagnostic Report
    
    - **Pinch Temperature Analysis:** The minimum temperature difference ($\Delta T_{{min}}$) in your heat exchanger is **{min_dT:.2f}°C**.
      {'⚠️ *Warning: Pinch point is below 5°C, requiring large surface area or high fluid velocities to prevent thermal stagnation.*' if min_dT < 5 else '✅ *Pinch point provides healthy temperature driving force across the exchanger length.*'}
    
    - **Flow Configuration Efficiency:** 
      - Current mode: **{flow_config}**.
      - Counterflow provides **{lmtd_gain}** than Parallel flow for this thermal duty, reducing required surface area by **{area_savings}**.
    
    - **Material Selection Insights:**
      - Selected Material: **{material_preset.split('(')[0].strip()}** ($k = {material_props[material_preset]['k']}$ W/m·K).
      - {material_props[material_preset]['desc']}
    
    - **Engineering Recommendation:**
      {'Counterflow is strongly recommended for max thermal recovery and minimal footprint.' if flow_config == 'Parallel Flow' else 'Your counterflow arrangement optimizes thermal efficiency and minimizes tube bundle cost.'}
    """)
