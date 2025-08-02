// --- DATA SIMULATION (In a real app, this would come from an API) ---
const DATASETS = {
    covid: {
        title: 'COVID-19 Global Data',
        insights: [
            { key: 'totalCases', title: 'Total Cases', icon: 'fa-solid fa-virus-covid' },
            { key: 'activeCases', title: 'Active Cases', icon: 'fa-solid fa-hospital-user' },
            { key: 'totalDeaths', title: 'Total Deaths', icon: 'fa-solid fa-skull' },
            { key: 'totalRecovered', title: 'Total Recovered', icon: 'fa-solid fa-hand-holding-medical' },
        ],
        filters: ['USA', 'India', 'Brazil', 'UK', 'Global'],
        data: {
            'USA': {
                totalCases: 100500000, activeCases: 500000, totalDeaths: 1100000, totalRecovered: 99000000,
                monthlyCases: [1500000, 1800000, 1600000, 1900000, 2100000, 2000000]
            },
            'India': {
                totalCases: 45000000, activeCases: 150000, totalDeaths: 550000, totalRecovered: 44300000,
                monthlyCases: [1200000, 1400000, 1350000, 1500000, 1650000, 1550000]
            },
            'Brazil': {
                totalCases: 38000000, activeCases: 100000, totalDeaths: 700000, totalRecovered: 37200000,
                monthlyCases: [1000000, 1100000, 950000, 1200000, 1300000, 1150000]
            },
            'UK': {
                totalCases: 24500000, activeCases: 80000, totalDeaths: 220000, totalRecovered: 24200000,
                monthlyCases: [800000, 850000, 780000, 900000, 950000, 880000]
            },
            'Global': {
                totalCases: 680000000, activeCases: 10000000, totalDeaths: 6800000, totalRecovered: 663200000,
                monthlyCases: [45000000, 50000000, 48000000, 52000000, 55000000, 51000000]
            }
        }
    },
    crypto: {
        title: 'Crypto Market Data',
        insights: [
            { key: 'marketCap', title: 'Total Market Cap', icon: 'fa-solid fa-chart-line' },
            { key: 'volume', title: '24h Volume', icon: 'fa-solid fa-arrow-trend-up' },
            { key: 'dominance', title: 'BTC Dominance', icon: 'fa-brands fa-bitcoin' },
            { key: 'topGainer', title: 'Top Gainer', icon: 'fa-solid fa-trophy' },
        ],
        filters: ['Bitcoin', 'Ethereum', 'Cardano'],
        data: {
            'Bitcoin': {
                marketCap: 1200000000000, volume: 55000000000, dominance: 48.5, topGainer: 'BTC',
                priceHistory: [60000, 62000, 61500, 63000, 65000, 64500]
            },
            'Ethereum': {
                marketCap: 450000000000, volume: 30000000000, dominance: 18.2, topGainer: 'ETH',
                priceHistory: [3800, 3900, 3750, 4000, 4100, 4050]
            },
            'Cardano': {
                marketCap: 25000000000, volume: 1500000000, dominance: 1.1, topGainer: 'ADA',
                priceHistory: [0.6, 0.62, 0.61, 0.63, 0.65, 0.64]
            }
        }
    }
};

const config = {
    data: {}, // Chart.js data object
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                color: 'var(--white)',
                font: { size: 18, weight: 'bold' }
            }
        },
        scales: {
            x: {
                ticks: { color: 'var(--gray-light)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: 'var(--gray-light)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    }
};

let myMainChart, mySecondaryChart;
let currentDataset = 'covid';
let currentFilter = 'Global';

const datasetSelect = document.getElementById('dataset-select');
const filterSelect = document.getElementById('filter-select');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const insightsGrid = document.getElementById('insights-grid');

// --- CORE FUNCTIONALITY ---

function initDashboard() {
    // Setup initial charts
    const mainCtx = document.getElementById('main-chart').getContext('2d');
    myMainChart = new Chart(mainCtx, {
        type: 'bar',
        data: {},
        options: config.options
    });

    const secondaryCtx = document.getElementById('secondary-chart').getContext('2d');
    mySecondaryChart = new Chart(secondaryCtx, {
        type: 'line',
        data: {},
        options: config.options
    });

    // Set up initial filters and data
    populateFilters(currentDataset);
    updateDashboard();
    setupEventListeners();
}

function populateFilters(datasetKey) {
    const filters = DATASETS[datasetKey].filters;
    filterSelect.innerHTML = '<option value="all" selected>All</option>'; // Reset
    filters.forEach(filter => {
        const option = document.createElement('option');
        option.value = filter;
        option.textContent = filter;
        filterSelect.appendChild(option);
    });
    // Set the default filter based on the dataset
    currentFilter = filters[0];
    filterSelect.value = currentFilter;
}

function updateDashboard() {
    const data = DATASETS[currentDataset].data[currentFilter];
    const insightsConfig = DATASETS[currentDataset].insights;

    updateInsights(data, insightsConfig);
    updateCharts(data);
}

function updateInsights(data, insightsConfig) {
    insightsGrid.innerHTML = ''; // Clear previous cards

    insightsConfig.forEach(insight => {
        const value = data[insight.key];
        const formattedValue = typeof value === 'number' ? formatNumber(value) : value;

        const cardHtml = `
            <div class="insight-card">
                <i class="icon ${insight.icon}"></i>
                <div class="title">${insight.title}</div>
                <div class="value">${formattedValue}</div>
            </div>
        `;
        insightsGrid.innerHTML += cardHtml;
    });
}

function updateCharts(data) {
    // Update Main Chart (Bar Chart)
    myMainChart.data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Cases',
            data: data.monthlyCases || data.priceHistory,
            backgroundColor: 'rgba(102, 204, 255, 0.7)',
            borderColor: 'var(--accent-blue)',
            borderWidth: 1
        }]
    };
    myMainChart.options.plugins.title.text = `${currentFilter} - Monthly Trends`;
    myMainChart.update();

    // Update Secondary Chart (Line Chart)
    mySecondaryChart.data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Cumulative Trend',
            data: data.monthlyCases ? data.monthlyCases.reduce((acc, val, i) => {
                acc.push((acc[i-1] || 0) + val);
                return acc;
            }, []) : data.priceHistory,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'var(--white)',
            tension: 0.4,
            fill: true
        }]
    };
    mySecondaryChart.options.plugins.title.text = `${currentFilter} - Cumulative Trend`;
    mySecondaryChart.update();
}

function setupEventListeners() {
    datasetSelect.addEventListener('change', (e) => {
        currentDataset = e.target.value;
        populateFilters(currentDataset);
        // The apply button will handle the final update
    });

    applyFilterBtn.addEventListener('click', () => {
        currentFilter = filterSelect.value;
        // If a new dataset was selected, update the filter to match the new options
        if (!DATASETS[currentDataset].filters.includes(currentFilter) && currentFilter !== 'all') {
            currentFilter = DATASETS[currentDataset].filters[0];
        }
        updateDashboard();
    });
    
    // --- Mouse Cursor Follow Animation ---
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    const speed = 0.1; // Smoothness of the follow

    function animateTrail() {
        // Easing function for smoother movement
        trailX += (mouseX - trailX) * speed;
        trailY += (mouseY - trailY) * speed;

        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;
        
        requestAnimationFrame(animateTrail);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorTrail.classList.add('visible');
    });
    
    animateTrail();
}

// --- Helper Function ---
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    return num.toLocaleString();
}

// Initialize everything when the window loads
window.onload = initDashboard;
