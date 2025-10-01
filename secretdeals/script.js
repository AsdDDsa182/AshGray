(function(){
  'use strict';

  // [ADD] 스크롤 위치 보존/복원 유틸 (모바일 점프 현상 해결)
  let __savedScrollY = 0;
  let __lockCount = 0; // nested locks 지원
  function lockBodyScroll() {
    __lockCount++;
    if (__lockCount > 1) return; // 이미 잠금 중이면 재실행 막기
    __savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${__savedScrollY}px`;
    document.body.classList.add('scroll-lock');
  }
  function unlockBodyScroll() {
    if (__lockCount === 0) return;
    __lockCount--;
    if (__lockCount > 0) return; // 아직 다른 잠금이 남아있음
    document.body.classList.remove('scroll-lock');
    const y = __savedScrollY || 0;
    document.body.style.top = '';
    window.scrollTo(0, y);
  }


  /* ============================================== */
  /* ============== 1. 상수 및 설정 영역 ============== */
  /* ============================================== */
  const STORE_URL  = 'https://smartstore.naver.com/';
  
  const QUOTATION_KEY = 'gofitQuotation'; // [NEW] 로컬 스토리지 키 정의

  const BANNER = { type:'video', src:'https://res.cloudinary.com/dpxjvtbss/video/upload/v1759107647/intro_qrfya9.mp4', poster:'' };

  const SOCIAL_LINKS = [
    { type:'home',    label:'홈페이지',    href:'https://gofitkorea.com' },
    { type:'youtube', label:'유튜브',      href:'https://www.youtube.com/@gofitkorea1' },
    { type:'insta',   label:'인스타그램',  href:'https://www.instagram.com/gofitkorea/' },
    { type:'blog',    label:'블로그',      href:'https://blog.naver.com/gofitkorea' },
  ];

  const PRODUCTS = [
    { id:'tm-900',  title:'GOFIT 트레드밀 TM-900', image:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop', original:2990000, sale:1990000, link:STORE_URL, nshop:'https://smartstore.naver.com/gofitkorea/products/12463900656', rental:{3:159000, 6:139000, 12:119000, 24:99000, 36:89000, 48:79000, 64:69000} },
    { id:'sb-plate',title:'GOFIT 스톤블랙 원판 세트 100kg', image:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop', original: 890000, sale: 629000, link:STORE_URL, nshop:'#' },
    { id:'rack-hr', title:'GOFIT 하프랙 PRO',            image:'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop', original:1590000, sale:1090000, link:'#', nshop:'#', rental:{3:89000, 6:79000, 12:69000, 24:59000, 36:49000, 48:39000} },
    { id:'bench-pro', title:'GOFIT 조절식 벤치 PRO', image:'https://images.unsplash.com/photo-1574680096145-f844349f0409?q=80&w=1200&auto=format&fit=crop', original:450000, sale:320000, link:STORE_URL, nshop:'#' },
    { id:'leg-press', title:'GOFIT 레그 프레스 머신', image:'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop', original:350000, sale:2800000, link:STORE_URL, nshop:'#', rental:{6:250000, 12:220000, 24:190000, 36:160000} },
    { id:'cable-cross', title:'GOFIT 케이블 크로스오버', image:'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop', original:4200000, sale:3500000, link:STORE_URL, nshop:'#', rental:{6:320000, 12:290000, 24:260000, 36:230000, 48:200000} },
    { id:'dumbbell-set', title:'GOFIT 육각 덤벨 세트', image:'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop', original:990000, sale:750000, link:STORE_URL, nshop:'#' },
    { id:'smith-machine', title:'GOFIT 3D 스미스 머신', image:'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop', original:5500000, sale:4800000, link:STORE_URL, nshop:'#' },
    { id:'pull-up-bar', title:'GOFIT 프리미엄 치닝디핑', image:'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1200&auto=format&fit=crop', original:350000, sale:280000, link:STORE_URL, nshop:'#' },
    { id:'yoga-mat', title:'GOFIT TPE 요가매트', image:'https://images.unsplash.com/photo-1591291621235-9152b02416f4?q=80&w=1200&auto=format&fit=crop', original:50000, sale:35000, link:STORE_URL, nshop:'#' },
    { id:'rowing-machine', title:'GOFIT 로잉 머신 R-700', image:'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200&auto=format&fit=crop', original:1200000, sale:950000, link:STORE_URL, nshop:'#' }
  ];

  const PRODUCTS_TO_SHOW = 8;
  let productsDisplayed = 0;
  
  let currentViewMode = 'sale';
  let currentRentalDuration = 24;

  const PROMO_IMAGES = [
    { srcDesktop: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&h=700&auto=format&fit=crop', srcMobile: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=750&h=1000&auto=format&fit=crop', href: '#' },
    { srcDesktop: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1600&h=700&auto=format&fit=crop', srcMobile: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=750&h=1000&auto=format&fit=crop', href: '#' },
    { srcDesktop: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&h=700&auto=format&fit=crop', srcMobile: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=750&h=1000&auto=format&fit=crop', href: '#' }
  ];

  /* ============================================== */
  /* ============= 2. 유틸리티 함수 및 DOM 참조 ============= */
  /* ============================================== */
  const fmtKRW = n => new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(n);
  const $ = s => document.querySelector(s);
  const el = (html) => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };

  const bannerRoot=$('#bannerRoot');
  const channelsGrid=$('#channelsGrid');
  const grid=$('#productGrid'), emptyState=$('#emptyState'), tpl=$('#productTpl');
  const loadMoreBtn = $('#loadMoreBtn');
  const hamburgerBtn = $('#hamburgerBtn');
  const mobileNav = $('#mobileNav');
  const closeMobileNavBtn = $('#closeMobileNavBtn');

  const viewToggleContainer = $('.view-toggle-container');
  const durationToggleContainer = $('.duration-toggle-container');
  const rentalDisclaimer = $('.rental-disclaimer');
  
  // [NEW] 견적함 관련 DOM 참조
  const quotationCartIcon = $('#quotationCartIcon');
  const cartBadge = $('#cartBadge');
  const quotationCartModal = $('#quotationCartModal');
  const modalCartList = $('#modalCartList');
  const modalCartCount = $('#modalCartCount');
  const modalCartType = $('#modalCartType');
  const requestQuoteBtn = $('#requestQuoteBtn');
  const summaryTotalCount = $('#summaryTotalCount');
  const summaryTotalPrice = $('#summaryTotalPrice');
  const summaryTotalLabel = $('#summaryTotalLabel');
  const quotationAlertModal = $('#quotationAlertModal');
  const alertMessage = $('#alertMessage');
  const alertConfirmBtn = $('#alertConfirmBtn');
  let pendingProduct = null; // 복합 담기 로직을 위한 임시 저장소

  // [ADD] 스크롤 위치 보존/복원 유틸
  let savedScrollY = 0;
  let lockCount = 0; // nested locks 지원
  
  function lockBodyScroll() {
    lockCount++;
    if (lockCount > 1) return; // 이미 잠금 중이면 재실행 막기
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('scroll-lock');
  }
  
  function unlockBodyScroll() {
    if (lockCount === 0) return;
    lockCount--;
    if (lockCount > 0) return; // 아직 다른 잠금이 남아있음
    document.body.classList.remove('scroll-lock');
    const y = savedScrollY || 0;
    document.body.style.top = '';
    window.scrollTo(0, y);
  }

  // [ADD] 로고 클릭 → 최상단 스무스 스크롤
  window.scrollToTop = function(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // [ADD] 토스트 알림
  function showToast(message) {
    // 임시 토스트 구현 (HTML에 #toast 요소가 있다고 가정)
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  /* ============================================== */
  /* =============== 3. UI 렌더링 함수 ============== */
  /* ============================================== */

  function setupPromoSlider() { 
    const container = $('#promoSliderSection'); 
    if (!container) return; 
    const track = $('#promoSliderTrack'); 
    const prevBtn = $('#promoPrevBtn'); 
    const nextBtn = $('#promoNextBtn'); 
    const indicatorsContainer = $('#promoSliderIndicators'); 
    const isDesktop = window.matchMedia('(min-width: 720px)').matches; 
    
    // [수정됨] 이미지 로드 실패 문제를 해결하기 위해, 유효한 경로로 가정합니다.
    track.innerHTML = PROMO_IMAGES.map(promo => { 
      const imageUrl = isDesktop ? promo.srcDesktop : promo.srcMobile; 
      return `<a href="${promo.href}" target="_blank" rel="noopener" class="promo-slide" draggable="false"><img src="${imageUrl}" alt="프로모션 이미지" loading="lazy" draggable="false" /></a>`; 
    }).join(''); 
    
    const slides = track.querySelectorAll('.promo-slide'); 
    if (slides.length <= 1) { 
      if(prevBtn) prevBtn.hidden = true; 
      if(nextBtn) nextBtn.hidden = true; 
      if(indicatorsContainer) indicatorsContainer.hidden = true; 
      return; 
    } 
    
    PROMO_IMAGES.forEach((_, index) => { 
      const dot = document.createElement('button'); 
      dot.className = 'promo-indicator-dot'; 
      dot.dataset.index = index; 
      dot.setAttribute('aria-label', `${index + 1}번 슬라이드로 이동`); 
      indicatorsContainer.appendChild(dot); 
    }); 
    
    const dots = indicatorsContainer.querySelectorAll('.promo-indicator-dot'); 
    let currentIndex = 0; 
    let autoPlayInterval = null; 
    let isDragging = false; 
    let startPos = 0; 
    let currentTranslate = 0; 
    let prevTranslate = 0; 
    let animationID; 

    const updateIndicators = () => { 
      dots.forEach((dot, index) => { 
        dot.classList.toggle('active', index === currentIndex); 
      }); 
    }; 
    
    const setSliderPosition = () => { 
      track.style.transform = `translateX(${currentTranslate}px)`; 
    }; 
    
    const goToSlide = (slideIndex) => { 
      currentIndex = (slideIndex + slides.length) % slides.length; 
      const slideWidth = slides[0].getBoundingClientRect().width; 
      currentTranslate = currentIndex * -slideWidth; 
      prevTranslate = currentTranslate; 
      track.style.transition = 'transform 0.5s ease-in-out'; 
      setSliderPosition(); 
      updateIndicators(); 
    }; 
    
    const startAutoPlay = () => { 
      stopAutoPlay(); 
      autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000); 
    }; 
    
    const stopAutoPlay = () => clearInterval(autoPlayInterval); 
    
    const getPositionX = (event) => { 
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX; 
    }; 
    
    const animation = () => { 
      setSliderPosition(); 
      if (isDragging) requestAnimationFrame(animation); 
    }; 
    
    const dragStart = (event) => { 
      isDragging = true; 
      startPos = getPositionX(event); 
      animationID = requestAnimationFrame(animation); 
      track.style.transition = 'none'; 
      stopAutoPlay(); 
    }; 
    
    const drag = (event) => { 
      if (isDragging) { 
        const currentPosition = getPositionX(event); 
        currentTranslate = prevTranslate + currentPosition - startPos; 
      } 
    }; 
    
    const dragEnd = () => { 
      if (!isDragging) return; 
      isDragging = false; 
      cancelAnimationFrame(animationID); 
      const movedBy = currentTranslate - prevTranslate; 
      if (movedBy < -50 && currentIndex < slides.length - 1) { 
        currentIndex++; 
      } 
      if (movedBy > 50 && currentIndex > 0) { 
        currentIndex--; 
      } 
      goToSlide(currentIndex); 
      startAutoPlay(); 
    }; 
    
    prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); }); 
    nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); }); 
    indicatorsContainer.addEventListener('click', e => { 
      if (e.target.matches('.promo-indicator-dot')) { 
        const index = parseInt(e.target.dataset.index, 10); 
        goToSlide(index); 
        startAutoPlay(); 
      } 
    }); 
    
    track.addEventListener('mousedown', dragStart); 
    track.addEventListener('touchstart', dragStart, { passive: true }); 
    track.addEventListener('mouseup', dragEnd); 
    track.addEventListener('mouseleave', dragEnd); 
    track.addEventListener('touchend', dragEnd); 
    track.addEventListener('mousemove', drag); 
    track.addEventListener('touchmove', drag, { passive: true }); 
    window.addEventListener('resize', () => goToSlide(currentIndex)); 
    
    const observer = new IntersectionObserver(entries => { 
      if (entries[0].isIntersecting) { 
        goToSlide(currentIndex); 
        startAutoPlay(); 
      } else { 
        stopAutoPlay(); 
      } 
    }, { threshold: 0.5 }); 
    observer.observe(container); 
    updateIndicators(); 
  }

  function renderBanner(){ 
    bannerRoot.innerHTML=''; 
    let mediaHTML = ''; 
    if (BANNER.type === 'video' && BANNER.src){ 
      mediaHTML = `<video class="vid" muted playsinline loop preload="metadata" ${BANNER.poster?`poster="${BANNER.poster}"`:''}></video>`; 
    } else if (BANNER.src){ 
      mediaHTML = `<img class="img" src="${BANNER.src}" alt="" loading="lazy" />`; 
    } 
    const node = el(`<div class="media">${mediaHTML}</div>`); 
    bannerRoot.appendChild(node); 
    
    if (BANNER.type === 'video' && BANNER.src){ 
      const video = node.querySelector('video.vid'); 
      const source = document.createElement('source'); 
      source.src = BANNER.src; 
      source.type='video/mp4'; 
      video.appendChild(source); 
      
      const io = new IntersectionObserver(entries=>{ 
        entries.forEach(ent=>{ 
          if(ent.isIntersecting) video.play().catch(()=>{}); 
          else video.pause(); 
        }); 
      },{threshold:0.25}); 
      io.observe(video); 
      
      const toggle=()=>{ 
        if(video.paused) video.play().catch(()=>{}); 
        else video.pause(); 
      }; 
      video.addEventListener('click', toggle); 
      video.addEventListener('touchstart', toggle, {passive:true}); 
    } 
  }

  function channelIcon(type){ 
    switch(type){ 
      case 'home': return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21.71,11.29l-9-9a1,1,0,0,0,-1.42,0l-9,9a1,1,0,0,0,1.42,1.42L12,4.41l8.29,8.3a1,1,0,0,0,1.42-1.42Z" opacity="0.5"/><path d="M19,22H5a3,3,0,0,1-3-3V12.41a1,1,0,0,1,.29-.71l3-3a1,1,0,0,1,1.42,1.42L4,12.41V19a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12.41l-2.71-2.7a1,1,0,0,1,1.42-1.42l3,3A1,1,0,0,1,22,12.41V19A3,3,0,0,1,19,22Z"/></svg>`; 
      case 'youtube': return `<svg viewBox="0 0 24 24"><path fill="#FF0000" d="M21.58 7.19A2.19 2.19 0 0 0 20 5.61C18.2 5 12 5 12 5s-6.2 0-8 .61A2.19 2.19 0 0 0 2.42 7.19C2 9.05 2 12 2 12s0 2.95.42 4.81a2.19 2.19 0 0 0 1.58 1.58C5.8 19 12 19 12 19s6.2 0 8-.61a2.19 2.19 0 0 0 1.58-1.58C22 14.95 22 12 22 12s0-2.95-.42-4.81zM10 15.34V8.66L15.68 12 10 15.34z"/></svg>`; 
      case 'insta': return `<svg viewBox="0 0 24 24"><defs><radialGradient id="ig-grad" cx="0.3" cy="1" r="1.5"><stop offset="0" stop-color="#FCD674"/><stop offset="0.2" stop-color="#F6B864"/><stop offset="0.5" stop-color="#D9396D"/><stop offset="0.8" stop-color="#9C38B8"/><stop offset="1" stop-color="#4F5BD5"/></radialGradient></defs><path fill="url(#ig-grad)" d="M12 1.62c-3.26 0-3.67.01-4.95.07-1.28.06-2.16.25-2.93.56a4.8 4.8 0 00-1.74 1.74c-.3.77-.5 1.65-.56 2.93-.06 1.28-.07 1.69-.07 4.95s.01 3.67.07 4.95c.06 1.28.25 2.16.56 2.93a4.8 4.8 0 001.74 1.74c.77.3 1.65.5 2.93.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.16-.25 2.93-.56a4.8 4.8 0 001.74-1.74c.3-.77.5-1.65.56-2.93.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.25-2.16-.56-2.93A4.8 4.8 0 0019.88 2.8c-.77-.3-1.65-.5-2.93-.56C15.67 1.63 15.26 1.62 12 1.62zM12 3.5c3.18 0 3.56.01 4.8.07 1.17.05 1.8.23 2.22.4.65.25.96.56 1.21 1.21.17.42.35 1.05.4 2.22.06 1.24.07 1.62.07 4.8s-.01 3.56-.07 4.8c-.05 1.17-.23 1.8-.4 2.22a2.93 2.93 0 01-1.21 1.21c-.42.17-1.05.35-2.22.4-1.24.06-1.62.07-4.8.07s-3.56-.01-4.8-.07c-1.17-.05-1.8-.23-2.22-.4a2.93 2.93 0 01-1.21-1.21c-.17-.42-.35-1.05-.4-2.22C3.51 15.56 3.5 15.18 3.5 12s.01-3.56.07-4.8c.05-1.17.23 1.8.4-2.22A2.93 2.93 0 015.18 3.9c.42-.17 1.05-.35 2.22-.4C8.44 3.51 8.82 3.5 12 3.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.12A3.12 3.12 0 1115.12 12 3.12 3.12 0 0112 15.12zM16.95 6a1.2 1.2 0 101.2 1.2 1.2 1.2 0 00-1.2-1.2z"/></svg>`; 
      case 'blog': return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20,2H4A3,3,0,0,0,1,5V15a3,3,0,0,0,3,3H16.59l3.7,3.71A1,1,0,0,0,21,22a.84.84,0,0,0,.38-.08A1,1,0,0,0,22,21V5A3,3,0,0,0,19,2ZM20,19.59l-2.29-2.3A1,1,0,0,0,17,17H4a1,1,0,0,1-1-1V5A1,1,0,0,1,4,4H20Z" opacity="0.5"/><path d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11Z"/></svg>`; 
      default: return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>`; 
    } 
  }

  function renderChannels(){ 
    channelsGrid.innerHTML=''; 
    SOCIAL_LINKS.forEach(c=>{ 
      const node = el(`<a class="ch" href="${c.href}" target="_blank" rel="noopener"><div class="ico">${channelIcon(c.type)}</div><div class="lab">${c.label}</div></a>`); 
      channelsGrid.appendChild(node); 
    }); 
  }


  function updateViewModeUI() {
      const isRental = currentViewMode === 'rental';
      
      if (durationToggleContainer) {
        durationToggleContainer.hidden = !isRental; 
        
        // 🚨 [추가/수정 로직] 렌탈 모드일 때만 버튼의 활성화 상태를 관리합니다.
        if (isRental) {
            // 1. 모든 버튼의 active를 제거합니다. (새 버튼 활성화를 위해)
            durationToggleContainer.querySelectorAll('.duration-toggle').forEach(b => {
                b.classList.remove('active');
            });
            
            // 2. 현재 선택된 기간(초기값 24)에 해당하는 버튼을 활성화합니다.
            const defaultBtn = durationToggleContainer.querySelector(`[data-duration="${currentRentalDuration}"]`);
            if (defaultBtn) {
                defaultBtn.classList.add('active');
            }
        }
      }
      
      if (rentalDisclaimer) {
        rentalDisclaimer.hidden = !isRental;
      }
      
      // [NEW] 뷰 모드 전환 시 장바구니 초기화 로직 (경고 포함)
      const currentCartType = getCartType();
      const newMode = currentViewMode;
      
      // 장바구니에 제품이 있고, 유형이 다를 경우 경고 및 초기화
      if (currentCartType && currentCartType !== newMode) {
          const ok = confirm(
              `현재 장바구니에는 '${currentCartType === "sale" ? "판매가" : "렌탈가"}' 제품이 담겨있습니다.\n'${newMode === "sale" ? "판매가" : "렌탈가"} 보기'로 전환하면 장바구니가 초기화됩니다.\n전환하시겠습니까?`
          );
          if (ok) {
              clearCart();
              showToast("장바구니가 초기화되었습니다.");
          } else {
              // 사용자가 취소하면 뷰 모드를 되돌림
              const oldMode = newMode === "sale" ? "rental" : "sale";
              currentViewMode = oldMode;
              document.querySelector(`.view-toggle[data-view="${oldMode}"]`).classList.add("active");
              document.querySelector(`.view-toggle[data-view="${newMode}"]`).classList.remove("active");
              return; 
          }
      }
  }


  function updateProductGridPrices() {
    const cards = document.querySelectorAll('#productGrid .card');
    const cartItems = getCartItems(); // [NEW] 장바구니 목록을 가져옵니다.

    cards.forEach(card => {
      const productId = card.dataset.productId;
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const priceOrigEl = card.querySelector('.p-orig');
      const priceSaleEl = card.querySelector('.p-sale');
      const rentalInfoEl = card.querySelector('.p-rental-info');
      
      priceSaleEl.classList.remove('price-unavailable');

      if (currentViewMode === 'sale') {
        priceOrigEl.textContent = fmtKRW(product.original);
        priceSaleEl.textContent = fmtKRW(product.sale);
        rentalInfoEl.hidden = true;
      } else { // rental
        priceOrigEl.textContent = '';
        const isAvailable = product.rental && product.rental[currentRentalDuration];
        if (isAvailable) {
          priceSaleEl.textContent = fmtKRW(product.rental[currentRentalDuration]);
          rentalInfoEl.hidden = false;
        } else if (currentRentalDuration === 'etc') {
            priceSaleEl.textContent = '별도 문의';
            rentalInfoEl.hidden = true;
        } else {
          priceSaleEl.textContent = '렌탈 불가';
          priceSaleEl.classList.add('price-unavailable');
          rentalInfoEl.hidden = true;
        }
      }

      // [MODIFIED] 장바구니 버튼 업데이트 (텍스트는 '장바구니'로 고정)
      const quoteBtn = card.querySelector('.p-quote');
      if (quoteBtn) {
        quoteBtn.textContent = '장바구니'; // 텍스트 '장바구니'로 통일
        
        if (cartItems.some(item => item.id === productId)) {
          quoteBtn.classList.add('active-in-cart'); // 담긴 상태 클래스 추가
        } else {
          quoteBtn.classList.remove('active-in-cart'); // 담긴 상태 클래스 제거
        }
      }
    });
  }

  function loadMoreProducts(){
    // 🔥 [보강됨] 제품 로드 시점을 정확히 통제합니다.
    if (productsDisplayed === 0) {
      grid.innerHTML = ''; // 그리드 내용을 비웁니다.
    }

    const loadMoreContainer = loadMoreBtn ? loadMoreBtn.parentElement : null;
    const cartItems = getCartItems(); // [NEW] 장바구니 목록을 가져옵니다.

    if (!PRODUCTS.length) { 
      emptyState.hidden = false; 
      if(loadMoreContainer) loadMoreContainer.hidden = true; 
      return; 
    }
    
    emptyState.hidden = true;
    const fragment = document.createDocumentFragment();
    const productsToLoad = PRODUCTS.slice(productsDisplayed, productsDisplayed + PRODUCTS_TO_SHOW);
    
    productsToLoad.forEach(p => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.card');
      card.dataset.productId = p.id;
      
      const img=node.querySelector('.p-img'); 
      img.src=p.image; 
      img.alt=p.title; 
      img.loading='lazy';
      img.onerror=function(){ this.onerror=null; this.src=PRODUCTS[1].image; };
      
      node.querySelector('.p-title').textContent=p.title;
      const priceOrigEl = node.querySelector('.p-orig');
      const priceSaleEl = node.querySelector('.p-sale');
      const rentalInfoEl = node.querySelector('.p-rental-info');
      
      priceSaleEl.classList.remove('price-unavailable');

      if (currentViewMode === 'sale') {
        priceOrigEl.textContent = fmtKRW(p.original);
        priceSaleEl.textContent = fmtKRW(p.sale);
        rentalInfoEl.hidden = true;
      } else {
        priceOrigEl.textContent = '';
        const isAvailable = p.rental && p.rental[currentRentalDuration];
        if (isAvailable) {
          priceSaleEl.textContent = fmtKRW(p.rental[currentRentalDuration]);
          rentalInfoEl.hidden = false;
        } else if (currentRentalDuration === 'etc') {
          priceSaleEl.textContent = '별도 문의';
          rentalInfoEl.hidden = true;
        } else {
          priceSaleEl.textContent = '렌탈 불가';
          priceSaleEl.classList.add('price-unavailable');
          rentalInfoEl.hidden = true;
        }
      }
      
      // [MODIFIED] 견적서 담기 버튼 처리 (토글 로직 반영)
      const quoteBtn = node.querySelector('.p-quote');
      if (quoteBtn) {
        quoteBtn.textContent = '장바구니'; // 텍스트 '장바구니'로 통일
        quoteBtn.dataset.id = p.id;
        
        quoteBtn.onclick = (event) => { // <-- event 객체를 받도록 수정
          const product = PRODUCTS.find(prod => prod.id === p.id);
          if (product) {
            toggleQuotationCart(product, currentViewMode, event); // event를 전달
          }
        };

        // 장바구니에 담긴 제품은 .active-in-cart 클래스 추가
        if (cartItems.some(item => item.id === p.id)) {
          quoteBtn.classList.add('active-in-cart');
        } else {
          quoteBtn.classList.remove('active-in-cart');
        }
      }

      const nshopBtn = node.querySelector('.p-nshop');
      if (p.nshop && p.nshop !== '#') { nshopBtn.href = p.nshop; } else { nshopBtn.href = '#'; nshopBtn.setAttribute('aria-disabled', 'true'); }
      const linkBtn = node.querySelector('.p-link');
      if (p.link && p.link !== '#') { linkBtn.href = p.link; } else { linkBtn.href = '#'; linkBtn.setAttribute('aria-disabled', 'true'); }
      
      fragment.appendChild(node);
    });
    
    grid.appendChild(fragment);
    productsDisplayed += productsToLoad.length;
    
    if (productsDisplayed >= PRODUCTS.length) { 
      if(loadMoreContainer) loadMoreContainer.hidden = true; 
    } else { 
      if(loadMoreContainer) loadMoreContainer.hidden = false; 
    }
  }

  /* ============================================== */
  /* ============= 4. 이벤트 및 UI 제어 함수 ============= */
  /* ============================================== */

  // [수정됨] 햄버거 메뉴 열기/닫기 함수 (e.preventDefault() 추가 및 전역 노출)
  window.openMobileNav = function(e) {
    if (e) {
      e.preventDefault(); // <-- ADDED: 기본 동작(최상단 이동) 차단
      e.stopPropagation();
    }
    
    if (!mobileNav || !hamburgerBtn) return;
    
    mobileNav.classList.add('open'); 
    mobileNav.setAttribute('aria-hidden', 'false'); 
    hamburgerBtn.setAttribute('aria-expanded', 'true'); 
    lockBodyScroll(); // 스크롤 잠금
  }

  // [수정됨] 햄버거 메뉴 닫기 함수 (전역 노출 및 e.preventDefault() 추가)
  window.closeMobileNav = function(e) { 
    if (e) {
      e.preventDefault(); // <-- ADDED: 기본 동작(최상단 이동) 차단
      e.stopPropagation();
    }
    
    if (!mobileNav || !hamburgerBtn) return;
    
    mobileNav.classList.remove('open'); 
    mobileNav.setAttribute('aria-hidden', 'true'); 
    hamburgerBtn.setAttribute('aria-expanded', 'false'); 
    unlockBodyScroll(); // 스크롤 잠금 해제
  }

  // 햄버거 버튼은 index.html에서 onclick="openMobileNav(event)"로 호출되므로 별도 addEventListener 제거
  closeMobileNavBtn.addEventListener('click', closeMobileNav);
  
  document.addEventListener('keydown', e=>{ 
    if(e.key==='Escape') { 
      closeMobileNav(e); // Esc 키 이벤트에도 e를 전달
      closeQuotationModal(); // [NEW] Esc 키로 모달 닫기
      closeQuotationAlert(); // [NEW] Esc 키로 알림 닫기
    } 
  });
  
  const mqDesktop=window.matchMedia('(min-width:901px)');
  mqDesktop.addEventListener('change', e=>{ 
    if (e.matches) { 
      if (mobileNav.classList.contains('open')) { closeMobileNav(); } 
    } 
  });
  
  function blurOnOutsideTap(e){ 
    const ae = document.activeElement; 
    if (!ae) return; 
    const isField = (el)=> el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'); 
    if (isField(ae) && !e.target.closest('input, textarea')) { 
      ae.blur(); 
    } 
  }
  document.addEventListener('touchstart', blurOnOutsideTap, {passive:true});
  document.addEventListener('mousedown', blurOnOutsideTap);

  if (viewToggleContainer) {
    viewToggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-toggle');
      if (!btn) return;
      const selectedView = btn.dataset.view;
      
      // [NEW] 뷰 모드 전환 시 장바구니 초기화 경고 로직 통합
      const currentCartType = getCartType();
      if (currentCartType && currentCartType !== selectedView) {
          const currentLabel = currentCartType === "sale" ? "판매가" : "렌탈가";
          const newLabel = selectedView === "sale" ? "판매가" : "렌탈가";
          
          const ok = confirm(
              `현재 장바구니에는 '${currentLabel}' 제품이 담겨있습니다.\n'${newLabel} 보기'로 전환하면 장바구니가 초기화됩니다.\n전환하시겠습니까?`
          );
          if (!ok) {
              // 사용자가 취소하면 UI 업데이트를 중단하고 함수 종료
              return; 
          }
          // 전환 확정 → 카트 비우기
          clearCart();
          showToast("장바구니가 초기화되었습니다.");
      }
      // END: 장바구니 초기화 로직

      if (selectedView === currentViewMode) return;
      
      currentViewMode = selectedView;
      viewToggleContainer.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      updateViewModeUI(); // 👈 [수정된 부분] 뷰 모드에 따라 렌탈 버튼 숨김/표시
      
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
  
  // [NEW] 견적함 모달 오버레이 클릭 시 닫기
  if (quotationCartModal) {
    quotationCartModal.addEventListener('click', function(e) {
      if (e.target.classList.contains('quotation-modal-overlay')) {
        closeQuotationModal();
      }
    });
  }
  
  // [NEW] 복합 담기 알림 오버레이 클릭 시 닫기
  if (quotationAlertModal) {
    quotationAlertModal.addEventListener('click', function(e) {
      if (e.target.classList.contains('quotation-alert-overlay') && !e.target.closest('.quotation-alert-box')) {
        closeQuotationAlert();
      }
    });
  }


  /* ============================================== */
  /* ========= [NEW] 10. 견적함 관리 로직 ========= */
  /* ============================================== */

  // 견적함 데이터 가져오기 (로컬 스토리지)
  function getCartItems() {
    try {
      const data = localStorage.getItem(QUOTATION_KEY);
      const cart = JSON.parse(data);
      // items가 배열인지 확인하고, 없으면 빈 배열 반환
      return Array.isArray(cart.items) ? cart.items : [];
    } catch (e) {
      // 로드 실패 시 빈 배열 반환
      return [];
    }
  }

  // 견적함 데이터 저장하기
  function saveCartItems(items) {
    const cart = {
        items: items,
        // 첫 번째 아이템의 유형을 전체 장바구니 유형으로 사용
        type: items.length > 0 ? items[0].type : null 
    };
    
    try {
      localStorage.setItem(QUOTATION_KEY, JSON.stringify(cart));
      updateCartBadge();
      updateProductGridPrices(); // 가격 및 버튼 상태 업데이트
    } catch (e) {
      console.error("장바구니 저장 실패:", e);
    }
  }

  // 견적함의 현재 유형(sale 또는 rental)을 반환
  function getCartType() {
    const items = getCartItems();
    return items.length > 0 ? items[0].type : null;
  }
  
  // 외부 노출을 위해 전역으로 등록
  window.clearCart = clearCart;
  window.removeCartItem = removeCartItem;
  window.changeCartQuantity = changeCartQuantity;
  window.requestQuote = requestQuote;

  // [MODIFIED] 토글 기능 및 복합 담기 방지 로직 (추가/제거)
  function toggleQuotationCart(product, productType, e) { // <-- e 인자 추가
    if (e) e.preventDefault(); // <-- ADDED: 장바구니 버튼의 기본 동작 차단
    
    const items = getCartItems();
    const existingItemIndex = items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // 1. 이미 담겨 있으면 -> 제거합니다.
      items.splice(existingItemIndex, 1);
      saveCartItems(items);
      showToast(`"${product.title}" 제품을 장바구니에서 해제했습니다.`);
      
      // 제거 후 장바구니가 비었을 때, 모달이 열려있다면 닫아줍니다.
      if (items.length === 0 && quotationCartModal && quotationCartModal.classList.contains('show')) {
        closeQuotationModal();
      }
      return;
    }
    
    // 2. 새로 담는 경우 -> 복합 담기 방지 로직 실행
    const currentType = getCartType();
    const newType = productType;

    if (currentType && currentType !== newType) {
      pendingProduct = { product, productType }; // 임시 저장
      showAlertModal(currentType, newType);
      return;
    }
    
    // 3. 정상적으로 추가 (수량은 1로 고정)
    const productData = PRODUCTS.find(p => p.id === product.id);
    const itemPrice = newType === 'sale' ? productData.sale : (productData.rental ? productData.rental[currentRentalDuration] : 0);
    const itemImage = productData.image;

    items.push({
      id: product.id,
      name: product.title,
      image: itemImage,
      type: newType,
      quantity: 1, // 수량은 1로 고정
      price: itemPrice, 
    });

    saveCartItems(items);
    showToast(`"${product.title}" 제품을 장바구니에 담았습니다.`);
  }

  // 견적함 비우기
  function clearCart(shouldRender = false) {
    saveCartItems([]);
    if (shouldRender) {
      renderCartItems(); // 모달 UI 업데이트
    }
  }
  
  // 견적함 수량 변경
  function changeCartQuantity(index, change) {
    const items = getCartItems();
    let quantity = (items[index].quantity || 1) + change;
    
    if (quantity < 1) {
      quantity = 1;
    }
    
    items[index].quantity = quantity;
    saveCartItems(items);
    renderCartItems(); // UI 즉시 업데이트
  }

  // 견적함 제품 삭제
  function removeCartItem(index) {
    const items = getCartItems();
    items.splice(index, 1);
    saveCartItems(items);
    renderCartItems(); // UI 즉시 업데이트
  }

  // 견적 요청 (모달 푸터 버튼)
  function requestQuote() {
    const cartType = getCartType();
    if (cartType) {
      // 견적함 유형에 따라 contact/contact.html로 이동
      // (index.html 기준 상대 경로)
      window.location.href = `contact/contact.html?tab=${cartType}`;
    }
  }


  /* ============================================== */
  /* ========= [NEW] 11. 견적함 UI 및 모달 로직 ========= */
  /* ============================================== */

  // 견적함 아이콘 배지 업데이트
  function updateCartBadge() {
    const count = getCartItems().length;
    if (cartBadge) {
      cartBadge.textContent = count;
      // 0개 이상이면 .has-items 클래스 추가
      cartBadge.classList.toggle('has-items', count > 0); 
    }
  }

  // [NEW] 토스트 알림을 통합 (기존 showAddedNotification/showRemovedNotification 대체)
  // 토스트는 별도 HTML 구조가 필요하므로, 여기서는 showToast로 호출만 대체합니다.
  
  // [수정됨] 견적함 모달 열기 (e.preventDefault() 및 스크롤 락 로직 추가)
  window.openQuotationModal = function(e) { // <-- e 인자 추가
    if (e) {
      e.preventDefault(); // <-- ADDED: 기본 동작(최상단 이동) 차단
      e.stopPropagation(); // <-- ADDED: 이벤트 버블링 차단
    }

    if (!quotationCartModal) return;
    
    renderCartItems();
    
    lockBodyScroll(); // 스크롤 잠금
    
    quotationCartModal.removeAttribute('hidden');
    
    // 애니메이션을 위해 잠시 후 show 클래스 추가
    setTimeout(() => {
      quotationCartModal.classList.add('show');
    }, 10);
  }

  // 견적함 모달 닫기
  window.closeQuotationModal = function() {
    if (!quotationCartModal) return;
    
    quotationCartModal.classList.remove('show');
    unlockBodyScroll(); // 스크롤 잠금 해제
    
    // 애니메이션 종료 후 hidden 속성 추가
    setTimeout(() => {
      quotationCartModal.setAttribute('hidden', '');
    }, 300);
  }

  // 견적함 내용 렌더링
  function renderCartItems() {
    const items = getCartItems();
    const count = items.length;
    
    if (!modalCartList || !modalCartCount || !requestQuoteBtn) return;
    
    modalCartCount.textContent = count;
    
    // 비어있는 경우
    if (count === 0) {
      modalCartList.innerHTML = `
        <div class="modal-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          <p>견적함이 비어있습니다.</p>
          <p>원하는 제품을 담고 견적을 요청해 보세요!</p>
        </div>
      `;
      modalCartType.textContent = '';
      requestQuoteBtn.disabled = true;
      summaryTotalCount.textContent = '0개';
      summaryTotalPrice.textContent = '0원';
      summaryTotalLabel.textContent = '총 금액 (VAT 포함):';
      return;
    }
    
    const cartType = getCartType();
    const isRental = cartType === 'rental';
    
    // 견적함 유형 표시
    modalCartType.textContent = `현재 견적함은 "${isRental ? '렌탈' : '판매'}" 견적용입니다.`;
    
    let totalPrice = 0;
    let totalQuantity = 0;
    
    modalCartList.innerHTML = items.map((item, index) => {
      const itemPrice = isRental ? item.price : Math.round(item.price * 1.1); // 판매가만 VAT 10% 추가
      const subtotal = itemPrice * item.quantity;
      totalPrice += subtotal;
      totalQuantity += item.quantity;
      
      const imgSrc = item.image ? (item.image.includes('?w=') ? item.image.replace(/\?w=\d+/, '?w=80') : item.image + '?w=80') : '';
      
      return `
        <div class="modal-cart-item">
          <img class="cart-item-img" src="${imgSrc}" alt="${item.name}" loading="lazy" />
          <div class="cart-item-info">
            <p class="cart-item-title">${item.name}</p>
            <p class="cart-item-price">${isRental ? '월 ' : ''}${fmtKRW(itemPrice)}원 ${isRental ? `(${currentRentalDuration}개월 기준)` : ''}</p>
          </div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button onclick="changeCartQuantity(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="changeCartQuantity(${index}, 1)">+</button>
            </div>
            <button class="cart-item-delete" onclick="removeCartItem(${index})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
          </div>
        </div>
      `;
    }).join('');
    
    // 요약 정보 업데이트
    summaryTotalCount.textContent = `${totalQuantity}개`;
    summaryTotalPrice.textContent = fmtKRW(totalPrice) + '원';
    
    if (isRental) {
      summaryTotalLabel.textContent = '월 렌탈료 합계 (VAT 포함):';
    } else {
      summaryTotalLabel.textContent = '총 구매 금액 합계 (VAT 포함):';
    }
    
    requestQuoteBtn.disabled = false;
  }

  // 복합 담기 경고 모달 표시
  function showAlertModal(currentType, newType) {
    if (!quotationAlertModal) return;
    
    const currentLabel = currentType === 'sale' ? '판매' : '렌탈';
    const newLabel = newType === 'sale' ? '판매' : '렌탈';
    
    alertTitle.textContent = `유형이 다른 제품입니다!`;
    alertMessage.innerHTML = `현재 견적함에는 **${currentLabel}** 제품이 담겨있습니다.<br>새로운 **${newLabel}** 제품을 담으려면 기존 제품을 비워야 합니다.`;
    
    // '기존 제품 비우고 담기' 버튼에 이벤트 연결
    alertConfirmBtn.onclick = () => {
      // 1. 기존 장바구니 비우기
      clearCart();
      
      const product = pendingProduct.product;
      const newType = pendingProduct.productType;
      const items = getCartItems(); // 비워진 상태의 배열
      
      // 2. 새로운 제품 직접 추가 (수량 1로 고정)
      const productData = PRODUCTS.find(p => p.id === product.id);
      const itemPrice = newType === 'sale' ? productData.sale : (productData.rental ? productData.rental[currentRentalDuration] : 0);
      const itemImage = productData.image;
      
      items.push({
          id: product.id,
          name: product.title,
          image: itemImage,
          type: newType,
          quantity: 1, 
          price: itemPrice, 
      });
      
      saveCartItems(items);
      showToast(`"${product.title}" 제품을 장바구니에 담았습니다.`);
      
      // 3. 모달 닫기
      closeQuotationAlert();
      pendingProduct = null;
    };
    
    quotationAlertModal.removeAttribute('hidden');
    // 애니메이션을 위해 잠시 후 show 클래스 추가
    setTimeout(() => {
      quotationAlertModal.classList.add('show');
    }, 10);
  }

  // 복합 담기 경고 모달 닫기
  window.closeQuotationAlert = function() {
    if (!quotationAlertModal) return;
    
    quotationAlertModal.classList.remove('show');
    pendingProduct = null; // 취소 시 임시 제품 데이터 삭제
    setTimeout(() => {
      quotationAlertModal.setAttribute('hidden', '');
    }, 300);
  }

/* ============================================== */
/* ================= 5. 초기화 함수 ================= */
/* ============================================== */

// init 함수를 명시적으로 선언하고, DOMContentLoaded 시점에 실행되도록 보장합니다.
function init(){
  // 🔥 [수정됨] productsDisplayed를 0으로 초기화하여 로드 실패 문제 해결
  productsDisplayed = 0; 
  
  // 1. 기본 UI 및 데이터 로드
  renderBanner(); 
  renderChannels(); 
  setupPromoSlider();
  document.getElementById('yy').textContent = new Date().getFullYear();
  
  // 장바구니 초기화
  updateCartBadge(); // 뱃지 초기화

  // 뷰 모드 UI 초기화
  updateViewModeUI(); 

  if (loadMoreBtn) { 
    loadMoreBtn.addEventListener('click', loadMoreProducts); 
  }
  
  // 2. 최종 제품 목록 로드
  loadMoreProducts(); // <--- 제품 로드 함수 호출
}

// DOM 로드 상태를 확인하여 init 함수를 호출합니다.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();