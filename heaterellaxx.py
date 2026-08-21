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
    /* Global App Container */
    .stApp {
        background-color: #FDF2F4;
        color: #1E1E1E !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Body & Paragraph Text Contrast */
    .stApp p, .stApp span, .stApp li, .stApp label {
        color: #1E1E1E;
        line-height: 1.6;
    }

    /* Streamlit Alert Boxes (Warning / Error / Info) High-Contrast Fix */
    [data-testid="stAlert"] {
        border-radius: 12px !important;
        padding: 16px 20px !important;
        font-weight: 600 !important;
        border: 2px solid rgba(0,0,0,0.1) !important;
    }
    [data-testid="stAlert"] * {
        color: #1E1E1E !important;
        font-size: 0.98rem !important;
    }
    [data-testid="stAlert"] [data-testid="stMarkdownContainer"] p {
        color: #1E1E1E !important;
        font-weight: 600 !important;
    }

    /* Sidebar Customization - High contrast dark with vibrant rose labels */
    [data-testid="stSidebar"] {
        background-color: #1A1A1A !important;
        border-right: 2px solid #DDA7A5 !important;
    }
    
    [data-testid="stSidebar"] h1, 
    [data-testid="stSidebar"] h2, 
    [data-testid="stSidebar"] h3, 
    [data-testid="stSidebar"] h4 {
        color: #F4C2C2 !important;
        font-weight: 800 !important;
    }

    [data-testid="stSidebar"] p, 
    [data-testid="stSidebar"] span,
    [data-testid="stSidebar"] [data-testid="stMarkdownContainer"] p {
        color: #FFFFFF !important;
        font-weight: 500;
    }

    [data-testid="stSidebar"] label,
    [data-testid="stSidebar"] .stSelectbox label, 
    [data-testid="stSidebar"] .stSlider label,
    [data-testid="stSidebar"] .stNumberInput label {
        color: #F4C2C2 !important;
        font-weight: 700 !important;
        font-size: 0.95rem !important;
    }

    [data-testid="stSidebar"] .stNumberInput input {
        background-color: #2D2D2D !important;
        color: #FFFFFF !important;
        border: 1px solid #DDA7A5 !important;
        font-weight: 700 !important;
        border-radius: 8px !important;
    }

    /* Main Header Styling - High Contrast Overrides */
    .main-header {
        background: linear-gradient(135deg, #1E1E1E 0%, #3D1424 100%) !important;
        border: 2px solid #DDA7A5 !important;
        border-radius: 14px !important;
        padding: 24px 30px !important;
        margin-bottom: 20px !important;
        box-shadow: 0 8px 24px rgba(30, 30, 30, 0.2) !important;
    }

    .main-header .main-title {
        color: #F4C2C2 !important;
        font-size: 2.5rem !important;
        font-weight: 900 !important;
        margin: 0 !important;
        letter-spacing: -0.5px !important;
    }

    .main-header .sub-title {
        color: #FFFFFF !important;
        font-size: 1.2rem !important;
        font-weight: 700 !important;
        margin-top: 6px !important;
    }

    .main-header .tagline {
        color: #E8B4B8 !important;
        font-size: 0.95rem !important;
        font-style: italic !important;
        margin-top: 6px !important;
    }

    /* Instruction Banner */
    .instruction-box {
        background-color: #FFFFFF !important;
        border-left: 6px solid #C2185B !important;
        border-top: 1px solid #DDA7A5 !important;
        border-right: 1px solid #DDA7A5 !important;
        border-bottom: 1px solid #DDA7A5 !important;
        border-radius: 12px !important;
        padding: 18px 22px !important;
        margin-bottom: 24px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
    }

    .instruction-box h4 {
        margin-top: 0 !important;
        color: #9C1545 !important;
        font-weight: 800 !important;
        font-size: 1.1rem !important;
    }

    .instruction-box p {
        color: #1E1E1E !important;
        font-size: 0.95rem !important;
        margin-bottom: 0 !important;
    }

    /* Metric Display Cards */
    .metric-card {
        background: #FFFFFF !important;
        border-radius: 12px !important;
        padding: 22px 18px !important;
        border: 2px solid #E8B4B8 !important;
        box-shadow: 0 4px 14px rgba(194, 24, 91, 0.08) !important;
        text-align: center !important;
        margin-bottom: 12px !important;
    }

    .metric-label {
        font-size: 0.85rem !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        color: #9C1545 !important;
        letter-spacing: 0.6px !important;
        margin-bottom: 8px !important;
    }

    .metric-value {
        font-size: 2.1rem !important;
        font-weight: 900 !important;
        color: #1A1A1A !important;
        line-height: 1.1 !important;
    }

    .metric-unit {
        font-size: 0.95rem !important;
        color: #4A5568 !important;
        font-weight: 600 !important;
        margin-top: 6px !important;
    }

    /* LaTeX Display Container */
    .stLatex {
        background-color: #FFF5F7 !important;
        border: 1px solid #E8B4B8 !important;
        border-radius: 8px !important;
        padding: 12px 16px !important;
        margin: 8px 0 !important;
    }
    
    .stLatex .katex {
        color: #1E1E1E !important;
        font-size: 1.15rem !important;
    }

    /* LaTeX Equations Container Card */
    .math-card {
        background-color: #FFFFFF !important;
        border: 2px solid #E8B4B8 !important;
        border-radius: 12px !important;
        padding: 20px !important;
        margin-bottom: 20px !important;
        box-shadow: 0 4px 12px rgba(194, 24, 91, 0.06) !important;
    }
    
    .math-card h5 {
        color: #9C1545 !important;
        font-weight: 800 !important;
        font-size: 1.15rem !important;
        margin-top: 0 !important;
        margin-bottom: 12px !important;
    }

    /* Expanders & Content Containers */
    [data-testid="stExpander"] {
        background-color: #FFFFFF !important;
        border: 2px solid #E8B4B8 !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        margin-bottom: 20px !important;
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

    /* Buttons & Download Controls - High Contrast Guaranteed */
    .stButton > button,
    .stButton > button * {
        background-color: #C2185B !important;
        color: #FFFFFF !important;
        border-radius: 10px !important;
        border: 1px solid #E8B4B8 !important;
        font-weight: 800 !important;
        padding: 10px 20px !important;
        box-shadow: 0 2px 8px rgba(194, 24, 91, 0.3) !important;
        transition: all 0.2s ease !important;
    }

    .stButton > button:hover,
    .stButton > button:hover * {
        background-color: #9C1545 !important;
        color: #FFFFFF !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(194, 24, 91, 0.4) !important;
    }

    [data-testid="stDownloadButton"] button {
        background-color: #9C1545 !important;
        color: #FFFFFF !important;
        border: 2px solid #E8B4B8 !important;
        border-radius: 10px !important;
        font-weight: 800 !important;
        font-size: 0.95rem !important;
        padding: 12px 20px !important;
        box-shadow: 0 4px 12px rgba(156, 21, 69, 0.25) !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
    }

    [data-testid="stDownloadButton"] button *,
    [data-testid="stDownloadButton"] button p,
    [data-testid="stDownloadButton"] button span,
    [data-testid="stDownloadButton"] button div {
        color: #FFFFFF !important;
        font-weight: 800 !important;
        font-size: 0.95rem !important;
    }

    [data-testid="stDownloadButton"] button:hover {
        background-color: #C2185B !important;
        border-color: #FFFFFF !important;
        color: #FFFFFF !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(194, 24, 91, 0.4) !important;
    }

    [data-testid="stDownloadButton"] button:hover *,
    [data-testid="stDownloadButton"] button:hover p,
    [data-testid="stDownloadButton"] button:hover span,
    [data-testid="stDownloadButton"] button:hover div {
        color: #FFFFFF !important;
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
# 3. SIDEBAR INPUT CONTROLS WITH LATEX LABELS
# ------------------------------------------------------------------------------
st.sidebar.markdown("### ⚙️ System Configuration")

flow_config = st.sidebar.selectbox(
    "Flow Configuration",
    options=["Counterflow", "Parallel Flow"],
    index=0,
    help="Select fluid direction flow arrangement"
)

st.sidebar.markdown("---")
st.sidebar.markdown("#### 🌡️ Thermal Temperatures")

T_h_in = st.sidebar.number_input(
    "Hot Fluid Inlet Temp: $T_{h,\\text{in}}$ [°C]",
    min_value=50.0, max_value=300.0, value=150.0, step=1.0,
    help="Supply temperature of hot process fluid"
)

T_h_out = st.sidebar.number_input(
    "Hot Fluid Outlet Temp: $T_{h,\\text{out}}$ [°C]",
    min_value=30.0, max_value=250.0, value=80.0, step=1.0,
    help="Target outlet temperature of hot process fluid"
)

T_c_in = st.sidebar.number_input(
    "Cold Fluid Inlet Temp: $T_{c,\\text{in}}$ [°C]",
    min_value=5.0, max_value=100.0, value=20.0, step=1.0,
    help="Inlet temperature of cooling fluid"
)

st.sidebar.markdown("---")
st.sidebar.markdown("#### 💧 Fluid Properties & Flow")

m_dot_h = st.sidebar.slider(
    "Hot Fluid Mass Flow: $\\dot{m}_h$ [kg/s]",
    min_value=0.1, max_value=20.0, value=2.0, step=0.1
)

C_p_h = st.sidebar.number_input(
    "Hot Fluid Specific Heat: $C_{p,h}$ [kJ/kg·K]",
    min_value=0.5, max_value=10.0, value=2.1, step=0.1,
    help="Default ~2.1 kJ/kg·K for thermal oil or ~4.184 for water"
)

m_dot_c = st.sidebar.slider(
    "Cold Fluid Mass Flow: $\\dot{m}_c$ [kg/s]",
    min_value=0.1, max_value=20.0, value=2.5, step=0.1
)

C_p_c = st.sidebar.number_input(
    "Cold Fluid Specific Heat: $C_{p,c}$ [kJ/kg·K]",
    min_value=0.5, max_value=10.0, value=4.184, step=0.01,
    help="Default 4.184 kJ/kg·K for Water"
)

U = st.sidebar.slider(
    "Overall Heat Transfer Coeff: $U$ [W/m²·K]",
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
# 4. ENGINEERING THERMAL ENGINE CALCULATIONS
# ------------------------------------------------------------------------------
valid = True
error_msg = ""

if T_h_in <= T_h_out:
    valid = False
    error_msg = f"⛔ Invalid Temperature Constraint: Hot inlet temperature ({T_h_in:.1f}°C) must be strictly greater than hot outlet temperature ({T_h_out:.1f}°C)."
elif T_c_in >= T_h_in:
    valid = False
    error_msg = f"⛔ Thermodynamic Violation: Cold fluid inlet temperature ({T_c_in:.1f}°C) must be strictly lower than hot fluid inlet temperature ({T_h_in:.1f}°C)."

# Fluid Heat Capacity Rates
C_h = m_dot_h * C_p_h  # kW/K
C_c = m_dot_c * C_p_c  # kW/K

if valid:
    # Heat Duty: Q = m_dot_h * C_p_h * (T_h_in - T_h_out) [kW]
    Q_kW = C_h * (T_h_in - T_h_out)
    T_c_out = T_c_in + (Q_kW / C_c) if C_c > 0 else T_c_in

    # Boundary checks
    if flow_config == "Counterflow" and T_c_out > T_h_in:
        valid = False
        error_msg = f"⚠️ Thermodynamic Boundary Exceeded: Calculated Cold Outlet Temp ({T_c_out:.1f}°C) exceeds Hot Inlet Temp ({T_h_in:.1f}°C). Increase cold fluid flow rate (m_dot_c) or decrease hot fluid flow rate."
    elif flow_config == "Parallel Flow" and T_c_out > T_h_out:
        valid = False
        error_msg = f"⚠️ Parallel Flow Temperature Cross: Cold Outlet Temp ({T_c_out:.1f}°C) exceeds Hot Outlet Temp ({T_h_out:.1f}°C). Switch to Counterflow or adjust flow rates."
else:
    Q_kW = 0.0
    T_c_out = T_c_in

# Temperature Differences
if valid:
    if flow_config == "Counterflow":
        delta_T1 = T_h_in - T_c_out
        delta_T2 = T_h_out - T_c_in
    else:  # Parallel Flow
        delta_T1 = T_h_in - T_c_in
        delta_T2 = T_h_out - T_c_out

    if delta_T1 <= 0 or delta_T2 <= 0:
        valid = False
        error_msg = f"⛔ Temperature Cross Error: ΔT1 = {delta_T1:.2f}°C, ΔT2 = {delta_T2:.2f}°C. Exchanger cannot transfer heat with inverted driving force. Increase cooling flow."

if valid:
    # LMTD Calculation
    if abs(delta_T1 - delta_T2) < 1e-5:
        LMTD = delta_T1
    else:
        LMTD = (delta_T1 - delta_T2) / np.log(delta_T1 / delta_T2)

    # Required Surface Area
    Q_watts = Q_kW * 1000.0
    Area = Q_watts / (U * LMTD) if LMTD > 0 else 0.0

    # ε - NTU method
    C_min = min(C_h, C_c)
    C_max = max(C_h, C_c)
    C_r = C_min / C_max if C_max > 0 else 0.0
    Q_max = C_min * (T_h_in - T_c_in)
    effectiveness = (Q_kW / Q_max * 100.0) if Q_max > 0 else 0.0
    NTU = (U * Area) / (C_min * 1000.0) if C_min > 0 else 0.0
else:
    delta_T1 = 0.0
    delta_T2 = 0.0
    LMTD = 0.0
    Area = 0.0
    C_min = min(C_h, C_c)
    C_max = max(C_h, C_c)
    C_r = 0.0
    Q_max = 0.0
    effectiveness = 0.0
    NTU = 0.0

# ------------------------------------------------------------------------------
# 5. VALIDATION ALERT OR KEY PERFORMANCE METRICS
# ------------------------------------------------------------------------------
if not valid:
    st.error(error_msg)
    st.info("💡 **Troubleshooting Guidance:** Adjust inputs in the **⚙️ System Configuration** sidebar on the left:\n"
            "- Ensure $T_{h,\\text{in}} > T_{h,\\text{out}}$ and $T_{c,\\text{in}} < T_{h,\\text{in}}$.\n"
            "- Increase Cold Fluid Mass Flow Rate ($\\dot{m}_c$) or reduce Hot Flow Rate ($\\dot{m}_h$) to resolve temperature pinch.")
    st.stop()

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
        <div class="metric-unit">NTU = {NTU:.2f} | Cr = {C_r:.2f}</div>
    </div>
    """, unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# 6. INTERACTIVE PLOTLY VISUALIZATIONS (HIGH-CONTRAST)
# ------------------------------------------------------------------------------
st.markdown("### 📈 Interactive Thermal Analysis Charts")

chart_col1, chart_col2 = st.columns(2)

# High-contrast color palette
color_hot = "#C2185B"
color_cold = "#0284C7"
color_cf = "#C2185B"
color_pf = "#4B5563"
text_dark = "#1E1E1E"
grid_color = "#E5E7EB"

# Chart 1: Temperature Profile
with chart_col1:
    st.markdown("<h4 style='color:#9C1545; font-weight:800; margin-bottom:4px;'>🌡️ Fluid Temperature Distribution along Exchanger Length</h4>", unsafe_allow_html=True)
    
    x = np.linspace(0, 1, 100)
    
    if flow_config == "Counterflow":
        T_h_curve = T_h_in - (T_h_in - T_h_out) * (1 - np.exp(-2.5 * x)) / (1 - np.exp(-2.5))
        T_c_curve = T_c_in + (T_c_out - T_c_in) * (1 - np.exp(-2.5 * x)) / (1 - np.exp(-2.5))
        cold_name = 'Cold Fluid (Flow: Right ← Left)'
    else:  # Parallel
        T_h_curve = T_h_in - (T_h_in - T_h_out) * (1 - np.exp(-3.0 * x)) / (1 - np.exp(-3.0))
        T_c_curve = T_c_in + (T_c_out - T_c_in) * (1 - np.exp(-3.0 * x)) / (1 - np.exp(-3.0))
        cold_name = 'Cold Fluid (Flow: Left → Right)'

    fig_temp = go.Figure()
    
    fig_temp.add_trace(go.Scatter(
        x=x, y=T_h_curve,
        mode='lines',
        name='Hot Fluid (Inlet → Outlet)',
        line=dict(color=color_hot, width=4),
        hovertemplate='Position: %{x:.2f}<br>Hot Temp: %{y:.1f} °C<extra></extra>'
    ))
    
    fig_temp.add_trace(go.Scatter(
        x=x, y=T_c_curve,
        mode='lines',
        name=cold_name,
        line=dict(color=color_cold, width=4, dash='dash'),
        hovertemplate='Position: %{x:.2f}<br>Cold Temp: %{y:.1f} °C<extra></extra>'
    ))

    fig_temp.update_layout(
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFF8F9",
        font=dict(family="Inter, sans-serif", color=text_dark, size=12),
        margin=dict(l=55, r=25, t=30, b=45),
        height=380,
        xaxis=dict(
            title=dict(text="Normalized Exchanger Length (x / L)", font=dict(color=text_dark, size=12, family="Inter, sans-serif")),
            tickfont=dict(color=text_dark, size=11),
            showgrid=True,
            gridcolor=grid_color,
            gridwidth=1,
            linecolor=text_dark,
            linewidth=1.5
        ),
        yaxis=dict(
            title=dict(text="Fluid Temperature (°C)", font=dict(color=text_dark, size=12, family="Inter, sans-serif")),
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

# Chart 2: Flow Benchmark
with chart_col2:
    st.markdown("<h4 style='color:#9C1545; font-weight:800; margin-bottom:4px;'>📊 Flow Configuration Benchmark (Counterflow vs Parallel)</h4>", unsafe_allow_html=True)
    
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
    st.markdown("#### 1. Heat Duty Rate Equations ($Q$)")
    
    st.latex(r"""
    Q = \dot{m}_h \cdot C_{p,h} \cdot (T_{h,\text{in}} - T_{h,\text{out}}) = \dot{m}_c \cdot C_{p,c} \cdot (T_{c,\text{out}} - T_{c,\text{in}}) \quad [\text{kW}]
    """)
    
    st.latex(rf"""
    Q = {m_dot_h:.2f} \cdot {C_p_h:.2f} \cdot ({T_h_in:.1f} - {T_h_out:.1f}) = {Q_kW:.2f} \text{{ kW}} = {Q_kW/1000:.3f} \text{{ MW}}
    """)
    
    st.latex(rf"""
    T_{{c,\text{{out}}}} = T_{{c,\text{{in}}}} + \frac{{Q}}{{\dot{{m}}_c \cdot C_{{p,c}}}} = {T_c_in:.1f} + \frac{{{Q_kW:.2f}}}{{{m_dot_c:.2f} \cdot {C_p_c:.3f}}} = {T_c_out:.2f}^\circ\text{{C}}
    """)

    st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown("#### 2. Terminal Differences ($\Delta T_1, \Delta T_2$) & Log Mean Temp Difference (LMTD)")
    
    if flow_config == "Counterflow":
        st.latex(r"""
        \text{Counterflow Configuration: } \quad \Delta T_1 = T_{h,\text{in}} - T_{c,\text{out}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{in}}
        """)
        st.latex(rf"""
        \Delta T_1 = {T_h_in:.1f} - {T_c_out:.1f} = {delta_T1:.2f}^\circ\text{{C}}, \quad \Delta T_2 = {T_h_out:.1f} - {T_c_in:.1f} = {delta_T2:.2f}^\circ\text{{C}}
        """)
    else:
        st.latex(r"""
        \text{Parallel Flow Configuration: } \quad \Delta T_1 = T_{h,\text{in}} - T_{c,\text{in}}, \quad \Delta T_2 = T_{h,\text{out}} - T_{c,\text{out}}
        """)
        st.latex(rf"""
        \Delta T_1 = {T_h_in:.1f} - {T_c_in:.1f} = {delta_T1:.2f}^\circ\text{{C}}, \quad \Delta T_2 = {T_h_out:.1f} - {T_c_out:.1f} = {delta_T2:.2f}^\circ\text{{C}}
        """)

    st.latex(r"""
    \text{LMTD} = \frac{\Delta T_1 - \Delta T_2}{\ln\left(\frac{\Delta T_1}{\Delta T_2}\right)} \quad [^\circ\text{C}]
    """)
    st.latex(rf"""
    \text{{LMTD}} = \frac{{{delta_T1:.2f} - {delta_T2:.2f}}}{{\ln\left(\frac{{{delta_T1:.2f}}}{{{delta_T2:.2f}}}\right)}} = {LMTD:.2f}^\circ\text{{C}}
    """)

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown(r"#### 3. Required Heat Transfer Area ($A$) & $\varepsilon$-NTU Effectiveness")

    st.latex(r"""
    A = \frac{Q \times 1000}{U \cdot \text{LMTD}} \quad [\text{m}^2]
    """)
    st.latex(rf"""
    A = \frac{{{Q_kW:.2f} \times 1000}}{{{U} \cdot {LMTD:.2f}}} = {Area:.2f} \text{{ m}}^2
    """)

    st.latex(r"""
    C_{\min} = \min(\dot{m}_h C_{p,h}, \dot{m}_c C_{p,c}), \quad Q_{\max} = C_{\min}(T_{h,\text{in}} - T_{c,\text{in}})
    """)
    st.latex(r"""
    \varepsilon = \frac{Q}{Q_{\max}} \times 100\%, \quad \text{NTU} = \frac{U \cdot A}{C_{\min} \times 1000}
    """)
    st.latex(rf"""
    C_{{\min}} = {C_min:.2f} \text{{ kW/K}}, \quad Q_{{\max}} = {Q_max:.2f} \text{{ kW}}, \quad \varepsilon = {effectiveness:.1f}\%, \quad \text{{NTU}} = {NTU:.2f}
    """)

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
