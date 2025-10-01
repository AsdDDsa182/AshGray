(function() {
    'use strict';

    // Google Apps Script 배포 URL (사용자 제공)
    // 이 URL은 FormData 기반의 e.parameter 수신을 기대합니다.
    const GS_URL = 'https://script.google.com/macros/s/AKfycbxJIGA5Cd4oWuVwGxr30aDjb3Sy_lByNL-7Pbb1TFwk5D0-zb2uvA2pxOWTYff0H6A/exec';
    
    // 로컬 스토리지 키
    const QUOTATION_KEY = 'gofitQuotation';
    
    // DOM 참조
    const form = document.getElementById('quotationForm');
    const submitBtn = document.getElementById('submitQuoteBtn');
    const summaryList = document.getElementById('quoteSummaryList');
    const summaryTypeEl = document.getElementById('quoteSummaryType');
    const summaryTotalLabelEl = document.getElementById('summaryTotalLabel');
    const summaryTotalPriceEl = document.getElementById('summaryTotalPrice');
    const resultModal = document.getElementById('resultModalOverlay');
    const resultTitle = document.getElementById('resultModalTitle');
    const resultMessage = document.getElementById('resultModalMessage');
    
    // 유틸리티 함수
    const fmtKRW = n => new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(n);
    
    // 견적함 데이터 로드
    function getCartData() {
        try {
            const data = localStorage.getItem(QUOTATION_KEY);
            return JSON.parse(data) || { items: [], type: null };
        } catch (e) {
            return { items: [], type: null };
        }
    }

    // 폼 유효성 검사
    function validateForm(formData) {
        let isValid = true;

        // 폼 요소의 ID와 일치하도록 매핑을 사용합니다.
        const requiredFields = [
            { key: '이름', id: 'name' },
            { key: '이메일', id: 'email' },
            { key: '전화번호', id: 'phone' }
        ];
        
        requiredFields.forEach(fieldInfo => {
            const key = fieldInfo.key;
            const id = fieldInfo.id;
            
            const field = document.getElementById(id); 
            const value = formData.get(key); 
            
            if (!field) {
                // 이 에러는 HTML 구조 문제이므로 사용자에게는 안 보이지만 로그에는 남깁니다.
                console.error(`Error: Required field element with ID '${id}' not found in the DOM.`);
                isValid = false;
                return;
            }

            const parent = field.closest('.form-group');
            
            parent.classList.remove('error');
            
            if (!value.trim()) {
                parent.classList.add('error');
                let msgEl = parent.querySelector('.error-message');
                if (!msgEl) {
                    msgEl = document.createElement('p');
                    msgEl.className = 'error-message';
                    parent.appendChild(msgEl);
                }
                msgEl.textContent = `${key}은(는) 필수 입력 항목입니다.`;
                isValid = false;
            } else if (key === '이메일' && !/\S+@\S+\.\S+/.test(value)) {
                parent.classList.add('error');
                let msgEl = parent.querySelector('.error-message');
                if (!msgEl) {
                    msgEl = document.createElement('p');
                    msgEl.className = 'error-message';
                    parent.appendChild(msgEl);
                }
                msgEl.textContent = '유효한 이메일 형식이 아닙니다.';
                isValid = false;
            } else if (key === '전화번호' && !/^\d{10,11}$/.test(value.replace(/-/g, ''))) {
                parent.classList.add('error');
                let msgEl = parent.querySelector('.error-message');
                if (!msgEl) {
                    msgEl = document.createElement('p');
                    msgEl.className = 'error-message';
                    parent.appendChild(msgEl);
                }
                msgEl.textContent = '전화번호는 하이픈 없이 10~11자리 숫자로 입력해 주세요.';
                isValid = false;
            }
        });

        return isValid;
    }

    // 견적 요약 카드 렌더링
    function renderQuoteSummary(cart) {
        if (cart.items.length === 0) {
            window.location.href = '../index.html';
            return;
        }

        const isRental = cart.type === 'rental';
        summaryTypeEl.textContent = isRental ? '렌탈 견적' : '판매 견적';
        
        let totalPrice = 0;
        
        const listHTML = cart.items.map(item => {
            const itemPrice = isRental ? item.price : Math.round(item.price * 1.1); 
            const subtotal = itemPrice * item.quantity;
            totalPrice += subtotal;
            
            const priceLabel = isRental ? `월 ${fmtKRW(itemPrice)}` : fmtKRW(itemPrice);
            
            return `
                <li>
                    <span class="item-info">${item.name} (${item.quantity}개)</span>
                    <span class="item-price">${priceLabel}</span>
                </li>
            `;
        }).join('');
        
        summaryList.innerHTML = listHTML;
        
        summaryTotalLabelEl.textContent = isRental ? '월 렌탈료 합계 (VAT 포함):' : '총 구매 금액 합계 (VAT 포함):';
        summaryTotalPriceEl.textContent = fmtKRW(totalPrice) + '원';
    }

    // 견적 요청 제출 핸들러
    async function handleSubmit(e) {
        e.preventDefault();

        // HTML 폼의 데이터를 가져옵니다.
        const htmlFormData = new FormData(form);
        const cartData = getCartData();
        const isRental = cartData.type === 'rental';

        if (!validateForm(htmlFormData)) {
            return;
        }

        // 버튼 비활성화 및 로딩 상태 표시
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> 제출 중...';
        
        // 1. Google Apps Script 표준 수신 방식(e.parameter)에 맞게 FormData를 재구성합니다.
        //    이 과정에서 견적 정보를 추가합니다.
        const fd = new FormData();
        
        // 1-1. 사용자 입력 필드를 FormData에 추가 (HTML name 속성 사용)
        fd.append('이름', htmlFormData.get('이름'));
        fd.append('이메일', htmlFormData.get('이메일'));
        // 전화번호는 하이픈 제거 후 추가
        fd.append('전화번호', (htmlFormData.get('전화번호') || '').replace(/-/g, ''));
        fd.append('회사/직장명', htmlFormData.get('회사/직장명'));
        fd.append('문의내용', htmlFormData.get('문의내용'));

        // 1-2. 견적함 내용 필드를 FormData에 추가 (Apps Script가 읽을 수 있는 키로)
        fd.append('견적유형', isRental ? '렌탈' : '판매');
        fd.append('총금액', summaryTotalPriceEl.textContent); // 렌더링된 총 금액 사용
        
        // 상세 견적 목록 생성 (Apps Script에서 파싱할 수 있도록 JSON 문자열로)
        const detailedItems = cartData.items.map(item => {
            const priceType = isRental ? '월 렌탈료' : '판매가(VAT포함)';
            const itemPrice = isRental ? item.price : Math.round(item.price * 1.1);
            return {
                제품명: item.name,
                수량: item.quantity,
                가격유형: priceType,
                단가: fmtKRW(itemPrice),
                합계: fmtKRW(itemPrice * item.quantity)
            };
        });
        
        fd.append('상세견적목록', JSON.stringify(detailedItems));
        
        // 2. Apps Script로 전송 (FormData 방식 - JSON 헤더 필요 없음)
        try {
            const response = await fetch(GS_URL, {
                method: 'POST',
                mode: 'no-cors', // 필수
                cache: 'no-cache',
                body: fd // 🔥 FormData를 body에 직접 전달
            });
            
            // no-cors에서는 성공 응답을 직접 확인할 수 없으므로,
            // 에러가 발생하지 않았다면 성공으로 간주하고 처리합니다.

            // 3. 성공 처리
            localStorage.removeItem(QUOTATION_KEY); 

            resultTitle.textContent = '견적 요청 성공! 🎉';
            resultMessage.innerHTML = '견적 요청이 성공적으로 접수되었습니다.<br>최대한 빠르게 담당자가 기재해 주신 연락처로 안내드리겠습니다.';
            showResultModal();

        } catch (error) {
            console.error('견적 요청 전송 실패:', error);
            // 4. 실패 처리
            resultTitle.textContent = '요청 실패';
            resultMessage.innerHTML = '데이터 전송에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.<br>문제가 계속될 경우 1833-3745로 직접 연락 주시기 바랍니다.';
            showResultModal();
        } finally {
            // 버튼 상태 복구
            submitBtn.disabled = false;
            submitBtn.innerHTML = '견적 요청서 최종 제출하기';
        }
    }

    function showResultModal() {
        resultModal.removeAttribute('hidden');
    }

    // 초기화
    function init() {
        const cart = getCartData();
        renderQuoteSummary(cart);
        form.addEventListener('submit', handleSubmit);
    }

    // 페이지 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();