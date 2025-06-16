const n = 500;
let x = Array.from({length: n}, () => Math.random() * 10);
let y = x.map(val => 3 + 2 * val + randn_bm() * 4);
let indices = [...Array(n).keys()].sort(() => Math.random() - 0.5);
let betaHistory = [];
let animationInterval = null;

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function linreg(x, y) {
    const n = x.length;
    const meanX = x.reduce((a,b) => a + b, 0) / n;
    const meanY = y.reduce((a,b) => a + b, 0) / n;
    const covXY = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a,b) => a + b, 0);
    const varX = x.map(xi => (xi - meanX)**2).reduce((a,b) => a + b, 0);
    const slope = covXY / varX;
    const intercept = meanY - slope * meanX;
    return {slope, intercept};
}

function updatePlots(sampleSize) {
    const sampleIdx = indices.slice(0, sampleSize);
    const sampleX = sampleIdx.map(i => x[i]);
    const sampleY = sampleIdx.map(i => y[i]);

    const popReg = linreg(x, y);
    const sampReg = linreg(sampleX, sampleY);

    betaHistory[sampleSize - 1] = sampReg.slope;

    const xLine = [0, 10];
    const popY = xLine.map(xi => popReg.intercept + popReg.slope * xi);
    const sampY = xLine.map(xi => sampReg.intercept + sampReg.slope * xi);

    Plotly.newPlot('plot', [
    {
        x: x,
        y: y,
        mode: 'markers',
        name: 'Population',
        marker: {color: 'white', opacity: 0.5, size: 3}
    },
    {
        x: sampleX,
        y: sampleY,
        mode: 'markers',
        name: 'Sample',
        marker: {color: '#FF6347', size: 3}
    },
    {
        x: xLine,
        y: popY,
        mode: 'lines',
        name: 'Population Line',
        line: {color: 'white', width: 2}
    },
    {
        x: xLine,
        y: sampY,
        mode: 'lines',
        name: 'Sample Line',
        line: {color: '#FF6347', width: 2}
    }
    ], {
    plot_bgcolor: '#2b2b2b',
    paper_bgcolor: '#2b2b2b',
    font: {color: 'white'},
    xaxis: {title: 'X'},
    yaxis: {title: 'Y'},
    title: 'Population vs Sample Regression',
    legend: {x: 0.05, y: 0.95, bgcolor: 'rgba(0,0,0,0)'}
    });

    const x_vals = Array.from({length: sampleSize}, (_, i) => i + 1);
    const beta_vals = x_vals.map(i => betaHistory[i - 1]);

    Plotly.newPlot('betaPlot', [
    {
        x: x_vals,
        y: beta_vals,
        mode: 'lines',
        name: 'Estimated Beta',
        line: {color: '#FF6347', width: 2}
    },
    {
        x: [1, n],
        y: [2, 2],
        mode: 'lines',
        name: 'True Beta',
        line: {color: 'white', dash: 'dot'}
    }
    ], {
    plot_bgcolor: '#2b2b2b',
    paper_bgcolor: '#2b2b2b',
    font: {color: 'white'},
    xaxis: {title: 'Sample Size', range: [1, n]},
    yaxis: {title: 'Beta Estimate'},
    title: 'Beta Estimate over Sample Size',
    legend: {x: 0.05, y: 0.95, bgcolor: 'rgba(0,0,0,0)'}
    });
}

const slider = document.getElementById('sampleSize');
const label = document.getElementById('sampleval');
const animateBtn = document.getElementById('animateButton');

function updateSliderState(val) {
    slider.value = val;
    label.innerText = `${val}`;
    updatePlots(val);

    // Update bubble and slider fill
    const min = +slider.min;
    const max = +slider.max;
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--percent', `${percent}%`);

    const bubblePos = slider.offsetWidth * (percent / 100);
    label.style.left = `${bubblePos}px`;
}

slider.addEventListener('input', (e) => {
    if (animationInterval !== null) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    const size = parseInt(e.target.value);
    updateSliderState(size);
});

animateBtn.addEventListener('click', () => {
    let i = 1;
    animationInterval = setInterval(() => {
        updateSliderState(i);
        i++;
        if (i > 500) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }, 30);
});

updatePlots(50);
