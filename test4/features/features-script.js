// /*
// ████████████████████████████████████████████████████████████████████████████████
// ██                      MOBILE VIEWPORT STABILIZER                           ██
// ██                        모바일 뷰포트 안정화 시작                              ██
// ████████████████████████████████████████████████████████████████████████████████
// */

// // 모바일 뷰포트 떨림 방지 (about 페이지용)
// document.addEventListener('DOMContentLoaded', function() {
//   // 모바일인지 확인
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
//   if (isMobile) {
//     // 초기 뷰포트 높이 저장
//     const vh = window.innerHeight;
    
//     // about 페이지의 섹션들 높이 고정
//     const heroSection = document.querySelector('.hero-section');
//     // const aboutSection = document.querySelector('.about-section');
//     // const growthSection = document.querySelector('.growth-section');
//     // const valuesSection = document.querySelector('.values-section');
//     // const partnersSection = document.querySelector('.partners-section');

//     // 높이 고정 적용
//     if (heroSection) heroSection.style.height = `${vh}px`;
//     // if (aboutSection) aboutSection.style.minHeight = `${vh}px`;
//     // if (growthSection) growthSection.style.minHeight = `${vh}px`;
//     // if (valuesSection) valuesSection.style.minHeight = `${vh}px`;
//     // if (partnersSection) partnersSection.style.minHeight = `${vh}px`;
//   }
// });

// /*
// ████████████████████████████████████████████████████████████████████████████████
// ██                      MOBILE VIEWPORT STABILIZER                           ██
// ██                        모바일 뷰포트 안정화 끝                                ██
// ████████████████████████████████████████████████████████████████████████████████
// */

/*
████████████████████████████████████████████████████████████████████████████████
██                      FEATURES PAGE MAIN SCRIPT                            ██
██                        특징 페이지 메인 스크립트                             ██
████████████████████████████████████████████████████████████████████████████████
*/

(function() {
  'use strict';
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  INFINITE SCROLL ANIMATION
  무한 스크롤 애니메이션 (독립 실행)
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function initInfiniteScroll() {
    const scrollers = document.querySelectorAll(".scroller");
    
    if (scrollers.length === 0) {

      return;
    }
    
    // 사용자가 모션 감소를 선호하지 않는 경우에만 애니메이션 추가
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scrollers.forEach((scroller) => {
        // data-animated="true" 추가
        scroller.setAttribute("data-animated", true);
        
        // 내부 요소들을 복제
        const scrollerInner = scroller.querySelector(".scroller__inner");
        if (!scrollerInner) return;
        
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
  FADE IN ANIMATION
  페이드인 애니메이션
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function initFadeInAnimations() {
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
    
    // 모든 페이드인 요소 관찰
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  HERO SECTION EFFECTS
  히어로 섹션 효과
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function initHeroEffects() {
    const heroSection = document.querySelector('.hero-section');
    const heroElements = document.querySelectorAll('.hero-section .fade-in');
    
    if (!heroSection) return;
    
    // 히어로 섹션 요소들에 순차적 애니메이션 적용
    heroElements.forEach((element, index) => {
      // 각 요소마다 지연 시간 설정
      element.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // 페이지 로드 시 즉시 히어로 요소들 표시
    setTimeout(() => {
      heroElements.forEach(element => {
        element.classList.add('visible');
      });
    }, 100);
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  MOBILE OPTIMIZATION
  모바일 최적화
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function optimizeMobile() {
    // 모바일 디바이스 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 터치 이벤트 최적화
      document.addEventListener('touchstart', function() {}, { passive: true });
      
      // 모바일에서 호버 효과 제거 (캐러셀만 유지)
      const style = document.createElement('style');
      style.textContent = `
        @media (hover: none) {
          .carousel-slide:hover img {
            transform: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  SMOOTH SCROLL TO SECTIONS
  섹션별 부드러운 스크롤 (선택적 기능)
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function initSmoothScroll() {
    // 페이지 내 앵커 링크가 있을 경우를 위한 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  MAIN INITIALIZATION
  메인 초기화 함수
  ═══════════════════════════════════════════════════════════════════════
  */
  
  function init() {

    
    // 히어로 섹션 효과 초기화 (가장 먼저)
    initHeroEffects();
    
    // 무한 스크롤 초기화
    initInfiniteScroll();
    
    // 페이드인 애니메이션 초기화
    initFadeInAnimations();
    
    // 부드러운 스크롤 초기화
    initSmoothScroll();
    
    // 모바일 최적화
    optimizeMobile();
    

  }
  
  /*
  ═══════════════════════════════════════════════════════════════════════
  DOM READY EVENT
  DOM 준비 완료 이벤트
  ═══════════════════════════════════════════════════════════════════════
  */
  
  // DOM이 완전히 로드된 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 이미 로드된 경우 바로 실행
    init();
  }
  
})();

/*
████████████████████████████████████████████████████████████████████████████████
██                        END OF JAVASCRIPT                                  ██
████████████████████████████████████████████████████████████████████████████████
*/