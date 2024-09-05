<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <!-- 화면을 이미지로 캡처하기 위한 라이브러리 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
    <title>견적서 작성</title>
    <!-- 외부 스타일시트 연결 -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- 견적서 작성 컨테이너 -->
    <div class="container quote-container">
        <!-- 회사 로고 추가 -->
        <img src="logo.png" alt="회사 로고" class="company-logo">
        <!-- 페이지 제목 -->
        <h1>견적서 작성</h1>

        <!-- 견적 연도와 고객 이름 입력 영역 -->
        <div class="form-row">
            <div>
                <label for="quoteYear">견적 날짜</label>
                <div class="date-inputs">
                    <select id="quoteYear" name="quoteYear"></select>
                    <select id="quoteMonth" name="quoteMonth"></select>
                    <select id="quoteDay" name="quoteDay"></select>
                </div>
            </div>
            <div>
                <label for="customerName">고객 이름</label>
                <input type="text" id="customerName" name="customerName">
            </div>
            <div>
                <label for="writerPhone">견적 작성자 전화번호</label>
                <input type="tel" id="writerPhone" name="writerPhone" placeholder="">
            </div>
        </div>
        
        <!-- 회사 및 제품 선택 영역 -->
        <div class="form-group">
            <!-- 회사 선택 버튼 -->
            <div class="custom-select">
                <button class="select-button" id="companySelectButton">- 회사 선택 -</button>
                <div class="select-options" id="companyOptions">
                    <!-- 회사 선택 초기화 옵션 -->
                    <div onclick="resetCompanySelection()">- 회사 선택 -</div>
                </div>
            </div>
            <!-- 제품 선택 버튼 -->
            <div class="custom-select">
                <button class="select-button" id="productSelectButton" disabled>- 제품 선택 -</button>
                <div class="select-options" id="productOptions">
                    <!-- 제품 선택 초기화 옵션 -->
                    <div onclick="resetProductSelection()">- 제품 선택 -</div>
                </div>
            </div>

            <!-- 제품 추가 버튼 -->
            <button id="addButton" class="action-button" disabled>추가</button>

            <!-- 직접 입력 버튼 추가 -->
            <button id="manualEntryButton" class="action-button">직접 입력</button>
        </div>
    
        <!-- 데이터 테이블 영역 -->
        <div class="table-container">
            <table id="dataTable">
                <thead>
                    <tr>
                        <!-- 테이블 헤더 -->
                        <th>구분</th>
                        <th>제품</th>
                        <th>단가</th>
                        <th>수량</th>
                        <th>가격</th>
                        <th>비고</th>
                        <th>미리보기</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <!-- 총액 계산 영역 -->
        <div id="totalAmountSection" class="total-amount-section">
            <div class="total-row">
                <span>총액 (부가세 별도):</span>
                <span id="totalAmountWithoutVAT"></span>
            </div>
            <div class="total-row">
                <span>부가세 (10%):</span>
                <span id="vatAmount"></span>
            </div>
            <div class="total-row">
                <span>총액 (부가세 포함):</span>
                <span id="totalAmountWithVAT"></span>
            </div>
        </div>

        <!-- 기능 버튼 영역 -->
        <div class="button-container">
            <!-- 가격 숨기기 버튼 -->
            <button id="togglePriceButton" class="action-button">가격 숨기기</button>
            <!-- 엑셀로 내보내기 버튼 -->
            <button id="exportExcelButton" class="action-button">견적서 내보내기</button>
            <!-- 새로운 파일 업로드 입력 필드와 버튼 추가 -->
            <input type="file" id="fileInput" accept=".zip" style="display: none;">
            <button id="loadExcelButton">견적서 불러오기 (ZIP)</button>
        </div>

        <div id="imageModal" class="modal">
            <div class="modal-overlay">
                <div class="modal-container">
                    <span class="close">&times;</span>
                    <div class="modal-content">
                        <img id="modalImage" src="" alt="제품 이미지">
                        <div id="modalProductName"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 새로운 별도 컨테이너: 고무블럭 수량 계산기 -->
    <div class="container rubber-block-calculator">
        <h2>고무블럭 수량 계산기</h2>
        <p>고무블럭 크기: 500mm x 500mm</p>
        <div class="calculator-inputs">
            <div>
                <label for="areaWidth">너비:</label>
                <input type="number" id="areaWidth" min="0" step="0.1">
            </div>
            <div>
                <label for="areaLength">길이:</label>
                <input type="number" id="areaLength" min="0" step="0.1">
            </div>
            <div>
                <label for="unitSelect">단위:</label>
                <select id="unitSelect">
                    <option value="m">m(미터)</option>
                    <option value="cm">cm(센티미터)</option>
                    <option value="mm">mm(밀리미터)</option>
                    <option value="km">km(키로미터)</option>
                </select>
            </div>
        </div>
        <button id="calculateBlocks" class="action-button">계산하기</button>
        <div id="calculationResult" class="calculation-result"></div>
    </div>

    <!-- 새로운 에버롤 수량 계산기 -->
    <div class="container everoll-calculator">
        <h2>에버롤 수량 계산기</h2>
        <p>에버롤 크기: 1롤 (너비 1m x 길이 10m)</p>
        <div class="calculator-inputs">
            <div>
                <label for="everollAreaWidth">너비:</label>
                <input type="number" id="everollAreaWidth" min="0" step="0.1">
            </div>
            <div>
                <label for="everollAreaLength">길이:</label>
                <input type="number" id="everollAreaLength" min="0" step="0.1">
            </div>
            <div>
                <label for="everollUnitSelect">단위:</label>
                <select id="everollUnitSelect">
                    <option value="m">m(미터)</option>
                    <option value="cm">cm(센티미터)</option>
                    <option value="mm">mm(밀리미터)</option>
                    <option value="km">km(키로미터)</option>
                </select>
            </div>
        </div>
        <button id="calculateEveroll" class="action-button">계산하기</button>
        <div id="everollCalculationResult" class="calculation-result"></div>
    </div>

    <!-- 엑셀 파일 생성 및 PDF 출력 라이브러리 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <!-- 사용자 정의 스크립트 파일 -->
    <script src="scripts.js"></script>
</body>
</html>
