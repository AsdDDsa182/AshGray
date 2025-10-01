(function() {
    'use strict';

    // Google Apps Script 배포 URL (사용자 제공)
    const GS_URL = 'https://script.google.com/macros/s/AKfycbxJIGA5Cd4oWuVwGxr30aDjb3Sy_lByNL-7Pbb1TFwk5D0-zb2uvA2pxOWTYff0H6A/exec';
    
    // 로컬 스토리지 키
    const QUOTATION_KEY = 'gofitQuotation';
    
    // 폼 제출 성공 플래그
    let submissionSuccessful = false; 

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
    const inputFields = form.querySelectorAll('input, textarea'); // 모든 입력 필드를 선택

    
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

    // [NEW] iOS 키보드 대응: Focus 시 스크롤 조정
    function setupIOSKeyboardFix() {
        inputFields.forEach(field => {
            field.addEventListener('focus', () => {
                // 키보드가 완전히 올라올 시간을 기다립니다. (200ms)
                setTimeout(() => {
                    // 해당 입력 필드가 뷰포트 중앙에 오도록 부드럽게 스크롤합니다.
                    // 'center'를 사용하면 상단 고정 헤더에 의해 가려지지 않도록 확실하게 위치시킵니다.
                    field.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' // 화면 중앙에 오도록 스크롤
                    });
                }, 200); 
            });
        });
    }

    // [ORIGINAL] 페이지 이탈 경고 설정 함수
    function setupExitWarning() {
        // 1. 브라우저 UI(뒤로가기, 탭 닫기) 경고 설정
        window.addEventListener('beforeunload', (e) => {
            if (!submissionSuccessful) { 
                e.preventDefault();
                e.returnValue = ''; // 표준 경고 활성화
                return '';          // 표준 경고 활성화
            }
        });
        
        // 2. 인페이지 링크(로고) 클릭 시 처리 (수정 없음)
    }
    
    // 폼 유효성 검사 (변경 없음)
    function validateForm(formData) {
        let isValid = true;
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

    // 견적 요약 카드 렌더링 (변경 없음)
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

    // 견적 요청 제출 핸들러 (변경 없음)
    async function handleSubmit(e) {
        e.preventDefault();

        const htmlFormData = new FormData(form);
        const cartData = getCartData();
        const isRental = cartData.type === 'rental';

        if (!validateForm(htmlFormData)) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> 제출 중...';
        
        const fd = new FormData();
        
        // 사용자 입력 필드를 FormData에 추가
        fd.append('이름', htmlFormData.get('이름'));
        fd.append('이메일', htmlFormData.get('이메일'));
        fd.append('전화번호', (htmlFormData.get('전화번호') || '').replace(/-/g, ''));
        fd.append('회사/직장명', htmlFormData.get('회사/직장명'));
        fd.append('문의내용', htmlFormData.get('문의내용'));

        // 견적함 내용 필드를 FormData에 추가
        fd.append('견적유형', isRental ? '렌탈' : '판매');
        fd.append('총금액', summaryTotalPriceEl.textContent); 
        
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
        
        try {
            const response = await fetch(GS_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                body: fd
            });
            
            // 폼 제출 성공 시 플래그 설정
            submissionSuccessful = true; 
            
            localStorage.removeItem(QUOTATION_KEY); 

            resultTitle.textContent = '견적 요청 성공! 🎉';
            resultMessage.innerHTML = '견적 요청이 성공적으로 접수되었습니다.<br>최대한 빠르게 담당자가 기재해 주신 연락처로 안내드리겠습니다.';
            showResultModal();

        } catch (error) {
            console.error('견적 요청 전송 실패:', error);
            
            resultTitle.textContent = '요청 실패';
            resultMessage.innerHTML = '데이터 전송에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.<br>문제가 계속될 경우 1833-3745로 직접 연락 주시기 바랍니다.';
            showResultModal();
        } finally {
            // 실패 시 버튼 복구
            if (!submissionSuccessful) { 
                submitBtn.disabled = false;
                submitBtn.innerHTML = '견적 요청서 최종 제출하기';
            }
        }
    }

    function showResultModal() {
        resultModal.removeAttribute('hidden');
    }

    // 초기화
    function init() {
        const cart = getCartData();
        renderQuoteSummary(cart);
        setupExitWarning(); // 페이지 이탈 경고 설정
        setupIOSKeyboardFix(); // 💡 iOS 키보드 대응 스크롤 설정 추가
        form.addEventListener('submit', handleSubmit);
    }

    // 페이지 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();