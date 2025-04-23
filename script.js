let currentHotspot = null;

// Cost per unit for each energy source in millions of euro
const energyCosts = {
  solar: .0004,     // €/unit
  biogas: 3.5,      // €/unit
  sTurb: .05,       // €/unit
  lTurb: 6          // €/unit
};

// Annual yield of device or plant in GWh
const energyGains = {
  solar: 0.350,
  biogas: 42,
  sTurb: 0.03,
  lTurb: 6.5
};
 
// Define total budget (in millions)
const totalBudget = 300; // €

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

const energySourceData = {
  Solar: {
    title: "Solar Panel",
    description: "One solar panel generates an amount of energy but also costs about an amount of money.",
    image: "./resources/images/Oosterend.jpg",
    split: {heat: 20, electric: 80}
  },
  Biogas: {
    title: "Anaerobic Co-digestion Plant",
    description: "Energy can be produced from large digestion chambers that convert biomass to methane which is used to generate power and heat.",
    image: "./resources/images/Oosterend.jpg",
    split: {heat: 50, electric: 50}
  },
  smallTurbine: {
    title: "EAZ Wind Turbine",
    description: "These turbines are shorter than 2m and perfect to place in a garden or on a farm.",
    image: "./resources/images/Oosterend.jpg",
    split: {heat: 15, electric: 85}
  },
  largeTurbine: {
    title: "Offshore Windmill",
    description: "These recognisable turbines can be built on the coast to generate energy from the oceanic breezes.",
    image: "./resources/images/Oosterend.jpg",
    split: {heat: 15, electric: 85}
  }
};

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

function getTexelImageName(solar, gas, sTurb, lTurb) {
  const s = solar > 499;
  const g = gas > 4;
  const sT = sTurb > 4999;
  const lT = lTurb > 24;

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

function updatePieChart() {
  if (!currentHotspot) return;

  const data = hotspotData[currentHotspot];
  const solar = parseFloat($('#solarInput').val()) || 0;
  const biogas = parseFloat($('#biogasInput').val()) || 0;
  const wind = parseFloat($('#windInput').val()) || 0;

  const values = [
    solar * (data.energySplit.solar / 100),
    biogas * (data.energySplit.biogas / 100),
    wind * (data.energySplit.wind / 100)
  ];

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

function updateChartAndImage() {
  const solar = parseFloat($('#solarInput').val()) || 0;
  const biogas = parseFloat($('#biogasInput').val()) || 0;
  const sTurb = parseFloat($('#sTurbInput').val()) || 0;
  const lTurb = parseFloat($('#lTurbInput').val()) || 0;
  const wind = (sTurb + lTurb)/2;

  const solarGain = solar * energyGains.solar
  const biogasGain = biogas * energyGains.biogas
  const sTurbGain = sTurb * energyGains.sTurb
  const lTurbGain = lTurb * energyGains.lTurb
  const totalGenerated = solarGain + biogasGain + sTurbGain + lTurbGain;
  const totalDemand = 379; // You can make this dynamic later if needed
  const percentage = Math.min((totalGenerated / totalDemand) * 100, 100); // cap at 100%

  // Calculate budget usage
  const solarCost = solar * energyCosts.solar;
  const biogasCost = biogas * energyCosts.biogas;
  const sTurbCost = sTurb * energyCosts.sTurb;
  const lTurbCost = lTurb * energyCosts.lTurb;
  const totalCost = solarCost + biogasCost + sTurbCost + lTurbCost;
  const budgetPercentage = Math.min((totalCost / totalBudget) * 100, 100); // cap at 100%
  const budgetRemaining = totalBudget - totalCost;

  // Update energy status
  $('#generatedEnergy').text(totalGenerated.toFixed(1));
  $('#demandEnergy').text(totalDemand);
  $('#energyDifference').text((totalGenerated - totalDemand).toFixed(1));

  // Update budget status
  $('#budgetUsed').text(totalCost.toFixed(1));
  $('#budgetTotal').text(totalBudget);
  $('#budgetRemaining').text(budgetRemaining.toFixed(1));

  // Update energy bar
  $('#energyBarFill').css('width', `${percentage}%`);
  $('#energyLabelText').text(`${totalGenerated.toFixed(1)} / ${totalDemand} GWh`);

  // Update budget bar
  $('#budgetBarFill').css('width', `${budgetPercentage}%`);
  $('#budgetLabelText').text(`${totalCost.toFixed(1)} / ${totalBudget} mil.€`);

  drawSankey(solar, biogas, wind);
  const imageName = getTexelImageName(solar, biogas, sTurb, lTurb);
  $('#texelMap').attr('src', imageName);

  updatePieChart();
}

function showInfo(type) {
  if (currentHotspot === type) {
    // Hide the info panel and reset state if clicking the same hotspot
    $('.info-panel').removeClass('show');
    currentHotspot = null;
    return;
  }

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

// Improved function to position hotspots correctly
function positionHotspots() {
  const mapContainer = $('#interactiveMap');
  const mapImage = $('#texelMap');
  
  // Wait for the image to load
  if (mapImage[0].complete) {
    updateHotspotPositions();
  } else {
    mapImage.on('load', updateHotspotPositions);
  }
  
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

// Function to resize hotspots based on map size
function resizeHotspots() {
  const mapWidth = $('#texelMap').width();
  const baseSize = Math.max(20, mapWidth * 0.04); // 4% of map width, minimum 20px
  
  $('.hotspot').css({
    width: `${baseSize}px`,
    height: `${baseSize}px`
  });
  
  // Reposition after resizing
  positionHotspots();
}

$(document).ready(() => {
  // Initially hide hotspots until properly positioned
  $('.hotspot').css('opacity', 0);
  
  updateChartAndImage();
  resizeHotspots(); // This will also call positionHotspots
  
  // Event listeners
  $('#solarInput, #biogasInput, #sTurbInput, #lTurbInput').on('input change', updateChartAndImage);
  
  // Debounce resize event for better performance
  let resizeTimer;
  $(window).on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeHotspots();
    }, 250);
  });
});