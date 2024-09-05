// 전역 변수 선언
/**************************************
 * 전체 스크립트에서 사용되는 주요 변수들을 정의합니다.
 **************************************/
let companies = {};        // 회사와 제품 정보를 저장할 객체
let productCount = 0;      // 테이블에 추가된 제품의 개수를 추적
let pricesHidden = false;  // 가격 숨김 여부를 추적
let selectedCompany = '';  // 선택된 회사 이름
let selectedProduct = '';  // 선택된 제품 이름
let imageDataStore = {};   // 이미지 데이터를 저장할 객체

// 페이지 초기화 함수
/**************************************
 * 페이지가 로드될 때 실행되는 초기화 함수입니다.
 * 필요한 모든 설정과 데이터 로드를 수행합니다.
 **************************************/
async function init() {
    initDateFields();              // 날짜 필드 초기화
    await loadCompaniesAndProducts(); // 회사 및 제품 데이터 로드
    setupEventListeners();         // 이벤트 리스너 설정
    setupModalEvents();            // 모달 이벤트 설정
    updateTotalAmountVisibility(); // 총액 섹션의 표시 여부 초기화
    console.log("초기화 완료");
}

// 총액 섹션 표시 여부 업데이트 함수
/**************************************
 * 테이블에 항목이 있는지 확인하고 총액 섹션의 표시 여부를 결정합니다.
 **************************************/
function updateTotalAmountVisibility() {
    const tableBody = document.querySelector('#dataTable tbody');
    const totalAmountSection = document.getElementById('totalAmountSection');
    totalAmountSection.style.display = tableBody.children.length === 0 ? 'none' : 'block';
}

// 날짜 필드 초기화 함수
/**************************************
 * 견적 날짜 선택을 위한 드롭다운 메뉴를 초기화합니다.
 * 현재 년도부터 10년 전까지의 연도 옵션을 생성합니다.
 **************************************/
function initDateFields() {
    const yearSelect = document.getElementById('quoteYear');
    const monthSelect = document.getElementById('quoteMonth');
    const daySelect = document.getElementById('quoteDay');
    const currentYear = new Date().getFullYear();

    // 연도 옵션 추가
    for (let year = currentYear; year >= currentYear - 10; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 월 옵션 추가
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month.toString().padStart(2, '0');
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // 일 옵션 업데이트 함수
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(year, month, 0).getDate();

        daySelect.innerHTML = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }

    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);

    updateDays(); // 초기 일 옵션 설정
}

// GitHub 이미지 URL 처리 함수
/**************************************
 * GitHub 이미지 URL을 raw 콘텐츠 URL로 변환합니다.
 **************************************/
function processGitHubImageUrl(url) {
    console.log("처리 전 URL:", url);
    if (url && typeof url === 'string') {
        if (url.includes('raw.githubusercontent.com')) {
            return url;
        }
        if (url.includes('github.com')) {
            return url.replace('github.com', 'raw.githubusercontent.com')
                      .replace('/blob/', '/');
        }
    }
    return url;
}

// 회사 및 제품 데이터 로드 함수
/**************************************
 * 외부 Excel 파일에서 회사 및 제품 데이터를 로드합니다.
 * 로드된 데이터를 기반으로 회사 선택 옵션을 생성합니다.
 **************************************/
async function loadCompaniesAndProducts() {
    try {
        const response = await fetch('https://asdddsa182.github.io/AshGray/product.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const companyOptions = document.getElementById('companyOptions');
        companyOptions.innerHTML = '<div class="default-option" onclick="resetCompanySelection()">- 회사 선택 -</div>';

        workbook.eachSheet((worksheet, sheetId) => {
            const companyName = worksheet.name;
            companies[companyName] = {};

            const option = document.createElement('div');
            option.textContent = companyName;
            option.onclick = () => selectCompany(companyName);
            companyOptions.appendChild(option);

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const product = row.getCell(1).value;
                    const price = row.getCell(2).value;
                    let imageUrl = row.getCell(3).value;
                    
                    if (typeof imageUrl === 'object' && imageUrl !== null) {
                        imageUrl = imageUrl.text || '';
                    }
                    
                    imageUrl = processGitHubImageUrl(imageUrl);
                    
                    companies[companyName][product] = { price, imageUrl };
                }
            });
        });

        console.log("회사 및 제품 데이터 로드 완료");
    } catch (error) {
        console.error('회사 및 제품 데이터 로드 중 오류 발생:', error);
        alert('데이터 로드 중 오류가 발생했습니다.');
    }
}

// 이벤트 리스너 설정 함수
/**************************************
 * 페이지의 주요 요소들에 대한 이벤트 리스너를 설정합니다.
 **************************************/
function setupEventListeners() {
    document.getElementById('companySelectButton').addEventListener('click', toggleCompanyOptions);
    document.getElementById('productSelectButton').addEventListener('click', toggleProductOptions);
    document.getElementById('addButton').addEventListener('click', addTableRow);
    document.getElementById('exportExcelButton').addEventListener('click', exportToExcel);
    document.getElementById('loadExcelButton').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', loadZipFile);
    document.getElementById('manualEntryButton').addEventListener('click', addManualEntryRow);
    document.querySelector('#dataTable tbody').addEventListener('input', () => {
        updateTotalAmount();
        updateTotalAmountVisibility();
    });
}

// 회사 선택 옵션 토글 함수
/**************************************
 * 회사 선택 드롭다운 메뉴의 표시를 토글합니다.
 **************************************/
function toggleCompanyOptions() {
    const companyOptions = document.getElementById('companyOptions');
    const productOptions = document.getElementById('productOptions');
    
    companyOptions.style.display = companyOptions.style.display === 'block' ? 'none' : 'block';
    productOptions.style.display = 'none';
}

// 제품 선택 옵션 토글 함수
/**************************************
 * 제품 선택 드롭다운 메뉴의 표시를 토글합니다.
 **************************************/
function toggleProductOptions() {
    const companyOptions = document.getElementById('companyOptions');
    const productOptions = document.getElementById('productOptions');
    
    productOptions.style.display = productOptions.style.display === 'block' ? 'none' : 'block';
    companyOptions.style.display = 'none';
}

// 회사 선택 함수
/**************************************
 * 사용자가 회사를 선택했을 때 호출되는 함수입니다.
 * 선택된 회사의 제품 목록을 표시합니다.
 **************************************/
function selectCompany(company) {
    selectedCompany = company;
    document.getElementById('companySelectButton').textContent = company;
    document.getElementById('companyOptions').style.display = 'none';

    const productOptions = document.getElementById('productOptions');
    productOptions.innerHTML = '<div class="default-option" onclick="resetProductSelection()">- 제품 선택 -</div>';
    
    for (let product in companies[company]) {
        const option = document.createElement('div');
        option.textContent = product;
        option.onclick = () => selectProduct(product);
        
        if (isProductAlreadyAdded(product)) {
            option.classList.add('already-added');
        }
        
        productOptions.appendChild(option);
    }

    document.getElementById('productSelectButton').disabled = false;
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -';
    selectedProduct = '';
    document.getElementById('addButton').disabled = true;
}

// 제품 이미 추가 여부 확인 함수
/**************************************
 * 특정 제품이 이미 테이블에 추가되었는지 확인합니다.
 **************************************/
function isProductAlreadyAdded(productName) {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    for (let row of rows) {
        if (row.cells[1].querySelector('input').value === productName) {
            return true;
        }
    }
    return false;
}

// 제품 드롭다운 업데이트 함수
/**************************************
 * 제품 선택 드롭다운 메뉴를 업데이트합니다.
 **************************************/
function updateProductDropdown() {
    if (selectedCompany) {
        selectCompany(selectedCompany);
    }
}

// 제품 선택 함수
/**************************************
 * 사용자가 제품을 선택했을 때 호출되는 함수입니다.
 **************************************/
function selectProduct(product) {
    selectedProduct = product;
    document.getElementById('productSelectButton').textContent = product;
    document.getElementById('productOptions').style.display = 'none';
    document.getElementById('addButton').disabled = false;
    document.getElementById('addButton').style.cursor = '';
}

// 회사 선택 초기화 함수
/**************************************
 * 회사 선택을 초기 상태로 되돌립니다.
 **************************************/
function resetCompanySelection() {
    selectedCompany = '';
    document.getElementById('companySelectButton').textContent = '- 회사 선택 -';
    document.getElementById('companyOptions').style.display = 'none';
    document.getElementById('productSelectButton').disabled = true;
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -';
    selectedProduct = '';
    document.getElementById('addButton').disabled = true;
    document.getElementById('addButton').style.cursor = 'not-allowed';
    
    const productOptions = document.getElementById('productOptions');
    productOptions.innerHTML = '<div class="default-option" onclick="resetProductSelection()">- 제품 선택 -</div>';
}

// 제품 선택 초기화 함수
/**************************************
 * 제품 선택을 초기 상태로 되돌립니다.
 **************************************/
function resetProductSelection() {
    selectedProduct = '';
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -';
    document.getElementById('productOptions').style.display = 'none';
    document.getElementById('addButton').disabled = true;
    document.getElementById('addButton').style.cursor = 'not-allowed';
}

// 제품 추가 함수
/**************************************
 * 선택된 제품을 테이블에 추가합니다.
 * 이미 존재하는 제품의 경우 수량만 증가시킵니다.
 **************************************/
function addTableRow() {
    const productName = selectedProduct;
    const productInfo = companies[selectedCompany][selectedProduct];
    console.log("선택된 제품 정보:", productInfo);
    const tableBody = document.querySelector('#dataTable tbody');

    const existingRow = findExistingProductRow(productName);

    if (existingRow) {
        updateExistingRow(existingRow);
    } else {
        const newRow = tableBody.insertRow();

        // 새 행에 셀 추가 (인덱스, 제품명, 단가, 수량, 가격, 비고, 미리보기, 삭제 버튼)
        const cells = ['index', 'product', 'unitPrice', 'quantity', 'price', 'note', 'preview', 'delete'];
        cells.forEach((cellType, index) => {
            const cell = newRow.insertCell(index);
            switch (cellType) {
                case 'index':
                    cell.textContent = ++productCount;
                    break;
                case 'product':
                    const productInput = createInput('text', productName, 'product-cell');
                    cell.appendChild(productInput);
                    break;
                case 'unitPrice':
                    const unitPriceInput = createInput('text', formatNumber(productInfo.price), 'price-cell');
                    unitPriceInput.oninput = function () {
                        this.value = formatNumber(this.value.replace(/[^0-9]/g, ''));
                        updatePriceFromUnitPrice(newRow);
                    };
                    cell.appendChild(unitPriceInput);
                    break;
                case 'quantity':
                    const quantityInput = createInput('number', '1', '', { min: '0' });
                    quantityInput.oninput = function () {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        updatePriceFromUnitPrice(newRow);
                    };
                    cell.appendChild(quantityInput);
                    break;
                case 'price':
                    const priceInput = createInput('text', formatNumber(productInfo.price), 'price-cell');
                    priceInput.oninput = function () {
                        this.value = formatNumber(this.value.replace(/[^0-9]/g, ''));
                    };
                    cell.appendChild(priceInput);
                    break;
                case 'note':
                    cell.appendChild(createInput('text', '', '', { placeholder: '    ' }));
                    break;
                case 'preview':
                    cell.appendChild(createPreviewButtons(productName, productInfo.imageUrl));
                    break;
                case 'delete':
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '삭제';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = function() {
                        tableBody.removeChild(newRow);
                        updateProductCount();
                        updateProductDropdown();
                        updateTotalAmount();
                        updateTotalAmountVisibility();
                    };
                    cell.appendChild(deleteButton);
                    break;
            }
        });

        if (pricesHidden) {
            newRow.cells[2].querySelector('input').disabled = true;
            newRow.cells[4].querySelector('input').disabled = true;
            newRow.cells[2].querySelector('input').value = '';
            newRow.cells[4].querySelector('input').value = '';
        }
    }

    resetProductSelection();
    updateProductCount();
    updateProductDropdown();
    updateTotalAmount();
    updateTotalAmountVisibility();
}

// 입력 필드 생성 함수
/**************************************
 * 다양한 타입의 입력 필드를 생성합니다.
 **************************************/
function createInput(type, value, className, attributes = {}) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.className = className;
    for (let attr in attributes) {
        input.setAttribute(attr, attributes[attr]);
    }
    return input;
}

// 미리보기 버튼 생성 함수
/**************************************
 * 제품 이미지 미리보기를 위한 버튼들을 생성합니다.
 **************************************/
function createPreviewButtons(productName, imageUrl) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'preview-buttons';

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';

    const increaseButton = createButton('+', 'increase-button');
    const decreaseButton = createButton('-', 'decrease-button');
    buttonRow.appendChild(increaseButton);
    buttonRow.appendChild(decreaseButton);

    const previewButton = createButton('미리보기', 'preview-button');
    previewButton.disabled = !imageUrl;

    if (imageUrl) {
        const imageKey = 'image_' + Date.now();
        imageDataStore[imageKey] = {
            data: imageUrl,
            name: `${productName}.png`,
            type: 'image/png'
        };
        buttonContainer.setAttribute('data-image-key', imageKey);
        previewButton.onclick = () => showImagePreview(imageUrl, productName);
    }

    buttonContainer.appendChild(buttonRow);
    buttonContainer.appendChild(previewButton);

    setupImageUpload(increaseButton, decreaseButton, previewButton, buttonContainer, productName);

    return buttonContainer;
}

// 버튼 생성 함수
/**************************************
 * 재사용 가능한 버튼 요소를 생성합니다.
 **************************************/
function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    return button;
}

// 이미지 업로드 설정 함수
/**************************************
 * 이미지 업로드 및 삭제 기능을 설정합니다.
 **************************************/
function setupImageUpload(increaseButton, decreaseButton, previewButton, container, productName) {
    increaseButton.onclick = function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    const imageKey = 'image_' + Date.now();
                    imageDataStore[imageKey] = {
                        data: imageUrl,
                        name: file.name,
                        type: file.type
                    };
                    container.setAttribute('data-image-key', imageKey);
                    previewButton.onclick = () => showImagePreview(imageUrl, productName);
                    previewButton.disabled = false;
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    decreaseButton.onclick = function() {
        container.removeAttribute('data-image-key');
        previewButton.onclick = null;
        previewButton.disabled = true;
    };
}

// 기존 제품 행 찾기 함수
/**************************************
 * 이미 테이블에 존재하는 제품 행을 찾습니다.
 **************************************/
function findExistingProductRow(productName) {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    for (let row of rows) {
        if (row.cells[1].querySelector('input').value === productName) {
            return row;
        }
    }
    return null;
}

// 기존 행 업데이트 함수
/**************************************
 * 이미 존재하는 제품의 수량을 증가시킵니다.
 **************************************/
function updateExistingRow(row) {
    const quantityInput = row.cells[3].querySelector('input');
    const currentQuantity = parseInt(quantityInput.value) || 0;
    quantityInput.value = currentQuantity + 1;
    updatePriceFromUnitPrice(row);
}

// 수동 입력 행 추가 함수
/**************************************
 * 사용자가 직접 정보를 입력할 수 있는 빈 행을 추가합니다.
 **************************************/
function addManualEntryRow() {
    const tableBody = document.querySelector('#dataTable tbody');
    const newRow = tableBody.insertRow();

    const cells = [
        { type: 'index', content: ++productCount },
        { type: 'input', className: 'product-cell', placeholder: '    ' },
        { type: 'input', className: 'price-cell', placeholder: '    ', onInput: updatePriceAndTotal },
        { type: 'number', min: '0', placeholder: '    ', onInput: updatePriceAndTotal },
        { type: 'input', className: 'price-cell', placeholder: '    ', onInput: updateTotalAmount },
        { type: 'input', placeholder: '    ' },
        { type: 'preview' },
        { type: 'delete' }
    ];

    cells.forEach((cellInfo, index) => {
        const cell = newRow.insertCell();
        switch (cellInfo.type) {
            case 'index':
                cell.textContent = cellInfo.content;
                break;
            case 'input':
            case 'number':
                const input = createInput(cellInfo.type, '', cellInfo.className, { placeholder: cellInfo.placeholder, min: cellInfo.min });
                if (cellInfo.onInput) {
                    input.oninput = function() {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        if (cellInfo.className === 'price-cell') {
                            this.value = formatNumber(this.value);
                        }
                        cellInfo.onInput(newRow);
                    };
                }
                cell.appendChild(input);
                break;
            case 'preview':
                cell.appendChild(createPreviewButtons('', ''));
                break;
            case 'delete':
                const deleteButton = createButton('삭제', 'delete-button');
                deleteButton.onclick = function() {
                    tableBody.removeChild(newRow);
                    updateProductCount();
                    updateTotalAmount();
                    updateTotalAmountVisibility();
                };
                cell.appendChild(deleteButton);
                break;
        }
    });

    if (pricesHidden) {
        newRow.cells[2].querySelector('input').disabled = true;
        newRow.cells[4].querySelector('input').disabled = true;
    }

    updateTotalAmountVisibility();
}

// 가격 및 총액 업데이트 함수
/**************************************
 * 단가나 수량이 변경될 때 가격과 총액을 업데이트합니다.
 **************************************/
function updatePriceAndTotal(row) {
    updatePriceFromUnitPrice(row);
    updateTotalAmount();
}

// 이미지 미리보기 함수
/**************************************
 * 제품 이미지를 모달 창에서 미리보기로 표시합니다.
 **************************************/
function showImagePreview(imageUrl, productName) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalProductName = document.getElementById('modalProductName');
    console.log("미리보기 시도 URL:", imageUrl);
    
    if (imageUrl && imageUrl.trim() !== '') {
        modalImg.onload = function() {
            modal.style.display = "flex";
            console.log("이미지 로드 성공");
        };
        modalImg.onerror = function() {
            console.log("이미지 로드 실패");
            alert('이미지를 불러올 수 없습니다.');
        };
        modalImg.src = imageUrl;
        modalProductName.textContent = productName || '제품명 없음';
    } else {
        console.log("이미지 URL이 없거나 유효하지 않습니다.");
        alert('이미지를 찾을 수 없습니다.');
    }
}

// 모달 닫기 함수
/**************************************
 * 이미지 미리보기 모달 창을 닫습니다.
 **************************************/
function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}

// 모달 이벤트 설정 함수
/**************************************
 * 모달 창의 닫기 기능을 설정합니다.
 **************************************/
function setupModalEvents() {
    const modal = document.getElementById('imageModal');
    const span = document.getElementsByClassName("close")[0];
    
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

// 제품 개수 업데이트 함수
/**************************************
 * 테이블의 제품 번호를 순서대로 업데이트합니다.
 **************************************/
function updateProductCount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    productCount = 0;
    rows.forEach((row, index) => {
        row.cells[0].textContent = ++productCount;
    });
}

// 단가 기반 가격 업데이트 함수
/**************************************
 * 단가와 수량을 기반으로 각 제품의 가격을 계산합니다.
 **************************************/
function updatePriceFromUnitPrice(row) {
    const unitPrice = parseFloat(row.cells[2].querySelector('input').value.replace(/,/g, '')) || 0;
    const quantity = parseInt(row.cells[3].querySelector('input').value) || 0;
    const priceInput = row.cells[4].querySelector('input');

    const totalPrice = unitPrice * quantity;
    priceInput.value = formatNumber(totalPrice);
}

// 숫자 포맷 함수
/**************************************
 * 숫자를 천 단위로 쉼표를 넣어 포맷합니다.
 **************************************/
function formatNumber(number) {
    if (!number) return '';
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 총액 업데이트 함수
/**************************************
 * 테이블의 모든 제품 가격을 합산하여 총액을 계산합니다.
 **************************************/
function updateTotalAmount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    let totalAmount = 0;

    rows.forEach(row => {
        const price = parseFloat(row.cells[4].querySelector('input').value.replace(/,/g, '')) || 0;
        totalAmount += price;
    });

    const vatAmount = totalAmount * 0.1;
    const totalWithVAT = totalAmount + vatAmount;

    document.getElementById('totalAmountWithoutVAT').textContent = formatNumber(totalAmount) + ' 원';
    document.getElementById('vatAmount').textContent = formatNumber(vatAmount) + ' 원';
    document.getElementById('totalAmountWithVAT').textContent = formatNumber(totalWithVAT) + ' 원';

    updateTotalAmountVisibility();
}

// 견적서 내보내기 함수
/**************************************
 * 현재 테이블의 데이터를 엑셀 파일로 내보냅니다.
 * 이미지도 함께 ZIP 파일로 압축하여 다운로드합니다.
 **************************************/
async function exportToExcel() {
    try {
        const zip = new JSZip();

        // 템플릿 엑셀 파일 로드
        const response = await fetch('/inqury.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        const tableRows = document.querySelectorAll('#dataTable tbody tr');
        const startRow = 18;
        const endRow = 150;

        // 열 너비 설정
        worksheet.columns.forEach((column, index) => {
            const col = worksheet.getColumn(index + 1);
            if (col.width) {
                column.width = col.width;
            }
        });

        // 견적 정보 입력
        const quoteDate = `${document.getElementById('quoteYear').value}-${document.getElementById('quoteMonth').value}-${document.getElementById('quoteDay').value}`;
        worksheet.getCell('A3').value = quoteDate;
        worksheet.getCell('A4').value = document.getElementById('customerName').value;
        worksheet.getCell('H7').value = document.getElementById('writerPhone').value;

        let totalAmount = 0;
        const imagePromises = [];

        // 테이블 데이터 입력
        tableRows.forEach((row, index) => {
            const rowIndex = startRow + index;

            worksheet.getCell(`A${rowIndex}`).value = index + 1;
            worksheet.getCell(`C${rowIndex}`).value = row.cells[1].querySelector('input').value;

            if (!pricesHidden) {
                const unitPrice = parseFloat(row.cells[2].querySelector('input').value.replace(/,/g, '')) || 0;
                const price = parseFloat(row.cells[4].querySelector('input').value.replace(/,/g, '')) || 0;

                worksheet.getCell(`F${rowIndex}`).value = unitPrice;
                worksheet.getCell(`I${rowIndex}`).value = price;

                totalAmount += price;
            } else {
                worksheet.getCell(`F${rowIndex}`).value = " ";
                worksheet.getCell(`I${rowIndex}`).value = " ";
            }

            worksheet.getCell(`H${rowIndex}`).value = parseInt(row.cells[3].querySelector('input').value) || 0;
            worksheet.getCell(`K${rowIndex}`).value = row.cells[5].querySelector('input').value;

            // 셀 정렬 설정
            ['A', 'C', 'F', 'H', 'I', 'K'].forEach(col => {
                worksheet.getCell(`${col}${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
            });

            // 이미지 처리
            const imageKey = row.getAttribute('data-image-key');
            if (imageKey && imageDataStore[imageKey]) {
                const imageInfo = imageDataStore[imageKey];
                const imagePromise = fetch(imageInfo.data)
                    .then(res => res.blob())
                    .then(blob => {
                        zip.file(imageInfo.name, blob, {binary: true});
                    })
                    .catch(error => {
                        console.error('이미지 처리 중 오류 발생:', error);
                        return fetch(imageInfo.data)
                            .then(res => res.blob())
                            .then(blob => {
                                zip.file(imageInfo.name, blob, {binary: true});
                            });
                    });
                imagePromises.push(imagePromise);
            }
        });

        await Promise.all(imagePromises);

        // 총액 정보 입력
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

        // 빈 행 제거
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

        // 엑셀 파일 생성 및 ZIP에 추가
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const customerName = document.getElementById('customerName').value || '일반';
        zip.file(`${customerName}_고객_견적서.xlsx`, excelBuffer);

        // ZIP 파일 생성 및 다운로드
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            const zipFileName = `${customerName}_고객_자료.zip`;
            const zipUrl = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = zipUrl;
            a.download = zipFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(zipUrl);
        });

    } catch (error) {
        console.error('ZIP 파일 생성 중 오류 발생:', error);
        alert('ZIP 파일 생성에 실패했습니다.');
    }
}

// ZIP 파일 로드 함수
/**************************************
 * ZIP 파일을 로드하여 테이블에 데이터를 채웁니다.
 **************************************/
async function loadZipFile(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            console.error('파일이 선택되지 않았습니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const zip = await JSZip.loadAsync(e.target.result);
                
                // Excel 파일 찾기 및 처리
                let workbook;
                let excelFileName;
                for (let filename of Object.keys(zip.files)) {
                    if (filename.endsWith('.xlsx')) {
                        excelFileName = filename;
                        const excelFile = await zip.file(filename).async('arraybuffer');
                        workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.load(excelFile);
                        break;
                    }
                }

                if (!workbook) {
                    throw new Error('ZIP 파일 내에 Excel 파일이 없습니다.');
                }

                const worksheet = workbook.getWorksheet(1);

                // 견적 정보 설정
                setQuoteInfo(worksheet);

                // 기존 테이블 내용 삭제
                clearTableContent();

                // 제품 데이터 추가
                await addProductDataToTable(worksheet, zip);

                updateProductCount();
                updateTotalAmount();
                updateTotalAmountVisibility();
                alert('ZIP 파일이 성공적으로 불러와졌습니다.');
            } catch (error) {
                console.error('ZIP 파일 처리 중 오류 발생:', error);
                alert('ZIP 파일 처리 중 오류가 발생했습니다: ' + error.message);
            }
        };

        reader.onerror = function(error) {
            console.error('파일 읽기 오류:', error);
            alert('파일을 읽는 중 오류가 발생했습니다.');
        };

        reader.readAsArrayBuffer(file);

        // 파일 입력 필드 초기화
        event.target.value = '';
    } catch (error) {
        console.error('ZIP 파일 로드 중 오류 발생:', error);
        alert('ZIP 파일을 로드하는 중 오류가 발생했습니다.');
    }
}

// 견적 정보 설정 함수
/**************************************
 * 엑셀 파일에서 견적 정보를 추출하여 설정합니다.
 **************************************/
function setQuoteInfo(worksheet) {
    const dateCell = worksheet.getCell('A3').value;
    if (dateCell) {
        const [year, month, day] = dateCell.split('-');
        document.getElementById('quoteYear').value = year;
        document.getElementById('quoteMonth').value = month;
        document.getElementById('quoteDay').value = day;
    }

    document.getElementById('customerName').value = worksheet.getCell('A4').value || '';
    document.getElementById('writerPhone').value = worksheet.getCell('H7').value || '';
}

// 테이블 내용 초기화 함수
/**************************************
 * 현재 테이블의 모든 내용을 삭제합니다.
 **************************************/
function clearTableContent() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';
}

// 제품 데이터를 테이블에 추가하는 함수
/**************************************
 * 엑셀 파일의 제품 데이터를 테이블에 추가합니다.
 **************************************/
async function addProductDataToTable(worksheet, zip) {
    const tableBody = document.querySelector('#dataTable tbody');
    const startRow = 18;

    for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        if (!row.getCell(1).value) break;  // 빈 행이면 중단

        const newRow = tableBody.insertRow();
        
        // 각 셀의 데이터 추가
        addCellToRow(newRow, 0, row.getCell(1).value);
        addInputCellToRow(newRow, 1, row.getCell(3).value, 'product-cell');
        addInputCellToRow(newRow, 2, formatNumber(row.getCell(6).value), 'price-cell', updatePriceFromUnitPrice);
        addInputCellToRow(newRow, 3, row.getCell(8).value, '', updatePriceFromUnitPrice);
        addInputCellToRow(newRow, 4, formatNumber(row.getCell(9).value), 'price-cell');
        addInputCellToRow(newRow, 5, row.getCell(11).value);

        // 이미지 미리보기 버튼 추가
        addPreviewButtonToRow(newRow, row.getCell(3).value, zip);

        // 삭제 버튼 추가
        addDeleteButtonToRow(newRow, tableBody);
    }
}

// 셀 추가 함수
function addCellToRow(row, cellIndex, value) {
    const cell = row.insertCell(cellIndex);
    cell.textContent = value;
}

// 입력 셀 추가 함수
function addInputCellToRow(row, cellIndex, value, className, onInputFunction) {
    const cell = row.insertCell(cellIndex);
    const input = document.createElement('input');
    input.type = cellIndex === 3 ? 'number' : 'text';
    input.value = value;
    input.className = className;
    if (onInputFunction) {
        input.oninput = function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (className === 'price-cell') {
                this.value = formatNumber(this.value);
            }
            onInputFunction(row);
        };
    }
    cell.appendChild(input);
}

// 미리보기 버튼 추가 함수
async function addPreviewButtonToRow(row, productName, zip) {
    const previewCell = row.insertCell(6);
    const buttonContainer = createPreviewButtons('', '');
    previewCell.appendChild(buttonContainer);

    const imageFiles = Object.keys(zip.files).filter(filename => 
        filename.toLowerCase().includes(productName.toLowerCase()) && 
        /\.(png|jpg|jpeg|gif)$/i.test(filename)
    );

    if (imageFiles.length > 0) {
        const imageFile = zip.file(imageFiles[0]);
        if (imageFile) {
            try {
                const content = await imageFile.async('base64');
                const imageUrl = `data:image/${imageFiles[0].split('.').pop()};base64,${content}`;
                row.setAttribute('data-image-url', imageUrl);
                const previewButton = buttonContainer.querySelector('.preview-button');
                previewButton.disabled = false;
                previewButton.onclick = () => showImagePreview(imageUrl, productName);
            } catch (imageError) {
                console.error('이미지 처리 중 오류:', imageError);
            }
        }
    }
}

// 삭제 버튼 추가 함수
function addDeleteButtonToRow(row, tableBody) {
    const deleteCell = row.insertCell(7);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        tableBody.removeChild(row);
        updateProductCount();
        updateTotalAmount();
        updateTotalAmountVisibility();
    };
    deleteCell.appendChild(deleteButton);
}

// 페이지 로드 시 초기화 함수 호출
window.onload = init;

// 고무블럭 수량 계산기 기능
/**************************************
 * 고무블럭 수량을 계산하는 기능을 설정합니다.
 **************************************/
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateBlocks');
    const areaWidthInput = document.getElementById('areaWidth');
    const areaLengthInput = document.getElementById('areaLength');
    const unitSelect = document.getElementById('unitSelect');
    const calculationResult = document.getElementById('calculationResult');

    calculateButton.addEventListener('click', calculateRubberBlocks);

    function calculateRubberBlocks() {
        const width = parseFloat(areaWidthInput.value);
        const length = parseFloat(areaLengthInput.value);
        const unit = unitSelect.value;

        if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
            calculationResult.textContent = '올바른 값을 입력해주세요.';
            return;
        }

        const widthInMeters = convertToMeters(width, unit);
        const lengthInMeters = convertToMeters(length, unit);

        const areaInSquareMeters = widthInMeters * lengthInMeters;
        const blockSizeInSquareMeters = 0.5 * 0.5; // 50cm x 50cm = 0.25 m²
        const numberOfBlocks = Math.ceil(areaInSquareMeters / blockSizeInSquareMeters);

        calculationResult.textContent = `필요한 고무블럭 수량: ${numberOfBlocks}개`;
    }

    function convertToMeters(value, unit) {
        switch (unit) {
            case 'm': return value;
            case 'cm': return value / 100;
            case 'mm': return value / 1000;
            case 'km': return value * 1000;
            default: return value;
        }
    }
});

// 에버롤 수량 계산기 기능
/**************************************
 * 에버롤 수량을 계산하는 기능을 설정합니다.
 **************************************/
document.addEventListener('DOMContentLoaded', function() {
    const calculateEverollButton = document.getElementById('calculateEveroll');
    const everollAreaWidthInput = document.getElementById('everollAreaWidth');
    const everollAreaLengthInput = document.getElementById('everollAreaLength');
    const everollUnitSelect = document.getElementById('everollUnitSelect');
    const everollCalculationResult = document.getElementById('everollCalculationResult');

    calculateEverollButton.addEventListener('click', calculateEverollRolls);

    function calculateEverollRolls() {
        const width = parseFloat(everollAreaWidthInput.value);
        const length = parseFloat(everollAreaLengthInput.value);
        const unit = everollUnitSelect.value;

        if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
            everollCalculationResult.textContent = '올바른 값을 입력해주세요.';
            return;
        }

        const widthInMeters = convertToMeters(width, unit);
        const lengthInMeters = convertToMeters(length, unit);

        const areaInSquareMeters = widthInMeters * lengthInMeters;
        const rollSizeInSquareMeters = 1 * 10; // 1m x 10m = 10 m²
        const numberOfRolls = Math.ceil(areaInSquareMeters / rollSizeInSquareMeters);

        everollCalculationResult.textContent = `필요한 에버롤 수량: ${numberOfRolls}개`;
    }

    function convertToMeters(value, unit) {
        switch (unit) {
            case 'm': return value;
            case 'cm': return value / 100;
            case 'mm': return value / 1000;
            case 'km': return value * 1000;
            default: return value;
        }
    }
});

// 입력 필드에 대한 확대 방지
/**************************************
 * 모바일 기기에서 입력 필드 확대를 방지합니다.
 **************************************/
document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.setAttribute('readonly', '');
        setTimeout(function() {
            e.target.removeAttribute('readonly');
        }, 100);
    }
}, true);

// 더블 탭 확대 방지
/**************************************
 * 모바일 기기에서 더블 탭으로 인한 확대를 방지합니다.
 **************************************/
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 파일 입력 필드 설정
/**************************************
 * 파일 입력 필드의 허용 확장자를 설정합니다.
 **************************************/
document.getElementById('fileInput').accept = '.zip';

// 가격 숨기기/보이기 토글 함수
/**************************************
 * 가격 정보를 숨기거나 표시하는 기능을 제공합니다.
 * 현재는 HTML에서 해당 버튼이 제거되어 사용되지 않을 수 있습니다.
 **************************************/
function togglePrices() {
    const unitPriceElements = document.querySelectorAll('td:nth-child(3) input');
    const priceElements = document.querySelectorAll('td:nth-child(5) input');
    const button = document.getElementById('togglePriceButton');

    pricesHidden = !pricesHidden;

    [unitPriceElements, priceElements].forEach(elements => {
        elements.forEach(element => {
            if (pricesHidden) {
                element.setAttribute('data-current-value', element.value);
                element.disabled = true;
                element.value = '';
                element.style.backgroundColor = '#e9ecef';
                element.style.color = '#e9ecef';
            } else {
                element.disabled = false;
                element.value = element.getAttribute('data-current-value');
                element.style.backgroundColor = '';
                element.style.color = '';
            }
        });
    });

    button.textContent = pricesHidden ? '가격 보이기' : '가격 숨기기';
}

// 이미지 파일을 ZIP에 추가하는 함수
/**************************************
 * 이미지 파일을 ZIP 파일에 추가합니다.
 **************************************/
async function downloadImageToZip(zip, imageUrl, fileName) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    zip.file(fileName, blob);
}

// 애니메이션 배경 설정
/**************************************
 * 페이지 배경에 애니메이션 효과를 적용합니다.
 **************************************/
const canvas = document.getElementById('animatedBackground');
const ctx = canvas.getContext('2d');

// 캔버스 크기를 전체 화면으로 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wave = {
    y: canvas.height / 2,
    length: 0.01,
    amplitude: 100,
    frequency: 0.02
};

let increment = wave.frequency;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    // 그리드를 그리면서 물결 모양을 추가
    for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(
            i,
            wave.y + Math.sin(i * wave.length + increment) * wave.amplitude * Math.sin(increment)
        );
    }

    ctx.strokeStyle = '#00ffff';
    ctx.stroke();

    increment += wave.frequency;
    requestAnimationFrame(animate);
}

animate();

// 화면 크기가 변경되면 캔버스 크기 재조정
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    wave.y = canvas.height / 2;
});