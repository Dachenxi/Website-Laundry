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
                const dataKaryawan = response.dataKaryawan
                const total = response.karyawan.total
                const totalLaki = response.karyawan.laki_laki
                const totalperempuan = response.karyawan.perempuan
                const tabel = $('#tabel-transaksi tbody');
                tabel.empty();
                dataKaryawan.forEach(karyawan => {
                    const row = `
                    <tr>
                        <td>${karyawan.idKaryawan}</td>
                        <td>${karyawan.namaKaryawan}</td>
                        <td>${karyawan.jenisKelamin}</td>
                        <td class="text-center">
                            <button type="button" class="btn button-primary" data-bs-toggle="modal" data-bs-target="#Detail-Karyawan"
                            onclick="showDetails('${karyawan.idKaryawan}', '${karyawan.namaKaryawan}', '${karyawan.jenisKelamin}', '${karyawan.Jabatan}', '${karyawan.alamat}', '${karyawan.noTelepon}', '${karyawan.email}')">Details</button>
                        </td>
                    </tr>
                    `;
                    tabel.append(row);
                });
                // Inisialisasi DataTable setelah data dimuat
                initializeDataTable();
                $('#total').text(total)
                $('#totallakilaki').text(totalLaki)
                $('#totalperempuan').text(totalperempuan)
                showSuccessToast('Data karyawan berhasil dimuat');
            },
            error: function(err) {
                showErrorToast(err);
            }
        });
    }
    load_pelanggan();
});

function showDetails(idKaryawan, namaKaryawan, jenisKelamin, Jabatan, alamat, noTelepon, Email) {
    $('#Nama-Karyawan-modal').text(`Nama karyawan : ${namaKaryawan}`);
    $('#Id-Karyawan-modal').text(`ID karyawan : ${idKaryawan}`);
    $('#Gender-Karyawan-modal').text(`Jenis Kelamin : ${jenisKelamin}`);
    $('#Jabatan-Karyawan-modal').text(`Jabatan : ${Jabatan}`);
    $('#Alamat-Karyawan-modal').text(`Alamat : ${alamat}`);
    $('#NoTlp-Karyawan-modal').text(`No Telepon : ${noTelepon}`);
    $('#Email-Karyawan-modal').text(`Email : ${Email}`);
}