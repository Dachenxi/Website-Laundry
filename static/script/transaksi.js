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
        ToastManager.showToast('wait','Mengambil Data');
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
                ToastManager.showToast('success', 'Data transaksi berhasil dimuat');
            },
            error: function(err) {
                ToastManager.showToast('error',err);
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

function tambahTransaksi() {
    const data = {
        namaPelanggan: $("#Nama-Pelanggan-Form").val(),
        alamatPelanggan: $("#Alamat-Transaksi-Form").val(),
        noTeleponPelanggan: $("#Nomor-Telepon-Transaksi-Form").val(),
        idKaryawan: $("#ID-Karyawan-Form").val(),
        hariTransaksi: $("#Hari-Transaksi-Form").val(),
        statusTransaksi: $("#Status-Transaksi-Form").val(),
        totalHarga: $("#Total-Harga-Transaksi-Form").val(),
        uangMuka: $("#Uang-Muka-Transaksi-Form").val()
    }
    console.log(data)
    // Validasi input
    if (!Object.values(data).every(value => value)) {
        ToastManager.showToast('error', 'Semua kolom harus diisi sebelum submit!');
        return;
    }

    ToastManager.showToast('wait', 'Data sedang diproses...')

    $.ajax({
        url: '/api/transaksi/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.success) {
                // Tampilkan pesan sukses untuk pelanggan
                ToastManager.showToast('success', response.dataPelanggan.pesan || 'Data pelanggan berhasil ditambahkan!');
                
                // Setelah 1.5 detik, tampilkan pesan sukses untuk transaksi
                setTimeout(() => {
                    ToastManager.showToast('success', response.pesan);
                    // Reload halaman setelah 1.5 detik
                    setTimeout(() => location.reload(), 1500);
                }, 1500);
            } else {
                ToastManager.showToast('error', response.pesan);
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON || {};
            ToastManager.showToast('error', response.pesan || 'Terjadi kesalahan pada server');
        }
    });
}