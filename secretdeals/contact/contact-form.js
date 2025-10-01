/*
████████████████████████████████████████████████████████████████████████████████
██                        GLOBAL VARIABLES                                   ██
██                           전역 변수 설정                                    ██
████████████████████████████████████████████████████████████████████████████████
*/

// 제품 데이터 (products-data.js에서 가져옴)
let products = [];

// 현재 활성 탭
let activeTab = 'general';
let currentFormType = '';
let selectedProducts = {
  purchase: [],
  rental: []
};

// 모달에서 임시로 선택한 제품들
let tempSelectedProducts = [];

// 스크롤 타이머 변수
let scrollTimer = null;

// 🔥 성능 최적화를 위한 변수
let isModalOpening = false; // 모달 열기 중복 방지
let renderingBatch = null; // 배치 렌더링용
let visibleProductsCount = 8; // 처음에 보여줄 제품 수
let allFilteredProducts = []; // 필터링된 전체 제품
let isLoadingMore = false; // 추가 로딩 중 플래그

// 🆕 이미지 프리로더 캐시
const imageCache = new Map();

// 🔥 렌탈 기간별 계산을 위한 변수 (새로 추가)
let selectedRentalPeriod = 12; // 기본값: 12개월

/*
████████████████████████████████████████████████████████████████████████████████
██                    RENTAL CALCULATION SYSTEM                              ██
██                    렌탈 기간별 가격 계산 시스템 (수정된 버전)                   ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 렌탈 요율표 (기존 유지)
const rentalRates = {
  12: 0.09947,  // D1 - 9.9% 추가
  24: 0.05262,  // F1 - 5.3% 추가
  36: 0.03691,  // H1 - 3.7% 추가
  48: 0.02964,  // J1 - 3.0% 추가
  60: 0.02539   // L1 - 2.5% 추가
};

// 🔥 렌탈 가격 계산 함수 (수정된 버전 - 기본가에 요율을 추가)
function calculateRentalPrice(originalPrice, months) {
  if (!rentalRates[months]) {
    console.warn(`지원하지 않는 렌탈 기간: ${months}개월`);
    return originalPrice; // 기본값 반환
  }
  
  const rate = rentalRates[months];
  
  // 🔥 수정된 계산 방식: 기본가 + (기본가 × 요율)
  // originalPrice × (1 + rate) = 기본가에 요율을 추가
  const base = originalPrice * (1 + rate);
  
  // 1000원 단위로 올림 처리
  const rounded = Math.ceil(base / 1000) * 1000;
  
  // 10% 부가세 추가
  const monthlyRental = Math.round(rounded * 1.1);
  
  return monthlyRental;
}

// 🔥 현재 선택된 렌탈 기간 가져오기
function getCurrentRentalPeriod() {
  const rentalForm = document.getElementById('rental-form');
  if (!rentalForm) return 12; // 기본값
  
  const periodSelect = rentalForm.querySelector('select[name="rental-period"]');
  if (!periodSelect || !periodSelect.value) return 12; // 기본값
  
  return parseInt(periodSelect.value);
}

// 🔥 모든 렌탈 제품의 가격을 현재 선택된 기간에 맞게 업데이트
function updateAllRentalPrices() {
  selectedRentalPeriod = getCurrentRentalPeriod();
  
  // 선택된 제품들의 렌탈 가격 업데이트
  selectedProducts.rental.forEach(product => {
    // 원래 rentalPrice를 기준으로 새로운 가격 계산
    const originalPrice = product.originalRentalPrice || product.rentalPrice;
    if (!product.originalRentalPrice) {
      product.originalRentalPrice = product.rentalPrice; // 최초 1회만 저장
    }
    product.rentalPrice = calculateRentalPrice(originalPrice, selectedRentalPeriod);
  });
  
  // 임시 선택된 제품들의 가격도 업데이트
  tempSelectedProducts.forEach(product => {
    const originalPrice = product.originalRentalPrice || product.rentalPrice;
    if (!product.originalRentalPrice) {
      product.originalRentalPrice = product.rentalPrice;
    }
    product.rentalPrice = calculateRentalPrice(originalPrice, selectedRentalPeriod);
  });
  
  // 화면 업데이트
  if (currentFormType === 'rental') {
    renderSelectedProducts();
    updateRentalBudgetComparison();
    
    // 모달이 열려있다면 제품 가격도 업데이트
    const modal = document.getElementById('productModal');
    if (modal && modal.classList.contains('show')) {
      renderProductsOptimized(window.currentCategory || 'all');
    }
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    RENTAL CALCULATION SYSTEM 끝                           ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                    FORM VALIDATION VARIABLES                              ██
██                    폼 검증용 전역 변수 (새로 추가)                           ██
████████████████████████████████████████████████████████████████████████████████
*/

// 페이지 접속 시간 기록 (스팸 방지용)
let pageLoadTime = Date.now();

// 폼 검증 상태 저장
formValidationStates = {
  general: {
    name: false,
    email: false,
    phone: false, // 🔥 일반문의도 전화번호 필수로 변경
    company: true, // 회사명은 선택사항
    inquiryType: false,
    message: false,
    privacyAgree: false
  },
  purchase: {
    name: false,
    email: false,
    phone: false,
    company: true, // 회사명은 선택사항
    products: false, // 제품 선택 필수
    privacyAgree: false
  },
  rental: {
    name: false,
    email: false,
    phone: false,
    rentalPeriod: false, // 렌탈 기간 필수
    products: false, // 🔥 렌탈도 제품 선택 필수로 추가
    privacyAgree: false
  }
};


/*
████████████████████████████████████████████████████████████████████████████████
██                    FORM VALIDATION VARIABLES 끝                           ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                          DATA MANAGEMENT                                  ██
██                            데이터 관리                                      ██
████████████████████████████████████████████████████████████████████████████████
*/

// 데이터 로드 확인 및 초기화
function loadContactProducts() {
  if (typeof GOFIT_PRODUCTS === 'undefined') {
    console.error('❌ products-data.js 파일이 로드되지 않았습니다!');
    return;
  }
  
  products = GOFIT_PRODUCTS;

}

// 🆕 이미지 프리로드 함수
function preloadImage(url) {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }
  
  const img = new Image();
  img.src = url;
  imageCache.set(url, img);
  return img;
}

// 🆕 중요한 이미지 미리 로드
function preloadImportantImages() {
  // 처음 8개 제품의 이미지만 미리 로드
  products.slice(0, 8).forEach(product => {
    const thumbnailUrl = product.images && product.images.length > 0
      ? (product.images[0].includes('?w=') 
        ? product.images[0].replace(/\?w=\d+/, '?w=150') 
        : product.images[0] + '?w=150')
      : '/products/images/placeholder.jpg';
    preloadImage(thumbnailUrl);
  });
}

/*
████████████████████████████████████████████████████████████████████████████████
██                        SCROLL ANIMATIONS                                  ██
██                           스크롤 애니메이션                                 ██
████████████████████████████████████████████████████████████████████████████████
*/

// 스크롤 애니메이션 설정
function setupContactScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const elementsToObserve = [
    '.gf-contact-page-header',
    '.gfnew-form-section'
  ];
  
  elementsToObserve.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      observer.observe(element);
    }
  });
  
  observeActiveFormElements(observer);
}

// 활성 폼의 요소들 관찰
function observeActiveFormElements(observer) {
  const activeForm = document.querySelector('.gfnew-form-panel.active');
  if (!activeForm) return;
  
  const animateElements = activeForm.querySelectorAll('.gf-form-animate');
  animateElements.forEach(element => {
    observer.observe(element);
  });
}

/*
████████████████████████████████████████████████████████████████████████████████
██                          TAB MANAGEMENT                                   ██
██                            탭 관리 시스템                                   ██
████████████████████████████████████████████████████████████████████████████████
*/

// 탭 전환
function showTab(tabName, event) {
  activeTab = tabName;
  
  document.querySelectorAll('.gfnew-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  document.querySelectorAll('.gfnew-form-panel').forEach(panel => {
    panel.style.display = 'none';
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(`${tabName}-form`);
  activePanel.style.display = 'block';
  activePanel.classList.add('active');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const animateElements = activePanel.querySelectorAll('.gf-form-animate');
  animateElements.forEach(element => {
    element.classList.remove('visible');
    setTimeout(() => {
      observer.observe(element);
    }, 100);
  });
  
  // 🔥 탭 전환 시 예상 견적서 업데이트 + 렌탈 안내 문구 처리 (통합)
  if (tabName === 'purchase' && selectedProducts.purchase.length > 0) {
    // 구매 견적서 탭으로 전환하고 제품이 있으면 예상 견적서 표시
    currentFormType = 'purchase';
    renderSelectedProducts();
    updateBudgetComparison();
  } else if (tabName === 'rental') {
    // 렌탈 견적서 탭으로 전환 (제품 개수와 관계없이 처리)
    currentFormType = 'rental';
    
    // 🔥 렌탈 기간에 따른 가격 업데이트
    updateAllRentalPrices();
    
    if (selectedProducts.rental.length > 0) {
      // 제품이 있으면 예상 견적서 표시
      renderSelectedProducts();
      updateRentalBudgetComparison();
    }
    
    // 🔥 렌탈 안내 문구 업데이트 (제품 개수와 관계없이 항상 확인)
    const totalQuantity = selectedProducts.rental.reduce((total, product) => {
      return total + product.quantity;
    }, 0);
    updateRentalGuideMessage(totalQuantity, totalQuantity >= 5);
  } else {
    // 🔥 렌탈 탭이 아니면 안내 문구 숨김
    const guideElement = document.getElementById('rental-guide');
    if (guideElement) {
      guideElement.classList.remove('show');
    }
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      FILTER DRAG SCROLL SYSTEM                            ██
██                       필터 드래그 스크롤 시스템                               ██
████████████████████████████████████████████████████████████████████████████████
*/

/**
 * 🔥 카테고리 탭 마우스 드래그 기능 초기화 🔥
 * Products 페이지와 동일한 방식으로 구현
 */
function initFilterCategoryDrag() {
  const categoriesContainer = document.querySelector('.gfnew-filter-wrapper');
  if (!categoriesContainer) return;
  
  let isDown = false;
  let startX;
  let scrollLeft;
  let startTime;
  let dragDistance = 0;
  
  // 🔥 드래그 중에는 smooth 스크롤 비활성화 🔥
  const disableSmoothScroll = () => {
    categoriesContainer.style.scrollBehavior = 'auto';
  };
  
  const enableSmoothScroll = () => {
    // 드래그 종료 후 잠시 뒤에 smooth 스크롤 복원
    setTimeout(() => {
      categoriesContainer.style.scrollBehavior = 'smooth';
    }, 100);
  };
  
  // 마우스 다운 이벤트 (버튼 위에서도 작동)
  categoriesContainer.addEventListener('mousedown', (e) => {
    // 모바일에서만 드래그 활성화
    if (window.innerWidth > 768) return;
    
    isDown = true;
    startTime = Date.now();
    dragDistance = 0;
    
    categoriesContainer.classList.add('active');
    startX = e.pageX;
    scrollLeft = categoriesContainer.scrollLeft;
    categoriesContainer.style.cursor = 'grabbing';
    
    // 🔥 드래그 시작 시 smooth 스크롤 비활성화 🔥
    disableSmoothScroll();
    
    // 텍스트 선택 방지
    e.preventDefault();
  });
  
  // 마우스 떠남 이벤트
  categoriesContainer.addEventListener('mouseleave', () => {
    if (!isDown) return;
    
    // 드래그 거리가 충분하면 버튼들에 드래그 표시
    if (Math.abs(dragDistance) > 5) {
      const buttons = categoriesContainer.querySelectorAll('.gfnew-filter-tab');
      buttons.forEach(btn => {
        btn.dataset.dragging = 'true';
      });
    }
    
    isDown = false;
    categoriesContainer.classList.remove('active');
    categoriesContainer.style.cursor = 'grab';
    enableSmoothScroll();
  });
  
  // 마우스 업 이벤트
  categoriesContainer.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    
    const endTime = Date.now();
    const timeDiff = endTime - startTime;
    
    // 🔥 드래그 거리와 시간으로 클릭/드래그 구분 🔥
    if (Math.abs(dragDistance) > 5 || timeDiff > 200) {
      // 드래그로 판단 - 모든 버튼에 표시
      const buttons = categoriesContainer.querySelectorAll('.gfnew-filter-tab');
      buttons.forEach(btn => {
        btn.dataset.dragging = 'true';
      });
      
      // 짧은 시간 후 드래그 상태 초기화
      setTimeout(() => {
        buttons.forEach(btn => {
          btn.dataset.dragging = 'false';
        });
      }, 50);
    }
    
    isDown = false;
    categoriesContainer.classList.remove('active');
    categoriesContainer.style.cursor = 'grab';
    
    // 🔥 드래그 종료 시 smooth 스크롤 복원 🔥
    enableSmoothScroll();
  });
  
  // 마우스 무브 이벤트
  categoriesContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    
    const x = e.pageX;
    const distance = x - startX;
    dragDistance = distance;
    
    // 🔥 실시간으로 스크롤 위치 업데이트 🔥
    categoriesContainer.scrollLeft = scrollLeft - distance;
  });
  
  // 🔥 터치 이벤트 방지 (모바일과 충돌 방지) 🔥
  categoriesContainer.addEventListener('touchstart', (e) => {
    isDown = false;
  });
  
  // 🔥 화면 크기에 따라 커서 스타일 변경 🔥
  function updateCursorStyle() {
    if (window.innerWidth <= 768) {
      categoriesContainer.style.cursor = 'grab';
    } else {
      categoriesContainer.style.cursor = 'default';
    }
  }
  
  // 초기 커서 스타일 설정
  updateCursorStyle();
  
  // 리사이즈 시 커서 스타일 업데이트
  window.addEventListener('resize', updateCursorStyle);
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      FILTER DRAG SCROLL SYSTEM 끝                         ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                       PRODUCT MODAL SYSTEM                                ██
██                         제품 선택 모달 시스템                                ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 제품 모달 열기 - 근본적 문제 해결
function openProductModal(formType) {
  // 중복 클릭 방지
  if (isModalOpening) return;
  isModalOpening = true;
  
  currentFormType = formType;
  window.currentCategory = 'all';
  

  
  // 모달 표시 (먼저 모달을 보여주고)
  const modal = document.getElementById('productModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // 임시 선택 배열 초기화
  tempSelectedProducts = [...selectedProducts[currentFormType]];
  
  // 🔥 렌탈 모달인 경우 현재 선택된 기간에 맞게 가격 업데이트
  if (formType === 'rental') {
    selectedRentalPeriod = getCurrentRentalPeriod();
    tempSelectedProducts.forEach(product => {
      const originalPrice = product.originalRentalPrice || product.rentalPrice;
      if (!product.originalRentalPrice) {
        product.originalRentalPrice = product.rentalPrice;
      }
      product.rentalPrice = calculateRentalPrice(originalPrice, selectedRentalPeriod);
    });
  }

// 🔥 필터 탭 초기화 - 첫 번째 탭(All) 활성화
setTimeout(() => {
  const filterTabs = document.querySelectorAll('.gfnew-filter-tab');
  
  filterTabs.forEach((tab, index) => {
    tab.classList.remove('active');
    
    // 첫 번째 탭을 All로 강제 활성화
    if (index === 0) {
      tab.classList.add('active');
    }
  });
  
  // 🔥 필터 드래그 초기화
  initFilterCategoryDrag();
}, 100);
  
  // 초기 제품 수 설정
  visibleProductsCount = 8;
  
  // 🆕 로딩 표시를 먼저 보여주기
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '<div class="gfnew-loading"><div class="gfnew-loading-spinner"></div></div>';
  
  // 🆕 모달 애니메이션이 끝난 후 제품 렌더링 (300ms 딜레이)
  setTimeout(() => {
    renderProductsOptimized('all');
    updateSelectionCount();
    
    // 스크롤 이벤트 리스너 추가
    const modalBody = document.querySelector('.gfnew-modal-body');
    
    modalBody.addEventListener('scroll', handleModalScroll);
    modalBody.addEventListener('scroll', handleInfiniteScroll);
    
    // 모달 열기 완료
    isModalOpening = false;

  }, 300);
}

// 제품 모달 닫기
function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
  
  tempSelectedProducts = [];
  
  const modalBody = document.querySelector('.gfnew-modal-body');
  
  modalBody.removeEventListener('scroll', handleModalScroll);
  modalBody.removeEventListener('scroll', handleInfiniteScroll);
  
  modalBody.classList.remove('scrolling');
  
  clearTimeout(scrollTimer);
  
  // 🆕 렌더링 취소
  if (renderingBatch) {
    cancelAnimationFrame(renderingBatch);
  }
}

// 모달 외부 클릭시 닫기
document.getElementById('productModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeProductModal();
  }
});

/*
████████████████████████████████████████████████████████████████████████████████
██                       PRODUCT RENDERING                                   ██
██                         제품 렌더링 시스템                                   ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 제품 필터링 함수 - 근본 문제 해결 + 간단한 제품 없음 메시지
function renderProductsOptimized(category) {

  
  const grid = document.getElementById('productGrid');
  
  // 필터링된 제품 저장
  if (category === 'all') {
    allFilteredProducts = products;

  } else if (category === 'promotion') {
    // 🔥 프로모션 필터링 수정 - PROMOTION 대문자로 확인
    allFilteredProducts = products.filter(p => {
      if (!p.badge) return false;
      const badges = Array.isArray(p.badge) ? p.badge : [p.badge];
      return badges.some(badge => badge && badge.toUpperCase() === 'PROMOTION');
    });

  } else {
    // 🔥 일반 카테고리 필터링 - products-data.js의 영어 카테고리와 일치
    allFilteredProducts = products.filter(p => p.category === category);

  }
  
  // 🆕 제품이 없을 때 간단한 메시지 표시
  if (allFilteredProducts.length === 0) {
    // 카테고리별 한국어 이름 매핑
    const categoryNames = {
      'all': '전체',
      'promotion': '프로모션',
      'Weight': '웨이트',
      'Free weights': '프리웨이트',
      'Cardio': '카디오'
    };
    
    const categoryDisplayName = categoryNames[category] || category;
    
    grid.innerHTML = `
      <div class="gfnew-no-products">
        <p>${categoryDisplayName} 카테고리에 제품이 없습니다.</p>
        <p>다른 카테고리를 선택해 보세요.</p>
      </div>
    `;
    return;
  }
  
  // 🆕 렌더링을 다음 프레임으로 예약
  if (renderingBatch) {
    cancelAnimationFrame(renderingBatch);
  }
  
  renderingBatch = requestAnimationFrame(() => {
    renderProductBatch(0);
  });
}

// 🆕 배치로 제품 렌더링 (한번에 4개씩) - 무한 스크롤 방식으로 복원
function renderProductBatch(startIndex) {
  const grid = document.getElementById('productGrid');
  const batchSize = 4; // 한번에 렌더링할 제품 수
  const endIndex = Math.min(startIndex + batchSize, visibleProductsCount);
  const productsToShow = allFilteredProducts.slice(startIndex, endIndex);
  
  // 첫 배치인 경우 그리드 초기화
  if (startIndex === 0) {
    grid.innerHTML = '';
  }
  
  const fragment = document.createDocumentFragment();
  
  productsToShow.forEach(product => {
    const productCard = createProductCard(product);
    fragment.appendChild(productCard);
  });
  
  grid.appendChild(fragment);
  
  // 다음 배치가 있으면 계속 렌더링
  if (endIndex < visibleProductsCount && endIndex < allFilteredProducts.length) {
    requestAnimationFrame(() => {
      renderProductBatch(endIndex);
    });
  }
  // 🔥 더보기 버튼 로직 완전 제거 - 무한 스크롤만 사용
}

// 🔥 더 많은 제품 로드 - 무한 스크롤 방식으로 수정
function loadMoreProducts() {
  if (isLoadingMore) return;
  if (visibleProductsCount >= allFilteredProducts.length) return; // 더 이상 로드할 제품이 없으면 종료
  
  isLoadingMore = true;
  
  const grid = document.getElementById('productGrid');
  
  // 🆕 로딩 스피너 표시
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'gfnew-infinite-loading';
  loadingDiv.innerHTML = '<div class="gfnew-loading-spinner"></div>';
  grid.appendChild(loadingDiv);
  
  // 🆕 다음 프레임에서 실행
  requestAnimationFrame(() => {
    setTimeout(() => {
      const currentCount = visibleProductsCount;
      visibleProductsCount = Math.min(visibleProductsCount + 8, allFilteredProducts.length);
      
      // 로딩 스피너 제거
      if (loadingDiv) {
        loadingDiv.remove();
      }
      
      // 🆕 배치 렌더링으로 새 제품 추가
      renderProductBatch(currentCount);
      
      isLoadingMore = false;
    }, 300); // 로딩 효과를 위한 약간의 딜레이
  });
}

// 🔥 무한 스크롤 처리 - 더 부드럽게 수정
function handleInfiniteScroll(e) {
  const modalBody = e.target;
  const scrollBottom = modalBody.scrollHeight - modalBody.scrollTop - modalBody.clientHeight;
  
  // 🔥 스크롤이 바닥에서 150px 이내이고 더 로드할 제품이 있으면 자동 로딩
  if (scrollBottom < 150 && allFilteredProducts.length > visibleProductsCount && !isLoadingMore) {
    loadMoreProducts();
  }
}

// 🔥 제품 카드 생성 함수 - 구매 가격에만 부가세 포함 적용 + VAT 포함으로 변경
function createProductCard(product) {
  const isSelected = tempSelectedProducts.some(p => p.id === product.id);
  
  // 🔥 가격 계산: 렌탈은 이미 부가세 포함, 구매만 부가세 추가
  let price;
  if (currentFormType === 'rental') {
    // 렌탈: 이미 부가세 포함된 가격 사용 (수정 안함)
    const currentPeriod = getCurrentRentalPeriod();
    const originalPrice = product.originalRentalPrice || product.rentalPrice;
    const calculatedPrice = calculateRentalPrice(originalPrice, currentPeriod);
    price = `월 ${formatNumber(calculatedPrice)}원`;
  } else {
    // 🔥 구매: 부가세 10% 추가
    const vatIncludedPrice = Math.round(product.price * 1.1);
    price = `${formatNumber(vatIncludedPrice)}원`;
  }
  
  const card = document.createElement('div');
  card.className = `gfnew-product-card ${isSelected ? 'selected' : ''}`;
  card.onclick = (e) => toggleProduct(product.id, e);
  
  // 🔥 이미지 처리 - images 배열 사용
  const img = document.createElement('img');
  img.className = 'gfnew-card-img';
  img.alt = product.name;
  img.loading = 'lazy';
  
  // 🔥 images 배열에서 첫 번째 이미지 사용
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/products/images/placeholder.jpg';
  const thumbnailUrl = mainImage.includes('?w=') 
    ? mainImage.replace(/\?w=\d+/, '?w=150') 
    : mainImage + '?w=150';
  
  // 🆕 플레이스홀더 배경색
  img.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  
  // 🆕 이미지 로드 이벤트
  img.onload = function() {
    this.style.backgroundColor = 'transparent';
  };
  
  // 🆕 캐시된 이미지가 있으면 바로 사용
  if (imageCache.has(thumbnailUrl)) {
    img.src = thumbnailUrl;
  } else {
    // 없으면 지연 로드
    img.dataset.src = thumbnailUrl;
    lazyLoadImage(img);
  }
  
  // 🆕 이미지 컨테이너 생성 (프로모션 아이콘을 위해)
  const imgContainer = document.createElement('div');
  imgContainer.className = 'gfnew-card-img-container';
  imgContainer.style.cssText = 'position: relative;';
  imgContainer.appendChild(img);

  // 🆕 프로모션 제품인 경우 스파클 아이콘 추가
  if (product.badge === 'PROMOTION') {
    const promotionIcon = document.createElement('div');
    promotionIcon.className = 'gfnew-promotion-icon';
    promotionIcon.innerHTML = `
      <svg style="width: 14px; height: 14px; fill: #e63946;" viewBox="0 0 24 26">
        <path d="M12 2l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/>
      </svg>
    `;
    promotionIcon.style.cssText = `
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    `;
    imgContainer.appendChild(promotionIcon);
  }
  
  // 🔥 새로운 구조로 정보 영역 생성 + VAT 포함으로 변경
  const info = document.createElement('div');
  info.className = 'gfnew-card-info';
  info.innerHTML = `
    <div class="gfnew-card-text-group">
      <h4 class="gfnew-card-name">${product.name}</h4>
      <p class="gfnew-card-desc">제품코드: ${product.code}</p>
    </div>
    <div class="gfnew-card-price-group">
      <p class="gfnew-card-price">${price}</p>
      <p class="gfnew-card-vat">VAT 포함</p>
    </div>
  `;
  
  const check = document.createElement('div');
  check.className = 'gfnew-card-check';
  
  card.appendChild(imgContainer);
  card.appendChild(info);
  card.appendChild(check);
  
  return card;
}

// 🆕 이미지 지연 로드 함수
function lazyLoadImage(img) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        const src = image.dataset.src;
        
        if (src) {
          preloadImage(src); // 캐시에 저장
          image.src = src;
          image.removeAttribute('data-src');
        }
        
        observer.unobserve(image);
      }
    });
  });
  
  imageObserver.observe(img);
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      PRODUCT INTERACTION                                  ██
██                         제품 상호작용 관리                                   ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 제품 필터링 - 수정된 버전
function filterProducts(category, event) {
  // 드래그로 인한 클릭이면 무시
  if (event && event.target.dataset.dragging === 'true') {
    event.target.dataset.dragging = 'false';
    return;
  }
  
  // 모든 탭의 active 클래스 제거
  document.querySelectorAll('.gfnew-filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // 클릭된 탭에 active 클래스 추가
  if (event && event.target) {
    event.target.classList.add('active');
  }
  
  // 🔥 카테고리 매핑 (HTML onclick과 일치하도록 수정)
  let mappedCategory;
  switch(category) {
    case 'all':
      mappedCategory = 'all';
      break;
    case 'Promotion':
      mappedCategory = 'promotion';
      break;
    case 'Weight':
      mappedCategory = 'Weight';
      break;
    case 'Free weights':
      mappedCategory = 'Free weights';
      break;
    case 'Cardio':
      mappedCategory = 'Cardio';
      break;
    default:
      mappedCategory = category;
  }
  
  window.currentCategory = mappedCategory;
  
  // 초기 제품 수 리셋
  visibleProductsCount = 8;
  
  // 🆕 로딩 표시
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.innerHTML = '<div class="gfnew-loading"><div class="gfnew-loading-spinner"></div></div>';
    
    // 🆕 다음 프레임에서 렌더링
    requestAnimationFrame(() => {
      renderProductsOptimized(mappedCategory);
    });
  }
}

// 제품 선택/해제 - 렌탈 기간별 가격 적용
function toggleProduct(productId, event) {
  event.stopPropagation();
  
  const product = products.find(p => p.id === productId);
  const index = tempSelectedProducts.findIndex(p => p.id === productId);
  
  const clickedCard = event.currentTarget;
  
  if (index > -1) {
    tempSelectedProducts.splice(index, 1);
    clickedCard.classList.remove('selected');
    clickedCard.removeAttribute('style');
  } else {
    // 🔥 렌탈 제품인 경우 현재 선택된 기간에 맞는 가격 적용
    const productToAdd = {...product, quantity: 1};
    
    if (currentFormType === 'rental') {
      const currentPeriod = getCurrentRentalPeriod();
      const originalPrice = product.rentalPrice;
      productToAdd.originalRentalPrice = originalPrice; // 원본 가격 저장
      productToAdd.rentalPrice = calculateRentalPrice(originalPrice, currentPeriod);
    }
    
    tempSelectedProducts.push(productToAdd);
    clickedCard.classList.add('selected');
    
    if (window.innerWidth <= 768) {
      clickedCard.style.cssText = 
        'background: rgba(230, 57, 70, 0.12) !important;' +
        'border: 2px solid #e63946 !important;' +
        'box-shadow: 0 0 8px rgba(230, 57, 70, 0.4) !important;';
    }
  }
  
  updateSelectionCount();
}

// 선택 개수 업데이트
function updateSelectionCount() {
  const countElement = document.getElementById('selectionCount');
  if (countElement) {
    countElement.textContent = tempSelectedProducts.length;
  }
}

// 선택 완료
function confirmSelection() {
  selectedProducts[currentFormType] = [...tempSelectedProducts];
  renderSelectedProducts();
  closeProductModal();
  
  if (currentFormType === 'purchase') {
    updateBudgetComparison();
    // 🔥 제품 선택 검증 호출 (구매)
    validateProductSelection('purchase');
  } else if (currentFormType === 'rental') {
    updateRentalBudgetComparison();
    // 🔥 제품 선택 검증 호출 (렌탈)
    validateProductSelection('rental');
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      INFINITE SCROLL & LOADING                            ██
██                         무한 스크롤 및 로딩                                  ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 더 많은 제품 로드 - 개선
function loadMoreProducts() {
  if (isLoadingMore) return;
  isLoadingMore = true;
  
  const grid = document.getElementById('productGrid');
  const loadMoreBtn = grid.querySelector('.gfnew-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.innerHTML = '<div class="gfnew-loading-spinner"></div>';
  }
  
  // 🆕 다음 프레임에서 실행
  requestAnimationFrame(() => {
    setTimeout(() => {
      const currentCount = visibleProductsCount;
      visibleProductsCount = Math.min(visibleProductsCount + 8, allFilteredProducts.length);
      
      // 로드 더 버튼 제거
      if (loadMoreBtn) {
        loadMoreBtn.remove();
      }
      
      // 🆕 배치 렌더링으로 새 제품 추가
      renderProductBatch(currentCount);
      
      isLoadingMore = false;
    }, 100);
  });
}

// 🔥 무한 스크롤 처리
function handleInfiniteScroll(e) {
  const modalBody = e.target;
  const scrollBottom = modalBody.scrollHeight - modalBody.scrollTop - modalBody.clientHeight;
  
  // 스크롤이 바닥에서 100px 이내이고 더 로드할 제품이 있으면
  if (scrollBottom < 100 && allFilteredProducts.length > visibleProductsCount && !isLoadingMore) {
    loadMoreProducts();
  }
}

// 모달 세로 스크롤 핸들러
function handleModalScroll(e) {
  const modalBody = e.target;
  modalBody.classList.add('scrolling');
  
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    modalBody.classList.remove('scrolling');
  }, 1500);
}



/*
████████████████████████████████████████████████████████████████████████████████
██                     SELECTED PRODUCTS MANAGEMENT                          ██
██                        선택된 제품 관리 시스템                                ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 선택된 제품 렌더링 - VAT 포함 텍스트 추가 완료판
function renderSelectedProducts() {
  const listId = currentFormType === 'purchase' ? 'purchase-products' : 'rental-products';
  const list = document.getElementById(listId);
  
  if (!list) return;
  
  if (selectedProducts[currentFormType].length === 0) {
    list.classList.remove('show');
    
    // 🔥 제품 선택 검증 (구입 + 렌탈 모두)
    if (currentFormType === 'purchase' || currentFormType === 'rental') {
      validateProductSelection(currentFormType);
    }
    
    return;
  }
  
  list.classList.add('show');
  list.innerHTML = '';
  
  // DocumentFragment 사용으로 DOM 조작 최적화
  const fragment = document.createDocumentFragment();
  
  selectedProducts[currentFormType].forEach((product, index) => {
    // 🔥 가격 계산: 렌탈은 이미 부가세 포함, 구매만 부가세 추가
    let price;
    if (currentFormType === 'rental') {
      // 렌탈: 이미 부가세 포함된 가격 사용 (수정 안함)
      const currentPeriod = getCurrentRentalPeriod();
      const originalPrice = product.originalRentalPrice || product.rentalPrice;
      const calculatedPrice = calculateRentalPrice(originalPrice, currentPeriod);
      price = `월 ${formatNumber(calculatedPrice)}원`;
    } else {
      // 🔥 구매: 부가세 10% 추가
      const vatIncludedPrice = Math.round(product.price * 1.1);
      price = `${formatNumber(vatIncludedPrice)}원`;
    }
    
    const mainImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/products/images/placeholder.jpg';
    const imageUrl = mainImage.includes('?w=300') 
      ? mainImage 
      : mainImage + '?w=300';
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gfnew-product-item';
    itemDiv.style.cssText = 
      'background: rgba(255, 255, 255, 0.03) !important;' +
      'border-color: rgba(255, 255, 255, 0.15) !important;' +
      'transform: translateZ(0);' +
      '-webkit-transform: translateZ(0);' +
      'will-change: auto;' +
      'backface-visibility: hidden;' +
      '-webkit-backface-visibility: hidden;';
    
    // 🔥 이미지 프리로드와 로딩 최적화
    const img = new Image();
    img.className = 'gfnew-product-img';
    img.alt = product.name;
    img.src = imageUrl;
    img.style.cssText = 
      'opacity: 0;' +
      'transition: opacity 0.2s ease;';
    
    // 이미지 로드 완료 시 페이드인
    img.onload = function() {
      this.style.opacity = '1';
    };
    
    // 이미지 로드 실패 시 기본 배경
    img.onerror = function() {
      this.style.opacity = '1';
      this.style.background = 'rgba(255, 255, 255, 0.05)';
    };
    
    // 🔥 VAT 포함 텍스트 추가된 HTML 구조
    itemDiv.innerHTML = `
      <div class="gfnew-product-top">
        <div class="gfnew-product-img-wrapper"></div>
        <div class="gfnew-product-info">
          <h4 class="gfnew-product-name">${product.name}</h4>
          <p class="gfnew-product-code">${product.code}</p>
          <div class="gfnew-price-group">
            <p class="gfnew-product-price">${price}</p>
            <p class="gfnew-product-vat">VAT 포함</p>
          </div>
        </div>
      </div>
      <div class="gfnew-product-controls">
        <div class="gfnew-qty-control">
          <button class="gfnew-qty-btn" onclick="changeQuantity('${currentFormType}', ${index}, -1)">-</button>
          <span class="gfnew-qty-value">${product.quantity}</span>
          <button class="gfnew-qty-btn" onclick="changeQuantity('${currentFormType}', ${index}, 1)">+</button>
        </div>
        <button class="gfnew-delete-btn" onclick="removeProduct('${currentFormType}', ${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    // 이미지를 wrapper에 추가
    const imgWrapper = itemDiv.querySelector('.gfnew-product-img-wrapper');
    imgWrapper.appendChild(img);
    
    fragment.appendChild(itemDiv);
  });
  
  list.appendChild(fragment);
  
  // 🔥 제품 선택 검증 (구입 + 렌탈 모두)
  if (currentFormType === 'purchase' || currentFormType === 'rental') {
    validateProductSelection(currentFormType);
  }
}

// 수량 변경
function changeQuantity(formType, index, change) {
  const product = selectedProducts[formType][index];
  product.quantity = Math.max(1, product.quantity + change);
  currentFormType = formType;
  renderSelectedProducts();
  
  if (formType === 'purchase') {
    updateBudgetComparison();
    // 🔥 제품 선택 검증 호출 (구매)
    validateProductSelection('purchase');
  } else if (formType === 'rental') {
    updateRentalBudgetComparison();
    // 🔥 제품 선택 검증 호출 (렌탈)
    validateProductSelection('rental');
  }
}

// 제품 삭제
function removeProduct(formType, index) {
  selectedProducts[formType].splice(index, 1);
  currentFormType = formType;
  renderSelectedProducts();
  
  if (formType === 'purchase') {
    updateBudgetComparison();
    // 🔥 제품 선택 검증 호출 (구매)
    validateProductSelection('purchase');
  } else if (formType === 'rental') {
    updateRentalBudgetComparison();
    // 🔥 제품 선택 검증 호출 (렌탈)
    validateProductSelection('rental');
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      구매 견적서 - 예산 비교 함수                           ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 총 가격 계산 함수 - 부가세 포함으로 수정
function calculateTotalPrice() {
  return selectedProducts.purchase.reduce((total, product) => {
    // 🔥 각 제품 가격에 부가세 10% 포함하여 계산
    const vatIncludedPrice = Math.round(product.price * 1.1);
    return total + (vatIncludedPrice * product.quantity);
  }, 0);
}

// 🔥 총 제품 개수 계산 함수 (수량 포함)
function calculateTotalProductCount(formType) {
  return selectedProducts[formType].reduce((total, product) => {
    return total + product.quantity;
  }, 0);
}


// 🔥 예산 비교 업데이트 함수 - VAT 포함 텍스트 추가
function updateBudgetComparison() {
  const budgetInput = document.getElementById('purchase-budget');
  const budgetCompare = document.getElementById('purchase-budget-compare');
  
  if (!budgetInput || !budgetCompare) return;
  
  // 🔥 렌탈 견적서는 숨기기
  const rentalBudget = document.getElementById('rental-budget-compare');
  if (rentalBudget) rentalBudget.style.display = 'none';
  
  const budgetValue = extractNumber(budgetInput.value);
  const totalPrice = calculateTotalPrice();
  const productCount = calculateTotalProductCount('purchase');
  
  // 제품이 선택되었으면 견적서 섹션 표시
  if (selectedProducts.purchase.length > 0) {
    budgetCompare.style.display = 'block';
    
    // 예산 상태에 따른 클래스 계산
    let cardClass = '';
    if (budgetValue > 0) {
      const percentage = (totalPrice / budgetValue) * 100;
      if (percentage <= 70) {
        cardClass = 'has-budget budget-good';
      } else if (percentage <= 100) {
        cardClass = 'has-budget budget-warning';
      } else {
        cardClass = 'has-budget budget-over';
      }
    }
    
    // 🔥 VAT 포함 텍스트가 추가된 새로운 HTML 구조
    budgetCompare.innerHTML = `
      <div class="gfnew-estimate-card ${cardClass}">
        <div class="gfnew-estimate-header">
          <h4>예상 견적서</h4>
        </div>
        
        <div class="gfnew-amount-display">
          <div class="gfnew-total-label">총 구매 금액</div>
          <div class="gfnew-total-amount">${formatNumber(totalPrice)}원</div>
          <div class="gfnew-vat-notice">VAT 포함</div>
        </div>
        
        <div class="gfnew-detail-grid">
          <div class="gfnew-detail-item">
            <span class="gfnew-detail-label">선택 제품</span>
            <span class="gfnew-detail-value">${selectedProducts.purchase.length}종</span>
          </div>
          <div class="gfnew-detail-item">
            <span class="gfnew-detail-label">총 수량</span>
            <span class="gfnew-detail-value">${productCount}개</span>
          </div>
        </div>
        
        ${budgetValue > 0 ? `
          <div class="gfnew-budget-section">
            <div class="gfnew-budget-header">
              <span class="gfnew-budget-label">예상 예산</span>
              <span class="gfnew-budget-amount">${formatNumber(budgetValue)}원</span>
            </div>
            
            <div class="gfnew-budget-analysis" style="display: block;">
              ${createGaugeBar(totalPrice, budgetValue, 'purchase')}
            </div>
          </div>
        ` : `
          <div class="gfnew-budget-section">
            <div class="gfnew-budget-header">
              <span class="gfnew-budget-label">예상 예산</span>
              <span class="gfnew-budget-amount no-budget">예산을 입력하면 비교 분석이 표시됩니다</span>
            </div>
          </div>
        `}
        
        <div class="gfnew-discount-notice">
          <p>
            <i class="fas fa-info-circle"></i>
            해당 견적은 예시 견적이며, 견적서 작성을 완료하여 발송해주시면 구매 수량 또는 가격에 따라 추가 할인율 적용이 있을 수 있습니다.
          </p>
        </div>
      </div>
    `;
  } else {
    budgetCompare.style.display = 'none';
  }
}


/*
████████████████████████████████████████████████████████████████████████████████
██                      렌탈 견적서 - 예산 비교 함수 (수정)                     ██
████████████████████████████████████████████████████████████████████████████████
*/

// 렌탈 총 가격 계산 함수 - 현재 선택된 기간에 따라 계산
function calculateTotalRentalPrice() {
  const currentPeriod = getCurrentRentalPeriod();
  
  return selectedProducts.rental.reduce((total, product) => {
    const originalPrice = product.originalRentalPrice || product.rentalPrice;
    const calculatedPrice = calculateRentalPrice(originalPrice, currentPeriod);
    return total + (calculatedPrice * product.quantity);
  }, 0);
}

// 🔥 렌탈 예산 비교 업데이트 함수 - VAT 포함 텍스트 추가
function updateRentalBudgetComparison() {
  const budgetInput = document.getElementById('rental-budget');
  const budgetCompare = document.getElementById('rental-budget-compare');
  
  if (!budgetInput || !budgetCompare) return;
  
  // 🔥 구매 견적서는 숨기기
  const purchaseBudget = document.getElementById('purchase-budget-compare');
  if (purchaseBudget) purchaseBudget.style.display = 'none';
  
  const budgetValue = extractNumber(budgetInput.value);
  const totalPrice = calculateTotalRentalPrice();
  const productCount = calculateTotalProductCount('rental');
  
  // 제품이 선택되었으면 견적서 섹션 표시
  if (selectedProducts.rental.length > 0) {
    budgetCompare.style.display = 'block';
    
    // 예산 상태에 따른 클래스 계산
    let cardClass = '';
    if (budgetValue > 0) {
      const percentage = (totalPrice / budgetValue) * 100;
      if (percentage <= 70) {
        cardClass = 'has-budget budget-good';
      } else if (percentage <= 100) {
        cardClass = 'has-budget budget-warning';
      } else {
        cardClass = 'has-budget budget-over';
      }
    }
    
    // 🔥 VAT 포함 텍스트가 추가된 새로운 HTML 구조
    budgetCompare.innerHTML = `
      <div class="gfnew-estimate-card ${cardClass}">
        <div class="gfnew-estimate-header">
          <h4>예상 견적서</h4>
        </div>
        
        <div class="gfnew-amount-display">
          <div class="gfnew-total-label">월 렌탈료</div>
          <div class="gfnew-total-amount">${formatNumber(totalPrice)}원</div>
          <div class="gfnew-vat-notice">VAT 포함</div>
        </div>
        
        <div class="gfnew-detail-grid">
          <div class="gfnew-detail-item">
            <span class="gfnew-detail-label">선택 제품</span>
            <span class="gfnew-detail-value">${selectedProducts.rental.length}종</span>
          </div>
          <div class="gfnew-detail-item">
            <span class="gfnew-detail-label">총 수량</span>
            <span class="gfnew-detail-value">${productCount}개</span>
          </div>
        </div>
        
        ${budgetValue > 0 ? `
          <div class="gfnew-budget-section">
            <div class="gfnew-budget-header">
              <span class="gfnew-budget-label">월 예산</span>
              <span class="gfnew-budget-amount">${formatNumber(budgetValue)}원</span>
            </div>
            
            <div class="gfnew-budget-analysis" style="display: block;">
              ${createGaugeBar(totalPrice, budgetValue, 'rental')}
            </div>
          </div>
        ` : `
          <div class="gfnew-budget-section">
            <div class="gfnew-budget-header">
              <span class="gfnew-budget-label">월 예산</span>
              <span class="gfnew-budget-amount no-budget">예산을 입력하면 비교 분석이 표시됩니다</span>
            </div>
          </div>
        `}
        
        <div class="gfnew-discount-notice">
          <p>
            <i class="fas fa-info-circle"></i>
            해당 견적은 예시 견적이며, 견적서 발송 시 사업자 등록증 혹은 신분증을 첨부해주시면 더 정확한 가격을 회신드릴 수 있습니다.
          </p>
        </div>
      </div>
    `;
  } else {
    budgetCompare.style.display = 'none';
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      게이지바 생성 헬퍼 함수                                ██
████████████████████████████████████████████████████████████████████████████████
*/

// 게이지바와 상태 메시지 생성 함수
function createGaugeBar(totalPrice, budgetValue, type) {
  const percentage = (totalPrice / budgetValue) * 100;
  const percentageDisplay = Math.round(percentage);
  
  let statusClass = 'good';
  let statusIcon = 'fa-check-circle';
  let statusMessage = '';
  let gaugeColor = 'linear-gradient(90deg, #2ecc71, #27ae60)';
  
  if (percentage <= 70) {
    statusClass = 'good';
    statusIcon = 'fa-check-circle';
    statusMessage = `예산 내에서 여유있게 선택하셨습니다.`;
    gaugeColor = 'linear-gradient(90deg, #2ecc71, #27ae60)';
  } else if (percentage <= 100) {
    statusClass = 'warning';
    statusIcon = 'fa-exclamation-circle';
    statusMessage = `예산에 근접한 선택입니다.`;
    gaugeColor = 'linear-gradient(90deg, #f1c40f, #f39c12)';
  } else {
    statusClass = 'over';
    statusIcon = 'fa-times-circle';
    const overAmount = formatNumber(totalPrice - budgetValue);
    statusMessage = `예산을 ${overAmount}원 초과했습니다.`;
    gaugeColor = 'linear-gradient(90deg, #e74c3c, #c0392b)';
  }
  
  // 월 렌탈의 경우 메시지 조정
  if (type === 'rental' && statusClass === 'good') {
    statusMessage = `월 렌탈 예산 내에서 여유있게 선택하셨습니다.`;
  } else if (type === 'rental' && statusClass === 'warning') {
    statusMessage = `월 렌탈 예산에 근접한 선택입니다.`;
  } else if (type === 'rental' && statusClass === 'over') {
    const overAmount = formatNumber(totalPrice - budgetValue);
    statusMessage = `월 렌탈 예산을 ${overAmount}원 초과했습니다.`;
  }
  
  return `
    <div class="gfnew-gauge-container">
      <div class="gfnew-gauge-track">
        <div class="gfnew-gauge-fill" style="width: ${Math.min(percentageDisplay, 100)}%; background: ${gaugeColor};">
          <span class="gfnew-gauge-percent">${percentageDisplay}%</span>
        </div>
      </div>
    </div>
    <div class="gfnew-budget-status ${statusClass}">
      <i class="fas ${statusIcon}"></i>
      <span>${statusMessage}</span>
    </div>
  `;
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      예산 비교 함수 수정 끝                                 ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                      GOOGLE APPS SCRIPT 설정                              ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 여기에 Google Apps Script URL을 넣어주세요!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGWBV9cosYHkstEyqhB5avOHGGMLmcNLH1njkaQTrmeoPKbXSzckTuxiKKJ104ALX31w/exec';

/*
████████████████████████████████████████████████████████████████████████████████
██                      로딩 모달 함수                                        ██
████████████████████████████████████████████████████████████████████████████████
*/

// 로딩 모달 표시
function showLoadingModal() {
  // 로딩 모달 HTML 생성
  const loadingModal = document.createElement('div');
  loadingModal.id = 'contact-loading-modal';
  loadingModal.className = 'gf-loading-screen';
  
  loadingModal.innerHTML = `
    <div class="gf-loading-container">
      <!-- 로딩 스피너 -->
      <div class="gf-loading-spinner">
        <!-- Background static SVG -->
        <svg width="200px" height="160px" viewBox="0 0 187.3 93.7">
          <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
        </svg>
        
        <!-- Main animated SVG -->
        <svg width="200px" height="160px" viewBox="0 0 187.3 93.7">
          <defs>
            <linearGradient id="gf-loading-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff0066" />
              <stop offset="25%" stop-color="lime" />
              <stop offset="50%" stop-color="cyan" />
              <stop offset="75%" stop-color="magenta" />
              <stop offset="100%" stop-color="orange" />
            </linearGradient>
          </defs>
          <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
        </svg>
        
        <!-- Blurred overlay SVG -->
        <svg width="200px" height="160px" viewBox="0 0 187.3 93.7">
          <defs>
            <linearGradient id="gf-loading-gradient-blur" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff0066" />
              <stop offset="25%" stop-color="lime" />
              <stop offset="50%" stop-color="cyan" />
              <stop offset="75%" stop-color="magenta" />
              <stop offset="100%" stop-color="orange" />
            </linearGradient>
          </defs>
          <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
        </svg>
      </div>
      
      <!-- 로딩 텍스트 (로고 제거) -->
      <div class="gf-loading-content">
        <p style="color: white; font-size: 18px; margin-bottom: 1rem;">문의를 전송 중입니다</p>
        <div class="gf-loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  `;
  
  // 스타일 추가 (한 번만)
  if (!document.getElementById('loading-modal-style')) {
    const style = document.createElement('style');
    style.id = 'loading-modal-style';
    style.textContent = `
      /* 로딩 스크린 - 🔥 배경 투명도 수정 */
      #contact-loading-modal.gf-loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);  /* 🔥 검은색 + 90% 투명도 */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
        backdrop-filter: blur(5px);  /* 🔥 뒤 배경 블러 효과 추가 */
      }
      
      /* 로딩 컨테이너 */
      #contact-loading-modal .gf-loading-container {
        text-align: center;
        position: relative;
      }
      
      /* 로딩 스피너 */
      #contact-loading-modal .gf-loading-spinner {
        position: relative;
        margin-bottom: 3rem;
      }
      
      /* SVG 스타일 */
      #contact-loading-modal .gf-loading-spinner svg {
        fill: none;
        stroke-width: 10;
        stroke-linecap: round;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      /* 첫 번째 SVG - 배경 */
      #contact-loading-modal .gf-loading-spinner svg:nth-child(1) {
        stroke: #222;
      }
      
      /* 두 번째 SVG - 메인 애니메이션 */
      #contact-loading-modal .gf-loading-spinner svg:nth-child(2) {
        stroke: url(#gf-loading-gradient);
        stroke-dasharray: 60 172;
        animation: gfLoadingAnimate 0.5s linear infinite;
      }
      
      /* 세 번째 SVG - 블러 효과 */
      #contact-loading-modal .gf-loading-spinner svg:nth-child(3) {
        stroke: url(#gf-loading-gradient-blur);
        stroke-dasharray: 60 172;
        filter: blur(5px);
        animation: gfLoadingAnimate 1s linear infinite;
      }
      
      /* 로딩 애니메이션 */
      @keyframes gfLoadingAnimate {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 232; }
      }
      
      /* 로딩 점들 */
      #contact-loading-modal .gf-loading-dots {
        display: flex;
        justify-content: center;
        gap: 0.3rem;
      }
      
      #contact-loading-modal .gf-loading-dots span {
        color: #e63946 !important;
        font-size: 2rem !important;
        font-weight: bold !important;
        animation: gfLoadingDots 1.5s ease-in-out infinite;
      }
      
      #contact-loading-modal .gf-loading-dots span:nth-child(1) {
        animation-delay: 0s;
      }
      
      #contact-loading-modal .gf-loading-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      #contact-loading-modal .gf-loading-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes gfLoadingDots {
        0%, 80%, 100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        40% {
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      /* 모바일 반응형 */
      @media (max-width: 768px) {
        #contact-loading-modal .gf-loading-spinner svg {
          width: 150px;
          height: 120px;
        }
        
        #contact-loading-modal .gf-loading-dots span {
          font-size: 1.5rem !important;
        }
      }
      
      @media (max-width: 480px) {
        #contact-loading-modal .gf-loading-spinner svg {
          width: 120px;
          height: 96px;
        }
        
        #contact-loading-modal .gf-loading-dots span {
          font-size: 1.2rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(loadingModal);
}

// 로딩 모달 숨기기
function hideLoadingModal() {
  const loadingModal = document.getElementById('contact-loading-modal');
  if (loadingModal) {
    loadingModal.remove();
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      로딩 모달 함수 끝                                     ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                      커스텀 알림창 함수                                    ██
████████████████████████████████████████████████████████████████████████████████
*/

// 커스텀 알림창 표시
function showCustomAlert(type, title, message) {
  // 알림창 HTML 생성
  const alertOverlay = document.createElement('div');
  alertOverlay.className = 'custom-alert-overlay';
  
  const iconHTML = type === 'success' 
    ? '<i class="fas fa-check"></i>' 
    : '<i class="fas fa-times"></i>';
  
  alertOverlay.innerHTML = `
    <div class="custom-alert-box">
      <div class="custom-alert-icon ${type}">
        ${iconHTML}
      </div>
      <h3 class="custom-alert-title">${title}</h3>
      <p class="custom-alert-message">${message}</p>
      <button class="custom-alert-button" onclick="closeCustomAlert()">확인</button>
    </div>
  `;
  
  document.body.appendChild(alertOverlay);
  
  // 애니메이션을 위한 딜레이
  setTimeout(() => {
    alertOverlay.classList.add('show');
  }, 10);
}

// 커스텀 알림창 닫기
function closeCustomAlert() {
  const alertOverlay = document.querySelector('.custom-alert-overlay');
  if (alertOverlay) {
    alertOverlay.classList.remove('show');
    setTimeout(() => {
      alertOverlay.remove();
    }, 300);
  }
}

// 전역 함수로 등록
window.closeCustomAlert = closeCustomAlert;

/*
████████████████████████████████████████████████████████████████████████████████
██                      커스텀 알림창 함수 끝                                 ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                폼 제출 처리 - 파일을 Base64로 변환하여 전송                  ██
████████████████████████████████████████████████████████████████████████████████
*/

// 폼 제출 처리 부분을 이 코드로 교체하세요
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', async function(e) {  // async 추가!
    e.preventDefault();
    
    // 🔥 Google Script URL이 설정되지 않았으면 경고
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      showCustomAlert(
        'error', 
        '설정 오류', 
        '관리자에게 문의하세요.<br>(Google Apps Script URL이 설정되지 않았습니다)'
      );
      return;
    }
    
    // 🔥 허니팟 검증 (봇 차단)
    if (!validateHoneypot()) {

      return;
    }
    
    // 🔥 최소 체류시간 검증 (스팸 방지)
    if (!checkMinimumStayTime()) {
      showCustomAlert(
        'error',
        '제출 실패',
        '페이지에 더 머물러 주신 후 다시 시도해주세요.'
      );
      return;
    }
    
    const formId = this.id;
    const formType = formId.replace('-form', '');
    
    // 🔥 이메일 중복 제출 검증
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput && !checkResubmissionLimit(emailInput.value)) {
      showCustomAlert(
        'error',
        '제출 제한',
        '동일한 이메일로는 2시간 후에 다시 문의해주세요.'
      );
      return;
    }
    
    // 🔥 최종 검증 확인
    const formState = formValidationStates[formType];
    const allValid = Object.values(formState).every(state => state === true);
    
    if (!allValid) {
      showCustomAlert(
        'error',
        '입력 오류',
        '모든 필수 항목을 올바르게 입력해주세요.'
      );
      return;
    }
    
    // 🔥 구입 견적서 제품 선택 검증
    if (formType === 'purchase' && (!selectedProducts.purchase || selectedProducts.purchase.length === 0)) {
      showCustomAlert(
        'error',
        '제품 선택 필요',
        '견적 요청을 위해 최소 1개 이상의 제품을 선택해주세요.'
      );
      return;
    }
    
    // 🔥 렌탈 견적서 제품 선택 검증 (5개 이상 수량 확인)
    if (formType === 'rental') {
      if (!selectedProducts.rental || selectedProducts.rental.length === 0) {
        showCustomAlert(
          'error',
          '제품 선택 필요',
          '렌탈 견적 요청을 위해 최소 5개 이상의 제품을 선택해주세요.'
        );
        return;
      }
      
      // 총 수량 확인 (개별 제품의 quantity 합산)
      const totalQuantity = selectedProducts.rental.reduce((total, product) => {
        return total + product.quantity;
      }, 0);
      
      if (totalQuantity < 5) {
        showCustomAlert(
          'error',
          '렌탈 수량 부족',
          '렌탈 견적 요청을 위해 최소 5개 이상의 제품을 선택해주세요.<br>현재 선택된 수량: ' + totalQuantity + '개'
        );
        return;
      }
    }
    
    window.isFormSubmitting = true;
    document.activeElement.blur();
    
    // 로딩 표시
    showLoadingModal();
    
    try {
      // 폼 데이터 수집
      const formData = new FormData();
      
      // 기본 정보 수집
      const nameInput = this.querySelector('input[name="name"]');
      const emailInput2 = this.querySelector('input[name="email"]');
      const phoneInput = this.querySelector('input[name="phone"]');
      
      formData.append('name', nameInput ? nameInput.value : '');
      formData.append('email', emailInput2 ? emailInput2.value : '');
      formData.append('phone', phoneInput ? phoneInput.value : '');
      
      // 메시지 내용 만들기
      let message = '';
      
      // 폼 타입에 따라 메시지 구성
      if (formId === 'general-form') {
        // 일반 문의
        const companyInput = this.querySelector('input[name="company"]');
        const inquirySelect = this.querySelector('select[name="inquiry-type"]');
        const messageTextarea = this.querySelector('textarea[name="message"]');
        
        message = `[일반 문의]\n`;
        if (companyInput && companyInput.value) {
          message += `회사명: ${companyInput.value}\n`;
        }
        if (inquirySelect) {
          message += `문의 유형: ${inquirySelect.options[inquirySelect.selectedIndex].text}\n`;
        }
        message += `\n문의 내용:\n${messageTextarea ? messageTextarea.value : ''}`;
        
      } else if (formId === 'purchase-form') {
        // 구입 견적서
        const companyInput = this.querySelector('input[name="company"]');
        const budgetInput = this.querySelector('.gfnew-budget-input');
        const additionalTextarea = this.querySelector('textarea[name="additional-requests"]');
        
        message = `[구입 견적서 요청]\n`;
        if (companyInput && companyInput.value) {
          message += `회사명: ${companyInput.value}\n`;
        }
        if (budgetInput && budgetInput.value) {
          message += `예상 예산: ${budgetInput.value}\n`;
        }
        
        // 선택된 제품 정보
        if (selectedProducts.purchase.length > 0) {
          message += `\n선택된 제품 (${selectedProducts.purchase.length}종):\n`;
          selectedProducts.purchase.forEach((product, index) => {
            message += `${index + 1}. ${product.name} (${product.code}) - 수량: ${product.quantity}개\n`;
          });
          message += `총 구매 금액: ${formatNumber(calculateTotalPrice())}원\n`;
        }
        
        if (additionalTextarea && additionalTextarea.value) {
          message += `\n추가 요청사항:\n${additionalTextarea.value}`;
        }
        
      } else if (formId === 'rental-form') {
        // 🔥 렌탈 견적서 - 렌탈 기간별 가격 정보 포함
        const rentalPeriodSelect = this.querySelector('select[name="rental-period"]');
        const budgetInput = this.querySelector('.gfnew-budget-input');
        const additionalTextarea = this.querySelector('textarea[name="additional-requests"]');
        
        message = `[렌탈 견적서 요청]\n`;
        
        if (rentalPeriodSelect) {
          message += `렌탈 기간: ${rentalPeriodSelect.value}개월\n`;
        }
        if (budgetInput && budgetInput.value) {
          message += `월 렌탈 예산: ${budgetInput.value}\n`;
        }
        
        // 선택된 제품 정보 (렌탈 기간별 가격 포함)
        if (selectedProducts.rental.length > 0) {
          const currentPeriod = getCurrentRentalPeriod();
          message += `\n선택된 제품 (${selectedProducts.rental.length}종, ${currentPeriod}개월 기준):\n`;
          selectedProducts.rental.forEach((product, index) => {
            const originalPrice = product.originalRentalPrice || product.rentalPrice;
            const calculatedPrice = calculateRentalPrice(originalPrice, currentPeriod);
            message += `${index + 1}. ${product.name} (${product.code}) - 수량: ${product.quantity}개, 월 렌탈료: ${formatNumber(calculatedPrice)}원\n`;
          });
          message += `월 렌탈료 합계: ${formatNumber(calculateTotalRentalPrice())}원\n`;
        }
        
        if (additionalTextarea && additionalTextarea.value) {
          message += `\n추가 요청사항:\n${additionalTextarea.value}`;
        }
      }
      
      // message 파라미터에 모든 내용 담기
      formData.append('message', message);
      
      // 🔥🔥🔥 렌탈 폼인 경우 파일들을 Base64로 변환하여 전송
      if (formId === 'rental-form' && rentalUploadedFiles && rentalUploadedFiles.length > 0) {
        // 파일 개수 전송
        formData.append('fileCount', rentalUploadedFiles.length);
        
        // 각 파일을 Base64로 변환
        for (let i = 0; i < rentalUploadedFiles.length; i++) {
          const file = rentalUploadedFiles[i];
          
          // FileReader를 사용해 Base64로 변환
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              // data:image/png;base64,xxxxx 형태에서 base64 부분만 추출
              const base64String = reader.result.split(',')[1];
              resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          // 파일 정보와 Base64 데이터 전송
          formData.append(`fileName_${i}`, file.name);
          formData.append(`fileType_${i}`, file.type);
          formData.append(`fileData_${i}`, base64);
        }
      }
      
      // Google Apps Script로 전송
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.text();
      
      // 🔥 제출 시간 기록 (재제출 방지용)
      if (emailInput2) {
        recordSubmissionTime(emailInput2.value);
      }
      
      // 성공 처리
      hideLoadingModal();
      showCustomAlert(
        'success',
        '문의 접수 완료!',
        '문의가 정상적으로 접수되었습니다.<br>빠른 시일 내에 연락드리겠습니다.'
      );
      
      // 폼 초기화
      form.reset();
      selectedProducts = {purchase: [], rental: []};
      tempSelectedProducts = [];
      
      // 🔥 파일 목록 초기화 (렌탈 폼인 경우)
      if (formId === 'rental-form') {
        rentalUploadedFiles = [];
        renderFileList();
      }
      
      // 🔥 검증 상태 초기화
      Object.keys(formValidationStates[formType]).forEach(key => {
        if (key === 'phone' && formType === 'general') {
          formValidationStates[formType][key] = true; // 일반문의 전화번호는 선택사항
        } else if (key === 'company') {
          formValidationStates[formType][key] = true; // 회사명은 선택사항
        } else {
          formValidationStates[formType][key] = false;
        }
      });
      
      // 🔥 모든 필드 상태 초기화
      const allFields = form.querySelectorAll('.gfnew-input, .gfnew-select, .gfnew-textarea');
      allFields.forEach(field => {
        field.classList.remove('error', 'valid');
      });
      
      // 🔥 모든 오류 메시지 숨김
      const allErrors = form.querySelectorAll('.gfnew-error-message');
      allErrors.forEach(error => {
        error.classList.remove('show');
      });
      
      // 선택된 제품 목록 초기화
      document.querySelectorAll('.gfnew-selected-list').forEach(list => {
        list.classList.remove('show');
        list.innerHTML = '';
      });

      // 🔥 제품 선택 섹션 초기화 (초록색 제거)
      document.querySelectorAll('.gfnew-product-section').forEach(section => {
        section.classList.remove('valid', 'error');
      });

      // 🔥 제품 선택 박스 원래 색으로 복원
      document.querySelectorAll('.gfnew-product-add-box').forEach(box => {
        box.style.borderColor = '#e63946';
        box.style.background = 'transparent';
        box.style.color = '#e63946';
      });

      // 🔥 렌탈 안내 문구 초기화
      const rentalGuide = document.getElementById('rental-guide');
      if (rentalGuide) {
        rentalGuide.classList.remove('show');
      }
      const rentalCount = document.getElementById('rental-current-count');
      if (rentalCount) {
        rentalCount.textContent = '0';
        rentalCount.classList.remove('sufficient');
      }
      
      // 예산 비교 섹션 숨기기
      const purchaseBudget = document.getElementById('purchase-budget-compare');
      const rentalBudget = document.getElementById('rental-budget-compare');
      if (purchaseBudget) purchaseBudget.style.display = 'none';
      if (rentalBudget) rentalBudget.style.display = 'none';
      
      // 🔥 제출 버튼 비활성화
      updateSubmitButton(formType);
      
    } catch (error) {
      // 에러 처리
      hideLoadingModal();
      console.error('Error:', error);
      showCustomAlert(
        'error',
        '전송 실패',
        '문의 전송 중 오류가 발생했습니다.<br>잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setTimeout(() => {
        window.isFormSubmitting = false;
      }, 100);
    }
  });
});

/*
████████████████████████████████████████████████████████████████████████████████
██                         UTILITY FUNCTIONS                                 ██
██                            유틸리티 함수                                     ██
████████████████████████████████████████████████████████████████████████████████
*/

// 숫자 포맷팅 함수
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 숫자만 추출하는 함수
function extractNumber(str) {
  return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    FORM VALIDATION FUNCTIONS                              ██
██                    폼 검증 함수들 (새로 추가)                                ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 스팸 방지: 체류시간 확인
function checkMinimumStayTime() {
  const currentTime = Date.now();
  const stayTime = currentTime - pageLoadTime;
  return stayTime >= 30000; // 30초 이상
}

// 🔥 스팸 방지: 재제출 확인
function checkResubmissionLimit(email) {
  const lastSubmitKey = `lastSubmit_${email}`;
  const lastSubmitTime = localStorage.getItem(lastSubmitKey);
  
  if (lastSubmitTime) {
    const timeDiff = Date.now() - parseInt(lastSubmitTime);
    const twoHours = 2 * 60 * 60 * 1000; // 2시간
    return timeDiff >= twoHours;
  }
  
  return true; // 첫 제출이면 허용
}

// 🔥 재제출 시간 기록
function recordSubmissionTime(email) {
  const lastSubmitKey = `lastSubmit_${email}`;
  localStorage.setItem(lastSubmitKey, Date.now().toString());
}

// 🔥 허니팟 검증
function validateHoneypot() {
  const honeypot = document.getElementById('honeypot');
  return !honeypot || honeypot.value === '';
}

// 🔥 이름 검증 (한글, 영문, 공백만 허용)
function validateName(name) {
  if (!name || name.trim() === '') {
    return { valid: false, message: '이름을 입력해주세요.' };
  }
  
  // 한글, 영문, 공백만 허용
  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, message: '이름은 한글, 영문, 공백만 입력 가능합니다.' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, message: '이름은 최소 2자 이상 입력해주세요.' };
  }
  
  return { valid: true, message: '' };
}

// 🔥 이메일 검증 (형식 검증만, 도메인 제한 없음)
function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { valid: false, message: '이메일을 입력해주세요.' };
  }
  
  // 기본 이메일 형식 검증만 수행
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }
  
  // 모든 도메인 허용
  return { valid: true, message: '' };
}

// 🔥 오류 메시지 표시/숨김
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.classList.remove('show');
  }
}

// 🔥 입력 필드 상태 변경
function setFieldState(field, isValid) {
  if (!field) return;
  
  field.classList.remove('error', 'valid');
  if (isValid) {
    field.classList.add('valid');
  } else {
    field.classList.add('error');
  }
}

// 🔥 제출 버튼 활성화/비활성화
function updateSubmitButton(formType) {
  const submitButton = document.getElementById(`${formType}-submit`);
  if (!submitButton) return;
  
  const formState = formValidationStates[formType];
  const allValid = Object.values(formState).every(state => state === true);
  
  submitButton.disabled = !allValid;
}

// 🔥 실시간 검증 함수 - 렌탈 기간 변경 이벤트 추가
function setupRealTimeValidation() {
  // 모든 폼에 대해 실시간 검증 설정
  ['general', 'purchase', 'rental'].forEach(formType => {
    const form = document.getElementById(`${formType}-form`);
    if (!form) return;
    
    // 이름 검증
    const nameField = form.querySelector('input[name="name"]');
    if (nameField) {
      nameField.addEventListener('input', function() {
        const result = validateName(this.value);
        formValidationStates[formType].name = result.valid;
        
        if (result.valid) {
          hideError(`${formType}-name-error`);
          setFieldState(this, true);
        } else {
          showError(`${formType}-name-error`, result.message);
          setFieldState(this, false);
        }
        
        updateSubmitButton(formType);
      });
    }
    
    // 이메일 검증
    const emailField = form.querySelector('input[name="email"]');
    if (emailField) {
      emailField.addEventListener('input', function() {
        const result = validateEmail(this.value);
        formValidationStates[formType].email = result.valid;
        
        if (result.valid) {
          hideError(`${formType}-email-error`);
          setFieldState(this, true);
        } else {
          showError(`${formType}-email-error`, result.message);
          setFieldState(this, false);
        }
        
        updateSubmitButton(formType);
      });
    }

    // ✅ 이 코드가 있는지 확인하고, 없으면 추가하세요
    // 🔥 렌탈 기간 검증 (렌탈만) - 수정된 버전
    if (formType === 'rental') {
      const periodField = form.querySelector('select[name="rental-period"]');
      if (periodField) {
        periodField.addEventListener('change', function() {
          const hasValue = this.value !== '';
          formValidationStates[formType].rentalPeriod = hasValue;
          
          if (hasValue) {
            hideError(`${formType}-period-error`);
            setFieldState(this, true);
          } else {
            showError(`${formType}-period-error`, '렌탈 기간을 선택해주세요.');
            setFieldState(this, false);
          }
          
          // 🔥 렌탈 기간 변경 시 모든 제품 가격 업데이트
          updateAllRentalPrices();
          
          updateSubmitButton(formType);
        });
      }
    }
    
      // 전화번호 검증 (모든 폼에서 필수) - 🔥 수정됨
      const phoneField = form.querySelector('input[name="phone"]');
      if (phoneField) {  // 🔥 조건 제거 - 모든 폼에서 검증
      phoneField.addEventListener('input', function() {
        const hasValue = this.value.trim() !== '';
        formValidationStates[formType].phone = hasValue;
        
        if (hasValue) {
          hideError(`${formType}-phone-error`);
          setFieldState(this, true);
        } else {
          showError(`${formType}-phone-error`, '전화번호를 입력해주세요.');
          setFieldState(this, false);
        }
        
        updateSubmitButton(formType);
      });
    }



    
    // 문의 유형 검증 (일반문의만)
    if (formType === 'general') {
      const inquiryField = form.querySelector('select[name="inquiry-type"]');
      if (inquiryField) {
        inquiryField.addEventListener('change', function() {
          const hasValue = this.value !== '';
          formValidationStates[formType].inquiryType = hasValue;
          
          if (hasValue) {
            hideError(`${formType}-inquiry-type-error`);
            setFieldState(this, true);
          } else {
            showError(`${formType}-inquiry-type-error`, '문의 유형을 선택해주세요.');
            setFieldState(this, false);
          }
          
          updateSubmitButton(formType);
        });
      }
      
      // 문의 내용 검증
      const messageField = form.querySelector('textarea[name="message"]');
      if (messageField) {
        messageField.addEventListener('input', function() {
          const hasValue = this.value.trim() !== '';
          formValidationStates[formType].message = hasValue;
          
          if (hasValue) {
            hideError(`${formType}-message-error`);
            setFieldState(this, true);
          } else {
            showError(`${formType}-message-error`, '문의 내용을 입력해주세요.');
            setFieldState(this, false);
          }
          
          updateSubmitButton(formType);
        });
      }
    }
    
    // 개인정보 동의 검증
    const privacyField = form.querySelector('input[name="privacy-agree"]');
    if (privacyField) {
      privacyField.addEventListener('change', function() {
        formValidationStates[formType].privacyAgree = this.checked;
        updateSubmitButton(formType);
      });
    }
  });
}

// 🔥 제품 선택 검증 (구매 1개 이상, 렌탈 5개 이상 + 안내 문구)
function validateProductSelection(formType) {
  // formType이 없으면 현재 활성 탭 사용
  if (!formType) {
    formType = currentFormType;
  }
  
  // 일반 문의는 제품 선택이 없으므로 제외
  if (formType === 'general') {
    return;
  }
  
  const hasProducts = selectedProducts[formType] && selectedProducts[formType].length > 0;
  
  // 🔥 렌탈은 5개 이상, 구매는 1개 이상 확인
  let isValidCount = false;
  let errorMessage = '';
  
  if (formType === 'rental') {
    // 렌탈: 총 수량 5개 이상 확인 (개별 제품의 quantity 합산)
    const totalQuantity = selectedProducts[formType].reduce((total, product) => {
      return total + product.quantity;
    }, 0);
    
    isValidCount = totalQuantity >= 5;
    errorMessage = isValidCount ? '' : '렌탈 견적 요청을 위해 최소 5개 이상의 제품을 선택해주세요.';
    
    // 🔥 렌탈 안내 문구 업데이트
    updateRentalGuideMessage(totalQuantity, isValidCount);
    
  } else if (formType === 'purchase') {
    // 구매: 1개 이상
    isValidCount = hasProducts;
    errorMessage = isValidCount ? '' : '최소 1개 이상의 제품을 선택해주세요.';
  }
  
  formValidationStates[formType].products = isValidCount;
  
  // 해당 폼의 제품 섹션 찾기
  const form = document.getElementById(`${formType}-form`);
  const productSection = form ? form.querySelector('.gfnew-product-section') : null;
  
  if (productSection) {
    productSection.classList.remove('error', 'valid');
    if (isValidCount) {
      productSection.classList.add('valid');
      hideError(`${formType}-products-error`);
    } else {
      productSection.classList.add('error');
      showError(`${formType}-products-error`, errorMessage);
    }
  }
  
  updateSubmitButton(formType);
}

// 🔥 렌탈 안내 문구 업데이트 (새로 추가)
function updateRentalGuideMessage(currentQuantity, isValid) {
  const guideElement = document.getElementById('rental-guide');
  const countElement = document.getElementById('rental-current-count');
  
  if (!guideElement || !countElement) return;
  
  // 현재 수량 업데이트
  countElement.textContent = currentQuantity;
  
  // 수량에 따라 색상 변경
  countElement.classList.remove('sufficient');
  if (currentQuantity >= 5) {
    countElement.classList.add('sufficient');
  }
  
  // 안내 문구 표시/숨김
  if (isValid) {
    // 5개 이상이면 안내 문구 숨김
    guideElement.classList.remove('show');
  } else {
    // 5개 미만이면 안내 문구 표시
    guideElement.classList.add('show');
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    FORM VALIDATION FUNCTIONS 끝                           ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                      BUDGET INPUT HANDLERS                                ██
██                         예산 입력 핸들러                                    ██
████████████████████████████████████████████████████████████████████████████████
*/

// 예산 입력 시 실시간 포맷팅
document.addEventListener('DOMContentLoaded', function() {
  const purchaseBudget = document.getElementById('purchase-budget');
  const rentalBudget = document.getElementById('rental-budget');
  
  if (purchaseBudget) {
    purchaseBudget.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = formatNumber(value) + '원';
      }
      const len = e.target.value.length;
      e.target.setSelectionRange(len - 1, len - 1);
    });
  }
  
  if (rentalBudget) {
    rentalBudget.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = formatNumber(value) + '원';
      }
      const len = e.target.value.length;
      e.target.setSelectionRange(len - 1, len - 1);
    });
  }
});

/*
████████████████████████████████████████████████████████████████████████████████
██                     QUOTATION CART IMPORT (수정됨)                        ██
██                        견적함 불러오기 기능                                  ██
████████████████████████████████████████████████████████████████████████████████
*/

// 견적함에서 제품 불러오기
function loadFromQuotationCart() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromTab = urlParams.get('tab');
  
  const savedCart = localStorage.getItem('gofitQuotation');
  if (!savedCart) return;
  
  try {
    const cartItems = JSON.parse(savedCart);
    if (cartItems.length === 0) return;
    
    if (fromTab === 'purchase') {
      const purchaseTab = document.querySelector('.gfnew-tab[onclick*="purchase"]');
      if (purchaseTab) {
        purchaseTab.click();
      }
      
      setTimeout(() => {
        cartItems.forEach(item => {
          const product = GOFIT_PRODUCTS.find(p => p.id === item.id);
          if (product) {
            selectedProducts.purchase.push({...product, quantity: 1});
          }
        });
        
        currentFormType = 'purchase';
        renderSelectedProducts();
        
        // 🔥 추가됨: 예상 견적서 업데이트
        updateBudgetComparison();
        
        // 🔥 추가됨: 제품 선택 검증
        validateProductSelection('purchase');
        
        showImportNotification(cartItems.length, '구입');
        
        if (confirm('제품을 불러왔습니다. 견적함을 비우시겠습니까?')) {
          localStorage.removeItem('gofitQuotation');
        }
      }, 500);
    } else if (fromTab === 'rental') {
      const rentalTab = document.querySelector('.gfnew-tab[onclick*="rental"]');
      if (rentalTab) {
        rentalTab.click();
      }
      
      setTimeout(() => {
        cartItems.forEach(item => {
          const product = GOFIT_PRODUCTS.find(p => p.id === item.id);
          if (product) {
            // 🔥 렌탈 제품은 기본 12개월 기준으로 가격 계산
            const productToAdd = {...product, quantity: 1};
            productToAdd.originalRentalPrice = product.rentalPrice; // 원본 가격 저장
            productToAdd.rentalPrice = calculateRentalPrice(product.rentalPrice, 12); // 12개월 기준
            selectedProducts.rental.push(productToAdd);
          }
        });
        
        currentFormType = 'rental';
        renderSelectedProducts();
        
        // 🔥 추가됨: 렌탈 예상 견적서 업데이트
        updateRentalBudgetComparison();
        
        // 🔥 추가됨: 제품 선택 검증
        validateProductSelection('rental');
        
        showImportNotification(cartItems.length, '렌탈');
        
        if (confirm('제품을 불러왔습니다. 견적함을 비우시겠습니까?')) {
          localStorage.removeItem('gofitQuotation');
        }
      }, 500);
    }
  } catch (e) {
    console.error('견적함 데이터 로드 실패:', e);
  }
}

/*
████████████████████████████████████████████████████████████████████████████████
██                     QUOTATION CART IMPORT 끝                              ██
████████████████████████████████████████████████████████████████████████████████
*/

// 불러오기 완료 알림
function showImportNotification(count, type = '구입') {
  const notification = document.createElement('div');
  notification.className = 'gfnew-import-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>견적함에서 ${count}개의 제품을 ${type} 견적서로 불러왔습니다.</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/*
████████████████████████████████████████████████████████████████████████████████
██                      PAGE LEAVE WARNING                                   ██
██                         페이지 이탈 경고                                     ██
████████████████████████████████████████████████████████████████████████████████
*/

// 페이지 이탈 경고 기능
function setupPageLeaveWarning() {
  window.addEventListener('beforeunload', function(e) {
    if (window.isFormSubmitting) {
      return;
    }
    
    const hasData = checkIfFormHasData();
    
    if (hasData) {
      const message = '작성 중인 견적서가 있습니다. 페이지를 나가시면 작성하신 내용이 모두 사라집니다. 정말 나가시겠습니까?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    }
  });
}

// 폼에 데이터가 있는지 확인하는 함수
function checkIfFormHasData() {
  const activeForm = document.querySelector('.gfnew-form-panel.active');
  if (!activeForm) return false;
  
  const inputs = activeForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
  for (let input of inputs) {
    if (input.value.trim() !== '') {
      return true;
    }
  }
  
  const selects = activeForm.querySelectorAll('select');
  for (let select of selects) {
    if (select.value !== '' && select.selectedIndex !== 0) {
      return true;
    }
  }
  
  if (activeTab === 'purchase' && selectedProducts.purchase.length > 0) {
    return true;
  }
  if (activeTab === 'rental' && selectedProducts.rental.length > 0) {
    return true;
  }
  
  const checkboxes = activeForm.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length > 0) {
    return true;
  }
  
  return false;
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    URL 파라미터 자동 입력 기능 (수정됨)                       ██
████████████████████████████████████████████████████████████████████████████████
*/

/**
 * URL 파라미터를 읽어서 자동으로 폼 입력하는 함수
 */
function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  const productName = urlParams.get('product');
  
  // 🔥 탭이 지정되어 있으면 해당 탭으로 자동 전환 🔥
  if (tab) {
    const tabButtons = document.querySelectorAll('.gfnew-tab');
    let targetButton = null;
    
    tabButtons.forEach(button => {
      const buttonText = button.textContent.trim();
      if (
        (tab === 'general' && buttonText === '일반 문의') ||
        (tab === 'purchase' && buttonText === '구입 견적서') ||
        (tab === 'rental' && buttonText === '렌탈 견적서')
      ) {
        targetButton = button;
      }
    });
    
    // 해당 탭으로 전환
    if (targetButton) {
      setTimeout(() => {
        targetButton.click();
        
        // 🔥 제품명이 있으면 문의 내용에 자동 입력 🔥
        if (productName && tab === 'general') {
          setTimeout(() => {
            const textarea = document.querySelector('#general-form .gfnew-textarea');
            if (textarea) {
              const decodedProductName = decodeURIComponent(productName);
              textarea.value = `<${decodedProductName} 문의 사항이 있어요!>\n\n`;
              
              // 🔥 수정됨: PC에서만 포커스, 모바일에서는 키보드 방지 🔥
              if (window.innerWidth > 768) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
              } else {
                // 🔥 모바일에서는 포커스 없이 커서만 끝으로 이동 🔥
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
              }
              
              showAutoFillNotification(decodedProductName);
            }
          }, 300);
        }
      }, 100);
    }
  }
}

/**
 * 자동 입력 완료 알림을 표시하는 함수
 */
function showAutoFillNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'gfnew-autofill-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>"${productName}" 제품 문의 내용이 자동으로 입력되었습니다.</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    URL 파라미터 자동 입력 기능 수정 끝                        ██
████████████████████████████████████████████████████████████████████████████████
*/

function init() {

  
  loadContactProducts();
  setupContactScrollAnimations();
  loadFromQuotationCart();
  setupPageLeaveWarning();
  
  // 🔥 URL 파라미터 처리 추가 🔥
  handleURLParameters();
  
  // 🔥 실시간 검증 설정 (새로 추가)
  setupRealTimeValidation();
  
  // 🔥 모든 제출 버튼 초기 상태를 비활성화로 설정
  ['general', 'purchase', 'rental'].forEach(formType => {
    updateSubmitButton(formType);
  });
  
  // 🆕 주요 이미지 미리 로드 (성능 개선)
  preloadImportantImages();
  
  // 🔥 파일 업로드 기능 초기화 (새로 추가)
  initializeFileUpload();
  
  // 🔥 렌탈 안내 문구 초기 설정 (기존 코드 뒤에 추가)
  // 페이지 로드 시 현재 활성 탭이 렌탈이면 안내 문구 표시
  setTimeout(() => {
    if (activeTab === 'rental') {
      const totalQuantity = selectedProducts.rental.reduce((total, product) => {
        return total + product.quantity;
      }, 0);
      updateRentalGuideMessage(totalQuantity, totalQuantity >= 5);
    }
  }, 500); // 탭 전환 애니메이션 완료 후 실행
  

}

// DOM 로드 완료 시 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/*
████████████████████████████████████████████████████████████████████████████████
██                           초기화 함수 수정 끝                                ██
████████████████████████████████████████████████████████████████████████████████
*/

/*
████████████████████████████████████████████████████████████████████████████████
██                       GLOBAL FUNCTION EXPORT                              ██
██                         전역 함수 등록                                      ██
████████████████████████████████████████████████████████████████████████████████
*/

// 전역 함수 등록
window.showTab = showTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.filterProducts = filterProducts;
window.toggleProduct = toggleProduct;
window.confirmSelection = confirmSelection;
window.changeQuantity = changeQuantity;
window.removeProduct = removeProduct;
window.updateBudgetComparison = updateBudgetComparison;
window.updateRentalBudgetComparison = updateRentalBudgetComparison;
window.loadMoreProducts = loadMoreProducts;

/*
████████████████████████████████████████████████████████████████████████████████
██                    FILE UPLOAD FUNCTIONALITY                              ██
██                    파일 업로드 기능 (새로 추가)                             ██
████████████████████████████████████████████████████████████████████████████████
*/

// 🔥 렌탈 폼 업로드된 파일들 저장 배열
let rentalUploadedFiles = [];

// 🔥 파일 업로드 초기화 함수
function initializeFileUpload() {
  const fileInput = document.getElementById('rental-file-input');
  const dropZone = document.querySelector('.gfnew-file-drop-zone');
  const fileList = document.getElementById('rental-file-list');
  
  if (!fileInput || !dropZone || !fileList) return;
  
  // 파일 선택 이벤트
  fileInput.addEventListener('change', handleFileSelect);
  
  // 드래그 앤 드롭 이벤트
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleFileDrop);
  

}

// 🔥 파일 선택 처리
function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  processSelectedFiles(files);
}

// 🔥 드래그 오버 처리
function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('dragover');
}

// 🔥 드래그 리브 처리
function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
}

// 🔥 파일 드롭 처리
function handleFileDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  
  const files = Array.from(event.dataTransfer.files);
  processSelectedFiles(files);
}

// 🔥 선택된 파일들 처리
function processSelectedFiles(newFiles) {
  // 파일 개수 제한 확인 (최대 5개)
  const totalFiles = rentalUploadedFiles.length + newFiles.length;
  if (totalFiles > 5) {
    showCustomAlert(
      'error',
      '파일 개수 초과',
      `최대 5개 파일까지만 업로드 가능합니다.<br>현재: ${rentalUploadedFiles.length}개, 추가하려는 파일: ${newFiles.length}개`
    );
    return;
  }
  
  // 각 파일 검증 및 추가
  newFiles.forEach(file => {
    if (validateFile(file)) {
      rentalUploadedFiles.push(file);
    }
  });
  
  // 파일 목록 업데이트
  renderFileList();
  
  // 검증 상태 업데이트
  validateFileSelection();
  
  // 파일 입력 초기화 (같은 파일 재선택 가능하게)
  const fileInput = document.getElementById('rental-file-input');
  if (fileInput) fileInput.value = '';
}

// 🔥 개별 파일 검증
function validateFile(file) {
  // 파일 형식 검증
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    showCustomAlert(
      'error',
      '지원하지 않는 파일 형식',
      `${file.name}<br>JPG, PNG, GIF, PDF 파일만 업로드 가능합니다.`
    );
    return false;
  }
  
  // 파일 크기 검증 (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showCustomAlert(
      'error',
      '파일 크기 초과',
      `${file.name}<br>파일 크기는 10MB 이하여야 합니다.<br>현재 크기: ${formatFileSize(file.size)}`
    );
    return false;
  }
  
  // 중복 파일 검증
  const isDuplicate = rentalUploadedFiles.some(existingFile => 
    existingFile.name === file.name && existingFile.size === file.size
  );
  
  if (isDuplicate) {
    showCustomAlert(
      'error',
      '중복 파일',
      `${file.name}<br>이미 업로드된 파일입니다.`
    );
    return false;
  }
  
  return true;
}

// 🔥 파일 목록 렌더링
function renderFileList() {
  const fileList = document.getElementById('rental-file-list');
  if (!fileList) return;
  
  if (rentalUploadedFiles.length === 0) {
    fileList.style.display = 'none';
    fileList.classList.remove('show');
    return;
  }
  
  fileList.style.display = 'block';
  fileList.classList.add('show');
  
  fileList.innerHTML = rentalUploadedFiles.map((file, index) => {
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    return `
      <div class="gfnew-file-item">
        <div class="gfnew-file-icon">
          <i class="${fileIcon}"></i>
        </div>
        <div class="gfnew-file-info">
          <div class="gfnew-file-name">${file.name}</div>
          <div class="gfnew-file-size">${fileSize}</div>
        </div>
        <button type="button" class="gfnew-file-remove" onclick="removeFile(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }).join('');
}

// 🔥 파일 아이콘 결정
function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) {
    return 'fas fa-image';
  } else if (fileType === 'application/pdf') {
    return 'fas fa-file-pdf';
  } else {
    return 'fas fa-file';
  }
}

// 🔥 파일 크기 포맷팅
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 🔥 파일 삭제
function removeFile(index) {
  rentalUploadedFiles.splice(index, 1);
  renderFileList();
  validateFileSelection();
}

// 🔥 파일 선택 검증 (선택사항이므로 항상 true)
function validateFileSelection() {
  // 파일 업로드는 선택사항이므로 항상 유효
  // 하지만 향후 필수로 변경할 경우를 대비해 함수는 유지

  return true;
}

/*
████████████████████████████████████████████████████████████████████████████████
██                    FILE UPLOAD FUNCTIONALITY 끝                           ██
████████████████████████████████████████████████████████████████████████████████
*/