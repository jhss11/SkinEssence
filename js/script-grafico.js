document.addEventListener('DOMContentLoaded', function() {
    fetch('json/salesData.json')
        .then(response => response.json())
        .then(salesData => {
            const ventasPorMarca = procesarDatos(salesData);
            const etiquetas = Object.keys(ventasPorMarca);
            const datos = Object.values(ventasPorMarca);
            const coloresDeFondo = definirColoresDeFondo();
            const coloresDeBorde = definirColoresDeBorde();

            crearGraficoDePastel(etiquetas, datos, coloresDeFondo, coloresDeBorde);
        })
        .catch(error => console.error('Error al obtener los datos JSON:', error));
});

function procesarDatos(salesData) {
    const ventasPorMarca = {};
    salesData.salesData.forEach(entry => {
        if (ventasPorMarca[entry.brand]) {
            ventasPorMarca[entry.brand] += entry.sales;
        } else {
            ventasPorMarca[entry.brand] = entry.sales;
        }
    });
    return ventasPorMarca;
}

function definirColoresDeFondo() {
    return [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',   
        'rgba(153, 102, 255, 0.5)'
    ];
}

function definirColoresDeBorde() {
    return [
        'rgba(255, 99, 132, 2)',
        'rgba(54, 162, 235, 2)',
        'rgba(255, 206, 86, 2)',
        'rgba(153, 102, 255, 2)'
    ];
}

function crearGraficoDePastel(etiquetas, datos, coloresDeFondo, coloresDeBorde) {
    const ctx = document.getElementById('myPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Ventas por Marca',
                data: datos,
                backgroundColor: coloresDeFondo,
                borderColor: coloresDeBorde,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20,
                        generateLabels: function(chart) {
                            const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                            const labels = original.call(this, chart);
                            labels.forEach(label => {
                                label.text = `₡${chart.data.datasets[0].data[label.index]}`; // Muestra el valor en la leyenda
                            });
                            return labels;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                },
                datalabels: {
                    color: '#000',
                    formatter: function(value, context) {
                        // Muestra la marca dentro del gráfico
                        return context.chart.data.labels[context.dataIndex];
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
