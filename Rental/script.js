// 자동 쉼표 입력 + 커서 위치 복원
document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("input", function (e) {
    const original = this.value;
    const caret = this.selectionStart;

    // 숫자만 추출
    const digits = original.replace(/[^\d]/g, "");
    if (digits === "") {
      this.value = "";
      return;
    }

    // 쉼표 추가
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 변경 전까지의 왼쪽 입력 길이에서 쉼표 제외된 문자의 개수
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
  const vatRate = 0.1;  // VAT율
  const rates = {  // 각 기간별 요율
    24: 0.05262187215884563,  // 24개월
    36: 0.0369093104601894,   // 36개월
    48: 0.029636915954628227, // 48개월
    60: 0.025393427427109084  // 60개월
  };

  // 입력된 금액 (쉼표 제거 후 숫자로 변환)
  const rawInput = document.getElementById('amount').value;
  const amount = parseFloat(removeCommas(rawInput));

  // 입력값이 없거나 0 이하일 경우
  if (isNaN(amount) || amount <= 0) {
    alert("장비 금액을 올바르게 입력해주세요.");
    return;
  }

  // VAT 포함 금액 계산
  const vatIncludedTotal = amount * (1 + vatRate);
  // VAT 미포함 금액 계산
  const vatExcludedTotal = vatIncludedTotal / (1 + vatRate);

  let html = `<strong>VAT 미포함 금액:</strong> ${vatExcludedTotal.toLocaleString()}원<br>`;  // 미포함 금액 먼저 출력
  html += `<strong>VAT 포함 금액:</strong> ${vatIncludedTotal.toLocaleString()}원<br><br>`;  // 포함 금액 그 다음 출력

  // 각 기간별 월 렌탈료 및 총 렌탈비용 계산
  for (let months in rates) {
    const rate = rates[months];
    const base = amount * rate;  // 요율에 따른 기본 금액
    const rounded = Math.ceil(base / 1000) * 1000;  // 천 단위로 올림
    const monthlyRental = Math.round(rounded * (1 + vatRate));  // VAT 포함 후 월 렌탈료 계산
    const totalRental = monthlyRental * parseInt(months);  // 총 렌탈비용 계산

    html += `<strong>${months}개월</strong>: 월 렌탈료 ${monthlyRental.toLocaleString()}원 / 총 렌탈비용 ${totalRental.toLocaleString()}원<br><br>`;
  }

  // 결과 화면 표시
  document.getElementById("result").innerHTML = html;
  document.getElementById("result").style.display = "block";

  // 이미지 저장 버튼도 표시
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
    link.download = "렌탈견적.png";  // 저장될 파일 이름
    link.href = canvas.toDataURL("image/png");
    link.click();  // 다운로드 시작
  });
}

// 엔터키로 계산하기 기능
document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");

  // 엔터 키를 누르면 계산하기 실행
  amountInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 동작(폼 제출)을 막음
      calculate();  // 계산 실행
    }
  });
});
