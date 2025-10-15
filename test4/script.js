// 모바일 뷰포트 떨림 방지
document.addEventListener('DOMContentLoaded', function() {
  // 모바일인지 확인
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 초기 뷰포트 높이 저장
    const vh = window.innerHeight;
    
    // 100vh를 사용하는 주요 요소들 높이 고정
    const heroSection = document.getElementById('gf-hero-section');
    // const introSection = document.querySelector('.gf-intro-section');
    // const featuresSection = document.querySelector('.gf-features-main');
    // const productsSection = document.querySelector('.gf-products-info');
    
    // 높이 고정 적용
    if (heroSection) heroSection.style.height = `${vh}px`;
    // if (introSection) introSection.style.minHeight = `${vh}px`;
    // if (featuresSection) featuresSection.style.minHeight = `${vh}px`;
    // if (productsSection) productsSection.style.minHeight = `${vh}px`;
    
    // fixed 요소들도 처리
    const header = document.querySelector('.gf-header-main');
    if (header) {
      let lastScrollY = 0;
      window.addEventListener('scroll', () => {
        // 스크롤 방향만 체크, 높이 재계산 방지
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.classList.add('gf-header-hidden');
        } else {
          header.classList.remove('gf-header-hidden');
        }
        lastScrollY = currentScrollY;
      }, { passive: true });
    }
  }
});












/* ═══════════════════════════════════════════════════════════════════════
헤더 시작
═══════════════════════════════════════════════════════════════════════ */
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
/* ═══════════════════════════════════════════════════════════════════════
헤더 끝
═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
히어로(비디오) + 3줄 임팩트 문구 통합 섹션 JavaScript 시작 - Vimeo 버전
═══════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  
  /* ═══════════════════════════════════════════════════════════════════════
     Intersection Observer를 이용한 화면 진입 감지
  ═══════════════════════════════════════════════════════════════════════ */
  
  // 화면에 들어온 요소를 감지하는 옵저버 생성
  function createFadeInObserver() {
    const options = {
      root: null, // 뷰포트를 기준으로
      rootMargin: '0px', // 여백 없이
      threshold: 0.1 // 요소의 10%가 보이면 트리거
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 화면에 들어온 요소에 'show' 클래스 추가
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          // 한 번 나타난 후에는 관찰 중지 (다시 사라지지 않도록)
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    return observer;
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     페이드인 애니메이션 초기화
  ═══════════════════════════════════════════════════════════════════════ */
  
  function initFadeInAnimations() {
    // 페이드인 효과를 적용할 모든 요소 선택
    const fadeElements = document.querySelectorAll('.gf-fade-in');
    
    if (fadeElements.length === 0) {
      console.warn('페이드인 요소를 찾을 수 없습니다.');
      return;
    }
    
    // 옵저버 생성
    const fadeInObserver = createFadeInObserver();
    
    // 각 요소를 옵저버에 등록
    fadeElements.forEach(element => {
      fadeInObserver.observe(element);
    });
    

  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     Vimeo iframe 관리 함수들
  ═══════════════════════════════════════════════════════════════════════ */
  
  // Vimeo iframe 초기화 및 최적화
  function initVimeoPlayer() {
    const vimeoIframe = document.getElementById('gf-hero-vimeo-player');
    
    if (!vimeoIframe) {
      console.warn('Vimeo iframe 요소를 찾을 수 없습니다.');
      return;
    }
    

    
    // iframe 로드 완료 감지
    vimeoIframe.addEventListener('load', function() {

      
      // iframe이 로드되면 비디오 컨테이너를 보이게 함
      const videoContainer = document.querySelector('.gf-hero-bg-video');
      if (videoContainer) {
        videoContainer.style.opacity = '0.7';
      }
    });
    
    // iframe 로드 에러 처리
    vimeoIframe.addEventListener('error', function() {
      console.warn('Vimeo iframe 로드 에러');
      
      // 에러 시 배경색만 표시
      const videoContainer = document.querySelector('.gf-hero-bg-video');
      if (videoContainer) {
        videoContainer.style.background = '#000';
        videoContainer.style.opacity = '1';
      }
    });
    
    // 모바일에서 추가 최적화
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {

      
      // 모바일에서는 더 나은 성능을 위해 iframe src 파라미터 조정
      const currentSrc = vimeoIframe.src;
      if (currentSrc.indexOf('quality=') === -1) {
        // 모바일에서는 품질을 자동으로 설정
        vimeoIframe.src = currentSrc + '&quality=auto';
      }
    }
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     실시간 번역 효과 관리 클래스
  ═══════════════════════════════════════════════════════════════════════ */
  
  // 텍스트 버전 정의
  const textVersions = {
    english: {
    line1: 'THE CHOICE',
    line2: 'FOR PERFECT GLUTES',
    line3: 'IS PEACH BUILDER'
    },
    question: {
      line1: '완벽한',
      line2: '글루트를 위한',
      line3: '선택'
    },
    answer: {
      line1: '여기',
      line2: '피치빌더로',
      line3: '증명하다'
    }
  };
  
  // 스크램블에 사용할 특수문자들
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~₩※§¥£€¢∞∑∫∂∆∏√≈≠≤≥÷×±∓';
  const koreanConsonants = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ';
  const koreanVowels = 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ';
  const englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  // 랜덤 문자 생성 함수
  function getRandomChar() {
    const charSets = [scrambleChars, koreanConsonants, koreanVowels, englishChars];
    const randomSet = charSets[Math.floor(Math.random() * charSets.length)];
    return randomSet[Math.floor(Math.random() * randomSet.length)];
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     텍스트 스크램블 효과 클래스
  ═══════════════════════════════════════════════════════════════════════ */
  
  class TextScrambler {
    constructor(element) {
      this.element = element;
      this.chars = [];
      this.frame = 0;
      this.frameRequest = null;
      this.isAnimating = false;
    }
    
    setText(newText, callback) {
      if (this.isAnimating) {
        if (this.frameRequest) {
          cancelAnimationFrame(this.frameRequest);
        }
      }
      
      const oldText = this.element.textContent;
      const length = Math.max(oldText.length, newText.length);
      
      this.chars = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20) + 20;
        this.chars.push({ from, to, start, end });
      }
      
      this.frame = 0;
      this.isAnimating = true;
      this.callback = callback;
      this.update();
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0; i < this.chars.length; i++) {
        const { from, to, start, end } = this.chars[i];
        
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!to) {
            output += '';
          } else {
            output += getRandomChar();
          }
        } else {
          output += from;
        }
      }
      
      this.element.textContent = output;
      
      if (complete === this.chars.length) {
        this.element.classList.remove('scrambling');
        this.isAnimating = false;
        if (this.callback) {
          this.callback();
        }
      } else {
        this.element.classList.add('scrambling');
        this.frameRequest = requestAnimationFrame(() => this.update());
        this.frame++;
      }
    }
    
    // 정리 함수
    destroy() {
      if (this.frameRequest) {
        cancelAnimationFrame(this.frameRequest);
      }
      this.isAnimating = false;
    }
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     실시간 번역 효과 관리 클래스
  ═══════════════════════════════════════════════════════════════════════ */
  
  class TranslationCycle {
    constructor() {
      this.scramblers = [];
      this.currentState = 'english';
      this.isRunning = false;
      this.cycleTimer = null;
      
      // 각 줄의 스크램블러 초기화
      const lines = document.querySelectorAll('.gf-scramble-text');
      lines.forEach(line => {
        this.scramblers.push(new TextScrambler(line));
      });
    }
    
    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.runCycle();
    }
    
    stop() {
      this.isRunning = false;
      if (this.cycleTimer) {
        clearTimeout(this.cycleTimer);
        this.cycleTimer = null;
      }
    }
    
    runCycle() {
      if (!this.isRunning) return;
      
      // 현재 상태에 따라 다음 상태 결정
      let nextState;
      let nextText;
      let delay;
      
      if (this.currentState === 'english') {
        // 영어에서 한국어로 (랜덤 선택)
        nextState = Math.random() < 0.5 ? 'question' : 'answer';
        nextText = textVersions[nextState];
        delay = 3000; // 영어 상태 유지 시간
      } else {
        // 한국어에서 영어로
        nextState = 'english';
        nextText = textVersions.english;
        delay = 7000; // 한국어 상태 유지 시간
      }
      
      // 각 줄에 대해 순차적으로 스크램블 효과 적용
      this.scramblers.forEach((scrambler, index) => {
        setTimeout(() => {
          const lineKey = `line${index + 1}`;
          scrambler.setText(nextText[lineKey], () => {
            // 두 번째 줄의 data-text 속성 업데이트 (글로우 효과용)
            if (index === 1) {
              const line2Element = document.querySelector('.gf-line-2');
              if (line2Element) {
                line2Element.setAttribute('data-text', nextText[lineKey]);
              }
            }
          });
        }, index * 200); // 각 줄마다 200ms 간격
      });
      
      // 상태 업데이트
      this.currentState = nextState;
      
      // 다음 사이클 예약
      this.cycleTimer = setTimeout(() => {
        this.runCycle();
      }, delay + 1000); // 추가 대기 시간
    }
    
    // 정리 함수
    destroy() {
      this.stop();
      this.scramblers.forEach(scrambler => scrambler.destroy());
      this.scramblers = [];
    }
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     초기화 및 이벤트 관리
  ═══════════════════════════════════════════════════════════════════════ */
  
  // 전역 변수로 번역 사이클 관리
  let translationCycle = null;
  
  // 번역 효과 초기화
  function initTranslationEffect() {
    const heroSection = document.querySelector('#gf-hero-section');
    if (!heroSection) {
      console.warn('히어로 섹션을 찾을 수 없습니다.');
      return;
    }
    
    // 번역 사이클 인스턴스 생성
    translationCycle = new TranslationCycle();
    
    // 텍스트가 화면에 나타난 후 번역 시작
    const textElements = document.querySelectorAll('.gf-line-1, .gf-line-2, .gf-line-3');
    let allTextVisible = true;
    
    // 모든 텍스트가 보이는지 확인
    const checkTextVisibility = setInterval(() => {
      allTextVisible = true;
      textElements.forEach(element => {
        if (!element.classList.contains('show')) {
          allTextVisible = false;
        }
      });
      
      // 모든 텍스트가 보이면 번역 시작
      if (allTextVisible) {
        clearInterval(checkTextVisibility);
        setTimeout(() => {
          if (translationCycle) {
            translationCycle.start();
          }
        }, 4000); // 4초 후 번역 시작
      }
    }, 100);
  }

  // 초기화 함수
  function init() {

    
    // 페이드인 애니메이션 초기화
    initFadeInAnimations();
    
    // Vimeo 플레이어 초기화
    //initVimeoPlayer();
    
    // 번역 효과 초기화
    initTranslationEffect();
    

  }
  
  // 페이지 정리 함수 (페이지 이탈 시 호출)
  function cleanup() {

    if (translationCycle) {
      translationCycle.destroy();
      translationCycle = null;
    }
  }
  
  /* ═══════════════════════════════════════════════════════════════════════
     이벤트 리스너 등록
  ═══════════════════════════════════════════════════════════════════════ */
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 페이지 언로드 시 정리
  window.addEventListener('beforeunload', cleanup);
  
  // 페이지 가시성 변경 시 처리 (탭 전환 등)
  document.addEventListener('visibilitychange', () => {
    if (translationCycle) {
      if (document.hidden) {
        translationCycle.stop();
      } else {
        setTimeout(() => {
          if (translationCycle && !translationCycle.isRunning) {
            translationCycle.start();
          }
        }, 1000);
      }
    }
  });
  
  // 전역 변수 노출 (디버깅용 - 개발 중에만 사용)
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname.includes('netlify'))) {
    window.heroSectionControls = {
      translationCycle: translationCycle,
      restartTranslation: function() {
        if (translationCycle) {
          translationCycle.stop();
          setTimeout(() => translationCycle.start(), 500);
        }
      },
      checkVimeoPlayer: function() {
        const iframe = document.getElementById('gf-hero-vimeo-player');

        return iframe;
      }
    };
  }
  
})();

/* ═══════════════════════════════════════════════════════════════════════
히어로(비디오) + 3줄 임팩트 문구 통합 섹션 JavaScript 끝 - Vimeo 버전
═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
   제품 정보 섹션 시작 (애니메이션 추가 버전)
═══════════════════════════════════════════════════════════════════════ */
// GOFIT 제품 정보 섹션 JavaScript (3개 보이는 무한 캐러셀)
(function() {
  'use strict';
  
  // 전역 변수
  let currentSlide = 2; // 복제 슬라이드 때문에 2부터 시작 (실제 첫 번째 슬라이드)
  let totalOriginalSlides = 5; // 원본 슬라이드 개수
  let slideInterval = null;
  const slideDelay = 1000; // 1초마다 슬라이드 변경
  let isTransitioning = false;
  let isMobile = window.innerWidth <= 768;
  
  /* ═══════════════════════════════════════════════════════════════════════
     Intersection Observer를 이용한 화면 진입 감지
  ═══════════════════════════════════════════════════════════════════════ */
  
  // 화면에 들어온 요소를 감지하는 옵저버 생성
  function createProductsFadeInObserver() {
    const options = {
      root: null, // 뷰포트를 기준으로
      rootMargin: '0px', // 여백 없이
      threshold: 0.1 // 요소의 10%가 보이면 트리거
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 화면에 들어온 요소에 'show' 클래스 추가
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          // 한 번 나타난 후에는 관찰 중지 (다시 사라지지 않도록)
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    return observer;
  }
  
  // 페이드인 애니메이션 초기화
  function initProductsFadeInAnimations() {
    // 제품 섹션 내의 페이드인 효과를 적용할 모든 요소 선택
    const productsFadeElements = document.querySelectorAll('.gf-products-info .gf-fade-in');
    
    if (productsFadeElements.length === 0) {
      console.warn('제품 섹션에 페이드인 요소를 찾을 수 없습니다.');
      return;
    }
    
    // 옵저버 생성
    const productsFadeInObserver = createProductsFadeInObserver();
    
    // 각 요소를 옵저버에 등록
    productsFadeElements.forEach(element => {
      productsFadeInObserver.observe(element);
    });
    

  }
  
  // 초기화
  function initGfProductsSection() {
    // 페이드인 애니메이션 초기화
    initProductsFadeInAnimations();
    
    // 슬라이드쇼 시작
    initCarousel();
    
    // 터치/스와이프 기능 추가
    setupTouchSwipe();
    
    // 리사이즈 이벤트
    window.addEventListener('resize', handleResize);
  }
  
  // 캐러셀 초기화
  function initCarousel() {
    const track = document.querySelector('.gf-products-slides-track');
    if (!track) return;
    
    // 초기 위치 설정 (첫 번째 원본 슬라이드로)
    updateSlidePosition(false);
    
    // 슬라이드쇼가 화면에 보일 때 자동 재생 시작
    const slideshow = document.querySelector('.gf-products-slideshow-wrapper');
    if (slideshow) {
      const slideshowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 슬라이드쇼가 화면에 보이면 바로 자동 재생 시작
            // show 클래스를 기다리지 않고 바로 시작
            setTimeout(() => {
              if (!slideInterval) { // 이미 시작되지 않았다면
                startSlideshow();
              }
            }, 500); // 0.5초 후 시작 (너무 빠르지 않게)
            slideshowObserver.unobserve(entry.target);
          }
        });
      });
      
      slideshowObserver.observe(slideshow);
    }
  }
  
  // 리사이즈 핸들러
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // 모바일/데스크톱 전환 시 재설정
    if (wasMobile !== isMobile) {
      updateSlidePosition(false);
    }
  }
  
  // 타이머 정리 함수
  function clearSlideInterval() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }
  
  // 자동 슬라이드 시작
  function startSlideshow() {
    clearSlideInterval();
    
    slideInterval = setInterval(() => {
      changeProductSlide(1);
    }, slideDelay);
  }
  
  // 슬라이드 위치 업데이트
  function updateSlidePosition(animate = true, noClassTransition = false) {
    const track = document.querySelector('.gf-products-slides-track');
    const slides = document.querySelectorAll('.gf-products-slide');
    
    if (!track || slides.length === 0) return;
    
    // 트랜지션 설정
    if (animate) {
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      track.style.transition = 'none';
    }
    
    // 위치 계산
    let translateValue;
    if (isMobile) {
      // 모바일: 100%씩 이동
      translateValue = currentSlide * 100;
    } else {
      // PC: 33.333%씩 이동 (3개 보이도록)
      translateValue = (currentSlide - 1) * 33.333;
    }
    
    // 트랙 이동
    track.style.transform = `translateX(-${translateValue}%)`;
    
    // 클래스 업데이트
    updateSlideClasses(noClassTransition);
  }
  
  // 슬라이드 클래스 업데이트
  function updateSlideClasses(noTransition = false) {
    const slides = document.querySelectorAll('.gf-products-slide');
    
    slides.forEach((slide, index) => {
      // 트랜지션 임시 제거
      if (noTransition) {
        slide.style.transition = 'none';
      }
      
      slide.classList.remove('active', 'adjacent');
      
      if (isMobile) {
        // 모바일: 현재 슬라이드만 active
        if (index === currentSlide) {
          slide.classList.add('active');
        }
      } else {
        // PC: 3개 슬라이드 처리
        if (index === currentSlide) {
          slide.classList.add('active');
        } else if (index === currentSlide - 1 || index === currentSlide + 1) {
          slide.classList.add('adjacent');
        }
      }
      
      // 트랜지션 복원
      if (noTransition) {
        // 강제 리플로우
        slide.offsetHeight;
        slide.style.transition = '';
      }
    });
  }
  
  // 슬라이드 변경 함수 (전역으로 노출)
  window.changeProductSlide = function(direction, isManual = false) {
    if (isTransitioning) return;
    
    clearSlideInterval();
    isTransitioning = true;
    
    // 다음 슬라이드 인덱스 계산
    currentSlide += direction;
    
    // 슬라이드 이동
    updateSlidePosition(true);
    
    // 무한 루프 처리
    setTimeout(() => {
      const track = document.querySelector('.gf-products-slides-track');
      
      // 마지막 복제 슬라이드에 도달했을 때
      if (currentSlide >= totalOriginalSlides + 2) {
        // 트랜지션 제거
        track.style.transition = 'none';
        
        // 인덱스 변경
        currentSlide = 2;
        
        // 강제 리플로우
        track.offsetHeight;
        
        // 위치와 클래스 업데이트 (슬라이드 트랜지션 없이)
        updateSlidePosition(false, true);
        
        // 다음 프레임에서 트랜지션 복원
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          });
        });
      }
      // 첫 번째 복제 슬라이드에 도달했을 때
      else if (currentSlide < 2) {
        // 트랜지션 제거
        track.style.transition = 'none';
        
        // 인덱스 변경
        currentSlide = totalOriginalSlides + 1;
        
        // 강제 리플로우
        track.offsetHeight;
        
        // 위치와 클래스 업데이트 (슬라이드 트랜지션 없이)
        updateSlidePosition(false, true);
        
        // 다음 프레임에서 트랜지션 복원
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          });
        });
      }
      
      isTransitioning = false;
    }, 500);
    
    // 자동 슬라이드 재시작 - 수동 조작 시 전체 대기시간 적용
    setTimeout(() => {
      if (!slideInterval) {
        startSlideshow();
      }
    }, isManual ? slideDelay : 1000);
  };

  // 터치/스와이프 설정
  function setupTouchSwipe() {
    const slideshow = document.querySelector('.gf-products-slideshow');
    if (!slideshow) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    // 터치 시작
    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isDragging = true;
    }, { passive: true });
    
    // 터치 끝
    slideshow.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      touchEndX = e.changedTouches[0].screenX;
      isDragging = false;
      handleSwipe();
    });
    
    // 스와이프 처리
    function handleSwipe() {
      const swipeThreshold = 50;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        changeProductSlide(1, true); // true = 수동 조작
      } else if (touchEndX > touchStartX + swipeThreshold) {
        changeProductSlide(-1, true); // true = 수동 조작
      }
    }
    
    // 마우스 드래그도 지원
    let mouseDown = false;
    let mouseStartX = 0;
    
    slideshow.addEventListener('mousedown', (e) => {
      mouseDown = true;
      mouseStartX = e.clientX;
    });
    
    slideshow.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      e.preventDefault();
    });
    
    slideshow.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      
      mouseDown = false;
      
      const mouseEndX = e.clientX;
      const mouseDiff = mouseStartX - mouseEndX;
      
      if (Math.abs(mouseDiff) > 50) {
        if (mouseDiff > 0) {
          changeProductSlide(1, true); // true = 수동 조작
        } else {
          changeProductSlide(-1, true); // true = 수동 조작
        }
      }
    });
    
    slideshow.addEventListener('mouseleave', () => {
      mouseDown = false;
    });
  }
  
  // 실행
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
      clearSlideInterval();
    } else {
      setTimeout(() => {
        if (!slideInterval) {
          startSlideshow();
        }
      }, 100);
    }
  });
  
})();
/* ═══════════════════════════════════════════════════════════════════════
   제품 정보 섹션 끝
═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
   문의 정보 섹션 JavaScript 시작 (애니메이션 추가 버전)
═══════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  
  /* ═══════════════════════════════════════════════════════════════════════
     Intersection Observer를 이용한 화면 진입 감지
  ═══════════════════════════════════════════════════════════════════════ */
  
  // 화면에 들어온 요소를 감지하는 옵저버 생성
  function createContactFadeInObserver() {
    const options = {
      root: null, // 뷰포트를 기준으로
      rootMargin: '0px', // 여백 없이
      threshold: 0.1 // 요소의 10%가 보이면 트리거
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 화면에 들어온 요소에 'show' 클래스 추가
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          // 한 번 나타난 후에는 관찰 중지 (다시 사라지지 않도록)
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    return observer;
  }
  
  // 페이드인 애니메이션 초기화
  function initContactFadeInAnimations() {
    // 문의 섹션 내의 페이드인 효과를 적용할 모든 요소 선택
    const contactFadeElements = document.querySelectorAll('.gfnew-contact .gf-fade-in');
    
    if (contactFadeElements.length === 0) {
      console.warn('문의 섹션에 페이드인 요소를 찾을 수 없습니다.');
      return;
    }
    
    // 옵저버 생성
    const contactFadeInObserver = createContactFadeInObserver();
    
    // 각 요소를 옵저버에 등록
    contactFadeElements.forEach(element => {
      contactFadeInObserver.observe(element);
    });
    

  }

  // 윈도우 리사이즈 처리
  function handleResize() {
    // 리사이즈 시 필요한 처리가 있으면 여기에 추가

  }

  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // 페이드인 애니메이션 초기화
      initContactFadeInAnimations();
      handleResize();
    });
  } else {
    // 페이드인 애니메이션 초기화
    initContactFadeInAnimations();
    handleResize();
  }

  // 윈도우 리사이즈 이벤트
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // 개발자 도구에서 제어 함수들 제공
  window.contactSectionControls = {
    // 페이드인 애니메이션 다시 시작
    resetAnimations: function() {
      const elements = document.querySelectorAll('.gfnew-contact .gf-fade-in');
      elements.forEach(el => {
        el.classList.remove('show');
      });
      setTimeout(() => {
        initContactFadeInAnimations();
      }, 100);
    },
    logInfo: function() {

    }
  };

})();

/* ═══════════════════════════════════════════════════════════════════════
   문의 정보 섹션 JavaScript 끝
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   푸터 시작
═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
// 스크롤 투 탑 버튼
  const gfScrollTopBtn = document.getElementById('gfFooterScrollTop');

  // gfScrollTopBtn이 페이지에 존재하는 경우에만 아래 코드 실행
  if (gfScrollTopBtn) {
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
  }
  
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
});
/* ═══════════════════════════════════════════════════════════════════════
   푸터 끝
═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
개인정보처리방침 등 모달 시작
═══════════════════════════════════════════════════════════════════════ */

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
      background: #5e3b8a;
    }
  `;
  document.head.appendChild(style);
}
/* ═══════════════════════════════════════════════════════════════════════
개인정보처리방침 등 모달 끝
═══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
쿠키 팝업 모달 시작
═══════════════════════════════════════════════════════════════════════ */

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
// console.log('%c🍪 GOFIT 쿠키 관리', 'color: #e63946; font-size: 16px; font-weight: bold;');
// console.log('쿠키 설정 초기화: gfResetCookieConsent()');
// console.log('현재 설정 확인: gfGetCookiePreferences()');
// console.log('구글 애널리틱스 ID:', GA_MEASUREMENT_ID);

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
/* ═══════════════════════════════════════════════════════════════════════
쿠키 팝업 모달 끝
═══════════════════════════════════════════════════════════════════════ */