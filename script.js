let currentHotspot = null;

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
  if (!s && g && !w) return "./resources/Images/Texel_EAZGas.png"; // if you later change biogas to EAZ
  if (s && g && !w) return "./resources/Images/Texel_SolarEAZGas.png"; // and likewise
  return "Texel_0.png"; // fallback
}

$(document).ready(() => {
  function updateChartAndImage() {
    const solar = parseFloat($('#solarInput').val()) || 0;
    const gas = parseFloat($('#biogasInput').val()) || 0; // Replace with 'gasInput' if you rename it
    const wind = parseFloat($('#windInput').val()) || 0;

    drawSankey(solar, gas, wind);

    const imageName = getTexelImageName(solar, gas, wind);
    $('#texelMap').attr('src', imageName);
  }

  // Initial render
  updateChartAndImage();

  // Update on input
  $('#solarInput, #biogasInput, #windInput').on('input', updateChartAndImage);
});

function showInfo(type) {
  if (currentHotspot === type) {
    // Same hotspot clicked again — hide tooltip
    $('.info-box').hide();
    currentHotspot = null;
    return;
  }

  const info = {
    Oosterend: "Oosterend has alot op lorem ipsum potential and lorem ipsum",
    Den_Burg: "The most populous area of the island and hub of commerce.",
    Oudeschild: "A fishing village, relying on fossil fuels to power their boats."
  };

  const position = {
    Oosterend: { top: '43%', left: '65%' },
    Den_Burg: { top: '63%', left: '18%' },
    Oudeschild: { top: '73%', left: '61%' },
  };

  $('.info-box')
    .text(info[type])
    .css({
      position: 'absolute',
      top: position[type].top,
      left: position[type].left,
      display: 'block'
    });

  currentHotspot = type;
}
