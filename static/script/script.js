document.addEventListener("DOMContentLoaded", () => {
    const tabelBody = document.getElementById("tabel-karyawan-body");

    fetch("/api/karyawan")
        .then(response => response.json())
        .then(data => {
            let rows = "";
            data.forEach((karyawan) => {
                rows += `
                    <tr>
                        <td class="text-center">${karyawan.idKaryawan}</td>
                        <td>${karyawan.namaKaryawan}</td>
                        <td>${karyawan.jenisKelamin}</td>
                        <td>${karyawan.Jabatan}</td>
                        <td>${karyawan.alamat}</td>
                        <td>${karyawan.noTelepon}</td>
                        <td>${karyawan.email}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-warning">Edit</button>
                            <button class="btn btn-sm btn-danger">Hapus</button>
                        </td>`;
            });
            tabelBody.innerHTML = rows;
        })
        .catch(error => console.error(error));
});