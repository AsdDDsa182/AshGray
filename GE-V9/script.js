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



// GOFIT 비디오(히어로) 섹션 리디자인 JavaScript
(function() {
  'use strict';
  
  // 비디오 로드 후 애니메이션 트리거
  const gfHeroVimeo = document.getElementById('gf-hero-vimeo-player');
  const gfHeroVideoBg = document.querySelector('.gf-hero-bg-video');

  if (gfHeroVimeo && gfHeroVideoBg) {
    // iframe 로드 이벤트
    gfHeroVimeo.addEventListener('load', function() {
      // 애니메이션 클래스 추가
      gfHeroVideoBg.classList.add('gf-hero-loaded');
    });
    
    // 백업: 3초 후 자동으로 애니메이션 시작
    setTimeout(function() {
      if (!gfHeroVideoBg.classList.contains('gf-hero-loaded')) {
        gfHeroVideoBg.classList.add('gf-hero-loaded');
      }
    }, 3000);
  }
  
  // 타이핑 효과
  function initTypingEffect() {
    const typingElement = document.getElementById('gfHeroTyping');
    if (!typingElement) return;
    
    const phrases = [
      '혁신적인 디자인',
      '최고의 품질',
      '당신의 성공',
      '피트니스의 미래'
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
      const current = phrases[currentPhrase];
      
      if (isDeleting) {
        typingElement.textContent = current.substring(0, currentChar - 1);
        currentChar--;
        typeSpeed = 50;
      } else {
        typingElement.textContent = current.substring(0, currentChar + 1);
        currentChar++;
        typeSpeed = 100;
      }
      
      if (!isDeleting && currentChar === current.length) {
        // 단어 완성 후 대기
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentChar === 0) {
        // 삭제 완료 후 다음 문구로
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        typeSpeed = 500;
      }
      
      setTimeout(type, typeSpeed);
    }
    
    // 타이핑 시작
    setTimeout(type, 1500);
  }
  
  // 마우스 추적 파티클 효과
  function initMouseParticles() {
    const particlesContainer = document.getElementById('gfHeroParticles');
    if (!particlesContainer) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let particleCount = 0;
    const maxParticles = 50;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 마우스 이동 시 파티클 생성
      if (particleCount < maxParticles) {
        createParticle(mouseX, mouseY);
        particleCount++;
      }
    });
    
    function createParticle(x, y) {
      const particle = document.createElement('div');
      particle.className = 'gf-hero-particle';
      
      // 랜덤 오프셋
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      
      particle.style.left = (x + offsetX) + 'px';
      particle.style.top = (y + offsetY) + 'px';
      
      // 랜덤 크기
      const size = Math.random() * 6 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      particlesContainer.appendChild(particle);
      
      // 애니메이션 후 제거
      setTimeout(() => {
        particle.remove();
        particleCount--;
      }, 1000);
    }
  }
  
  // 스크롤 인디케이터 클릭
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.gf-hero-scroll-indicator');
    if (!scrollIndicator) return;
    
    // 초기 애니메이션이 끝나면 애니메이션 속성 제거
    scrollIndicator.addEventListener('animationend', function() {
      this.style.animation = 'none';
      this.style.opacity = '1';
    });
    
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#intro');
      if (nextSection) {
        const header = document.querySelector('.gf-header-main');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
    
    // 스크롤 시 인디케이터 점진적 숨기기
    function updateIndicator() {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth <= 768;
      
      // 모바일에서는 더 빨리 사라지도록 조정
      const startFade = isMobile ? 20 : 30;
      const endFade = isMobile ? 70 : 100;
      
      if (scrollY <= startFade) {
        // startFade 이하: 완전히 보임
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      } else if (scrollY > startFade && scrollY < endFade) {
        // startFade ~ endFade: 점진적으로 투명해짐
        const fadeRange = endFade - startFade;
        const fadeProgress = (scrollY - startFade) / fadeRange;
        const opacity = Math.max(0, 1 - fadeProgress);
        
        scrollIndicator.style.opacity = opacity.toString();
        scrollIndicator.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';
      } else {
        // endFade 이상: 완전히 숨김
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', updateIndicator);
    
    // 초기 상태 확인
    setTimeout(updateIndicator, 100);
  }
  
  // 패럴랙스 효과
  function initParallaxEffect() {
    const heroContent = document.querySelector('.gf-hero-content');
    const gridOverlay = document.querySelector('.gf-hero-grid-overlay');
    const floatingElements = document.querySelector('.gf-hero-floating-elements');
    
    if (!heroContent || !gridOverlay) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      heroContent.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
      gridOverlay.style.transform = `translateY(${rate * 0.2}px)`;
      
      if (floatingElements) {
        floatingElements.style.transform = `translateY(${rate * 0.3}px)`;
      }
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
  
  // 초기화
  function init() {
    initTypingEffect();
    initMouseParticles();
    initScrollIndicator();
    initParallaxEffect();
    
    // 페이지 로드 완료 시 애니메이션 시작
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });
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




// GOFIT 제품 정보 섹션 JavaScript (기하학적 도형 패턴 효과)
(function() {
  'use strict';
  
  // 전역 변수
  let currentCategory = 'all';
  
  // 초기화
  function initGfProductsSection() {
    console.log('GOFIT 제품 섹션 초기화');
    
    // 기하학적 도형 패턴 효과 추가
    createProductsParticles();
    
    // 스크롤 애니메이션 설정
    setupScrollAnimations();
    
    // 카테고리 필터 설정
    setupCategoryFilters();
    
    // 모바일에서만 제품 캐러셀 활성화
    if (window.innerWidth <= 768) {
      setupProductCarousel();
    }
    
    // 카드 애니메이션
    setupCardAnimations();
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
  // 카테고리 필터 (심플한 드래그)
  // ═══════════════════════════════════════════════════════════
  function setupCategoryFilters() {
    const filterWrapper = document.querySelector('.gf-products-filter-wrapper');
    const filterTabs = document.querySelectorAll('.gf-products-filter-tab');
    
    if (!filterWrapper) return;
    
    // 드래그 변수
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let clickStartX = 0;
    let velocity = 0;
    let animationId = null;
    
    // 탭 클릭 이벤트
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        // 드래그 거리가 5px 이상이면 클릭 무시
        if (Math.abs(clickStartX - e.clientX) > 5) {
          e.preventDefault();
          return;
        }
        
        const category = this.getAttribute('data-category');
        
        // 활성 탭 변경
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 카테고리 필터링
        filterProducts(category);
      });
    });
    
    // 마우스 드래그
    filterWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      clickStartX = e.clientX;
      startX = e.pageX - filterWrapper.offsetLeft;
      scrollLeft = filterWrapper.scrollLeft;
      velocity = 0;
      
      // 관성 애니메이션 중지
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      filterWrapper.style.cursor = 'grabbing';
      filterWrapper.style.userSelect = 'none';
    });
    
    filterWrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const x = e.pageX - filterWrapper.offsetLeft;
      const walk = (x - startX) * 1;
      filterWrapper.scrollLeft = scrollLeft - walk;
      
      // 속도 계산 (관성용)
      velocity = walk * 0.15; // 제품 카드와 동일하게
    });
    
    filterWrapper.addEventListener('mouseup', () => {
      isDragging = false;
      filterWrapper.style.cursor = 'grab';
      filterWrapper.style.userSelect = '';
      
      // 관성 효과 적용
      applyInertia();
    });
    
    filterWrapper.addEventListener('mouseleave', () => {
      isDragging = false;
      filterWrapper.style.cursor = 'grab';
      filterWrapper.style.userSelect = '';
      
      // 관성 효과 적용
      applyInertia();
    });
    
    // 터치 드래그
    let touchStartX = 0;
    let touchScrollLeft = 0;
    let lastTouchX = 0;
    let touchVelocity = 0;
    
    filterWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - filterWrapper.offsetLeft;
      lastTouchX = e.touches[0].pageX;
      touchScrollLeft = filterWrapper.scrollLeft;
      touchVelocity = 0;
      
      // 관성 애니메이션 중지
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }, { passive: true });
    
    filterWrapper.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - filterWrapper.offsetLeft;
      const walk = (x - touchStartX) * 1;
      filterWrapper.scrollLeft = touchScrollLeft - walk;
      
      // 속도 계산
      touchVelocity = (e.touches[0].pageX - lastTouchX) * 0.3; // 제품 카드와 동일
      lastTouchX = e.touches[0].pageX;
    }, { passive: true });
    
    filterWrapper.addEventListener('touchend', () => {
      velocity = -touchVelocity * 0.5; // 제품 카드와 동일
      applyInertia();
    });
    
    // 관성 효과 함수
    function applyInertia() {
      const friction = 0.97; // 제품 카드와 동일
      const minVelocity = 0.2; // 제품 카드와 동일
      
      function animate() {
        if (Math.abs(velocity) > minVelocity) {
          filterWrapper.scrollLeft -= velocity;
          velocity *= friction;
          animationId = requestAnimationFrame(animate);
        } else {
          animationId = null;
        }
      }
      
      animate();
    }
    
    // 초기 스타일
    filterWrapper.style.cursor = 'grab';
  }
  
  // ═══════════════════════════════════════════════════════════
  // 제품 필터링 - 수정된 버전
  // ═══════════════════════════════════════════════════════════
  function filterProducts(category) {
    currentCategory = category;
    const cards = document.querySelectorAll('.gf-products-card');
    
    cards.forEach((card, index) => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        // 먼저 display를 복원
        card.style.display = '';
        
        // 기존 인라인 스타일 제거 (중요!)
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = '';
        
        // 애니메이션 클래스 일시적으로 제거
        card.classList.remove('gf-products-visible');
        card.classList.remove('gf-products-animation-complete');
        
        // 리플로우 강제 발생 (브라우저가 변경사항을 인식하도록)
        void card.offsetWidth;
        
        // 애니메이션 재적용
        setTimeout(() => {
          card.style.transition = 'all 0.4s ease';
          card.classList.add('gf-products-visible');
          
          // 애니메이션 완료 후 처리
          setTimeout(() => {
            card.classList.add('gf-products-animation-complete');
          }, 400);
        }, index * 50);
      } else {
        // 카드 숨기기
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // 모바일에서 스크롤 초기화
    if (window.innerWidth <= 768) {
      const carousel = document.querySelector('.gf-products-grid');
      if (carousel) {
        carousel.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
    
    // 인디케이터 업데이트
    updateIndicators();
  }
  
  // ═══════════════════════════════════════════════════════════
  // 제품 캐러셀 (자유로운 드래그)
  // ═══════════════════════════════════════════════════════════
  function setupProductCarousel() {
    const carousel = document.querySelector('.gf-products-grid');
    if (!carousel) return;
    
    // 드래그 변수
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let animationId = null;
    
    // 스크롤 스냅 완전히 제거
    carousel.style.scrollSnapType = 'none';
    carousel.style.scrollBehavior = 'auto';
    
    // 이미지 드래그 방지
    const images = carousel.querySelectorAll('img');
    images.forEach(img => {
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';
      img.setAttribute('draggable', 'false');
    });
    
    // 마우스 이벤트
    carousel.addEventListener('mousedown', (e) => {
      // 이미지나 링크 드래그 방지
      e.preventDefault();
      
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      velocity = 0;
      
      // 관성 애니메이션 중지
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      carousel.style.cursor = 'grabbing';
      carousel.style.userSelect = 'none';
    });
    
    carousel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const x = e.pageX - carousel.offsetLeft;
      const diff = x - startX;
      carousel.scrollLeft = scrollLeft - diff;
      
      // 속도 계산 (관성용) - 부드럽게 조정
      velocity = diff * 0.15; // 더 약하게 조정
    });
    
    carousel.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
      carousel.style.userSelect = '';
      
      // 관성 효과 적용
      applyInertia();
    });
    
    carousel.addEventListener('mouseleave', () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
      carousel.style.userSelect = '';
      
      // 관성 효과 적용
      applyInertia();
    });
    
    // 터치 이벤트
    let touchStartX = 0;
    let touchScrollLeft = 0;
    let lastTouchX = 0;
    let touchVelocity = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      lastTouchX = touchStartX;
      touchScrollLeft = carousel.scrollLeft;
      touchVelocity = 0;
      
      // 관성 애니메이션 중지
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const diff = touchStartX - x;
      carousel.scrollLeft = touchScrollLeft + diff;
      
      // 속도 계산 - 부드럽게 조정
      touchVelocity = (x - lastTouchX) * 0.3; // 더 약하게
      lastTouchX = x;
    }, { passive: true });
    
    carousel.addEventListener('touchend', () => {
      velocity = -touchVelocity * 0.5; // 더 약하게
      applyInertia();
    });
    
    // 관성 효과 함수
    function applyInertia() {
      const friction = 0.97; // 더 높여서 빨리 멈춤
      const minVelocity = 0.2; // 더 낮춰서 빨리 멈춤
      
      function animate() {
        if (Math.abs(velocity) > minVelocity) {
          carousel.scrollLeft -= velocity;
          velocity *= friction;
          animationId = requestAnimationFrame(animate);
        } else {
          animationId = null;
        }
      }
      
      animate();
    }
    
    // 스크롤 이벤트로 인디케이터 실시간 업데이트
    carousel.addEventListener('scroll', () => {
      updateIndicators();
    });
    
    // 초기 스타일
    carousel.style.cursor = 'grab';
    
    // 컨텍스트 메뉴 방지 (우클릭)
    carousel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // 선택 방지
    carousel.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // 인디케이터
  // ═══════════════════════════════════════════════════════════
  function updateIndicators() {
    const carousel = document.querySelector('.gf-products-grid');
    const indicators = document.querySelectorAll('.gf-products-indicator');
    
    if (!carousel || indicators.length === 0) return;
    
    // 보이는 카드들만 가져오기
    const visibleCards = Array.from(document.querySelectorAll('.gf-products-card'))
      .filter(card => card.style.display !== 'none');
    
    if (visibleCards.length === 0) return;
    
    // 현재 스크롤 위치를 기반으로 인디케이터 활성화
    const scrollPercentage = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
    const activeIndex = Math.round(scrollPercentage * (indicators.length - 1));
    
    indicators.forEach((indicator, index) => {
      if (index === activeIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // 인디케이터 클릭
  function setupIndicatorClicks() {
    const indicators = document.querySelectorAll('.gf-products-indicator');
    const carousel = document.querySelector('.gf-products-grid');
    
    if (!carousel) return;
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
        const targetScroll = (scrollWidth / (indicators.length - 1)) * index;
        
        carousel.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // 카드 애니메이션
  // ═══════════════════════════════════════════════════════════
  function setupCardAnimations() {
    const cards = document.querySelectorAll('.gf-products-card');
    
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // 버튼 클릭은 제외
        if (e.target.closest('.gf-products-btn')) return;
        
        // 리플 효과
        const ripple = document.createElement('span');
        ripple.className = 'gf-products-ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
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
      '.gf-products-filter-wrapper',
      '.gf-products-card',
      '.gf-products-indicators'
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
            // 헤더는 즉시
            if (entry.target.classList.contains('gf-products-header')) {
              entry.target.classList.add('gf-products-visible');
            }
            // 필터는 0.1초 후
            else if (entry.target.classList.contains('gf-products-filter-wrapper')) {
              setTimeout(() => {
                entry.target.classList.add('gf-products-visible');
              }, 100);
            }
            // 인디케이터는 0.3초 후
            else if (entry.target.classList.contains('gf-products-indicators')) {
              setTimeout(() => {
                entry.target.classList.add('gf-products-visible');
              }, 300);
            }
            // 카드는 즉시 visible 추가하고 애니메이션 완료 후 complete 클래스 추가
            else if (entry.target.classList.contains('gf-products-card')) {
              entry.target.classList.add('gf-products-visible');
              
              // 카드의 인덱스를 찾아서 적절한 딜레이 계산
              const cards = document.querySelectorAll('.gf-products-card');
              const index = Array.from(cards).indexOf(entry.target);
              const delay = 50 + (index * 50); // 기본 50ms + 인덱스 * 50ms
              
              // 애니메이션 완료 후 클래스 추가
              setTimeout(() => {
                entry.target.classList.add('gf-products-animation-complete');
              }, delay + 400); // transition 시간(400ms) 추가
            }
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
  // 리사이즈 처리
  // ═══════════════════════════════════════════════════════════
  function handleResize() {
    if (window.innerWidth <= 768) {
      setupProductCarousel();
      setupIndicatorClicks();
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // 실행
  // ═══════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGfProductsSection();
      setupIndicatorClicks();
    });
  } else {
    initGfProductsSection();
    setupIndicatorClicks();
  }
  
  // 리사이즈 이벤트
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });
  
})();

// CSS 추가 (리플 효과용)
const style = document.createElement('style');
style.textContent = `
  .gf-products-card {
    position: relative;
    overflow: hidden;
  }
  
  .gf-products-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(230, 57, 70, 0.3);
    transform: scale(0);
    animation: gfProductsRipple 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes gfProductsRipple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);




// ─── 모던 문의 섹션 V2 JavaScript ───// ─── 모던 문의 섹션 V2 JavaScript ───// ─── 모던 문의 섹션 V2 JavaScript ───

// ─── 모던 문의 섹션 V2 JavaScript (예산 비교 기능 추가) ───

// 제품 데이터 (rentalPrice를 숫자로 변경)
const products = [
  // 근력 운동
  { id: 1, name: '파워랙 프로', code: 'PR-001', category: 'strength', price: 3500000, rentalPrice: 120000, img: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=300' },
  { id: 2, name: '스미스 머신', code: 'SM-001', category: 'strength', price: 4200000, rentalPrice: 150000, img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300' },
  { id: 3, name: '케이블 머신', code: 'CM-001', category: 'strength', price: 5800000, rentalPrice: 200000, img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300' },
  { id: 4, name: '레그 프레스', code: 'LP-001', category: 'strength', price: 2900000, rentalPrice: 100000, img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=300' },
  
  // 유산소 운동
  { id: 5, name: '런닝머신 X3', code: 'TM-003', category: 'cardio', price: 6500000, rentalPrice: 220000, img: 'https://images.unsplash.com/photo-1578874691223-64558a3ca096?w=300' },
  { id: 6, name: '사이클 프로', code: 'CY-001', category: 'cardio', price: 3200000, rentalPrice: 110000, img: 'https://images.unsplash.com/photo-1589579234096-25cb6b83e021?w=300' },
  { id: 7, name: '일립티컬', code: 'EL-001', category: 'cardio', price: 4800000, rentalPrice: 165000, img: 'https://images.unsplash.com/photo-1637666218229-1fe0a9419267?w=300' },
  
  // 프리웨이트
  { id: 8, name: '덤벨 세트', code: 'DB-001', category: 'free', price: 450000, rentalPrice: 20000, img: 'https://images.unsplash.com/photo-1542766788-a2f588f447ee?w=300' },
  { id: 9, name: '바벨 세트', code: 'BB-001', category: 'free', price: 680000, rentalPrice: 25000, img: 'https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?w=300' },
  { id: 10, name: '케틀벨 세트', code: 'KB-001', category: 'free', price: 320000, rentalPrice: 15000, img: 'https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?w=300' }
];

// 현재 활성 탭
let activeTab = 'general';
let currentFormType = '';
let selectedProducts = {
  purchase: [],
  rental: []
};

// 탭 전환
function showTab(tabName, event) {
  activeTab = tabName;
  
  // 탭 버튼 활성화
  document.querySelectorAll('.gfnew-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // 폼 패널 전환
  document.querySelectorAll('.gfnew-form-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`${tabName}-form`).classList.add('active');
}

// 제품 모달 열기
function openProductModal(formType) {
  currentFormType = formType;
  window.currentCategory = 'all';
  document.getElementById('productModal').classList.add('show');
  
  // 필터 탭 초기화
  document.querySelectorAll('.gfnew-filter-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.textContent === '전체') {
      tab.classList.add('active');
    }
  });
  
  renderProducts('all');
  updateSelectionCount();
}

// 제품 모달 닫기
function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
}

// 제품 필터링
function filterProducts(category, event) {
  // 필터 버튼 활성화
  document.querySelectorAll('.gfnew-filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // 카테고리 매핑
  const categoryMap = {
    '전체': 'all',
    '근력 운동': 'strength',
    '유산소 운동': 'cardio',
    '프리웨이트': 'free'
  };
  
  const mappedCategory = categoryMap[category] || category;
  
  // 현재 카테고리를 전역 변수로 저장
  window.currentCategory = mappedCategory;
  renderProducts(mappedCategory);
}

// 제품 렌더링
function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
  
  grid.innerHTML = filteredProducts.map(product => {
    const isSelected = selectedProducts[currentFormType].some(p => p.id === product.id);
    const price = currentFormType === 'rental' ? `월 ${formatNumber(product.rentalPrice)}원` : `${formatNumber(product.price)}원`;
    
    return `
      <div class="gfnew-product-card ${isSelected ? 'selected' : ''}" onclick="toggleProduct(${product.id})">
        <img src="${product.img}" alt="${product.name}" class="gfnew-card-img">
        <div class="gfnew-card-info">
          <h4 class="gfnew-card-name">${product.name}</h4>
          <p class="gfnew-card-desc">제품코드: ${product.code}</p>
          <p class="gfnew-card-price">${price}</p>
        </div>
        <div class="gfnew-card-check"></div>
      </div>
    `;
  }).join('');
}

// 제품 선택/해제
function toggleProduct(productId) {
  const product = products.find(p => p.id === productId);
  const index = selectedProducts[currentFormType].findIndex(p => p.id === productId);
  
  if (index > -1) {
    selectedProducts[currentFormType].splice(index, 1);
  } else {
    selectedProducts[currentFormType].push({...product, quantity: 1});
  }
  
  // 현재 카테고리를 유지하면서 다시 렌더링
  const currentCat = window.currentCategory || 'all';
  renderProducts(currentCat);
  updateSelectionCount();
}

// 선택 개수 업데이트
function updateSelectionCount() {
  document.getElementById('selectionCount').textContent = selectedProducts[currentFormType].length;
}

// 선택 완료
function confirmSelection() {
  renderSelectedProducts();
  closeProductModal();
  
  // 예산 비교 업데이트
  if (currentFormType === 'purchase') {
    updateBudgetComparison();
  } else if (currentFormType === 'rental') {
    updateRentalBudgetComparison();
  }
}

// 선택된 제품 렌더링
function renderSelectedProducts() {
  const listId = currentFormType === 'purchase' ? 'purchase-products' : 'rental-products';
  const list = document.getElementById(listId);
  
  if (selectedProducts[currentFormType].length === 0) {
    list.classList.remove('show');
    return;
  }
  
  list.classList.add('show');
  list.innerHTML = selectedProducts[currentFormType].map((product, index) => {
    const price = currentFormType === 'rental' ? `월 ${formatNumber(product.rentalPrice)}원` : `${formatNumber(product.price)}원`;
    
    return `
      <div class="gfnew-product-item">
        <img src="${product.img}" alt="${product.name}" class="gfnew-product-img">
        <div class="gfnew-product-info">
          <h4 class="gfnew-product-name">${product.name}</h4>
          <p class="gfnew-product-code">${product.code} · ${price}</p>
        </div>
        <div class="gfnew-product-controls">
          <div class="gfnew-qty-control">
            <button class="gfnew-qty-btn" onclick="changeQuantity('${currentFormType}', ${index}, -1)">-</button>
            <span class="gfnew-qty-value">${product.quantity}</span>
            <button class="gfnew-qty-btn" onclick="changeQuantity('${currentFormType}', ${index}, 1)">+</button>
          </div>
          <button class="gfnew-delete-btn" onclick="removeProduct('${currentFormType}', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 수량 변경
function changeQuantity(formType, index, change) {
  const product = selectedProducts[formType][index];
  product.quantity = Math.max(1, product.quantity + change);
  currentFormType = formType;
  renderSelectedProducts();
  
  // 예산 비교 업데이트
  if (formType === 'purchase') {
    updateBudgetComparison();
  } else if (formType === 'rental') {
    updateRentalBudgetComparison();
  }
}

// 제품 삭제
function removeProduct(formType, index) {
  selectedProducts[formType].splice(index, 1);
  currentFormType = formType;
  renderSelectedProducts();
  
  // 예산 비교 업데이트
  if (formType === 'purchase') {
    updateBudgetComparison();
  } else if (formType === 'rental') {
    updateRentalBudgetComparison();
  }
}

// 숫자 포맷팅 함수 (천단위 콤마)
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 숫자만 추출하는 함수
function extractNumber(str) {
  return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

// 총 가격 계산 함수
function calculateTotalPrice() {
  return selectedProducts.purchase.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
}

// 렌탈 총 가격 계산 함수
function calculateTotalRentalPrice() {
  return selectedProducts.rental.reduce((total, product) => {
    return total + (product.rentalPrice * product.quantity);
  }, 0);
}

// 예산 비교 업데이트 함수
function updateBudgetComparison() {
  const budgetInput = document.getElementById('purchase-budget');
  const budgetCompare = document.getElementById('purchase-budget-compare');
  const budgetDisplay = document.getElementById('purchase-budget-display');
  const totalDisplay = document.getElementById('purchase-total-display');
  const gaugeFill = document.getElementById('purchase-gauge-fill');
  const gaugeMarker = document.getElementById('purchase-gauge-marker');
  const budgetStatus = document.getElementById('purchase-budget-status');
  
  // 예산 입력값 확인
  const budgetValue = extractNumber(budgetInput.value);
  const totalPrice = calculateTotalPrice();
  
  // 예산이 입력되고 제품이 선택된 경우에만 표시
  if (budgetValue > 0 && selectedProducts.purchase.length > 0) {
    budgetCompare.style.display = 'block';
    
    // 금액 표시
    budgetDisplay.textContent = formatNumber(budgetValue) + '원';
    totalDisplay.textContent = formatNumber(totalPrice) + '원';
    
    // 퍼센트 계산
    const percentage = Math.min((totalPrice / budgetValue) * 100, 150);
    
    // 게이지 업데이트
    gaugeFill.style.width = `${Math.min(percentage, 100)}%`;
    gaugeMarker.style.left = `${percentage}%`;
    
    // 상태 메시지 업데이트
    if (percentage <= 70) {
      budgetStatus.className = 'gfnew-budget-status good';
      budgetStatus.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>예산 내에서 여유있게 선택하셨습니다. (${Math.round(percentage)}%)</span>
      `;
    } else if (percentage <= 100) {
      budgetStatus.className = 'gfnew-budget-status warning';
      budgetStatus.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>예산에 근접한 선택입니다. (${Math.round(percentage)}%)</span>
      `;
    } else {
      budgetStatus.className = 'gfnew-budget-status over';
      budgetStatus.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <span>예산을 ${formatNumber(totalPrice - budgetValue)}원 초과했습니다. (${Math.round(percentage)}%)</span>
      `;
    }
    
    // 게이지 색상 업데이트
    if (percentage <= 70) {
      gaugeFill.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
    } else if (percentage <= 100) {
      gaugeFill.style.background = 'linear-gradient(90deg, #f1c40f, #f39c12)';
    } else {
      gaugeFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    }
  } else {
    budgetCompare.style.display = 'none';
  }
}

// 렌탈 예산 비교 업데이트 함수
function updateRentalBudgetComparison() {
  const budgetInput = document.getElementById('rental-budget');
  const budgetCompare = document.getElementById('rental-budget-compare');
  const budgetDisplay = document.getElementById('rental-budget-display');
  const totalDisplay = document.getElementById('rental-total-display');
  const gaugeFill = document.getElementById('rental-gauge-fill');
  const gaugeMarker = document.getElementById('rental-gauge-marker');
  const budgetStatus = document.getElementById('rental-budget-status');
  
  // 예산 입력값 확인
  const budgetValue = extractNumber(budgetInput.value);
  const totalPrice = calculateTotalRentalPrice();
  
  // 예산이 입력되고 제품이 선택된 경우에만 표시
  if (budgetValue > 0 && selectedProducts.rental.length > 0) {
    budgetCompare.style.display = 'block';
    
    // 금액 표시
    budgetDisplay.textContent = formatNumber(budgetValue) + '원';
    totalDisplay.textContent = formatNumber(totalPrice) + '원';
    
    // 퍼센트 계산
    const percentage = Math.min((totalPrice / budgetValue) * 100, 150);
    
    // 게이지 업데이트
    gaugeFill.style.width = `${Math.min(percentage, 100)}%`;
    gaugeMarker.style.left = `${percentage}%`;
    
    // 상태 메시지 업데이트
    if (percentage <= 70) {
      budgetStatus.className = 'gfnew-budget-status good';
      budgetStatus.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>월 렌탈 예산 내에서 여유있게 선택하셨습니다. (${Math.round(percentage)}%)</span>
      `;
    } else if (percentage <= 100) {
      budgetStatus.className = 'gfnew-budget-status warning';
      budgetStatus.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>월 렌탈 예산에 근접한 선택입니다. (${Math.round(percentage)}%)</span>
      `;
    } else {
      budgetStatus.className = 'gfnew-budget-status over';
      budgetStatus.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <span>월 렌탈 예산을 ${formatNumber(totalPrice - budgetValue)}원 초과했습니다. (${Math.round(percentage)}%)</span>
      `;
    }
    
    // 게이지 색상 업데이트
    if (percentage <= 70) {
      gaugeFill.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
    } else if (percentage <= 100) {
      gaugeFill.style.background = 'linear-gradient(90deg, #f1c40f, #f39c12)';
    } else {
      gaugeFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    }
  } else {
    budgetCompare.style.display = 'none';
  }
}

// 폼 제출 처리
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    form.reset();
    selectedProducts = {purchase: [], rental: []};
    document.querySelectorAll('.gfnew-selected-list').forEach(list => {
      list.classList.remove('show');
      list.innerHTML = '';
    });
    // 예산 비교 숨기기
    document.getElementById('purchase-budget-compare').style.display = 'none';
    document.getElementById('rental-budget-compare').style.display = 'none';
  });
});

// 모달 외부 클릭시 닫기
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeProductModal();
  }
});

// 예산 입력 시 실시간 포맷팅 (선택사항)
document.getElementById('purchase-budget').addEventListener('input', function(e) {
  // 숫자만 남기기
  let value = e.target.value.replace(/[^0-9]/g, '');
  
  // 천단위 콤마 추가
  if (value) {
    e.target.value = formatNumber(value) + '원';
  }
  
  // 커서를 끝으로 이동
  const len = e.target.value.length;
  e.target.setSelectionRange(len - 1, len - 1);
});

// 렌탈 예산 입력 시 실시간 포맷팅
document.getElementById('rental-budget').addEventListener('input', function(e) {
  // 숫자만 남기기
  let value = e.target.value.replace(/[^0-9]/g, '');
  
  // 천단위 콤마 추가
  if (value) {
    e.target.value = formatNumber(value) + '원';
  }
  
  // 커서를 끝으로 이동
  const len = e.target.value.length;
  e.target.setSelectionRange(len - 1, len - 1);
});

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
      '.gfnew-tab-container',
      '.gfnew-form-wrapper'
    ];
    
    // Intersection Observer 옵션
    const observerOptions = {
      threshold: 0.05, // 요소의 10%가 보이면 트리거
      rootMargin: '0px 0px -20px 0px' // 하단에서 50px 전에 트리거
    };
    
    // Observer 생성
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 요소가 화면에 들어오면 visible 클래스 추가
          requestAnimationFrame(() => {
            entry.target.classList.add('gfnew-visible');
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
      const contactSection = document.querySelector('.gfnew-contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        // 문의 섹션이 이미 화면에 보이는 경우
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

