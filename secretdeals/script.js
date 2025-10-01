(function(){
  'use strict';

  /* ===== 설정 ===== */
  const STORE_URL  = 'https://smartstore.naver.com/';
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRAXNYclCAqOkzqXe8fIHc6Md0nQOIXcJeAC13xjKqobD3t7jdDZ-PjmtULNFJ5ZZr/exec';

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

  const fmtKRW = n => new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(n);
  const $ = s => document.querySelector(s);
  const el = (html) => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };

  const bannerRoot=$('#bannerRoot');
  const channelsGrid=$('#channelsGrid');
  const grid=$('#productGrid'), emptyState=$('#emptyState'), tpl=$('#productTpl');
  const drawer=$('#quotePanel'), sheet=$('#quoteSheet'), cartbar=$('#cartbar');
  const overlay=$('#overlay');
  const quoteList=$('#quoteList'), quoteTotal=$('#quoteTotal'), quoteSub=$('#quoteSub');
  const quoteListM=$('#quoteListM'), quoteTotalM=$('#quoteTotalM'), quoteSubM=$('#quoteSubM');
  const openQuoteBtn=$('#openQuote'), closeQuoteBtn=$('#closeQuote');
  const openSheetBtn=$('#openSheet'), closeSheetBtn=$('#closeSheet');
  const cartTotal=$('#cartTotal'), cartCount=$('#cartCount'), quoteCount=$('#quoteCount');
  const submitQuoteBtn = $('#submitQuote');
  const submitQuoteMBtn = $('#submitQuoteM');
  const loadMoreBtn = $('#loadMoreBtn');
  const toastEl = $('#toastNotification');
  let toastTimeout;
  let toastResetTimeout;
  const hamburgerBtn = $('#hamburgerBtn');
  const mobileNav = $('#mobileNav');
  const closeMobileNavBtn = $('#closeMobileNavBtn');

  const viewToggleContainer = $('.view-toggle-container');
  const durationToggleContainer = $('.duration-toggle-container');
  const rentalDisclaimer = $('.rental-disclaimer');
  
  function setupPromoSlider() { const container = $('#promoSliderSection'); if (!container) return; const track = $('#promoSliderTrack'); const prevBtn = $('#promoPrevBtn'); const nextBtn = $('#promoNextBtn'); const indicatorsContainer = $('#promoSliderIndicators'); const isDesktop = window.matchMedia('(min-width: 720px)').matches; track.innerHTML = PROMO_IMAGES.map(promo => { const imageUrl = isDesktop ? promo.srcDesktop : promo.srcMobile; return `<a href="${promo.href}" target="_blank" rel="noopener" class="promo-slide" draggable="false"><img src="${imageUrl}" alt="프로모션 이미지" loading="lazy" draggable="false" /></a>`; }).join(''); const slides = track.querySelectorAll('.promo-slide'); if (slides.length <= 1) { if(prevBtn) prevBtn.hidden = true; if(nextBtn) nextBtn.hidden = true; if(indicatorsContainer) indicatorsContainer.hidden = true; return; } PROMO_IMAGES.forEach((_, index) => { const dot = document.createElement('button'); dot.className = 'promo-indicator-dot'; dot.dataset.index = index; dot.setAttribute('aria-label', `${index + 1}번 슬라이드로 이동`); indicatorsContainer.appendChild(dot); }); const dots = indicatorsContainer.querySelectorAll('.promo-indicator-dot'); let currentIndex = 0; let autoPlayInterval = null; let isDragging = false; let startPos = 0; let currentTranslate = 0; let prevTranslate = 0; let animationID; const updateIndicators = () => { dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); }); }; const setSliderPosition = () => { track.style.transform = `translateX(${currentTranslate}px)`; }; const goToSlide = (slideIndex) => { currentIndex = (slideIndex + slides.length) % slides.length; const slideWidth = slides[0].getBoundingClientRect().width; currentTranslate = currentIndex * -slideWidth; prevTranslate = currentTranslate; track.style.transition = 'transform 0.5s ease-in-out'; setSliderPosition(); updateIndicators(); }; const startAutoPlay = () => { stopAutoPlay(); autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000); }; const stopAutoPlay = () => clearInterval(autoPlayInterval); const getPositionX = (event) => { return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX; }; const animation = () => { setSliderPosition(); if (isDragging) requestAnimationFrame(animation); }; const dragStart = (event) => { isDragging = true; startPos = getPositionX(event); animationID = requestAnimationFrame(animation); track.style.transition = 'none'; stopAutoPlay(); }; const drag = (event) => { if (isDragging) { const currentPosition = getPositionX(event); currentTranslate = prevTranslate + currentPosition - startPos; } }; const dragEnd = () => { if (!isDragging) return; isDragging = false; cancelAnimationFrame(animationID); const movedBy = currentTranslate - prevTranslate; if (movedBy < -50 && currentIndex < slides.length - 1) { currentIndex++; } if (movedBy > 50 && currentIndex > 0) { currentIndex--; } goToSlide(currentIndex); startAutoPlay(); }; prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); }); nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); }); indicatorsContainer.addEventListener('click', e => { if (e.target.matches('.promo-indicator-dot')) { const index = parseInt(e.target.dataset.index, 10); goToSlide(index); startAutoPlay(); } }); track.addEventListener('mousedown', dragStart); track.addEventListener('touchstart', dragStart, { passive: true }); track.addEventListener('mouseup', dragEnd); track.addEventListener('mouseleave', dragEnd); track.addEventListener('touchend', dragEnd); track.addEventListener('mousemove', drag); track.addEventListener('touchmove', drag, { passive: true }); window.addEventListener('resize', () => goToSlide(currentIndex)); const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { goToSlide(currentIndex); startAutoPlay(); } else { stopAutoPlay(); } }, { threshold: 0.5 }); observer.observe(container); updateIndicators(); }
  function renderBanner(){ bannerRoot.innerHTML=''; let mediaHTML = ''; if (BANNER.type === 'video' && BANNER.src){ mediaHTML = `<video class="vid" muted playsinline loop preload="metadata" ${BANNER.poster?`poster="${BANNER.poster}"`:''}></video>`; } else if (BANNER.src){ mediaHTML = `<img class="img" src="${BANNER.src}" alt="" loading="lazy" />`; } const node = el(`<div class="media">${mediaHTML}</div>`); bannerRoot.appendChild(node); if (BANNER.type === 'video' && BANNER.src){ const video = node.querySelector('video.vid'); const source = document.createElement('source'); source.src = BANNER.src; source.type='video/mp4'; video.appendChild(source); const io = new IntersectionObserver(entries=>{ entries.forEach(ent=>{ if(ent.isIntersecting) video.play().catch(()=>{}); else video.pause(); }); },{threshold:0.25}); io.observe(video); const toggle=()=>{ if(video.paused) video.play().catch(()=>{}); else video.pause(); }; video.addEventListener('click', toggle); video.addEventListener('touchstart', toggle, {passive:true}); } }
  function channelIcon(type){ switch(type){ case 'home': return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0,1.42,1.42L12,4.41l8.29,8.3a1,1,0,0,0,1.42-1.42Z" opacity="0.5"/><path d="M19,22H5a3,3,0,0,1-3-3V12.41a1,1,0,0,1,.29-.71l3-3a1,1,0,0,1,1.42,1.42L4,12.41V19a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12.41l-2.71-2.7a1,1,0,0,1,1.42-1.42l3,3A1,1,0,0,1,22,12.41V19A3,3,0,0,1,19,22Z"/></svg>`; case 'youtube': return `<svg viewBox="0 0 24 24"><path fill="#FF0000" d="M21.58 7.19A2.19 2.19 0 0 0 20 5.61C18.2 5 12 5 12 5s-6.2 0-8 .61A2.19 2.19 0 0 0 2.42 7.19C2 9.05 2 12 2 12s0 2.95.42 4.81a2.19 2.19 0 0 0 1.58 1.58C5.8 19 12 19 12 19s6.2 0 8-.61a2.19 2.19 0 0 0 1.58-1.58C22 14.95 22 12 22 12s0-2.95-.42-4.81zM10 15.34V8.66L15.68 12 10 15.34z"/></svg>`; case 'insta': return `<svg viewBox="0 0 24 24"><defs><radialGradient id="ig-grad" cx="0.3" cy="1" r="1.5"><stop offset="0" stop-color="#FCD674"/><stop offset="0.2" stop-color="#F6B864"/><stop offset="0.5" stop-color="#D9396D"/><stop offset="0.8" stop-color="#9C38B8"/><stop offset="1" stop-color="#4F5BD5"/></radialGradient></defs><path fill="url(#ig-grad)" d="M12 1.62c-3.26 0-3.67.01-4.95.07-1.28.06-2.16.25-2.93.56a4.8 4.8 0 00-1.74 1.74c-.3.77-.5 1.65-.56 2.93-.06 1.28-.07 1.69-.07 4.95s.01 3.67.07 4.95c.06 1.28.25 2.16.56 2.93a4.8 4.8 0 001.74 1.74c.77.3 1.65.5 2.93.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.16-.25 2.93-.56a4.8 4.8 0 001.74-1.74c.3-.77.5-1.65.56-2.93.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.25-2.16-.56-2.93A4.8 4.8 0 0019.88 2.8c-.77-.3-1.65-.5-2.93-.56C15.67 1.63 15.26 1.62 12 1.62zM12 3.5c3.18 0 3.56.01 4.8.07 1.17.05 1.8.23 2.22.4.65.25.96.56 1.21 1.21.17.42.35 1.05.4 2.22.06 1.24.07 1.62.07 4.8s-.01 3.56-.07 4.8c-.05 1.17-.23 1.8-.4 2.22a2.93 2.93 0 01-1.21 1.21c-.42.17-1.05.35-2.22.4-1.24.06-1.62.07-4.8.07s-3.56-.01-4.8-.07c-1.17-.05-1.8-.23-2.22-.4a2.93 2.93 0 01-1.21-1.21c-.17-.42-.35-1.05-.4-2.22C3.51 15.56 3.5 15.18 3.5 12s.01-3.56.07-4.8c.05-1.17.23 1.8.4-2.22A2.93 2.93 0 015.18 3.9c.42-.17 1.05-.35 2.22-.4C8.44 3.51 8.82 3.5 12 3.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.12A3.12 3.12 0 1115.12 12 3.12 3.12 0 0112 15.12zM16.95 6a1.2 1.2 0 101.2 1.2 1.2 1.2 0 00-1.2-1.2z"/></svg>`; case 'blog': return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20,2H4A3,3,0,0,0,1,5V15a3,3,0,0,0,3,3H16.59l3.7,3.71A1,1,0,0,0,21,22a.84.84,0,0,0,.38-.08A1,1,0,0,0,22,21V5A3,3,0,0,0,19,2ZM20,19.59l-2.29-2.3A1,1,0,0,0,17,17H4a1,1,0,0,1-1-1V5A1,1,0,0,1,4,4H20Z" opacity="0.5"/><path d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11Z"/></svg>`; default: return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>`; } }
  function renderChannels(){ channelsGrid.innerHTML=''; SOCIAL_LINKS.forEach(c=>{ const node = el(`<a class="ch" href="${c.href}" target="_blank" rel="noopener"><div class="ico">${channelIcon(c.type)}</div><div class="lab">${c.label}</div></a>`); channelsGrid.appendChild(node); }); }

  function updateProductGridPrices() {
    const cards = document.querySelectorAll('#productGrid .card');
    cards.forEach(card => {
      const productId = card.dataset.productId;
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const priceOrigEl = card.querySelector('.p-orig');
      const priceSaleEl = card.querySelector('.p-sale');
      const rentalInfoEl = card.querySelector('.p-rental-info');
      const addBtn = card.querySelector('.add-quote');
      
      priceSaleEl.classList.remove('price-unavailable');
      addBtn.disabled = false;
      addBtn.removeAttribute('aria-disabled');

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
          addBtn.disabled = true;
          addBtn.setAttribute('aria-disabled', 'true');
        }
      }
    });
    updateQuoteUI();
  }

  function loadMoreProducts(){
    const loadMoreContainer = loadMoreBtn ? loadMoreBtn.parentElement : null;
    if (!PRODUCTS.length) { emptyState.hidden = false; if(loadMoreContainer) loadMoreContainer.hidden = true; return; }
    emptyState.hidden = true;
    const fragment = document.createDocumentFragment();
    const productsToLoad = PRODUCTS.slice(productsDisplayed, productsDisplayed + PRODUCTS_TO_SHOW);
    productsToLoad.forEach(p => {
      const node = tpl.content.cloneNode(true);
      const card = node.querySelector('.card');
      card.dataset.productId = p.id;
      const img=node.querySelector('.p-img'); img.src=p.image; img.alt=p.title; img.loading='lazy';
      img.onerror=function(){ this.onerror=null; this.src=PRODUCTS[1].image; };
      node.querySelector('.p-title').textContent=p.title;
      const priceOrigEl = node.querySelector('.p-orig');
      const priceSaleEl = node.querySelector('.p-sale');
      const rentalInfoEl = node.querySelector('.p-rental-info');
      const addBtn = card.querySelector('.add-quote');
      
      priceSaleEl.classList.remove('price-unavailable');
      addBtn.disabled = false;
      addBtn.removeAttribute('aria-disabled');

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
          addBtn.disabled = true;
          addBtn.setAttribute('aria-disabled', 'true');
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
    if (productsDisplayed >= PRODUCTS.length) { if(loadMoreContainer) loadMoreContainer.hidden = true; } else { if(loadMoreContainer) loadMoreContainer.hidden = false; }
  }

  const quote={ items: [] };
  const saveQuote=()=>updateQuoteUI();
  function addQuote(it){ const i=quote.items.findIndex(x=>x.id===it.id); if(i>-1) quote.items[i].qty+=it.qty; else quote.items.push(it); saveQuote(); }
  function delQuote(id){ quote.items=quote.items.filter(x=>x.id!==id); saveQuote(); }
  function setQty(id,qty){ const it=quote.items.find(x=>x.id===id); if(it){ it.qty=Math.max(1,qty|0); saveQuote(); } }
  const total=()=>quote.items.reduce((s,x)=>s+x.price*x.qty,0);
  const count=()=>quote.items.reduce((s,x)=>s+x.qty,0);

  function rowHTML(it){ const priceText = it.price > 0 ? fmtKRW(it.price) : '별도 문의'; return ` <img src="${it.image}" alt="${it.title}" style="width:64px;height:64px;object-fit:cover;border-radius:10px;border:1px solid var(--quote-border)"> <div> <div style="font-weight:700">${it.title}</div> <div style="color:var(--muted);font-size:12px">${it.id}</div> <div style="margin-top:6px;font-weight:700">${priceText}${it.isRental && it.price > 0 ? ' / 월' : ''}</div> </div> <div class="ctrl"> <div class="stepper"> <button class="step" data-step="-1" data-id="${it.id}" aria-label="수량 감소">−</button> <input type="number" min="1" value="${it.qty}" data-qid="${it.id}" inputmode="numeric" /> <button class="step" data-step="1" data-id="${it.id}" aria-label="수량 증가">+</button> </div> <button class="del" data-del="${it.id}">삭제</button> </div>`; }
  function renderQuoteList(target){ target.innerHTML=''; quote.items.forEach(it=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=rowHTML(it); target.appendChild(row); }); }
  
  function updateQuoteUI(){
    const c=count(), t=fmtKRW(total());
    const isCartEmpty = c === 0;
    const totalLabelText = currentViewMode === 'sale' ? '총 상품금액' : '월 예상 렌탈료';
    document.querySelectorAll('.quote-disclaimer').forEach(el => {
      el.hidden = (currentViewMode !== 'rental' || isCartEmpty);
    });
    quoteCount.textContent = c > 0 ? `(${c})` : '';
    cartCount.textContent = c > 0 ? `(${c})` : '';
    const totalHTML = `<div><div style="color:var(--muted);font-size:12px">${totalLabelText}</div><div style="font-weight:800;font-size:18px">${t}</div></div>`;
    renderQuoteList(quoteList); quoteTotal.innerHTML=totalHTML;
    renderQuoteList(quoteListM); quoteTotalM.innerHTML=totalHTML;
    const subText = !isCartEmpty ? `${quote.items.length}종, 총 ${c}개`:'담긴 상품이 없습니다';
    quoteSub.textContent  = subText;
    quoteSubM.textContent = subText;
    cartTotal.textContent=t;
    openQuoteBtn.classList.toggle('active', !isCartEmpty);
    if (submitQuoteBtn) { submitQuoteBtn.disabled = isCartEmpty; submitQuoteBtn.setAttribute('aria-disabled', isCartEmpty.toString()); }
    if (submitQuoteMBtn) { submitQuoteMBtn.disabled = isCartEmpty; submitQuoteMBtn.setAttribute('aria-disabled', isCartEmpty.toString()); }
  }

  function showToast(message) { if (!toastEl) return; clearTimeout(toastTimeout); clearTimeout(toastResetTimeout); const _show = () => { toastEl.textContent = message; toastEl.classList.add('show'); toastTimeout = setTimeout(() => { toastEl.classList.remove('show'); }, 3000); }; if (toastEl.classList.contains('show')) { toastEl.classList.remove('show'); toastResetTimeout = setTimeout(_show, 100); } else { _show(); } }
  function flyToCartAnimation(buttonEl) { const card = buttonEl.closest('.card'); if (!card) return; const img = card.querySelector('.p-img'); if (!img) return; const imgRect = img.getBoundingClientRect(); const imgClone = img.cloneNode(true); const isMobile = window.getComputedStyle(cartbar).display !== 'none'; const target = isMobile ? $('#openSheet') : $('#openQuote'); if (!target) return; const targetRect = target.getBoundingClientRect(); const translateX = targetRect.left + (targetRect.width / 2) - (imgRect.left + imgRect.width / 2); const translateY = targetRect.top + (targetRect.height / 2) - (imgRect.top + imgRect.height / 2); imgClone.classList.add('fly-to-cart'); document.body.appendChild(imgClone); Object.assign(imgClone.style, { top: `${imgRect.top}px`, left: `${imgRect.left}px`, width: `${imgRect.width}px`, height: `${imgRect.height}px`, }); requestAnimationFrame(() => { Object.assign(imgClone.style, { transform: `translate(${translateX}px, ${translateY}px) scale(0.1)`, opacity: '0', }); }); setTimeout(() => { imgClone.remove(); }, 800); }

  grid.addEventListener('click', (e)=>{
    const addBtn=e.target.closest('.add-quote'); if(!addBtn) return;
    const card = addBtn.closest('.card');
    const productId = card.dataset.productId;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    let itemToAdd;
    if (currentViewMode === 'rental') {
      if (currentRentalDuration === 'etc') {
          itemToAdd = { id: `${product.id}-rental-etc`, title: `${product.title} (렌탈 기간 협의)`, price: 0, image: product.image, qty: 1, isRental: true };
      } else {
        if (!product.rental || !product.rental[currentRentalDuration]) {
          showToast('해당 상품은 이 조건으로 렌탈할 수 없습니다.'); return;
        }
        itemToAdd = { id: `${product.id}-rental-${currentRentalDuration}`, title: `${product.title} (${currentRentalDuration}개월 렌탈)`, price: product.rental[currentRentalDuration], image: product.image, qty: 1, isRental: true };
      }
    } else {
      itemToAdd = { id: product.id, title: product.title, price: product.sale, image: product.image, qty: 1, isRental: false };
    }
    addQuote(itemToAdd);
    showToast('견적서에 상품을 담았습니다.');
    flyToCartAnimation(addBtn);
  });

  ['quoteList','quoteListM'].forEach(id=>{ const root=document.getElementById(id); root.addEventListener('input', e=>{ if(e.target.matches('input[type=number][data-qid]')) setQty(e.target.dataset.qid, +e.target.value); }); root.addEventListener('click', e=>{ const del=e.target.closest('[data-del]'); if(del){ delQuote(del.dataset.del); return; } const step=e.target.closest('[data-step]'); if(step){ const id=step.dataset.id, dir=parseInt(step.dataset.step,10); const it=quote.items.find(x=>x.id===id); if(it){ it.qty=Math.max(1,(it.qty||1)+dir); saveQuote(); } } }); });
  
  function showOverlay(){ overlay.hidden=false; document.body.classList.add('scroll-lock'); }
  
  // ✅ UPDATED
  function hideOverlay(){
    // 이제 이 함수는 모달의 상태와 관계없이, 견적서/메뉴 패널 전용으로만 동작합니다.
    document.body.classList.remove('scroll-lock');
    overlay.hidden=true;
  }

  function openDrawer(){ closeAny(); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); openQuoteBtn.setAttribute('aria-expanded','true'); showOverlay(); }
  function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); openQuoteBtn.setAttribute('aria-expanded','false'); if(!mobileNav.classList.contains('open')) hideOverlay(); }
  function openSheet(){ closeAny(); sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); showOverlay(); }
  function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); if(!mobileNav.classList.contains('open')) hideOverlay(); }
  function openMobileNav() { closeAny(); mobileNav.classList.add('open'); mobileNav.setAttribute('aria-hidden', 'false'); hamburgerBtn.setAttribute('aria-expanded', 'true'); showOverlay(); }
  function closeMobileNav() { mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden', 'true'); hamburgerBtn.setAttribute('aria-expanded', 'false'); if(!sheet.classList.contains('open') && !drawer.classList.contains('open')) hideOverlay(); }
  function isDesktop(){ return window.matchMedia('(min-width:1080px)').matches; }
  openQuoteBtn.addEventListener('click', ()=>{ isDesktop()?openDrawer():openSheet(); });
  closeQuoteBtn.addEventListener('click', closeDrawer); openSheetBtn.addEventListener('click', openSheet); closeSheetBtn.addEventListener('click', closeSheet); hamburgerBtn.addEventListener('click', openMobileNav); closeMobileNavBtn.addEventListener('click', closeMobileNav);
  const closeAny=()=>{ if (drawer.classList.contains('open')) closeDrawer(); if (sheet.classList.contains('open')) closeSheet(); if (mobileNav.classList.contains('open')) closeMobileNav(); };
  overlay.addEventListener('click', closeAny); overlay.addEventListener('touchstart', closeAny, {passive:true});
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') { closeAny(); closeForm(); } });
  const mqDesktop=window.matchMedia('(min-width:901px)');
  mqDesktop.addEventListener('change', e=>{ if (e.matches) { if (mobileNav.classList.contains('open')) { closeMobileNav(); } const sOpen=sheet.classList.contains('open'); if(sOpen){ closeSheet(); openDrawer(); } } else { const dOpen=drawer.classList.contains('open'); if(dOpen){ closeDrawer(); openSheet(); } } });
  
  const modal = document.getElementById('quoteFormModal');
  function populateModalQuoteList() { const listEl = $('#modalQuoteList'); const boxEl = listEl.closest('.quote-summary-box'); if (!listEl || !boxEl) return; listEl.innerHTML = ''; if (quote.items.length > 0) { quote.items.forEach(item => { const li = document.createElement('li'); const qtyText = item.qty > 1 ? ` (수량: ${item.qty})` : ''; li.textContent = `${item.title}${qtyText}`; listEl.appendChild(li); }); boxEl.hidden = false; } else { boxEl.hidden = true; } }
  
// ✅ 1단계에서 붙여넣은 코드를 이 코드로 통째로 교체하세요.

// ✅ UPDATED
function openForm(){
  modal.setAttribute('aria-hidden','false');
  populateModalQuoteList();
  // document.body.classList.add('scroll-lock'); // 스크롤 잠금 기능 비활성화
  if (cartbar) cartbar.style.position = 'absolute'; // 👈 추가된 코드
}

// ✅ UPDATED
function closeForm(){
  modal.setAttribute('aria-hidden','true');
  if (cartbar) cartbar.style.position = 'fixed'; // 👈 추가된 코드
  // 스크롤 잠금 해제 기능 비활성화
  /*
  if (!sheet.classList.contains('open') && !drawer.classList.contains('open') && !mobileNav.classList.contains('open')) {
    document.body.classList.remove('scroll-lock');
  }
  */
}

  $('#submitQuote').addEventListener('click', openForm);
  $('#submitQuoteM').addEventListener('click', openForm);
  $('#cancelForm').addEventListener('click', closeForm);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeForm(); });
  function blurOnOutsideTap(e){ const ae = document.activeElement; if (!ae) return; const isField = (el)=> el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'); if (isField(ae) && !e.target.closest('input, textarea, .gate-card')) { ae.blur(); } }
  document.addEventListener('touchstart', blurOnOutsideTap, {passive:true});
  document.addEventListener('mousedown', blurOnOutsideTap);

  async function handleFormSubmit(prefix, event) {
    event.preventDefault();
    const form = event.target.closest('form');
    const name = form.querySelector(`[id^="${prefix}Name"]`).value.trim();
    const email = form.querySelector(`[id^="${prefix}Email"]`).value.trim();
    const tel = form.querySelector(`[id^="${prefix}Tel"]`).value.trim();
    const company = form.querySelector(`[id^="${prefix}Company"]`).value.trim();
    const memo = form.querySelector(`[id^="${prefix}Memo"]`).value.trim();
    const items = quote.items; const totalKRW = total(); const isQuote = items.length > 0 && prefix.startsWith('f'); const quoteType = currentViewMode === 'rental' ? '렌탈' : '구매';
    const durationText = currentViewMode === 'rental' ? (currentRentalDuration === 'etc' ? '기간 협의' : `${currentRentalDuration}개월`) : '';
    const subject = isQuote ? `[비밀특가 ${quoteType}견적요청] ${name}` : `[일반 문의] ${name}`;
    const quoteText = isQuote ? `\n\n--- 담긴상품 (${quoteType} ${durationText}) ---\n${items.map(x => `- ${x.title} x ${x.qty} = ${x.price > 0 ? fmtKRW(x.price * x.qty) : '별도문의'}${x.isRental && x.price > 0 ? '/월' : ''}`).join('\n')}\n\n${currentViewMode === 'rental' ? '월 예상 총액' : '총액'}: ${fmtKRW(totalKRW)}` : '';
    const copiedText = `${subject}\n\n--- 고객정보 ---\n이름: ${name}\n이메일: ${email}\n전화: ${tel}\n회사/지점: ${company || '-'}\n요청사항: ${memo || '-'}` + quoteText;
    const fd = new FormData();
    fd.append('name', name); fd.append('email', email); fd.append('tel', tel); fd.append('company', company); fd.append('memo', memo); fd.append('totalKRW', String(totalKRW)); fd.append('itemsJSON', JSON.stringify(items)); fd.append('copiedText', copiedText);
    const btn = form.querySelector('button[type="submit"]');
    const oldLabel = btn.textContent;
    btn.textContent = '전송 중…'; btn.setAttribute('aria-disabled', 'true'); btn.disabled = true;
    try {
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = (await res.text() || '').trim();
      if (text !== 'Success') throw new Error(`Unexpected response: ${text}`);
      showToast('문의가 성공적으로 접수되었습니다.');
      form.reset();
      if (prefix.startsWith('f')) { quote.items = []; saveQuote(); closeForm(); closeAny(); }
    } catch (e) { console.error('submit error:', e); showToast('전송 실패. 잠시 후 다시 시도해주세요.'); } 
    finally { btn.textContent = oldLabel; btn.removeAttribute('aria-disabled'); btn.disabled = false; }
  }

  if (viewToggleContainer) {
    viewToggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-toggle');
      if (!btn) return;
      const selectedView = btn.dataset.view;
      if (selectedView === currentViewMode) return;

      if (quote.items.length > 0) {
        const userConfirmed = window.confirm('보기 모드를 변경하면 현재 견적서에 담긴 모든 상품이 삭제됩니다. 계속하시겠습니까?');
        if (!userConfirmed) return;
        quote.items = [];
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
    $('#inlineInquiryForm').addEventListener('submit', (e) => handleFormSubmit('inline', e));
  })();
})();