$(document).ready(function () {
  // Fungsi untuk membuat pie chart
    function createPieChart(id, labels, data) {
        const ctx = document.getElementById(id).getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
            labels: labels,
            datasets: [
                {
                data: data,
                backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
                },
            ],
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                position: "bottom",
                },
                title: {
                display: true,
                text:
                    id.charAt(0).toUpperCase() + id.slice(1) + " Distribution",
                },
            },
            },
        });
    }

    // Fungsi untuk membuat line chart transaksi
    function createTransactionChart(id, labels, data) {
        const ctx = document.getElementById(id).getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                {
                    label: "Jumlah Transaksi",
                    data: data,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                    fill: false,
                },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                legend: {
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Transaksi Bulanan",
                },
                },
                scales: {
                y: {
                    beginAtZero: true,
                    title: {
                    display: true,
                    text: "Jumlah Transaksi",
                    },
                },
                x: {
                    title: {
                    display: true,
                    text: "Bulan",
                    },
                },
                },
            },
        });
    }

    // Fungsi untuk memuat data
    function load_data() {
        $.ajax({
        type: "GET",
        url: "/api/chart",
        success: function (response) {
            // Chart Pelanggan (Laki-laki vs Perempuan)
            const pelangganLabels = ["Laki-laki", "Perempuan"];
            createPieChart("pelangganChart", pelangganLabels, [
            response.dataPelanggan.laki,
            response.dataPelanggan.perempuan,
            ]);

            // Chart Status Pembayaran (Lunas vs Belum Lunas)
            const pembayaranLabels = ["Lunas", "Belum Lunas"];
            createPieChart("pembayaranChart", pembayaranLabels, [
            response.dataPembayaran.lunas,
            response.dataPembayaran.belumLunas,
            ]);

            // Chart Transaksi Bulanan
            const bulanLabels = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
            ];
            createTransactionChart(
            "transaksiChart",
            bulanLabels,
            response.dataTransaksi
            );
        },
        error: function (xhr, status, error) {
            console.error("Error fetching chart data:", error);
        },
        });
    }

    // Panggil fungsi load_data saat halaman dimuat
    load_data();

    // Optional: Refresh data setiap interval tertentu (misal setiap 5 menit)
    // setInterval(load_data, 300000);
});
