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

    // ========================================================================
    // [ ✨ NEW ] 모바일 가상 키보드 문제 해결을 위한 핸들러 추가
    // ========================================================================
    function setupKeyboardHandlers() {
        // 키보드를 활성화시키는 모든 입력 요소를 선택합니다.
        const formInputs = document.querySelectorAll(
            '.contact-form input[type="text"], .contact-form input[type="email"], .contact-form input[type="tel"], .contact-form textarea'
        );

        // 입력창에 포커스가 갔을 때 (터치했을 때) 실행되는 함수
        const handleFocus = (e) => {
            // 1. 입력창 가림 문제 해결:
            // 키보드 애니메이션이 끝난 후, 해당 입력창이 화면 중앙에 오도록 부드럽게 스크롤합니다.
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300); // 0.3초의 지연 시간은 키보드가 완전히 올라오는 것을 기다리기 위함입니다.
        };

        // 입력창에서 포커스가 벗어났을 때 (입력 완료 후 다른 곳 터치 시) 실행되는 함수
        const handleBlur = () => {
            // 2. 헤더 이탈 문제 해결:
            // 키보드가 사라지면서 발생하는 iOS의 렌더링 버그를 바로잡기 위해,
            // 현재 스크롤 위치로 다시 스크롤하라는 명령을 내려 화면을 강제로 갱신합니다.
            setTimeout(() => {
                window.scrollTo(window.scrollX, window.scrollY);
            }, 10); // 아주 짧은 지연 후 실행하여 안정성을 높입니다.
        };

        // 각 입력 요소에 'focus'와 'blur' 이벤트 리스너를 추가합니다.
        formInputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });
    }

    // [MODIFIED] 페이지 이탈 경고 설정 함수
    function setupExitWarning() {
        window.addEventListener('beforeunload', (e) => {
            if (!submissionSuccessful) { 
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
    }
    
    // 폼 유효성 검사
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
        summaryTotalPriceEl.textContent = fmtKRW(totalPrice);
    }

    // 견적 요청 제출 핸들러
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
        fd.append('이름', htmlFormData.get('이름'));
        fd.append('이메일', htmlFormData.get('이메일'));
        fd.append('전화번호', (htmlFormData.get('전화번호') || '').replace(/-/g, ''));
        fd.append('회사/직장명', htmlFormData.get('회사/직장명'));
        fd.append('문의내용', htmlFormData.get('문의내용'));
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
        setupExitWarning();
        setupKeyboardHandlers(); // [ ✨ MODIFIED ] 페이지 초기화 시 키보드 핸들러를 실행합니다.
        form.addEventListener('submit', handleSubmit);
    }

    // 페이지 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();