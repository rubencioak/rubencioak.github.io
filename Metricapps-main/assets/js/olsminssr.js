// ols_ssr_logic.js
let x = [];
let y = [];
let n = 500;

function generateData(intercept, slope, variance) {
  x = Array.from({ length: n }, () => Math.random() * 10);
  y = x.map(xi => intercept + slope * xi + randn_bm() * Math.sqrt(variance));
  updateAllPlots();
}

function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function calculateSSR(interceptGuess, slopeGuess) {
  return y.reduce((acc, yi, i) => {
    const residual = yi - (interceptGuess + slopeGuess * x[i]);
    return acc + residual ** 2;
  }, 0);
}

function updateAllPlots() {
  const interceptGuess = parseFloat(document.getElementById("guessIntercept").value);
  const slopeGuess = parseFloat(document.getElementById("guessSlope").value);

  updatePlot1(interceptGuess, slopeGuess);
  updatePlot2(slopeGuess, interceptGuess);
  updatePlot3(interceptGuess, slopeGuess);
  updatePlot4();
  updateResidualPanel(interceptGuess, slopeGuess);
}

function updatePlot1(interceptGuess, slopeGuess) {
  const xLine = [0, 10];
  const yLine = xLine.map(xi => interceptGuess + slopeGuess * xi);

  const tracePoints = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    name: 'Data',
    marker: { color: '#FFD700', size: 2 } // goldenish color
  };

  const traceLine = {
    x: xLine,
    y: yLine,
    mode: 'lines',
    name: 'Guessed Line',
    line: { color: '#FF6347' }
  };

  Plotly.newPlot('plot1', [tracePoints, traceLine], {
    title: 'Generated Data & Guessed Line',
    paper_bgcolor: '#2b2b2b',
    plot_bgcolor: '#2b2b2b',
    font: { color: 'white' },
    xaxis: { title: 'X' },
    yaxis: { title: 'Y' }
  });
}

function updatePlot2(fixedSlope, interceptGuess) {
    const interceptRange = Array.from({ length: 100 }, (_, i) => -10 + i * 0.2);
    const ssrValues = interceptRange.map(b0 => calculateSSR(b0, fixedSlope));

    const minIdx = ssrValues.indexOf(Math.min(...ssrValues));
    const minIntercept = interceptRange[minIdx];

    const trace = {
        x: interceptRange,
        y: ssrValues,
        mode: 'lines',
        line: { color: '#FF6347' },
        name: 'SSR vs Intercept'
    };

    const verticalLine = {
        x: [interceptGuess, interceptGuess],
        y: [Math.min(...ssrValues), Math.max(...ssrValues)],
        mode: 'lines',
        name: 'Guessed Intercept',
        line: {
        color: '#00BA38',
        dash: 'dot',
        width: 3
        },
        showlegend: false
    };

    Plotly.newPlot('plot2', [trace, verticalLine], {
        title: 'SSR vs Intercept',
        paper_bgcolor: '#2b2b2b',
        plot_bgcolor: '#2b2b2b',
        font: { color: 'white' },
        xaxis: {
        title: 'Intercept',
        zeroline: true,
        zerolinewidth: 2,
        zerolinecolor: '#ffffff',
        range: [Math.min(...interceptRange), Math.max(...interceptRange)],
        anchor: 'y'
        },
        yaxis: { title: 'SSR' }
    });
}

function updatePlot3(fixedIntercept, slopeGuess) {
  const slopeRange = Array.from({ length: 100 }, (_, i) => -5 + i * 0.1);
  const ssrValues = slopeRange.map(b1 => calculateSSR(fixedIntercept, b1));

  const minIdx = ssrValues.indexOf(Math.min(...ssrValues));
  const minSlope = slopeRange[minIdx];

  const trace = {
    x: slopeRange,
    y: ssrValues,
    mode: 'lines',
    line: { color: '#FF6347' },
    name: 'SSR vs Slope'
  };

  const verticalLine = {
    x: [slopeGuess, slopeGuess],
    y: [Math.min(...ssrValues), Math.max(...ssrValues)],
    mode: 'lines',
    name: 'Guessed Slope',
    line: {
      color: '#00BFC4',
      dash: 'dot',
      width: 3
    },
    showlegend: false
  };

  Plotly.newPlot('plot3', [trace, verticalLine], {
    title: 'SSR vs Slope',
    paper_bgcolor: '#2b2b2b',
    plot_bgcolor: '#2b2b2b',
    font: { color: 'white' },
    xaxis: {
      title: 'Slope',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: '#ffffff',
      range: [Math.min(...slopeRange), Math.max(...slopeRange)],
      anchor: 'y'
    },
    yaxis: { title: 'SSR' }
  });
}

function updatePlot4() {
  const b0Range = Array.from({ length: 50 }, (_, i) => -10 + i * 0.4);
  const b1Range = Array.from({ length: 50 }, (_, i) => -5 + i * 0.2);
  const z = b0Range.map(b0 => b1Range.map(b1 => calculateSSR(b0, b1)));

  const trace = {
    z: z,
    x: b0Range,
    y: b1Range,
    type: 'surface',
    colorscale: 'Reds',
    showscale: false
  };

  Plotly.newPlot('plot4', [trace], {
    title: 'SSR Surface (β0, β1)',
    scene: {
      xaxis: { title: 'Intercept', backgroundcolor: '#2b2b2b' },
      yaxis: { title: 'Slope', backgroundcolor: '#2b2b2b' },
      zaxis: { title: 'SSR', backgroundcolor: '#2b2b2b' }
    },
    paper_bgcolor: '#2b2b2b',
    font: { color: 'white' }
  });
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const intercept = parseFloat(document.getElementById("intercept").value);
  const slope = parseFloat(document.getElementById("slope").value);
  const variance = parseFloat(document.getElementById("variance").value);
  generateData(intercept, slope, variance);
});

["intercept", "slope", "variance", "guessIntercept", "guessSlope"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    document.getElementById(id + "Val").textContent = e.target.value;
    if (x.length > 0) updateAllPlots();
  });
});

/* Compute and update residuals */
function updateResidualPanel(interceptGuess, slopeGuess) {
  let sumResiduals = 0;
  let sumSquaredResiduals = 0;

  for (let i = 0; i < x.length; i++) {
    const predicted = interceptGuess + slopeGuess * x[i];
    const residual = y[i] - predicted;
    sumResiduals += residual;
    sumSquaredResiduals += residual ** 2;
  }

  document.getElementById("sumResiduals").textContent = sumResiduals.toFixed(3);
  document.getElementById("sumSquaredResiduals").textContent = sumSquaredResiduals.toFixed(3);
}
