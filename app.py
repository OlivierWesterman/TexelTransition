import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Page Config
st.set_page_config(page_title="Texel Energy Model", layout="wide")

# Title
st.markdown("<h1 style='text-align: center;'>Texel</h1>", unsafe_allow_html=True)

# Sidebar: Sliders for Energy Sources
st.sidebar.header("Adjust Energy Sources")
fossil = st.sidebar.slider("Fossil Fuels", 0, 100, 20)
solar = st.sidebar.slider("Solar", 0, 100, 40)
hydro = st.sidebar.slider("Hydro", 0, 100, 30)
wind = st.sidebar.slider("Wind", 0, 100, 50)

# Map Placeholder (Use an image or interactive map)
st.image("./images/Texel_map.jpg", use_container_width=True)

# Pie Charts for Energy Stats
def create_pie_chart(labels, sizes, title):
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140)
    ax.set_title(title)
    return fig

labels = ["Used", "Remaining"]
sizes1 = [fossil, 100 - fossil]
sizes2 = [solar, 100 - solar]
sizes3 = [wind, 100 - wind]

col1, col2, col3 = st.columns(3)
with col1:
    st.pyplot(create_pie_chart(labels, sizes1, "Power Consumption"))
with col2:
    st.pyplot(create_pie_chart(labels, sizes2, "Power Generation"))
with col3:
    st.pyplot(create_pie_chart(labels, sizes3, "Sustainability"))

# Quality of Life Impact (Dummy Data)
st.subheader("Impact on Quality of Life for Inhabitants")
quality_data = pd.DataFrame({
    "Category": ["Health", "Economy", "Environment", "Infrastructure"],
    "Impact": np.random.randint(50, 100, 4)
}).set_index("Category")
st.bar_chart(quality_data)
