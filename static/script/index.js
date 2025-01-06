const ctx = document.getElementById("myChart");

new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Lunas", "Belum Lunas", "Dibatalkan"],
        datasets: [
            {
                data: [300, 150, 50],
                backgroundColor: [
                    "rgb(75, 192, 192)",
                    "rgb(255, 205, 86)",
                    "rgb(255, 99, 132)",
                ],
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Status Transaksi",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b);
                        const percentage = Math.round((context.raw / total) * 100);
                        return `${context.label}: ${percentage}%`;
                    },
                },
            },
        },
    },
});
