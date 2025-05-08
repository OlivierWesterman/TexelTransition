# Texel Energy Transition Simulator

![Texel Energy Transition Simulator](https://via.placeholder.com/800x400?text=Texel+Energy+Transition+Simulator)

## 📊 Overview

The Texel Energy Transition Simulator is an interactive web application that allows users to explore different renewable energy scenarios for Texel, an island in the Netherlands. This tool helps visualize the impact of various energy sources on the island's self-sustainability, budget constraints, and visual landscape.

## ✨ Features

- **Interactive Energy Planning**: Adjust the implementation of different renewable energy sources (solar, biogas, wind turbines, tidal generators)
- **Real-time Feedback**: Instantly see the impact on energy production, budget, and the island's appearance
- **Location-specific Analysis**: Explore different settlements on Texel and their unique energy needs
- **Detailed Energy Information**: Learn about various renewable energy technologies and their characteristics
- **Predefined Scenarios**: Quick-load prepared energy mix scenarios for comparison
- **Data Visualization**: View energy production and flow through dynamic charts
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🖥️ Technologies Used

- **HTML5/CSS3**: For structure and styling
- **SCSS**: For more maintainable and organized styling
- **JavaScript/jQuery**: For interactivity and DOM manipulation
- **Plotly.js**: For advanced data visualization (Sankey diagrams, pie charts)
- **Docker**: For containerization and easy deployment
- **Nginx**: As the web server

## 🚀 How to Use

1. **Adjust Energy Sources**: Use the input fields on the left panel to set quantities for each energy source
2. **Select Scenario**: Choose from predefined scenarios using the dropdown menu
3. **View Impact**: See real-time updates to energy production, budget usage, and visual changes on the map
4. **Explore Locations**: Click on hotspots on the map to view location-specific information
5. **Learn About Technologies**: Click the "i" information buttons to learn about each energy source

## 📖 Energy Sources

The simulator includes the following renewable energy sources:

- **Solar Panels**: Rooftop, façade, and floating installations
- **Biogas Digesters**: Farm-scale, industrial, and community options
- **Small Wind Turbines**: Farm-based, residential, and off-grid options
- **Large Wind Turbines**: Offshore, nearshore, and large onshore options
- **Tidal Generators**: Tidal barrage, tidal stream, and dynamic tidal options

## 📊 Data Visualization

- **Energy Progress Bar**: Shows current energy production relative to total island demand
- **Budget Progress Bar**: Shows current spending relative to total available budget
- **Sankey Diagram**: Visualizes energy flow from sources to end uses (electricity and heat)
- **Location-specific Pie Charts**: Shows energy distribution preferences for each settlement

## 🏙️ Map Visualization

The interactive map changes based on your energy choices, showing the visual impact of energy installations on the island's landscape. Different combinations of energy sources produce unique visual representations.

## 🧩 Project Structure

```
texel-energy-transition/
├── index.html           # Main HTML structure
├── style.css            # Compiled CSS styles
├── scss/               # SCSS source files (optional)
│   └── style.scss      # Main SCSS file
├── script.js           # JavaScript functionality
├── resources/          # Images and other resources
│   └── images/         # Map images and energy source illustrations
├── Dockerfile          # Docker build configuration
├── docker-compose.yml  # Docker Compose configuration
└── nginx.conf          # Nginx web server configuration
```

## 🐳 Docker Deployment

The application can be easily deployed using Docker:

1. **Using Docker Compose (Recommended)**:
   ```bash
   # Build and start the container
   docker-compose up -d
   
   # Access the application at http://localhost:8080
   ```

2. **Manually with Docker**:
   ```bash
   # Build the Docker image
   docker build -t texel-energy-transition .
   
   # Run the container
   docker run -p 8080:80 -v ./resources:/usr/share/nginx/html/resources texel-energy-transition
   ```

3. **Configuration**:
   - The application runs on port 8080 by default (configurable in docker-compose.yml)
   - Resources directory is mounted as a volume for easy updates

## 🔧 Installation & Setup (Non-Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/texel-energy-transition.git
   ```

2. Navigate to the project directory:
   ```bash
   cd texel-energy-transition
   ```

3. If using SCSS (optional):
   ```bash
   # Install Sass if you don't have it
   npm install -g sass
   
   # Compile SCSS to CSS
   sass scss/style.scss style.css
   ```

4. Open `index.html` in your browser or set up a local server:
   ```bash
   # Using Python's built-in server for example
   python -m http.server
   ```

## 🔍 Technical Details

### Energy Calculations

- **Energy Production**: Each energy source produces a specific amount of GWh per unit
- **Heat vs. Electricity**: Energy sources produce different ratios of heat and electricity
- **Budget Calculation**: Investment costs are calculated incrementally from the baseline scenario

### Map Visualization Logic

The map visualization uses a Boolean logic system to determine which image to display based on threshold values for each energy source. This creates a comprehensive visual representation of the energy infrastructure on the island.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Acknowledgments

- Data on energy costs and production based on industry averages
- Island geography and settlement information based on Texel, Netherlands
- Inspired by real-world energy transition challenges faced by islands