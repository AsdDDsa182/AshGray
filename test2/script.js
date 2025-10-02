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

                // 스크롤 방향에 따라 헤더를 숨기거나 표시하는 기능
                let lastScrollTop = 0;
                window.addEventListener('scroll', function() {
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop > lastScrollTop) {
                        navbar.classList.add('navbar--hidden');
                    } else {
                        navbar.classList.remove('navbar--hidden');
                    }
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                });

                // ==================== 이벤트 팝업 (슬라이더 타입) 기능 시작 ====================
                const eventPopup = document.getElementById('event-popup');
                if (eventPopup && eventPopup.classList.contains('popup-disabled')) return;
                
                if (eventPopup) {
                    const closeBtn = document.getElementById('popup-close-btn');
                    const dontShowTodayCheckbox = document.getElementById('popup-dont-show-today');
                    const mainBody = document.body;
                    const slides = eventPopup.querySelector('.popup-slides');
                    const slideItems = eventPopup.querySelectorAll('.popup-slide');
                    const prevArrow = eventPopup.querySelector('.popup-arrow.prev');
                    const nextArrow = eventPopup.querySelector('.popup-arrow.next');
                    const indicatorsContainer = eventPopup.querySelector('.popup-indicators');
                    const totalSlides = slideItems.length;
                    let currentIndex = 0;

                    if (totalSlides > 0) {
                        for (let i = 0; i < totalSlides; i++) {
                            const indicator = document.createElement('div');
                            indicator.classList.add('popup-indicator');
                            indicator.dataset.index = i;
                            indicatorsContainer.appendChild(indicator);
                        }
                        const indicators = indicatorsContainer.querySelectorAll('.popup-indicator');

                        function goToSlide(index) {
                            currentIndex = (index + totalSlides) % totalSlides;
                            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                            indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
                        }

                        prevArrow.addEventListener('click', () => goToSlide(currentIndex - 1));
                        nextArrow.addEventListener('click', () => goToSlide(currentIndex + 1));
                        indicators.forEach(indicator => indicator.addEventListener('click', (e) => goToSlide(parseInt(e.target.dataset.index))));

                        let startX = 0;
                        let isDragging = false;
                        slides.addEventListener('touchstart', (e) => {
                            startX = e.touches[0].clientX;
                            isDragging = true;
                            slides.style.transition = 'none';
                        });
                        slides.addEventListener('touchend', (e) => {
                            if (!isDragging) return;
                            isDragging = false;
                            slides.style.transition = 'transform 0.4s ease-in-out';
                            const endX = e.changedTouches[0].clientX;
                            const diff = startX - endX;
                            if (Math.abs(diff) > 50) goToSlide(currentIndex + (diff > 0 ? 1 : -1));
                        });

                        function openPopup() {
                            goToSlide(0);
                            eventPopup.classList.add('show');
                            mainBody.style.overflow = 'hidden';
                        }

                        if (!getCookie('popupDontShowToday')) {
                            openPopup();
                        }
                    }

                    function getCookie(name) {
                        const value = `; ${document.cookie}`;
                        const parts = value.split(`; ${name}=`);
                        if (parts.length === 2) return parts.pop().split(';').shift();
                    }

                    function setCookie(name, value, days) {
                        let expires = "";
                        if (days) {
                            const date = new Date();
                            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                            expires = "; expires=" + date.toUTCString();
                        }
                        document.cookie = name + "=" + (value || "") + expires + "; path=/";
                    }

                    function closePopup() {
                        if (dontShowTodayCheckbox.checked) {
                            setCookie('popupDontShowToday', 'true', 1);
                        }
                        eventPopup.classList.remove('show');
                        mainBody.style.overflow = '';
                    }

                    closeBtn.addEventListener('click', closePopup);
                    eventPopup.addEventListener('click', (event) => {
                        if (event.target === eventPopup) closePopup();
                    });
                }
                // ==================== 이벤트 팝업 (슬라이더 타입) 기능 끝 ====================
            }, 2000);
        }, 1000);
    }, 2100);

    const navbar = document.querySelector('.navbar');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbarMobile = document.getElementById('navbar-mobile');
    const productMenuLink = document.querySelector('.navbar-right .nav-item.has-submenu > a');
    const subMenu = document.querySelector('.navbar-right .nav-item.has-submenu .sub-menu');

    window.addEventListener('scroll', function() {
        navbar.style.backgroundColor = (window.scrollY > 0) ? 'var(--navbar-bg-color-scrolled)' : 'var(--navbar-bg-color)';
    });

    function toggleMobileSubMenu(event) {
        event.preventDefault();
        const subMenu = this.nextElementSibling;
        if (subMenu && subMenu.classList.contains('sub-menu')) {
            if (subMenu.style.maxHeight) {
                subMenu.style.maxHeight = null;
            } else {
                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            }
            this.classList.toggle('submenu-open');
        }
    }

    function toggleMobileMenu() {
        const isOpen = navbarMobile.classList.contains('open');
        if (isOpen) {
            navbarMobile.style.animation = 'slideUp 0.5s forwards';
            setTimeout(() => {
                navbarMobile.classList.remove('open');
                document.body.classList.remove('no-scroll');
                navbarMobile.style.transform = '';
                navbarMobile.innerHTML = '';
            }, 500);
        } else {
            navbarMobile.classList.add('open');
            document.body.classList.add('no-scroll');
            navbarMobile.style.animation = 'slideDown 0.5s forwards';
            const navbarLeft = document.querySelector('.navbar-left');
            const navbarRight = document.querySelector('.navbar-right');
            navbarMobile.innerHTML = navbarLeft.innerHTML + navbarRight.innerHTML;
            const rainbowItem = navbarMobile.querySelector('.rainbow-store-item');
            if (rainbowItem) {
                rainbowItem.innerHTML = '';
                const link = document.createElement('a');
                link.href = 'https://gofitequipment.netlify.app/';
                link.target = '_blank';
                link.textContent = 'GOFIT EQUIPMENT';
                link.classList.add('nav-item');
                rainbowItem.appendChild(link);
            }
            const mobileMenuItems = navbarMobile.querySelectorAll('.nav-item.has-submenu > a');
            mobileMenuItems.forEach(item => item.addEventListener('click', toggleMobileSubMenu));
            const allSubMenus = navbarMobile.querySelectorAll('.sub-menu');
            allSubMenus.forEach(sub => sub.style.maxHeight = null);
            const bottomBarContainer = document.createElement('div');
            bottomBarContainer.classList.add('bottom-bar-container');
            const bar1 = document.createElement('div');
            bar1.classList.add('bottom-bar');
            const bar2 = document.createElement('div');
            bar2.classList.add('bottom-bar');
            bottomBarContainer.append(bar1, bar2);
            navbarMobile.append(bottomBarContainer);
        }
        hamburgerMenu.classList.toggle('open');
    }
    hamburgerMenu.addEventListener('click', toggleMobileMenu);

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

    if (productMenuLink && subMenu) {
        productMenuLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
        productMenuLink.parentElement.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) subMenu.style.display = 'block';
        });
        productMenuLink.parentElement.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) subMenu.style.display = 'none';
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            navbarMobile.classList.remove('open');
            hamburgerMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            navbarMobile.style.animation = 'none';
            navbarMobile.innerHTML = '';
            document.querySelectorAll('.sub-menu').forEach(subMenu => subMenu.style.display = '');
        }
    });

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
            if (translateY < 0) navbarMobile.style.transform = `translateY(${translateY}px)`;
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

    const iframe = document.querySelector('#vimeo-player');
    if (iframe) {
        const player = new Vimeo.Player(iframe);
        player.setVolume(0);
        player.on('play', function() { console.log('동영상이 재생되었습니다'); });
        player.on('ended', function() { player.play(); });
    }

    let animationId;
    let resizeId;
    const logosTrack = document.querySelector('.logos-track');

    function cloneLogos() {
        const logos = logosTrack.querySelectorAll('img');
        const containerWidth = logosTrack.parentElement.offsetWidth;
        let totalWidth = 0;
        logos.forEach(logo => {
            totalWidth += logo.offsetWidth + parseInt(getComputedStyle(logo).marginLeft) + parseInt(getComputedStyle(logo).marginRight);
        });
        const cloneCount = Math.ceil(containerWidth / totalWidth) + 1;
        while (logosTrack.firstChild) logosTrack.removeChild(logosTrack.firstChild);
        for (let i = 0; i < cloneCount; i++) {
            logos.forEach(logo => logosTrack.appendChild(logo.cloneNode(true)));
        }
    }

    function adjustTrackWidth() {
        const logos = logosTrack.querySelectorAll('img');
        const totalWidth = Array.from(logos).reduce((width, logo) => width + logo.offsetWidth + parseInt(getComputedStyle(logo).marginLeft) + parseInt(getComputedStyle(logo).marginRight), 0);
        logosTrack.style.width = `${totalWidth}px`;
        return totalWidth;
    }

    function stopAnimation() {
        logosTrack.style.animation = 'none';
        logosTrack.offsetHeight;
        logosTrack.style.animation = null;
        if (animationId) cancelAnimationFrame(animationId);
        animationId = null;
    }

    function startAnimation(duration) {
        stopAnimation();
        logosTrack.style.animation = `scroll ${duration}s linear infinite`;
    }

    function initAndResizeLogos() {
        stopAnimation();
        cloneLogos();
        const totalWidth = adjustTrackWidth();
        const duration = totalWidth / 150;
        startAnimation(duration);
    }

    function handleResize() {
        if (resizeId) cancelAnimationFrame(resizeId);
        resizeId = requestAnimationFrame(initAndResizeLogos);
    }

    initAndResizeLogos();
    window.addEventListener('resize', handleResize);
    (function animate() {
        animationId = requestAnimationFrame(animate);
    })();

    function handleAboutUsAnimation() {
        const aboutSection = document.querySelector('#about-us');
        if (!aboutSection) return;
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
        let currentSlide = 0;
        const totalSlides = elements.slides.length;
        let slideInterval;
        const slideDuration = 4000;
        let isExpanded = false;
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

        function goToSlide(n) {
            currentSlide = (n + totalSlides) % totalSlides;
            elements.slideWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
            resetProgressBar();
        }

        function updateDots() {
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
        }

        function resetProgressBar() {
            elements.progressBar.style.transition = 'none';
            elements.progressBar.style.width = '0%';
            setTimeout(() => {
                elements.progressBar.style.transition = `width ${slideDuration}ms linear`;
                elements.progressBar.style.width = '100%';
            }, 50);
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
        elements.prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetSlideInterval();
        });
        elements.nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetSlideInterval();
        });
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
        const observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            }), { threshold: 0.2 }
        );
        [elements.imageContent, elements.textContent, elements.scrollArrowContainer]
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });

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

        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
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
        adjustText();
        updateDots();
        startSlideShow();
    }
    const aboutSectionForObserver = document.getElementById('about-us');
    if (aboutSectionForObserver && typeof handleAboutUsAnimation === 'function') {
        const aboutObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handleAboutUsAnimation();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        aboutObserver.observe(aboutSectionForObserver);
    }
    gsap.registerPlugin(ScrollTrigger);
    let scene, camera, renderer, particles;

    function initTimelineBackground() {
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
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, timelineSection.clientWidth / timelineSection.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(timelineSection.clientWidth, timelineSection.clientHeight);
        const textureLoader = new THREE.TextureLoader();
        const particleTexture = textureLoader.load('https://assets.codepen.io/3685267/spark1.png');
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 1000; i++) {
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
        (function animate() {
            requestAnimationFrame(animate);
            particles.rotation.x += 0.0001;
            particles.rotation.y += 0.0002;
            renderer.render(scene, camera);
        })();
        window.addEventListener('resize', () => {
            camera.aspect = timelineSection.clientWidth / timelineSection.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(timelineSection.clientWidth, timelineSection.clientHeight);
        }, false);
    }
    initTimelineBackground();
    const timelineItemsForGsap = gsap.utils.toArray('.timeline-item');
    timelineItemsForGsap.forEach((item, index) => {
        gsap.set(item, { opacity: 0, y: 50 });
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
    const timelineSectionForGsap = document.getElementById('timeline');
    if (timelineSectionForGsap) {
        const tlObserver = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                gsap.registerPlugin(ScrollTrigger);
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
                const timelineItems = gsap.utils.toArray('.timeline-item');
                timelineItems.forEach(item => {
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
                obs.unobserve(entries[0].target);
            }
        }, { threshold: 0.1 });
        tlObserver.observe(timelineSectionForGsap);
    }
    timelineItemsForGsap.forEach((item) => {
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
    (function() {
        const canvas = document.getElementById("hero-lightpass");
        const context = canvas.getContext("2d");
        const frameCount = 214;
        const currentFrame = index => `https://gofitkorea.netlify.app/scrollanimation/${index.toString().padStart(4, '0')}.webp`;
        let sectionImages = [];
        let loadedImages = 0;

        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        const preloadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                sectionImages[i] = img;
                img.onload = () => {
                    loadedImages++;
                    if (loadedImages === frameCount) {
                        drawImageProp(context, sectionImages[1], 0, 0, canvas.width, canvas.height, 0.5, 0.5, 1);
                    }
                };
            }
        };

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
            if (brightness !== undefined) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`;
                ctx.fillRect(x, y, w, h);
                ctx.globalCompositeOperation = 'source-over';
            }
        }
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
            updateImageAndLine(scrollFraction);
            updateTextAnimation(scrollFraction);
        }

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
        window.addEventListener('resize', () => {
            resizeCanvas();
            drawImageProp(context, sectionImages[1], 0, 0, canvas.width, canvas.height, 0.5, 0.5, 1);
        });
        resizeCanvas();
        preloadImages();

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
    })();
    const inquiryIntroSectionForScroll = document.getElementById('inquiry-intro');
    const textItemsForScroll = document.querySelectorAll('#inquiry-intro .text-item');
    const mainTitleForScroll = document.querySelector('#inquiry-intro .main-title');
    const mainDescriptionForScroll = document.querySelector('#inquiry-intro .main-description');
    const textContainerForScroll = document.querySelector('#inquiry-intro .text-animation-container');
    const CONSTANTS = {
        totalItems: textItemsForScroll.length,
        visibleItems: 4,
        scrollSensitivity: 1.2,
        throttleDelay: 16
    };

    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func(...args);
        }
    }

    function updateItemHeight() {
        if (window.innerWidth <= 430) return 60;
        if (window.innerWidth <= 768) return 80;
        if (window.innerWidth <= 1200) return 100;
        return 160;
    }

    function updateTextItems(scrollFraction, itemHeight, mainContentVisible) {
        const currentIndex = Math.floor(scrollFraction * (CONSTANTS.totalItems - 1) * CONSTANTS.scrollSensitivity);
        textItemsForScroll.forEach((item, index) => {
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

    function updateMainContent(scrollFraction) {
        const lastItemFullyVisibleFraction = (CONSTANTS.totalItems - 1) / CONSTANTS.totalItems / CONSTANTS.scrollSensitivity;
        const contentStartFraction = lastItemFullyVisibleFraction + 0.2;
        let mainContentVisible = false;
        if (scrollFraction > contentStartFraction) {
            const contentProgress = (scrollFraction - contentStartFraction) / (1 - contentStartFraction);
            const easedProgress = Math.min(contentProgress, 1);
            mainTitleForScroll.style.opacity = easedProgress;
            mainDescriptionForScroll.style.opacity = easedProgress;
            mainTitleForScroll.style.transform = `translateY(${30 * (1 - easedProgress)}px)`;
            mainDescriptionForScroll.style.transform = `translateY(${30 * (1 - easedProgress)}px)`;
            mainContentVisible = true;
        } else {
            mainTitleForScroll.style.opacity = 0;
            mainDescriptionForScroll.style.opacity = 0;
            mainTitleForScroll.style.transform = 'translateY(30px)';
            mainDescriptionForScroll.style.transform = 'translateY(30px)';
        }
        return mainContentVisible;
    }

    function handleScroll() {
        const rect = inquiryIntroSectionForScroll.getBoundingClientRect();
        const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        const currentItemHeight = updateItemHeight();
        const mainContentVisible = updateMainContent(scrollFraction);
        updateTextItems(scrollFraction, currentItemHeight, mainContentVisible);
    }
    const throttledScrollHandler = throttle(handleScroll, CONSTANTS.throttleDelay);

    function handleResizeForInquiry() {
        const currentItemHeight = updateItemHeight();
        textContainerForScroll.style.height = `${currentItemHeight * CONSTANTS.visibleItems * 1.5}px`;
        handleScroll();
    }
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', handleResizeForInquiry);
    handleResizeForInquiry();
    handleScroll();

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

    function animateServiceBoxes(boxes) {
        boxes.forEach((box, index) => {
            const delay = index * 100;
            setTimeout(() => {
                box.style.transition = 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
                box.classList.add('animate');
                setTimeout(() => box.classList.add('hover-ready'), 500);
            }, delay);
        });
    }

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
            if (runtime < 200) requestAnimationFrame(animate);
            else if (!isExpanding) box.style.height = '';
        }
        const startTime = performance.now();
        requestAnimationFrame(animate);
    }

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

    function handleResizeForServices() {
        const expandedBox = document.querySelector('.service-box.expanded');
        if (expandedBox) adjustBoxHeight(expandedBox, true);
    }
    window.addEventListener('load', () => {
        handleServicesAnimation();
        initializeServiceBoxes();
    });
    window.addEventListener('resize', handleResizeForServices);
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
                let brightness;
                if (offset === 0) {
                    brightness = 1;
                } else {
                    brightness = Math.max(0.5 - (absOffset * 0.1), 0.2);
                }
                const scale = offset === 0 ? 1 : 0.6 - (absOffset * 0.1);
                const spacing = isMobile ? 75 : 85;
                const translateX = offset * spacing;
                img.style.transform = `translateX(${translateX}%) scale(${scale})`;
                img.style.filter = `brightness(${brightness})`;
                img.style.zIndex = zIndex;
            });
        }

        function handleScrollForBest() {
            const rect = bestServicesSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (rect.top <= 0 && rect.bottom >= 0) {
                const sectionProgress = Math.abs(rect.top) / (rect.height - viewportHeight);
                const newImageIndex = Math.min(Math.floor(sectionProgress * totalImages), totalImages - 1);
                if (newImageIndex !== activeImageIndex) activeImageIndex = newImageIndex;
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

        function animate() {
            handleScrollForBest();
            animationFrameId = requestAnimationFrame(animate);
        }

        function handleResizeForBest() {
            cancelAnimationFrame(animationFrameId);
            updateImagePositions(currentProgress);
            handleScrollForBest();
            animationFrameId = requestAnimationFrame(animate);
        }

        function init() {
            createImageElements();
            updateImagePositions(0);
            handleScrollForBest();
            animate();
            window.addEventListener('resize', handleResizeForBest);
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
        window.addEventListener('unload', () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResizeForBest);
        });
    })();

    function handleCountingContentAnimation() {
        const section = document.querySelector('#counting-content');
        if (section) {
            const countingText = section.querySelector('.counting-text');
            const countingItems = section.querySelectorAll('.counting-item');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === countingText) animateText(countingText);
                        else if (entry.target === section.querySelector('.counting-items')) animateCountingItems(countingItems);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.9 });
            observer.observe(countingText);
            observer.observe(section.querySelector('.counting-items'));
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

    function animateText(textElement) {
        setTimeout(() => {
            textElement.style.transition = 'opacity 0.5s, transform 0.5s';
            textElement.style.opacity = '1';
            textElement.style.transform = 'translateY(0)';
        }, 100);
    }

    function animateCountingItems(items) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
                startCounting(item);
            }, 200 * index);
        });
    }

    function startCounting(item) {
        const countElement = item.querySelector('.count');
        const targetNumber = parseInt(countElement.getAttribute('data-target'));
        const duration = 2000;
        let startTimestamp = null;

        function animateCount(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentNumber = Math.floor(progress * targetNumber);
            countElement.textContent = `+${currentNumber.toLocaleString()}`;
            if (progress < 0.95) {
                const shakeY = (Math.random() - 0.5) * 15;
                countElement.style.transform = `translateY(${shakeY}px)`;
                countElement.style.transition = 'transform 0.05s';
            } else {
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
                setTimeout(() => countElement.classList.remove('completion-effect'), 1500);
            }
        }
        requestAnimationFrame(animateCount);
    }

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
    handleCountingContentAnimation();

    function handleResultsAnimation() {
        const section = document.querySelector('#results');
        if (section) {
            const sectionTitle = section.querySelector('h2');
            const projectCategories = section.querySelectorAll('.projects-category');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === sectionTitle) entry.target.classList.add('animate');
                        else if (entry.target.classList.contains('projects-category')) animateCategory(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(sectionTitle);
            projectCategories.forEach(category => observer.observe(category));
        }
    }

    function animateCategory(category) {
        const categoryHeader = category.querySelector('.category-header');
        const projectBoxes = category.querySelectorAll('.project-box');
        categoryHeader.classList.add('animate');
        projectBoxes.forEach((box, index) => {
            setTimeout(() => box.classList.add('animate'), 200 * (index + 1));
        });
    }
    handleResultsAnimation();
    const projectItems = document.querySelectorAll('.project-box');
    const modal = document.getElementById('image-modal');
    const modalImages = document.querySelector('.modal-images');
    const closeModal = document.querySelector('.close');
    const modalPrevButton = document.querySelector('#image-modal .prev');
    const modalNextButton = document.querySelector('#image-modal .next');
    let currentImageIndex = 0;
    let images = [];
    projectItems.forEach((item) => {
        item.addEventListener('click', function() {
            openModal(this);
        });
    });

    function openModal(projectBox) {
        currentImageIndex = 0;
        images = JSON.parse(projectBox.dataset.images);
        updateModalImages();
        modal.style.display = "block";
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function updateModalImages() {
        modalImages.innerHTML = '';
        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            modalImages.appendChild(img);
        });
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    function closeModalFunc() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            modalImages.innerHTML = '';
        }, 300);
    }
    closeModal.addEventListener('click', closeModalFunc);
    modalPrevButton.addEventListener('click', showPreviousImage);
    modalNextButton.addEventListener('click', showNextImage);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) closeModalFunc();
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") closeModalFunc();
    });
    let modalTouchStartX = 0;
    let modalTouchEndX = 0;
    modalImages.addEventListener('touchstart', function(e) {
        modalTouchStartX = e.changedTouches[0].screenX;
    });
    modalImages.addEventListener('touchend', function(e) {
        modalTouchEndX = e.changedTouches[0].screenX;
        handleModalSwipe();
    });

    function handleModalSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = modalTouchStartX - modalTouchEndX;
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) showNextImage();
            else showPreviousImage();
        }
    }
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
    inquiryTypeField.value = document.querySelector('.category-button.active').textContent.trim();
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (confirm('문의를 제출하시겠습니까?')) {
            const formData = new FormData(this);
            loadingModal.style.display = 'flex';
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
    loadingModal.style.display = 'none';
    const contactSection = document.querySelector('#contact-us');
    if (contactSection) {
        const contactTitle = contactSection.querySelector('h2');
        const infoCards = contactSection.querySelectorAll('.info-card');
        const contactObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                contactTitle.classList.add('animate');
                infoCards.forEach((card, index) => {
                    setTimeout(() => card.classList.add('animate'), 200 * (index + 1));
                });
                contactObserver.unobserve(contactSection);
            }
        }, { threshold: 0.2 });
        contactObserver.observe(contactSection);
    }

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
    document.querySelectorAll('.nav-item a, #navbar-mobile .nav-item a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href, 1000);
                if (navbarMobile.classList.contains('open')) toggleMobileMenu();
            }
        });
    });
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-item') && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            smoothScroll(targetId, 1000);
            if (navbarMobile.classList.contains('open')) toggleMobileMenu();
        }
    });

    function updateScrollIndicator(indicator, scrollFraction) {
        if (!indicator) return;
        if (scrollFraction > 0.1) indicator.classList.add('hide');
        else {
            indicator.classList.remove('hide');
            indicator.style.width = '60px';
            indicator.style.height = '120px';
            indicator.style.borderWidth = '4px';
        }
        const innerCircle = indicator.querySelector('::before');
        if (innerCircle) {
            innerCircle.style.width = '20px';
            innerCircle.style.height = '20px';
        }
    }
    const handleScrollIndicators = throttle(() => {
        [{ id: 'scroll-animation-section', idx: 1 }, { id: 'best-services', idx: 2 }, { id: 'inquiry-intro', idx: 3 }, ].forEach(item => {
            const section = document.getElementById(item.id);
            const indicator = document.querySelector(`.scroll-indicator${item.idx}`);
            if (section && indicator) {
                const rect = section.getBoundingClientRect();
                const fraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
                updateScrollIndicator(indicator, fraction);
            }
        });
    }, 100);
    window.addEventListener('scroll', handleScrollIndicators, { passive: true });

});
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            smoothScroll(href, 1000);
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const eventBanner = document.querySelector('.gofit-event-banner');
    const eventToggle = document.querySelector('.gofit-event-banner-toggle');
    const eventContent = document.querySelector('.gofit-event-banner-content');
    const eventModal = document.querySelector('.gofit-event-modal');
    const eventModalContent = document.querySelector('.gofit-event-modal-content');
    const eventModalImage = document.querySelector('.gofit-event-modal-image');
    const eventModalClose = document.querySelector('.gofit-event-modal-close');

    function resizeModalImage() {
        if (eventModal.style.display === 'block') {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const imgAspectRatio = eventModalImage.naturalWidth / eventModalImage.naturalHeight;
            const windowAspectRatio = windowWidth / windowHeight;
            let imgWidth, imgHeight;
            if (imgAspectRatio > windowAspectRatio) {
                imgWidth = Math.min(windowWidth * 0.9, eventModalImage.naturalWidth);
                imgHeight = imgWidth / imgAspectRatio;
            } else {
                imgHeight = Math.min(windowHeight * 0.9, eventModalImage.naturalHeight);
                imgWidth = imgHeight * imgAspectRatio;
            }
            eventModalImage.style.width = `${imgWidth}px`;
            eventModalImage.style.height = `${imgHeight}px`;
            eventModalContent.style.width = `${imgWidth}px`;
            eventModalContent.style.height = `${imgHeight}px`;
            eventModalContent.style.top = '50%';
            eventModalContent.style.left = '50%';
            eventModalContent.style.transform = 'translate(-50%, -50%)';
        }
    }
    eventToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!eventBanner.classList.contains('active')) {
            eventBanner.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
        eventBanner.classList.toggle('active');
    });
    document.addEventListener('click', function(event) {
        if (!eventBanner.contains(event.target) && eventModal.style.display !== 'block') {
            eventBanner.classList.remove('active');
        }
    });
    eventContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    eventContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('gofit-event-btn')) {
            event.stopPropagation();
            const eventCard = event.target.closest('.gofit-event-card');
            const imageUrl = eventCard.getAttribute('data-image');
            eventModalImage.src = imageUrl;
            eventModal.style.display = 'block';
            eventModalImage.onload = resizeModalImage;
        }
    });
    eventModalClose.addEventListener('click', function(event) {
        event.stopPropagation();
        eventModal.style.display = 'none';
    });
    eventModal.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            event.stopPropagation();
            eventModal.style.display = 'none';
        }
    });
    window.addEventListener('resize', resizeModalImage);
});