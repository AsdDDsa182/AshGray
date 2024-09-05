// 전역 변수 선언
let companies = {}; // 회사와 제품 정보를 저장할 객체
let productCount = 0; // 테이블에 추가된 제품의 개수를 추적
let pricesHidden = false; // 가격 숨김 여부를 추적
let selectedCompany = ''; // 선택된 회사 이름
let selectedProduct = ''; // 선택된 제품 이름
let imageDataStore = {};

// 페이지 초기화 함수
async function init() {
    initDateFields(); // 날짜 필드 초기화
    await loadCompaniesAndProducts(); // 회사 및 제품 데이터 로드
    setupEventListeners(); // 이벤트 리스너 설정
    setupModalEvents(); // 모달 이벤트 설정
    updateTotalAmountVisibility(); // 페이지 로드 시 총액 섹션의 표시 여부 초기화
    console.log("초기화 완료");
}

// 총액 섹션의 표시 여부를 업데이트하는 함수
function updateTotalAmountVisibility() {
    const tableBody = document.querySelector('#dataTable tbody');
    const totalAmountSection = document.getElementById('totalAmountSection');

    // 테이블에 행이 있는지 확인
    if (tableBody.children.length === 0) {
        totalAmountSection.style.display = 'none'; // 행이 없으면 총액 섹션 숨김
    } else {
        totalAmountSection.style.display = 'block'; // 행이 있으면 총액 섹션 보이기
    }
}

// 날짜 필드 초기화 함수
function initDateFields() {
    const yearSelect = document.getElementById('quoteYear');
    const monthSelect = document.getElementById('quoteMonth');
    const daySelect = document.getElementById('quoteDay');

    const currentYear = new Date().getFullYear();

    // 연도 옵션 추가
    for (let year = currentYear; year >= currentYear - 100; year--) {
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

    // 초기 일 옵션 설정
    updateDays();
}

// GitHub 이미지 URL을 raw 콘텐츠 URL로 변환하는 함수
function processGitHubImageUrl(url) {
    console.log("처리 전 URL:", url); // 디버깅용
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
function setupEventListeners() {
    document.getElementById('companySelectButton').addEventListener('click', toggleCompanyOptions);
    document.getElementById('productSelectButton').addEventListener('click', toggleProductOptions);
    document.getElementById('addButton').addEventListener('click', addTableRow);
    document.getElementById('exportExcelButton').addEventListener('click', exportToExcel);
    document.getElementById('togglePriceButton').addEventListener('click', togglePrices);
    document.getElementById('loadExcelButton').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', loadZipFile);
    document.getElementById('manualEntryButton').addEventListener('click', addManualEntryRow);
    document.querySelector('#dataTable tbody').addEventListener('input', () => {
        updateTotalAmount();
        updateTotalAmountVisibility(); // 총액 섹션의 표시 여부를 업데이트
    });
}

// 회사 선택 옵션 토글 함수
function toggleCompanyOptions() {
    const companyOptions = document.getElementById('companyOptions');
    const productOptions = document.getElementById('productOptions');
    
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
    
    if (productOptions.style.display === 'block') {
        productOptions.style.display = 'none';
    } else {
        productOptions.style.display = 'block';
        companyOptions.style.display = 'none';
    }
}

// 회사 선택 함수
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

// 제품이 이미 추가되었는지 확인하는 함수
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
function updateProductDropdown() {
    if (selectedCompany) {
        selectCompany(selectedCompany);
    }
}

// 제품 선택 시 처리 함수
function selectProduct(product) {
    selectedProduct = product;
    document.getElementById('productSelectButton').textContent = product;
    document.getElementById('productOptions').style.display = 'none';
    document.getElementById('addButton').disabled = false;
    document.getElementById('addButton').style.cursor = '';
}

// 회사 선택 초기화 함수
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
function resetProductSelection() {
    selectedProduct = '';
    document.getElementById('productSelectButton').textContent = '- 제품 선택 -';
    document.getElementById('productOptions').style.display = 'none';
    document.getElementById('addButton').disabled = true;
    document.getElementById('addButton').style.cursor = 'not-allowed';
}

// 제품 추가 함수
function addTableRow() {
    const productName = selectedProduct;
    const productInfo = companies[selectedCompany][selectedProduct];
    console.log("선택된 제품 정보:", productInfo);
    const tableBody = document.querySelector('#dataTable tbody');

    const existingRow = findExistingProductRow(productName);

    if (existingRow) {
        updateExistingRow(existingRow);
    } else {
        addNewRow(tableBody, productName, productInfo.price, productInfo.imageUrl);
    }

    resetProductSelection();
    updateProductCount();
    updateProductDropdown();
    updateTotalAmount(); // 총액 업데이트 함수 호출
    updateTotalAmountVisibility(); // 총액 섹션의 표시 여부를 업데이트
}

// 기존 제품 행 찾기
function findExistingProductRow(productName) {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    for (let row of rows) {
        if (row.cells[1].querySelector('input').value === productName) {
            return row;
        }
    }
    return null;
}

// 기존 행 업데이트
function updateExistingRow(row) {
    const quantityInput = row.cells[3].querySelector('input');
    const currentQuantity = parseInt(quantityInput.value) || 0;
    quantityInput.value = currentQuantity + 1;
    updatePriceFromUnitPrice(row);
}

// 새 행 추가 함수
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

        const indexCell = newRow.insertCell(0);
        indexCell.textContent = ++productCount;

        const productCell = newRow.insertCell(1);
        const productInput = document.createElement('input');
        productInput.type = 'text';
        productInput.value = productName;
        productInput.className = 'product-cell';
        productCell.appendChild(productInput);

        const unitPriceCell = newRow.insertCell(2);
        const unitPriceInput = document.createElement('input');
        unitPriceInput.type = 'text';
        unitPriceInput.value = formatNumber(productInfo.price);
        unitPriceInput.className = 'price-cell';
        unitPriceInput.oninput = function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            this.value = formatNumber(this.value.replace(/,/g, ''));
            updatePriceFromUnitPrice(newRow);
        };
        unitPriceCell.appendChild(unitPriceInput);

        const quantityCell = newRow.insertCell(3);
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '0';
        quantityInput.value = '1';
        quantityInput.oninput = function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            updatePriceFromUnitPrice(newRow);
        };
        quantityCell.appendChild(quantityInput);

        const priceCell = newRow.insertCell(4);
        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.value = formatNumber(productInfo.price);
        priceInput.className = 'price-cell';
        priceInput.oninput = function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            this.value = formatNumber(this.value.replace(/,/g, ''));
        };
        priceCell.appendChild(priceInput);

        const noteCell = newRow.insertCell(5);
        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.placeholder = '    ';
        noteCell.appendChild(noteInput);

        const previewCell = newRow.insertCell(6);
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'preview-buttons';

        const buttonRow = document.createElement('div');
        buttonRow.className = 'button-row';

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.className = 'increase-button';
        buttonRow.appendChild(increaseButton);

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.className = 'decrease-button';
        buttonRow.appendChild(decreaseButton);

        const previewButton = document.createElement('button');
        previewButton.textContent = '미리보기';
        previewButton.className = 'preview-button';

        let currentImageUrl = productInfo.imageUrl || '';
        newRow.setAttribute('data-image-url', currentImageUrl);

        if (currentImageUrl) {
            previewButton.onclick = function () {
                showImagePreview(currentImageUrl, productName);
            };
            previewButton.disabled = false;
        } else {
            previewButton.disabled = true;
        }

        buttonContainer.appendChild(buttonRow);
        buttonContainer.appendChild(previewButton);
        previewCell.appendChild(buttonContainer);

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
                        newRow.setAttribute('data-image-key', imageKey);
                        previewButton.onclick = () => showImagePreview(imageUrl, productName);
                        previewButton.disabled = false;
                        newRow.setAttribute('data-image-url', imageUrl);
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        };

        decreaseButton.onclick = function() {
            currentImageUrl = '';
            previewButton.onclick = null;
            previewButton.disabled = true;
            newRow.removeAttribute('data-image-url');
            newRow.removeAttribute('data-image-key');
        };

        const deleteCell = newRow.insertCell(7);
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
        deleteCell.appendChild(deleteButton);

        if (pricesHidden) {
            unitPriceInput.disabled = true;
            priceInput.disabled = true;
            unitPriceInput.value = '';
            priceInput.value = '';
        }
    }

    resetProductSelection();
    updateProductCount();
    updateProductDropdown();
    updateTotalAmount();
    updateTotalAmountVisibility();
}

updateTotalAmount();


function addManualEntryRow() {
    const tableBody = document.querySelector('#dataTable tbody');
    const newRow = tableBody.insertRow();

    const indexCell = newRow.insertCell(0);
    indexCell.textContent = ++productCount;

    const productCell = newRow.insertCell(1);
    const productInput = document.createElement('input');
    productInput.type = 'text';
    productInput.className = 'product-cell';
    productInput.placeholder = '    ';
    productCell.appendChild(productInput);

    const unitPriceCell = newRow.insertCell(2);
    const unitPriceInput = document.createElement('input');
    unitPriceInput.type = 'text';
    unitPriceInput.className = 'price-cell';
    unitPriceInput.placeholder = '    ';
    unitPriceInput.oninput = function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        this.value = formatNumber(this.value.replace(/,/g, ''));
        updatePriceFromUnitPrice(newRow);
        updateTotalAmount();
    };
    unitPriceCell.appendChild(unitPriceInput);

    const quantityCell = newRow.insertCell(3);
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '0';
    quantityInput.placeholder = '    ';
    quantityInput.oninput = function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        updatePriceFromUnitPrice(newRow);
        updateTotalAmount();
    };
    quantityCell.appendChild(quantityInput);

    const priceCell = newRow.insertCell(4);
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.className = 'price-cell';
    priceInput.placeholder = '    ';
    priceInput.oninput = function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        this.value = formatNumber(this.value.replace(/,/g, ''));
        updateTotalAmount();
    };
    priceCell.appendChild(priceInput);

    const noteCell = newRow.insertCell(5);
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.placeholder = '    ';
    noteCell.appendChild(noteInput);

    const previewCell = newRow.insertCell(6);
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'preview-buttons';

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.className = 'increase-button';
    buttonRow.appendChild(increaseButton);

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.className = 'decrease-button';
    buttonRow.appendChild(decreaseButton);

    const previewButton = document.createElement('button');
    previewButton.textContent = '미리보기';
    previewButton.className = 'preview-button';
    previewButton.disabled = true;

    buttonContainer.appendChild(buttonRow);
    buttonContainer.appendChild(previewButton);
    previewCell.appendChild(buttonContainer);

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
                    newRow.setAttribute('data-image-key', imageKey);
                    previewButton.onclick = () => showImagePreview(imageUrl, productInput.value);
                    previewButton.disabled = false;
                    newRow.setAttribute('data-image-url', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    decreaseButton.onclick = function() {
        newRow.removeAttribute('data-image-url');
        newRow.removeAttribute('data-image-key');
        previewButton.onclick = null;
        previewButton.disabled = true;
    };

    const deleteCell = newRow.insertCell(7);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        tableBody.removeChild(newRow);
        updateProductCount();
        updateTotalAmount();
        updateTotalAmountVisibility();
    };
    deleteCell.appendChild(deleteButton);

    if (pricesHidden) {
        unitPriceInput.disabled = true;
        priceInput.disabled = true;
    }

    updateTotalAmountVisibility();
}


updateTotalAmount();

// 모달 관련 코드 수정
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
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
}

// 모달 이벤트 설정 함수
function setupModalEvents() {
    const modal = document.getElementById('imageModal');
    const span = document.getElementsByClassName("close")[0];
    
    // 닫기 버튼 클릭 시 모달 닫기
    span.onclick = closeModal;

    // 모달 외부 클릭 시 모달 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

// 제품 개수 업데이트 함수
function updateProductCount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    productCount = 0;
    rows.forEach((row, index) => {
        row.cells[0].textContent = ++productCount;
    });
}

// 단가 및 수량에 따라 가격을 업데이트하는 함수
function updatePriceFromUnitPrice(row) {
    const unitPrice = parseFloat(row.cells[2].querySelector('input').value.replace(/,/g, '')) || 0;
    const quantity = parseInt(row.cells[3].querySelector('input').value) || 0;
    const priceInput = row.cells[4].querySelector('input');

    const totalPrice = unitPrice * quantity;
    priceInput.value = formatNumber(totalPrice);
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

    pricesHidden = !pricesHidden;

    unitPriceElements.forEach(element => {
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

    priceElements.forEach(element => {
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

    button.textContent = pricesHidden ? '가격 보이기' : '가격 숨기기';
}

// 이미지 파일을 ZIP에 추가하는 함수
async function downloadImageToZip(zip, imageUrl, fileName) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    zip.file(fileName, blob);
}

// 견적서로 내보내기 함수
async function exportToExcel() {
    try {
        const zip = new JSZip();

        const response = await fetch('/inqury.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        const tableRows = document.querySelectorAll('#dataTable tbody tr');
        const startRow = 18;
        const endRow = 150;

        worksheet.columns.forEach((column, index) => {
            const col = worksheet.getColumn(index + 1);
            if (col.width) {
                column.width = col.width;
            }
        });

        const quoteDate = `${document.getElementById('quoteYear').value}-${document.getElementById('quoteMonth').value}-${document.getElementById('quoteDay').value}`;
        worksheet.getCell('A3').value = quoteDate;

        const customerName = document.getElementById('customerName').value;
        worksheet.getCell('A4').value = customerName;

        const writerPhone = document.getElementById('writerPhone').value;
        worksheet.getCell('H7').value = writerPhone;

        let totalAmount = 0;

        const imagePromises = [];

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

            ['A', 'C', 'F', 'H', 'I', 'K'].forEach(col => {
                worksheet.getCell(`${col}${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
            });

            const imageKey = row.getAttribute('data-image-key');
            if (imageKey && imageDataStore[imageKey]) {
                const imageInfo = imageDataStore[imageKey];
                const imagePromise = fetch(imageInfo.data)
                    .then(res => res.blob())
                    .then(blob => {
                        zip.file(imageInfo.name, blob, {binary: true});
                    });
                imagePromises.push(imagePromise);
            }
        });

        await Promise.all(imagePromises);

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

        const excelBuffer = await workbook.xlsx.writeBuffer();
        zip.file(`${customerName || '일반'}_고객_견적서.xlsx`, excelBuffer);

        zip.generateAsync({ type: 'blob' }).then(function (content) {
            const zipFileName = `${customerName || '일반'}_고객_자료.zip`;
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
async function loadZipFile(event) {
    try {
        const fileInput = event.target;
        const file = fileInput.files[0];
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

                // 견적 날짜 설정
                const dateCell = worksheet.getCell('A3').value;
                if (dateCell) {
                    const [year, month, day] = dateCell.split('-');
                    document.getElementById('quoteYear').value = year;
                    document.getElementById('quoteMonth').value = month;
                    document.getElementById('quoteDay').value = day;
                }

                // 고객 이름 설정
                const customerName = worksheet.getCell('A4').value;
                if (customerName) {
                    document.getElementById('customerName').value = customerName;
                }

                // 전화번호 설정
                const writerPhone = worksheet.getCell('H7').value;
                if (writerPhone) {
                    document.getElementById('writerPhone').value = writerPhone;
                }

                // 기존 테이블 내용 삭제
                const tableBody = document.querySelector('#dataTable tbody');
                tableBody.innerHTML = '';

                // 제품 데이터 추가
                for (let rowNumber = 18; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const row = worksheet.getRow(rowNumber);
                    if (!row.getCell(1).value) break;  // 빈 행이면 중단

                    const newRow = tableBody.insertRow();
                    
                    // 구분(번호) 추가
                    newRow.insertCell(0).textContent = row.getCell(1).value;

                    // 제품명 입력 필드
                    const productInput = document.createElement('input');
                    productInput.type = 'text';
                    productInput.value = row.getCell(3).value;
                    productInput.className = 'product-cell';
                    newRow.insertCell(1).appendChild(productInput);

                    // 단가 입력 필드
                    const unitPriceInput = document.createElement('input');
                    unitPriceInput.type = 'text';
                    unitPriceInput.value = formatNumber(row.getCell(6).value);
                    unitPriceInput.className = 'price-cell';
                    unitPriceInput.oninput = function() {
                        this.value = formatNumber(this.value.replace(/[^0-9]/g, ''));
                        updatePriceFromUnitPrice(newRow);
                    };
                    newRow.insertCell(2).appendChild(unitPriceInput);

                    // 수량 입력 필드
                    const quantityInput = document.createElement('input');
                    quantityInput.type = 'number';
                    quantityInput.value = row.getCell(8).value;
                    quantityInput.oninput = function() {
                        updatePriceFromUnitPrice(newRow);
                    };
                    newRow.insertCell(3).appendChild(quantityInput);

                    // 가격 입력 필드
                    const priceInput = document.createElement('input');
                    priceInput.type = 'text';
                    priceInput.value = formatNumber(row.getCell(9).value);
                    priceInput.className = 'price-cell';
                    priceInput.oninput = function() {
                        this.value = formatNumber(this.value.replace(/[^0-9]/g, ''));
                    };
                    newRow.insertCell(4).appendChild(priceInput);

                    // 비고 입력 필드
                    const noteInput = document.createElement('input');
                    noteInput.type = 'text';
                    noteInput.value = row.getCell(11).value;
                    newRow.insertCell(5).appendChild(noteInput);

                    // 이미지 미리보기 버튼 추가
                    const previewCell = newRow.insertCell(6);
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'preview-buttons';

                    const buttonRow = document.createElement('div');
                    buttonRow.className = 'button-row';

                    const increaseButton = document.createElement('button');
                    increaseButton.textContent = '+';
                    increaseButton.className = 'increase-button';
                    buttonRow.appendChild(increaseButton);

                    const decreaseButton = document.createElement('button');
                    decreaseButton.textContent = '-';
                    decreaseButton.className = 'decrease-button';
                    buttonRow.appendChild(decreaseButton);

                    const previewButton = document.createElement('button');
                    previewButton.textContent = '미리보기';
                    previewButton.className = 'preview-button';
                    previewButton.disabled = true;

                    buttonContainer.appendChild(buttonRow);
                    buttonContainer.appendChild(previewButton);
                    previewCell.appendChild(buttonContainer);

                    // 이미지 파일 찾기 및 설정
                    const productName = productInput.value;
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
                                newRow.setAttribute('data-image-url', imageUrl);
                                previewButton.disabled = false;
                                previewButton.onclick = () => showImagePreview(imageUrl, productName);
                            } catch (imageError) {
                                console.error('이미지 처리 중 오류:', imageError);
                            }
                        }
                    }

                    // + 버튼 클릭 시 이미지 업로드
                    increaseButton.onclick = function() {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = function(event) {
                            const file = event.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    const imageUrl = e.target.result;
                                    newRow.setAttribute('data-image-url', imageUrl);
                                    previewButton.disabled = false;
                                    previewButton.onclick = () => showImagePreview(imageUrl, productName);
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        fileInput.click();
                    };

                    // - 버튼 클릭 시 이미지 삭제
                    decreaseButton.onclick = function() {
                        newRow.removeAttribute('data-image-url');
                        previewButton.disabled = true;
                        previewButton.onclick = null;
                    };

                    // 삭제 버튼 추가
                    const deleteCell = newRow.insertCell(7);
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '삭제';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = function() {
                        tableBody.removeChild(newRow);
                        updateProductCount();
                        updateTotalAmount(); // 총액 업데이트 함수 호출
                        updateTotalAmountVisibility(); // 총액 섹션의 표시 여부를 업데이트
                    };
                    deleteCell.appendChild(deleteButton);
                }

                updateProductCount();
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
        fileInput.value = '';
    } catch (error) {
        console.error('ZIP 파일 로드 중 오류 발생:', error);
        alert('ZIP 파일을 로드하는 중 오류가 발생했습니다.');
    }
}

// 이벤트 리스너 설정 함수 내부 또는 다른 적절한 위치에서
document.getElementById('fileInput').accept = '.zip';

// 입력 필드에 대한 확대 방지
document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.setAttribute('readonly', '');
        setTimeout(function() {
            e.target.removeAttribute('readonly');
        }, 100);
    }
}, true);

// 더블 탭 확대 방지
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 페이지 로드 시 초기화 함수 호출
window.onload = init;

// 고무블럭 수량 계산기 기능
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

// 기존 코드 유지

// 에버롤 수량 계산기 기능
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateBlocks');
    const areaWidthInput = document.getElementById('areaWidth');
    const areaLengthInput = document.getElementById('areaLength');
    const unitSelect = document.getElementById('unitSelect');
    const calculationResult = document.getElementById('calculationResult');

    const calculateEverollButton = document.getElementById('calculateEveroll');
    const everollAreaWidthInput = document.getElementById('everollAreaWidth');
    const everollAreaLengthInput = document.getElementById('everollAreaLength');
    const everollUnitSelect = document.getElementById('everollUnitSelect');
    const everollCalculationResult = document.getElementById('everollCalculationResult');

    calculateButton.addEventListener('click', calculateRubberBlocks);
    calculateEverollButton.addEventListener('click', calculateEverollRolls);

    function calculateRubberBlocks() {
        // 기존 고무블럭 계산 로직 유지
    }

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
}

function findExistingProductRow(productName) {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    for (let row of rows) {
        if (row.cells[1].querySelector('input').value === productName) {
            return row;
        }
    }
    return null;
}
