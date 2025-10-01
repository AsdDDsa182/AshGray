(function(){
  'use strict';

  /* ===== 설정 ===== */
  const STORE_URL  = 'https://smartstore.naver.com/';
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRAXNYclCAqOkzqXe8fIHcMd0nQOIXcJeAC13xjKqobD3t7jdDZ-PjmtULNFJ5ZZr/exec';

  const BANNER = { type:'video', src:'https://res.cloudinary.com/dpxjvtbss/video/upload/v1759107647/intro_qrfya9.mp4', poster:'' };

  const SOCIAL_LINKS = [
    { type:'home',    label:'홈페이지',    href:'https://gofitkorea.com' },
    { type:'youtube', label:'유튜브',      href:'https://www.youtube.com/@gofitkorea1' },
    { type:'insta',   label:'인스타그램',  href:'https://www.instagram.com/gofitkorea/' },
    { type:'blog',    label:'블로그',      href:'https://blog.naver.com/gofitkorea' },
  ];

  const PRODUCTS = [
    { id:'tm-900',  title:'GOFIT 트레드밀 TM-900', image:'https://images.unsplash.com/photo-1517836357463-d25dfeac34c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:3800000, rental:{12:350000, 24:190000, 36:135000}, features:['IoT','Auto Incline','Commercial Grade'], category:'Cardio', type:'Treadmill', vat_ex: true, is_best:true, special_note: '3개월 무이자 할부 가능' },
    { id:'ex-900',  title:'GOFIT 렉 EX-900', image:'https://images.unsplash.com/photo-1594911760416-08169994c64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:2400000, rental:{12:220000, 24:120000, 36:85000}, features:['Full Rack','Safety Spotters','Multi Grip'], category:'Free Weights', type:'Power Rack', vat_ex: false },
    { id:'sm-900',  title:'GOFIT 스미스머신 SM-900', image:'https://images.unsplash.com/photo-1552196563-55fd26079d37?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:3200000, rental:{12:300000, 24:160000, 36:115000}, features:['Counter Balanced','Linear Bearings','Integrated Pulley'], category:'Free Weights', type:'Smith Machine', vat_ex: true },
    { id:'du-900',  title:'GOFIT 덤벨 세트 DU-900', image:'https://images.unsplash.com/photo-1550995646-7c087948a39a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:1800000, rental:{12:160000, 24:85000, 36:60000}, features:['Hex Rubber','Ergonomic Handle','3kg ~ 25kg'], category:'Free Weights', type:'Dumbbells', vat_ex: false },
    { id:'ab-900',  title:'GOFIT AB 슬링어 AB-900', image:'https://images.unsplash.com/photo-1549476483-149b5a26a457?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:850000, rental:{12:80000, 24:45000, 36:30000}, features:['Adjustable','Padded','Commercial'], category:'Strength', type:'Abdominal', vat_ex: true },
    { id:'bc-900',  title:'GOFIT 바벨 컬 머신 BC-900', image:'https://images.unsplash.com/photo-1549575402-45e334a17154?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:1500000, rental:{12:140000, 24:75000, 36:55000}, features:['Plate Loaded','Comfort Pad','Isolation'], category:'Strength', type:'Biceps', vat_ex: false },
    { id:'ro-900',  title:'GOFIT 로잉머신 RO-900', image:'https://images.unsplash.com/photo-1620614009088-75e11417036a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:4100000, rental:{12:380000, 24:200000, 36:140000}, features:['Air Resistance','Foldable','Monitor'], category:'Cardio', type:'Rower', vat_ex: true },
    { id:'kb-900',  title:'GOFIT 케틀벨 세트 KB-900', image:'https://images.unsplash.com/photo-1581009146145-b5ef050c8e1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:1200000, rental:{12:110000, 24:60000, 36:40000}, features:['Competition Style','Powder Coated','8kg ~ 32kg'], category:'Free Weights', type:'Kettlebells', vat_ex: false },
    { id:'pu-900',  title:'GOFIT 풀리 머신 PU-900', image:'https://images.unsplash.com/photo-1628151551061-05342a77a949?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:3500000, rental:{12:320000, 24:170000, 36:120000}, features:['Dual Pulley','Weight Stack','Adjustable Height'], category:'Strength', type:'Cable Machine', vat_best:true, vat_ex: true },
    { id:'el-900',  title:'GOFIT 일립티컬 EL-900', image:'https://images.unsplash.com/photo-1605296839352-7108933b9cf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:3000000, rental:{12:280000, 24:150000, 36:105000}, features:['Magnetic Resistance','Low Impact','Programmable'], category:'Cardio', type:'Elliptical', vat_ex: false },
    { id:'pc-900',  title:'GOFIT 플레이트 로드 체스트 프레스 PC-900', image:'https://images.unsplash.com/photo-1628102491689-f521b4a3a606?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:2100000, rental:{12:190000, 24:100000, 36:70000}, features:['Plate Loaded','Unilateral Movement','Adjustable Seat'], category:'Strength', type:'Chest Press', vat_ex: true },
    { id:'bi-900',  title:'GOFIT 실내 자전거 BI-900', image:'https://images.unsplash.com/photo-1631518389650-20c2269a8435?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price:2700000, rental:{12:250000, 24:135000, 36:95000}, features:['Commercial Grade','Adjustable Resistance','Comfort Seat'], category:'Cardio', type:'Spin Bike', vat_ex: false },
  ];

  const PROMO_SLIDER_ITEMS = [
    { title: '무이자 할부 최대 12개월', desc: '특정 카드사 한정, 트레드밀 및 랙 상품 적용', icon: 'credit_card' },
    { title: '전국 무료 배송 및 설치', desc: '도서 산간 지역 및 제주 지역 추가 비용 발생', icon: 'local_shipping' },
    { title: '최대 48개월 렌탈', desc: '초기 비용 부담 없이 최신 기구를 경험하세요', icon: 'event_available' },
    { title: 'A/S 2년 무상 제공', desc: '본사 규정에 따른 무상 보증 서비스', icon: 'build_circle' },
  ];

  /* ===== 변수 ===== */
  let quoteData = JSON.parse(localStorage.getItem('gfk_quote_data')) || {};
  let currentViewMode = localStorage.getItem('gfk_view_mode') || 'purchase'; // 'purchase' or 'rental'
  let currentRentalDuration = parseInt(localStorage.getItem('gfk_rental_duration'), 10) || 36; // 12, 24, 36

  // UI 요소 캐시
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const productGrid = $('#productGrid');
  const quoteSheet = $('#quoteSheet');
  const quoteSheetCloser = $('#quoteSheetCloser');
  const quoteList = $('#quoteList');
  const quoteListModal = $('#modalQuoteList');
  const quoteSummary = $('#quoteSummary');
  const quoteSummaryBox = $('.quote-summary-box');
  const loadMoreBtn = $('#loadMoreProducts');
  const viewToggleContainer = $('#viewToggleContainer');
  const durationToggleContainer = $('#durationToggleContainer');
  const rentalDisclaimer = $('#rentalDisclaimer');
  const flyToCart = $('#flyToCart');
  const mobileNav = $('#mobileNav');
  const mobileNavOpener = $('#mobileNavOpener');
  const mobileNavCloser = $('#mobileNavCloser');
  const promoSlider = $('#promoSlider');
  const modalQuoteForm = $('#modalQuoteForm');

  /* ===== 헬퍼 함수 ===== */
  function formatMoney(amount) {
    if (typeof amount !== 'number') return amount;
    return amount.toLocaleString('ko-KR') + '원';
  }

  function getPrice(product, mode, duration = 36) {
    if (mode === 'rental') {
      const price = product.rental[duration] || product.rental[Object.keys(product.rental)[0]];
      return price ? price : '문의';
    }
    return product.price;
  }

  function showToast(message) {
    const toast = $('#toastNotification');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // fly-to-cart 애니메이션
  function handleFlyToCart(targetEl, callback) {
    if (!targetEl || !flyToCart) {
      if (callback) callback();
      return;
    }
    const targetRect = targetEl.getBoundingClientRect();
    const cartRect = quoteSummary.getBoundingClientRect();
    const startX = targetRect.left + targetRect.width / 2;
    const startY = targetRect.top + targetRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    flyToCart.style.left = `${startX}px`;
    flyToCart.style.top = `${startY}px`;
    flyToCart.style.transform = 'scale(1)';
    flyToCart.style.opacity = '1';
    
    // 강제 리페인트
    void flyToCart.offsetWidth;

    // 최종 위치로 이동
    flyToCart.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0)`;
    flyToCart.style.opacity = '0';

    setTimeout(() => {
      flyToCart.style.transform = 'scale(0)';
      flyToCart.style.left = '0';
      flyToCart.style.top = '0';
      if (callback) callback();
    }, 800);
  }

  function updateQuoteUI() {
    const itemCount = Object.keys(quoteData).length;
    quoteSummary.dataset.count = itemCount;
    quoteSummary.classList.toggle('has-items', itemCount > 0);
    
    // 견적서 패널 (Sheet/Drawer) 업데이트
    let totalAmount = 0;
    let totalRentalPrice = 0;
    let rentalItemCount = 0;

    quoteList.innerHTML = '';
    quoteListModal.innerHTML = '';
    
    for (const id in quoteData) {
      const item = quoteData[id];
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) continue;

      const price = product.price;
      const rentalPrice = getPrice(product, 'rental', currentRentalDuration);
      
      if (item.mode === 'purchase') {
        totalAmount += price;
      } else if (item.mode === 'rental' && typeof rentalPrice === 'number') {
        totalRentalPrice += rentalPrice;
        rentalItemCount++;
      }

      // 견적서 리스트 템플릿
      const listItemHTML = `
        <li data-id="${id}" data-mode="${item.mode}">
          <div class="title">${product.title} (${item.mode === 'purchase' ? '구매' : item.mode === 'rental' ? `${currentRentalDuration}개월 렌탈` : ''})</div>
          <div class="price">${item.mode === 'purchase' ? formatMoney(price) : typeof rentalPrice === 'number' ? `${formatMoney(rentalPrice)}/월` : '문의'}</div>
          <button type="button" class="remove-btn" data-id="${id}" aria-label="견적 목록에서 제거">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </li>
      `;
      quoteList.insertAdjacentHTML('beforeend', listItemHTML);
      quoteListModal.insertAdjacentHTML('beforeend', listItemHTML);
    }
    
    // 견적서 요약 업데이트
    const quoteContent = [];
    if (totalAmount > 0) {
      quoteContent.push(`총 구매 금액: <strong>${formatMoney(totalAmount)}</strong>`);
    }
    if (totalRentalPrice > 0) {
      quoteContent.push(`월 예상 렌탈료 (${currentRentalDuration}개월): <strong>${formatMoney(totalRentalPrice)}/월</strong>`);
    }
    if (totalAmount === 0 && totalRentalPrice === 0 && itemCount > 0) {
      quoteContent.push('견적 금액은 문의 시 최종 확정됩니다.');
    }
    if (itemCount === 0) {
      quoteContent.push('견적 목록에 제품을 추가해 주세요.');
    }

    quoteSheet.classList.toggle('has-items', itemCount > 0);
    
    quoteSummary.innerHTML = quoteContent.join('<span class="sep"></span>');
    quoteSummaryBox.hidden = itemCount === 0;

    // 견적 요청 폼에 견적 목록 데이터를 숨김 필드로 추가
    const quoteDataInput = document.createElement('input');
    quoteDataInput.type = 'hidden';
    quoteDataInput.name = 'quoteData';
    quoteDataInput.value = JSON.stringify(quoteData);
    $('#modalQuoteForm').querySelector('[name="quoteData"]')?.remove();
    $('#modalQuoteForm').appendChild(quoteDataInput);

    // 견적서 목록 토글 (Drawer/Sheet)
    if (itemCount > 0) {
      quoteSheet.classList.add('active');
    } else {
      quoteSheet.classList.remove('active');
    }
    
    // 견적 요청 폼의 견적 목록 제목 업데이트
    $('#modalQuoteForm h3').textContent = itemCount > 0 ? '선택 제품 기반 문의/견적 요청' : '일반 문의 요청';
  }

  function updateProductGridPrices() {
    $$('.product-card').forEach(card => {
      const id = card.dataset.id;
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;

      const priceEl = card.querySelector('.price-main');
      const unitEl = card.querySelector('.price-unit');
      const unitRentalEl = card.querySelector('.price-unit-rental');
      const vatExEl = card.querySelector('.vat-ex-note');

      const price = getPrice(product, currentViewMode, currentRentalDuration);
      
      if (currentViewMode === 'purchase') {
        priceEl.textContent = formatMoney(product.price);
        unitEl.textContent = '구매가';
        unitRentalEl.textContent = '';
      } else {
        if (typeof price === 'number') {
          priceEl.textContent = formatMoney(price);
          unitEl.textContent = `${currentRentalDuration}개월 렌탈`;
          unitRentalEl.textContent = '월';
        } else {
          priceEl.textContent = '별도 문의';
          unitEl.textContent = '가격 확인';
          unitRentalEl.textContent = '';
        }
      }

      vatExEl.textContent = product.vat_ex ? '(VAT 별도)' : '(VAT 포함)';
      
      // 장바구니 버튼 텍스트 업데이트
      const button = card.querySelector('.add-to-quote-btn');
      const inQuote = quoteData[id];
      if (inQuote && inQuote.mode === currentViewMode) {
        button.textContent = '견적 목록에 있음';
        button.classList.add('in-quote');
      } else {
        button.textContent = currentViewMode === 'purchase' ? '견적 목록 추가 (구매)' : '견적 목록 추가 (렌탈)';
        button.classList.remove('in-quote');
      }
    });
    
    // UI 업데이트 (총액, 리스트 등)
    updateQuoteUI();
    // localStorage 업데이트
    localStorage.setItem('gfk_view_mode', currentViewMode);
    localStorage.setItem('gfk_rental_duration', currentRentalDuration.toString());
  }

  function handleProductAction(e) {
    const btn = e.target.closest('.add-to-quote-btn');
    if (!btn) return;

    e.preventDefault();
    const card = btn.closest('.product-card');
    const id = card.dataset.id;
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    // 이미 목록에 있고 모드도 같다면 제거
    const isRemove = quoteData[id] && quoteData[id].mode === currentViewMode;

    if (isRemove) {
      delete quoteData[id];
      showToast(`${product.title}이(가) 견적 목록에서 제거되었습니다.`);
      btn.classList.remove('in-quote');
      btn.textContent = currentViewMode === 'purchase' ? '견적 목록 추가 (구매)' : '견적 목록 추가 (렌탈)';
    } else {
      // 추가 또는 모드 변경
      quoteData[id] = { mode: currentViewMode };
      showToast(`${product.title}이(가) 견적 목록에 추가되었습니다.`);
      btn.classList.add('in-quote');
      btn.textContent = '견적 목록에 있음';
      
      // fly-to-cart 애니메이션
      handleFlyToCart(btn, () => {
        updateQuoteUI();
      });
    }

    localStorage.setItem('gfk_quote_data', JSON.stringify(quoteData));
    updateQuoteUI();
  }
  
  function handleQuoteListAction(e) {
    const btn = e.target.closest('.remove-btn');
    if (!btn) return;
    
    e.preventDefault();
    const id = btn.dataset.id;
    const product = PRODUCTS.find(p => p.id === id);
    
    if (quoteData[id]) {
      delete quoteData[id];
      showToast(`${product.title}이(가) 견적 목록에서 제거되었습니다.`);
      localStorage.setItem('gfk_quote_data', JSON.stringify(quoteData));
      updateProductGridPrices();
    }
  }

  let loadCount = 0;
  function loadMoreProducts() {
    const productsPerLoad = 6;
    const startIndex = loadCount * productsPerLoad;
    const endIndex = startIndex + productsPerLoad;
    const productsToRender = PRODUCTS.slice(startIndex, endIndex);

    if (productsToRender.length === 0) {
      if (loadMoreBtn) loadMoreBtn.hidden = true;
      return;
    }

    productsToRender.forEach(product => {
      const is_best = product.is_best ? '<div class="badge best">BEST</div>' : '';
      const is_new = product.is_new ? '<div class="badge new">NEW</div>' : '';
      
      const cardHTML = `
        <div class="product-card" data-id="${product.id}">
          <div class="card-badges">${is_best}${is_new}</div>
          <div class="img-area">
            <img src="${product.image}" alt="${product.title} 이미지" loading="lazy" />
          </div>
          <div class="card-body">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-features">
              ${product.features.map(f => `<span>${f}</span>`).join('')}
            </div>
            <div class="price-area">
              <div class="price-main"></div>
              <div class="price-info">
                <span class="price-unit"></span>
                <span class="price-unit-rental"></span>
                <span class="vat-ex-note"></span>
              </div>
            </div>
            ${product.special_note ? `<p class="special-note">${product.special_note}</p>` : ''}
            <button class="btn primary full-width add-to-quote-btn" data-id="${product.id}" aria-label="${product.title} 견적 목록에 추가"></button>
          </div>
        </div>
      `;
      productGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    loadCount++;
    updateProductGridPrices();

    if (endIndex >= PRODUCTS.length) {
      if (loadMoreBtn) loadMoreBtn.hidden = true;
    }
  }

  function handleFormSubmit(type, e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    // 견적 데이터 추가 (form data에 이미 hidden input으로 추가되어 있음)

    // FormData를 객체로 변환
    const object = {};
    data.forEach((value, key) => {
        object[key] = value;
    });

    // Google Apps Script로 전송
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // CORS 문제 회피
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: type === 'f' ? 'QuoteForm' : 'ContactForm',
          timestamp: new Date().toISOString(),
          ...object
        })
    })
    .then(() => {
        form.reset();
        showToast('✅ 문의/견적 요청이 성공적으로 접수되었습니다. 곧 회신드리겠습니다.');
        if (type === 'f') {
          // 모달 폼 제출 시 견적 목록 초기화 및 모달 닫기
          quoteData = {};
          localStorage.removeItem('gfk_quote_data');
          updateProductGridPrices(); // UI 업데이트 및 견적서 닫기
          $('#modalQuoteFormContainer').classList.remove('active');
        }
    })
    .catch((error) => {
        console.error('Form submission failed:', error);
        showToast('❌ 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = type === 'f' ? '문의/견적 요청' : '문의 요청';
    });
  }

  function renderBanner() {
    const bannerContainer = $('#hero .wrap');
    if (!bannerContainer) return;

    if (BANNER.type === 'video') {
      bannerContainer.insertAdjacentHTML('afterbegin', `
        <video id="heroVideo" class="hero-bg-video" autoplay loop muted playsinline poster="${BANNER.poster}">
          <source src="${BANNER.src}" type="video/mp4">
        </video>
      `);
      // 로딩 후 재생 (iOS/Safari 대응)
      const video = document.getElementById('heroVideo');
      if (video) {
        video.oncanplaythrough = () => {
          video.play().catch(e => console.error("Video play failed:", e));
        };
      }
    } else {
      bannerContainer.style.backgroundImage = `url(${BANNER.src})`;
      bannerContainer.style.backgroundSize = 'cover';
      bannerContainer.style.backgroundPosition = 'center';
    }
  }

  function renderChannels() {
    const channelContainer = $('#channelLinks');
    if (!channelContainer) return;

    SOCIAL_LINKS.forEach(link => {
      channelContainer.insertAdjacentHTML('beforeend', `
        <a href="${link.href}" target="_blank" class="channel-link ${link.type}" aria-label="${link.label}">
          <i class="material-icons">${link.type === 'home' ? 'language' : link.type}</i>
        </a>
      `);
    });
  }
  
  function setupPromoSlider() {
    if (!promoSlider) return;
    
    // 슬라이드 요소 생성
    promoSlider.innerHTML = PROMO_SLIDER_ITEMS.map(item => `
      <div class="promo-slide">
        <div class="promo-icon"><i class="material-icons">${item.icon}</i></div>
        <div class="promo-text">
          <div class="promo-title">${item.title}</div>
          <div class="promo-desc">${item.desc}</div>
        </div>
      </div>
    `).join('');
    
    // Swiper와 유사한 간단한 무한 슬라이더 로직 (CSS animation으로 대체 가능하지만, JS로 구현)
    let currentIndex = 0;
    const slides = $$('#promoSlider .promo-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    const updateSlider = () => {
      promoSlider.style.transform = `translateX(${-currentIndex * 100}%)`;
    };
    
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    };
    
    setInterval(nextSlide, 5000); // 5초마다 자동 슬라이드
  }

  function blurOnOutsideTap(e){
    const ae = document.activeElement; 
    if (!ae) return; 
    const isField = (el)=> el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'); 
    // .gate-card는 모달과 메인 문의 폼 모두에 적용되므로 로직 유지
    if (isField(ae) && !e.target.closest('input, textarea, .gate-card')) { 
      ae.blur(); 
    } 
  }

  // NEW FUNCTION: 메인 문의 폼 모바일 키보드 스크롤 보정
  /**
   * 메인 페이지의 문의 폼 입력 필드에 포커스 시, 
   * 가상 키보드가 입력 필드를 가리지 않도록 뷰포트 중앙으로 스크롤을 보정합니다.
   */
  function setupContactFormFocusScroll() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // 메인 페이지 문의 폼의 모든 입력 필드
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        // 가상 키보드가 열리는 시간을 기다린 후 스크롤을 수행합니다.
        setTimeout(() => {
          // 해당 입력 필드를 뷰포트의 중앙으로 부드럽게 스크롤합니다.
          // 'center'는 키보드 위에 놓기에 가장 안전한 위치입니다.
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300); // 300ms 딜레이
      }, {passive: true}); // passive: true로 모바일 스크롤 성능 개선
    });
  }

  document.addEventListener('touchstart', blurOnOutsideTap, {passive:true});
  document.addEventListener('mousedown', blurOnOutsideTap);

  /* ===== 이벤트 리스너 및 초기화 ===== */
  if (productGrid) {
    productGrid.addEventListener('click', handleProductAction);
  }
  
  if (quoteList) {
    quoteList.addEventListener('click', handleQuoteListAction);
  }

  if (quoteSheetCloser) {
    quoteSheetCloser.addEventListener('click', (e) => {
      e.preventDefault();
      quoteSheet.classList.remove('active');
    });
  }
  
  if (quoteSummary) {
    quoteSummary.addEventListener('click', (e) => {
      // 모바일 (Sheet)에서는 닫힐 때만 다시 열리도록 처리
      if (window.innerWidth < 1080 && !quoteSheet.classList.contains('active')) {
        quoteSheet.classList.add('active');
      }
      
      // 모달 열기 (Sheet/Drawer에 있는 견적 요청 버튼)
      if (e.target.closest('.modal-opener')) {
        const modalContainer = $('#modalQuoteFormContainer');
        if (modalContainer) {
          modalContainer.classList.add('active');
          document.body.classList.add('modal-open');
        }
      }
    });
  }
  
  $$('.modal-closer').forEach(closer => {
    closer.addEventListener('click', (e) => {
      e.preventDefault();
      const modalContainer = e.target.closest('.modal-container');
      if (modalContainer) {
        modalContainer.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });

  if (mobileNavOpener) {
    mobileNavOpener.addEventListener('click', () => {
      mobileNav.classList.add('active');
    });
  }
  if (mobileNavCloser) {
    mobileNavCloser.addEventListener('click', () => {
      mobileNav.classList.remove('active');
    });
  }

  if (viewToggleContainer) {
    viewToggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-toggle');
      if (!btn) return;
      
      const selectedView = btn.dataset.view;
      if (selectedView === currentViewMode) return;
      
      // 뷰 모드 변경 시 견적서 목록 초기화 확인
      if (Object.keys(quoteData).length > 0) {
        if (!confirm('경고: 견적서 모드를 변경하면 기존 목록이 초기화됩니다. 계속하시겠습니까?')) {
          return;
        }
        quoteData = {};
        localStorage.removeItem('gfk_quote_data');
        showToast('견적서가 초기화되었습니다.');
      }

      currentViewMode = selectedView;
      viewToggleContainer.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isRental = currentViewMode === 'rental';
      durationToggleContainer.hidden = !isRental;
      rentalDisclaimer.hidden = !isRental;
      updateProductGridPrices();
    });
  }

  if (durationToggleContainer) {
    durationToggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.duration-toggle');
      if (!btn) return;
      const selectedDuration = btn.dataset.duration === 'etc' ? 'etc' : parseInt(btn.dataset.duration, 10);
      if (selectedDuration === currentRentalDuration) return;
      currentRentalDuration = selectedDuration;
      durationToggleContainer.querySelectorAll('.duration-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateProductGridPrices();
    });
  }

  (function init(){
    renderBanner(); renderChannels(); updateQuoteUI(); setupPromoSlider();
    document.getElementById('yy').textContent = new Date().getFullYear();
    if (loadMoreBtn) { loadMoreBtn.addEventListener('click', loadMoreProducts); }
    loadMoreProducts();
    $('#modalQuoteForm').addEventListener('submit', (e) => handleFormSubmit('f', e));
    $('#contactForm').addEventListener('submit', (e) => handleFormSubmit('c', e));
    setupContactFormFocusScroll(); // 메인 페이지 문의 폼 스크롤 보정 함수 호출 추가
  })();

})();