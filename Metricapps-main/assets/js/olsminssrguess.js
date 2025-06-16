const a = 2, b = 1.5;
let x = [], y = [], u = [];

function generateData() {
    const n = parseInt(document.getElementById("numPoints").value);
    x = Array.from({length: n}, () => 10 * Math.random());
    u = Array.from({length: n}, () => Math.sqrt(4) * randn());
    y = x.map((xi, i) => a + b * xi + u[i]);
    updatePlot();
}

function randn() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function updatePlot() {
    const userA = parseFloat(document.getElementById("intercept").value);
    const userB = parseFloat(document.getElementById("slope").value);
    const yHat = x.map(xi => userA + userB * xi);
    const residuals = y.map((yi, i) => yi - yHat[i]);
    const SSR = residuals.reduce((sum, r) => sum + r * r, 0);
    const SR = residuals.reduce((sum, r) => sum + r, 0).toFixed(2);

    document.getElementById("sumResiduals").innerText = `Sum of Residuals: ${SR}`;
    document.getElementById("sumSquaredResiduals").innerText = `SSR: ${SSR.toFixed(2)}`;

    const dataTrace = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
        marker: { color: 'white', size: 4 }
    };

    const userLine = {
        x: [Math.min(...x), Math.max(...x)],
        y: [userA + userB * Math.min(...x), userA + userB * Math.max(...x)],
        mode: 'lines',
        line: { dash: 'dash', color: 'red', width:3 },
        name: 'Your Line'
    };

    const trueLine = document.getElementById("showTrueLine").checked ? {
        x: [Math.min(...x), Math.max(...x)],
        y: [a + b * Math.min(...x), a + b * Math.max(...x)],
        mode: 'lines',
        line: { color: 'green', width: 3 },
        name: 'True Line'
    } : null;

    const residualSegments = x.map((xi, i) => ({
        x: [xi, xi],
        y: [y[i], yHat[i]],
        mode: 'lines',
        line: { color: 'yellow', width: 1 },
        showlegend: false
    }));

    const residualHist = {
        x: residuals,
        type: 'histogram',
        marker: { color: 'LightSkyBlue' },
        opacity: 0.75,
        name: 'Residuals',
        histnorm: 'probability density',
        nbinsx: 50,
        showlegend: false,
    };

    const showNormal = document.getElementById("showNormal").checked;
    let normalCurve = [];
    if (showNormal) {
        const mean = residuals.reduce((s, r) => s + r, 0) / residuals.length;
        const sd = Math.sqrt(residuals.reduce((s, r) => s + (r - mean) ** 2, 0) / residuals.length);
        const normalX = Array.from({length: 100}, (_, i) => mean - 4*sd + i * (8*sd/99));
        const normalY = normalX.map(xi => (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((xi - mean)/sd)**2));
        normalCurve = [{
            x: normalX,
            y: normalY,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#f67575' },
            name: 'Fitted Normal'
        }];
    }

    Plotly.newPlot('plot', [ ...residualSegments,dataTrace, userLine, ...(trueLine ? [trueLine] : [])], {
        title: 'Generated Data & Guessed Line',
        paper_bgcolor: '#2b2b2b',
        plot_bgcolor: '#2b2b2b',
        font: { color: 'white' },
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        legend: {x: 0.05, y: 0.95, bgcolor: 'rgba(0,0,0,0)'}
    });

    Plotly.newPlot('residualPlot', [residualHist, ...normalCurve], {
        title: 'Histograme of residuals',
        paper_bgcolor: '#2b2b2b',
        plot_bgcolor: '#2b2b2b',
        font: { color: 'white' },
        xaxis: {
            range: [Math.min(...residuals) - 1, Math.max(...residuals) + 1],
            title: 'Residuals'
        },
        yaxis: {
            title: 'Density',
            range: [0, 0.4],  // or another appropriate fixed range
        },
        showlegend: false,
    });
}

/*function showTab(tabId) {
    document.getElementById('app').style.display = tabId === 'app' ? 'flex' : 'none';
    document.getElementById('how').style.display = tabId === 'how' ? 'block' : 'none';
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}
*/
document.querySelectorAll('input[type="range"], input[type="checkbox"]').forEach(el => el.addEventListener('input', updatePlot));

generateData();
