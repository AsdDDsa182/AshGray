// ═══════════════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  // ─── 전역 변수 ───
  let currentCategory = 'all';
  let products = [];
  let productsPerPage = 6; // 한 번에 보여줄 제품 수 (조정 가능: 3, 6, 9, 12 등)
  let currentlyShowing = productsPerPage; // 현재 보여지는 제품 수
  
  // 💡 페이지당 제품 수 변경 방법:
  // productsPerPage = 3;  // 3개씩 보여주기
  // productsPerPage = 9;  // 9개씩 보여주기
  // productsPerPage = 12; // 12개씩 보여주기
  // currentlyShowing = productsPerPage; // 초기값도 같이 변경
  
  // ─── 초기화 ───
  function initProducts() {
    console.log('🚀 GOFIT Products 페이지 초기화');
    
    // 제품 데이터 로드 및 렌더링
    loadProductsData();
    
    // 카테고리 필터 이벤트
    initCategoryFilters();
    
    // 모달 기능
    initModal();
    
    // 부드러운 스크롤
    initSmoothScroll();
    
    // 더보기 버튼
    initLoadMore();
  }
  
  // ─── 더보기 버튼 초기화 ───
  function initLoadMore() {
    const loadMoreBtn = document.querySelector('.gf-prod-load-btn');
    loadMoreBtn?.addEventListener('click', function() {
      // 더 보여줄 제품이 있는지 확인
      const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);
      
      if (currentlyShowing < filteredProducts.length) {
        // 추가로 보여줄 제품 수
        currentlyShowing += productsPerPage;
        
        // 버튼 텍스트 변경
        this.innerHTML = `
          <span>로딩중...</span>
          <i class="fas fa-spinner fa-spin"></i>
        `;
        
        // 약간의 지연 후 제품 추가
        setTimeout(() => {
          renderProducts();
          
          // 버튼 텍스트 복구 (남은 제품 수 표시)
          const remaining = filteredProducts.length - currentlyShowing;
          if (remaining > 0) {
            this.innerHTML = `
              <span>더 많은 제품 보기 (${remaining}개)</span>
              <i class="fas fa-chevron-down"></i>
            `;
          } else {
            this.innerHTML = `
              <span>더 많은 제품 보기</span>
              <i class="fas fa-chevron-down"></i>
            `;
          }
          
          // 새로 추가된 카드들에 애니메이션 효과
          const allCards = document.querySelectorAll('.gf-prod-card');
          const startIndex = currentlyShowing - productsPerPage;
          
          allCards.forEach((card, index) => {
            if (index >= startIndex) {
              card.style.opacity = '0';
              card.style.transform = 'translateY(30px)';
              setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, (index - startIndex) * 100);
            }
          });
        }, 500);
      }
    });
  }
  
  // ─── 제품 카드 동적 생성 ───
  function renderProducts() {
    const grid = document.querySelector('.gf-prod-grid');
    if (!grid) return;
    
    // 기존 카드 모두 제거
    grid.innerHTML = '';
    
    // 필터링된 제품 가져오기
    const filteredProducts = currentCategory === 'all' 
      ? products 
      : products.filter(p => p.category === currentCategory);
    
    // 표시할 제품만큼만 렌더링
    const productsToShow = filteredProducts.slice(0, currentlyShowing);
    
    productsToShow.forEach(product => {
      const card = createProductCard(product);
      grid.appendChild(card);
    });
    
    // 더보기 버튼 표시/숨김 처리
    const loadMoreBtn = document.querySelector('.gf-prod-load-more');
    const loadBtn = document.querySelector('.gf-prod-load-btn');
    if (loadMoreBtn && loadBtn) {
      if (currentlyShowing >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
        const remaining = filteredProducts.length - currentlyShowing;
        loadBtn.innerHTML = `
          <span>더 많은 제품 보기 (${remaining}개)</span>
          <i class="fas fa-chevron-down"></i>
        `;
      }
    }
    
    // 카드 클릭 이벤트 재설정
    initProductCards();
    
    // 스크롤 애니메이션 재설정
    initScrollAnimations();
    
    // 카운트 업데이트
    updateProductCount();
  }
  
  // 제품 카드 HTML 생성
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'gf-prod-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-id', product.id);
    
    const badgeHTML = product.badge ? `<div class="gf-prod-card-badge">${product.badge}</div>` : '';
    
    card.innerHTML = `
      <div class="gf-prod-card-image">
        <img src="${product.image}" alt="${product.name}">
        ${badgeHTML}
        <div class="gf-prod-card-overlay">
          <button class="gf-prod-quick-view">
            <i class="fas fa-search-plus"></i>
            <span>자세히 보기</span>
          </button>
        </div>
      </div>
      <div class="gf-prod-card-info">
        <span class="gf-prod-card-category">${getCategoryName(product.category)}</span>
        <h3 class="gf-prod-card-title">${product.name}</h3>
        <p class="gf-prod-card-code">${product.code}</p>
        <div class="gf-prod-card-price">
          <span class="gf-prod-price-label">판매가</span>
          <span class="gf-prod-price-value">${product.price}</span>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // ─── 제품 데이터 ───
  // 🔥 새 제품 추가시 이 배열에만 추가하면 됩니다!
  function loadProductsData() {
    products = [
      {
        id: 1,
        name: '런닝머신 X1 Pro',
        code: 'GF-TM-X1PRO',
        category: 'cardio',
        price: '₩3,500,000',
        badge: 'NEW', // 'NEW', 'BEST', 'HOT' 중 선택 (없으면 null)
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
        images: [
          'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800'
        ],
        specs: {
          '크기': '2100 x 900 x 1500 mm',
          '무게': '150 kg',
          '최대 사용자 무게': '150 kg',
          '속도 범위': '0.8 - 20 km/h',
          '경사도': '0 - 15%',
          '모터': '4.0 HP AC Motor'
        },
        features: [
          '21.5인치 터치스크린 디스플레이',
          '자동 경사도 조절 시스템',
          '충격 흡수 런닝 데크',
          '심박수 모니터링',
          '블루투스 연결 지원'
        ],
        video: null,
        // 추가 미디어 예시
        media: {
          videos: [
            {
              title: '제품 소개 영상',
              url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
              title: '사용 방법 가이드',
              url: 'https://www.youtube.com/embed/VIDEO_ID'
            }
          ],
          links: [
            {
              title: '사용 설명서 (PDF)',
              url: '#'
            },
            {
              title: '제품 카탈로그',
              url: '#'
            }
          ]
        }
      },
      {
        id: 2,
        name: '파워랙 S2 Elite',
        code: 'GF-PR-S2ELITE',
        category: 'strength',
        price: '₩2,800,000',
        badge: null,
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
        images: null,
        specs: {
          '크기': '1500 x 1500 x 2300 mm',
          '무게': '200 kg',
          '최대 하중': '500 kg',
          '프레임': '80x80mm 스틸',
          '안전바': '조절식 안전바',
          '풀업바': '멀티 그립 풀업바'
        },
        features: [
          '헤비듀티 스틸 프레임',
          '조절식 안전 캐치',
          '올림픽 바벨 홀더',
          '다양한 액세서리 부착 가능',
          '파우더 코팅 마감'
        ],
        video: null
      },
      {
        id: 7,
        name: '멀티스테이션 M5',
        code: 'GF-MS-M5PRO',
        category: 'functional',
        price: '₩5,500,000',
        badge: 'NEW',
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800',
        images: null,
        specs: {
          '크기': '3000 x 2500 x 2200 mm',
          '무게': '450 kg',
          '스테이션': '12개 운동 스테이션',
          '최대 수용인원': '4명 동시 사용',
          '프레임': '100x100mm 헤비듀티',
          '케이블': '항공기용 와이어'
        },
        features: [
          '12개의 독립적인 운동 스테이션',
          '4명 동시 사용 가능',
          '프리미엄 가죽 패딩',
          '무게 스택 200kg',
          '평생 프레임 보증'
        ],
        video: null
      },
      {
        id: 3,
        name: '스피닝 사이클 C3',
        code: 'GF-SC-C3',
        category: 'cardio',
        price: '₩1,800,000',
        badge: 'BEST',
        image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3a11e?w=800',
        images: [
          'https://images.unsplash.com/photo-1520877880798-5ee004e3a11e?w=800'
        ],
        specs: {
          '크기': '1200 x 500 x 1100 mm',
          '무게': '65 kg',
          '최대 사용자 무게': '130 kg',
          '플라이휠': '20 kg',
          '저항': '마그네틱 저항',
          '조절': '32단계'
        },
        features: [
          '조용한 벨트 드라이브',
          '32단계 저항 조절',
          'LCD 디스플레이',
          '조절식 핸들바 & 시트',
          'SPD 페달 호환'
        ],
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        // 추가 미디어 옵션 (선택사항)
        media: {
          videos: [
            {
              title: '제품 소개 영상',
              url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
              title: '조립 가이드',
              url: 'https://www.youtube.com/embed/abc123'
            }
          ],
          links: [
            {
              title: '사용 설명서 PDF',
              url: 'https://example.com/manual.pdf'
            },
            {
              title: '제품 브로셔',
              url: 'https://example.com/brochure.pdf'
            }
          ]
        }
      },
      {
        id: 4,
        name: '케이블머신 F1 Multi',
        code: 'GF-CM-F1MULTI',
        category: 'functional',
        price: '₩4,200,000',
        badge: null,
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
        images: null,
        specs: {
          '크기': '2500 x 1800 x 2200 mm',
          '무게': '350 kg',
          '스택 무게': '100kg x 2',
          '케이블': '항공기용 와이어',
          '풀리': '고강도 베어링',
          '스테이션': '8개 운동 스테이션'
        },
        features: [
          '듀얼 조절식 풀리 시스템',
          '8개의 다양한 운동 스테이션',
          '부드러운 케이블 동작',
          '안전 잠금 시스템',
          '다양한 액세서리 포함'
        ],
        video: null
      },
      {
        id: 5,
        name: '올림픽 벤치프레스 B1',
        code: 'GF-BP-B1OLY',
        category: 'strength',
        price: '₩1,500,000',
        badge: null,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        images: null,
        specs: {
          '크기': '1700 x 1200 x 1300 mm',
          '무게': '85 kg',
          '최대 하중': '400 kg',
          '벤치 각도': '0-85도 조절',
          '바벨 랙': '6단계 높이 조절',
          '패드': '고밀도 폼 패딩'
        },
        features: [
          '올림픽 사이즈 바벨 지원',
          '각도 조절 가능한 등받이',
          '안정적인 스틸 프레임',
          '미끄럼 방지 고무 발판',
          '쉬운 높이 조절'
        ],
        video: null
      },
      {
        id: 6,
        name: '로잉머신 R1 Plus',
        code: 'GF-RM-R1PLUS',
        category: 'cardio',
        price: '₩2,200,000',
        badge: 'HOT',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
        images: null,
        specs: {
          '크기': '2400 x 600 x 900 mm',
          '무게': '45 kg',
          '최대 사용자 무게': '150 kg',
          '저항': '공기+자기 저항',
          '모니터': '10인치 LCD',
          '레일': '알루미늄 레일'
        },
        features: [
          '듀얼 저항 시스템',
          '인체공학적 핸들',
          '접이식 디자인',
          '무선 심박 모니터',
          '20개 사전설정 프로그램'
        ],
        video: null
      },
      // 🔥 새 제품 추가 방법:
      // 1. 아래 주석을 복사해서 붙여넣기
      // 2. id를 고유한 숫자로 변경 (예: 8, 9, 10...)
      // 3. 제품 정보 입력
      // 4. 저장하면 자동으로 페이지에 반영됩니다!
      //
      // {
      //   id: 8,
      //   name: '제품명',
      //   code: '제품코드',
      //   category: 'cardio', // 'cardio', 'strength', 'functional' 중 선택
      //   price: '₩0,000,000',
      //   badge: 'NEW', // 'NEW', 'BEST', 'HOT' 중 선택 또는 null
      //   image: '메인이미지URL',
      //   images: ['이미지1URL', '이미지2URL'], // 여러 이미지 또는 null
      //   specs: {
      //     '사양명': '사양값',
      //   },
      //   features: [
      //     '특징1',
      //     '특징2'
      //   ],
      //   video: 'https://www.youtube.com/embed/VIDEO_ID', // 메인 영상 또는 null
      //   media: { // 추가 미디어 (선택사항)
      //     videos: [
      //       {
      //         title: '영상 제목',
      //         url: 'https://www.youtube.com/embed/VIDEO_ID'
      //       }
      //     ],
      //     links: [
      //       {
      //         title: '다운로드 파일명',
      //         url: 'https://example.com/file.pdf'
      //       }
      //     ]
      //   }
      // }
    ];
    
    // 제품 카드 동적 생성
    renderProducts();
  }
  
  // ─── 카테고리 필터 ───
  function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.gf-prod-category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 활성 버튼 변경
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // 카테고리 필터링
        currentCategory = this.dataset.category;
        filterProducts();
      });
    });
  }
  
  // 제품 필터링
  function filterProducts() {
    currentlyShowing = productsPerPage; // 카테고리 변경시 초기화
    renderProducts();
  }
  
  // 제품 카운트 업데이트
  function updateProductCount() {
    const categoryButtons = document.querySelectorAll('.gf-prod-category-btn');
    
    categoryButtons.forEach(button => {
      const category = button.dataset.category;
      const count = category === 'all' 
        ? products.length
        : products.filter(p => p.category === category).length;
      
      const countElement = button.querySelector('.gf-prod-category-count');
      if (countElement) {
        countElement.textContent = count;
      }
    });
  }
  
  // ─── 제품 카드 클릭 이벤트 ───
  function initProductCards() {
    const cards = document.querySelectorAll('.gf-prod-card');
    const quickViewButtons = document.querySelectorAll('.gf-prod-quick-view');
    
    // 카드 전체 클릭
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // 퀵뷰 버튼 클릭이 아닌 경우에만
        if (!e.target.closest('.gf-prod-quick-view')) {
          const productId = this.dataset.productId;
          openProductModal(productId);
        }
      });
    });
    
    // 퀵뷰 버튼 클릭
    quickViewButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = this.closest('.gf-prod-card').dataset.productId;
        openProductModal(productId);
      });
    });
  }
  
  // ─── 모달 기능 ───
  function initModal() {
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.gf-prod-modal-overlay');
    
    // 닫기 버튼
    modalClose?.addEventListener('click', closeProductModal);
    
    // 오버레이 클릭
    modalOverlay?.addEventListener('click', closeProductModal);
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProductModal();
      }
    });
    
    // 갤러리 썸네일 클릭
    initGalleryThumbnails();
    
    // CTA 버튼
    initModalCTA();
  }
  
  // 제품 모달 열기
  function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) return;
    
    // 모달에 제품 정보 채우기
    populateModal(product);
    
    // 모달 열기
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // 제품 모달 닫기
  function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // 추가 미디어 섹션 제거 (다음 모달을 위해)
    const additionalMedia = document.querySelector('.gf-prod-additional-media');
    if (additionalMedia) {
      additionalMedia.remove();
    }
  }
  
  // 모달에 데이터 채우기
  function populateModal(product) {
    // 기본 정보
    document.querySelector('.gf-prod-info-badge').textContent = getCategoryName(product.category);
    document.querySelector('.gf-prod-info-name').textContent = product.name;
    document.querySelector('.gf-prod-info-code').textContent = `제품코드: ${product.code}`;
    document.querySelector('.gf-prod-price-amount').textContent = product.price;
    
    // 이미지 갤러리
    const mainImage = document.getElementById('mainImage');
    const galleryPlaceholder = document.querySelector('.gf-prod-gallery-placeholder');
    const thumbsContainer = document.querySelector('.gf-prod-gallery-thumbs');
    
    if (product.images && product.images.length > 0) {
      mainImage.src = product.images[0];
      mainImage.style.display = 'block';
      galleryPlaceholder.style.display = 'none';
      
      // 썸네일 생성
      thumbsContainer.innerHTML = '';
      product.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `gf-prod-thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img}" alt="썸네일 ${index + 1}">`;
        thumbsContainer.appendChild(thumb);
      });
    } else {
      mainImage.style.display = 'none';
      galleryPlaceholder.style.display = 'flex';
      thumbsContainer.innerHTML = '';
    }
    
    // 제품 사양
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
    
    // 주요 특징
    const featuresList = document.querySelector('.gf-prod-info-features ul');
    featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    
    // 영상
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
    
    // 추가 미디어 (영상, 링크) 처리
    if (product.media) {
      let additionalMediaHTML = '';
      
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
      
      // 기존 영상 섹션 다음에 추가
      const videoSection = document.querySelector('.gf-prod-modal-video');
      const additionalMedia = document.createElement('div');
      additionalMedia.className = 'gf-prod-additional-media';
      additionalMedia.innerHTML = additionalMediaHTML;
      videoSection.parentNode.insertBefore(additionalMedia, videoSection.nextSibling);
    }
    
    // 갤러리 썸네일 이벤트 재설정
    initGalleryThumbnails();
  }
  
  // 카테고리 이름 가져오기
  function getCategoryName(category) {
    const categoryNames = {
      'cardio': '카디오',
      'strength': '근력운동',
      'functional': '기능성'
    };
    return categoryNames[category] || category;
  }
  
  // 갤러리 썸네일 기능
  function initGalleryThumbnails() {
    const thumbs = document.querySelectorAll('.gf-prod-thumb');
    const mainImage = document.getElementById('mainImage');
    
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', function() {
        // 활성 썸네일 변경
        thumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 메인 이미지 변경
        const thumbImg = this.querySelector('img');
        if (thumbImg && mainImage) {
          mainImage.src = thumbImg.src.replace('w=200', 'w=800');
        }
      });
    });
  }
  
  // 모달 CTA 버튼
  function initModalCTA() {
    const inquiryBtn = document.querySelector('.gf-prod-cta-inquiry');
    const catalogBtn = document.querySelector('.gf-prod-cta-catalog');
    
    inquiryBtn?.addEventListener('click', function() {
      // 문의 페이지로 이동 또는 문의 폼 열기
      window.location.href = '../index.html#gf-contact-section';
    });
    
    catalogBtn?.addEventListener('click', function() {
      // 카탈로그 다운로드
      window.location.href = '../index.html#catalog';
    });
  }
  
  // ─── 스크롤 애니메이션 ───
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 현재 보이는 카드들만 애니메이션 적용
    const animatedElements = document.querySelectorAll('.gf-prod-card');
    animatedElements.forEach((el, index) => {
      if (index < productsPerPage) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
      }
    });
  }
  
  // ─── 부드러운 스크롤 ───
  function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.gf-prod-hero-scroll');
    
    scrollIndicator?.addEventListener('click', () => {
      const mainSection = document.querySelector('.gf-prod-main');
      if (mainSection) {
        mainSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  

  
  // ─── 초기 실행 ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
  } else {
    initProducts();
  }
  
})();