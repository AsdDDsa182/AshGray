// ─── GOFIT 회사소개 페이지 JavaScript ───

(function() {
  'use strict';
  
  // ═══════════════════════════════════════════════════════════════════════
  // 파티클 효과
  // ═══════════════════════════════════════════════════════════════════════
  function createAboutParticles() {
    const particlesContainer = document.getElementById('gfAboutParticles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth > 768 ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gf-about-particle';
      
      // 랜덤 위치
      particle.style.left = Math.random() * 100 + '%';
      
      // 랜덤 크기
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // 랜덤 애니메이션 지속 시간
      const duration = Math.random() * 20 + 10;
      particle.style.animationDuration = duration + 's';
      
      // 랜덤 지연
      const delay = Math.random() * duration;
      particle.style.animationDelay = `-${delay}s`;
      
      // 랜덤 불투명도
      particle.style.opacity = Math.random() * 0.5 + 0.3;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 스크롤 애니메이션
  // ═══════════════════════════════════════════════════════════════════════
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px 100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // 숫자 카운트 애니메이션 트리거
        if (entry.target.classList.contains('gf-about-stats')) {
            animateNumbers();
        }
        
        // value-item의 경우 애니메이션 완료 후 클래스 추가
        if (entry.target.classList.contains('gf-about-value-item')) {
            setTimeout(() => {
            entry.target.classList.add('animation-complete');
            }, 600); // CSS transition 시간과 동일
        }
        
        // vm-card의 경우도 애니메이션 완료 후 클래스 추가
        if (entry.target.classList.contains('gf-about-vm-card')) {
            setTimeout(() => {
            entry.target.classList.add('animation-complete');
            }, 900); // transition + delay 시간 고려
        }
        
        observer.unobserve(entry.target);
        }
    });
    }, observerOptions);
    
    // 관찰할 요소들
    const elementsToObserve = [
    '.gf-about-section-header',  // 섹션 헤더 추가
    '.gf-about-story-content',
    '.gf-about-story-visual',
    '.gf-about-vm-card',  // VISION & MISSION 카드 추가
    '.gf-about-value-item',
    '.gf-about-timeline-item',
    '.gf-about-award-item',
    '.gf-about-stats'
    ];
    
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        observer.observe(element);
      });
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 숫자 카운트 애니메이션
  // ═══════════════════════════════════════════════════════════════════════
  function animateNumbers() {
    const numbers = document.querySelectorAll('.gf-about-stat-number');
    
    numbers.forEach(number => {
      const target = parseInt(number.getAttribute('data-target'));
      const duration = 2000; // 2초
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = target / steps;
      
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        number.textContent = Math.round(current);
      }, stepDuration);
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 스크롤 인디케이터
  // ═══════════════════════════════════════════════════════════════════════
  function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.gf-about-hero-scroll');
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
      const storySection = document.querySelector('.gf-about-story');
      if (storySection) {
        const headerHeight = 80;
        const targetPosition = storySection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 패럴랙스 효과
  // ═══════════════════════════════════════════════════════════════════════
  function setupParallax() {
    const heroBg = document.querySelector('.gf-about-hero-bg img');
    if (!heroBg) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      heroBg.style.transform = `translateY(${rate}px)`;
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 초기화
  // ═══════════════════════════════════════════════════════════════════════
  function init() {
    createAboutParticles();
    setupScrollAnimations();
    setupScrollIndicator();
    setupParallax();
  }
  
  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 윈도우 리사이즈 처리
  // ═══════════════════════════════════════════════════════════════════════
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // 모바일/데스크톱 전환 시 파티클 재생성
      const particlesContainer = document.getElementById('gfAboutParticles');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createAboutParticles();
      }
    }, 250);
  });
})();

