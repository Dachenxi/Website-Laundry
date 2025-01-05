$(document).ready(function() {
    let tablekaryawan; // Variabel untuk menyimpan instance DataTable

    function initializeDataTable() {
        // Destroy instance yang ada jika sudah ada
        if ($.fn.DataTable.isDataTable('#tabel-transaksi')) {
            $('#tabel-transaksi').DataTable().destroy();
        }

        // Inisialisasi DataTable baru
        tablekaryawan = $('#tabel-transaksi').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            lengthMenu: [5, 10, 15, 20, 25, 50, 100],
            responsive: true,
            language: {
                search: "Cari:",
                lengthMenu: "_MENU_ data setiap page",
                info: "Menampilkan _START_ hingga _END_ dari _TOTAL_ data"
            }
        });
    }
    function load_pelanggan() {
        showWaitToast('Mengambil Data');
        $.ajax({
            url: '/api/transaksi',
            type: 'GET',
            success: function(response) {
                const dataTransaksi = response.dataTransaksi
                const totalTransaksi = response.transaksi.totalTransaksi
                const transaksiHariIni = response.transaksi.hariini
                const tabel = $('#tabel-transaksi tbody');
                tabel.empty();
                dataTransaksi.forEach(transaksi => {
                    const row = `
                    <tr>
                        <td>${transaksi.idTransaksi}</td>
                        <td>${transaksi.tanggal}</td>
                        <td>${transaksi.status}</td>
                        <td class="text-center">
                            <button type="button" class="btn button-primary" data-bs-toggle="modal" data-bs-target="#Modal-Detail-Transaksi"
                            onclick="showDetails('${transaksi.idTransaksi}', '${transaksi.idPelanggan}', '${transaksi.idKaryawan}', '${transaksi.tanggal}', '${transaksi.status}', '${transaksi.totalHarga}', '${transaksi.uangMuka}')">Details</button>
                        </td>
                    </tr>
                    `;
                    tabel.append(row);
                });
                // Inisialisasi DataTable setelah data dimuat
                initializeDataTable();
                $('#transaksiHariIni').text(transaksiHariIni)
                $('#transaksiSemuanya').text(totalTransaksi)
                showSuccessToast('Data transaksi berhasil dimuat');
            },
            error: function(err) {
                showErrorToast(err);
            }
        });
    }
    load_pelanggan();
});

function showDetails(idTransaksi, idPelanggan, idKaryawan, tanggal, status, totalHarga, uangMuka) {
    $("#idTransaksi").text(`ID Transaksi : ${idTransaksi}`)
    $("#idPelanggan").text(`ID Pelanggan : ${idPelanggan}`)
    $("#idKaryawan").text(`ID Karyawan : ${idKaryawan}`)
    $("#tanggalTransaksi").text(`Tanggal : ${tanggal}`)
    $("#statusTransaksi").text(`Status Transaksi : ${status}`)
    $("#totalTransaksi").text(`Total : ${totalHarga}`)
    $("#uangTransaksi").text(`Uang Muka : ${uangMuka}`)
}