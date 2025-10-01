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
    // 👇 키보드 높이만큼 패딩을 줄 주 컨테이너 (main 태그)
    const mainContent = document.querySelector('main.wrap'); 
    
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

    // [MODIFIED] 페이지 이탈 경고 설정 함수
    function setupExitWarning() {
        
        // 1. 브라우저 UI(뒤로가기, 탭 닫기) 경고 설정
        window.addEventListener('beforeunload', (e) => {
            if (!submissionSuccessful) { 
                e.preventDefault();
                e.returnValue = ''; // 표준 경고 활성화 (커스텀 메시지 없음)
                return '';          // 표준 경고 활성화 (커스텀 메시지 없음)
            }
        });
        
        // 2. 인페이지 링크(로고) 클릭 시 처리 (수정 없음)
    }
    
    // 💡 [NEW/MODIFIED] visualViewport를 이용한 키보드 높이 동적 패딩 조정
    function setupVisualViewportFix() {
        if (!window.visualViewport || !mainContent) return; // 지원하지 않거나 요소가 없으면 종료
        
        // 키보드 등장/사라짐에 따라 뷰포트 크기가 바뀔 때마다 실행
        window.visualViewport.addEventListener('resize', () => {
            const viewport = window.visualViewport;
            const originalHeight = window.innerHeight; // 초기 뷰포트 높이 (iOS에서는 주소창 포함)
            const currentHeight = viewport.height;    // 키보드가 나타난 후의 뷰포트 높이
            
            // 키보드가 올라와서 뷰포트 높이가 줄어든 경우 (차이가 50px 이상일 때 키보드로 간주)
            if (originalHeight - currentHeight > 50) {
                // 키보드가 차지하는 픽셀 높이를 계산
                const keyboardHeight = originalHeight - currentHeight;
                
                // main 컨텐츠에 키보드 높이만큼 하단 패딩을 추가하여 밀어 올릴 공간을 만듭니다.
                // 여기에 약간의 여백(20px)을 더해 입력 필드가 키보드와 너무 붙지 않게 합니다.
                mainContent.style.paddingBottom = `${keyboardHeight + 20}px`;
                
                // 💡 [추가] 키보드 등장 시 해당 필드가 중앙에 오도록 스크롤 (safari의 자동 스크롤이 실패하는 경우 보조)
                // 현재 포커스된 입력 필드를 찾습니다.
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    // 키보드가 올라온 후 스크롤이 적용되도록 약간의 지연 시간을 줍니다.
                    setTimeout(() => {
                        // 'start'로 스크롤하면 헤더 바로 밑에 입력 필드가 위치하므로, 키보드 때문에 가려지지 않습니다.
                        activeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50); 
                }
            } else {
                // 키보드가 사라진 경우: 하단 패딩을 원래대로 (0px) 복구합니다.
                mainContent.style.paddingBottom = '0';
            }
        });
    }

    // 폼 유효성 검사 (이전 코드와 동일)
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

    // 견적 요약 카드 렌더링 (이전 코드와 동일)
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

    // 견적 요청 제출 핸들러 (이전 코드와 동일)
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
        setupVisualViewportFix(); // 💡 visualViewport를 이용한 키보드 높이 동적 패딩 설정
        form.addEventListener('submit', handleSubmit);
    }

    // 페이지 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();