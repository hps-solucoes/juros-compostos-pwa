document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate');
    calculateBtn.addEventListener('click', calculateCompoundInterest);
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                })
                .catch(error => {
                    console.log('Falha ao registrar ServiceWorker:', error);
                });
        });
    }

    initializeChart();
});

let evolutionChart;

function initializeChart() {
    const ctx = document.getElementById('evolutionChart');
    
    // Verifica se o Chart.js está carregado
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado corretamente');
        return;
    }
    
    // Configuração otimizada para mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const fontsize = isMobile ? 10 : 12;
    
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Valor Investido',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Valor Acumulado',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: fontsize
                        },
                        boxWidth: 12
                    }
                },
                title: {
                    display: true,
                    text: 'Evolução do Investimento',
                    font: {
                        size: isMobile ? 14 : 16
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                tooltip: {
                    enabled: !isMobile,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.raw);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: fontsize
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: fontsize
                        },
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}

function calculateCompoundInterest() {
    const initial = parseFloat(document.getElementById('initial').value) || 0;
    const monthly = parseFloat(document.getElementById('monthly').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const time = parseInt(document.getElementById('time').value) || 0;
    
    const months = [];
    const investedValues = [];
    const accumulatedValues = [];
    
    let total = initial;
    let invested = initial;
    
    for (let i = 0; i < time; i++) {
        months.push(`Mês ${i+1}`);
        invested += monthly;
        total = total * (1 + rate / 100) + monthly;
        
        investedValues.push(invested);
        accumulatedValues.push(total);
    }
    
    const interest = total - invested;
    
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };
    
    document.getElementById('invested').textContent = formatCurrency(invested);
    document.getElementById('interest').textContent = formatCurrency(interest);
    document.getElementById('total').textContent = formatCurrency(total);
    
    updateChart(months, investedValues, accumulatedValues);
}

function updateChart(months, investedValues, accumulatedValues) {
    if (!evolutionChart) {
        console.error('Gráfico não foi inicializado corretamente');
        return;
    }
    
    evolutionChart.data.labels = months;
    evolutionChart.data.datasets[0].data = investedValues;
    evolutionChart.data.datasets[1].data = accumulatedValues;
    evolutionChart.update();
}