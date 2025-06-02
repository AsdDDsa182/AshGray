// ═══════════════════════════════════════════════════════════════════════
// GOFIT Features 페이지 JavaScript
// ═══════════════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  // ─── 히어로 섹션 파티클 효과 ───
  function createHeroParticles() {
    const container = document.getElementById('gfFeatHeroParticles');
    if (!container) return;
    
    const particleCount = window.innerWidth > 768 ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gf-feat-particle';
      
      // 랜덤 위치
      particle.style.left = Math.random() * 100 + '%';
      
      // 랜덤 크기
      const size = Math.random() * 6 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // 랜덤 애니메이션 속도
      const duration = Math.random() * 20 + 10;
      particle.style.animationDuration = duration + 's';
      
      // 랜덤 지연
      const delay = Math.random() * duration;
      particle.style.animationDelay = `-${delay}s`;
      
      container.appendChild(particle);
    }
  }
  
  // ─── 스크롤 애니메이션 ───
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 비교 차트의 바 애니메이션
          if (entry.target.classList.contains('gf-feat-compare-chart')) {
            animateChartBars();
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 관찰할 요소들
    const elementsToObserve = [
      '.gf-feat-section-header',
      '.gf-feat-tech-card',
      '.gf-feat-compare-chart',
      '.gf-feat-timeline-item',
      '.gf-feat-cta-content'
    ];
    
    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        observer.observe(element);
      });
    });
  }
  
  // ─── 비교 차트 바 애니메이션 ───
  function animateChartBars() {
    const bars = document.querySelectorAll('.gf-feat-value-bar');
    
    bars.forEach((bar, index) => {
      const width = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.transition = 'width 1s ease';
        bar.style.width = width;
      }, index * 100);
    });
  }
  
  // ─── 스크롤 인디케이터 ───
  function setupScrollIndicator() {
    const indicator = document.querySelector('.gf-feat-scroll-indicator');
    if (!indicator) return;
    
    indicator.addEventListener('click', () => {
      const nextSection = document.querySelector('.gf-feat-detail');
      if (nextSection) {
        const headerHeight = 80;
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
    
    // 스크롤 시 페이드 아웃
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 300);
      indicator.style.opacity = opacity;
      indicator.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    });
  }
  
  // ─── 기술 카드 호버 효과 ───
  function setupTechCardEffects() {
    const cards = document.querySelectorAll('.gf-feat-tech-card');
    
    cards.forEach(card => {
      // 마우스 움직임에 따른 틸트 효과
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      });
      
      // 숫자 카운트업 애니메이션
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSpecValues(card);
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(card);
    });
  }
  
  // ─── 숫자 카운트업 애니메이션 ───
  function animateSpecValues(card) {
    const specValues = card.querySelectorAll('.gf-feat-spec-value');
    
    specValues.forEach(valueElement => {
      const targetText = valueElement.textContent;
      const targetNum = parseFloat(targetText);
      
      // 숫자가 아닌 경우 스킵
      if (isNaN(targetNum) || targetText === '특허' || targetText === '무한') {
        return;
      }
      
      const hasPercent = targetText.includes('%');
      const hasPlus = targetText.includes('+');
      const hasKg = targetText.includes('kg');
      const hasYear = targetText.includes('년');
      const hasMinute = targetText.includes('분');
      const hasStep = targetText.includes('단계');
      const hasLayer = targetText.includes('층');
      
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = targetNum / steps;
      
      let current = 0;
      valueElement.textContent = '0';
      
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
        if (hasMinute) displayText += '분';
        if (hasStep) displayText += '단계';
        if (hasLayer) displayText += '층';
        
        valueElement.textContent = displayText;
      }, stepDuration);
    });
  }
  
  // ─── 타임라인 애니메이션 ───
  function setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.gf-feat-timeline-item');
    
    timelineItems.forEach((item, index) => {
      // 지연된 애니메이션
      item.style.transitionDelay = `${index * 0.1}s`;
      
      // 호버 시 파티클 효과
      item.addEventListener('mouseenter', () => {
        createTimelineParticles(item);
      });
    });
  }
  
  // ─── 타임라인 파티클 효과 ───
  function createTimelineParticles(item) {
    const marker = item.querySelector('.gf-feat-timeline-marker');
    const rect = marker.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.background = '#e63946';
      particle.style.borderRadius = '50%';
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '999';
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const velocity = 30 + Math.random() * 30;
      const lifetime = 600;
      
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
  
  // ─── 모바일 메뉴 처리 ───
  function handleMobileMenu() {
    // 현재 페이지 활성화
    const currentLink = document.querySelector('.gf-header-nav-link[href="#"]');
    if (currentLink) {
      currentLink.classList.add('gf-header-active');
    }
  }
  
  // ─── 패럴랙스 효과 ───
  function setupParallaxEffect() {
    const heroContent = document.querySelector('.gf-feat-hero-content');
    const heroGrid = document.querySelector('.gf-feat-hero-grid');
    
    if (!heroContent || !heroGrid) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      heroContent.style.transform = `translateY(${rate * 0.5}px)`;
      heroGrid.style.transform = `translate(${rate * 0.1}px, ${rate * 0.1}px)`;
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
  
  // ─── 차트 호버 효과 ───
  function setupChartEffects() {
    const chartRows = document.querySelectorAll('.gf-feat-chart-row');
    
    chartRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const bars = row.querySelectorAll('.gf-feat-value-bar');
        bars.forEach(bar => {
          bar.style.filter = 'brightness(1.2)';
        });
      });
      
      row.addEventListener('mouseleave', () => {
        const bars = row.querySelectorAll('.gf-feat-value-bar');
        bars.forEach(bar => {
          bar.style.filter = 'brightness(1)';
        });
      });
    });
  }
  
  // ─── 초기화 함수 ───
  function init() {
    createHeroParticles();
    setupScrollAnimations();
    setupScrollIndicator();
    setupTechCardEffects();
    setupTimelineAnimation();
    handleMobileMenu();
    setupParallaxEffect();
    setupChartEffects();
    
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
  
  // 윈도우 리사이즈 처리
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // 모바일/데스크톱 전환 시 파티클 재생성
      const particlesContainer = document.getElementById('gfFeatHeroParticles');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createHeroParticles();
      }
    }, 250);
  });
  
})();