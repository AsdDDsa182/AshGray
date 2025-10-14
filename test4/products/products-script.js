/* 
████████████████████████████████████████████████████████████████████████████████
██                           MAIN SCRIPT START                               ██
██                         메인 스크립트 시작                                   ██
████████████████████████████████████████████████████████████████████████████████
*/
(function() {
  'use strict';
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                           GLOBAL VARIABLES                               ██
  ██                             전역 변수                                     ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  // 필터링 관련 변수
  let currentCategory = 'all';           // 현재 선택된 카테고리
  
  // 제품 관련 변수
  let products = [];                     // 전체 제품 데이터 배열
// 🔥 화면 크기에 따라 자동으로 제품 개수 계산하는 함수 🔥
function getProductsPerPage() {
  const screenWidth = window.innerWidth;
  
  if (screenWidth >= 1400) {
    return 4; // 대형 데스크톱: 4개씩 보여줌
  } else if (screenWidth >= 1200) {
    return 3; // 데스크톱: 3개씩 보여줌  
  } else if (screenWidth >= 768) {
    return 2; // 태블릿: 2개씩 보여줌
  } else {
    return 2; // 모바일: 2개씩 보여줌
  }
}

// 🔥 한 번에 보여줄 제품 수를 화면 크기에 맞게 설정 🔥
let productsPerPage = getProductsPerPage() * 2; // 2줄씩 보여주기 위해 *2
let currentlyShowing = productsPerPage; // 현재 화면에 보여지는 제품 수

// 🔥 화면 크기가 변경될 때마다 제품 개수 재계산 🔥
window.addEventListener('resize', function() {
  const newProductsPerPage = getProductsPerPage() * 2;
  
  // 화면 크기가 바뀌면 제품 개수도 업데이트
  if (newProductsPerPage !== productsPerPage) {
    // 🔥 현재 보여지는 제품 수를 새로운 단위에 맞게 조정 🔥
    const currentRows = Math.ceil(currentlyShowing / productsPerPage);
    
    productsPerPage = newProductsPerPage;
    
    // 🔥 기존에 보던 줄 수는 유지하되, 새로운 화면에 맞게 계산 🔥
    currentlyShowing = Math.max(newProductsPerPage, currentRows * newProductsPerPage);
    
    renderProducts(); // 제품 다시 렌더링
  }
});
  
  // 견적함 관련 변수
  let quotationCart = [];                // 견적함에 담긴 제품들
  
  // 💡 페이지당 제품 수 변경 방법:
  // productsPerPage = 3;   // 3개씩 보여주기
  // productsPerPage = 9;   // 9개씩 보여주기
  // productsPerPage = 12;  // 12개씩 보여주기
  // currentlyShowing = productsPerPage; // 초기값도 같이 변경
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                        GLOBAL VARIABLES 끝                              ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
/* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                        INITIALIZATION                                   ██
  ██                         초기화 함수들                                     ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 메인 초기화 함수
   * 페이지 로드 시 모든 기능을 초기화합니다
   */
  function initProducts() {

    
    // 로컬스토리지에서 견적함 데이터 불러오기
    loadQuotationCart();
    
    // 제품 데이터 로드 및 렌더링
    loadProductsData();
    
    // 각종 필터 및 기능 초기화
    initCategoryFilters();    // 카테고리 필터 (전체, 카디오, 근력운동, 기능성, 프로모션)
    initModal();              // 제품 상세 모달
    initSmoothScroll();       // 부드러운 스크롤
    initLoadMore();           // 더보기 버튼
    
    // 견적함 플로팅 버튼 생성
    createFloatingCartButton();
  }
  
  /**
   * 히어로 섹션 초기화
   * 현재는 특별한 기능이 없지만 향후 확장을 위해 준비
   */
  function initProductsHero() {

    // 필요한 경우 나중에 추가 기능을 여기에 구현
  }
  
  /**
   * 더보기 버튼 초기화
   * 클릭 시 추가 제품들을 로드합니다
   */
  function initLoadMore() {
    const loadMoreBtn = document.querySelector('.gf-prod-load-btn');
    
    loadMoreBtn?.addEventListener('click', function() {
      // 현재 필터에 맞는 제품들 가져오기
      const filteredProducts = getFilteredProducts();
      
      // 더 보여줄 제품이 있는지 확인
      if (currentlyShowing < filteredProducts.length) {
        // 🔥 기존에 보여진 제품 수 저장 🔥
        const previousCount = currentlyShowing;
        
        // 추가로 보여줄 제품 수 증가
        currentlyShowing += productsPerPage;
        
        // 로딩 상태 표시
        this.innerHTML = `
          <span>로딩중...</span>
          <i class="fas fa-spinner fa-spin"></i>
        `;
        
        // 약간의 지연 후 새로운 제품들만 추가
        setTimeout(() => {
          // 🔥 새로운 제품들만 추가하는 함수 호출 🔥
          addNewProducts(filteredProducts, previousCount);
          
          // 버튼 텍스트 복구
          const remaining = filteredProducts.length - currentlyShowing;
          if (remaining > 0) {
            this.innerHTML = `
              <span>더 많은 제품 보기 (${remaining}개)</span>
              <i class="fas fa-chevron-down"></i>
            `;
          } else {
            // 🔥 더 이상 제품이 없으면 버튼 숨기기 🔥
            const loadMoreContainer = document.querySelector('.gf-prod-load-more');
            if (loadMoreContainer) {
              loadMoreContainer.style.display = 'none';
            }
          }
        }, 500);
      }
    });
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                      INITIALIZATION 끝                                  ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
/* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                         PRODUCT RENDERING                               ██
  ██                         제품 렌더링 함수들                                ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 현재 필터에 맞는 제품들을 반환하는 함수
   * @returns {Array} 필터링된 제품 배열
   */
  function getFilteredProducts() {
    return products.filter(product => {
      // ★ 프로모션 카테고리 처리 ★
      if (currentCategory === 'promotion') {
        // 프로모션 카테고리일 때는 PROMOTION 뱃지가 있는 제품만 표시
        if (!product.badge) return false;
        const badges = Array.isArray(product.badge) ? product.badge : [product.badge];
        return badges.some(badge => badge.toLowerCase() === 'promotion');
      }
      
      // 일반 카테고리 필터링
      return currentCategory === 'all' || product.category === currentCategory;
    });
  }
  
  /**
   * 제품 카드들을 화면에 렌더링하는 메인 함수
   * 필터링된 제품들을 현재 설정에 맞게 표시합니다
   */
  function renderProducts() {
    const grid = document.querySelector('.gf-prod-grid');
    if (!grid) return;
    
    // 기존 카드들 모두 제거
    grid.innerHTML = '';
    
    // 현재 필터 조건에 맞는 제품들 가져오기
    const filteredProducts = getFilteredProducts();
    
    // 🔥 제품이 없는 경우 빈 상태 메시지 표시 🔥
    if (filteredProducts.length === 0) {
      showEmptyState(grid);
      hideLoadMoreButton();
      updateProductCount();
      return;
    }
    
    // 현재 보여줄 제품들만 선택
    const productsToShow = filteredProducts.slice(0, currentlyShowing);
    
    // 각 제품에 대해 카드 생성
    productsToShow.forEach(product => {
      const card = createProductCard(product);
      grid.appendChild(card);
    });
    
    // 더보기 버튼 표시/숨김 처리
    const loadMoreBtn = document.querySelector('.gf-prod-load-more');
    const loadBtn = document.querySelector('.gf-prod-load-btn');
    if (loadMoreBtn && loadBtn) {
      if (currentlyShowing >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';      // 더 이상 보여줄 제품이 없으면 숨김
      } else {
        loadMoreBtn.style.display = 'block';
        const remaining = filteredProducts.length - currentlyShowing;
        loadBtn.innerHTML = `
          <span>더 많은 제품 보기 (${remaining}개)</span>
          <i class="fas fa-chevron-down"></i>
        `;
      }
    }
    
    // 렌더링 후 이벤트와 애니메이션 재설정
    initProductCards();      // 카드 클릭 이벤트
    initScrollAnimations();  // 스크롤 애니메이션
    updateProductCount();    // 제품 개수 업데이트
  }
  
  /**
   * 🔥 새로운 제품들만 추가하는 함수 🔥
   * @param {Array} filteredProducts - 필터링된 전체 제품 목록
   * @param {number} startIndex - 시작 인덱스 (기존에 표시된 제품 수)
   */
  function addNewProducts(filteredProducts, startIndex) {
    const grid = document.querySelector('.gf-prod-grid');
    if (!grid) return;
    
    // 새로 추가할 제품들만 선택
    const newProducts = filteredProducts.slice(startIndex, currentlyShowing);
    
    // 각 새 제품에 대해 카드 생성 및 추가
    newProducts.forEach((product, index) => {
      const card = createProductCard(product);
      
      // 🔥 초기 상태: 투명하고 아래쪽에 위치 🔥
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'none';
      
      // 그리드에 추가
      grid.appendChild(card);
      
      // 🔥 순차적으로 나타나는 애니메이션 🔥
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100); // 100ms씩 지연
    });
    
    // 새로 추가된 카드들의 이벤트 초기화
    initProductCards();
    updateProductCount();
  }
  
  /**
   * 🔥 빈 상태 메시지를 표시하는 함수
   * @param {HTMLElement} container - 메시지를 표시할 컨테이너
   */
  function showEmptyState(container) {
    const categoryName = getCategoryDisplayName(currentCategory);
    
    const emptyStateHTML = `
      <div class="gf-prod-empty-state">
        <div class="gf-prod-empty-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h3 class="gf-prod-empty-title">현재 제품을 준비 중입니다</h3>
        <p class="gf-prod-empty-description">
          ${categoryName} 카테고리의 제품을 곧 업데이트할 예정입니다.<br>
          조금만 기다려 주세요!
        </p>
        <div class="gf-prod-empty-actions">
          <button class="gf-prod-empty-btn" id="goToAllProducts">
            전체 제품 보기
          </button>
        </div>
      </div>
    `;
    
    container.innerHTML = emptyStateHTML;
    
    // 🔥 이벤트 리스너 직접 바인딩 🔥
    setTimeout(() => {
      const emptyState = container.querySelector('.gf-prod-empty-state');
      if (emptyState) {
        emptyState.classList.add('show');
      }
      
      // 버튼 클릭 이벤트 바인딩
      const goToAllBtn = container.querySelector('#goToAllProducts');
      if (goToAllBtn) {
        goToAllBtn.addEventListener('click', filterToAllProducts);
      }
    }, 100);
  }

  /**
   * 🔥 더보기 버튼 숨기기
   */
  function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.gf-prod-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
  }

  /**
   * 🔥 카테고리 표시명을 가져오는 함수
   * @param {string} category - 카테고리 키
   * @returns {string} 한글 카테고리명
   */
  function getCategoryDisplayName(category) {
    const categoryNames = {
      'All': 'All',
      'Promotion': 'Promotion',
      'Weight': 'Weight',
      'Free weights': 'Free weights',
      'Cardio': 'Cardio'
    };
    return categoryNames[category] || category;
  }

  /**
   * 🔥 전체 제품으로 필터링하는 함수 (빈 상태에서 호출)
   */
  function filterToAllProducts() {
    // 전체 카테고리 버튼 활성화
    const categoryButtons = document.querySelectorAll('.gf-prod-category-btn');
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === 'all') {
        btn.classList.add('active');
      }
    });
    
    // 전체 카테고리로 변경
    currentCategory = 'all';
    currentlyShowing = productsPerPage;
    
    // 제품 다시 렌더링
    renderProducts();
    updateFilterInfo();
    
    // 🔥 모바일에서 캐러셀 자동 이동 + PC에서 스크롤 🔥
    if (window.innerWidth <= 768) {
      // 모바일: 캐러셀을 전체 제품 탭으로 자동 이동
      const categorySection = document.querySelector('.gf-prod-categories');
      const allCategoryBtn = document.querySelector('.gf-prod-category-btn[data-category="all"]');
      
      if (categorySection && allCategoryBtn) {
        // 전체 제품 버튼의 위치 계산
        const btnRect = allCategoryBtn.getBoundingClientRect();
        const containerRect = categorySection.getBoundingClientRect();
        const scrollLeft = allCategoryBtn.offsetLeft - (containerRect.width / 2) + (btnRect.width / 2);
        
        // 부드러운 가로 스크롤
        categorySection.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
        
        // 세로 스크롤도 카테고리 영역으로
        setTimeout(() => {
          const offsetTop = categorySection.offsetTop - 80;
          window.scrollTo({ 
            top: offsetTop,
            behavior: 'smooth'
          });
        }, 300);
      }
    } else {
      // PC: 기존 방식 (카테고리 탭이 보이도록 스크롤)
      const categorySection = document.querySelector('.gf-prod-categories');
      if (categorySection) {
        const offsetTop = categorySection.offsetTop - 100;
        window.scrollTo({ 
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  }
  
  /**
   * 개별 제품 카드 HTML을 생성하는 함수
   * @param {Object} product - 제품 정보 객체
   * @returns {HTMLElement} 생성된 카드 DOM 요소
   */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'gf-prod-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-id', product.id);
    
    // ★★★ 이미지 경로 통일: images[0] 사용 ★★★
    const mainImageUrl = getProductMainImage(product);
    
    // 뱃지 HTML 생성 (NEW, BEST, PROMOTION 등)
    let badgeHTML = '';
    if (product.badge) {
      const badges = Array.isArray(product.badge) ? product.badge : [product.badge];
      badgeHTML = '<div class="gf-prod-badges-container">';
      badgeHTML += badges.map(badge => {
        const badgeClass = `badge-${badge.toLowerCase()}`;
        
        // PROMOTION 뱃지에만 스파클 아이콘 추가
        if (badge.toLowerCase() === 'promotion') {
          return `<div class="gf-prod-card-badge ${badgeClass}">
            <svg style="width: 14px; height: 14px; fill: currentColor; margin-right: 4px;" viewBox="0 0 24 26">
              <path d="M12 2l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/>
            </svg>
            ${badge}
          </div>`;
        } else {
          // NEW, BEST 등 다른 뱃지는 기존 그대로
          return `<div class="gf-prod-card-badge ${badgeClass}">${badge}</div>`;
        }
      }).join('');
      badgeHTML += '</div>';
    }
    
    /* 
    ████████████████████████████████████████████████████████████████████████████████
    ██                    가격 HTML 생성 (VAT 포함으로 변경)                        ██
    ████████████████████████████████████████████████████████████████████████████████
    */
    
    // 가격 HTML 생성 (할인가 있는 경우와 없는 경우 구분) - VAT 포함 계산
    let priceHTML = '';
    if (product.originalPrice) {
      // 할인 제품인 경우 - VAT 포함 계산
      const vatIncludedOriginalPrice = Math.round(product.originalPrice * 1.1);
      const vatIncludedPrice = Math.round(product.price * 1.1);
      
      priceHTML = `
        <div class="gf-prod-card-price">
          <div class="gf-prod-original-price">${window.gofitUtils.formatPrice(vatIncludedOriginalPrice)}</div>
          <div class="gf-prod-current-price">
            <div class="gf-prod-price-main">
              <span class="gf-prod-price-label">할인가</span>
              <span class="gf-prod-price-value gf-prod-price-discount-card">${window.gofitUtils.formatPrice(vatIncludedPrice)}</span>
            </div>
            <div class="gf-prod-vat-notice">VAT 포함</div>
          </div>
        </div>
      `;
    } else {
      // 일반 제품인 경우 - VAT 포함 계산
      const vatIncludedPrice = Math.round(product.price * 1.1);
      
      priceHTML = `
        <div class="gf-prod-card-price">
          <div class="gf-prod-current-price">
            <div class="gf-prod-price-main">
              <span class="gf-prod-price-label">판매가</span>
              <span class="gf-prod-price-value">${window.gofitUtils.formatPrice(vatIncludedPrice)}</span>
            </div>
            <div class="gf-prod-vat-notice">VAT 포함</div>
          </div>
        </div>
      `;
    }
    
    /* 
    ████████████████████████████████████████████████████████████████████████████████
    ██                  가격 HTML 생성 (VAT 포함으로 변경) 끝                       ██
    ████████████████████████████████████████████████████████████████████████████████
    */
    
    // 최종 카드 HTML 구성
    card.innerHTML = `
      <div class="gf-prod-card-image">
        <img src="${mainImageUrl}" alt="${product.name}">
        ${badgeHTML}
        <div class="gf-prod-card-overlay">
          <button class="gf-prod-quick-view">
            <i class="fas fa-search-plus"></i>
            <span>자세히 보기</span>
          </button>
        </div>
        <button class="gf-prod-cart-btn ${isInCart(product.id) ? 'active' : ''}" 
                data-product-id="${product.id}"
                title="${isInCart(product.id) ? '견적함에서 빼기' : '견적함에 담기'}">
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
      <div class="gf-prod-card-info">
        <span class="gf-prod-card-category">${getCategoryName(product.category)}</span>
        <h3 class="gf-prod-card-title">${product.name}</h3>
        <p class="gf-prod-card-code">${product.code}</p>
        ${priceHTML}
      </div>
    `;
    
    return card;
  }
  
  /**
   * ★★★ 제품의 메인 이미지 URL을 가져오는 함수 (이미지 경로 통일) ★★★
   * @param {Object} product - 제품 정보 객체
   * @returns {string} 메인 이미지 URL
   */
  function getProductMainImage(product) {
    // images 배열이 있고 비어있지 않으면 첫 번째 이미지 사용
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // images가 없으면 기본 placeholder 이미지
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                       PRODUCT RENDERING 끝                              ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                          DATA LOADING                                   ██
  ██                         데이터 로드 함수들                                ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 제품 데이터를 로드하고 초기 렌더링을 수행
   * products-data.js 파일에서 GOFIT_PRODUCTS 전역 변수를 사용
   */
  function loadProductsData() {
    // GOFIT_PRODUCTS는 products-data.js에서 전역으로 정의됨
    if (typeof GOFIT_PRODUCTS === 'undefined') {
      console.error('❌ products-data.js 파일이 로드되지 않았습니다!');
      console.error('products.html에 다음 줄을 추가하세요:');
      console.error('<script src="../js/products-data.js"></script>');
      return;
    }
    
    // 전체 제품 데이터 할당
    products = GOFIT_PRODUCTS;
    

    
    // 초기 렌더링 실행
    renderProducts();      // 제품 카드 렌더링
    updateFilterInfo();    // 필터 정보 업데이트
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                        DATA LOADING 끝                                  ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
/* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                       CATEGORY FILTERING                                ██
  ██                        카테고리 필터링 함수들                              ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 카테고리 필터 버튼들의 이벤트를 초기화
   * 전체, 카디오, 근력운동, 기능성, 프로모션 카테고리 처리
   */
  function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.gf-prod-category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // 드래그로 인한 클릭이면 무시
        if (button.dataset.dragging === 'true') {
          button.dataset.dragging = 'false';
          return;
        }
        
        // 기존 활성 버튼에서 active 클래스 제거
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // 클릭된 버튼에 active 클래스 추가
        this.classList.add('active');
        
        // 선택된 카테고리 업데이트 및 필터링 실행
        currentCategory = this.dataset.category;
        filterProducts();
      });
    });
    
    // 🔥 카테고리 탭 마우스 드래그 기능 추가 🔥
    initCategoryDrag();
  }
  
  /**
   * 🔥 카테고리 탭 마우스 드래그 기능 초기화 🔥
   * PC에서 브라우저 크기가 작을 때도 마우스로 드래그 가능하게 함
   */
  function initCategoryDrag() {
    const categoriesContainer = document.querySelector('.gf-prod-categories');
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
        const buttons = categoriesContainer.querySelectorAll('.gf-prod-category-btn');
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
        const buttons = categoriesContainer.querySelectorAll('.gf-prod-category-btn');
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
      if (window.innerWidth <= 768 || categoriesContainer.scrollWidth > categoriesContainer.clientWidth) {
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
  
  /**
   * 제품 필터링을 실행하는 함수
   * 카테고리가 변경될 때 호출됩니다
   */
  function filterProducts() {
    currentlyShowing = productsPerPage; // 필터링 시 첫 페이지로 초기화
    renderProducts();                   // 제품 다시 렌더링
    updateFilterInfo();                 // 필터 정보 업데이트
  }
  
  /**
   * 각 카테고리별 제품 개수를 업데이트
   * 카테고리 버튼에 표시되는 숫자를 갱신합니다
   */
  function updateProductCount() {
    const categoryButtons = document.querySelectorAll('.gf-prod-category-btn');
    
    categoryButtons.forEach(button => {
      const category = button.dataset.category;
      let count = 0;
      
      // 카테고리별 제품 개수 계산
      if (category === 'all') {
        count = products.length;
      } else if (category === 'promotion') {
        // ★ 프로모션 카테고리 개수 계산 ★
        count = products.filter(product => {
          if (!product.badge) return false;
          const badges = Array.isArray(product.badge) ? product.badge : [product.badge];
          return badges.some(badge => badge.toLowerCase() === 'promotion');
        }).length;
      } else {
        // 일반 카테고리 개수 계산
        count = products.filter(p => p.category === category).length;
      }
      
      // 버튼의 카운트 표시 업데이트
      const countElement = button.querySelector('.gf-prod-category-count');
      if (countElement) {
        countElement.textContent = count;
      }
    });
  }
  
  /**
   * 카테고리 영어명을 한글명으로 변환
   * @param {string} category - 영어 카테고리명
   * @returns {string} 한글 카테고리명
   */
  function getCategoryName(category) {
    const categoryNames = {
      'cardio': '카디오',
      'strength': '근력운동',
      'functional': '기능성'
    };
    return categoryNames[category] || category;
  }
  
  /**
   * 현재 적용된 필터 정보를 업데이트
   * 사용자에게 어떤 필터가 적용되었는지 표시
   */
  function updateFilterInfo() {
    // 프로모션 필터 섹션이 제거되었으므로 이 함수는 필요 없음
    // 하지만 다른 곳에서 호출할 수 있으므로 빈 함수로 유지
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                     CATEGORY FILTERING 끝                               ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                         PRODUCT CARDS                                   ██
  ██                       제품 카드 이벤트 처리                                ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 제품 카드들의 클릭 이벤트를 초기화
   * 카드 클릭, 퀵뷰 버튼, 견적함 버튼 등의 이벤트 처리
   */
  function initProductCards() {
    const cards = document.querySelectorAll('.gf-prod-card');
    const quickViewButtons = document.querySelectorAll('.gf-prod-quick-view');
    const cartButtons = document.querySelectorAll('.gf-prod-cart-btn');
    
    // 견적함 카트 버튼 이벤트 처리
    cartButtons.forEach(button => {
      // 기존 이벤트 리스너 제거 (중복 방지)
      button.replaceWith(button.cloneNode(true));
    });
    
    // 새로운 카트 버튼들 다시 선택하여 이벤트 바인딩
    const newCartButtons = document.querySelectorAll('.gf-prod-cart-btn');
    
    newCartButtons.forEach(button => {
      // 클릭 이벤트 (PC)
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        toggleQuotation(productId, e);
      });
      
      // 터치 이벤트 (모바일)
      button.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        toggleQuotation(productId, e);
      });
    });
    
    // 모바일에서 오버레이 제거 (터치 디바이스에서는 hover 효과 없음)
    if (window.innerWidth <= 768) {
      const overlays = document.querySelectorAll('.gf-prod-card-overlay');
      overlays.forEach(overlay => {
        overlay.style.display = 'none';
      });
    }
    
    // 제품 카드 전체 클릭 이벤트 (모달 열기)
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // 카트 버튼이나 퀵뷰 버튼 클릭이 아닌 경우에만 모달 열기
        if (e.target.closest('.gf-prod-cart-btn') || e.target.closest('.gf-prod-quick-view')) {
          return;
        }
        
        const productId = this.dataset.productId;
        openProductModal(productId);
      });
    });
    
    // 퀵뷰 버튼 클릭 이벤트
    quickViewButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = this.closest('.gf-prod-card').dataset.productId;
        openProductModal(productId);
      });
    });
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                       PRODUCT CARDS 끝                                  ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                            MODAL                                        ██
  ██                        제품 상세 모달 처리                                 ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 모달 기능을 초기화
   * 모달 열기/닫기, 갤러리, CTA 버튼 등의 이벤트 설정
   */
  function initModal() {
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.gf-prod-modal-overlay');
    
    // 모달 닫기 이벤트들
    modalClose?.addEventListener('click', closeProductModal);      // X 버튼
    modalOverlay?.addEventListener('click', closeProductModal);    // 배경 클릭
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProductModal();
      }
    });
    
    // 모달 내부 기능 초기화
    initModalCTA();           // CTA 버튼 (문의하기, 카탈로그)
  }
  
  /**
   * 제품 상세 모달을 열기
   * @param {string} productId - 표시할 제품의 ID
   */
  function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) return;
    
    // 모달에 제품 정보 채우기
    populateModal(product);
    
    // 모달 활성화
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    
    // 모달 스크롤을 맨 위로 초기화
    const modalBody = modal.querySelector('.gf-prod-modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }
  
  /**
   * 제품 상세 모달을 닫기
   */
  function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 배경 스크롤 복원
    
    // 동적으로 추가된 요소들 정리
    const additionalMedia = document.querySelector('.gf-prod-additional-media');
    if (additionalMedia) additionalMedia.remove();
    
    const modalBadges = document.querySelector('.gf-prod-modal-badges');
    if (modalBadges) modalBadges.remove();
  }
  
/**
   * 모달에 제품 데이터를 채우는 함수
   * @param {Object} product - 제품 정보 객체
   */
  function populateModal(product) {
    // 기본 정보 채우기
    document.querySelector('.gf-prod-info-badge').textContent = getCategoryName(product.category);
    document.querySelector('.gf-prod-info-name').textContent = product.name;
    document.querySelector('.gf-prod-info-code').textContent = `제품코드: ${product.code}`;
    
    // 모달 헤더에 견적 담기 버튼 추가
    const modalHeader = document.querySelector('.gf-prod-modal-header');
    const existingCartBtn = modalHeader.querySelector('.gf-prod-modal-cart-btn');
    
    // 기존 버튼이 있으면 제거
    if (existingCartBtn) existingCartBtn.remove();
    
    // 새 견적 버튼 생성
    const cartBtn = document.createElement('button');
    cartBtn.className = `gf-prod-modal-cart-btn ${isInCart(product.id) ? 'active' : ''}`;
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    cartBtn.title = isInCart(product.id) ? '견적함에서 빼기' : '견적함에 담기';
    cartBtn.setAttribute('data-product-id', product.id);
    
    // 버튼 이벤트 바인딩
    cartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      toggleQuotation(product.id, e);
    });
    cartBtn.addEventListener('touchend', function(e) {
      e.stopPropagation();
      e.preventDefault();
      toggleQuotation(product.id, e);
    });
    
    // 헤더에 버튼 삽입
    modalHeader.insertBefore(cartBtn, modalHeader.querySelector('.gf-prod-modal-close'));
    
    // 뱃지 추가 (제품명 위에 표시)
    let badgeHTML = '';
    if (product.badge) {
      const badges = Array.isArray(product.badge) ? product.badge : [product.badge];
      badgeHTML = '<div class="gf-prod-modal-badges">';
      badgeHTML += badges.map(badge => {
        const badgeClass = `badge-${badge.toLowerCase()}`;
        
        // PROMOTION 뱃지에만 스파클 아이콘 추가 (모달용)
        if (badge.toLowerCase() === 'promotion') {
          return `<div class="gf-prod-modal-badge ${badgeClass}">
            <svg style="width: 12px; height: 12px; fill: currentColor; margin-right: 3px;" viewBox="0 0 24 26">
              <path d="M12 2l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"/>
            </svg>
            ${badge}
          </div>`;
        } else {
          // NEW, BEST 등 다른 뱃지는 기존 그대로
          return `<div class="gf-prod-modal-badge ${badgeClass}">${badge}</div>`;
        }
      }).join('');
      badgeHTML += '</div>';
    }
    
    // 기존 뱃지 제거 후 새로 추가
    const badgeElement = document.querySelector('.gf-prod-info-badge');
    const existingBadges = badgeElement.parentNode.querySelector('.gf-prod-modal-badges');
    if (existingBadges) existingBadges.remove();
    if (badgeHTML) {
      badgeElement.insertAdjacentHTML('afterend', badgeHTML);
    }
    
/* 
████████████████████████████████████████████████████████████████████████████████
██                   모달 가격 정보 설정 (VAT 포함으로 변경)                      ██
████████████████████████████████████████████████████████████████████████████████
*/

// 가격 정보 설정 - VAT 포함 계산
const priceContainer = document.querySelector('.gf-prod-info-price');
if (product.originalPrice) {
  // 할인 제품인 경우 - VAT 포함 계산
  const vatIncludedOriginalPrice = Math.round(product.originalPrice * 1.1);
  const vatIncludedPrice = Math.round(product.price * 1.1);
  
  priceContainer.innerHTML = `
    <div class="gf-prod-info-original-price">${window.gofitUtils.formatPrice(vatIncludedOriginalPrice)}</div>
    <div class="gf-prod-info-current-price">
      <div class="gf-prod-info-price-main">
        <span class="gf-prod-price-label">할인가</span>
        <span class="gf-prod-price-discount">${window.gofitUtils.formatPrice(vatIncludedPrice)}</span>
      </div>
      <div class="gf-prod-modal-vat-notice">VAT 포함</div>
    </div>
  `;
} else {
  // 일반 제품인 경우 - VAT 포함 계산
  const vatIncludedPrice = Math.round(product.price * 1.1);
  
  priceContainer.innerHTML = `
    <div class="gf-prod-info-current-price">
      <div class="gf-prod-info-price-main">
        <span class="gf-prod-price-label">판매가</span>
        <span class="gf-prod-price-regular">${window.gofitUtils.formatPrice(vatIncludedPrice)}</span>
      </div>
      <div class="gf-prod-modal-vat-notice">VAT 포함</div>
    </div>
  `;
}

/* 
████████████████████████████████████████████████████████████████████████████████
██                 모달 가격 정보 설정 (VAT 포함으로 변경) 끝                     ██
████████████████████████████████████████████████████████████████████████████████
*/
    
    // 🔥 이미지 갤러리 설정 (썸네일 제거, 메인 이미지만) 🔥
    const mainImage = document.getElementById('mainImage');
    const galleryPlaceholder = document.querySelector('.gf-prod-gallery-placeholder');
    
    if (product.images && product.images.length > 0) {
      mainImage.src = product.images[0];
      mainImage.style.display = 'block';
      galleryPlaceholder.style.display = 'none';
    } else {
      mainImage.style.display = 'none';
      galleryPlaceholder.style.display = 'flex';
    }
    
    // 제품 사양 테이블 채우기
    const specsTable = document.querySelector('.gf-prod-specs-table');
    let specsHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
      specsHTML += `
        <tr>
          <th>${key}</th>
          <td>${value}</td>
        </tr>
      `;
    }
    specsTable.innerHTML = specsHTML;
    
    // 주요 특징 리스트 채우기
    const featuresList = document.querySelector('.gf-prod-info-features ul');
    featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    
    // 제품 영상 설정
    const videoContainer = document.querySelector('.gf-prod-video-container');
    if (product.video) {
      videoContainer.innerHTML = `
        <iframe src="${product.video}" frameborder="0" allowfullscreen></iframe>
      `;
    } else {
      videoContainer.innerHTML = `
        <div class="gf-prod-video-placeholder">
          <i class="fab fa-youtube"></i>
          <p>영상 준비중입니다</p>
        </div>
      `;
    }
    
    // 추가 미디어 처리 (추가 이미지, 영상, 다운로드 링크)
    if (product.media) {
      let additionalMediaHTML = '';
      
      // 추가 이미지들
      if (product.media.images && product.media.images.length > 0) {
        additionalMediaHTML += '<div class="gf-prod-additional-images"><h4>추가 이미지</h4><div class="gf-prod-image-list">';
        product.media.images.forEach(image => {
          additionalMediaHTML += `
            <div class="gf-prod-image-item">
              <img src="${image.url}" alt="${image.title}">
            </div>
          `;
        });
        additionalMediaHTML += '</div></div>';
      }
      
      // 추가 영상들
      if (product.media.videos && product.media.videos.length > 0) {
        additionalMediaHTML += '<div class="gf-prod-additional-videos"><h4>추가 영상</h4><div class="gf-prod-video-list">';
        product.media.videos.forEach(video => {
          additionalMediaHTML += `
            <div class="gf-prod-video-item">
              <h5>${video.title}</h5>
              <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        });
        additionalMediaHTML += '</div></div>';
      }
      
      // 다운로드 링크들
      if (product.media.links && product.media.links.length > 0) {
        additionalMediaHTML += '<div class="gf-prod-download-links"><h4>다운로드</h4><div class="gf-prod-link-list">';
        product.media.links.forEach(link => {
          additionalMediaHTML += `
            <a href="${link.url}" target="_blank" class="gf-prod-download-link">
              <i class="fas fa-download"></i>
              <span>${link.title}</span>
            </a>
          `;
        });
        additionalMediaHTML += '</div></div>';
      }
      
      // 기존 영상 섹션 다음에 추가 미디어 삽입
      if (additionalMediaHTML) {
        const videoSection = document.querySelector('.gf-prod-modal-video');
        const additionalMedia = document.createElement('div');
        additionalMedia.className = 'gf-prod-additional-media';
        additionalMedia.innerHTML = additionalMediaHTML;
        videoSection.parentNode.insertBefore(additionalMedia, videoSection.nextSibling);
      }
    }
  }
  
/* 
████████████████████████████████████████████████████████████████████████████████
██                    모달 CTA 버튼 함수 수정 시작                                ██
████████████████████████████████████████████████████████████████████████████████
*/

/**
 * 모달의 CTA 버튼들을 초기화
 * 문의하기, 카탈로그 다운로드 버튼 이벤트 설정
 */
function initModalCTA() {
  const inquiryBtn = document.querySelector('.gf-prod-cta-inquiry');
  const catalogBtn = document.querySelector('.gf-prod-cta-catalog');
  
  // 🔥 문의하기 버튼 - 현재 열린 제품 정보를 가져와서 contact 페이지로 전달 🔥
  inquiryBtn?.addEventListener('click', function() {
    // 현재 모달에 표시된 제품명 가져오기
    const productNameElement = document.querySelector('.gf-prod-info-name');
    const productName = productNameElement ? productNameElement.textContent : '';
    
    // URL 파라미터로 제품명 전달하여 contact 페이지로 이동
    if (productName) {
      const encodedProductName = encodeURIComponent(productName);
      window.location.href = `../contact/contact.html?tab=general&product=${encodedProductName}`;
    } else {
      // 제품명이 없으면 기본 contact 페이지로 이동
      window.location.href = '../contact/contact.html?tab=general';
    }
  });
  
  // 카탈로그 다운로드 버튼 - 카탈로그 섹션으로 이동
  catalogBtn?.addEventListener('click', function() {
    window.location.href = '/GOFIT_EQUIPMENT_catalog/GOFIT_EQUIPMENT_catalog.pdf';
  });
}

/* 
████████████████████████████████████████████████████████████████████████████████
██                    모달 CTA 버튼 함수 수정 끝                                  ██
████████████████████████████████████████████████████████████████████████████████
*/
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                           MODAL 끝                                      ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                       ANIMATIONS & UTILS                                ██
  ██                      애니메이션 및 유틸리티 함수들                          ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 제품 카드들의 등장 애니메이션을 초기화
   * 카드들이 순차적으로 나타나는 효과를 만듭니다
   */
  function initScrollAnimations() {
    const cards = document.querySelectorAll('.gf-prod-card');
    
    cards.forEach((card, index) => {
      // 초기 상태 설정 (투명하고 아래쪽에 위치)
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'none';
      
      // 강제 리플로우 (브라우저가 스타일 변경을 인식하도록)
      card.offsetHeight;
      
      // 애니메이션 실행 (순차적으로 나타남)
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 60); // 60ms씩 지연
    });
  }
  
  /**
   * 부드러운 스크롤 기능을 초기화
   * 현재는 기본 기능만 있지만 필요시 확장 가능
   */
  function initSmoothScroll() {
    // 기존 스크롤 인디케이터는 다른 함수에서 처리
    // 여기서는 추가 스크롤 기능 구현 가능
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                     ANIMATIONS & UTILS 끝                               ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                        QUOTATION CART                                   ██
  ██                         견적함 기능 구현                                   ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  /**
   * 로컬스토리지에서 견적함 데이터를 불러오기
   * 페이지 새로고침 후에도 견적함 내용을 유지하기 위함
   */
  function loadQuotationCart() {
    const savedCart = localStorage.getItem('gofitQuotation');
    if (savedCart) {
      try {
        quotationCart = JSON.parse(savedCart);

      } catch (e) {
        console.error('견적함 데이터 로드 실패:', e);
        quotationCart = [];
      }
    }
  }
  
  /**
   * 현재 견적함 데이터를 로컬스토리지에 저장
   */
  function saveQuotationCart() {
    localStorage.setItem('gofitQuotation', JSON.stringify(quotationCart));
    updateFloatingCartButton(); // 플로팅 버튼 업데이트
  }
  
  /**
   * 특정 제품이 견적함에 있는지 확인
   * @param {string|number} productId - 확인할 제품 ID
   * @returns {boolean} 견적함에 있으면 true, 없으면 false
   */
  function isInCart(productId) {
    return quotationCart.some(item => item.id === parseInt(productId));
  }
  
  /**
   * 견적함에 제품 추가/제거를 토글하는 메인 함수
   * @param {string|number} productId - 토글할 제품 ID
   * @param {Event} event - 클릭 이벤트 객체
   */
  function toggleQuotation(productId, event) {
    event.stopPropagation();
    
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    const cartIndex = quotationCart.findIndex(item => item.id === parseInt(productId));
    const clickedButton = event.currentTarget; // 클릭한 버튼 저장
    
    if (cartIndex > -1) {
      // 견적함에서 제거
      quotationCart.splice(cartIndex, 1);
      showNotification(`${product.name}을(를) 견적함에서 제거했습니다.`);
      
      // 클릭한 버튼 즉시 업데이트
      clickedButton.classList.remove('active');
      clickedButton.title = '견적함에 담기';
      
      animateFloatingButton();
    } else {
      // 견적함에 추가 - VAT 포함 가격으로 계산하여 저장
      const vatIncludedPrice = Math.round(product.price * 1.1);
      
      // ★★★ 이미지 경로 통일: getProductMainImage() 사용 ★★★
      quotationCart.push({
        id: product.id,
        name: product.name,
        code: product.code,
        price: vatIncludedPrice, // VAT 포함 가격으로 저장
        image: getProductMainImage(product), // 통일된 이미지 경로 사용
        addedAt: new Date().toISOString()
      });
      showNotification(`${product.name}을(를) 견적함에 담았습니다.`);
      
      // 클릭한 버튼 즉시 업데이트
      clickedButton.classList.add('active');
      clickedButton.title = '견적함에서 빼기';

      animateFloatingButton();
      
      // 첫 번째 제품 추가 시 가이드 숨기기
      if (quotationCart.length === 1) {
        hideCartGuide();
      }
    }
    
    saveQuotationCart();
    updateOtherCartButtons(productId); // 다른 버튼들도 동기화
  }
  
  /**
   * 같은 제품의 다른 카트 버튼들도 동기화
   * @param {string|number} productId - 업데이트할 제품 ID
   */
  function updateOtherCartButtons(productId) {
    const allCartButtons = document.querySelectorAll('.gf-prod-cart-btn, .gf-prod-modal-cart-btn');
    
    allCartButtons.forEach(button => {
      if (button.getAttribute('data-product-id') === String(productId)) {
        if (isInCart(productId)) {
          button.classList.add('active');
          button.title = '견적함에서 빼기';
        } else {
          button.classList.remove('active');
          button.title = '견적함에 담기';
        }
      }
    });
  }
  

  
  /**
   * 플로팅 견적함 버튼에 애니메이션 효과
   */
  function animateFloatingButton() {
    const floatingBtn = document.querySelector('.gf-floating-cart-btn');
    const countElement = document.querySelector('.gf-cart-count');
    
    // 버튼 pulse 애니메이션
    if (floatingBtn) {
      floatingBtn.classList.add('pulse');
      setTimeout(() => {
        floatingBtn.classList.remove('pulse');
      }, 600);
    }
    
    // 숫자 bounce 애니메이션
    if (countElement) {
      countElement.classList.add('bounce');
      setTimeout(() => {
        countElement.classList.remove('bounce');
      }, 500);
    }
  }
  
  /**
   * 플로팅 견적함 버튼을 생성하고 초기화
   */
  function createFloatingCartButton() {
    // 모바일용 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'gf-cart-overlay';
    overlay.addEventListener('click', function() {
      if (this.classList.contains('show')) {
        toggleCartPreview();
      }
    });
    document.body.appendChild(overlay);
    
    // 플로팅 버튼 컨테이너 생성
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'gf-floating-cart';
    
    // 견적함 상태에 따라 클래스 설정
    if (quotationCart.length === 0) {
      floatingBtn.classList.add('empty');
    } else {
      floatingBtn.classList.add('has-items');
    }
    
    // 플로팅 버튼 HTML 구성
    floatingBtn.innerHTML = `
      <button class="gf-floating-cart-btn" onclick="toggleCartPreview()">
        <i class="fas fa-clipboard-list"></i>
        <span class="cart-label">견적함</span>
        <span class="gf-cart-count ${quotationCart.length === 0 ? 'zero' : ''}">${quotationCart.length}</span>
      </button>
      <div class="gf-cart-guide">
        <button class="gf-cart-guide-close" onclick="closeCartGuide()">
          <i class="fas fa-times"></i>
        </button>
        <span class="emoji">💡</span>
        <span>카트를 눌러 제품을 담아보세요!</span>
      </div>
      <div class="gf-cart-preview" id="cartPreview">
        <div class="gf-cart-preview-header">
          <h3>견적함</h3>
          <button class="gf-cart-close" onclick="toggleCartPreview()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="gf-cart-preview-body">
          ${renderCartPreview()}
        </div>
        <div class="gf-cart-preview-footer">
          <button class="gf-cart-clear" onclick="clearCart()">
            <i class="fas fa-trash"></i>
            <span>비우기</span>
          </button>
          <div class="gf-cart-goto-buttons">
            <a href="../contact/contact.html?tab=purchase" class="gf-cart-goto gf-cart-goto-purchase">
              <i class="fas fa-shopping-cart"></i>
              <span>구입 견적서</span>
            </a>
            <a href="../contact/contact.html?tab=rental" class="gf-cart-goto gf-cart-goto-rental">
              <i class="fas fa-calendar-alt"></i>
              <span>렌탈 견적서</span>
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(floatingBtn);
    updateFloatingCartButton();
    addDynamicStyles(); // 동적 스타일 추가
    
    // 🔥 수정: 비어있으면 가이드 표시 (localStorage 확인 제거)
    if (quotationCart.length === 0) {
      setTimeout(() => {
        showCartGuide();
      }, 3000);
    }
  }
  
  /**
   * CSS에 동적 애니메이션 추가
   */
  function addDynamicStyles() {
    if (document.getElementById('cart-dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-dynamic-styles';
    style.textContent = `
      /* 동적 스타일은 이미 CSS에 정의되어 있음 */
    `;
    document.head.appendChild(style);
  }
  
  /**
   * 견적함 가이드 말풍선 표시
   */
  function showCartGuide() {
    const guide = document.querySelector('.gf-cart-guide');
    // 🔥 수정: 견적함이 비어있을 때만 가이드 표시 (localStorage 확인 제거)
    if (guide && quotationCart.length === 0) {
      guide.classList.add('show');
    }
  }
  
  /**
   * 견적함 가이드 닫기 (사용자가 직접 닫은 경우)
   */
  function closeCartGuide() {
    const guide = document.querySelector('.gf-cart-guide');
    if (guide) {
      guide.classList.remove('show');
      // 🔥 수정: localStorage 저장 제거 - 가이드를 영구적으로 숨기지 않음
      // localStorage.setItem('gofitCartGuideHidden', 'true'); // 이 줄 제거
    }
  }
  
  /**
   * 견적함 가이드 숨기기 (자동)
   */
  function hideCartGuide() {
    const guide = document.querySelector('.gf-cart-guide');
    if (guide) {
      guide.classList.remove('show');
    }
  }
  
  /**
   * 견적함 미리보기 HTML 렌더링
   * @returns {string} 견적함 내용 HTML
   */
  function renderCartPreview() {
    if (quotationCart.length === 0) {
      return '<p class="gf-cart-empty">견적함이 비어있습니다.</p>';
    }
    
    return quotationCart.map(item => {
      const product = products.find(p => p.id === item.id);
      // ★★★ 이미지 경로 통일: item.image는 이미 통일된 경로 ★★★
      const imageUrl = item.image || 'https://via.placeholder.com/60';
      
      return `
        <div class="gf-cart-item">
          <img src="${imageUrl}?w=60" alt="${item.name}" class="gf-cart-item-image">
          <div class="gf-cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.code}</p>
          </div>
          <button class="gf-cart-item-remove" onclick="removeFromCart(${item.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    }).join('');
  }
  
  /**
   * 플로팅 견적함 버튼 상태 업데이트
   */
  function updateFloatingCartButton() {
    const countElement = document.querySelector('.gf-cart-count');
    const floatingCart = document.querySelector('.gf-floating-cart');
    const floatingBtn = document.querySelector('.gf-floating-cart-btn');
    
    // 카운트 숫자 업데이트
    if (countElement) {
      countElement.textContent = quotationCart.length;
      if (quotationCart.length === 0) {
        countElement.classList.add('zero');
      } else {
        countElement.classList.remove('zero');
      }
    }
    
    // 버튼 상태 클래스 업데이트
    if (floatingCart) {
      if (quotationCart.length === 0) {
        floatingCart.classList.add('empty');
        floatingCart.classList.remove('has-items');
      } else {
        floatingCart.classList.remove('empty');
        floatingCart.classList.add('has-items');
      }
    }
    
    // 미리보기 내용 업데이트
    const previewBody = document.querySelector('.gf-cart-preview-body');
    if (previewBody) {
      previewBody.innerHTML = renderCartPreview();
    }
  }
  
  /**
   * 견적함 미리보기 토글 (열기/닫기)
   */
  function toggleCartPreview() {
    const preview = document.getElementById('cartPreview');
    const overlay = document.querySelector('.gf-cart-overlay');
    
    if (preview.classList.contains('show')) {
      // 미리보기 닫기
      preview.classList.remove('show');
      if (overlay) {
        overlay.classList.remove('show');
        if (window.innerWidth <= 768) {
          document.body.style.overflow = '';
        }
      }
    } else {
      // 미리보기 열기
      preview.classList.add('show');
      if (overlay) {
        overlay.classList.add('show');
        if (window.innerWidth <= 768) {
          document.body.style.overflow = 'hidden';
        }
      }
      hideCartGuide();
    }
  }
  
  /**
   * 견적함에서 특정 제품 제거
   * @param {string|number} productId - 제거할 제품 ID
   */
  function removeFromCart(productId) {
    const product = quotationCart.find(item => item.id === parseInt(productId));
    quotationCart = quotationCart.filter(item => item.id !== parseInt(productId));
    saveQuotationCart();
    
    updateOtherCartButtons(productId);
    animateFloatingButton();
    
    if (product) {
      showNotification(`${product.name}을(를) 견적함에서 제거했습니다.`);
    }
    
    // 🔥 수정: 견적함이 비면 가이드 다시 표시
    if (quotationCart.length === 0) {
      setTimeout(() => {
        showCartGuide();
      }, 2000);
    }
  }
  
  /**
   * 견적함 전체 비우기
   */
  function clearCart() {
    if (confirm('견적함을 비우시겠습니까?')) {
      const productIds = quotationCart.map(item => item.id);
      
      quotationCart = [];
      saveQuotationCart();
      
      productIds.forEach(productId => {
        updateOtherCartButtons(productId);
      });
      
      showNotification('견적함을 비웠습니다.');
      
      // 🔥 수정: 견적함을 비운 후 가이드 다시 표시
      setTimeout(() => {
        showCartGuide();
      }, 2000);
    }
  }
  
  /**
   * 사용자에게 알림 메시지 표시
   * @param {string} message - 표시할 메시지
   */
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'gf-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션 시작
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 3초 후 제거
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                      QUOTATION CART 끝                                  ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
/* 
████████████████████████████████████████████████████████████████████████████████
██                       RESPONSIVE FEATURES                               ██
██                        반응형 기능 및 이벤트들                             ██
████████████████████████████████████████████████████████████████████████████████
*/

/**
 * 카테고리 탭 관련 함수 (비활성화)
 * CSS만으로 처리하므로 JavaScript 없음
 */
function enableCategoryDrag() {
  // CSS만으로 처리하므로 아무것도 하지 않음
  const categories = document.querySelector('.gf-prod-categories');
  if (!categories) return;
  

}

/**
 * 윈도우 리사이즈 이벤트 처리
 * 카테고리 탭의 커서 스타일만 조정합니다.
 */
window.addEventListener('resize', () => {
  const categories = document.querySelector('.gf-prod-categories');
  
  // 카테고리 탭 커서 스타일 조정
  if (categories) {
    if (window.innerWidth <= 768 || categories.scrollWidth > categories.clientWidth) {
      categories.style.cursor = 'grab';
    } else {
      categories.style.cursor = 'default';
    }
  }
});

/**
 * 윈도우 포커스 이벤트 처리
 * 다른 프로그램으로 전환했을 때 드래그 해제
 */
window.addEventListener('blur', () => {
  const categories = document.querySelector('.gf-prod-categories');
  if (categories) {
    categories.style.cursor = window.innerWidth <= 768 ? 'grab' : 'default';
  }
});

/* 
████████████████████████████████████████████████████████████████████████████████
██                     RESPONSIVE FEATURES 끝                              ██
████████████████████████████████████████████████████████████████████████████████
*/
  
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                         INITIALIZATION                                  ██
  ██                           초기화 실행                                     ██
  ══════════════════════════════════════════════════════════════════════════════
  */
  
  // 페이지 로드 상태에 따른 초기화 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
  } else {
    initProducts();
  }
  
  // 카테고리 드래그 기능 초기화
  document.addEventListener('DOMContentLoaded', enableCategoryDrag);
  
  // 전역 함수로 등록 (HTML onclick 이벤트용)
  window.toggleQuotation = toggleQuotation;
  window.toggleCartPreview = toggleCartPreview;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.closeCartGuide = closeCartGuide;
  /* 
  ══════════════════════════════════════════════════════════════════════════════
  ██                       INITIALIZATION 끝                                 ██
  ══════════════════════════════════════════════════════════════════════════════
  */

})();
/* 
████████████████████████████████████████████████████████████████████████████████
██                         MAIN SCRIPT END                                   ██
████████████████████████████████████████████████████████████████████████████████
*/