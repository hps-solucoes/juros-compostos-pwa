document.addEventListener('DOMContentLoaded', () => {
    // Controle do tema
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Verificar preferência do usuário
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema salvo ou preferência do sistema
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    }
    
    // Alternar tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.textContent = '☀️';
        }
        updateChartTheme();
    });

    // Calculadora
    const calculateBtn = document.getElementById('calculate');
    calculateBtn.addEventListener('click', calculateCompoundInterest);
    
    // Service Worker
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
    
    // Verificar tema atual para configurar cores do gráfico
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Valor Investido',
                    data: [],
                    borderColor: isDark ? 'rgba(100, 255, 100, 1)' : 'rgba(75, 192, 192, 1)',
                    backgroundColor: isDark ? 'rgba(100, 255, 100, 0.2)' : 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Valor Acumulado',
                    data: [],
                    borderColor: isDark ? 'rgba(100, 150, 255, 1)' : 'rgba(54, 162, 235, 1)',
                    backgroundColor: isDark ? 'rgba(100, 150, 255, 0.2)' : 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: getChartOptions()
    });
}

function getChartOptions() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const fontsize = isMobile ? 10 : 12;
    const textColor = isDark ? '#e0e0e0' : '#666';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: fontsize
                    },
                    color: textColor,
                    boxWidth: 12
                }
            },
            title: {
                display: true,
                text: 'Evolução do Investimento',
                font: {
                    size: isMobile ? 14 : 16
                },
                color: textColor,
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
                },
                backgroundColor: isDark ? '#333' : '#fff',
                titleColor: textColor,
                bodyColor: textColor
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: fontsize
                    },
                    color: textColor
                },
                grid: {
                    color: gridColor
                }
            },
            y: {
                ticks: {
                    font: {
                        size: fontsize
                    },
                    color: textColor,
                    callback: function(value) {
                        return new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                },
                grid: {
                    color: gridColor
                }
            }
        }
    };
}

function updateChartTheme() {
    if (!evolutionChart) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Atualizar cores dos datasets
    evolutionChart.data.datasets[0].borderColor = isDark ? 'rgba(100, 255, 100, 1)' : 'rgba(75, 192, 192, 1)';
    evolutionChart.data.datasets[0].backgroundColor = isDark ? 'rgba(100, 255, 100, 0.2)' : 'rgba(75, 192, 192, 0.2)';
    evolutionChart.data.datasets[1].borderColor = isDark ? 'rgba(100, 150, 255, 1)' : 'rgba(54, 162, 235, 1)';
    evolutionChart.data.datasets[1].backgroundColor = isDark ? 'rgba(100, 150, 255, 0.2)' : 'rgba(54, 162, 235, 0.2)';
    
    // Atualizar opções
    evolutionChart.options = getChartOptions();
    evolutionChart.update();
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
    
    updateChartData(months, investedValues, accumulatedValues);
}

function updateChartData(months, investedValues, accumulatedValues) {
    if (!evolutionChart) {
        console.error('Gráfico não foi inicializado corretamente');
        return;
    }
    
    evolutionChart.data.labels = months;
    evolutionChart.data.datasets[0].data = investedValues;
    evolutionChart.data.datasets[1].data = accumulatedValues;
    evolutionChart.update();
}