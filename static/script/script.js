$(document).ready(function () {
    $('#tabel-pelanggan').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthMenu: [5, 10, 15], // Dropdown opsi panjang
        responsive: true,
        language: {
            search: "Cari:", // Ubah label search
            lengthMenu: "_MENU_ data per page", // Ubah dropdown label
            info: "Menampilkan _START_ hingga _END_ dari _TOTAL_ data"
        }
    });

    $('#tabel-transaksi').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthMenu: [5, 10, 15], // Dropdown opsi panjang
        responsive: true,
        language: {
            search: "Cari:", // Ubah label search
            lengthMenu: "_MENU_ data per page", // Ubah dropdown label
            info: "Menampilkan _START_ hingga _END_ dari _TOTAL_ data"
        }
    });

    $('#tabel-karyawan').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthMenu: [5, 10, 15], // Dropdown opsi panjang
        responsive: true,
        language: {
            search: "Cari:", // Ubah label search
            lengthMenu: "_MENU_ data per page", // Ubah dropdown label
            info: "Menampilkan _START_ hingga _END_ dari _TOTAL_ data"
        }
    });
});
