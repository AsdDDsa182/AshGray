// 문서가 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    
    const intro = document.getElementById('intro');
    const introLogo = document.getElementById('intro-logo').querySelector('img');

    if (!intro || !introLogo) {
        console.error('Intro or intro logo element not found');
        return;
    }

    introLogo.classList.add('fade-in');

    // 인트로 화면 동안 스크롤 막기
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            
            // 메인 콘텐츠가 로드된 후 스크롤 가능하게 설정
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 1000); // fade-out 애니메이션 지속 시간과 동일
    }, 1000); // 로고가 표시되는 시간

    // 네비게이션 관련 요소들 선택
    const navbar = document.querySelector('.navbar');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbarMobile = document.getElementById('navbar-mobile');
    const productMenuLink = document.querySelector('.navbar-right .nav-item.has-submenu > a');
    const subMenu = document.querySelector('.navbar-right .nav-item.has-submenu .sub-menu');

    // 스크롤 시 네비게이션 바 배경색 변경
    window.addEventListener('scroll', function() {
        navbar.style.backgroundColor = (window.scrollY > 0) ? 'var(--navbar-bg-color-scrolled)' : 'var(--navbar-bg-color)';
    });

    // 모바일 서브메뉴 토글 함수
    function toggleMobileSubMenu(event) {
        event.preventDefault();
        const subMenu = this.nextElementSibling;
        if (subMenu && subMenu.classList.contains('sub-menu')) {
            // 서브메뉴가 닫혀있으면 열고, 열려있으면 닫기
            if (subMenu.style.maxHeight) {
                subMenu.style.maxHeight = null;
            } else {
                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            }
            this.classList.toggle('submenu-open');
        }
    }

    // 햄버거 메뉴 토글 함수
    function toggleMobileMenu() {
        const isOpen = navbarMobile.classList.contains('open');
        
        if (isOpen) {
            // 메뉴가 열려있으면 닫기
            navbarMobile.style.animation = 'slideUp 0.5s forwards';
            setTimeout(() => {
                navbarMobile.classList.remove('open');
                document.body.classList.remove('no-scroll');
                navbarMobile.style.transform = '';
                navbarMobile.innerHTML = '';
            }, 500);
        } else {
            // 메뉴가 닫혀있으면 열기
            navbarMobile.classList.add('open');
            document.body.classList.add('no-scroll');
            navbarMobile.style.animation = 'slideDown 0.5s forwards';
            // 모바일 메뉴 내용 채우기
            const navbarLeft = document.querySelector('.navbar-left');
            const navbarRight = document.querySelector('.navbar-right');
            navbarMobile.innerHTML = navbarLeft.innerHTML + navbarRight.innerHTML;

            // 모바일 메뉴 아이템에 이벤트 리스너 추가
            const mobileMenuItems = navbarMobile.querySelectorAll('.nav-item.has-submenu > a');
            mobileMenuItems.forEach(item => item.addEventListener('click', toggleMobileSubMenu));

            // 모든 서브메뉴 숨기기
            const allSubMenus = navbarMobile.querySelectorAll('.sub-menu');
            allSubMenus.forEach(subMenu => subMenu.style.maxHeight = null);

            // 바닥 막대 추가
            addBottomBars();
        }

        hamburgerMenu.classList.toggle('open');
    }

    // 바닥 막대 추가 함수
    function addBottomBars() {
        const bottomBarContainer = document.createElement('div');
        bottomBarContainer.classList.add('bottom-bar-container');
        
        const bottomBar1 = document.createElement('div');
        bottomBar1.classList.add('bottom-bar');
        bottomBarContainer.appendChild(bottomBar1);

        const bottomBar2 = document.createElement('div');
        bottomBar2.classList.add('bottom-bar');
        bottomBarContainer.appendChild(bottomBar2);
        
        navbarMobile.appendChild(bottomBarContainer);
    }

    // 햄버거 메뉴 클릭 이벤트
    hamburgerMenu.addEventListener('click', toggleMobileMenu);

    // PC 버전 서브메뉴 처리
    if (productMenuLink && subMenu) {
        productMenuLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // 모바일 버전에서는 서브메뉴 토글
                e.preventDefault();
                subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
            }
            // PC 버전에서는 기본 링크 동작 (products.html로 이동)
        });

        // PC 버전 서브메뉴 마우스 오버/아웃 처리
        productMenuLink.parentElement.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                subMenu.style.display = 'block';
            }
        });

        productMenuLink.parentElement.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                subMenu.style.display = 'none';
            }
        });
    }

    // 창 크기 변경 시 모바일 메뉴 초기화
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            navbarMobile.classList.remove('open');
            hamburgerMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            navbarMobile.style.animation = 'none';
            navbarMobile.innerHTML = '';
            
            document.querySelectorAll('.sub-menu').forEach(subMenu => subMenu.style.display = '');
        }
    });

    // 모바일 메뉴 터치 이벤트 처리
    let startY = 0;
    let moveY = 0;

    navbarMobile.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        moveY = startY;
    });

    navbarMobile.addEventListener('touchmove', function(e) {
        if (navbarMobile.classList.contains('open')) {
            moveY = e.touches[0].clientY;
            const translateY = moveY - startY;
            if (translateY < 0) {
                navbarMobile.style.transform = `translateY(${translateY}px)`;
            }
        }
    });

    navbarMobile.addEventListener('touchend', function(e) {
        if (navbarMobile.classList.contains('open')) {
            const touchDistance = startY - moveY;
            if (touchDistance > window.innerHeight * 0.6) {
                toggleMobileMenu();
            } else {
                navbarMobile.style.transform = '';
            }
        }
    });

    // Vimeo 플레이어 초기화
    const iframe = document.querySelector('#vimeo-player');
    if (iframe) {
        const player = new Vimeo.Player(iframe);
        player.setVolume(0);

        player.on('play', function() {
            console.log('동영상이 재생되었습니다');
        });

        player.on('ended', function() {
            player.play();
        });
    }
    
    
    
    
    
    
    const logosTrack = document.querySelector('.logos-track');

    // 로고 복제 함수
    function cloneLogos() {
        const logos = logosTrack.querySelectorAll('img');
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            logosTrack.appendChild(clone);
        });
    }

    // 로고 트랙 너비 조정 함수
    function adjustTrackWidth() {
        const logos = logosTrack.querySelectorAll('img');
        const totalWidth = Array.from(logos).reduce((width, logo) => width + logo.offsetWidth + parseInt(getComputedStyle(logo).marginLeft) + parseInt(getComputedStyle(logo).marginRight), 0);
        logosTrack.style.width = `${totalWidth / 2}px`;
    }

    // 초기화
    cloneLogos();
    adjustTrackWidth();

    // 윈도우 리사이즈 시 트랙 너비 재조정
    window.addEventListener('resize', adjustTrackWidth);

    
    
    
    
    
    
// 스크롤 애니메이션 섹션
// 캔버스 요소를 가져옵니다.
const canvas = document.getElementById("hero-lightpass");
// 캔버스의 2D 렌더링 컨텍스트를 가져옵니다.
const context = canvas.getContext("2d");

// 총 프레임 수를 설정합니다.
const frameCount = 214;
// 현재 프레임에 해당하는 이미지 URL을 생성하는 함수입니다.
const currentFrame = index => (
    `https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/spatial-audio/medium/${index.toString().padStart(4, '0')}.jpg`
);

// 캔버스 크기를 컨테이너에 맞게 설정하는 함수
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// 이미지를 캔버스에 맞게 그리는 함수 (밝기 조절 추가)
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY, brightness) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx, cy, cw, ch, ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);
    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);

    // 밝기 조절
    if (brightness !== undefined) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`;
        ctx.fillRect(x, y, w, h);
        ctx.globalCompositeOperation = 'source-over';
    }
}

// 모든 프레임 이미지를 미리 로드하는 함수입니다.
const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
    }
};

// 첫 번째 프레임 이미지를 로드합니다.
const img = new Image();
img.src = currentFrame(1);
img.onload = function() {
    resizeCanvas();
    drawImageProp(context, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5, 0.2); // 시작 시 20% 밝기
};

// 특정 인덱스의 이미지로 캔버스를 업데이트하는 함수입니다.
const updateImage = (index, brightness, scale = 1) => {
    img.src = currentFrame(index);
    img.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawImageProp(context, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5, brightness);
    };
};

// 모든 섹션을 선택합니다 (일반 섹션 + 특별 섹션)
const allSections = document.querySelectorAll('#scroll-animation-section .scroll-content');

// 각 섹션의 시작 지점을 정의합니다 (0부터 1 사이의 값)
const sectionStartPoints = [0, 0.25, 0.5, 0.75];

// easing 함수
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// 스크롤 이벤트 리스너를 추가합니다.
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const scrollAnimationSection = document.getElementById('scroll-animation-section');
    const sectionTop = scrollAnimationSection.offsetTop;
    const scrollPosition = scrollTop - sectionTop;
    const sectionHeight = scrollAnimationSection.offsetHeight;
    // 스크롤 양을 줄이기 위해 분모를 줄입니다.
    const scrollFraction = Math.max(0, Math.min(1, scrollPosition / (sectionHeight / 1.3))); //값을 내리면 이미지가 더 빨리 진행됨

    // 스크롤 인디케이터 제어
    const scrollIndicator = document.querySelector('.scroll-indicator1');
    if (scrollIndicator) {
        if (scrollFraction > 0.01) {
            scrollIndicator.classList.add('hide');
        } else {
            scrollIndicator.classList.remove('hide');
        }
    }

    // 이미지 프레임 업데이트
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
    
    // 이미지 밝기 조절
    let brightness;
    if (scrollFraction < 0.1) {
        // 시작 부분: 20%에서 100%로 밝아짐
        brightness = 0.2 + (scrollFraction / 0.2) * 0.8;
    } else if (scrollFraction > 0.75) {
        // 끝 부분: 100%에서 20%로 어두워짐
        const endProgress = (scrollFraction - 0.75) / 0.25;
        brightness = 1 - (endProgress * 0.8);
    } else {
        // 중간 부분: 100% 밝기 유지
        brightness = 1;
    }
    
    // 스크롤 시작과 끝부분에서 캔버스 크기 축소 효과 및 동그라미 표시
    const circleContainer = document.querySelector('.scroll-section-circle-container');
    let scale = 1;
    let borderRadius = 0;
    let shadowOpacity = 0;

    if (circleContainer) {
        if (scrollFraction <= 0.1) {
            // 시작 부분 애니메이션
            const startProgress = scrollFraction / 0.1;
            const startOpacity = easeInOutQuad(startProgress);
            scale = 0.9 + startProgress * 0.1; // 0.9에서 1로 커짐
            borderRadius = 20 * (1 - startProgress); // 20px에서 0px로 줄어듦
            shadowOpacity = 0.6 * (1 - startProgress); // 0.6에서 0으로 줄어듦
        } else if (scrollFraction > 0.9) {
            // 끝 부분 애니메이션 (기존 코드)
            const endProgress = (scrollFraction - 0.9) / 0.1;
            const endOpacity = easeInOutQuad(endProgress);
            scale = 1 - endOpacity * 0.1; // 1에서 0.9로 작아짐
            borderRadius = 20 * endOpacity; // 0px에서 20px로 늘어남
            shadowOpacity = 0.6 * endOpacity; // 0에서 0.6으로 늘어남
        }

        // 스타일 적용
        circleContainer.style.opacity = Math.min(shadowOpacity * 1.5, 0.8);
        canvas.style.transform = `scale(${scale})`;
        canvas.style.borderRadius = `${borderRadius}px`;
        canvas.style.boxShadow = `0 0 0 3px rgba(0, 247, 255, ${shadowOpacity})`;

        const circleScale = 1 + Math.abs(1 - scale) * 2;
        circleContainer.style.transform = `scale(${circleScale})`;
    }
    
    requestAnimationFrame(() => updateImage(frameIndex + 1, brightness, scale));

    // 모든 섹션에 대해 동일한 로직 적용
    allSections.forEach((section, index) => {
        const totalSections = allSections.length;
        const startFraction = sectionStartPoints[index];
        const endFraction = index < sectionStartPoints.length - 1 ? sectionStartPoints[index + 1] : 1;
        const sectionProgress = (scrollFraction - startFraction) / (endFraction - startFraction);
        
        let opacity, translateY, scale;
        
        // 각 섹션을 100개의 단계로 나눕니다.
        const steps = 100;
        const currentStep = Math.floor(sectionProgress * steps);
        
        if (index === totalSections - 1) {
            // 특별 섹션 (마지막 섹션)에 대한 애니메이션
            opacity = Math.min(1, currentStep / steps);
            // 살짝 확대되는 효과
            scale = 0.95 + (currentStep / steps) * 0.2;
            translateY = 0; // 위아래로 움직이지 않음
        } else {
            // 일반 섹션에 대한 애니메이션 (기존 로직 유지)
            const fadeInEnd = 30;
            const fadeOutStart = 70;

            if (currentStep < fadeInEnd) {
                // 페이드 인
                opacity = currentStep / fadeInEnd;
                translateY = 30 * (1 - (currentStep / fadeInEnd));
            } else if (currentStep >= fadeOutStart) {
                // 페이드 아웃
                const fadeOutProgress = (currentStep - fadeOutStart) / (steps - fadeOutStart);
                opacity = 1 - fadeOutProgress;
                translateY = -30 * fadeOutProgress;
            } else {
                // 완전히 보이는 상태
                opacity = 1;
                translateY = 0;
            }
            scale = 1; // 일반 섹션은 크기 변화 없음
        }
        
        // 소수점 둘째자리까지 사용하여 변화 표현
        section.style.opacity = opacity.toFixed(2);
        if (index === totalSections - 1) {
            // 특별 섹션은 scale 적용
            section.style.transform = `scale(${scale.toFixed(2)})`;
        } else {
            // 일반 섹션은 translateY 적용
            section.style.transform = `translateY(${translateY.toFixed(2)}px)`;
        }
    });
});

// 윈도우 리사이즈 이벤트 리스너
window.addEventListener('resize', () => {
    resizeCanvas();
    drawImageProp(context, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5, 0.2); // 리사이즈 시에도 20% 밝기 유지
});

// 초기 설정
resizeCanvas();
preloadImages();
    

    




    // About Us 섹션 애니메이션
    function handleAboutUsAnimation() {
        const aboutSection = document.querySelector('#about-us');
        if (aboutSection) {
            const backgroundImage = aboutSection.querySelector('.background-image');
            const textContent = aboutSection.querySelector('.text-content');
            const imageContent = aboutSection.querySelector('.image-content');
            
            // Intersection Observer 설정
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 배경 이미지 나타나기
                        backgroundImage.classList.add('visible');
                        
                        // 텍스트와 이미지 콘텐츠 애니메이션
                        textContent.classList.add('animate');
                        imageContent.classList.add('animate');
                        
                        // 한 번 애니메이션이 실행된 후 관찰 중지
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 }); // 10% 이상 보일 때 실행

            // About Us 섹션 관찰 시작
            observer.observe(aboutSection);
        }
    }

    // 페이지 로드 시 About Us 애니메이션 함수 실행
    handleAboutUsAnimation();

    // 슬라이드쇼 기능
    const slideWrapper = document.querySelector('.slide-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const progressBar = document.querySelector('.progress-bar .progress');
    const dotsContainer = document.querySelector('.dots-container');
    let currentSlide = 0;
    let slideInterval;
    let progressBarAnimation;

    // 닷 네비게이션 생성
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        slideWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        resetProgressBar();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function resetProgressBar() {
        if (progressBarAnimation) {
            progressBarAnimation.cancel();
        }
        progressBar.style.width = '0%';
        progressBarAnimation = progressBar.animate(
            [
                { width: '0%' },
                { width: '100%' }
            ],
            {
                duration: 4000,
                easing: 'linear',
                fill: 'forwards'
            }
        );
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideShow() {
        stopSlideShow();
        resetProgressBar();
        slideInterval = setInterval(nextSlide, 4000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
        if (progressBarAnimation) {
            progressBarAnimation.pause();
        }
    }

    prevButton.addEventListener('click', () => {
        prevSlide();
        startSlideShow();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        startSlideShow();
    });

    // 터치 스와이프 기능
    let touchStartX = 0;
    let touchEndX = 0;

    slideWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopSlideShow();
    });

    slideWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        }
        if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
        startSlideShow();
    }

    // 윈도우 리사이즈 대응
    function handleResize() {
        goToSlide(currentSlide);
        startSlideShow(); // 리사이즈 후 슬라이드쇼 재시작
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250); // 리사이즈 이벤트 디바운싱
    });

    // 초기 슬라이드 설정 및 자동 재생 시작
    updateDots();
    startSlideShow();


































    // // GSAP 및 ScrollTrigger 초기화
    // gsap.registerPlugin(ScrollTrigger);

    // // 타임라인 아이템 애니메이션
    // const timelineItems = gsap.utils.toArray('.timeline-item');
    // timelineItems.forEach((item, index) => {
    //     // 초기 상태 설정
    //     gsap.set(item, { opacity: 0, y: 50 });
        
    //     // 스크롤 트리거 애니메이션
    //     gsap.to(item, {
    //         opacity: 1,
    //         y: 0,
    //         duration: 1,
    //         scrollTrigger: {
    //             trigger: item,
    //             start: "top 80%",
    //             end: "top 20%",
    //             scrub: 1,
    //             toggleActions: "play none none reverse"
    //         }
    //     });
    // });

    // // 타임라인 중심선 애니메이션
    // const timelineLine = document.querySelector('.timeline-line');
    // gsap.set(timelineLine, { scaleY: 0 });

    // gsap.to(timelineLine, {
    //     scaleY: 1,
    //     transformOrigin: "top center",
    //     ease: "none",
    //     scrollTrigger: {
    //         trigger: "#timeline",
    //         start: "top 20%",
    //         end: "bottom center",
    //         scrub: 1
    //     }
    // });

    // // 타임라인 동그라미 애니메이션
    // timelineItems.forEach((item) => {
    //     const circle = item.querySelector('.timeline-circle');
    //     gsap.set(circle, { scale: 0 });
        
    //     gsap.to(circle, {
    //         scale: 1,
    //         duration: 1,
    //         scrollTrigger: {
    //             trigger: item,
    //             start: "top center",
    //             toggleActions: "play none none reverse"
    //         }
    //     });
    // });
    
    
    








// GSAP 및 ScrollTrigger 초기화
gsap.registerPlugin(ScrollTrigger);

// Three.js를 사용한 3D 배경 애니메이션
let scene, camera, renderer, particles;

// 3D 장면 초기화 함수
function initTimelineBackground() {
    // 캔버스 요소 생성
    const canvas = document.createElement('canvas');
    canvas.id = 'timeline-background';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    
    const timelineSection = document.querySelector('#timeline');
    timelineSection.style.position = 'relative';
    timelineSection.prepend(canvas);

    // 그라데이션 오버레이 요소 생성
    const gradientOverlay = document.createElement('div');
    gradientOverlay.style.position = 'absolute';
    gradientOverlay.style.top = '0';
    gradientOverlay.style.left = '0';
    gradientOverlay.style.width = '100%';
    gradientOverlay.style.height = '100%';
    gradientOverlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,1) 100%)';
    gradientOverlay.style.pointerEvents = 'none';
    gradientOverlay.style.zIndex = '0';
    timelineSection.prepend(gradientOverlay);

    // Three.js 장면 설정
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, timelineSection.clientWidth / timelineSection.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(timelineSection.clientWidth, timelineSection.clientHeight);

    // 파티클 텍스처 생성
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('https://assets.codepen.io/3685267/spark1.png');

    // 파티클 시스템 생성
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 5,
        sizeAttenuation: true,
        map: particleTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 1000;

    // 애니메이션 함수
    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
        renderer.render(scene, camera);
    }

    animate();

    // 윈도우 리사이즈 대응
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = timelineSection.clientWidth / timelineSection.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(timelineSection.clientWidth, timelineSection.clientHeight);
    }
}

// 3D 배경 초기화
initTimelineBackground();

// 타임라인 아이템 애니메이션
const timelineItems = gsap.utils.toArray('.timeline-item');
timelineItems.forEach((item, index) => {
    // 초기 상태 설정
    gsap.set(item, { opacity: 0, y: 50 });
    
    // 스크롤 트리거 애니메이션
    gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
            toggleActions: "play none none reverse"
        }
    });
});

// 타임라인 중심선 애니메이션
const timelineLine = document.querySelector('.timeline-line');
gsap.set(timelineLine, { scaleY: 0 });

gsap.to(timelineLine, {
    scaleY: 1,
    transformOrigin: "top center",
    ease: "none",
    scrollTrigger: {
        trigger: "#timeline",
        start: "top 20%",
        end: "bottom center",
        scrub: 1
    }
});

// 타임라인 동그라미 애니메이션
timelineItems.forEach((item) => {
    const circle = item.querySelector('.timeline-circle');
    gsap.set(circle, { scale: 0 });
    
    gsap.to(circle, {
        scale: 1,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top center",
            toggleActions: "play none none reverse"
        }
    });
});

// 3D 배경 스크롤 효과
gsap.to(particles.rotation, {
    x: Math.PI * 2,
    y: Math.PI * 2,
    ease: "none",
    scrollTrigger: {
        trigger: "#timeline",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});
    



// Our Services 섹션 애니메이션
function handleServicesAnimation() {
    const servicesSection = document.querySelector('#our-services');
    if (servicesSection) {
        const servicesTitle = servicesSection.querySelector('h2');
        const serviceBoxes = servicesSection.querySelectorAll('.service-box');
        
        // 타이틀 및 서비스 박스 애니메이션을 위한 옵저버
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 섹션 타이틀 애니메이션 적용
                    servicesTitle.classList.add('animate');

                    // 서비스 박스 순차 애니메이션 적용
                    animateServiceBoxes(serviceBoxes);

                    // 한 번 애니메이션이 적용된 후에는 더 이상 관찰하지 않음
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(servicesSection);
    }
}

// 모든 서비스 박스 순차 애니메이션 함수
function animateServiceBoxes(boxes) {
    boxes.forEach((box, index) => {
        // 지연 시간 설정 (0.2초 간격으로 나타나도록)
        const delay = index * 100;
        
        // 애니메이션 적용
        setTimeout(() => {
            box.style.transition = 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
            box.classList.add('animate');
            
            // 0.5초 후 hover-ready 클래스 추가
            setTimeout(() => {
                box.classList.add('hover-ready');
            }, 500);
        }, delay);
    });
}

// 초기 상태 설정 (애니메이션 시작 전)
document.querySelectorAll('.service-box').forEach(box => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(400px)';
});

// 페이지 로드 시 애니메이션 함수 실행
window.addEventListener('load', handleServicesAnimation);

// 서비스 박스 클릭 이벤트 (기존 코드 유지)
document.querySelectorAll('.service-box').forEach(box => {
    const btnDetails = box.querySelector('.btn-details');
    const btnClose = box.querySelector('.btn-close');

    btnDetails.addEventListener('click', () => {
        // 다른 모든 서비스 박스를 원래 상태로 되돌림
        document.querySelectorAll('.service-box').forEach(otherBox => {
            if (otherBox !== box) {
                otherBox.classList.remove('flipped', 'expanded');
            }
        });

        box.classList.add('flipped', 'expanded');
    });

    btnClose.addEventListener('click', () => {
        box.classList.remove('flipped', 'expanded');
    });
});




// Best Services 섹션
// 캔버스 요소를 가져옵니다.
const bestServicesCanvas = document.getElementById("best-services-canvas");
// 캔버스의 2D 렌더링 컨텍스트를 가져옵니다.
const bestServicesContext = bestServicesCanvas.getContext("2d");

// 총 프레임 수를 설정합니다.
const totalFrames = 199;
// 현재 프레임에 해당하는 이미지 URL을 생성하는 함수입니다.
const generateFrameUrl = index => (
    `https://www.apple.com/105/media/us/apple-vision-pro/2024/6e1432b2-fe09-4113-a1af-f20987bcfeee/anim/360/small/${index.toString().padStart(4, '0')}.jpg`
);

// 캔버스 크기를 컨테이너에 맞게 설정하는 함수
function adjustCanvasSize() {
    const containerElement = document.getElementById('canvas-container');
    bestServicesCanvas.width = containerElement.clientWidth;
    bestServicesCanvas.height = containerElement.clientHeight;
}

// 이미지를 캔버스에 맞게 그리는 함수 (밝기 조절 추가)
function renderImageWithProps(ctx, img, x, y, w, h, offsetX = 0.5, offsetY = 0.5, brightness = 1) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var imageWidth = img.width,
        imageHeight = img.height,
        scaleRatio = Math.min(w / imageWidth, h / imageHeight),
        newWidth = imageWidth * scaleRatio,
        newHeight = imageHeight * scaleRatio,
        cropX, cropY, cropWidth, cropHeight, aspectRatio = 1;

    if (newWidth < w) aspectRatio = w / newWidth;
    if (Math.abs(aspectRatio - 1) < 1e-14 && newHeight < h) aspectRatio = h / newHeight;
    newWidth *= aspectRatio;
    newHeight *= aspectRatio;

    cropWidth = imageWidth / (newWidth / w);
    cropHeight = imageHeight / (newHeight / h);
    cropX = (imageWidth - cropWidth) * offsetX;
    cropY = (imageHeight - cropHeight) * offsetY;

    if (cropX < 0) cropX = 0;
    if (cropY < 0) cropY = 0;
    if (cropWidth > imageWidth) cropWidth = imageWidth;
    if (cropHeight > imageHeight) cropHeight = imageHeight;

    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, w, h);

    // 밝기 조절
    if (brightness !== undefined) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`;
        ctx.fillRect(x, y, w, h);
        ctx.globalCompositeOperation = 'source-over';
    }
}

// 모든 프레임 이미지를 미리 로드하는 함수입니다.
const preloadFrameImages = () => {
    for (let i = 1; i < totalFrames; i++) {
        const img = new Image();
        img.src = generateFrameUrl(i);
    }
};

// 첫 번째 프레임 이미지를 로드합니다.
const firstFrameImage = new Image();
firstFrameImage.src = generateFrameUrl(1);
firstFrameImage.onload = function() {
    adjustCanvasSize();
    renderImageWithProps(bestServicesContext, firstFrameImage, 0, 0, bestServicesCanvas.width, bestServicesCanvas.height, 0.5, 0.5, 0.2); // 시작 시 20% 밝기
};

// 특정 인덱스의 이미지로 캔버스를 업데이트하는 함수입니다.
const updateFrameImage = (index, brightness) => {
    firstFrameImage.src = generateFrameUrl(index);
    firstFrameImage.onload = function() {
        bestServicesContext.clearRect(0, 0, bestServicesCanvas.width, bestServicesCanvas.height);
        renderImageWithProps(bestServicesContext, firstFrameImage, 0, 0, bestServicesCanvas.width, bestServicesCanvas.height, 0.5, 0.5, brightness);
    };
};

// Best Services 섹션의 텍스트 애니메이션 대상 요소를 선택합니다.
const scrollSections = document.querySelectorAll('#best-services .scroll-content');

// 텍스트 애니메이션의 시작 지점을 정의합니다 (0부터 1 사이의 값)
const sectionStartPositions = [0.75];

// 스크롤 이벤트 리스너를 추가합니다.
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const animationSection = document.getElementById('best-services');
    const sectionTopOffset = animationSection.offsetTop;
    const scrollAmount = scrollY - sectionTopOffset;
    const sectionHeight = animationSection.offsetHeight;
    // 스크롤 양을 줄이기 위해 분모를 줄입니다.
    const scrollFraction = Math.max(0, Math.min(1, scrollAmount / (sectionHeight / 1.3))); // 값이 작아지면 이미지가 더 빨리 진행됨

    // 이미지 프레임 업데이트
    const frameIndex = Math.min(totalFrames - 1, Math.floor(scrollFraction * totalFrames));
    
    // 이미지 밝기 조절
    let currentBrightness;
    if (scrollFraction < 0.1) {
        // 시작 부분: 20%에서 100%로 밝아짐
        currentBrightness = 0.2 + (scrollFraction / 0.2) * 0.8;
    } else if (scrollFraction > 0.75) {
        // 끝 부분: 100%에서 20%로 어두워짐
        const endProgress = (scrollFraction - 0.75) / 0.25;
        currentBrightness = 1 - (endProgress * 0.8);
    } else {
        // 중간 부분: 100% 밝기 유지
        currentBrightness = 1;
    }

    // Best Services 섹션 텍스트 애니메이션
    scrollSections.forEach((section, index) => {
        const startFraction = sectionStartPositions[index];
        const endFraction = index < sectionStartPositions.length - 1 ? sectionStartPositions[index + 1] : 1;
        
        const sectionProgress = (scrollFraction - startFraction) / (endFraction - startFraction);
        
        let opacity, translateY;
        
        // 각 섹션을 100개의 단계로 나눕니다.
        const stepCount = 100;
        const currentStep = Math.floor(sectionProgress * stepCount);
        
        const fadeInEnd = 30;

        if (currentStep < fadeInEnd) {
            // 페이드 인
            opacity = currentStep / fadeInEnd;
            translateY = 30 * (1 - (currentStep / fadeInEnd));
        } else {
            // 완전히 보이는 상태
            opacity = 1;
            translateY = 0;
        }

        // 소수점 둘째자리까지 사용하여 변화 표현
        section.style.opacity = opacity.toFixed(2);
        section.style.transform = `translateY(${translateY.toFixed(2)}px)`;
    });

    // 이미지 프레임 업데이트
    requestAnimationFrame(() => updateFrameImage(frameIndex + 1, currentBrightness));
});

// 윈도우 리사이즈 이벤트 리스너
window.addEventListener('resize', () => {
    adjustCanvasSize();
    renderImageWithProps(bestServicesContext, firstFrameImage, 0, 0, bestServicesCanvas.width, bestServicesCanvas.height, 0.5, 0.5, 0.2); // 리사이즈 시에도 20% 밝기 유지
});

// 초기 설정
adjustCanvasSize();
preloadFrameImages();








// // Best Services 섹션
// const bestServicesSection = document.getElementById('best-services');
// const imageContainer = document.getElementById('image-container');
// const scrollContent = document.getElementById('best-services-content');
// const scrollIndicator2 = document.querySelector('.scroll-indicator2');

// const imageSources = [
//     'https://picsum.photos/id/1018/1600/800',
//     'https://picsum.photos/id/1015/1600/800',
//     'https://picsum.photos/id/1019/1600/800',
//     'https://picsum.photos/id/1021/1600/800',
//     'https://picsum.photos/id/1023/1600/800',
//     'https://picsum.photos/id/1024/1600/800',
//     'https://picsum.photos/id/1025/1600/800',
//     'https://picsum.photos/id/1026/1600/800',
//     'https://picsum.photos/id/1027/1600/800',
//     'https://picsum.photos/id/1028/1600/800'
// ];

// function createImageSet(index) {
//     const baseUrl = imageSources[index];
//     return {
//         src: baseUrl,
//         srcset: `${baseUrl} 1600w, 
//                  ${baseUrl.replace('1600/800', '1024/512')} 1024w, 
//                  ${baseUrl.replace('1600/800', '640/320')} 640w`,
//     };
// }

// const imageInfos = {
//     pc: imageSources.map((_, i) => ({
//         ...createImageSet(i),
//         x: '50%',
//         y: '10%',
//         scale: 1
//     })),
//     tablet: imageSources.map((_, i) => ({
//         ...createImageSet(i),
//         x: '50%',
//         y: '10%',
//         scale: 0.8
//     })),
//     mobile: imageSources.map((_, i) => ({
//         ...createImageSet(i),
//         x: '50%',
//         y: '10%',
//         scale: 0.6
//     }))
// };

// function getDeviceType() {
//     const width = window.innerWidth;
//     if (width >= 1024) return 'pc';
//     if (width >= 768) return 'tablet';
//     return 'mobile';
// }

// const preloadAndPositionImages = () => {
//     const deviceType = getDeviceType();
//     imageContainer.innerHTML = '';
//     imageInfos[deviceType].forEach((info, index) => {
//         const img = new Image();
//         img.src = info.src;
//         img.style.opacity = '0';
//         img.style.transform = `translate(-50%, 100%) scale(${info.scale})`;
//         img.style.left = info.x;
//         img.style.top = info.y;
//         img.style.boxShadow = '0 60px 60px rgba(0,0,0,0.20), 0 20px 20px rgba(0,0,0,0.80)';
//         img.style.borderRadius = '10px';
//         img.style.position = 'absolute';
//         img.style.filter = 'brightness(1)';
//         imageContainer.appendChild(img);
//     });
// };

// window.addEventListener('scroll', () => {
//     const scrollY = window.pageYOffset;
//     const sectionTop = bestServicesSection.offsetTop;
//     const scrollAmount = scrollY - sectionTop;
//     const sectionHeight = bestServicesSection.offsetHeight;
//     const scrollFraction = Math.max(0, Math.min(1, scrollAmount / (sectionHeight - window.innerHeight)));

//     const images = imageContainer.querySelectorAll('img');
//     const deviceType = getDeviceType();
//     const totalImages = images.length;

//     // 전체 애니메이션 구간을 0.8로 설정
//     const totalAnimationRange = 0.8;
//     // 각 이미지에 할당될 스크롤 범위
//     const rangePerImage = totalAnimationRange / totalImages;
//     // 텍스트 시작 지점을 0.9로 설정 (이미지와 텍스트 사이 간격 증가)
//     const textStart = 0.9;

//     images.forEach((img, index) => {
//         let opacity, yOffset, brightness;
        
//         const imageStart = index * rangePerImage;
//         const imageEnd = imageStart + (rangePerImage * 0.6); // 페이드인 구간을 60%로 조정
//         const imagePause = imageStart + rangePerImage; // 각 이미지의 전체 구간

//         if (scrollFraction <= totalAnimationRange) {
//             if (scrollFraction < imageStart) {
//                 // 이미지가 아직 나타나지 않음
//                 opacity = 0;
//                 yOffset = 100;
//             } else if (scrollFraction < imageEnd) {
//                 // 이미지 페이드 인
//                 const imageProgress = (scrollFraction - imageStart) / (imageEnd - imageStart);
//                 opacity = imageProgress;
//                 yOffset = (1 - imageProgress) * 100;
//             } else if (scrollFraction < imagePause) {
//                 // 이미지가 완전히 나타나고 잠시 멈춤
//                 opacity = 1;
//                 yOffset = 0;
//             } else {
//                 // 다음 이미지로 넘어갈 준비
//                 opacity = 1;
//                 yOffset = 0;
//             }
//             brightness = 1; // 이미지 나타나는 동안 밝기 유지
//         } else {
//             // 모든 이미지 표시 및 어둡게 만들기
//             opacity = 1;
//             yOffset = 0;
//             brightness = Math.max(0.2, 1 - (scrollFraction - totalAnimationRange) * 4);
//         }

//         img.style.opacity = opacity.toFixed(2);
//         img.style.transform = `translate(-50%, ${yOffset}%) scale(${imageInfos[deviceType][index].scale})`;
//         img.style.filter = `brightness(${brightness.toFixed(2)})`;
//     });

//     // 텍스트 콘텐츠 애니메이션
//     if (scrollFraction > textStart) {
//         const textOpacity = Math.min(1, (scrollFraction - textStart) * 10);
//         scrollContent.style.opacity = textOpacity.toFixed(2);
//     } else {
//         scrollContent.style.opacity = '0';
//     }

//     // 스크롤 인디케이터2 제어
//     if (scrollIndicator2) {
//         if (scrollFraction >= 0.05) {
//             scrollIndicator2.classList.add('hide');
//         } else {
//             scrollIndicator2.classList.remove('hide');
//         }
//     }
// });

// // 윈도우 리사이즈 이벤트 리스너
// window.addEventListener('resize', preloadAndPositionImages);

// // 초기 설정
// preloadAndPositionImages();









    // Counting Content 코드
    function handleCountingContentAnimation() {
        // counting-content 섹션을 선택합니다.
        const section = document.querySelector('#counting-content');
        if (section) {
            // 카운팅 아이템들을 선택합니다.
            const countingItems = section.querySelectorAll('.counting-item');

            // IntersectionObserver를 생성합니다. 이는 요소가 뷰포트에 들어왔는지 감지합니다.
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    // 요소가 뷰포트에 40% 이상 들어왔을 때
                    if (entry.isIntersecting) {
                        // 카운팅 아이템 애니메이션을 시작합니다.
                        animateCountingItems(countingItems);
                        // 한 번 애니메이션이 적용된 요소는 더 이상 관찰하지 않습니다.
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 }); // 요소의 40%가 뷰포트에 들어왔을 때 콜백을 실행합니다.

            // 섹션을 관찰 대상으로 등록합니다.
            observer.observe(section);

            // 호버 효과 추가
            countingItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-5px) scale(1.05)';
                    item.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = '';
                    item.style.boxShadow = '';
                });
            });
        }
    }

    // 카운팅 아이템들에 애니메이션을 적용하는 함수
    function animateCountingItems(items) {
        items.forEach((item, index) => {
            // 각 아이템마다 0.2초 간격으로 애니메이션을 시작합니다.
            setTimeout(() => {
                item.classList.add('animate');
                startCounting(item);
            }, 200 * index);
        });
    }

    // 카운팅 애니메이션을 시작하는 함수
    function startCounting(item) {
        const countElement = item.querySelector('.count');
        const targetNumber = parseInt(countElement.getAttribute('data-target'));
        const duration = 2000; // 2초 동안 애니메이션
        let startTimestamp = null;

        function animateCount(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentNumber = Math.floor(progress * targetNumber);

            countElement.textContent = `+${currentNumber.toLocaleString()}`;

            // 빠르게 위아래로 흔들리는 효과
            if (progress < 0.95) {
                const shakeY = (Math.random() - 0.5) * 15; // 흔들림 강도 조절
                countElement.style.transform = `translateY(${shakeY}px)`;
                countElement.style.transition = 'transform 0.05s'; // 빠른 전환 효과
            } else {
                // 마지막 5%에서 안정화
                countElement.style.transform = 'translateY(0)';
                countElement.style.transition = 'transform 0.2s';
            }

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            } else {
                countElement.style.transform = 'none';
                item.classList.add('counting-complete');
                countElement.classList.add('completion-effect');
                addCompletionCheck(item);
                
                // 완료 효과 후 클래스 제거
                setTimeout(() => {
                    countElement.classList.remove('completion-effect');
                }, 1500); // 애니메이션 지속 시간
            }
        }

        requestAnimationFrame(animateCount);
    }

    // 카운팅 완료 후 체크 표시를 추가하는 함수
    function addCompletionCheck(item) {
        const checkMark = document.createElement('div');
        checkMark.className = 'completion-check';
        checkMark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
        item.appendChild(checkMark);

        setTimeout(() => {
            checkMark.style.opacity = '1';
            checkMark.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }

    // 페이지 로드 시 애니메이션 함수 실행
    handleCountingContentAnimation();


    
    

    
    
    
    // Results 섹션 애니메이션 처리 함수
    function handleResultsAnimation() {
        // results 섹션을 선택합니다.
        const section = document.querySelector('#results');
        if (section) {
            // 섹션 내의 제목과 프로젝트 카테고리들을 선택합니다.
            const sectionTitle = section.querySelector('h2');
            const projectCategories = section.querySelectorAll('.projects-category');
    
            // IntersectionObserver를 생성합니다. 이는 요소가 뷰포트에 들어왔는지 감지합니다.
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    // 요소가 뷰포트에 20% 이상 들어왔을 때
                    if (entry.isIntersecting) {
                        if (entry.target === sectionTitle) {
                            // 섹션 제목에 애니메이션을 적용합니다.
                            entry.target.classList.add('animate');
                        } else if (entry.target.classList.contains('projects-category')) {
                            // 프로젝트 카테고리에 애니메이션을 적용합니다.
                            animateCategory(entry.target);
                        }
                        // 한 번 애니메이션이 적용된 요소는 더 이상 관찰하지 않습니다.
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 }); // 요소의 20%가 뷰포트에 들어왔을 때 콜백을 실행합니다.
    
            // 섹션 제목과 프로젝트 카테고리들을 관찰 대상으로 등록합니다.
            observer.observe(sectionTitle);
            projectCategories.forEach(category => observer.observe(category));
        }
    }
    
    // 프로젝트 카테고리에 애니메이션을 적용하는 함수
    function animateCategory(category) {
        const categoryHeader = category.querySelector('.category-header');
        const projectBoxes = category.querySelectorAll('.project-box');
    
        // 카테고리 헤더에 애니메이션을 적용합니다.
        categoryHeader.classList.add('animate');
    
        // 각 프로젝트 박스에 0.2초 간격으로 애니메이션을 적용합니다.
        projectBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.classList.add('animate');
            }, 200 * (index + 1));
        });
    }
    
    // 페이지 로드 시 애니메이션 함수 실행
    handleResultsAnimation();
    
    


    // 프로젝트 이미지 모달
    const projectItems = document.querySelectorAll('.project-box');
    const modal = document.getElementById('image-modal');
    const modalImages = document.querySelector('.modal-images');
    const closeModal = document.querySelector('.close');
    const modalPrevButton = document.querySelector('#image-modal .prev');
    const modalNextButton = document.querySelector('#image-modal .next');

    let currentImageIndex = 0;
    let images = [];

    // 각 프로젝트 박스에 클릭 이벤트 리스너 추가
    projectItems.forEach((item) => {
        item.addEventListener('click', function() {
            openModal(this);
        });
    });

    // 모달 열기 함수
    function openModal(projectBox) {
        currentImageIndex = 0;
        images = JSON.parse(projectBox.dataset.images);
        updateModalImages();
        modal.style.display = "block";
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // 모달 이미지 업데이트 함수
    function updateModalImages() {
        modalImages.innerHTML = '';
        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            modalImages.appendChild(img);
        });
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    // 이전 이미지로 이동
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    // 다음 이미지로 이동
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    // 모달 닫기 함수
    function closeModalFunc() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            modalImages.innerHTML = '';
        }, 300);
    }

    // 이벤트 리스너 추가
    closeModal.onclick = closeModalFunc;
    modalPrevButton.onclick = showPreviousImage;
    modalNextButton.onclick = showNextImage;

    // 모달 외부 클릭 시 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalFunc();
        }
    }

    // ESC 키 누르면 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            closeModalFunc();
        }
    });

    // 터치 이벤트 리스너 추가 (모달용)
    let modalTouchStartX = 0;
    let modalTouchEndX = 0;

    modalImages.addEventListener('touchstart', function(e) {
        modalTouchStartX = e.changedTouches[0].screenX;
    });

    modalImages.addEventListener('touchend', function(e) {
        modalTouchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
    });

    // 모달 스와이프 처리 함수
    function handleModalSwipe() {
        const swipeThreshold = 50; // 스와이프로 인식할 최소 거리
        const swipeDistance = modalTouchStartX - modalTouchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                showNextImage();
            } else {
                showPreviousImage();
            }
        }
    }






// DOM 요소 선택
const inquiryIntroSection = document.getElementById('inquiry-intro');
const textItems = document.querySelectorAll('#inquiry-intro .text-item');
const mainTitle = document.querySelector('#inquiry-intro .main-title');
const mainDescription = document.querySelector('#inquiry-intro .main-description');
const textContainer = document.querySelector('#inquiry-intro .text-animation-container');
const scrollIndicator3 = document.querySelector('.scroll-indicator3');

// 상수 정의
const totalItems = textItems.length;
const visibleItems = 5; // 한 번에 보이는 아이템 수
const scrollSensitivity = 1.5; // 스크롤 감도 조절

// 스크롤 최적화를 위한 변수
let lastScrollTop = 0;
let ticking = false;

// 화면 크기에 따른 아이템 높이 계산 함수
function updateItemHeight() {
    if (window.innerWidth <= 430) return 50; // 모바일
    if (window.innerWidth <= 768) return 70; // 태블릿
    return 90; // 데스크톱
}

// 개선된 이징 함수: 더 부드러운 애니메이션을 위한 보간
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 텍스트 아이템 업데이트 함수
function updateTextItems(scrollFraction, itemHeight, mainContentVisible) {
    const currentIndex = scrollFraction * (totalItems - 1) * scrollSensitivity;
    
    textItems.forEach((item, index) => {
        const distance = index - currentIndex;
        const absDistance = Math.abs(distance);
        
        if (absDistance < visibleItems) {
            // 불투명도 계산 로직 강화
            const opacityFactor = Math.pow(1 - (absDistance / visibleItems), 4);
            let opacity = Math.max(0.05, opacityFactor);
            
            // 메인 콘텐츠가 보일 때 이전 텍스트들의 불투명도 더 낮추기
            if (mainContentVisible) opacity *= 0.2;
            
            const scale = 0.7 + (0.3 * opacityFactor);
            const translateY = distance * itemHeight;
            
            item.style.opacity = opacity;
            item.style.transform = `translateY(${translateY}px) scale(${scale})`;
            item.style.zIndex = Math.round((1 - absDistance) * 100);
            
            // 글로우 효과 제거
            item.style.textShadow = 'none';
            } else {
                item.style.opacity = 0;
                item.style.transform = `translateY(${distance * itemHeight}px) scale(0.7)`;
                item.style.zIndex = 0;
                item.style.textShadow = 'none';
            }
            });
            }

            // 메인 콘텐츠(타이틀, 설명) 업데이트 함수
            function updateMainContent(scrollFraction) {
            const lastItemFullyVisibleFraction = (totalItems - 1) / totalItems / scrollSensitivity;
            const contentStartFraction = lastItemFullyVisibleFraction + 0.05; // 약간의 지연 추가

            let mainContentVisible = false;

            if (scrollFraction > contentStartFraction) {
            const contentProgress = (scrollFraction - contentStartFraction) / (1 - contentStartFraction);
            const easedProgress = easeInOutCubic(Math.min(contentProgress, 1));

            mainTitle.style.opacity = easedProgress;
            mainDescription.style.opacity = easedProgress;
            mainTitle.style.transform = `translateY(${20 * (1 - easedProgress)}px)`;
            mainDescription.style.transform = `translateY(${20 * (1 - easedProgress)}px)`;

            mainContentVisible = true;
            } else {
            mainTitle.style.opacity = 0;
            mainDescription.style.opacity = 0;
            mainTitle.style.transform = 'translateY(20px)';
            mainDescription.style.transform = 'translateY(20px)';
            }

            return mainContentVisible;
            }

            // 스크롤 인디케이터3 업데이트 함수
            function updateScrollIndicator3(scrollFraction) {
            if (scrollFraction > 0.1) {
            scrollIndicator3.classList.add('hide');
            } else {
            scrollIndicator3.classList.remove('hide');
            }
            }

            // 최적화된 스크롤 이벤트 핸들러
            function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = inquiryIntroSection.getBoundingClientRect();
                const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
                
                const currentItemHeight = updateItemHeight();
                const mainContentVisible = updateMainContent(scrollFraction);
                updateTextItems(scrollFraction, currentItemHeight, mainContentVisible);
                updateScrollIndicator3(scrollFraction);
                
                // 배경 그라데이션 효과 업데이트
                inquiryIntroSection.style.background = `linear-gradient(180deg, 
                    rgba(0,0,0,1) ${scrollFraction * 100}%, 
                    rgba(20,20,20,1) ${scrollFraction * 100 + 50}%, 
                    rgba(0,0,0,1) 100%)`;
                
                ticking = false;
            });

            ticking = true;
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }

            // 리사이즈 이벤트 핸들러
            function handleResize() {
            const currentItemHeight = updateItemHeight();
            textContainer.style.height = `${currentItemHeight * visibleItems}px`;
            handleScroll();
            }

            // 이벤트 리스너 등록 (스크롤 성능 최적화)
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleResize);

            // 초기 설정
            handleResize();
            handleScroll();

            // 키보드 네비게이션 지원 (접근성 향상)
            inquiryIntroSection.setAttribute('tabindex', '0');
            inquiryIntroSection.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollBy(0, e.key === 'ArrowDown' ? 100 : -100);
            }
            });



















    // Contact Us 섹션 애니메이션
    const contactSection = document.querySelector('#contact-us');
    if (contactSection) {
        const contactTitle = contactSection.querySelector('h2');
        const infoCards = contactSection.querySelectorAll('.info-card');
        const mapContainer = contactSection.querySelector('.map-container');
        const socialIcons = contactSection.querySelector('.social-icons');

        const contactObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                contactTitle.classList.add('animate');
                
                infoCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 200 * (index + 1));
                });

                setTimeout(() => {
                    mapContainer.classList.add('animate');
                }, 200 * (infoCards.length + 1));

                contactObserver.unobserve(contactSection);
            }
        }, { threshold: 0.4 });

        contactObserver.observe(contactSection);
    }

    // 스무스 스크롤 함수
    function smoothScroll(target, duration) {
        var targetElement = document.querySelector(target);
        var navbar = document.querySelector('.navbar');
        var navbarHeight = navbar.offsetHeight;
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        var startPosition = window.pageYOffset;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = easeOutBack(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeOutBack(t, b, c, d, s = 0.60158) {
            t = t / d - 1;
            return c * (t * t * ((s + 0.8) * t + s) + 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // 네비게이션 링크에 스무스 스크롤 적용
    document.querySelectorAll('.nav-item a, #navbar-mobile .nav-item a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href, 1000);

                // 모바일 메뉴 닫기
                if (navbarMobile.classList.contains('open')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // 모바일 메뉴 항목에도 스무스 스크롤 적용
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-item') && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            smoothScroll(targetId, 1000);
            
            // 모바일 메뉴 닫기
            if (navbarMobile.classList.contains('open')) {
                toggleMobileMenu();
            }
        }
    });

    // 웹페이지 확대 방지
(function() {
    // 터치 이벤트 제어 (모바일 디바이스용)
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 키보드 이벤트 제어 (데스크톱용)
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=')) {
            event.preventDefault();
        }
    }, false);

    // 마우스 휠 이벤트 제어 (데스크톱용)
    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });
})();

// 스크롤 인디케이터 공통 함수
function updateScrollIndicator(indicator, scrollFraction) {
    if (!indicator) return;

    if (scrollFraction > 0.1) {
        indicator.classList.add('hide');
    } else {
        indicator.classList.remove('hide');
        // 크기 동적 조절 (모든 인디케이터에 동일한 크기 적용)
        indicator.style.width = '60px';
        indicator.style.height = '120px';
        indicator.style.borderWidth = '4px';
    }

    // 내부 원 크기 조절
    const innerCircle = indicator.querySelector('::before');
    if (innerCircle) {
        innerCircle.style.width = '20px';
        innerCircle.style.height = '20px';
    }
}

// 스크롤 애니메이션 섹션 (scroll-indicator1)
window.addEventListener('scroll', () => {
    const scrollAnimationSection = document.getElementById('scroll-animation-section');
    const scrollIndicator1 = document.querySelector('.scroll-indicator1');
    if (scrollAnimationSection && scrollIndicator1) {
        const rect = scrollAnimationSection.getBoundingClientRect();
        const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        updateScrollIndicator(scrollIndicator1, scrollFraction);
    }
});

// Best Services 섹션 (scroll-indicator2)
window.addEventListener('scroll', () => {
    const bestServicesSection = document.getElementById('best-services');
    const scrollIndicator2 = document.querySelector('.scroll-indicator2');
    if (bestServicesSection && scrollIndicator2) {
        const rect = bestServicesSection.getBoundingClientRect();
        const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        updateScrollIndicator(scrollIndicator2, scrollFraction);
    }
});

// Inquiry Intro 섹션 (scroll-indicator3)
window.addEventListener('scroll', () => {
    const inquiryIntroSection = document.getElementById('inquiry-intro');
    const scrollIndicator3 = document.querySelector('.scroll-indicator3');
    if (inquiryIntroSection && scrollIndicator3) {
        const rect = inquiryIntroSection.getBoundingClientRect();
        const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        updateScrollIndicator(scrollIndicator3, scrollFraction);
    }
});

});


