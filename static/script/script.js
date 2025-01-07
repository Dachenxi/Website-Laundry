const ToastManager = {
    // Mengatur jarak antar toast
    TOAST_SPACING: 10,
    activeToasts: [],

    // Fungsi untuk menampilkan toast
    showToast: function (type, message, duration = 5000) {
        let toastElement;

        // Pilih toast berdasarkan tipe
        switch (type) {
        case "success":
            toastElement = document.getElementById("successToast");
            document.getElementById("successToastMessage").textContent = message;
            break;
        case "error":
            toastElement = document.getElementById("errorToast");
            document.getElementById("errorToastMessage").textContent = message;
            break;
        case "wait":
            toastElement = document.getElementById("waitToast");
            document.getElementById("waitToastMessage").textContent = message;
            break;
        default:
            return;
        }

        // Buat clone dari toast element
        const toastClone = toastElement.cloneNode(true);
        toastClone.id = `toast-${Date.now()}`;

        // Tambahkan ke container
        document.querySelector(".toast-container").appendChild(toastClone);

        // Tambahkan ke array active toasts
        this.activeToasts.push(toastClone);

        // Initialize toast dengan Bootstrap
        const bsToast = new bootstrap.Toast(toastClone, {
        autohide: true,
        delay: duration,
        });

        // Tampilkan toast
        bsToast.show();

        // Handle saat toast hilang
        toastClone.addEventListener("hidden.bs.toast", () => {
        this.removeToast(toastClone);
        });
    },

    // Hitung offset untuk posisi toast
    calculateOffset: function () {
        let offset = 0;
        this.activeToasts.forEach((toast) => {
        offset += toast.offsetHeight + this.TOAST_SPACING;
        });
        return offset;
    },

    // Hapus toast dari stack
    removeToast: function (toast) {
        const index = this.activeToasts.indexOf(toast);
        if (index > -1) {
        this.activeToasts.splice(index, 1);
        toast.remove();

        // Reposisi toast yang tersisa
        this.activeToasts.forEach((activeToast, idx) => {
            const newOffset = idx * (toast.offsetHeight + this.TOAST_SPACING);
            activeToast.style.transform = `translateY(-${newOffset}px)`;
        });
        }
    },
};
