
window.successToast = null;
window.errorToast = null;
window.waitToast = null;

$(document).ready(function() {
    // Inisialisasi toast
    window.successToast = new bootstrap.Toast(document.getElementById('successToast'), {
        delay: 3000
    });

    window.errorToast = new bootstrap.Toast(document.getElementById('errorToast'), {
        delay: 3000
    });

    window.waitToast = new bootstrap.Toast(document.getElementById('waitToast'), {
        delay: 3000
    });
});

// Fungsi untuk menampilkan error toast
function showErrorToast(message) {
    $("#errorToastMessage").text(message);
    if (window.errorToast) {
        window.errorToast.show();
    } else {
        console.error("Error toast belum diinisialisasi!");
    }
}

// Fungsi untuk menampilkan success toast
function showSuccessToast(message) {
    $("#successToastMessage").text(message);
    if (window.successToast) {
        window.successToast.show();
    } else {
        console.error("Success toast belum diinisialisasi!");
    }
}

function showWaitToast(message) {
    $("#waitToastMessage").text(message);
    if (window.waitToast) {
        window.waitToast.show();
    } else {
        console.error("Wait toast belum diinisialisasi!");
    }
}