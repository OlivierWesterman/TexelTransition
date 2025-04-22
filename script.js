let currentHotspot = null;

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
      value: [solar, solar * 0.2, biogas * 0.05, biogas, wind, wind * 0.6],
      color: ["#f39c12", "#f39c12", "#27ae60", "#27ae60", "#3498db", "#3498db"]
    }
  };

  Plotly.react("sankeyChart", [data], { title: "Energy Flow" });
}

function getTexelImageName(solar, gas, wind) {
  const s = solar > 50;
  const g = gas > 50;
  const w = wind > 50;

  if (!s && !g && !w) return "./resources/Images/Texel_0.png";
  if (s && g && w) return "./resources/Images/Texel_All.png";
  if (s && !g && !w) return "./resources/Images/Texel_Solar.png";
  if (!s && g && !w) return "./resources/Images/Texel_Gas.png";
  if (!s && !g && w) return "./resources/Images/Texel_OffShore.png";
  if (!s && g && w) return "./resources/Images/Texel_OffShoreGas.png";
  if (s && g && !w) return "./resources/Images/Texel_SolarGas.png";
  if (s && !g && w) return "./resources/Images/Texel_SolarOffShore.png";
  if (s && g && w) return "./resources/Images/Texel_SolarOffshoreGas.png";
  if (s && w && !g) return "./resources/Images/Texel_SolarWind.png";
  if (!s && w && !g) return "./resources/Images/Texel_Wind.png";
  if (!s && w && g) return "./resources/Images/Texel_WindGas.png";
  if (s && !g && !w) return "./resources/Images/Texel_Solar.png";
  if (!s && g && !w) return "./resources/Images/Texel_Gas.png";
  if (!s && !g && w) return "./resources/Images/Texel_OffShore.png";
  if (!s && g && !w) return "./resources/Images/Texel_EAZGas.png";
  if (s && g && !w) return "./resources/Images/Texel_SolarEAZGas.png";
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
  const wind = parseFloat($('#windInput').val()) || 0;

  const totalGenerated = solar + biogas + wind;
  const totalDemand = 200; // You can make this dynamic later if needed
  const percentage = Math.min((totalGenerated / totalDemand) * 100, 100); // cap at 100%

  // Update energy status
  $('#generatedEnergy').text(totalGenerated.toFixed(1));
  $('#demandEnergy').text(totalDemand);
  $('#energyDifference').text((totalGenerated - totalDemand).toFixed(1));

  $('#energyBarFill').css('width', `${percentage}%`);
  $('#energyLabelText').text(`${totalGenerated.toFixed(1)} / ${totalDemand} kWh`);

  drawSankey(solar, biogas, wind);
  const imageName = getTexelImageName(solar, biogas, wind);
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
  $('#solarInput, #biogasInput, #windInput').on('input change', updateChartAndImage);
  
  // Debounce resize event for better performance
  let resizeTimer;
  $(window).on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeHotspots();
    }, 250);
  });
});