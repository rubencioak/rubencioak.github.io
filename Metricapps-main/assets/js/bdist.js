function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function simulateBetas(n, numSim) {
    let betas = [];
    for (let i = 0; i < numSim; i++) {
        let x = Array.from({ length: n }, () => 5 + 2 * randn_bm());
        let y = x.map(xi => 3 + 2 * xi + 2 * randn_bm());

        const xMean = x.reduce((a, b) => a + b) / n;
        const yMean = y.reduce((a, b) => a + b) / n;
        const beta1 = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0) /
                    x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);

        betas.push(beta1);
    }
    return betas;
}

function plotHistogram(betas, showNormal) {
    const trace = {
        x: betas,
        type: 'histogram',
        histnorm: 'probability density',
        marker: { color: '#00BFC4' },
        autobinx: false,
        xbins: { start: 1, end: 3, size: 0.01 }
    };

    const data = [trace];

    if (showNormal) {
        const mean = betas.reduce((a, b) => a + b, 0) / betas.length;
        const std = Math.sqrt(betas.reduce((a, b) => a + (b - mean) ** 2, 0) / betas.length);
        const x = Array.from({ length: 100 }, (_, i) => 1 + i * 0.02);
        const y = x.map(xi => (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((xi - mean) / std) ** 2));
        data.push({ x, y, type: 'scatter', mode: 'lines', line: { color: '#F8766D' }, name: 'Normal' });
    }

    Plotly.newPlot('plot', data, {
        title: 'Distibution of the Beta Estimator',
        xaxis: {
            title: 'Estimated Beta',
            range: [1, 3],
            gridwidth: 2,
            showgrid: true,
            zeroline: false,
            showline: true,
            ticks: 'outside',
            minor: { show: true, dtick: 0.05, gridcolor: 'red', gridwidth: 10}
        },
        yaxis: {
            title: 'Density',
            range: [0, 12],
            gridwidth: 2,
            showgrid: true,
            zeroline: false,
            showline: true,
            ticks: 'outside',
            minor: { show: true, dtick:0.05, gridcolor: '#444', gridwidth: 1}
        },
        plot_bgcolor: '#121212',
        paper_bgcolor: '#121212',
        font: { color: 'white' },
        showlegend: false,
    });
    
}

function update() {
    const n = +document.getElementById("sampleSize").value;
    const numSim = +document.getElementById("numSim").value;
    const showNormal = document.getElementById("showNormal").checked;

    const betas = simulateBetas(n, numSim);
    plotHistogram(betas, showNormal);
}

document.getElementById("sampleSize").oninput = update;
document.getElementById("numSim").oninput = update;
document.getElementById("showNormal").onchange = update;

// Initial plot
update();
