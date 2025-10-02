// 문서가 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {

    const intro = document.getElementById('intro');
    const introLogo = document.getElementById('intro-logo').querySelector('img');
    const mainContent = document.getElementById('main-content');
    const loadingBar = document.getElementById('loading-bar'); // 로딩 바
    
    if (!intro || !introLogo || !mainContent || !loadingBar) {
        console.error('Required element not found');
        return;
    }
    
    // 메인 콘텐츠를 미리 로드하지만 보이지 않게 설정
    mainContent.style.visibility = 'hidden';
    mainContent.style.opacity = '0';
    
    // 인트로 로고 페이드 인
    introLogo.classList.add('fade-in');
    
    // 인트로 화면 동안 스크롤 막기
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    setTimeout(() => {
        // 로딩 바 페이드아웃
        loadingBar.style.opacity = '0';
    
        setTimeout(() => {
            // 인트로 배경 페이드아웃
            intro.style.opacity = '0';
    
            setTimeout(() => {
                intro.style.display = 'none';
    
                // 메인 콘텐츠 표시
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
    
                // 메인 콘텐츠가 로드된 후 스크롤 가능하게 설정
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';

                initializeEventSlider(); 

                
            }, 1000); // intro 페이드아웃 시간
        }, 1000); // 로딩 바 페이드아웃 시간
    }, 1000); // 로고와 로딩 바 애니메이션 완료 후 실행
    





    // 네비게이션 관련 요소들 선택
    const navbar = document.querySelector('.navbar');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbarMobile = document.getElementById('navbar-mobile');
    const productMenuLink = document.querySelector('.navbar-right .nav-item.has-submenu > a');
    const subMenu = document.querySelector('.navbar-right .nav-item.has-submenu .sub-menu');

    let lastScrollY = 0;
    const scrollThreshold = 100; // 헤더 숨김/보이기 시작 스크롤 값 (100px)

    // 스크롤 방향 감지 및 배경색 변경 (새로운 로직)
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        const isScrolledPastThreshold = currentScrollY > scrollThreshold;

        // 1. 네비게이션 바 배경색 변경 로직 (기존 기능 유지)
        navbar.style.backgroundColor = (currentScrollY > 0) ? 'var(--navbar-bg-color-scrolled)' : 'var(--navbar-bg-color)';

        // 2. 헤더 숨기기/보이기 로직
        if (isScrolledPastThreshold) {
            if (isScrollingDown) {
                // 아래로 스크롤 시 숨김
                navbar.classList.add('hidden');
            } else {
                // 위로 스크롤 시 표시
                navbar.classList.remove('hidden');
            }
        } else if (currentScrollY <= scrollThreshold) {
            // 맨 위에 있을 때는 항상 표시
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY; // 현재 스크롤 위치 저장
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
    
    
    
    
    

    let animationId;
    let resizeId;
    const logosTrack = document.querySelector('.logos-track');
    
    // 로고 복제 함수
    function cloneLogos() {
        const logos = logosTrack.querySelectorAll('img');
        const containerWidth = logosTrack.parentElement.offsetWidth;
        let totalWidth = 0;
        
        logos.forEach(logo => {
            totalWidth += logo.offsetWidth + parseInt(getComputedStyle(logo).marginLeft) + parseInt(getComputedStyle(logo).marginRight);
        });
    
        const cloneCount = Math.ceil(containerWidth / totalWidth) + 1;
    
        // 기존 복제된 로고 모두 제거
        while (logosTrack.firstChild) {
            logosTrack.removeChild(logosTrack.firstChild);
        }
    
        // 원본 로고와 필요한 만큼의 복제 로고 추가
        for (let i = 0; i < cloneCount; i++) {
            logos.forEach(logo => {
                const clone = logo.cloneNode(true);
                logosTrack.appendChild(clone);
            });
        }
    }
    
    // 로고 트랙 너비 조정 함수
    function adjustTrackWidth() {
        const logos = logosTrack.querySelectorAll('img');
        const totalWidth = Array.from(logos).reduce((width, logo) => width + logo.offsetWidth + parseInt(getComputedStyle(logo).marginLeft) + parseInt(getComputedStyle(logo).marginRight), 0);
        logosTrack.style.width = `${totalWidth}px`;
        return totalWidth;
    }
    
    // 애니메이션 중지 함수
    function stopAnimation() {
        logosTrack.style.animation = 'none';
        logosTrack.offsetHeight; // Reflow를 강제하여 애니메이션을 다시 시작할 수 있도록 합니다.
        logosTrack.style.animation = null;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // 애니메이션 시작 함수
    function startAnimation(duration) {
        stopAnimation();
        logosTrack.style.animation = `scroll ${duration}s linear infinite`;
    }
    
    // 로고 초기화 및 리사이즈 대응
    function initAndResizeLogos() {
        stopAnimation();
        cloneLogos();
        const totalWidth = adjustTrackWidth();
        const duration = totalWidth / 150; // 속도 조절
        startAnimation(duration);
    }
    
    // 디바운싱 없이 리사이즈 이벤트 최적화
    function handleResize() {
        if (resizeId) {
            cancelAnimationFrame(resizeId);
        }
        resizeId = requestAnimationFrame(() => {
            initAndResizeLogos();
        });
    }
    
    // 초기화 및 이벤트 리스너 등록
    initAndResizeLogos();
    window.addEventListener('resize', handleResize);
    
    // 애니메이션 루프 함수
    function animate() {
        animationId = requestAnimationFrame(animate);
        // 필요한 애니메이션 작업 수행
    }
    animate();
    
    
    





// About Us 섹션 애니메이션
function handleAboutUsAnimation() {
    const aboutSection = document.querySelector('#about-us');
    if (!aboutSection) return;

    // DOM 요소 캐싱
    const elements = {
        textContent: aboutSection.querySelector('.text-content'),
        imageContent: aboutSection.querySelector('.image-content'),
        scrollArrowContainer: aboutSection.querySelector('.scroll-arrow-container'),
        readMoreBtn: aboutSection.querySelector('.read-more-btn'),
        textWrapper: aboutSection.querySelector('.text-wrapper'),
        slideWrapper: aboutSection.querySelector('.slide-wrapper'),
        slides: aboutSection.querySelectorAll('.slide'),
        prevButton: aboutSection.querySelector('.prev'),
        nextButton: aboutSection.querySelector('.next'),
        progressBar: aboutSection.querySelector('.progress-bar .progress'),
        dotsContainer: aboutSection.querySelector('.dots-container')
    };

    // 상태 변수
    let currentSlide = 0;
    const totalSlides = elements.slides.length;
    let slideInterval;
    const slideDuration = 4000; // 슬라이드당 4초
    let isExpanded = false; // isExpanded 변수 선언

    // 슬라이드쇼 점 생성 및 이벤트 설정
    elements.slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSlideInterval();
        });
        elements.dotsContainer.appendChild(dot);
    });

    const dots = elements.dotsContainer.querySelectorAll('.dot');

    // 슬라이드 이동 함수
    function goToSlide(n) {
        currentSlide = (n + totalSlides) % totalSlides;
        elements.slideWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        resetProgressBar();
    }

    function updateDots() {
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
    }

    // 진행 바 초기화 및 시작
    function resetProgressBar() {
        elements.progressBar.style.transition = 'none';
        elements.progressBar.style.width = '0%';
        setTimeout(() => {
            elements.progressBar.style.transition = `width ${slideDuration}ms linear`;
            elements.progressBar.style.width = '100%';
        }, 50); // 트랜지션 재적용을 위한 약간의 지연
    }

    function startSlideShow() {
        resetProgressBar();
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), slideDuration);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
        elements.progressBar.style.transition = '';
        elements.progressBar.style.width = '0%';
    }

    function resetSlideInterval() {
        stopSlideShow();
        startSlideShow();
    }

    // 이벤트 리스너 설정
    elements.prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetSlideInterval();
    });

    elements.nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetSlideInterval();
    });

    // 터치 이벤트 처리
    let touchStartX = 0;
    elements.slideWrapper.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        stopSlideShow();
    });

    elements.slideWrapper.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = 50;
        if (touchStartX - touchEndX > swipeDistance) goToSlide(currentSlide + 1);
        if (touchEndX - touchStartX > swipeDistance) goToSlide(currentSlide - 1);
        resetSlideInterval();
    });

    // Intersection Observer 설정 복구 및 애니메이션 적용
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        }),
        { threshold: 0.2 }
    );

    [elements.imageContent, elements.textContent, elements.scrollArrowContainer]
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });

    // 텍스트 조절 함수
    function adjustText() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && !isExpanded) {
            elements.textWrapper.style.maxHeight = '100px';
            elements.textWrapper.classList.add('masked');
            elements.readMoreBtn.style.display = 'inline-block';
            elements.readMoreBtn.textContent = '더보기';
        } else {
            elements.textWrapper.style.maxHeight = elements.textWrapper.scrollHeight + 'px';
            elements.textWrapper.classList.remove('masked');
            elements.readMoreBtn.style.display = isMobile ? 'inline-block' : 'none';
        }
    }

    // 디바운스 함수
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 이벤트 리스너 등록
    elements.readMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        adjustText();
        elements.readMoreBtn.textContent = isExpanded ? '접기' : '더보기';
    });

    window.addEventListener('resize', debounce(() => {
        goToSlide(currentSlide);
        adjustText();
    }, 250));

    window.addEventListener('scroll', debounce(adjustText, 250));

    // 초기화
    adjustText();
    updateDots();
    startSlideShow();
}

// 이미지 프리로드 후 애니메이션 실행
function preloadImages(callback) {
    const aboutSection = document.querySelector('#about-us');
    if (!aboutSection) return;

    const images = aboutSection.querySelectorAll('img');
    let loadedCount = 0;

    images.forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onload = () => {
            loadedCount++;
            if (loadedCount === images.length) {
                callback();
            }
        };
    });
}

preloadImages(() => {
    handleAboutUsAnimation();
});









// 타임라인 애니메이션
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
            start: "top 90%",
            end: "top 30%",
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
        start: "top 40%",
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




    




// 패럴랙스 스크롤 애니메이션
(function() {
    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    const frameCount = 214;
    const currentFrame = index => `https://gofitkorea.netlify.app/scrollanimation/${index.toString().padStart(4, '0')}.webp`;

    // 지역 변수로 선언하여 전역 충돌 방지
    let sectionImages = [];
    let loadedImages = 0;

    // 캔버스 크기를 컨테이너에 맞게 설정하는 함수
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    // 이미지를 미리 로드하는 함수
    const preloadImages = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            sectionImages[i] = img;
            img.onload = () => {
                loadedImages++;
                // 모든 이미지가 로드되면 첫 번째 이미지 표시
                if (loadedImages === frameCount) {
                    drawImageProp(context, sectionImages[1], 0, 0, canvas.width, canvas.height, 0.5, 0.5, 1);
                }
            };
        }
    };

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

    // 스크롤 이벤트 리스너에서 requestAnimationFrame을 사용해 부드럽게 처리
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function updateScroll(scrollPos) {
        const scrollAnimationSection = document.getElementById('scroll-animation-section');
        const sectionTop = scrollAnimationSection.offsetTop;
        const scrollPosition = scrollPos - sectionTop;
        const sectionHeight = scrollAnimationSection.offsetHeight;
        
        const scrollFraction = Math.max(0, Math.min(1, scrollPosition / (sectionHeight / 1.2)));
        const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));

        let brightness;
        if (scrollFraction < 0.1) {
            brightness = 0.2 + (scrollFraction / 0.2) * 0.8;
        } else if (scrollFraction > 0.75) {
            const endProgress = (scrollFraction - 0.75) / 0.25;
            brightness = 1 - (endProgress * 0.8);
        } else {
            brightness = 1;
        }

        if (sectionImages[frameIndex + 1]) {
            requestAnimationFrame(() => drawImageProp(context, sectionImages[frameIndex + 1], 0, 0, canvas.width, canvas.height, 0.5, 0.5, brightness));
        }

        // 이미지 크기 및 라인 애니메이션 처리
        updateImageAndLine(scrollFraction);

        // 텍스트 애니메이션 처리
        updateTextAnimation(scrollFraction);
    }

    // 이미지 크기와 라인 애니메이션을 처리하는 함수
    function updateImageAndLine(scrollFraction) {
        const scrollContainer = document.querySelector('.scroll-container');
        const circleContainer = document.querySelector('.scroll-section-circle-container');
        let scale = 1;
        let containerWidth = '100%';
        let borderRadius = 0;
        let shadowOpacity = 0;

        if (scrollFraction <= 0.1) {
            const startProgress = scrollFraction / 0.1;
            scale = 0.9 + startProgress * 0.1;
            containerWidth = `${1730 + (window.innerWidth - 1730) * startProgress}px`;
            borderRadius = 20 * (1 - startProgress);
            shadowOpacity = 0.6 * (1 - startProgress);
        } else if (scrollFraction > 0.9) {
            const endProgress = (scrollFraction - 0.9) / 0.1;
            const endOpacity = easeInOutQuad(endProgress);
            scale = 1 - endOpacity * 0.1;
            containerWidth = `${window.innerWidth - (window.innerWidth - 1730) * endProgress}px`;
            borderRadius = 20 * endOpacity;
            shadowOpacity = 0.6 * endOpacity;
        }

        // 스타일 적용
        scrollContainer.style.width = containerWidth;
        canvas.style.transform = `scale(${scale})`;
        canvas.style.borderRadius = `${borderRadius}px`;
        canvas.style.boxShadow = `0 0 0 3px rgba(0, 247, 255, ${shadowOpacity})`;

        if (circleContainer) {
            circleContainer.style.opacity = Math.min(shadowOpacity * 1.5, 0.8);
            const circleScale = 1 + Math.abs(1 - scale) * 2;
            circleContainer.style.transform = `scale(${circleScale})`;
        }
    }

    // 텍스트 애니메이션 관련 함수
    function updateTextAnimation(scrollFraction) {
        const allSections = document.querySelectorAll('#scroll-animation-section .scroll-content');
        const sectionStartPoints = [0, 0.25, 0.5, 0.75];

        allSections.forEach((section, index) => {
            const startFraction = sectionStartPoints[index];
            const endFraction = index < sectionStartPoints.length - 1 ? sectionStartPoints[index + 1] : 1;
            const sectionProgress = (scrollFraction - startFraction) / (endFraction - startFraction);

            let opacity, translateY, scale;

            const steps = 100;
            const currentStep = Math.floor(sectionProgress * steps);

            if (index === allSections.length - 1) {
                opacity = Math.min(1, currentStep / steps);
                scale = 0.95 + (currentStep / steps) * 0.2;
                translateY = 0;
            } else {
                const fadeInEnd = 30;
                const fadeOutStart = 70;

                if (currentStep < fadeInEnd) {
                    opacity = currentStep / fadeInEnd;
                    translateY = 30 * (1 - (currentStep / fadeInEnd));
                } else if (currentStep >= fadeOutStart) {
                    const fadeOutProgress = (currentStep - fadeOutStart) / (steps - fadeOutStart);
                    opacity = 1 - fadeOutProgress;
                    translateY = -30 * fadeOutProgress;
                } else {
                    opacity = 1;
                    translateY = 0;
                }
                scale = 1;
            }

            section.style.opacity = opacity.toFixed(2);
            section.style.transform = `translateY(${translateY.toFixed(2)}px)`;
            if (index === allSections.length - 1) {
                section.style.transform += ` scale(${scale.toFixed(2)})`;
            }
        });
    }

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScroll(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });

    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawImageProp(context, sectionImages[1], 0, 0, canvas.width, canvas.height, 0.5, 0.5, 1);
    });

    // 초기 설정
    resizeCanvas();
    preloadImages();

    // 부드러운 easing 함수
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
})();







// inquiry-intro 섹션 코드
// DOM 요소 선택
const inquiryIntroSection = document.getElementById('inquiry-intro');
const textItems = document.querySelectorAll('#inquiry-intro .text-item');
const mainTitle = document.querySelector('#inquiry-intro .main-title');
const mainDescription = document.querySelector('#inquiry-intro .main-description');
const textContainer = document.querySelector('#inquiry-intro .text-animation-container');

// 상수 정의
const CONSTANTS = {
    totalItems: textItems.length,
    visibleItems: 4,
    scrollSensitivity: 1.2,
    throttleDelay: 16 // 약 60fps에 해당하는 값
};



// 화면 크기에 따른 아이템 높이 계산 함수
function updateItemHeight() {
    if (window.innerWidth <= 430) return 60;
    if (window.innerWidth <= 768) return 80;
    if (window.innerWidth <= 1200) return 100;
    return 160;  // 큰 화면에서 더 큰 간격
}

// 텍스트 아이템 업데이트 함수
function updateTextItems(scrollFraction, itemHeight, mainContentVisible) {
    const currentIndex = Math.floor(scrollFraction * (CONSTANTS.totalItems - 1) * CONSTANTS.scrollSensitivity);
    
    textItems.forEach((item, index) => {
        const distance = index - currentIndex;
        const absDistance = Math.abs(distance);
        
        if (absDistance < CONSTANTS.visibleItems) {
            let opacity = absDistance === 0 ? 1 : 0.3;
            if (mainContentVisible) opacity *= 0.2;
            
            const scale = absDistance === 0 ? 1 : 0.8;
            const translateY = distance * itemHeight * 1.5;
            
            item.style.opacity = opacity;
            item.style.transform = `translateY(${translateY}px) scale(${scale})`;
            item.style.zIndex = CONSTANTS.visibleItems - absDistance;
        } else {
            item.style.opacity = 0;
            item.style.transform = `translateY(${distance * itemHeight * 1.5}px) scale(0.8)`;
            item.style.zIndex = 0;
        }
    });
}

// 메인 콘텐츠(타이틀, 설명) 업데이트 함수
function updateMainContent(scrollFraction) {
    const lastItemFullyVisibleFraction = (CONSTANTS.totalItems - 1) / CONSTANTS.totalItems / CONSTANTS.scrollSensitivity;
    const contentStartFraction = lastItemFullyVisibleFraction + 0.2;

    let mainContentVisible = false;

    if (scrollFraction > contentStartFraction) {
        const contentProgress = (scrollFraction - contentStartFraction) / (1 - contentStartFraction);
        const easedProgress = Math.min(contentProgress, 1);

        mainTitle.style.opacity = easedProgress;
        mainDescription.style.opacity = easedProgress;
        // 여기서 scaleY를 완전히 제거했습니다.
        mainTitle.style.transform = `translateY(${30 * (1 - easedProgress)}px)`;
        mainDescription.style.transform = `translateY(${30 * (1 - easedProgress)}px)`;

        mainContentVisible = true;
    } else {
        mainTitle.style.opacity = 0;
        mainDescription.style.opacity = 0;
        // 여기서도 scaleY를 제거했습니다.
        mainTitle.style.transform = 'translateY(30px)';
        mainDescription.style.transform = 'translateY(30px)';
    }

    return mainContentVisible;
}

// 스크롤 이벤트 핸들러
function handleScroll() {
    const rect = inquiryIntroSection.getBoundingClientRect();
    const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
    
    const currentItemHeight = updateItemHeight();
    const mainContentVisible = updateMainContent(scrollFraction);
    updateTextItems(scrollFraction, currentItemHeight, mainContentVisible);
}



// 리사이즈 이벤트 핸들러
function handleResize() {
    const currentItemHeight = updateItemHeight();
    textContainer.style.height = `${currentItemHeight * CONSTANTS.visibleItems * 1.5}px`;
    handleScroll();
}

// 이벤트 리스너 등록
window.addEventListener('scroll', handleScroll, { passive: true }); 
window.addEventListener('resize', handleResize);

// 초기 설정
handleResize();
handleScroll();






// Our Services 섹션 애니메이션
function handleServicesAnimation() {
    const servicesSection = document.querySelector('#our-services');
    if (servicesSection) {
        const servicesTitle = servicesSection.querySelector('h2');
        const serviceBoxes = servicesSection.querySelectorAll('.service-box');
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    servicesTitle.classList.add('animate');
                    animateServiceBoxes(serviceBoxes);
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
        const delay = index * 100;
        setTimeout(() => {
            box.style.transition = 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
            box.classList.add('animate');
            
            setTimeout(() => {
                box.classList.add('hover-ready');
            }, 500);
        }, delay);
    });
}

// 동적 높이 조정 함수
function adjustBoxHeight(box, isExpanding) {
    const backContent = box.querySelector('.service-back');
    const closeButton = box.querySelector('.btn-close');
    const contentHeight = backContent.scrollHeight;
    const buttonHeight = closeButton.offsetHeight;
    const totalHeight = contentHeight + buttonHeight + 40;

    const startHeight = box.offsetHeight;
    const targetHeight = isExpanding ? Math.min(totalHeight, window.innerHeight * 0.8) : 270;

    function animate(currentTime) {
        const runtime = currentTime - startTime;
        const progress = Math.min(runtime / 200, 1);

        box.style.height = `${startHeight + (targetHeight - startHeight) * progress}px`;

        if (runtime < 200) {
            requestAnimationFrame(animate);
        } else if (!isExpanding) {
            box.style.height = '';
        }
    }

    const startTime = performance.now();
    requestAnimationFrame(animate);
}

// 초기 상태 설정 및 이벤트 리스너 추가
function initializeServiceBoxes() {
    const serviceBoxes = document.querySelectorAll('.service-box');
    serviceBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(400px)';

        const btnDetails = box.querySelector('.btn-details');
        const btnClose = box.querySelector('.btn-close');

        btnDetails.addEventListener('click', () => {
            serviceBoxes.forEach(otherBox => {
                if (otherBox !== box) {
                    otherBox.classList.remove('flipped', 'expanded');
                    adjustBoxHeight(otherBox, false);
                }
            });

            box.classList.add('flipped', 'expanded');
            adjustBoxHeight(box, true);
        });

        btnClose.addEventListener('click', () => {
            box.classList.remove('flipped', 'expanded');
            adjustBoxHeight(box, false);
        });
    });
}

// 윈도우 리사이즈 이벤트 핸들러
function handleResize() {
    const expandedBox = document.querySelector('.service-box.expanded');
    if (expandedBox) {
        adjustBoxHeight(expandedBox, true);
    }
}

// 페이지 로드 시 실행
window.addEventListener('load', () => {
    handleServicesAnimation();
    initializeServiceBoxes();
});

// 윈도우 리사이즈 이벤트 리스너
window.addEventListener('resize', handleResize);






// Best Section 코드
(function() {
    const bestServicesSection = document.getElementById('best-services');
    if (!bestServicesSection) return;

    const imageContainer = document.getElementById('image-container');
    const scrollIndicator2 = document.querySelector('.scroll-indicator2');

    const totalImages = 8;
    let activeImageIndex = 0;
    let animationFrameId = null;
    let isSectionPassed = false;
    let currentProgress = 0;
    let lastScrollTop = 0;

    function createImageElements() {
        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            img.src = `https://gofitkorea.netlify.app/brand-product/brand-product${i}.webp`;
            img.alt = `brand-product ${i}`;
            imageContainer.appendChild(img);
        }
    }

    function updateImagePositions(contentOpacity) {
        const images = imageContainer.querySelectorAll('img');
        const isMobile = window.innerWidth <= 768;
        
        images.forEach((img, index) => {
            const offset = index - activeImageIndex;
            const absOffset = Math.abs(offset);
            const zIndex = images.length - absOffset;
            
            // 밝기 조절 로직 수정
            let brightness;
            if (offset === 0) {
                brightness = 1; // 중앙 이미지는 항상 가장 밝게
            } else {
                brightness = Math.max(0.5 - (absOffset * 0.1), 0.2); // 다른 이미지들은 상대적으로 어둡게
            }
            
            const scale = offset === 0 ? 1 : 0.6 - (absOffset * 0.1);
            
            const spacing = isMobile ? 75 : 85;
            const translateX = offset * spacing;

            img.style.transform = `translateX(${translateX}%) scale(${scale})`;
            img.style.filter = `brightness(${brightness})`;
            img.style.zIndex = zIndex;
        });
    }

    // requestAnimationFrame 무한 루프 대신 이벤트 기반으로 변경
    function handleScroll() {
        const rect = bestServicesSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Best Services 섹션에 대한 스크롤 처리 로직 (이전 handleScroll 내용 유지)
        if (rect.top <= 0 && rect.bottom >= 0) {
            const sectionProgress = Math.abs(rect.top) / (rect.height - viewportHeight);
            const newImageIndex = Math.min(Math.floor(sectionProgress * totalImages), totalImages - 1);
            
            if (newImageIndex !== activeImageIndex) {
                activeImageIndex = newImageIndex;
            }

            updateImagePositions(sectionProgress);
            scrollIndicator2.style.opacity = activeImageIndex === 0 ? '1' : '0';
            isSectionPassed = false;
        } else if (rect.bottom < 0) {
            if (!isSectionPassed) {
                isSectionPassed = true;
                activeImageIndex = totalImages - 1;
                updateImagePositions(1);
                scrollIndicator2.style.opacity = '0';
            }
        } else if (rect.top > viewportHeight) {
            if (isSectionPassed || scrollTop < lastScrollTop) {
                isSectionPassed = false;
                activeImageIndex = 0;
                updateImagePositions(0);
                scrollIndicator2.style.opacity = '1';
            }
        }

        lastScrollTop = scrollTop;
    }
    
    // 리사이즈 이벤트 핸들러는 단순화
    function handleResize() {
        updateImagePositions(currentProgress);
        handleScroll();
    }
    
    function init() {
        createImageElements();
        updateImagePositions(0);
        handleScroll();
        
        // 스크롤과 리사이즈 이벤트에만 의존하도록 변경
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('unload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', handleResize);
    });
})();





// Counting Content 코드
function handleCountingContentAnimation() {
    // counting-content 섹션을 선택합니다.
    const section = document.querySelector('#counting-content');
    if (section) {
        // 텍스트 요소를 선택합니다.
        const countingText = section.querySelector('.counting-text');
        // 카운팅 아이템들을 선택합니다.
        const countingItems = section.querySelectorAll('.counting-item');

        // IntersectionObserver를 생성합니다. 이는 요소가 뷰포트에 들어왔는지 감지합니다.
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 요소가 뷰포트에 40% 이상 들어왔을 때
                if (entry.isIntersecting) {
                    // 텍스트 요소인 경우 애니메이션을 적용합니다.
                    if (entry.target === countingText) {
                        animateText(countingText);
                    } 
                    // 카운팅 아이템 컨테이너인 경우 카운팅 애니메이션을 시작합니다.
                    else if (entry.target === section.querySelector('.counting-items')) {
                        animateCountingItems(countingItems);
                    }
                    // 한 번 애니메이션이 적용된 요소는 더 이상 관찰하지 않습니다.
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.9 }); // 요소의 40%가 뷰포트에 들어왔을 때 콜백을 실행합니다.

        // 텍스트 요소와 카운팅 아이템 컨테이너를 관찰 대상으로 등록합니다.
        observer.observe(countingText);
        observer.observe(section.querySelector('.counting-items'));

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

// 텍스트 애니메이션 함수
function animateText(textElement) {
    // 초기 상태 설정 부분 제거
    // textElement.style.opacity = '0';
    // textElement.style.transform = 'translateY(50px)';
    
    // 애니메이션 시작
    setTimeout(() => {
        textElement.style.transition = 'opacity 0.5s, transform 0.5s';
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
    }, 100);
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
closeModal.addEventListener('click', closeModalFunc);
modalPrevButton.addEventListener('click', showPreviousImage);
modalNextButton.addEventListener('click', showNextImage);

// 모달 외부 클릭 시 닫기
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModalFunc();
    }
});

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













/* 이메일 발송 부분 코드 */
        const form = document.getElementById('inquiryForm');
        const categoryButtons = document.querySelectorAll('.category-button');
        const inquiryTypeField = document.getElementById('inquiry_type');
        const loadingModal = document.getElementById('loading-modal');
    
        categoryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                inquiryTypeField.value = this.textContent.trim();
            });
        });
    
        // 초기 문의 유형 설정
        inquiryTypeField.value = document.querySelector('.category-button.active').textContent.trim();
            
        form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (confirm('문의를 제출하시겠습니까?')) {
            const formData = new FormData(this);
            
            // 로딩 모달 표시
            loadingModal.style.display = 'flex';
            
            // Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzKL6Xb9L44bJeqZAoZV_i3e8yDIRH_dixookiJXPgdkvdrx3UxfWDQ7QKzt44H_tdp-Q/exec';

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    if (response.ok) {
                        setTimeout(() => {
                            loadingModal.style.display = 'none';
                            alert('문의가 성공적으로 제출되었습니다! 담당자가 확인 후, 이메일로 답변 드리겠습니다.');
                            form.reset();
                            categoryButtons.forEach(btn => btn.classList.remove('active'));
                            categoryButtons[0].classList.add('active');
                            inquiryTypeField.value = categoryButtons[0].textContent.trim();
                        }, 1000);
                    } else {
                        throw new Error('문의 제출에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    loadingModal.style.display = 'none';
                    alert('문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
                });
        }
    });

    // 페이지 로드 시 로딩 모달 숨기기
    loadingModal.style.display = 'none';

// Contact Us 섹션 애니메이션
const contactSection = document.querySelector('#contact-us');
if (contactSection) {
    const contactTitle = contactSection.querySelector('h2');
    const infoCards = contactSection.querySelectorAll('.info-card');
    const mapContainer = contactSection.querySelector('.map-container');

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
    }, { threshold: 0.2 });

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


document.addEventListener('DOMContentLoaded', function() {
    // 여기에 기존의 DOMContentLoaded 내용이 있을 것입니다.

    // 푸터 링크 설정을 여기에 추가합니다
    document.querySelectorAll('.footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            smoothScroll(href, 1000);
        });
    });
});







// ⭐⭐⭐ 1. 이벤트 팝업 슬라이더 기능 시작 (인디케이터 버그 수정) ⭐⭐⭐

function initializeEventSlider() {
    const modal = document.getElementById('event-popup-modal');
    if (!modal) return;
    
    // 쿠키 확인 (오늘 하루 보지 않기)
    const doNotShow = localStorage.getItem('gfk_event_popup_hide');
    if (doNotShow === 'true') {
        return; 
    }

    const content = modal.querySelector('.popup-content');
    const sliderWrapper = modal.querySelector('.event-slider-wrapper');
    const slides = modal.querySelectorAll('.event-slide');
    const prevButton = modal.querySelector('.prev-slide');
    const nextButton = modal.querySelector('.next-slide');
    const closeButton = modal.querySelector('#close-popup-btn');
    const doNotShowCheckbox = modal.querySelector('#do-not-show-today');
    const dotsContainer = modal.querySelector('.event-dots-container');
    
    // ⭐⭐ 인디케이터 버그 수정: 기존 내용을 비워서 중복 생성을 막습니다. ⭐⭐
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; 
    }

    if (slides.length === 0) {
        return; 
    }

    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 6000; 
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 인디케이터(점) 생성
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('event-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSlideInterval(); 
        });
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.event-dot');

    // 슬라이드 이동 함수
    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    // 인디케이터 업데이트
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // 자동 슬라이드 시작
    function startSlideShow() {
        if (slides.length <= 1) return;
        slideInterval = setInterval(() => goToSlide(currentIndex + 1), slideDuration);
    }

    // 자동 슬라이드 중지
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // 자동 슬라이드 재시작 (핵심 로직)
    function resetSlideInterval() {
        stopSlideShow(); // 기존 타이머 멈춤
        startSlideShow(); // 새 타이머 시작
    }

    // 네비게이션 버튼 이벤트
    prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetSlideInterval(); 
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetSlideInterval(); 
    });

    // 팝업 닫기 함수
    function closePopup() {
        stopSlideShow(); // 팝업 닫을 때 타이머 멈춤
        if (doNotShowCheckbox.checked) {
            localStorage.setItem('gfk_event_popup_hide', 'true');
        }
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }

    // 팝업 닫기 이벤트 등...
    closeButton.addEventListener('click', closePopup);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closePopup();
        }
    });

    // 터치 스와이프 구현
    let touchStartX = 0;

    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopSlideShow(); // 스와이프 시작 시 타이머 즉시 멈춤
    });

    sliderWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
        resetSlideInterval(); // 스와이프 종료 시 타이머 리셋
    });

    // PC 환경 (터치 디바이스가 아닐 때)에서 마우스 호버 시 자동 슬라이드 중지
    if (!isTouchDevice) {
        content.addEventListener('mouseenter', stopSlideShow);
        content.addEventListener('mouseleave', resetSlideInterval); // 호버 해제 시 타이머 리셋
    }


    // 팝업 표시
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }, 10);
    startSlideShow(); // 최초 시작
}

// ⭐⭐⭐ 이벤트 팝업 슬라이더 기능 끝 ⭐⭐⭐