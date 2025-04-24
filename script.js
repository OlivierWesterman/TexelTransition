// Global variable tracking the currently selected location or energy source
let currentHotspot = null;

// Unit costs for different energy sources (in millions of euro)
const energyCosts = {
  solar: 1.1,     // Cost per solar unit (€M)
  biogas: 3.5,    // Cost per biogas plant (€M)
  sTurb: .05,     // Cost per small turbine (€M)
  lTurb: 3        // Cost per large offshore turbine (€M)
};

// Annual energy production per unit (in GWh)
const energyGains = {
  solar: 2,       // Output per solar unit (GWh)
  biogas: 42,     // Output per biogas plant (GWh)
  sTurb: 0.175,   // Output per small turbine (GWh)
  lTurb: 30       // Output per large offshore turbine (GWh)
};
 
// Define available investment budget (in millions of euros)
const totalBudget = 40; // €M

/**
 * Data for specific locations/settlements on Texel
 * Each location includes:
 * - Description of the area
 * - Image path for visualization
 * - Position coordinates on the map (percentage-based)
 * - Energy distribution preferences by type
 */
const hotspotData = {
  Oosterend: {
    description: "Oosterend has a lot of lorem ipsum potential and lorem ipsum",
    image: "./resources/images/Oosterend.jpg",
    position: { top: '50%', left: '72.8%' },
    energySplit: { wind: 50, solar: 18, biogas: 32 }
  },
  Den_Burg: {
    description: "The most populous area of the island and hub of commerce.",
    image: "./resources/images/DenBurg.jpg",
    position: { top: '65%', left: '46%' },
    energySplit: { wind: 32, solar: 24, biogas: 44 }
  },
  Oudeschild: {
    description: "A fishing village, relying on fossil fuels to power their boats.",
    image: "./resources/images/Oudeschild.jpg",
    position: { top: '73%', left: '65%' },
    energySplit: { wind: 18, solar: 48, biogas: 24 }
  }
};

/**
 * Detailed information about each energy source
 * Includes type descriptions, efficiency ratings, environmental impacts,
 * and implementation subtypes with their characteristics
 */
const energySourceData = {
  Solar: {
    title: "Solar Panel",
    description: "Solar panels capture sunlight and convert it into electricity and heat. They are easy to install, require low maintenance, and are ideal for rooftops or floating structures. Installation cost varies based on panel type and placement.",
    image: "./resources/images/Zonnepaneel.jpg",
    split: { heat: 60, electric: 20 },
    subtypes: {
      rooftops: {
        keywords: "Quiet, unobtrusive, residential",
        efficiency: 'B',
        environmental_impact: 'A',
      },
      facades: {
        keywords: "Visible, integrated into building design",
        efficiency: 'C',
        environmental_impact: 'B'
      },
      floats: {
        keywords: "Space-efficient, cooling effect from water",
        efficiency: 'B',
        environmental_impact: 'B'
      }
    }
  },
  Biogas: {
    title: "Biogas",
    description: "Biogas is produced by anaerobic digestion of organic waste, generating methane for use in combined heat and power (CHP) systems. It's a flexible and sustainable solution for local energy loops.",
    image: "./resources/Images/Biodigester.jpg",
    split: { heat: 50, electric: 50 },
    subtypes: {
      farm_scale: {
        keywords: "Manure, crop waste, rural application",
        efficiency: 'A',
        environmental_impact: 'B'
      },
      industrial: {
        keywords: "Food waste, sewage, large-scale plants",
        efficiency: 'B',
        environmental_impact: 'B'
      },
      community: {
        keywords: "Neighborhood compost, small footprint",
        efficiency: 'C',
        environmental_impact: 'A'
      }
    }
  },
  smallTurbine: {
    title: "EAZ Wind Turbine",
    description: "Small wind turbines are ideal for decentralized electricity generation, especially in semi-rural or open areas. They can supplement solar or grid power, and require consistent wind flow for optimal output.",
    image: "./resources/Images/EAZ_Turbine.jpg",
    split: { heat: 15, electric: 85 },
    subtypes: {
      farm: {
        keywords: "Farmland, energy independence",
        efficiency: 'B',
        environmental_impact: 'B'
      },
      residential: {
        keywords: "Small-scale, garden-mounted",
        efficiency: 'C',
        environmental_impact: 'A'
      },
      off_grid: {
        keywords: "Remote cabins, backup power",
        efficiency: 'B',
        environmental_impact: 'A'
      }
    }
  },
  largeTurbine: {
    title: "Offshore Windmill",
    description: "Large offshore wind turbines capture powerful sea winds to generate high-output renewable electricity. They are expensive to install but offer excellent efficiency and minimal land use.",
    image: "./resources/Images/Offshore_Turbine.jpg",
    split: { heat: 15, electric: 85 },
    subtypes: {
      offshore: {
        keywords: "Deep-sea, high-yield, stable winds",
        efficiency: 'A',
        environmental_impact: 'B'
      },
      nearshore: {
        keywords: "Closer to coast, easier access",
        efficiency: 'B',
        environmental_impact: 'B'
      },
      onshore_large: {
        keywords: "Wide open land, high visual impact",
        efficiency: 'B',
        environmental_impact: 'C'
      }
    }
  }
};

/**
 * Predefined energy mix scenarios
 * Each scenario represents a different distribution of energy sources
 * Used for quick loading of different energy strategies
 */
const scenarios = {
  current: {solar: 25, biogas: 1, sTurb: 10, lTurb: 0},
  scenarioA: {solar: 10, biogas: 3, sTurb: 10, lTurb: 4},
  scenarioB: {solar: 30, biogas: 1, sTurb: 600, lTurb: 0}
};

// Calculate baseline costs for the current scenario (for cost comparison)
const baselineSolarCost = scenarios.current.solar * energyCosts.solar;
const baselineBiogasCost = scenarios.current.biogas * energyCosts.biogas;
const baselineSTurbCost = scenarios.current.sTurb * energyCosts.sTurb;
const baselineLTurbCost = scenarios.current.lTurb * energyCosts.lTurb;
const baselineTotalCost = baselineSolarCost + baselineBiogasCost + baselineSTurbCost + baselineLTurbCost;

//Calculates additional investment costs beyond the current baseline. 
//Only counts costs for additions beyond the current scenario
function calculateIncrementalCost(solar, biogas, sTurb, lTurb) {
  // Calculate costs only for units exceeding the current baseline
  const totalSolarCost = Math.max(0, (solar - scenarios.current.solar)) * energyCosts.solar;
  const totalBiogasCost = Math.max(0, (biogas - scenarios.current.biogas)) * energyCosts.biogas;
  const totalSTurbCost = Math.max(0, (sTurb - scenarios.current.sTurb)) * energyCosts.sTurb;
  const totalLTurbCost = Math.max(0, (lTurb - scenarios.current.lTurb)) * energyCosts.lTurb;
  
  return totalSolarCost + totalBiogasCost + totalSTurbCost + totalLTurbCost;
}

//Creates a Sankey diagram showing energy flow from sources to end uses
function drawSankey(solar, biogas, wind) {
  const data = {
    type: "sankey",
    orientation: "h",
    node: {
      pad: 15,
      thickness: 20,
      line: { color: "black", width: 0.5 },
      label: ["Solar", "Biogas", "Wind", "Electric", "Heat"],
      color: ["#f39c12", "#27ae60", "#3498db", "yellow", "coral"]
    },
    link: {
      source: [0, 0, 1, 1, 2, 2],
      target: [3, 4, 3, 4, 3, 4],
      value: [solar * 0.8, solar * 0.2, biogas * 0.5, biogas * 0.5, wind * 0.85 , wind * 0.15],
      color: ["#f39c12", "#f39c12", "#27ae60", "#27ae60", "#3498db", "#3498db"]
    }
  };

  Plotly.react("sankeyChart", [data], { title: "Energy Flow" });
}

// Load a predefined energy scenario Updates input values and refreshes visualizations
function loadScenario(scenarioName) {
  const scenario = scenarios[scenarioName];
  
  if (scenario) {
    $('#solarInput').val(scenario.solar);
    $('#biogasInput').val(scenario.biogas);
    $('#sTurbInput').val(scenario.sTurb);
    $('#lTurbInput').val(scenario.lTurb);
    
    // Update the charts and visuals
    updateChartAndImage();
  }
}

/* Determines which island map image to display based on energy mix
 * Returns different map images showing visual impacts of energy sources */

function getTexelImageName(solar, gas, sTurb, lTurb) {
  // Convert values to boolean flags for threshold comparisons
  const s = solar > 40;
  const g = gas > 6;
  const sT = sTurb > 350;
  const lT = lTurb > 5;

  // None
  if (!s && !g && !sT && !lT) return "./resources/Images/Texel_0.png"

  //Singles
  if (s && !g && !sT && !lT) return "./resources/Images/Texel_Solar.png"
  if (!s && g && !sT && !lT) return "./resources/Images/Texel_Gas.png"
  if (!s && !g && sT && !lT) return "./resources/Images/Texel_EAZ.png"
  if (!s && !g && !sT && lT) return "./resources/Images/Texel_OffShore.png"

  //Doubles
    // Solar
  if (s && g && !sT && !lT) return "./resources/Images/Texel_SolarGas.png"
  if (s && !g && sT && !lT) return "./resources/Images/Texel_SolarEAZ.png"
  if (s && !g && !sT && lT) return "./resources/Images/Texel_SolarOffShore.png"

    // Gas
  if (!s && g && sT && !lT) return "./resources/Images/Texel_EAZGas.png"
  if (!s && g && !sT && lT) return "./resources/Images/Texel_OffShoreGas.png"

    // EAZ
  if (!s && !g && sT && lT) return "./resources/Images/Texel_Wind.png"

  //Triples
    // EAZ and Offshore
  if (s && !g && sT && lT) return "./resources/Images/Texel_SolarWind.png"
  if (!s && g && sT && lT) return "./resources/Images/Texel_WindGas.png"

    // Solar & Gas
  if (s && g && sT && !lT) return "./resources/Images/Texel_SolarEAZGas.png"
  if (s && g && !sT && lT) return "./resources/Images/Texel_SolarOffShoreGas.png"

  // All
  if (s && g && sT && lT) return "./resources/Images/Texel_All.png";

  // Back-up
  return "Texel_0.png";
}

/**
 * Updates the pie chart for the currently selected location
 * Shows the distribution of energy types in the selected area
 */
function updatePieChart() {
  if (!currentHotspot) return;
  
  // Check if this is a hotspot and not an energy source
  if (!currentHotspot.startsWith('source_')) {
    const data = hotspotData[currentHotspot];
    const solar = parseFloat($('#solarInput').val()) || 0;
    const biogas = parseFloat($('#biogasInput').val()) || 0;
    const sTurb = parseFloat($('#sTurbInput').val()) || 0;
    const lTurb = parseFloat($('#lTurbInput').val()) || 0;
    
    // Combine both turbine types for the wind value
    const wind = sTurb + lTurb;
    
    // Calculate values based on location's energy split preferences
    const values = [
      solar * (data.energySplit.solar / 100),
      biogas * (data.energySplit.biogas / 100),
      wind * (data.energySplit.wind / 100)
    ];

    // Create pie chart with Plotly
    Plotly.react('pieChart', [{
      type: 'pie',
      values,
      labels: ['Solar', 'Biogas', 'Wind'],
      marker: {
        colors: ['#f39c12', '#27ae60', '#3498db']
      },
      textinfo: 'label+percent',
      hoverinfo: 'label+value+percent'
    }], {
      margin: { t: 0, b: 0, l: 0, r: 0 },
      showlegend: false
    });
  }
}

/**
 * Main function to update all charts, visualizations and statistics
 * Called whenever energy input values change
 */
function updateChartAndImage() {
  // Get current input values
  const solar = parseFloat($('#solarInput').val()) || 0;
  const biogas = parseFloat($('#biogasInput').val()) || 0;
  const sTurb = parseFloat($('#sTurbInput').val()) || 0;
  const lTurb = parseFloat($('#lTurbInput').val()) || 0;
  const wind = (sTurb + lTurb)/2;

  // Calculate energy production based on number of units and their yield
  const solarGain = solar * energyGains.solar;
  const biogasGain = biogas * energyGains.biogas;
  const sTurbGain = sTurb * energyGains.sTurb;
  const lTurbGain = lTurb * energyGains.lTurb;
  const totalGenerated = solarGain + biogasGain + sTurbGain + lTurbGain;
  const totalDemand = 379; // Total energy demand in GWh - could be made dynamic
  const percentage = Math.min((totalGenerated / totalDemand) * 100, 100); // cap at 100%

  // Calculate incremental budget usage
  const incrementalCost = calculateIncrementalCost(solar, biogas, sTurb, lTurb);
  const budgetPercentage = Math.min((incrementalCost / totalBudget) * 100, 100); // cap at 100%
  const budgetRemaining = totalBudget - incrementalCost;

  // Update energy status in UI
  $('#generatedEnergy').text(totalGenerated.toFixed(1));
  $('#demandEnergy').text(totalDemand);
  $('#energyDifference').text((totalGenerated - totalDemand).toFixed(1));

  // Update budget status in UI
  $('#budgetUsed').text(incrementalCost.toFixed(1));
  $('#budgetTotal').text(totalBudget);
  $('#budgetRemaining').text(budgetRemaining.toFixed(1));

  // Update energy progress bar
  $('#energyBarFill').css('width', `${percentage}%`);
  $('#energyLabelText').text(`Self-production: ${totalGenerated.toFixed(1)} / ${totalDemand} GWh`);

  // Update budget progress bar
  $('#budgetBarFill').css('width', `${budgetPercentage}%`);
  $('#budgetLabelText').text(`Investment: ${incrementalCost.toFixed(1)} / ${totalBudget} mil.€`);

  // Update visualizations
  drawSankey(solar, biogas, wind);
  const imageName = getTexelImageName(solar, biogas, sTurb, lTurb);
  $('#texelMap').attr('src', imageName);

  // Update location-specific visualization if applicable
  updatePieChart();
}

// Displays information panel for a selected location or energy source
function showInfo(type) {
  // Check if it's an energy source rather than a location
  if (type.startsWith('source_')) {
    showEnergySourceInfo(type.replace('source_', ''));
    return;
  }

  // Toggle off if clicking the same hotspot
  if (currentHotspot === type) {
    // Hide the info panel and reset state if clicking the same hotspot
    $('.info-panel').removeClass('show');
    currentHotspot = null;
    return;
  }

  // Set current hotspot and retrieve its data
  currentHotspot = type;
  const data = hotspotData[type];

  // Update the right panel with the hotspot information
  $('#infoContent').html(`
    <h3>${type.replace('_', ' ')}</h3>
    <p>${data.description}</p>
    <img src="${data.image}" alt="${type}">
    <h4>Energy Split:</h4>
    <ul>
      <li>Wind: ${data.energySplit.wind}%</li>
      <li>Solar: ${data.energySplit.solar}%</li>
      <li>Biogas: ${data.energySplit.biogas}%</li>
    </ul>
    <div id="pieChart"></div>
  `);

  // Show the right panel
  $('.info-panel').addClass('show');
  
  // Use setTimeout to ensure the DOM has updated before drawing the chart
  setTimeout(() => {
    updatePieChart();
    // Force a window resize event to make Plotly adjust the chart
    window.dispatchEvent(new Event('resize'));
  }, 50);
}

/**
 * Positions hotspot markers on the map according to their coordinates
 * Ensures hotspots are properly positioned relative to the map size
 */
function positionHotspots() {
  const mapContainer = $('#interactiveMap');
  const mapImage = $('#texelMap');
  
  // Wait for the image to load before positioning
  if (mapImage[0].complete) {
    updateHotspotPositions();
  } else {
    mapImage.on('load', updateHotspotPositions);
  }
  
  /**
   * Updates hotspot positions based on current map dimensions
   * Called when map loads or is resized
   */
  function updateHotspotPositions() {
    // Get the dimensions of the map image
    const mapWidth = mapImage.width();
    const mapHeight = mapImage.height();
    
    // For each hotspot, set its position based on the percentage values
    Object.keys(hotspotData).forEach(hotspotId => {
      const hotspot = $(`#${hotspotId}`);
      const data = hotspotData[hotspotId];
      
      if (data && data.position) {
        // Parse percentage values
        const topPercent = parseFloat(data.position.top) / 100;
        const leftPercent = parseFloat(data.position.left) / 100;
        
        // Calculate pixel positions relative to map dimensions
        const topPx = mapHeight * topPercent;
        const leftPx = mapWidth * leftPercent;
        
        // Adjust for hotspot size (half of width/height to center it)
        const hotspotSize = hotspot.width() / 2;
        
        // Apply positions
        hotspot.css({
          top: `${topPx - hotspotSize}px`,
          left: `${leftPx - hotspotSize}px`
        });
      }
    });
    
    // Make hotspots visible after positioning
    $('.hotspot').css('opacity', 1);
  }
}

/**
 * Resizes hotspot markers based on current map size
 * Ensures hotspots scale appropriately with responsive design
 */
function resizeHotspots() {
  const mapWidth = $('#texelMap').width();
  const baseSize = Math.max(20, mapWidth * 0.04); // 4% of map width, minimum 20px
  
  $('.hotspot').css({
    width: `${baseSize}px`,
    height: `${baseSize}px`
  });
  
  // Reposition after resizing to maintain proper placement
  positionHotspots();
}

/**
 * jQuery document ready handler - initializes the application
 */
$(document).ready(() => {
  // Initially hide hotspots until properly positioned
  $('.hotspot').css('opacity', 0);
  
  // Initialize UI state
  updateChartAndImage();
  resizeHotspots(); // This will also call positionHotspots
  
  // Load default scenario
  loadScenario('current');
  
  // Event listener for scenario dropdown
  $('#scenarioSelect').on('change', function() {
    const selectedScenario = $(this).val();
    loadScenario(selectedScenario);
  });

  // Event listeners for energy input sliders/fields
  $('#solarInput, #biogasInput, #sTurbInput, #lTurbInput').on('input change', updateChartAndImage);
  
  // Event listener for info buttons
  $('.info-btn').on('click', function(e) {
    e.preventDefault(); // Prevent any default button behavior
    const sourceType = $(this).data('source');
    showEnergySourceInfo(sourceType);
  });
  
  // Debounce resize event for better performance
  let resizeTimer;
  $(window).on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeHotspots();
    }, 250);
  });
});

// Shows detailed information about a specific energy source
function showEnergySourceInfo(sourceType) {
  // Toggle off if clicking the same source
  if (currentHotspot === `source_${sourceType}`) {
    // Hide the info panel and reset state if clicking the same source
    $('.info-panel').removeClass('show');
    currentHotspot = null;
    return;
  }

  // Set current hotspot and get its data
  currentHotspot = `source_${sourceType}`;
  const data = energySourceData[sourceType];

  // Create HTML for subtypes - each energy source has different implementation types
  let subtypesHTML = '';
  for (const [subtypeKey, subtypeData] of Object.entries(data.subtypes)) {
    const formattedName = subtypeKey.replace(/_/g, ' ');
    subtypesHTML += `
      <div class="subtype-item">
        <h5>${formattedName.charAt(0).toUpperCase() + formattedName.slice(1)}</h5>
        <div class="subtype-details">
          <div class="keywords"><span>Keywords:</span> ${subtypeData.keywords}</div>
          <div class="ratings">
            <div class="rating efficiency">
              <span>Efficiency:</span> 
              <span class="rating-value rating-${subtypeData.efficiency.toLowerCase()}">${subtypeData.efficiency}</span>
            </div>
            <div class="rating environmental">
              <span>Environmental Impact:</span> 
              <span class="rating-value rating-${subtypeData.environmental_impact.toLowerCase()}">${subtypeData.environmental_impact}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update the right panel with the energy source information
  $('#infoContent').html(`
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <img src="${data.image}" alt="${data.title}">
    
    <div class="energy-split-container">
      <h4>Energy Output:</h4>
      <div class="split-details">
        <div class="split-heat">Heat: ${data.split.heat}%</div>
        <div class="split-electric">Electric: ${data.split.electric}%</div>
      </div>
      <div id="energySplitChart"></div>
    </div>
    
    <div class="subtypes-container">
      <h4>Implementation Types:</h4>
      <div class="subtypes-list">
        ${subtypesHTML}
      </div>
    </div>
  `);

  // Show the right panel
  $('.info-panel').addClass('show');

  // Use setTimeout to ensure the DOM has updated before drawing the chart
  setTimeout(() => {
    drawEnergySplitPieChart(data.split);
    // Force a window resize event to make Plotly adjust the chart
    window.dispatchEvent(new Event('resize'));
  }, 50);
}

// Draws a pie chart showing energy output split between heat and electricity
function drawEnergySplitPieChart(splitData) {
  Plotly.react('energySplitChart', [{
    type: 'pie',
    values: [splitData.heat, splitData.electric],
    labels: ['Heat', 'Electric'],
    marker: {
      colors: ['coral', 'yellow']
    },
    textinfo: 'label+percent',
    hoverinfo: 'label+value+percent'
  }], {
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: false
  });
}