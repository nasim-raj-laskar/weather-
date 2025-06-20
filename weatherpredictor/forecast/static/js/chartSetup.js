document.addEventListener('DOMContentLoaded', () => {
    const chartElement = document.getElementById('chart');
    const dataToggle = document.getElementById('dataToggle');

    if (!chartElement) {
        console.error('Chart element not found');
        return;
    }

    const ctx = chartElement.getContext('2d');
    const gradient = ctx.createLinearGradient(0, -10, 0, 100);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(136, 255, 0,1)');

    const forecastItems = document.querySelectorAll('.forecast-item');
    const temps = [], hums = [], times = [];

    forecastItems.forEach(item => {
        const time = item.querySelector('.forecast-time').textContent;
        const temp = parseFloat(item.querySelector('.forecast-temperatureValue').textContent);
        const hum = parseFloat(item.querySelector('.forecast-humidityValue').textContent);
        if (time && !isNaN(temp) && !isNaN(hum)) {
            times.push(time);
            temps.push(temp);
            hums.push(hum);
        }
    });

    if (temps.length === 0 || times.length === 0) {
        console.error('No data found');
        return;
    }

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Celsius Degrees',
                data: temps,
                borderColor: gradient,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'white',
                pointBorderColor: gradient,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y} °C at ${context.label}`
                    }
                }
            },
            scales: {
                x: { display: false, grid: { drawOnChartArea: false } },
                y: { display: false, grid: { drawOnChartArea: false } }
            },
            animation: { duration: 750 }
        }
    });

    dataToggle.addEventListener('change', (e) => {
        const type = e.target.value;
        chart.data.datasets[0].data = type === 'temp' ? temps : hums;
        chart.data.datasets[0].label = type === 'temp' ? 'Celsius Degrees' : 'Humidity %';
        chart.options.plugins.tooltip.callbacks.label = context => `${context.parsed.y}${type === 'temp' ? ' °C' : '%'} at ${context.label}`;
        chart.update();
    });

    // Style fix for forecast overflow
    const forecastSection = document.querySelector('.forecast');
    if (forecastSection) {
        forecastSection.style.display = 'flex';
        forecastSection.style.justifyContent = 'space-between';
        forecastSection.style.flexWrap = 'nowrap';
        forecastSection.style.overflowX = 'auto';
        forecastSection.style.gap = '10px';
        forecastSection.style.scrollBehavior = 'smooth';
        forecastSection.style.webkitOverflowScrolling = 'touch';
    }

    document.querySelectorAll('.forecast-item').forEach(item => {
        item.style.flex = '1 1 18%';
        item.style.minWidth = '100px';
        item.style.maxWidth = '140px';
        item.style.textAlign = 'center';
    });
});
