/* =========================================================
   EcoGrid AI — dashboard-charts.js
   Loaded only on dashboard.html, after Chart.js and script.js.
   Usage-chart data comes from the Flask-rendered window.ECOGRID_USAGE
   (backed by the EnergyUsage table); solar/mix stay illustrative
   until real sensor feeds are wired to the /api/dashboard/summary endpoint.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.Chart) return;

  const tooltipBase = {
    backgroundColor: 'rgba(7,26,46,0.94)',
    borderColor: 'rgba(0,200,83,0.35)',
    borderWidth: 1,
    padding: 10,
    titleFont: { family: 'JetBrains Mono', size: 11 },
    bodyFont: { family: 'JetBrains Mono', size: 11 },
    cornerRadius: 8,
    displayColors: false
  };

  function gradient(ctx, chartArea, colorTop, colorBottom) {
    const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, colorTop);
    g.addColorStop(1, colorBottom);
    return g;
  }

  const usageData = (window.ECOGRID_USAGE && window.ECOGRID_USAGE.length)
    ? window.ECOGRID_USAGE
    : [
        { day: 'Mon', kwh: 420 }, { day: 'Tue', kwh: 460 }, { day: 'Wed', kwh: 402 },
        { day: 'Thu', kwh: 480 }, { day: 'Fri', kwh: 512 }, { day: 'Sat', kwh: 300 }, { day: 'Sun', kwh: 260 }
      ];

  const usageCtx = document.getElementById('usageChart');
  if (usageCtx) {
    new Chart(usageCtx, {
      type: 'line',
      data: {
        labels: usageData.map(d => d.day),
        datasets: [{
          label: 'kWh',
          data: usageData.map(d => d.kwh),
          borderColor: '#00E5A0',
          borderWidth: 2.5,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return 'rgba(0,200,83,0.15)';
            return gradient(ctx, chartArea, 'rgba(0,229,160,0.32)', 'rgba(0,229,160,0)');
          },
          tension: 0.42,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#00E5A0',
          pointBorderColor: '#071A2E',
          pointBorderWidth: 2,
          shadowColor: 'rgba(0,229,160,0.6)'
        }]
      },
      options: {
        responsive: true,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipBase, callbacks: { label: (c) => `${c.parsed.y} kWh` } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#93A6BA', font: { family: 'JetBrains Mono', size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#93A6BA', font: { family: 'JetBrains Mono', size: 10 } } }
        },
        animation: { duration: 900, easing: 'easeOutQuart' }
      }
    });
  }

  const solarCtx = document.getElementById('solarChart');
  if (solarCtx) {
    new Chart(solarCtx, {
      type: 'bar',
      data: {
        labels: ['6am', '9am', '12pm', '3pm', '6pm'],
        datasets: [{
          label: 'kW',
          data: [2, 18, 34, 26, 6],
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return '#FFC107';
            return gradient(ctx, chartArea, '#FFD34D', '#FF9F1C');
          },
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: '#FFE08A'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipBase, callbacks: { label: (c) => `${c.parsed.y} kW` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#93A6BA', font: { family: 'JetBrains Mono', size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#93A6BA', font: { family: 'JetBrains Mono', size: 10 } } }
        },
        animation: { duration: 900, easing: 'easeOutQuart' }
      }
    });
  }

  const mixCtx = document.getElementById('mixChart');
  if (mixCtx) {
    new Chart(mixCtx, {
      type: 'doughnut',
      data: {
        labels: ['Grid', 'Solar', 'Battery'],
        datasets: [{
          data: [58, 30, 12],
          backgroundColor: ['#1565C0', '#00E5A0', '#FFC107'],
          hoverBackgroundColor: ['#3A85E0', '#4DFFC4', '#FFDA6B'],
          borderColor: '#071A2E',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#C4D3E2', font: { family: 'Inter', size: 11 }, boxWidth: 10, padding: 14 }
          },
          tooltip: { ...tooltipBase, callbacks: { label: (c) => `${c.label}: ${c.parsed}%` } }
        },
        animation: { duration: 900, easing: 'easeOutQuart' }
      }
    });
  }
});
