// 자동 쉼표 입력 + 커서 위치 복원
document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("input", function (e) {
    const original = this.value;
    const caret = this.selectionStart;

    const digits = original.replace(/[^\d]/g, "");
    if (digits === "") {
      this.value = "";
      return;
    }

    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const leftPart = original.substring(0, caret).replace(/,/g, "");
    const newCaret = formatted.length - (digits.length - leftPart.length);

    this.value = formatted;
    this.setSelectionRange(newCaret, newCaret);
  });
});

// 쉼표 제거 함수
function removeCommas(x) {
  return x.replace(/,/g, "");
}

// 계산하기 버튼 클릭 시 실행
function calculate() {
  const vatRate = 0.1;

  // ✅ 엑셀 기준 최종 요율 (D1, F1, H1, J1, L1 셀 기준)
  const rates = {
    12: 0.09947,  // D1
    24: 0.05262,  // F1
    36: 0.03691,  // H1
    48: 0.02964,  // J1
    60: 0.02539   // L1
  };

  const rawInput = document.getElementById('amount').value;
  const amount = parseFloat(removeCommas(rawInput));

  if (isNaN(amount) || amount <= 0) {
    alert("장비 금액을 올바르게 입력해주세요.");
    return;
  }

  const vatIncludedTotal = amount * (1 + vatRate);
  const vatExcludedTotal = vatIncludedTotal / (1 + vatRate);

  let html = `<strong>VAT 미포함 금액:</strong> ${amount.toLocaleString()}원<br>`;
  html += `<strong>VAT 포함 금액:</strong> ${Math.round(vatIncludedTotal).toLocaleString()}원<br><br>`;

  for (let months in rates) {
    const rate = rates[months];
    const base = amount * rate;
    const rounded = Math.ceil(base / 1000) * 1000;
    const monthlyRental = Math.round(rounded * 1.1); // =ROUNDUP(..., -3) * 1.1
    const totalRental = monthlyRental * parseInt(months);

    html += `<strong>${months}개월</strong>: 월 렌탈료 ${monthlyRental.toLocaleString()}원 / 총 렌탈비용 ${totalRental.toLocaleString()}원<br><br>`;
  }

  document.getElementById("result").innerHTML = html;
  document.getElementById("result").style.display = "block";
  document.getElementById("save-btn-wrapper").style.display = "block";
}

// 이미지 저장 기능
function saveImage() {
  const target = document.getElementById("result");
  if (target.style.display === "none") {
    alert("먼저 계산하기를 눌러 결과를 표시해주세요.");
    return;
  }

  html2canvas(target).then(canvas => {
    const link = document.createElement("a");
    link.download = "렌탈견적.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// 엔터키로 계산하기 기능
document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }
  });
});
