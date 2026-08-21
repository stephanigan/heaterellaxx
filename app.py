import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

# ------------------------------------------------------------------------------
# 1. PAGE CONFIGURATION & HIGH-CONTRAST "ROSE-GOLD & CHARCOAL" THEME
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="heaterellaxx | Heat Analyzer",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enhanced High-Contrast CSS styling
st.markdown("""
<style>
    /* Global Container & Typography */
    .stApp {
        background-color: #FDF2F4;
        color: #1E1E1E !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Ensure all text inside main area is deep high-contrast charcoal */
    .stMarkdown, .stMarkdown p, .stMarkdown span, .stMarkdown li, .stMarkdown div {
        color: #1E1E1E !important;
        line-height: 1.6;
    }

    /* Sidebar Customization - High contrast dark with vibrant rose labels */
    [data-testid="stSidebar"] {
        background-color: #1E1E1E !important;
        border-right: 2px solid #DDA7A5;
    }
    
    [data-testid="stSidebar"] h1, 
    [data-testid="stSidebar"] h2, 
    [data-testid="stSidebar"] h3, 
    [data-testid="stSidebar"] h4 {
        color: #F4C2C2 !important;
        font-weight: 700;
    }

    [data-testid="stSidebar"] p, 
    [data-testid="stSidebar"] label,
    [data-testid="stSidebar"] span {
        color: #FFFFFF !important;
        font-weight: 600;
    }

    [data-testid="stSidebar"] .stSelectbox label, 
    [data-testid="stSidebar"] .stSlider label,
    [data-testid="stSidebar"] .stNumberInput label {
        color: #F4C2C2 !important;
        font-weight: 700;
        font-size: 0.95rem;
    }

    /* Metric Display Cards */
    .metric-card {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 22px 18px;
        border: 2px solid #E8B4B8;
        box-shadow: 0 4px 14px rgba(194, 24, 91, 0.08);
        text-align: center;
        margin-bottom: 12px;
    }

    .metric-label {
        font-size: 0.85rem;
        font-weight: 800;
        text-transform: uppercase;
        color: #9C1545;
        letter-spacing: 0.6px;
        margin-bottom: 8px;
    }

    .metric-value {
        font-size: 2.1rem;
        font-weight: 900;
        color: #1A1A1A;
        line-height: 1.1;
    }

    .metric-unit {
        font-size: 0.95rem;
        color: #4A5568;
        font-weight: 600;
        margin-top: 6px;
    }

    /* Main Header Styling */
    .main-header {
        background: linear-gradient(135deg, #1E1E1E 0%, #3D1424 100%);
        border: 2px solid #DDA7A5;
        border-radius: 14px;
        padding: 24px 30px;
        color: #FFFFFF;
        margin-bottom: 20px;
        box-shadow: 0 8px 24px rgba(30, 30, 30, 0.15);
    }

    .main-title {
        color: #F4C2C2;
        font-size: 2.4rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: -0.5px;
    }

    .sub-title {
        color: #E8B4B8;
        font-size: 1.15rem;
        font-weight: 700;
        margin-top: 4px;
    }

    .tagline {
        color: #F3F4F6;
        font-size: 0.95rem;
        font-style: italic;
        margin-top: 6px;
    }

    /* Instruction Banner */
    .instruction-box {
        background-color: #FFFFFF;
        border-left: 6px solid #C2185B;
        border-top: 1px solid #DDA7A5;
        border-right: 1px solid #DDA7A5;
        border-bottom: 1px solid #DDA7A5;
        border-radius: 12px;
        padding: 18px 22px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .instruction-box h4 {
        margin-top: 0;
        color: #9C1545 !important;
        font-weight: 800;
        font-size: 1.1rem;
    }

    .instruction-box p {
        color: #2D3748 !important;
        font-size: 0.95rem;
        margin-bottom: 0;
    }

    /* Expanders & Content Containers */
    [data-testid="stExpander"] {
        background-color: #FFFFFF !important;
        border: 2px solid #E8B4B8 !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        margin-bottom: 20px;
    }

    [data-testid="stExpander"] summary {
        background-color: #FFF0F3 !important;
        border-radius: 10px !important;
        color: #9C1545 !important;
        font-weight: 800 !important;
        font-size: 1.05rem !important;
        padding: 12px 16px !important;
    }

    [data-testid="stExpander"] summary svg {
        fill: #9C1545 !important;
    }

    /* Action Buttons */
    .stButton > button {
        background-color: #C2185B !important;
        color: #FFFFFF !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 700 !important;
        padding: 10px 20px !important;
        box-shadow: 0 2px 6px rgba(194, 24, 91, 0.3) !important;
        transition: all 0.2s ease !important;
    }

    .stButton > button:hover {
        background-color: #9C1545 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(194, 24, 91, 0.4) !important;
    }

    /* Download Buttons */
    [data-testid="stDownloadButton"] button {
        background-color: #1E1E1E !important;
        color: #F4C2C2 !important;
        border: 1px solid #DDA7A5 !important;
        border-radius: 8px !important;
        font-weight: 700 !important;
        padding: 8px 16px !important;
    }

    [data-testid="stDownloadButton"] button:hover {
        background-color: #9C1545 !important;
        color: #FFFFFF !important;
    }

    /* LaTeX Equations Container Card */
    .math-card {
        background-color: #FFFFFF;
        border: 2px solid #E8B4B8;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(194, 24, 91, 0.06);
    }
    
    .math-card h5 {
        color: #9C1545 !important;
        font-weight: 800;
        font-size: 1.1rem;
        margin-top: 0;
        margin-bottom: 12px;
    }

    /* Chart Container Frame */
    .chart-frame {
        background-color: #FFFFFF;
        border: 2px solid #E8B4B8;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 14px rgba(194, 24, 91, 0.06);
        margin-bottom: 16px;
    }
    
    .chart-title {
        color: #1E1E1E;
        font-size: 1.1rem;
        font-weight: 800;
        margin-bottom: 8px;
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
    <h4>✨ How to Use heaterellaxx</h4>
    <p>
        1. Set fluid inlet/outlet temperatures, flow rates, and heat transfer coefficient in the dark <strong>⚙️ System Configuration</strong> sidebar on the left.<br>
        2. Toggle between <strong>Counterflow</strong> and <strong>Parallel Flow</strong> arrangements to analyze performance.<br>
        3. Review real-time <strong>Key Performance Metrics</strong> (Q, LMTD, Area, ε, NTU) and interactive temperature distribution curves.<br>
        4. Inspect exact <strong>LaTeX Mathematical Equations</strong> and automated <strong>AI Thermal Diagnostics</strong> below.
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
    help="Default ~2.1 kJ/kg·K for thermal oil or ~4.184 for water"
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
    "Copper (High Conductivity k=385 W/m·K)": {"k": 385, "desc": "High thermal conductivity, ideal for compact high-efficiency units."},
    "Aluminum Alloy (Conductivity k=205 W/m·K)": {"k": 205, "desc": "Lightweight with strong thermal conductance."},
    "Stainless Steel (Moderate k=16 W/m·K)": {"k": 16, "desc": "High corrosion resistance, suitable for harsh chemical processes."},
    "Titanium Alloy (Specialized k=22 W/m·K)": {"k": 22, "desc": "Extreme resistance to marine seawater and aggressive chemicals."}
}

# ------------------------------------------------------------------------------
# 4. ENGINEERING LOGIC & ERROR VALIDATION
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
    st.info("💡 **Troubleshooting Guidance:** Adjust the temperature values in the sidebar so that $T_{h,in} > T_{h,out}$ and $T_{c,in} < T_{h,in}$.")
    st.stop()

# Thermal Calculations
# Heat Duty: Q = m_dot_h * C_p_h * (T_h_in - T_h_out) [kW]
C_h = m_dot_h * C_p_h  # kW/K
Q_kW = C_h * (T_h_in - T_h_out)  # kW

# Cold fluid outlet temperature
C_c = m_dot_c * C_p_c  # kW/K
T_c_out = T_c_in + (Q_kW / C_c)

# Check 3: Outlet temperature of cold fluid cannot exceed thermodynamic limit
if flow_config == "Counterflow" and T_c_out > T_h_in:
    st.warning(f"⚠️ Thermodynamic Boundary Exceeded: Calculated Cold Outlet Temp ({T_c_out:.1f}°C) exceeds Hot Inlet Temp ({T_h_in}°C). Increase cold fluid flow rate or reduce hot flow rate.")
    st.stop()
elif flow_config == "Parallel Flow" and T_c_out > T_h_out:
    st.warning(f"⚠️ Parallel Flow Temperature Cross: In Parallel Flow, Cold Outlet Temp ({T_c_out:.1f}°C) cannot exceed Hot Outlet Temp ({T_h_out}°C). Switch to Counterflow or adjust flow rates.")
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
    st.error(f"⛔ Temperature Cross Error: ΔT1 = {delta_T1:.2f}°C, ΔT2 = {delta_T2:.2f}°C. Heat exchanger cannot operate under these bounds. Try switching to Counterflow or increasing cold water flow.")
    st.stop()

# LMTD Calculation with edge case handling
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
# 5. RESULTS DISPLAY: KPI METRIC CARDS
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

# ------------------------------------------------------------------------------
# 6. HIGH-CONTRAST PLOTLY CHARTS (CRISP & READABLE)
# ------------------------------------------------------------------------------
st.markdown("### 📈 Thermal Visualizations")

chart_col1, chart_col2 = st.columns(2)

# High-contrast color tokens
color_hot = "#C2185B"        # Bold Rose Magenta
color_cold = "#1D4ED8"       # Deep Royal Blue
color_cf = "#C2185B"         # Counterflow Accent
color_pf = "#E0839B"         # Parallel Flow Accent
text_dark = "#1E1E1E"        # Crisp Dark Charcoal Text
grid_color = "#E5E7EB"       # Subtle Clean Grid Lines

with chart_col1:
    st.markdown("""<div class="chart-title">1. Fluid Temperature Distribution Profile</div>""", unsafe_allow_html=True)
    
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
        name=f'Hot Fluid (In: {T_h_in}°C → Out: {T_h_out}°C)',
        line=dict(color=color_hot, width=4)
    ))
    
    fig_temp.add_trace(go.Scatter(
        x=x, y=T_c_profile,
        mode='lines',
        name=f'Cold Fluid (In: {T_c_in}°C → Out: {T_c_out:.1f}°C)',
        line=dict(color=color_cold, width=4, dash='dash' if flow_config == 'Counterflow' else 'solid')
    ))
    
    fig_temp.update_layout(
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFF8F9",
        font=dict(family="Inter, sans-serif", color=text_dark, size=12),
        margin=dict(l=55, r=25, t=30, b=45),
        height=380,
        hovermode="x unified",
        xaxis=dict(
            title=dict(text="Normalized Exchanger Length (0 = Hot Inlet, 1 = Hot Outlet)", font=dict(color=text_dark, size=12, family="Inter, sans-serif")),
            tickfont=dict(color=text_dark, size=11),
            showgrid=True,
            gridcolor=grid_color,
            gridwidth=1,
            linecolor=text_dark,
            linewidth=1.5
        ),
        yaxis=dict(
            title=dict(text="Temperature (°C)", font=dict(color=text_dark, size=12, family="Inter, sans-serif")),
            tickfont=dict(color=text_dark, size=11),
            showgrid=True,
            gridcolor=grid_color,
            gridwidth=1,
            linecolor=text_dark,
            linewidth=1.5
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(color=text_dark, size=11, family="Inter, sans-serif"),
            bgcolor="rgba(255, 255, 255, 0.9)",
            bordercolor="#E8B4B8",
            borderwidth=1
        )
    )
    
    st.plotly_chart(fig_temp, use_container_width=True)

with chart_col2:
    st.markdown("""<div class="chart-title">2. Flow Benchmark: Counterflow vs Parallel Flow</div>""", unsafe_allow_html=True)
    
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

    categories = ['LMTD (°C)', 'Surface Area (m²)']
    
    fig_bench = go.Figure(data=[
        go.Bar(
            name='Counterflow',
            x=categories,
            y=[cf_lmtd, cf_area],
            marker=dict(color=color_cf, line=dict(color="#1E1E1E", width=1)),
            text=[f"{cf_lmtd:.1f} °C", f"{cf_area:.2f} m²"],
            textposition='outside',
            textfont=dict(color=text_dark, size=12, family="Inter, sans-serif")
        ),
        go.Bar(
            name='Parallel Flow',
            x=categories,
            y=[pf_lmtd, pf_area] if pf_valid else [0, 0],
            marker=dict(color=color_pf, line=dict(color="#1E1E1E", width=1)),
            text=[f"{pf_lmtd:.1f} °C" if pf_valid else "N/A", f"{pf_area:.2f} m²" if pf_valid else "N/A (Cross)"],
            textposition='outside',
            textfont=dict(color=text_dark, size=12, family="Inter, sans-serif")
        )
    ])
    
    fig_bench.update_layout(
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFF8F9",
        font=dict(family="Inter, sans-serif", color=text_dark, size=12),
        margin=dict(l=55, r=25, t=30, b=45),
        height=380,
        barmode='group',
        xaxis=dict(
            tickfont=dict(color=text_dark, size=12, family="Inter, sans-serif"),
            showgrid=False,
            linecolor=text_dark,
            linewidth=1.5
        ),
        yaxis=dict(
            title=dict(text="Magnitude", font=dict(color=text_dark, size=12, family="Inter, sans-serif")),
            tickfont=dict(color=text_dark, size=11),
            showgrid=True,
            gridcolor=grid_color,
            gridwidth=1,
            linecolor=text_dark,
            linewidth=1.5
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(color=text_dark, size=11, family="Inter, sans-serif"),
            bgcolor="rgba(255, 255, 255, 0.9)",
            bordercolor="#E8B4B8",
            borderwidth=1
        )
    )
    
    st.plotly_chart(fig_bench, use_container_width=True)

# ------------------------------------------------------------------------------
# 7. THERMODYNAMIC GOVERNING EQUATIONS IN LATEX
# ------------------------------------------------------------------------------
st.markdown("### 📐 Thermodynamic Governing Equations & Mathematical Proofs")

with st.container():
    st.markdown("""
    <div class="math-card">
        <h5>1. Heat Duty Equations ($Q$)</h5>
    </div>
    """, unsafe_allow_html=True)
    
    st.latex(r"""
    Q = \dot{m}_h \cdot C_{p,h} \cdot (T_{h,\text{in}} - T_{h,\text{out}}) = \dot{m}_c \cdot C_{p,c} \cdot (T_{c,\text{out}} - T_{c,\text{in}}) \quad [\text{kW}]
    """)
    
    st.write(f"**Current Substitution:** $Q = {m_dot_h:.2f} \\times {C_p_h:.2f} \\times ({T_h_in:.1f} - {T_h_out:.1f}) = {Q_kW:.2f}\\text{ kW} = {Q_kW/1000:.3f}\\text{ MW}$")
    st.write(f"**Calculated Cold Outlet Temp:** $T_{{c,\\text{{out}}}} = {T_c_in:.1f} + \\frac{{{Q_kW:.2f}}}{{{m_dot_c:.2f} \\times {C_p_c:.3f}}} = {T_c_out:.2f}^\\circ\\text{{C}}$")

    st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown("""
    <div class="math-card">
        <h5>2. Terminal Temperature Differences ($\Delta T_1$ & $\Delta T_2$) & Log Mean Temp Difference (LMTD)</h5>
    </div>
    """, unsafe_allow_html=True)
    
    if flow_config == "Counterflow":
        st.latex(r"""
        \text{Counterflow: } \Delta T_1 = T_{h,\text{in}} - T_{c,\text{out}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{in}}
        """)
        st.write(f"**Current Values:** $\\Delta T_1 = {T_h_in:.1f} - {T_c_out:.1f} = {delta_T1:.2f}^\\circ\\text{{C}}$, $\\quad \\Delta T_2 = {T_h_out:.1f} - {T_c_in:.1f} = {delta_T2:.2f}^\\circ\\text{{C}}$")
    else:
        st.latex(r"""
        \text{Parallel Flow: } \Delta T_1 = T_{h,\text{in}} - T_{c,\text{in}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{out}}
        """)
        st.write(f"**Current Values:** $\\Delta T_1 = {T_h_in:.1f} - {T_c_in:.1f} = {delta_T1:.2f}^\\circ\\text{{C}}$, $\\quad \\Delta T_2 = {T_h_out:.1f} - {T_c_out:.1f} = {delta_T2:.2f}^\\circ\\text{{C}}$")

    st.latex(r"""
    \text{LMTD} = \frac{\Delta T_1 - \Delta T_2}{\ln\left(\frac{\Delta T_1}{\Delta T_2}\right)} \quad [\text{°C}]
    """)
    st.write(f"**Current Result:** $\\text{{LMTD}} = \\frac{{{delta_T1:.2f} - {delta_T2:.2f}}}{{\\ln({delta_T1:.2f} / {delta_T2:.2f})}} = {LMTD:.2f}^\\circ\\text{{C}}$")

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown("""
    <div class="math-card">
        <h5>3. Heat Transfer Surface Area ($A$) & $\epsilon$-NTU Performance</h5>
    </div>
    """, unsafe_allow_html=True)

    st.latex(r"""
    A = \frac{Q \times 1000}{U \cdot \text{LMTD}} \quad [\text{m}^2]
    """)
    st.write(f"**Calculated Area:** $A = \\frac{{{Q_kW:.2f} \\times 1000}}{{{U} \\times {LMTD:.2f}}} = {Area:.2f}\\text{ m}^2$")

    st.latex(r"""
    C_{\min} = \min(C_h, C_c) = \min(\dot{m}_h C_{p,h}, \dot{m}_c C_{p,c}), \quad Q_{\max} = C_{\min}(T_{h,\text{in}} - T_{c,\text{in}})
    """)
    st.latex(r"""
    \epsilon = \frac{Q}{Q_{\max}} \times 100\%, \quad \text{NTU} = \frac{U \cdot A}{C_{\min} \times 1000}
    """)
    st.write(f"**Effectiveness & Sizing:** $C_{{\\min}} = {C_min:.2f}\\text{ kW/K}$, $\\quad Q_{{\\max}} = {Q_max:.2f}\\text{ kW}$, $\\quad \\epsilon = {effectiveness:.1f}\\%$, $\\quad \\text{{NTU}} = {NTU:.2f}$")

# ------------------------------------------------------------------------------
# 8. DETAILED ENGINEERING SUMMARY TABLE
# ------------------------------------------------------------------------------
st.markdown("### 📋 Detailed Engineering Summary")

summary_data = [
    {"Parameter": "Flow Configuration", "Value": flow_config, "Unit": "-", "Engineering Assessment": "Selected flow arrangement"},
    {"Parameter": "Hot Fluid Inlet Temp (T_h_in)", "Value": f"{T_h_in:.1f}", "Unit": "°C", "Engineering Assessment": "Primary thermal supply condition"},
    {"Parameter": "Hot Fluid Outlet Temp (T_h_out)", "Value": f"{T_h_out:.1f}", "Unit": "°C", "Engineering Assessment": f"Cooled by {T_h_in - T_h_out:.1f}°C"},
    {"Parameter": "Cold Fluid Inlet Temp (T_c_in)", "Value": f"{T_c_in:.1f}", "Unit": "°C", "Engineering Assessment": "Coolant supply condition"},
    {"Parameter": "Cold Fluid Outlet Temp (T_c_out)", "Value": f"{T_c_out:.1f}", "Unit": "°C", "Engineering Assessment": f"Heated by {T_c_out - T_c_in:.1f}°C"},
    {"Parameter": "Total Heat Rate (Q)", "Value": f"{Q_kW:.2f}", "Unit": "kW", "Engineering Assessment": "Thermal duty transferred"},
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

# CSV and TXT Pitch Report Downloads
btn_col1, btn_col2 = st.columns([1, 1])

with btn_col1:
    csv_data = df_summary.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download Thermal Summary (CSV)",
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
# 9. AI ENGINEERING ASSISTANT & DECISION SUPPORT (HIGH CONTRAST)
# ------------------------------------------------------------------------------
with st.expander("🤖 AI Engineering Interpretation & Decision Support", expanded=True):
    min_dT = min(delta_T1, delta_T2)
    
    lmtd_gain = f"{(cf_lmtd - pf_lmtd)/pf_lmtd*100:.1f}% higher LMTD" if pf_valid and pf_lmtd > 0 else "Optimal"
    area_savings = f"{((pf_area - cf_area)/pf_area*100):.1f}%" if pf_valid and pf_area > 0 else "N/A"
    
    st.markdown(f"""
    <div style="color: #1E1E1E; font-size: 1rem; line-height: 1.8;">
        <h4 style="color: #9C1545; font-weight: 800; margin-top:0;">💡 Automated Thermal Diagnostic Report</h4>
        
        <ul style="color: #1E1E1E; padding-left: 20px;">
            <li><strong>Pinch Temperature Analysis:</strong> The minimum temperature driving difference ($\Delta T_{{min}}$) in your heat exchanger is <strong style="color: #9C1545;">{min_dT:.2f}°C</strong>.<br>
            {'<span style="color:#C2185B; font-weight:700;">⚠️ Warning: Pinch point is below 5°C, requiring large surface area or high fluid velocities to prevent thermal stagnation.</span>' if min_dT < 5 else '<span style="color:#15803D; font-weight:700;">✅ Healthy temperature driving force maintained across the entire exchanger length.</span>'}
            </li>
            <br>
            <li><strong>Flow Configuration Efficiency:</strong> 
                <ul style="padding-left: 18px; margin-top: 4px;">
                    <li>Active configuration: <strong>{flow_config}</strong>.</li>
                    <li>Counterflow provides <strong>{lmtd_gain}</strong> than Parallel flow for this thermal duty, reducing required surface area by <strong>{area_savings}</strong>.</li>
                </ul>
            </li>
            <br>
            <li><strong>Material Selection Insights:</strong>
                <ul style="padding-left: 18px; margin-top: 4px;">
                    <li>Selected Alloy: <strong>{material_preset.split('(')[0].strip()}</strong> ($k = {material_props[material_preset]['k']}\\text{{ W/m}}\\cdot\\text{{K}}$).</li>
                    <li><em>{material_props[material_preset]['desc']}</em></li>
                </ul>
            </li>
            <br>
            <li><strong>Engineering Recommendation:</strong><br>
            {'<strong style="color:#9C1545;">Counterflow is strongly recommended</strong> for max thermal recovery and minimal equipment footprint.' if flow_config == 'Parallel Flow' else '<strong style="color:#15803D;">Your counterflow arrangement optimizes thermal efficiency</strong> and minimizes tube bundle capital cost.'}
            </li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
