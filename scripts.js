let inquryWorkbook; // 엑셀 작업을 위한 워크북 객체
let companies = {}; // 회사와 제품 정보를 저장할 객체
let productCount = 0; // 테이블에 추가된 제품의 개수를 추적
let pricesHidden = false; // 가격 숨김 여부를 추적
let selectedCompany = ''; // 선택된 회사 이름
let selectedProduct = ''; // 선택된 제품 이름

// 연도, 월, 일 드롭다운 초기화 함수
function initDateFields() {
    const yearSelect = document.getElementById('quoteYear'); // 연도 선택 필드
    const monthSelect = document.getElementById('quoteMonth'); // 월 선택 필드
    const daySelect = document.getElementById('quoteDay'); // 일 선택 필드

    // 현재 연도 구하기
    const currentYear = new Date().getFullYear();

    // 연도 드롭다운 초기화 (현재 연도부터 100년 전까지)
    for (let year = currentYear; year >= currentYear - 100; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 월 드롭다운 초기화
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // 일 드롭다운 초기화
    updateDayOptions();

    // 월 선택 변경 시 일자 업데이트
    monthSelect.addEventListener('change', updateDayOptions);
    yearSelect.addEventListener('change', updateDayOptions);

    // 선택된 연도와 월에 맞는 일자 옵션을 업데이트하는 함수
    function updateDayOptions() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);

        // 해당 연도와 월의 마지막 날짜 구하기
        const daysInMonth = new Date(year, month, 0).getDate();
        daySelect.innerHTML = ''; // 기존 옵션 초기화

        // 일자 드롭다운에 옵션 추가
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
}

// 페이지 초기화 함수
async function init() {
    initDateFields(); // 날짜 입력 필드 초기화

    try {
        // 제품 데이터 로드 및 초기화
        const productResponse = await fetch('https://asdddsa182.github.io/AshGray/product.xlsx');
        const productArrayBuffer = await productResponse.arrayBuffer();
        const productWorkbook = new ExcelJS.Workbook();
        await productWorkbook.xlsx.load(productArrayBuffer);

        // 각 시트(회사)의 제품 정보 로드
        productWorkbook.eachSheet((worksheet, sheetId) => {
            const companyName = worksheet.name;
            companies[companyName] = {}; // 회사 이름을 키로 하는 객체 생성

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // 첫 번째 행(헤더)은 제외
                    const product = row.getCell(1).value; // 제품명
                    const price = row.getCell(2).value; // 가격
                    companies[companyName][product] = price; // 제품명과 가격을 객체에 저장
                }
            });
        });

        // 회사 선택 옵션 초기화
        const companyOptions = document.getElementById('companyOptions');
        for (let company in companies) {
            const option = document.createElement('div');
            option.textContent = company;
            option.onclick = () => selectCompany(company);
            companyOptions.appendChild(option);
        }

        // 문의서 데이터 로드
        const inquryResponse = await fetch('https://asdddsa182.github.io/AshGray/inqury.xlsx');
        const inquryArrayBuffer = await inquryResponse.arrayBuffer();
        inquryWorkbook = new ExcelJS.Workbook();
        await inquryWorkbook.xlsx.load(inquryArrayBuffer);

        console.log("초기화 완료");
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        alert('데이터 로드 중 오류가 발생했습니다.');
    }
}

// 버튼 클릭 이벤트 리스너 추가
document.getElementById('companySelectButton').addEventListener('click', toggleCompanyOptions);
document.getElementById('productSelectButton').addEventListener('click', toggleProductOptions);
document.getElementById('addButton').addEventListener('click', addTableRow);
document.getElementById('exportExcelButton').addEventListener('click', exportToExcel);
document.getElementById('togglePriceButton').addEventListener('click', togglePrices);

// 회사 선택 옵션 토글 함수
function toggleCompanyOptions() {
    const companyOptions = document.getElementById('companyOptions');
    const productOptions = document.getElementById('productOptions');
    
    // 회사 선택 옵션 보이기/숨기기
    if (companyOptions.style.display === 'block') {
        companyOptions.style.display = 'none';
    } else {
        companyOptions.style.display = 'block';
        productOptions.style.display = 'none';
    }
}

// 제품 선택 옵션 토글 함수
function toggleProductOptions() {
    const companyOptions = document.getElementById('companyOptions');
    const productOptions = document.getElementById('productOptions');
    
    // 제품 선택 옵션 보이기/숨기기
    if (productOptions.style.display === 'block') {
        productOptions.style.display = 'none';
    } else {
        productOptions.style.display = 'block';
        companyOptions.style.display = 'none';
    }
}

// 회사 선택 시 처리 함수
function selectCompany(company) {
    selectedCompany = company; // 선택된 회사 저장
    document.getElementById('companySelectButton').textContent = company; // 버튼 텍스트 변경
    document.getElementById('companyOptions').style.display = 'none'; // 옵션 숨기기

    // 제품 선택 옵션 초기화
    const productOptions = document.getElementById('productOptions');
    productOptions.innerHTML = '<div onclick="resetProductSelection()">- 제품 선택 -</div>';
    for (let product in companies[company]) {
        const option = document.createElement('div');
        option.textContent = product;
        option.onclick = () => selectProduct(product);
        productOptions.appendChild(option);
    }

    document.getElementById('productSelectButton').disabled = false; // 제품 선택 버튼 활성화
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -'; // 버튼 텍스트 초기화
    selectedProduct = ''; // 선택된 제품 초기화
    document.getElementById('addButton').disabled = true; // 추가 버튼 비활성화
}

// 제품 선택 시 처리 함수
function selectProduct(product) {
    selectedProduct = product; // 선택된 제품 저장
    document.getElementById('productSelectButton').textContent = product; // 버튼 텍스트 변경
    document.getElementById('productOptions').style.display = 'none'; // 옵션 숨기기
    document.getElementById('addButton').disabled = false; // 추가 버튼 활성화
}

// 회사 선택 초기화 함수
function resetCompanySelection() {
    selectedCompany = ''; // 선택된 회사 초기화
    document.getElementById('companySelectButton').textContent = '- 회사 선택 -'; // 버튼 텍스트 초기화
    document.getElementById('companyOptions').style.display = 'none'; // 옵션 숨기기
    document.getElementById('productSelectButton').disabled = true; // 제품 선택 버튼 비활성화
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -'; // 버튼 텍스트 초기화
    selectedProduct = ''; // 선택된 제품 초기화
    document.getElementById('addButton').disabled = true; // 추가 버튼 비활성화
}

// 제품 선택 초기화 함수
function resetProductSelection() {
    selectedProduct = ''; // 선택된 제품 초기화
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -'; // 버튼 텍스트 초기화
    document.getElementById('productOptions').style.display = 'none'; // 옵션 숨기기
    document.getElementById('addButton').disabled = true; // 추가 버튼 비활성화
}

// 제품 추가 함수
function addTableRow() {
    const unitPrice = companies[selectedCompany][selectedProduct]; // 선택된 제품의 단가 가져오기

    const tableBody = document.querySelector('#dataTable tbody'); // 테이블 본문 가져오기
    const newRow = tableBody.insertRow(); // 새로운 행 추가

    // 각 셀 생성 및 내용 추가
    const indexCell = newRow.insertCell(0);
    indexCell.textContent = ++productCount; // 제품 번호

    // 제품 입력 필드 추가 (수정 가능하게 변경)
    const productCell = newRow.insertCell(1);
    const productInput = document.createElement('input');
    productInput.type = 'text';
    productInput.value = selectedProduct; // 선택된 제품명 설정
    productInput.className = 'product-cell';
    productCell.appendChild(productInput);

    // 단가 입력 필드 추가
    const unitPriceCell = newRow.insertCell(2);
    const unitPriceInput = document.createElement('input');
    unitPriceInput.type = 'text';
    unitPriceInput.value = formatNumber(unitPrice); // 숫자 포맷 적용
    unitPriceInput.className = 'price-cell';
    unitPriceInput.oninput = function() {
        this.value = formatNumber(this.value.replace(/,/g, '')); // 입력 시 포맷 적용
        updatePriceFromUnitPrice(newRow); // 가격 업데이트
    };
    unitPriceCell.appendChild(unitPriceInput);

    // 수량 입력 필드 추가
    const quantityCell = newRow.insertCell(3);
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '0';
    quantityInput.value = '1';
    quantityInput.oninput = function() {
        updatePriceFromUnitPrice(newRow); // 수량 변경 시 가격 업데이트
    };
    quantityCell.appendChild(quantityInput);

    // 가격 입력 필드 추가 (수정 가능하게 변경)
    const priceCell = newRow.insertCell(4);
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.value = formatNumber(unitPrice * quantityInput.value); // 초기 가격 계산
    priceInput.className = 'price-cell';
    priceInput.oninput = function() {
        this.value = formatNumber(this.value.replace(/,/g, '')); // 입력 시 포맷 적용
    };
    priceCell.appendChild(priceInput);

    // 비고 입력 필드 추가
    const noteCell = newRow.insertCell(5);
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.placeholder = '비고 입력';
    noteCell.appendChild(noteInput);

    // 삭제 버튼 추가
    const deleteCell = newRow.insertCell(6);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.onclick = function() {
        tableBody.removeChild(newRow); // 행 삭제
        updateProductCount(); // 제품 개수 업데이트
    };
    deleteCell.appendChild(deleteButton);

    // 상태 초기화
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -';
    selectedProduct = '';
    document.getElementById('addButton').disabled = true;

    // 가격 숨김 설정 시 입력 필드 비활성화
    if (pricesHidden) {
        unitPriceInput.disabled = true;
        priceInput.disabled = true;
        unitPriceInput.value = '';
        priceInput.value = '';
    }
}



// 제품 개수 업데이트 함수
function updateProductCount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    productCount = 0;
    rows.forEach((row, index) => {
        row.cells[0].textContent = ++productCount; // 제품 번호 갱신
    });
}

// 단가 및 수량에 따라 가격을 업데이트하는 함수
function updatePriceFromUnitPrice(row) {
    const unitPrice = parseFloat(row.cells[2].querySelector('input').value.replace(/,/g, '')) || 0;
    const quantity = parseInt(row.cells[3].querySelector('input').value) || 0;
    const priceInput = row.cells[4].querySelector('input');

    const totalPrice = unitPrice * quantity; // 총 가격 계산
    priceInput.value = formatNumber(totalPrice); // 포맷 적용 후 총 가격 설정
}

// 숫자를 세 자리마다 콤마로 포맷하는 함수
function formatNumber(number) {
    if (!number) return '';
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 가격 숨기기/보이기 토글 함수
function togglePrices() {
    const unitPriceElements = document.querySelectorAll('td:nth-child(3) input');
    const priceElements = document.querySelectorAll('td:nth-child(5) input');
    const button = document.getElementById('togglePriceButton');

    pricesHidden = !pricesHidden; // 가격 숨김 여부 토글

    unitPriceElements.forEach(element => {
        if (pricesHidden) {
            element.setAttribute('data-current-value', element.value); // 현재 값 저장
            element.disabled = true; // 비활성화
            element.value = '';
            element.style.backgroundColor = '#e9ecef'; // 배경색 변경
            element.style.color = '#e9ecef'; // 글자색 변경
        } else {
            element.disabled = false; // 활성화
            element.value = element.getAttribute('data-current-value'); // 저장된 값 복원
            element.style.backgroundColor = ''; // 배경색 원래대로
            element.style.color = ''; // 글자색 원래대로
        }
    });

    priceElements.forEach(element => {
        if (pricesHidden) {
            element.setAttribute('data-current-value', element.value); // 현재 값 저장
            element.disabled = true; // 비활성화
            element.value = '';
            element.style.backgroundColor = '#e9ecef'; // 배경색 변경
            element.style.color = '#e9ecef'; // 글자색 변경
        } else {
            element.disabled = false; // 활성화
            element.value = element.getAttribute('data-current-value'); // 저장된 값 복원
            element.style.backgroundColor = ''; // 배경색 원래대로
            element.style.color = ''; // 글자색 원래대로
        }
    });

    button.textContent = pricesHidden ? '가격 보이기' : '가격 숨기기'; // 버튼 텍스트 변경
}

// 엑셀로 내보내기 함수
async function exportToExcel() {
    try {
        // 엑셀 파일 데이터 로드
        const response = await fetch('/inqury.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        const tableRows = document.querySelectorAll('#dataTable tbody tr');
        const startRow = 18;
        const endRow = 150;

        // 워크시트의 열 너비 설정
        worksheet.columns.forEach((column, index) => {
            const col = worksheet.getColumn(index + 1);
            if (col.width) {
                column.width = col.width;
            }
        });

        // 견적 날짜와 고객 이름 설정
        const quoteDate = `${document.getElementById('quoteYear').value}-${document.getElementById('quoteMonth').value}-${document.getElementById('quoteDay').value}`;
        worksheet.getCell('A3').value = quoteDate;

        const customerName = document.getElementById('customerName').value;
        worksheet.getCell('A4').value = customerName;

        let totalAmount = 0; // 총 금액 초기화

        // 테이블 데이터를 엑셀 워크시트에 추가
        tableRows.forEach((row, index) => {
            const rowIndex = startRow + index;

            worksheet.getCell(`A${rowIndex}`).value = index + 1; // 제품 번호
            worksheet.getCell(`C${rowIndex}`).value = row.cells[1].querySelector('input').value; // 제품명 입력 필드의 값 가져오기

            if (!pricesHidden) { // 가격이 숨겨지지 않은 경우
                const unitPrice = parseFloat(row.cells[2].querySelector('input').value.replace(/,/g, '')) || 0;
                const price = parseFloat(row.cells[4].querySelector('input').value.replace(/,/g, '')) || 0;

                worksheet.getCell(`F${rowIndex}`).value = unitPrice; // 단가 설정
                worksheet.getCell(`I${rowIndex}`).value = price; // 가격 설정

                totalAmount += price; // 총 금액 누적
            } else {
                worksheet.getCell(`F${rowIndex}`).value = " ";
                worksheet.getCell(`I${rowIndex}`).value = " ";
            }

            worksheet.getCell(`H${rowIndex}`).value = parseInt(row.cells[3].querySelector('input').value) || 0; // 수량 설정
            worksheet.getCell(`K${rowIndex}`).value = row.cells[5].querySelector('input').value; // 비고 설정

            // 셀 정렬 설정
            ['A', 'C', 'F', 'H', 'I', 'K'].forEach(col => {
                worksheet.getCell(`${col}${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // 부가세와 총 금액 계산
        if (!pricesHidden) {
            const vat = totalAmount * 0.1;
            worksheet.getCell('F12').value = totalAmount;
            worksheet.getCell('F12').alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('F11').value = totalAmount + vat;
            worksheet.getCell('F11').alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
            worksheet.getCell('F11').value = " ";
            worksheet.getCell('F12').value = " ";
        }

        // 불필요한 행 삭제
        let rowsToDelete = [];
        for (let i = startRow; i <= endRow; i++) {
            const checkCell = worksheet.getCell(`A${i}`);
            if (checkCell.value === null || checkCell.value.toString().toLowerCase() === 'null') {
                rowsToDelete.push(i);
            }
        }

        rowsToDelete.reverse().forEach(rowNumber => {
            worksheet.spliceRows(rowNumber, 1);
        });

        // 파일 이름 생성 및 다운로드
        const fileName = `${customerName || '일반'}_고객_견적서.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('엑셀 파일 생성 중 오류 발생:', error);
        alert('엑셀 파일 생성에 실패했습니다.');
    }
}


// 페이지 로드 시 초기화 함수 호출
window.onload = init;