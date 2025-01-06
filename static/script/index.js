const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Penjualan 2024',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 2,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Target',
                data: [15, 15, 15, 15, 15, 15],
                borderWidth: 2,
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Grafik Penjualan'
                },
                tooltip: {
                    mode: 'index'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah (dalam juta)'
                    }
                }
            }
        }
    });