function openModal() {
  document.getElementById("expenseModal").classList.add("show");
}

function closeModal() {
  document.getElementById("expenseModal").classList.remove("show");
}

// Filter Kategori
document
  .getElementById("filterKategori")
  .addEventListener("change", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const kategori = row.children[1].textContent.toLowerCase();
      row.style.display = !filter || kategori === filter ? "" : "none";
    });

    hitungTotal();
  });

// Hitung Total
function hitungTotal() {
  let total = 0;
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    if (row.style.display !== "none") {
      const jumlahText = row.children[3].textContent.replace(/[^\d]/g, "");
      total += parseInt(jumlahText || "0");
    }
  });
  document.getElementById("totalJumlah").textContent =
    "Rp " + total.toLocaleString("id-ID");
}

// Modal Buka/Tutup
function openModal() {
  document.getElementById("expenseModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("expenseModal").style.display = "none";
}

// Hitung total saat awal load
document.addEventListener("DOMContentLoaded", hitungTotal);

// Menyimpan referensi ke elemen modal dan tabel
const expenseModal = document.getElementById("expenseModal");
const tableBody = document.querySelector("table tbody");
const totalJumlah = document.getElementById("totalJumlah");
const filterKategori = document.getElementById("filterKategori");

// Menangani buka dan tutup modal
function openModal() {
  expenseModal.classList.add("show");
}

function closeModal() {
  expenseModal.classList.remove("show");
}

// Fungsi untuk menambahkan pengeluaran
function addExpense() {
  const dateInput = document.querySelector('.modal-content input[type="date"]');
  const categorySelect = document.querySelector(".modal-content select");
  const descriptionInput = document.querySelector(
    '.modal-content input[type="text"]'
  );
  const amountInput = document.querySelector(
    '.modal-content input[type="number"]'
  );

  const date = dateInput.value;
  const category = categorySelect.value;
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);

  if (date && category && description && !isNaN(amount)) {
    // Menambahkan baris baru ke tabel
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${date}</td>
      <td>${category}</td>
      <td>${description}</td>
      <td>Rp ${amount.toLocaleString()}</td>
    `;
    tableBody.appendChild(row);

    // Menutup modal
    closeModal();

    // Menampilkan notifikasi toast
    showToast("Pengeluaran berhasil ditambahkan!");

    // Update total pengeluaran
    updateTotal();

    // Reset input modal
    dateInput.value = "";
    categorySelect.value = "";
    descriptionInput.value = "";
    amountInput.value = "";
  } else {
    alert("Harap lengkapi semua data.");
  }
}

// Fungsi untuk menghitung total pengeluaran
function updateTotal() {
  let total = 0;
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const amount = row.cells[3].textContent.replace("Rp ", "").replace(".", "");
    total += parseFloat(amount);
  });

  totalJumlah.textContent = `Rp ${total.toLocaleString()}`;
}

// Menampilkan notifikasi toast
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Fungsi untuk mengekspor tabel ke CSV
function exportToCSV() {
  let csvContent = "Tanggal,Kategori,Deskripsi,Jumlah\n";
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowArray = Array.from(cells).map((cell) => cell.textContent);
    csvContent += rowArray.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "riwayat_pengeluaran.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Filter pengeluaran berdasarkan kategori
filterKategori.addEventListener("change", function () {
  const selectedCategory = filterKategori.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const category = row.cells[1].textContent.toLowerCase();
    if (selectedCategory === "" || category === selectedCategory) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// Event listener untuk tombol simpan di modal
document
  .querySelector(".modal-content button")
  .addEventListener("click", addExpense);

// Event listener untuk tombol ekspor CSV
document.getElementById("exportButton").addEventListener("click", exportToCSV);
