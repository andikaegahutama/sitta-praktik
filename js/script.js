function getActiveUser() {
  var savedUser = sessionStorage.getItem("sitta_active_user");
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    nama: "Rina Wulandari",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta",
    email: "rina@ut.ac.id"
  };
}

function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar dari sistem SITTA?")) {
    sessionStorage.removeItem("sitta_active_user");
    window.location.href = "index.html";
  }
}

function getGreetingText() {
  var now = new Date();
  var hour = now.getHours();

  if (hour >= 4 && hour < 11) {
    return "Selamat Pagi";
  } else if (hour >= 11 && hour < 15) {
    return "Selamat Siang";
  } else if (hour >= 15 && hour < 18) {
    return "Selamat Sore";
  } else {
    return "Selamat Malam";
  }
}

function initGreetingAndClock() {
  var greetingElement = document.getElementById("greetingText");

  function updateGreeting() {
    if (greetingElement) {
      greetingElement.textContent = getGreetingText();
    }
  }

  updateGreeting();
  setInterval(updateGreeting, 10000);
}

function initLoginPage() {
  var loginForm = document.getElementById("loginForm");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var alertBox = document.getElementById("loginAlert");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();

    if (!email || !password) {
      showErrorAlert("Silakan isi email dan password Anda!");
      return;
    }

    var foundUser = null;
    if (typeof dataPengguna !== "undefined" && Array.isArray(dataPengguna)) {
      foundUser = dataPengguna.find(function (user) {
        return user.email.toLowerCase() === email.toLowerCase() && user.password === password;
      });
    }

    if (foundUser) {
      sessionStorage.setItem("sitta_active_user", JSON.stringify(foundUser));
      if (alertBox) {
        alertBox.className = "alert-message alert-success";
        alertBox.style.display = "block";
        alertBox.textContent = "Login berhasil! Mengalihkan ke Dashboard...";
      }
      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      var pesanSalah = "email/password yang anda masukkan salah";
      showErrorAlert(pesanSalah);
      alert(pesanSalah);
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  function showErrorAlert(message) {
    if (alertBox) {
      alertBox.className = "alert-message alert-danger";
      alertBox.style.display = "block";
      alertBox.textContent = message;
    }
  }
}

function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

function initModals() {
  var btnLupaPassword = document.getElementById("btnLupaPassword");
  if (btnLupaPassword) {
    btnLupaPassword.addEventListener("click", function () {
      openModal("modalLupaPassword");
    });
  }

  var btnDaftar = document.getElementById("btnDaftar");
  if (btnDaftar) {
    btnDaftar.addEventListener("click", function () {
      openModal("modalDaftar");
    });
  }

  var formLupaPassword = document.getElementById("formLupaPassword");
  if (formLupaPassword) {
    formLupaPassword.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailReset = document.getElementById("resetEmail").value.trim();
      if (!emailReset) {
        alert("Masukkan email UT Anda terlebih dahulu!");
        return;
      }
      alert("Tautan pemulihan password telah dikirimkan ke: " + emailReset);
      closeModal("modalLupaPassword");
      formLupaPassword.reset();
    });
  }

  var formDaftar = document.getElementById("formDaftar");
  if (formDaftar) {
    formDaftar.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = document.getElementById("daftarNama").value.trim();
      var email = document.getElementById("daftarEmail").value.trim();
      var password = document.getElementById("daftarPassword").value;
      var role = document.getElementById("daftarRole").value;
      var lokasi = document.getElementById("daftarLokasi").value.trim();

      if (!nama || !email || !password || !lokasi) {
        alert("Semua kolom pendaftaran wajib diisi!");
        return;
      }

      if (!email.toLowerCase().endsWith("@ut.ac.id")) {
        alert("Pendaftaran akun SITTA harus menggunakan email resmi @ut.ac.id!");
        return;
      }

      var newUser = {
        id: (dataPengguna ? dataPengguna.length + 1 : Date.now()),
        nama: nama,
        email: email,
        password: password,
        role: role,
        lokasi: lokasi
      };

      if (typeof dataPengguna !== "undefined") {
        dataPengguna.push(newUser);
      }

      alert("Pendaftaran berhasil! Akun atas nama " + nama + " telah dibuat.");
      closeModal("modalDaftar");
      formDaftar.reset();

      var emailInput = document.getElementById("email");
      if (emailInput) {
        emailInput.value = email;
      }
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.classList.remove("active");
    }
  });
}

function cariTrackingDO(nomorDOInput) {
  var nomorDO = (nomorDOInput || "").trim();
  var resultContainer = document.getElementById("trackingResult");
  var errorAlert = document.getElementById("trackingErrorAlert");

  if (!nomorDO) {
    alert("Silakan masukkan Nomor Delivery Order terlebih dahulu!");
    if (errorAlert) {
      errorAlert.textContent = "Silakan masukkan Nomor Delivery Order!";
      errorAlert.style.display = "block";
    }
    return;
  }

  if (typeof dataTracking === "undefined") {
    alert("Data tracking pengiriman tidak ditemukan!");
    return;
  }

  var tracking = dataTracking[nomorDO];
  if (!tracking) {
    for (var key in dataTracking) {
      if (dataTracking.hasOwnProperty(key)) {
        if (key === nomorDO || dataTracking[key].nomorDO === nomorDO) {
          tracking = dataTracking[key];
          break;
        }
      }
    }
  }

  if (!tracking) {
    if (resultContainer) resultContainer.style.display = "none";
    var errorMsg = "Nomor Delivery Order '" + nomorDO + "' tidak ditemukan!";
    if (errorAlert) {
      errorAlert.textContent = errorMsg;
      errorAlert.style.display = "block";
    }
    alert(errorMsg);
    return;
  }

  if (errorAlert) errorAlert.style.display = "none";

  if (resultContainer) {
    resultContainer.style.display = "block";

    var progressPercent = 50;
    var badgeClass = "badge-blue";
    var statusText = tracking.status;

    if (statusText.toLowerCase().includes("selesai") || statusText.toLowerCase() === "dikirim") {
      var lastStep = tracking.perjalanan && tracking.perjalanan[tracking.perjalanan.length - 1];
      if (lastStep && lastStep.keterangan.toLowerCase().includes("selesai")) {
        progressPercent = 100;
        statusText = "Selesai Diterima";
        badgeClass = "badge-green";
      } else {
        progressPercent = 65;
        badgeClass = "badge-orange";
      }
    } else if (statusText.toLowerCase().includes("perjalanan")) {
      progressPercent = 45;
      badgeClass = "badge-orange";
    }

    document.getElementById("resNomorDO").textContent = nomorDO;
    document.getElementById("resNama").textContent = tracking.nama;
    document.getElementById("resEkspedisi").textContent = tracking.ekspedisi;
    document.getElementById("resTanggalKirim").textContent = tracking.tanggalKirim;
    document.getElementById("resPaket").textContent = tracking.paket;
    document.getElementById("resTotal").textContent = tracking.total;

    var resStatusEl = document.getElementById("resStatus");
    if (resStatusEl) {
      resStatusEl.textContent = statusText;
      resStatusEl.className = "badge-tag " + badgeClass;
    }

    var progressBar = document.getElementById("resProgressBar");
    var progressLabel = document.getElementById("resProgressPercent");
    if (progressBar) {
      progressBar.style.width = progressPercent + "%";
    }
    if (progressLabel) {
      progressLabel.textContent = progressPercent + "% Selesai";
    }

    var timelineContainer = document.getElementById("resTimeline");
    if (timelineContainer && tracking.perjalanan) {
      timelineContainer.innerHTML = "";
      tracking.perjalanan.forEach(function (step) {
        var li = document.createElement("li");
        li.className = "timeline-item";

        var timeDiv = document.createElement("div");
        timeDiv.className = "timeline-time";
        timeDiv.textContent = step.waktu;

        var textDiv = document.createElement("div");
        textDiv.className = "timeline-text";
        textDiv.textContent = step.keterangan;

        li.appendChild(timeDiv);
        li.appendChild(textDiv);
        timelineContainer.appendChild(li);
      });
    }

    resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function initTrackingPage() {
  var btnCari = document.getElementById("btnCariDO");
  var inputDO = document.getElementById("inputNomorDO");

  if (btnCari && inputDO) {
    btnCari.addEventListener("click", function () {
      cariTrackingDO(inputDO.value);
    });

    inputDO.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        cariTrackingDO(inputDO.value);
      }
    });
  }

  var urlParams = new URLSearchParams(window.location.search);
  var paramDO = urlParams.get("do");
  if (paramDO && inputDO) {
    inputDO.value = paramDO;
    cariTrackingDO(paramDO);
  }
}

function renderTabelStok(filterKeyword) {
  var tbody = document.getElementById("tabelStokBody");
  var totalBukuEl = document.getElementById("totalBuku");
  var totalStokEl = document.getElementById("totalStok");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (typeof dataBahanAjar === "undefined" || !Array.isArray(dataBahanAjar)) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:15px;">Data tidak tersedia</td></tr>';
    return;
  }

  var filteredData = dataBahanAjar;
  if (filterKeyword) {
    var kw = filterKeyword.toLowerCase();
    filteredData = dataBahanAjar.filter(function (item) {
      return (
        item.namaBarang.toLowerCase().includes(kw) ||
        item.kodeBarang.toLowerCase().includes(kw) ||
        item.kodeLokasi.toLowerCase().includes(kw) ||
        item.jenisBarang.toLowerCase().includes(kw)
      );
    });
  }

  var sumStok = 0;

  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:15px; color:#666666;">Bahan ajar tidak ditemukan.</td></tr>';
  } else {
    filteredData.forEach(function (item, index) {
      sumStok += parseInt(item.stok, 10) || 0;

      var badgeClass = item.stok < 200 ? "badge-orange" : "badge-green";
      var statusText = item.stok < 200 ? "Menipis" : "Tersedia";

      var tr = document.createElement("tr");

      var tdNo = document.createElement("td");
      tdNo.textContent = index + 1;

      var tdCover = document.createElement("td");
      var img = document.createElement("img");
      img.src = item.cover || "img/pengantar_komunikasi.jpg";
      img.alt = item.namaBarang;
      img.className = "book-cover-img";
      img.onerror = function () {
        this.src = "assets/logo-ut.png";
      };
      img.addEventListener("click", function () {
        showDetailCoverModal(item);
      });
      tdCover.appendChild(img);

      var tdLokasi = document.createElement("td");
      tdLokasi.textContent = item.kodeLokasi;

      var tdKode = document.createElement("td");
      tdKode.innerHTML = "<strong>" + item.kodeBarang + "</strong>";

      var tdNama = document.createElement("td");
      tdNama.innerHTML = '<a href="javascript:void(0)" style="color:#003b73; font-weight:bold; text-decoration:none;">' + item.namaBarang + '</a>';
      tdNama.addEventListener("click", function () {
        showDetailCoverModal(item);
      });

      var tdJenis = document.createElement("td");
      tdJenis.innerHTML = '<span class="badge-tag badge-blue">' + item.jenisBarang + '</span>';

      var tdEdisi = document.createElement("td");
      tdEdisi.textContent = item.edisi;
      tdEdisi.style.textAlign = "center";

      var tdStok = document.createElement("td");
      tdStok.innerHTML = "<strong>" + item.stok + "</strong>";

      var tdStatus = document.createElement("td");
      tdStatus.innerHTML = '<span class="badge-tag ' + badgeClass + '">' + statusText + '</span>';

      tr.appendChild(tdNo);
      tr.appendChild(tdCover);
      tr.appendChild(tdLokasi);
      tr.appendChild(tdKode);
      tr.appendChild(tdNama);
      tr.appendChild(tdJenis);
      tr.appendChild(tdEdisi);
      tr.appendChild(tdStok);
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    });
  }

  if (totalBukuEl) totalBukuEl.textContent = filteredData.length;
  if (totalStokEl) totalStokEl.textContent = sumStok;
}

function showDetailCoverModal(item) {
  var modalCover = document.getElementById("modalDetailCover");
  if (!modalCover) return;

  document.getElementById("modalDetailJudul").textContent = item.namaBarang;
  document.getElementById("modalDetailKode").textContent = item.kodeBarang;
  document.getElementById("modalDetailLokasi").textContent = item.kodeLokasi;
  document.getElementById("modalDetailJenis").textContent = item.jenisBarang;
  document.getElementById("modalDetailEdisi").textContent = item.edisi;
  document.getElementById("modalDetailStok").textContent = item.stok + " eks";

  var imgCover = document.getElementById("modalDetailImg");
  if (imgCover) {
    imgCover.src = item.cover || "assets/logo-ut.png";
    imgCover.onerror = function () {
      this.src = "assets/logo-ut.png";
    };
  }

  openModal("modalDetailCover");
}

function initStokPage() {
  renderTabelStok();

  var searchInput = document.getElementById("searchStokInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderTabelStok(this.value);
    });
  }

  var btnBukaTambah = document.getElementById("btnBukaTambahStok");
  if (btnBukaTambah) {
    btnBukaTambah.addEventListener("click", function () {
      openModal("modalTambahStok");
    });
  }

  var formTambahStok = document.getElementById("formTambahStok");
  if (formTambahStok) {
    formTambahStok.addEventListener("submit", function (e) {
      e.preventDefault();

      var kodeLokasi = document.getElementById("inputKodeLokasi").value.trim().toUpperCase();
      var kodeBarang = document.getElementById("inputKodeBarang").value.trim().toUpperCase();
      var namaBarang = document.getElementById("inputNamaBarang").value.trim();
      var jenisBarang = document.getElementById("inputJenisBarang").value;
      var edisi = document.getElementById("inputEdisi").value.trim();
      var stok = parseInt(document.getElementById("inputStok").value, 10);
      var coverPilihan = document.getElementById("inputCover").value;

      if (!kodeLokasi || !kodeBarang || !namaBarang || !edisi || isNaN(stok)) {
        alert("Semua kolom form wajib diisi!");
        return;
      }

      if (stok < 0) {
        alert("Jumlah stok tidak boleh negatif!");
        return;
      }

      var existing = dataBahanAjar.find(function (b) {
        return b.kodeBarang === kodeBarang;
      });

      if (existing) {
        var tambahLagi = confirm("Bahan ajar dengan kode " + kodeBarang + " sudah ada. Tambah stok?");
        if (tambahLagi) {
          existing.stok += stok;
          alert("Stok berhasil ditambah!");
          closeModal("modalTambahStok");
          formTambahStok.reset();
          renderTabelStok();
          return;
        } else {
          return;
        }
      }

      var itemBaru = {
        kodeLokasi: kodeLokasi,
        kodeBarang: kodeBarang,
        namaBarang: namaBarang,
        jenisBarang: jenisBarang,
        edisi: edisi,
        stok: stok,
        cover: coverPilihan || "img/pengantar_komunikasi.jpg"
      };

      dataBahanAjar.unshift(itemBaru);
      renderTabelStok();

      closeModal("modalTambahStok");
      formTambahStok.reset();
      alert("Bahan ajar baru berhasil ditambahkan!");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var user = getActiveUser();
  var userNameEls = document.querySelectorAll(".current-user-name");
  var userRoleEls = document.querySelectorAll(".current-user-role");

  userNameEls.forEach(function (el) {
    el.textContent = user.nama;
  });
  userRoleEls.forEach(function (el) {
    el.textContent = user.role + " - " + user.lokasi;
  });

  var logoutBtns = document.querySelectorAll(".btn-logout-action");
  logoutBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      logoutUser();
    });
  });

  initModals();

  if (document.getElementById("loginForm")) {
    initLoginPage();
  }

  if (document.getElementById("greetingText")) {
    initGreetingAndClock();
  }

  if (document.getElementById("btnCariDO")) {
    initTrackingPage();
  }

  if (document.getElementById("tabelStokBody")) {
    initStokPage();
  }
});
