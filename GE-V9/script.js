// ═══════════════════════════════════════════════════════════════════════
// 모바일 브라우저 UI 떨림 방지 JavaScript
// script.js 파일 맨 위에 추가하세요!
// ═══════════════════════════════════════════════════════════════════════

// 모바일 뷰포트 높이 고정
(function() {
  'use strict';
  
  // 모바일 체크
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) return;
  
  // 1. 뷰포트 높이 고정
  function setViewportHeight() {
    // 현재 뷰포트 높이 계산
    const vh = window.innerHeight * 0.01;
    // CSS 변수로 설정
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // 초기 설정
  setViewportHeight();
  
  // 리사이즈 시 재계산 (방향 전환 시)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setViewportHeight, 100);
  });
  
  // 2. 스크롤 시 헤더 고정
  const header = document.querySelector('.gf-header-main');
  if (header) {
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeader() {
      const currentScrollY = window.scrollY;
      
      // 스크롤 방향에 관계없이 헤더 고정
      if (currentScrollY > 50) {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }
  
  // 3. 터치 이벤트 최적화
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    // 상단에서 아래로 당기기 방지 (iOS 바운스)
    if (window.scrollY === 0 && touchDiff > 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // 4. 페이지 로드 완료 후 부드러운 전환 활성화
  window.addEventListener('load', () => {
    document.body.style.transition = 'none';
    
    setTimeout(() => {
      document.body.style.transition = '';
    }, 100);
  });
  
})();

// 5. CSS 변수를 사용한 높이 설정 도우미
document.addEventListener('DOMContentLoaded', function() {
  // 히어로 섹션에 적용
  const heroSection = document.getElementById('gf-hero-section');
  if (heroSection) {
    heroSection.style.height = 'calc(var(--vh, 1vh) * 100)';
  }
});

// ─── GOFIT 헤더 JavaScript (고유 선택자 버전) ───
document.addEventListener('DOMContentLoaded', function() {
  const gfHeader = document.querySelector('.gf-header-main');
  const gfMobileMenuBtn = document.querySelector('.gf-header-mobile-menu-btn');
  const gfMobileMenuClose = document.querySelector('.gf-header-mobile-menu-close');
  const gfMobileMenuOverlay = document.querySelector('.gf-header-mobile-menu-overlay');
  const gfMobileNavLinks = document.querySelectorAll('.gf-header-mobile-nav-link');
  const gfNavLinks = document.querySelectorAll('.gf-header-nav-link, .gf-header-mobile-nav-link');
  

  
  // 모바일 메뉴 이벤트
  gfMobileMenuBtn.addEventListener('click', toggleGfMobileMenu);
  gfMobileMenuClose.addEventListener('click', toggleGfMobileMenu);
  
  // 모바일 메뉴 오버레이 클릭 시 닫기
  gfMobileMenuOverlay.addEventListener('click', toggleGfMobileMenu);
  
  // 모바일 메뉴 링크 클릭 시 닫기
  gfMobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      gfHeader.classList.remove('gf-header-menu-open');
      document.body.style.overflow = '';
    });
  });
  
  // 부드러운 스크롤
  gfNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // # 으로 시작하는 링크(같은 페이지 내 이동)만 스크롤 처리
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        // #만 있는 경우 페이지 최상단으로 이동
        if (targetId === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          // 특정 섹션으로 이동
          const targetSection = document.querySelector(targetId);
          
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
      // # 으로 시작하지 않는 링크는 정상적으로 페이지 이동
    });
  });
  
  // 스크롤에 따른 헤더 숨김/표시
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isInitialLoad = true;
  
  // 초기 로드 후 첫 스크롤인지 확인
  setTimeout(() => {
    isInitialLoad = false;
  }, 700); // 애니메이션 시간보다 약간 더 길게
  
  function updateGfHeader() {
    // 초기 로드 중에는 스크롤 숨김 기능 비활성화
    if (isInitialLoad) {
      ticking = false;
      return;
    }
    
    const currentScrollY = window.scrollY;
    
    // 스크롤 다운: 헤더 숨기기
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      gfHeader.classList.add('gf-header-hidden');
    } 
    // 스크롤 업: 헤더 보이기
    else {
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
  
  // 현재 섹션 하이라이트 (선택사항)
  function highlightGfCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.gf-header-nav-link[href="#${sectionId}"]`);
      
      if (scrollY >= sectionTop && scrollY < sectionBottom && correspondingLink) {
        // 현재 섹션의 링크 활성화
        document.querySelectorAll('.gf-header-nav-link').forEach(link => {
          link.classList.remove('gf-header-active');
        });
        correspondingLink.classList.add('gf-header-active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightGfCurrentSection);
});

// GOFIT 비디오(히어로) 섹션 심플 JavaScript
(function() {
  'use strict';
  
  // 비디오 로드 후 페이드인
  const gfHeroVimeo = document.getElementById('gf-hero-vimeo-player');
  const gfHeroVideoBg = document.querySelector('.gf-hero-bg-video');

  if (gfHeroVimeo && gfHeroVideoBg) {
    // iframe 로드 이벤트
    gfHeroVimeo.addEventListener('load', function() {
      gfHeroVideoBg.classList.add('loaded');
    });
    
    // 백업: 3초 후 자동으로 애니메이션 시작
    setTimeout(function() {
      if (!gfHeroVideoBg.classList.contains('loaded')) {
        gfHeroVideoBg.classList.add('loaded');
      }
    }, 3000);
  }
  
  // 개선된 글리치 효과
  function initGlitchEffect() {
    const glitchText = document.querySelector('.gf-hero-glitch-text');
    if (!glitchText) return;
    
    // 글리치 효과 트리거 함수
    function triggerGlitch() {
      // 이미 글리치 중이면 무시
      if (glitchText.classList.contains('glitching')) return;
      
      glitchText.classList.add('glitching');
      
      // 애니메이션 시간과 동일하게 설정 (0.4초)
      setTimeout(() => {
        glitchText.classList.remove('glitching');
      }, 400);
    }
    
    // 정기적인 글리치 효과 (8초마다)
    setInterval(triggerGlitch, 1000);
    
    // 마우스 호버시 글리치 효과 (선택사항)
    glitchText.addEventListener('mouseenter', function() {
      // 랜덤하게 글리치 효과 발생 (30% 확률)
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    });
    
    // 초기 글리치 효과 (페이지 로드 2초 후)
    setTimeout(triggerGlitch, 2000);
  }
  
  // 초기화
  function init() {
    initGlitchEffect();
  }
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();






// GOFIT 소개 섹션 리디자인 V2 JavaScript
(function() {
  'use strict';
  
  let currentSlide = 0;
  const slides = document.querySelectorAll('.gf-intro-slide');
  const indicators = document.querySelectorAll('.gf-intro-indicator');
  let slideInterval;
  
  // 파티클 배경 효과
  function createParticles() {
    const particlesContainer = document.getElementById('gfIntroParticles');
    if (!particlesContainer) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gf-intro-particle';
      
      // 랜덤 위치
      particle.style.left = Math.random() * 100 + '%';
      
      // 랜덤 크기
      const size = Math.random() * 3 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // 랜덤 애니메이션 지속 시간
      const duration = Math.random() * 10 + 5;
      particle.style.animationDuration = duration + 's';
      
      // 초기 위치를 균등하게 분배
      const startProgress = (i / particleCount) * duration;
      particle.style.animationDelay = `-${startProgress}s`;
      
      // 랜덤 불투명도
      particle.style.opacity = Math.random() * 0.5 + 0.3;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // 슬라이더 기능
  function showSlide(index) {
    // 모든 슬라이드와 인디케이터 비활성화
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 인덱스 범위 체크
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }
    
    // 현재 슬라이드와 인디케이터 활성화
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add('active');
    }
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add('active');
    }
  }
  
  // 다음/이전 슬라이드
  window.changeSlide = function(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
  };
  
  // 특정 슬라이드로 이동
  window.goToSlide = function(index) {
    showSlide(index);
    resetAutoSlide();
  };
  
  // 자동 슬라이드
  function startAutoSlide() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000); // 5초마다 자동 전환
  }
  
  // 자동 슬라이드 리셋
  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }
  
  // 터치/드래그 지원
  function initSliderTouch() {
    const sliderWrapper = document.querySelector('.gf-intro-slider-wrapper');
    if (!sliderWrapper) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    // 마우스 드래그 지원
    let mouseDown = false;
    let mouseStartX = 0;
    let mouseEndX = 0;
    
    sliderWrapper.addEventListener('mousedown', (e) => {
      mouseDown = true;
      mouseStartX = e.clientX;
    });
    
    sliderWrapper.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      e.preventDefault();
    });
    
    sliderWrapper.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      mouseEndX = e.clientX;
      handleMouseSwipe();
    });
    
    sliderWrapper.addEventListener('mouseleave', () => {
      mouseDown = false;
    });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        changeSlide(1); // 왼쪽 스와이프 - 다음 슬라이드
      }
      if (touchEndX > touchStartX + 50) {
        changeSlide(-1); // 오른쪽 스와이프 - 이전 슬라이드
      }
    }
    
    function handleMouseSwipe() {
      if (mouseEndX < mouseStartX - 50) {
        changeSlide(1); // 왼쪽 드래그 - 다음 슬라이드
      }
      if (mouseEndX > mouseStartX + 50) {
        changeSlide(-1); // 오른쪽 드래그 - 이전 슬라이드
      }
    }
  }
  
  // 키보드 네비게이션
  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        changeSlide(-1);
      } else if (e.key === 'ArrowRight') {
        changeSlide(1);
      }
    });
  }
  
  // ⭐ 스크롤 애니메이션 (수정된 버전)
  function initScrollAnimations() {
    // 관찰할 요소들 선택
    const elementsToReveal = [
      '.gf-intro-header',
      '.gf-intro-slider-container',
      '.gf-intro-feature-item',
      '.gf-intro-cta-group'
    ];
    
    // Intersection Observer 옵션
    const revealOptions = {
      threshold: 0.05, // 요소의 10%가 보이면 트리거
      rootMargin: '0px 0px -20px 0px' // 하단에서 50px 전에 트리거
    };
    
    // Observer 생성
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 요소가 화면에 들어오면 클래스 추가
          entry.target.classList.add('gf-scroll-visible');
          
          // 특징 박스의 경우 애니메이션 완료 후 처리
          if (entry.target.classList.contains('gf-intro-feature-item')) {
            // 애니메이션 완료 후 transition 재설정을 위한 클래스 추가
            setTimeout(() => {
              entry.target.classList.add('gf-animation-complete');
            }, 800); // 0.6s + 딜레이 고려
          }
          
          // 한 번만 실행되도록 관찰 중지
          revealObserver.unobserve(entry.target);
        }
      });
    }, revealOptions);
    
    // 각 요소에 Observer 적용
    elementsToReveal.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        revealObserver.observe(element);
      });
    });
    
    // 페이지 로드 시 이미 화면에 보이는 요소들 처리
    setTimeout(() => {
      const headerElement = document.querySelector('.gf-intro-header');
      if (headerElement) {
        const rect = headerElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          headerElement.classList.add('gf-scroll-visible');
        }
      }
      
      // 이미 보이는 특징 박스들도 처리
      const featureItems = document.querySelectorAll('.gf-intro-feature-item');
      featureItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add('gf-scroll-visible');
          // 바로 애니메이션 완료 클래스 추가
          setTimeout(() => {
            item.classList.add('gf-animation-complete');
          }, 800);
        }
      });
    }, 100);
  }
  
  // 이미지 프리로드
  function preloadImages() {
    const images = document.querySelectorAll('.gf-intro-slide img');
    let loadedCount = 0;
    
    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) {
            // 모든 이미지 로드 완료
            startAutoSlide();
          }
        });
      }
    });
    
    // 이미 모든 이미지가 로드된 경우
    if (loadedCount === images.length) {
      startAutoSlide();
    }
  }
  
  // 초기화
  function init() {
    createParticles();
    initSliderTouch();
    initKeyboardNavigation();
    initScrollAnimations();
    preloadImages();
    
    // 첫 번째 슬라이드 표시
    showSlide(0);
    
    // 모바일 체크
    const isMobile = window.innerWidth <= 768;
    
    // 모바일에서는 파티클 수 줄이기
    if (isMobile) {
      const particles = document.querySelectorAll('.gf-intro-particle');
      particles.forEach((particle, index) => {
        if (index > 40) {
          particle.remove();
        }
      });
    }
  }
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 윈도우 리사이즈 처리
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;
      const particles = document.querySelectorAll('.gf-intro-particle');
      
      if (isMobile && particles.length > 40) {
        particles.forEach((particle, index) => {
          if (index > 40) {
            particle.remove();
          }
        });
      } else if (!isMobile && particles.length < 100) {
        // 데스크톱으로 돌아왔을 때 파티클 재생성
        const particlesContainer = document.getElementById('gfIntroParticles');
        const currentCount = particles.length;
        const needed = 100 - currentCount;
        
        for (let i = 0; i < needed; i++) {
          const particle = document.createElement('div');
          particle.className = 'gf-intro-particle';
          particle.style.left = Math.random() * 100 + '%';
          const size = Math.random() * 3 + 2;
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          const duration = Math.random() * 10 + 5;
          particle.style.animationDuration = duration + 's';
          const startProgress = ((currentCount + i) / 100) * duration;
          particle.style.animationDelay = `-${startProgress}s`;
          particle.style.opacity = Math.random() * 0.5 + 0.3;
          
          particlesContainer.appendChild(particle);
        }
      }
    }, 250);
  });
})();



/* ═══════════════════════════════════════════════════════════════════════
   GOFIT 주요 기능 섹션 (아코디언 디자인) - JavaScript
   모던 아코디언 인터랙티브 디자인
═══════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  
  // 전역 변수
  let featuresParticlesContainer = null;
  let particlePool = [];
  let isParticlesCreated = false;
  let accordionItems = [];
  let activeItem = null;
  
  // 초기화 함수
  function initGofitFeaturesAccordion() {
    console.log('GOFIT Features Accordion 초기화 시작');
    
    // DOM 요소 가져오기
    featuresParticlesContainer = document.getElementById('gfFeaturesParticles');
    accordionItems = document.querySelectorAll('.gf-features-accordion-item');
    
    // 파티클 생성
    createParticles();
    
    // 아코디언 이벤트 설정
    setupAccordion();
    
    // 이미지 썸네일 클릭 이벤트
    setupImageThumbnails();
    
    // 스크롤 애니메이션
    setupScrollAnimations();
    
    // 숫자 애니메이션
    setupNumberAnimation();
    
    // // 첫 번째 아이템 자동 열기
    // if (accordionItems.length > 0) {
    //   setTimeout(() => {
    //     openAccordionItem(accordionItems[0]);
    //   }, 500);
    // }
  }
  
  // 파티클 생성
  function createParticles() {
    if (!featuresParticlesContainer || isParticlesCreated) return;
    
    const particleCount = window.innerWidth > 768 ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gf-features-particle';
      
      // 랜덤 위치
      particle.style.left = Math.random() * 100 + '%';
      
      // 랜덤 크기
      const size = Math.random() * 6 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // 랜덤 애니메이션 지속 시간
      const duration = Math.random() * 20 + 10;
      particle.style.animationDuration = duration + 's';
      
      // 랜덤 지연
      const delay = Math.random() * duration;
      particle.style.animationDelay = `-${delay}s`;
      
      // 랜덤 색상 변형
      const hue = Math.random() * 30 - 15;
      particle.style.filter = `hue-rotate(${hue}deg)`;
      
      featuresParticlesContainer.appendChild(particle);
      particlePool.push(particle);
    }
    
    isParticlesCreated = true;
  }
  
  // 아코디언 설정
  function setupAccordion() {
    accordionItems.forEach(item => {
      const header = item.querySelector('.gf-features-accordion-header');
      const content = item.querySelector('.gf-features-accordion-content');
      
      // 헤더 클릭 이벤트
      header.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAccordionItem(item);
      });
      
      // 키보드 접근성
      header.setAttribute('tabindex', '0');
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAccordionItem(item);
        }
      });
      
      // 호버 효과
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          highlightItem(item, true);
        }
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          highlightItem(item, false);
        }
      });
    });
  }
  
  // 아코디언 토글
  function toggleAccordionItem(item) {
    if (item.classList.contains('active')) {
      closeAccordionItem(item);
    } else {
      // 다른 아이템 모두 닫기
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          closeAccordionItem(otherItem);
        }
      });
      
      openAccordionItem(item);
    }
  }
  
  // 아코디언 열기
  function openAccordionItem(item) {
    item.classList.add('active');
    activeItem = item;
    
    // 콘텐츠 높이 계산 및 설정
    const content = item.querySelector('.gf-features-accordion-content');
    const contentInner = item.querySelector('.gf-features-content-inner');
    
    if (content && contentInner) {
      const height = contentInner.offsetHeight;
      content.style.maxHeight = height + 'px';
    }
    
    // 숫자 애니메이션 트리거
    const statValues = item.querySelectorAll('.gf-features-stat-value');
    statValues.forEach(value => {
      if (!value.dataset.animated) {
        animateNumber(value);
      }
    });
    
    // 스펙 숫자 애니메이션
    const specValues = item.querySelectorAll('.gf-features-spec-info strong');
    specValues.forEach(value => {
      if (!value.dataset.animated) {
        animateNumber(value);
      }
    });
    
    // 주변 파티클 효과
    createAccordionParticleEffect(item);
  }
  
  // 아코디언 닫기
  function closeAccordionItem(item) {
    item.classList.remove('active');
    
    const content = item.querySelector('.gf-features-accordion-content');
    if (content) {
      content.style.maxHeight = '0';
    }
    
    if (activeItem === item) {
      activeItem = null;
    }
  }
  
  // 하이라이트 효과
  function highlightItem(item, isHovering) {
    const number = item.querySelector('.gf-features-number');
    const icon = item.querySelector('.gf-features-icon');
    
    if (isHovering) {
      if (number) number.style.color = 'rgba(230, 57, 70, 0.6)';
      if (icon) icon.style.transform = 'scale(1.05)';
    } else {
      if (number) number.style.color = '';
      if (icon) icon.style.transform = '';
    }
  }
  
  // 이미지 썸네일 설정
  function setupImageThumbnails() {
    const thumbImages = document.querySelectorAll('.gf-features-thumb-images img');
    
    thumbImages.forEach(thumb => {
      thumb.addEventListener('click', function() {
        const accordionItem = this.closest('.gf-features-accordion-item');
        const mainImage = accordionItem.querySelector('.gf-features-main-image img');
        
        if (mainImage) {
          // 이미지 교체 애니메이션
          mainImage.classList.add('transitioning');

          setTimeout(() => {
            const tempSrc = mainImage.src;
            mainImage.src = this.src;
            this.src = tempSrc;
            
            // 이미지 로드 후 전환 효과 제거
            mainImage.onload = () => {
              mainImage.classList.remove('transitioning');
            };
          }, 300);
        }
      });
    });
  }
  
  // 숫자 애니메이션
  function animateNumber(element) {
    const targetText = element.textContent;
    const targetNum = parseFloat(targetText);
    const hasPercent = targetText.includes('%');
    const hasPlus = targetText.includes('+');
    const hasKg = targetText.includes('kg');
    const hasYear = targetText.includes('년');
    const hasLayer = targetText.includes('층');
    const hasStep = targetText.includes('단계');
    const hasMinute = targetText.includes('분');
    
    // 특수 텍스트는 애니메이션 제외
    if (isNaN(targetNum) || targetText === '특허' || targetText === '무한' || 
        targetText === 'AR' || targetText === 'KC/FDA' || targetText.includes('-')) {
      element.dataset.animated = 'true';
      return;
    }
    
    element.dataset.animated = 'true';
    
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = targetNum / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        current = targetNum;
        clearInterval(timer);
      }
      
      let displayText = '';
      
      // 소수점 처리
      if (targetNum % 1 !== 0) {
        displayText = current.toFixed(1);
      } else {
        displayText = Math.round(current).toString();
      }
      
      // 접미사 추가
      if (hasPercent) displayText += '%';
      if (hasPlus) displayText += '+';
      if (hasKg) displayText += 'kg';
      if (hasYear) displayText += '년';
      if (hasLayer) displayText += '층';
      if (hasStep) displayText += '단계';
      if (hasMinute) displayText += '분';
      
      element.textContent = displayText;
    }, stepDuration);
  }
  
  // 아코디언 파티클 효과
  function createAccordionParticleEffect(item) {
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.background = '#e63946';
      particle.style.borderRadius = '50%';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const velocity = 50 + Math.random() * 50;
      const lifetime = 800;
      
      let start = null;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        if (progress < lifetime) {
          const t = progress / lifetime;
          const distance = velocity * t;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const scale = 1 - t * 0.5;
          const opacity = 1 - t;
          
          particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
          particle.style.opacity = opacity;
          
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      }
      
      requestAnimationFrame(animate);
    }
  }
  
  // 스크롤 애니메이션
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 관찰할 요소들
    const elementsToObserve = [
      '.gf-features-header',
      '.gf-features-accordion-item',
      '.gf-features-bottom-cta'
    ];
    
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
      });
    });
  }
  
  // 숫자 애니메이션 설정
  function setupNumberAnimation() {
    accordionItems.forEach(item => {
      // 마우스 호버 시 헤더의 스탯 애니메이션
      item.addEventListener('mouseenter', () => {
        const statValue = item.querySelector('.gf-features-header-right .gf-features-stat-value');
        if (statValue && !statValue.dataset.animated) {
          animateNumber(statValue);
        }
      });
    });
  }
  
  // 윈도우 리사이즈 처리
  function handleResize() {
    // 활성 아코디언 콘텐츠 높이 재계산
    if (activeItem) {
      const content = activeItem.querySelector('.gf-features-accordion-content');
      const contentInner = activeItem.querySelector('.gf-features-content-inner');
      
      if (content && contentInner) {
        content.style.maxHeight = 'none';
        const height = contentInner.offsetHeight;
        content.style.maxHeight = height + 'px';
      }
    }
  }
  
  // 이미지 레이지 로딩
  function lazyLoadImages() {
    const images = document.querySelectorAll('.gf-features-accordion-content img');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // 초기화 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGofitFeaturesAccordion();
      lazyLoadImages();
    });
  } else {
    initGofitFeaturesAccordion();
    lazyLoadImages();
  }
  
  // 윈도우 리사이즈 처리
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      handleResize();
      
      // 파티클 재생성
      if (featuresParticlesContainer) {
        featuresParticlesContainer.innerHTML = '';
        particlePool = [];
        isParticlesCreated = false;
        createParticles();
      }
    }, 250);
  });
  
})();


// GOFIT 제품 정보 섹션 JavaScript (슬라이드쇼 버전)
(function() {
  'use strict';
  
  // 전역 변수
  let currentSlide = 0;
  let slideInterval;
  const slideDelay = 8000; // 8초마다 슬라이드 변경 (5초에서 증가)
  let isTransitioning = false;
  
  // 초기화
  function initGfProductsSection() {
    console.log('GOFIT 제품 섹션 초기화 (슬라이드쇼 버전)');
    
    // 기하학적 도형 패턴 효과 추가
    createProductsParticles();
    
    // 스크롤 애니메이션 설정
    setupScrollAnimations();
    
    // 슬라이드쇼 시작
    startSlideshow();
    
    // 인디케이터 클릭 이벤트
    setupIndicatorClicks();
  }
  
  // ═══════════════════════════════════════════════════════════
  // 기하학적 도형 패턴 효과
  // ═══════════════════════════════════════════════════════════
  function createProductsParticles() {
    const particlesContainer = document.getElementById('gfProductsParticles');
    if (!particlesContainer) return;
    
    const shapeCount = window.innerWidth > 768 ? 20 : 12;
    const shapeTypes = ['triangle', 'square', 'hexagon', 'diamond', 'circle', 'cross'];
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div');
      const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      shape.className = `gf-products-shape gf-products-shape-${randomType}`;
      
      // 랜덤 수평 위치
      shape.style.left = Math.random() * 100 + '%';
      
      // 랜덤 초기 수직 위치
      shape.style.top = Math.random() * 100 + '%';
      
      // 랜덤 크기 (0.5배 ~ 1.5배)
      const scale = 0.5 + Math.random();
      shape.style.transform = `scale(${scale})`;
      
      // 랜덤 애니메이션 지속 시간
      const duration = Math.random() * 15 + 20;
      shape.style.animationDuration = duration + 's';
      
      // 랜덤 지연
      const delay = Math.random() * duration;
      shape.style.animationDelay = `-${delay}s`;
      
      // 랜덤 색상 변형 (약간의 색조 변화)
      const hue = Math.random() * 20 - 10;
      shape.style.filter = `hue-rotate(${hue}deg)`;
      
      particlesContainer.appendChild(shape);
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // 슬라이드쇼 기능 (캐러셀 버전)
  // ═══════════════════════════════════════════════════════════
  function startSlideshow() {
    const slides = document.querySelectorAll('.gf-products-slide');
    const dots = document.querySelectorAll('.gf-products-slide-dot');
    
    if (slides.length === 0) return;
    
    // 초기 위치 설정
    updateSlidePosition();
    
    // 자동 슬라이드 시작
    slideInterval = setInterval(() => {
      changeProductSlide(1);
    }, slideDelay);
  }
  
  // 슬라이드 위치 업데이트
  function updateSlidePosition() {
    const track = document.querySelector('.gf-products-slides-track');
    const slides = document.querySelectorAll('.gf-products-slide');
    
    if (!track) return;
    
    // 트랙 이동
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // active 클래스 업데이트
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // 인디케이터 업데이트
    const dots = document.querySelectorAll('.gf-products-slide-dot');
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // 슬라이드 변경 함수 (전역으로 노출)
  window.changeProductSlide = function(direction) {
    if (isTransitioning) return;
    
    const slides = document.querySelectorAll('.gf-products-slide');
    const totalSlides = slides.length;
    
    // 자동 슬라이드 중지 후 재시작
    clearInterval(slideInterval);
    
    // 다음 슬라이드 인덱스 계산
    currentSlide = currentSlide + direction;
    if (currentSlide >= totalSlides) {
      currentSlide = 0;
    } else if (currentSlide < 0) {
      currentSlide = totalSlides - 1;
    }
    
    // 슬라이드 전환
    isTransitioning = true;
    updateSlidePosition();
    
    // 전환 애니메이션 완료 대기
    setTimeout(() => {
      isTransitioning = false;
    }, 800); // CSS transition 시간과 맞춤
    
    // 3초 후 자동 슬라이드 재시작
    setTimeout(() => {
      slideInterval = setInterval(() => {
        changeProductSlide(1);
      }, slideDelay);
    }, 3000);
  };
  
  // 인디케이터 클릭 이벤트
  function setupIndicatorClicks() {
    const dots = document.querySelectorAll('.gf-products-slide-dot');
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (isTransitioning || index === currentSlide) return;
        
        // 자동 슬라이드 중지 후 재시작
        clearInterval(slideInterval);
        
        currentSlide = index;
        isTransitioning = true;
        updateSlidePosition();
        
        // 전환 애니메이션 완료 대기
        setTimeout(() => {
          isTransitioning = false;
        }, 800);
        
        // 3초 후 자동 슬라이드 재시작
        setTimeout(() => {
          slideInterval = setInterval(() => {
            changeProductSlide(1);
          }, slideDelay);
        }, 3000);
      });
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // 스크롤 애니메이션
  // ═══════════════════════════════════════════════════════════
  function setupScrollAnimations() {
    // 관찰할 요소들 선택
    const elementsToObserve = [
      '.gf-products-header',
      '.gf-products-slideshow-wrapper',
      '.gf-products-cta-wrapper'
    ];
    
    // Intersection Observer 옵션
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    };
    
    // Observer 생성
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 요소가 화면에 들어오면 visible 클래스 추가
          requestAnimationFrame(() => {
            entry.target.classList.add('gf-products-visible');
          });
          
          // 한 번만 실행되도록 관찰 중지
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 각 요소에 Observer 적용
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        scrollObserver.observe(element);
      });
    });
    
    // 페이지 로드 시 이미 화면에 보이는 요소들 처리
    setTimeout(() => {
      const headerElement = document.querySelector('.gf-products-header');
      if (headerElement) {
        const rect = headerElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          headerElement.classList.add('gf-products-visible');
        }
      }
    }, 100);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 실행
  // ═══════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGfProductsSection();
    });
  } else {
    initGfProductsSection();
  }
  
  // 페이지 숨김/표시 시 슬라이드쇼 제어
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideInterval);
    } else {
      startSlideshow();
    }
  });
  
})();



// ═══════════════════════════════════════════════════════════════════════
// GOFIT 문의 섹션 스크롤 애니메이션
// ═══════════════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  // 스크롤 애니메이션 설정
  function setupContactScrollAnimation() {
    // 관찰할 요소들 선택
    const elementsToObserve = [
      '.gfnew-header',
      '.gfnew-quick-contact',
      '.gfnew-online-inquiry-wrapper'
    ];
    
    // Intersection Observer 옵션
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    };
    
    // Observer 생성
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('gfnew-visible');
          });
          
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 각 요소에 Observer 적용
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        scrollObserver.observe(element);
      });
    });
    
    // 페이지 로드 시 이미 화면에 보이는 요소들 처리
    setTimeout(() => {
      const contactSection = document.querySelector('.gfnew-contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          elementsToObserve.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
              const elementRect = element.getBoundingClientRect();
              if (elementRect.top < window.innerHeight && elementRect.bottom > 0) {
                element.classList.add('gfnew-visible');
              }
            }
          });
        }
      }
    }, 100);
  }
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupContactScrollAnimation);
  } else {
    setupContactScrollAnimation();
  }
})();

// ─── 모던 문의 섹션 V2 JavaScript ───// ─── 모던 문의 섹션 V2 JavaScript ───













// ─── GOFIT 심플 푸터 JavaScript V6 ───
document.addEventListener('DOMContentLoaded', function() {
  // 스크롤 투 탑 버튼
  const gfScrollTopBtn = document.getElementById('gfFooterScrollTop');
  
  // 스크롤 이벤트
  let scrolling = false;
  window.addEventListener('scroll', function() {
    if (!scrolling) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > 300) {
          gfScrollTopBtn.classList.add('gf-footer-visible');
        } else {
          gfScrollTopBtn.classList.remove('gf-footer-visible');
        }
        scrolling = false;
      });
      scrolling = true;
    }
  });
  
  // 스크롤 투 탑 클릭
  gfScrollTopBtn.addEventListener('click', function() {
    // 부드러운 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 버튼 회전 애니메이션
    this.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      this.style.transform = '';
    }, 600);
  });
  
  // 푸터 네비게이션 링크 부드러운 스크롤
  const gfFooterNavLinks = document.querySelectorAll('.gf-footer-nav a');
  gfFooterNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // # 으로 시작하는 링크만 스크롤 처리
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        // #만 있는 경우 페이지 최상단으로 이동
        if (targetId === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          // 특정 섹션으로 이동
          const targetSection = document.querySelector(targetId);
          
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
      // # 으로 시작하지 않는 링크는 정상적으로 페이지 이동
    });
  });
  
  // 소셜 링크 호버 효과 향상
  const gfSocialLinks = document.querySelectorAll('.gf-footer-social-link');
  gfSocialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      // 다른 링크들 흐리게
      gfSocialLinks.forEach(otherLink => {
        if (otherLink !== this) {
          otherLink.style.opacity = '0.5';
          otherLink.style.filter = 'grayscale(50%)';
        }
      });
    });
    
    link.addEventListener('mouseleave', function() {
      // 모든 링크 원래대로
      gfSocialLinks.forEach(otherLink => {
        otherLink.style.opacity = '';
        otherLink.style.filter = '';
      });
    });
  });
});
















// ─── GOFIT 법적 문서 모달 JavaScript V2 ───

// 모달 열기 (기존 openModal 대체)
function openGofitLegalModal(event, type) {
  // 링크 클릭 시 기본 이동 방지
  if (event) event.preventDefault();

  const modalId = 'gofit' + type.charAt(0).toUpperCase() + type.slice(1) + 'Modal';
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('gofit-active');
  document.body.style.overflow = 'hidden';

  // 프로그레스 바 초기화
  updateGofitScrollProgress(modal);

  // 모바일 레이아웃 조정
  if (window.innerWidth <= 768) {
    const container = modal.querySelector('.gofit-legal-container');
    if (container) {
      container.style.margin = '1rem';
      container.style.width = 'calc(100% - 2rem)';
      container.style.maxWidth = 'calc(100% - 2rem)';
    }
  }

  // 애니메이션 리플레이
  const container = modal.querySelector('.gofit-legal-container');
  if (container) {
    container.style.animation = 'none';
    setTimeout(() => {
      container.style.animation = '';
    }, 10);
  }
}

// 모달 닫기 (기존 closeModal 대체)
function closeGofitLegalModal(type) {
  const modalId = 'gofit' + type.charAt(0).toUpperCase() + type.slice(1) + 'Modal';
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('gofit-active');
  document.body.style.overflow = '';

  // 모바일 스타일 초기화
  const container = modal.querySelector('.gofit-legal-container');
  if (container) {
    container.style.margin = '';
    container.style.width = '';
    container.style.maxWidth = '';
  }
}

// 정책 동의 후 닫기
function acceptGofitPolicy(type) {
  console.log(`${type} 정책에 동의했습니다.`);

  if (typeof Storage !== 'undefined') {
    localStorage.setItem(`gofit_${type}_accepted`, 'true');
    localStorage.setItem(`gofit_${type}_accepted_date`, new Date().toISOString());
  }

  closeGofitLegalModal(type);
}

// 스크롤 프로그레스 바 업데이트
function updateGofitScrollProgress(modal) {
  const body = modal.querySelector('.gofit-legal-body');
  const bar = modal.querySelector('.gofit-progress-bar');
  if (!body || !bar) return;

  body.addEventListener('scroll', () => {
    const scrollTop = body.scrollTop;
    const max = body.scrollHeight - body.clientHeight;
    const percent = max ? (scrollTop / max) * 100 : 0;
    bar.style.width = percent + '%';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ESC 키로 열린 모달 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.gofit-legal-modal.gofit-active').forEach(modal => {
        const type = modal.id.replace('gofit', '').replace('Modal', '').toLowerCase();
        closeGofitLegalModal(type);
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

  // 바디 스크롤 시 클래스 토글 (스와이프 & 스크롤바 색 변경용)
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
          closeGofitLegalModal(type);
        }
      });
    });
  }

  // 푸터 법적 링크 클릭 이벤트 재정의
  document.querySelectorAll('.footer-legal a[onclick*="openModal"]').forEach(link => {
    const onclick = link.getAttribute('onclick');
    const m = onclick.match(/openModal\(['"](\w+)['"]\)/);
    if (m) {
      const type = m[1];
      link.removeAttribute('onclick');
      link.addEventListener('click', e => openGofitLegalModal(e, type));
    }
  });
});

// 추가 애니메이션 키프레임
if (!document.getElementById('gofit-modal-animations')) {
  const style = document.createElement('style');
  style.id = 'gofit-modal-animations';
  style.textContent = `
    @keyframes gofitSlideInUp {
      from { transform: translate(-50%,100%); opacity: 0; }
      to   { transform: translate(-50%,-50%); opacity: 1; }
    }
    @keyframes gofitSlideOutDown {
      from { transform: translate(-50%,-50%); opacity: 1; }
      to   { transform: translate(-50%,100%); opacity: 0; }
    }
    .gofit-legal-body.is-scrolling::-webkit-scrollbar-thumb {
      background: #e63946;
    }
  `;
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════════════
// GOFIT 쿠키 동의 팝업 JavaScript - 구글 애널리틱스 연동 완성판
// ═══════════════════════════════════════════════════════════════════════

// 구글 애널리틱스 측정 ID
const GA_MEASUREMENT_ID = 'G-73J6EXJPQ0';

// 1. 쿠키 동의 상태 확인 및 팝업 표시
function checkCookieConsent() {
  const cookieConsent = localStorage.getItem('gf_cookie_consent');
  const cookiePopup = document.getElementById('gfCookiePopup');
  
  if (!cookieConsent && cookiePopup) {
    setTimeout(() => {
      cookiePopup.classList.add('show');
      document.body.style.overflow = 'hidden';  /* 이 줄을 추가하세요 - 스크롤 막기 */
    }, 1000);
  }
}

// 2. 모든 쿠키 허용
function gfAcceptAllCookies() {
  const cookiePreferences = {
    essential: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('gf_cookie_consent', 'all');
  localStorage.setItem('gf_cookie_preferences', JSON.stringify(cookiePreferences));
  
  gfCloseCookiePopup();
  applyCookieSettings(cookiePreferences);
  
  console.log('모든 쿠키가 허용되었습니다.');
}

// 3. 선택한 쿠키만 허용
function gfAcceptSelectedCookies() {
  const analyticsChecked = document.getElementById('gfAnalyticsCookies').checked;
  const marketingChecked = document.getElementById('gfMarketingCookies').checked;
  
  const cookiePreferences = {
    essential: true,
    analytics: analyticsChecked,
    marketing: marketingChecked,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('gf_cookie_consent', 'selected');
  localStorage.setItem('gf_cookie_preferences', JSON.stringify(cookiePreferences));
  
  gfCloseCookiePopup();
  applyCookieSettings(cookiePreferences);
  
  console.log('선택한 쿠키가 허용되었습니다:', cookiePreferences);
}

// 4. 쿠키 팝업 닫기
function gfCloseCookiePopup() {
  const cookiePopup = document.getElementById('gfCookiePopup');
  if (cookiePopup) {
    cookiePopup.classList.remove('show');
    document.body.style.overflow = '';  /* 이 줄을 추가하세요 - 스크롤 다시 활성화 */
  }
}

// 5. 쿠키 설정 적용 - 구글 애널리틱스 연동
function applyCookieSettings(preferences) {
  if (preferences.analytics) {
    // 분석 쿠키 허용 = 구글 애널리틱스 활성화
    console.log('구글 애널리틱스 추적 시작');
    
    // 구글 애널리틱스 활성화
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
    
    // gtag가 이미 로드되어 있다면 설정 적용
    if (typeof gtag !== 'undefined') {
      gtag('config', GA_MEASUREMENT_ID);
      
      // 현재 페이지 추적
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      
      // 쿠키 동의 이벤트 추적
      gtag('event', 'cookie_consent', {
        'event_category': 'engagement',
        'event_label': 'analytics_accepted'
      });
    }
    
  } else {
    // 분석 쿠키 거부 = 구글 애널리틱스 비활성화
    console.log('구글 애널리틱스 추적 중지');
    
    // 구글 애널리틱스 비활성화
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    
    // 구글 애널리틱스 쿠키 삭제
    document.cookie.split(";").forEach(function(c) {
      const cookie = c.trim();
      if (cookie.indexOf('_ga=') === 0 || cookie.indexOf('_gid=') === 0 || cookie.indexOf('_gat=') === 0) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
      }
    });
  }
  
  if (preferences.marketing) {
    // 마케팅 쿠키 허용
    console.log('마케팅 쿠키 활성화');
    
    // 구글 애널리틱스에 마케팅 동의 이벤트 전송
    if (preferences.analytics && typeof gtag !== 'undefined') {
      gtag('event', 'cookie_consent', {
        'event_category': 'engagement',
        'event_label': 'marketing_accepted'
      });
    }
    
    // 광고용 사용자 ID 생성
    if (!localStorage.getItem('marketing_id')) {
      localStorage.setItem('marketing_id', 'USER_' + Math.random().toString(36).substr(2, 9));
    }
    
    // 여기에 나중에 구글 애드센스, 페이스북 픽셀 등을 추가할 수 있습니다
    // 예시:
    // if (typeof fbq !== 'undefined') {
    //   fbq('consent', 'grant');
    // }
    
  } else {
    // 마케팅 쿠키 거부
    console.log('마케팅 쿠키 비활성화');
    localStorage.removeItem('marketing_id');
    
    // 여기에 마케팅 관련 쿠키 삭제 코드 추가
    // 예시: 페이스북 픽셀 쿠키 삭제
    // document.cookie = "_fbp=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
  }
}

// 6. 쿠키 설정 재설정
function gfResetCookieConsent() {
  localStorage.removeItem('gf_cookie_consent');
  localStorage.removeItem('gf_cookie_preferences');
  location.reload();
}

// 7. 현재 쿠키 설정 가져오기
function gfGetCookiePreferences() {
  const preferences = localStorage.getItem('gf_cookie_preferences');
  return preferences ? JSON.parse(preferences) : null;
}

// 8. 쿠키 정책 모달 열기
function openCookieModal() {
  const modal = document.getElementById('gofitCookieModal');
  if (modal) {
    modal.style.display = 'block';
    modal.style.zIndex = '200000';
    modal.classList.add('gofit-active');
    document.body.style.overflow = 'hidden';
  }
}

// 9. 쿠키 정책 모달 닫기
function closeCookieModal() {
  const modal = document.getElementById('gofitCookieModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('gofit-active');
    document.body.style.overflow = '';
  }
}

// 10. 법적 모달 열기 (통합)
function openGofitLegalModal(event, type) {
  if (event) event.preventDefault();
  
  const modalMap = {
    'cookie': 'gofitCookieModal',
    'cookies': 'gofitCookieModal',
    'privacy': 'gofitPrivacyModal',
    'terms': 'gofitTermsModal'
  };
  
  const modalId = modalMap[type];
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (type === 'cookie' || type === 'cookies') {
        openCookieModal();
      } else {
        modal.classList.add('gofit-active');
        document.body.style.overflow = 'hidden';
      }
    }
  }
}

// 11. 법적 모달 닫기 (통합)
function closeGofitLegalModal(type) {
  const modalMap = {
    'cookie': 'gofitCookieModal',
    'cookies': 'gofitCookieModal',
    'privacy': 'gofitPrivacyModal',
    'terms': 'gofitTermsModal'
  };
  
  const modalId = modalMap[type];
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (type === 'cookie' || type === 'cookies') {
        closeCookieModal();
      } else {
        modal.classList.remove('gofit-active');
        document.body.style.overflow = '';
      }
    }
  }
}

// 12. 정책 동의 함수
function acceptGofitPolicy(type) {
  console.log(`${type} 정책에 동의했습니다.`);
  
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(`gofit_${type}_accepted`, 'true');
    localStorage.setItem(`gofit_${type}_accepted_date`, new Date().toISOString());
  }
}

// 13. 전역 함수로 등록 (window 객체에 명시적 할당)
window.gfAcceptAllCookies = gfAcceptAllCookies;
window.gfAcceptSelectedCookies = gfAcceptSelectedCookies;
window.gfCloseCookiePopup = gfCloseCookiePopup;
window.gfResetCookieConsent = gfResetCookieConsent;
window.gfGetCookiePreferences = gfGetCookiePreferences;
window.openCookieModal = openCookieModal;
window.closeCookieModal = closeCookieModal;
window.openGofitLegalModal = openGofitLegalModal;
window.closeGofitLegalModal = closeGofitLegalModal;
window.acceptGofitPolicy = acceptGofitPolicy;

// 14. 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
  // 쿠키 동의 확인
  checkCookieConsent();
  
  // 이미 동의한 경우 설정 적용
  const savedPreferences = gfGetCookiePreferences();
  if (savedPreferences) {
    applyCookieSettings(savedPreferences);
  }
  
  // ESC 키 방지
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const cookiePopup = document.getElementById('gfCookiePopup');
      if (cookiePopup && cookiePopup.classList.contains('show')) {
        e.preventDefault();
      }
    }
  });
  
  // 배경 클릭 방지
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gf-cookie-backdrop')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});

// 15. 개발자 콘솔 안내
console.log('%c🍪 GOFIT 쿠키 관리', 'color: #e63946; font-size: 16px; font-weight: bold;');
console.log('쿠키 설정 초기화: gfResetCookieConsent()');
console.log('현재 설정 확인: gfGetCookiePreferences()');
console.log('구글 애널리틱스 ID:', GA_MEASUREMENT_ID);

// 모바일 메뉴 토글 함수
function toggleGfMobileMenu() {
  const mobileMenu = document.querySelector('.gf-header-nav-mobile');
  const hamburger = document.querySelector('.gf-header-hamburger');
  
  if (mobileMenu && hamburger) {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  }
}

// 전역 함수로 등록
window.toggleGfMobileMenu = toggleGfMobileMenu;

