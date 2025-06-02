// 헤더 HTML을 JavaScript 변수로 저장
const headerHTML = `
<!-- GOFIT 헤더 -->
<header class="gf-header-main" id="gfHeader">
  <div class="gf-header-container">
    <!-- 로고 영역 -->
    <div class="gf-header-logo">
      <a href="/" class="gf-header-logo-link" style="display: block; width: 120px; height: 40px;">
        <div class="gf-header-logo-placeholder" 
             style="position: absolute; 
                    width: 120px; 
                    height: 40px; 
                    background: rgba(255,255,255,0.05); 
                    border-radius: 4px;">
        </div>
        <img src="https://gofitkorea.netlify.app/GE.webp" 
             alt="GOFIT EQUIPMENT" 
             class="gf-header-logo-img"
             style="position: relative; z-index: 1;"
             onload="this.previousElementSibling.style.display='none'">
      </a>
    </div>

    <!-- 데스크탑 네비게이션 -->
    <nav class="gf-header-nav-desktop">
      <ul class="gf-header-nav-list">
        <li class="gf-header-nav-item">
          <a href="/index.html" class="gf-header-nav-link">
            <span class="gf-header-nav-text">Home</span>
            <span class="gf-header-nav-underline"></span>
          </a>
        </li>
        <li class="gf-header-nav-item">
          <a href="/about/about.html" class="gf-header-nav-link">
            <span class="gf-header-nav-text">About</span>
            <span class="gf-header-nav-underline"></span>
          </a>
        </li>
        <li class="gf-header-nav-item">
          <a href="/features/features.html" class="gf-header-nav-link">
            <span class="gf-header-nav-text">Features</span>
            <span class="gf-header-nav-underline"></span>
          </a>
        </li>
        <li class="gf-header-nav-item">
          <a href="/products/products.html" class="gf-header-nav-link">
            <span class="gf-header-nav-text">Products</span>
            <span class="gf-header-nav-underline"></span>
          </a>
        </li>
        <li class="gf-header-nav-item">
          <a href="#gfnew-contact" class="gf-header-nav-link">
            <span class="gf-header-nav-text">Contact</span>
            <span class="gf-header-nav-underline"></span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- CTA 버튼 & 햄버거 메뉴 -->
    <div class="gf-header-actions">
      <a href="#catalog" class="gf-header-cta-button">
        <span>카탈로그</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </a>
      
      <!-- 모바일 메뉴 버튼 -->
      <button class="gf-header-mobile-menu-btn" id="gfHeaderMobileMenuBtn" aria-label="메뉴 열기">
        <span class="gf-header-hamburger">
          <span class="gf-header-line gf-header-line-1"></span>
          <span class="gf-header-line gf-header-line-2"></span>
          <span class="gf-header-line gf-header-line-3"></span>
        </span>
      </button>
    </div>
  </div>

  <!-- 모바일 메뉴 -->
  <div class="gf-header-mobile-menu" id="gfHeaderMobileMenu">
    <div class="gf-header-mobile-menu-overlay"></div>
    <div class="gf-header-mobile-menu-content">
      <!-- 닫기 버튼 -->
      <button class="gf-header-mobile-menu-close" id="gfHeaderMobileMenuClose">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- 모바일 네비게이션 -->
      <nav class="gf-header-mobile-nav">
        <ul class="gf-header-mobile-nav-list">
          <li class="gf-header-mobile-nav-item">
            <a href="/index.html" class="gf-header-mobile-nav-link">
              <span class="gf-header-link-number">01</span>
              <span class="gf-header-link-text">Home</span>
              <span class="gf-header-link-arrow">&rarr;</span>
            </a>
          </li>
          <li class="gf-header-mobile-nav-item">
            <a href="/about/about.html" class="gf-header-mobile-nav-link">
              <span class="gf-header-link-number">02</span>
              <span class="gf-header-link-text">About</span>
              <span class="gf-header-link-arrow">&rarr;</span>
            </a>
          </li>
          <li class="gf-header-mobile-nav-item">
            <a href="/features/features.html" class="gf-header-mobile-nav-link">
              <span class="gf-header-link-number">03</span>
              <span class="gf-header-link-text">Features</span>
              <span class="gf-header-link-arrow">&rarr;</span>
            </a>
          </li>
          <li class="gf-header-mobile-nav-item">
            <a href="/products/products.html" class="gf-header-mobile-nav-link">
              <span class="gf-header-link-number">04</span>
              <span class="gf-header-link-text">Products</span>
              <span class="gf-header-link-arrow">&rarr;</span>
            </a>
          </li>
          <li class="gf-header-mobile-nav-item">
            <a href="#gfnew-contact" class="gf-header-mobile-nav-link">
              <span class="gf-header-link-number">05</span>
              <span class="gf-header-link-text">Contact</span>
              <span class="gf-header-link-arrow">&rarr;</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- 모바일 CTA -->
      <div class="gf-header-mobile-cta">
        <a href="#catalog" class="gf-header-mobile-cta-button">
          <span>카탈로그 다운로드</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </a>
      </div>

      <!-- 모바일 연락처 -->
      <div class="gf-header-mobile-contact">
        <p class="gf-header-contact-title">Contact Us</p>
        <a href="tel:+821012345678" class="gf-header-contact-link">+82 10-1234-5678</a>
        <a href="mailto:info@gofitequipment.com" class="gf-header-contact-link">info@gofitequipment.com</a>
      </div>
    </div>
  </div>
</header>
`;

// 헤더 삽입 함수
function insertHeader() {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
    console.log('헤더 삽입 완료');
  }
}

// DOM 로드 시 즉시 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertHeader);
} else {
  insertHeader();
}

// 페이지 로드 완료 후 나머지 초기화
window.addEventListener('load', function() {
  // 경로 업데이트
  updateHeaderLinks();
  
  // 헤더 기능 초기화
  setTimeout(() => {
    initializeHeader();
    console.log('헤더 초기화 완료');
  }, 100);
});

// 컴포넌트 로드 함수
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    } else {
      console.error(`Element with id '${elementId}' not found`);
    }
  } catch (error) {
    console.error(`Error loading component from ${componentPath}:`, error);
  }
}

// 현재 페이지의 경로 깊이를 확인하는 함수
function getBasePath() {
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length - 1;
  
  // about 폴더 안에 있으면 '../', 루트에 있으면 './'
  if (path.includes('/about/') || path.includes('/features/') || path.includes('/products/')) {
    return '../';
  } else {
    return './';
  }
}

// 여러 모달 컴포넌트 로더
async function loadModals(basePath) {
  try {
    const modalFiles = [
      'privacy-modal.html',
      'terms-modal.html', 
      'cookie-modal.html'
    ];
    
    let allModalsHTML = '';
    
    // 각 모달 파일 로드
    for (const file of modalFiles) {
      try {
        const response = await fetch(basePath + 'components/modals/' + file);
        if (response.ok) {
          const html = await response.text();
          allModalsHTML += html + '\n';
        }
      } catch (error) {
        console.error(`Error loading modal ${file}:`, error);
      }
    }
    
    // 모든 모달을 컨테이너에 추가 (modal-container로 수정)
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = allModalsHTML;
    }
  } catch (error) {
    console.error('모달 로드 실패:', error);
  }
}

// 페이지 경로에 따른 헤더 링크 업데이트
function updateHeaderLinks() {
  const basePath = getBasePath();
  
  // 헤더가 로드된 후 링크 업데이트
  setTimeout(() => {
    const headerLinks = document.querySelectorAll('.gf-header-nav-link, .gf-header-mobile-nav-link');
    const footerLinks = document.querySelectorAll('.gf-footer-nav a');
    const logo = document.querySelector('.gf-header-logo-link');
    
    // 헤더 네비게이션 링크
    headerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        // 해시 링크는 index.html로 이동 후 섹션으로 스크롤
        if (basePath === '../') {
          link.setAttribute('href', '../index.html' + href);
        }
      }
    });
    
    // 푸터 네비게이션 링크
    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (basePath === '../') {
          link.setAttribute('href', '../index.html' + href);
        }
      }
    });
    
    // 로고 링크
    if (logo) {
      logo.setAttribute('href', basePath + 'index.html');
    }
  }, 100);
}

// 헤더 이벤트 초기화
function initializeHeader() {
  // 모든 요소가 제대로 로드되었는지 확인
  const gfHeader = document.querySelector('.gf-header-main');
  const gfMobileMenuBtn = document.querySelector('.gf-header-mobile-menu-btn');
  const gfMobileMenuClose = document.querySelector('.gf-header-mobile-menu-close');
  const gfMobileMenuOverlay = document.querySelector('.gf-header-mobile-menu-overlay');
  const gfMobileNavLinks = document.querySelectorAll('.gf-header-mobile-nav-link');
  const gfNavLinks = document.querySelectorAll('.gf-header-nav-link, .gf-header-mobile-nav-link');
  
  // 디버깅용 로그
  console.log('=== 헤더 요소 확인 ===');
  console.log('헤더:', gfHeader);
  console.log('모바일 메뉴 버튼:', gfMobileMenuBtn);
  console.log('모바일 메뉴 닫기:', gfMobileMenuClose);
  console.log('모바일 네비게이션 링크 개수:', gfMobileNavLinks.length);
  
  // 필수 요소가 없으면 에러 로그
  if (!gfHeader) {
    console.error('헤더를 찾을 수 없습니다!');
    return;
  }
  
  // 모바일 메뉴 토글
  function toggleGfMobileMenu() {
    gfHeader.classList.toggle('gf-header-menu-open');
    document.body.style.overflow = gfHeader.classList.contains('gf-header-menu-open') ? 'hidden' : '';
    console.log('메뉴 토글됨:', gfHeader.classList.contains('gf-header-menu-open'));
  }
  
  // 모바일 메뉴 이벤트
  if (gfMobileMenuBtn) {
    gfMobileMenuBtn.addEventListener('click', toggleGfMobileMenu);
    console.log('모바일 메뉴 버튼 이벤트 추가됨');
  } else {
    console.error('모바일 메뉴 버튼을 찾을 수 없습니다!');
  }
  
  if (gfMobileMenuClose) {
    gfMobileMenuClose.addEventListener('click', toggleGfMobileMenu);
  }
  
  if (gfMobileMenuOverlay) {
    gfMobileMenuOverlay.addEventListener('click', toggleGfMobileMenu);
  }
  
  // 모바일 메뉴 링크 클릭 시 닫기
  gfMobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      gfHeader.classList.remove('gf-header-menu-open');
      document.body.style.overflow = '';
    });
  });
  
// 부드러운 스크롤 + 같은 페이지 새로고침 방지
  gfNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetHref = this.getAttribute('href');
      const currentPath = window.location.pathname.toLowerCase();
      
      // 현재 페이지와 링크 경로 비교
      let isSamePage = false;
      
      if (targetHref) {
        const linkPath = targetHref.toLowerCase();
        
        // 홈페이지 체크
        if ((currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) && 
            (linkPath === '/' || linkPath === '/index.html' || linkPath.endsWith('/index.html'))) {
          isSamePage = true;
        }
        // About 페이지 체크
        else if (currentPath.includes('/about/about.html') && linkPath.includes('/about/about.html')) {
          isSamePage = true;
        }
        // Features 페이지 체크
        else if (currentPath.includes('/features/features.html') && linkPath.includes('/features/features.html')) {
          isSamePage = true;
        }
        // Products 페이지 체크
        else if (currentPath.includes('/products/products.html') && linkPath.includes('/products/products.html')) {
          isSamePage = true;
        }
      }
      
      // 같은 페이지 링크인 경우
      if (isSamePage) {
        e.preventDefault();
        
        // 페이지 최상단으로 스크롤
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // 모바일 메뉴 닫기
        if (gfHeader.classList.contains('gf-header-menu-open')) {
          gfHeader.classList.remove('gf-header-menu-open');
          document.body.style.overflow = '';
        }
        
        console.log('같은 페이지 클릭 - 최상단으로 이동');
        return;
      }
      
      // 해시(#) 링크 처리
      if (targetHref && targetHref.includes('#')) {
        const hashIndex = targetHref.indexOf('#');
        const hash = targetHref.substring(hashIndex);
        
        // 현재 페이지가 index.html이 아니면 리다이렉트
        if (!window.location.pathname.endsWith('index.html') && 
            !window.location.pathname.endsWith('/')) {
          return; // 기본 동작 허용 (페이지 이동)
        }
        
        e.preventDefault();
        
        if (hash === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const targetSection = document.querySelector(hash);
          if (targetSection) {
            const headerHeight = gfHeader.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });
  
  // 스크롤에 따른 헤더 숨김/표시
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateGfHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      gfHeader.classList.add('gf-header-hidden');
    } else {
      gfHeader.classList.remove('gf-header-hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateGfHeader);
      ticking = true;
    }
  });
}

// 푸터 이벤트 초기화
function initializeFooter() {
  const gfScrollTopBtn = document.getElementById('gfFooterScrollTop');
  
  // 스크롤 이벤트
  let scrolling = false;
  window.addEventListener('scroll', function() {
    if (!scrolling) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > 300) {
          gfScrollTopBtn?.classList.add('gf-footer-visible');
        } else {
          gfScrollTopBtn?.classList.remove('gf-footer-visible');
        }
        scrolling = false;
      });
      scrolling = true;
    }
  });
  
  // 스크롤 투 탑 클릭
  if (gfScrollTopBtn) {
    gfScrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      this.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        this.style.transform = '';
      }, 600);
    });
  }
  
// 푸터 네비게이션 링크 부드러운 스크롤 + 같은 페이지 새로고침 방지
  const gfFooterNavLinks = document.querySelectorAll('.gf-footer-nav a');
  gfFooterNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetHref = this.getAttribute('href');
      const currentPath = window.location.pathname.toLowerCase();
      
      // 현재 페이지와 링크 경로 비교
      let isSamePage = false;
      
      if (targetHref) {
        const linkPath = targetHref.toLowerCase();
        
        // 홈페이지 체크
        if ((currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) && 
            (linkPath === '/' || linkPath === '/index.html' || linkPath.endsWith('/index.html'))) {
          isSamePage = true;
        }
        // About 페이지 체크
        else if (currentPath.includes('/about/about.html') && linkPath.includes('/about/about.html')) {
          isSamePage = true;
        }
        // Features 페이지 체크
        else if (currentPath.includes('/features/features.html') && linkPath.includes('/features/features.html')) {
          isSamePage = true;
        }
        // Products 페이지 체크
        else if (currentPath.includes('/products/products.html') && linkPath.includes('/products/products.html')) {
          isSamePage = true;
        }
      }
      
      // 같은 페이지 링크인 경우
      if (isSamePage) {
        e.preventDefault();
        
        // 페이지 최상단으로 스크롤
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        console.log('푸터 - 같은 페이지 클릭, 최상단으로 이동');
        return;
      }
      
      // 해시(#) 링크 처리
      if (targetHref && targetHref.includes('#')) {
        const hashIndex = targetHref.indexOf('#');
        const hash = targetHref.substring(hashIndex);
        
        // 현재 페이지가 index.html이 아니면 리다이렉트
        if (!window.location.pathname.endsWith('index.html') && 
            !window.location.pathname.endsWith('/')) {
          return; // 기본 동작 허용 (페이지 이동)
        }
        
        e.preventDefault();
        
        if (hash === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const targetSection = document.querySelector(hash);
          if (targetSection) {
            const headerHeight = document.querySelector('.gf-header-main') ? 
                              document.querySelector('.gf-header-main').offsetHeight : 80;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });
  
  // 소셜 링크 호버 효과
  const gfSocialLinks = document.querySelectorAll('.gf-footer-social-link');
  gfSocialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      gfSocialLinks.forEach(otherLink => {
        if (otherLink !== this) {
          otherLink.style.opacity = '0.5';
          otherLink.style.filter = 'grayscale(50%)';
        }
      });
    });
    
    link.addEventListener('mouseleave', function() {
      gfSocialLinks.forEach(otherLink => {
        otherLink.style.opacity = '';
        otherLink.style.filter = '';
      });
    });
  });
}

// 모달 이벤트 초기화
function initializeModals() {
  // updateGofitScrollProgress 함수를 전역으로 사용 가능하게
  window.updateGofitScrollProgress = function(modal) {
    const body = modal.querySelector('.gofit-legal-body');
    const bar = modal.querySelector('.gofit-progress-bar');
    if (!body || !bar) return;

    body.addEventListener('scroll', () => {
      const scrollTop = body.scrollTop;
      const max = body.scrollHeight - body.clientHeight;
      const percent = max ? (scrollTop / max) * 100 : 0;
      bar.style.width = percent + '%';
    });
  };

  // ESC 키로 열린 모달 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.gofit-legal-modal.gofit-active').forEach(modal => {
        const type = modal.id.replace('gofit', '').replace('Modal', '').toLowerCase();
        if (typeof closeGofitLegalModal === 'function') {
          closeGofitLegalModal(type);
        }
      });
    }
  });

  // 창 크기 변경 시 모바일 레이아웃 토글
  window.addEventListener('resize', () => {
    document.querySelectorAll('.gofit-legal-modal.gofit-active').forEach(modal => {
      const container = modal.querySelector('.gofit-legal-container');
      if (!container) return;

      if (window.innerWidth <= 768) {
        container.style.margin = '1rem';
        container.style.width = 'calc(100% - 2rem)';
        container.style.maxWidth = 'calc(100% - 2rem)';
      } else {
        container.style.margin = '';
        container.style.width = '';
        container.style.maxWidth = '';
      }
    });
  });

  // 바디 스크롤 시 클래스 토글
  document.querySelectorAll('.gofit-legal-body').forEach(body => {
    let scrolling;
    body.addEventListener('scroll', () => {
      body.classList.add('is-scrolling');
      clearTimeout(scrolling);
      scrolling = setTimeout(() => body.classList.remove('is-scrolling'), 150);
    });
  });

  // 모바일 터치 스와이프로 모달 닫기
  if ('ontouchstart' in window) {
    document.querySelectorAll('.gofit-legal-modal').forEach(modal => {
      let startY = 0;
      modal.addEventListener('touchstart', e => startY = e.changedTouches[0].screenY);
      modal.addEventListener('touchend', e => {
        const endY = e.changedTouches[0].screenY;
        if (startY - endY < -100) {
          const type = modal.id.replace('gofit', '').replace('Modal', '').toLowerCase();
          if (typeof closeGofitLegalModal === 'function') {
            closeGofitLegalModal(type);
          }
        }
      });
    });
  }
}

// 페이지 로드 시 컴포넌트 로드 (헤더 제외)
document.addEventListener('DOMContentLoaded', async function() {
  const basePath = getBasePath();
  
  // 로딩 시작 시 body에 클래스 추가
  document.body.classList.add('loading-components');
  
  try {
    // 헤더는 이미 insertHeader()로 처리됨
    
    // 푸터 로드
    await loadComponent('footer-container', basePath + 'components/footer.html');
    setTimeout(() => {
      initializeFooter();
    }, 100);
    
    // 모달 로드
    await loadModals(basePath);
    setTimeout(() => {
      initializeModals();
    }, 100);
    
  } catch (error) {
    console.error('컴포넌트 로드 중 오류:', error);
  } finally {
    // 로딩 완료
    document.body.classList.remove('loading-components');
    document.body.classList.add('components-loaded');
  }
});