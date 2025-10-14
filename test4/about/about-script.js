/*
████████████████████████████████████████████████████████████████████████████████
██                      MOBILE VIEWPORT STABILIZER                           ██
██                        모바일 뷰포트 안정화 시작                              ██
████████████████████████████████████████████████████████████████████████████████
*/

// 모바일 뷰포트 떨림 방지 (about 페이지용)
document.addEventListener('DOMContentLoaded', function() {
  // 모바일인지 확인
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 초기 뷰포트 높이 저장
    const vh = window.innerHeight;
    
    // about 페이지의 섹션들 높이 고정
    const heroSection = document.querySelector('.hero-section');
    // const aboutSection = document.querySelector('.about-section');
    // const growthSection = document.querySelector('.growth-section');
    // const valuesSection = document.querySelector('.values-section');
    // const partnersSection = document.querySelector('.partners-section');

    // 높이 고정 적용
    if (heroSection) heroSection.style.height = `${vh}px`;
    // if (aboutSection) aboutSection.style.minHeight = `${vh}px`;
    // if (growthSection) growthSection.style.minHeight = `${vh}px`;
    // if (valuesSection) valuesSection.style.minHeight = `${vh}px`;
    // if (partnersSection) partnersSection.style.minHeight = `${vh}px`;
  }
});

/*
████████████████████████████████████████████████████████████████████████████████
██                      MOBILE VIEWPORT STABILIZER                           ██
██                        모바일 뷰포트 안정화 끝                                ██
████████████████████████████████████████████████████████████████████████████████
*/


/*
████████████████████████████████████████████████████████████████████████████████
██                      ABOUT PAGE MAIN SCRIPT                               ██
██                        어바웃 페이지 메인 스크립트                            ██
████████████████████████████████████████████████████████████████████████████████
*/

(function() {
  'use strict';
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  FADE IN ANIMATION SYSTEM
  페이드인 애니메이션 시스템
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function setupFadeInAnimations() {
    // IntersectionObserver 옵션
    const observerOptions = {
      threshold: 0.1, // 요소의 10%가 보이면 실행
      rootMargin: '0px 0px -50px 0px' // 뷰포트 하단에서 50px 위에서 감지
    };
    
    // Observer 생성
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // visible 클래스 추가
          entry.target.classList.add('visible');
          
          // 한 번 나타난 요소는 더 이상 관찰하지 않음
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 모든 페이드인 클래스를 가진 요소 관찰
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  HEADER SCROLL EFFECTS
  헤더 스크롤 효과
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function setupHeaderScroll() {
    const header = document.querySelector('.gf-header-main');
    if (!header) return;
    
    let lastScroll = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;
          
          // 스크롤 다운: 헤더 숨기기
          if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('gf-header-hidden');
          } 
          // 스크롤 업: 헤더 보이기
          else {
            header.classList.remove('gf-header-hidden');
          }
          
          lastScroll = currentScroll;
          isScrolling = false;
        });
        
        isScrolling = true;
      }
    });
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  VIMEO PLAYER INITIALIZATION - About 페이지용
  Vimeo 플레이어 초기화 - About 페이지용
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function initAboutVimeoPlayer() {
    const vimeoIframe = document.getElementById('about-hero-vimeo-player');
    
    if (!vimeoIframe) {
      console.warn('About 페이지 Vimeo iframe 요소를 찾을 수 없습니다.');
      return;
    }
    

    
    // iframe 로드 완료 감지
    vimeoIframe.addEventListener('load', function() {

      
      // iframe이 로드되면 비디오 컨테이너를 보이게 함
      const videoContainer = document.querySelector('.hero-background');
      if (videoContainer) {
        videoContainer.style.opacity = '1';
      }
    });
    
    // iframe 로드 에러 처리
    vimeoIframe.addEventListener('error', function() {
      console.warn('About 페이지 Vimeo iframe 로드 에러');
      
      // 에러 시 배경색만 표시
      const videoContainer = document.querySelector('.hero-background');
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
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  INFINITE SCROLL ANIMATION
  무한 스크롤 애니메이션 (예제 코드 기반)
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function setupInfiniteScroll() {
    const scrollers = document.querySelectorAll(".scroller");
    
    // 사용자가 모션 감소를 선호하지 않는 경우에만 애니메이션 추가
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }
    
    function addAnimation() {
      scrollers.forEach((scroller) => {
        // 모든 `.scroller`에 data-animated="true" 추가
        scroller.setAttribute("data-animated", true);
        
        // `.scroller__inner` 내의 요소들을 배열로 만들기
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);
        
        // 각 요소를 복제하여 무한 스크롤 효과 생성
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  SCRAMBLE TEXT EFFECT
  스크램블 텍스트 효과 (글리치 효과)
  ═══════════════════════════════════════════════════════════════════════
  */
  
  // 스크램블에 사용할 문자들
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~₩※§¥£€¢∞∑∫∂∆∏√≈≠≤≥÷×±∓';
  const englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // 랜덤 문자 생성
  function getRandomChar() {
    const allChars = scrambleChars + englishChars;
    return allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // 텍스트 스크램블 클래스
  class TextScrambler {
    constructor(element) {
      this.element = element;
      this.originalText = element.textContent;
      this.chars = [];
      this.frame = 0;
      this.frameRequest = null;
      this.isAnimating = false;
    }
    
    scramble() {
      if (this.isAnimating) return;
      
      const text = this.originalText;
      const length = text.length;
      
      this.chars = [];
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * 10);
        const end = start + Math.floor(Math.random() * 10) + 15; // 더 짧은 지속시간
        this.chars.push({ 
          char: text[i], 
          start, 
          end,
          isSpace: text[i] === ' '
        });
      }
      
      this.frame = 0;
      this.isAnimating = true;
      this.element.classList.add('scrambling');
      this.update();
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0; i < this.chars.length; i++) {
        const { char, start, end, isSpace } = this.chars[i];
        
        if (isSpace) {
          output += ' ';
          complete++;
        } else if (this.frame >= end) {
          complete++;
          output += char;
        } else if (this.frame >= start) {
          output += getRandomChar();
        } else {
          output += getRandomChar();
        }
      }
      
      this.element.textContent = output;
      
      if (complete === this.chars.length) {
        this.element.classList.remove('scrambling');
        this.isAnimating = false;
        this.element.textContent = this.originalText;
      } else {
        this.frameRequest = requestAnimationFrame(() => this.update());
        this.frame++;
      }
    }
    
    destroy() {
      if (this.frameRequest) {
        cancelAnimationFrame(this.frameRequest);
      }
      this.isAnimating = false;
      this.element.classList.remove('scrambling');
    }
  }
  
  // 스크램블 효과 초기화
  function setupScrambleEffect() {
    const scrambleElements = document.querySelectorAll('.gf-scramble-text');
    const scramblers = [];
    
    scrambleElements.forEach(element => {
      const scrambler = new TextScrambler(element);
      scramblers.push(scrambler);
    });
    
    // 주기적으로 스크램블 효과 실행
    function runScramble() {
      scramblers.forEach((scrambler, index) => {
        setTimeout(() => {
          scrambler.scramble();
        }, index * 200); // 각 텍스트마다 200ms 간격
      });
    }
    
    // 페이드인 완료 후 첫 스크램블 시작
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const checkFadeIn = setInterval(() => {
        if (heroTitle.classList.contains('visible')) {
          clearInterval(checkFadeIn);
          setTimeout(runScramble, 500); // 0.5초 후 첫 실행
          
          // 이후 주기적으로 반복
          setInterval(runScramble, 8000); // 8초마다 반복 (더 긴 간격)
        }
      }, 100);
    }
    
    return scramblers;
  }
  
  function optimizeMobile() {
    // 모바일 디바이스 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 터치 이벤트 최적화
      document.addEventListener('touchstart', function() {}, { passive: true });
      
      // 모바일에서 호버 효과 제거
      const style = document.createElement('style');
      style.textContent = `
        @media (hover: none) {
          .brand-item:hover .brand-icon {
            transform: none !important;
            background: transparent !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  INITIALIZATION
  초기화 함수
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function init() {
    // 페이드인 애니메이션 설정
    setupFadeInAnimations();
    
    // 헤더 스크롤 효과 설정
    setupHeaderScroll();
    
    // Vimeo 플레이어 초기화
    initAboutVimeoPlayer();
    
    // 무한 스크롤 애니메이션 설정
    setupInfiniteScroll();
    
    // 스크램블 효과 설정
    setupScrambleEffect();
    
    // 모바일 최적화
    optimizeMobile();
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  DOM READY EVENT
  DOM 준비 완료 이벤트
  ═══════════════════════════════════════════════════════════════════════
  */
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

/*
████████████████████████████████████████████████████████████████████████████████
██                        END OF JAVASCRIPT                                  ██
████████████████████████████████████████████████████████████████████████████████
*/