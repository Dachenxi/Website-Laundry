$(document).ready(function() {
    let tablePelanggan; // Variabel untuk menyimpan instance DataTable

    function initializeDataTable() {
        // Destroy instance yang ada jika sudah ada
        if ($.fn.DataTable.isDataTable('#tabel-pelanggan')) {
            $('#tabel-pelanggan').DataTable().destroy();
        }

        // Inisialisasi DataTable baru
        tablePelanggan = $('#tabel-pelanggan').DataTable({
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
        showWaitToast('Mengambil Data')
        $.ajax({
            url: '/api/pelanggan',
            type: 'GET',
            success: function(response) {
                const dataPelanggan = response.datapelanggan
                const totalPelanggan = response.banyakPelanggan
                const tabel = $('#tabel-pelanggan tbody');
                tabel.empty();
                dataPelanggan.forEach(pelanggan => {
                    const row = `
                    <tr>
                        <td>${pelanggan.idPelanggan}</td>
                        <td>${pelanggan.namaPelanggan}</td>
                        <td>${pelanggan.alamat}</td>
                        <td class="text-center">
                            <button type="button" class="btn button-primary" data-bs-toggle="modal" data-bs-target="#Detail-Pelanggan" onclick="showDetails('${pelanggan.idPelanggan}', '${pelanggan.namaPelanggan}', '${pelanggan.alamat}', '${pelanggan.noTelepon}')">Details</button>
                        </td>
                    </tr>
                    `;
                    tabel.append(row);
                });
                // Inisialisasi DataTable setelah data dimuat
                initializeDataTable();
                $('#TotalPelanggan').text(totalPelanggan)
                showSuccessToast('Data pelanggan berhasil dimuat');
            },
            error: function(err) {
                showErrorToast(err);
            }
        });
    }

    load_pelanggan();
});

function showDetails(id, nama, alamat, noTelepon) {
    $('#Nama-Pelanggan').text(`Nama Pelanggan : ${nama}`);
    $('#ID-Pelanggan').text(`ID Pelanggan : ${id}`);
    $('#Alamt-Pelanggan').text(`Alamat : ${alamat}`);
    $('#No-Pelanggan').text(`No Telepon : ${noTelepon}`);
}