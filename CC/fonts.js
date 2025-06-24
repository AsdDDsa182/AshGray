// fonts.js - 폰트 로딩 및 관리 파일

const fontManager = {
    // 폰트 데이터 정의
    fonts: {
        googleFonts: [
            'Noto+Sans+KR:wght@100..900',
            'Nanum+Gothic:wght@400;700;800',
            'Nanum+Myeongjo:wght@400;700;800',
            'IBM+Plex+Sans+KR:wght@100;200;300;400;500;600;700',
            'Black+Han+Sans',
            'Jua',
            'Do+Hyeon',
            'Sunflower:wght@300;500;700'
        ],
        
        cdnFonts: [
            {
                name: 'Pretendard Variable',
                url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css',
                type: 'link'
            },
            {
                name: 'MaruBuri',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10-21@1.0/MaruBuri-Regular.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'Hanna',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/HannaAir.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'BMJUA',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'BMDOHYEON',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMDOHYEON.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'NanumSquare',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquare.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'Cafe24Ssurround',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'NEXON Lv1 Gothic',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv1 Gothic OTF.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'Jalnan',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'GowunDodum',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunDodum-Regular.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'DungGeunMo',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff',
                format: 'woff',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'Tenada',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-01@1.1/Tenada.woff2',
                format: 'woff2',
                weight: 'normal',
                style: 'normal'
            },
            {
                name: 'SUITE',
                url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/SUITE-Regular.woff2',
                format: 'woff2',
                weight: 'normal',
                style: 'normal'
            }
        ]
    },
    
    // 폰트 옵션 데이터 (select에 들어갈 정보)
    fontOptions: [
        {
            category: '기본 폰트',
            fonts: [
                { value: "'Noto Sans KR', sans-serif", name: 'Noto Sans KR' }
            ]
        },
        {
            category: '나눔 시리즈',
            fonts: [
                { value: "'Nanum Gothic', sans-serif", name: '나눔고딕' },
                { value: "'Nanum Myeongjo', serif", name: '나눔명조' },
                { value: "'NanumSquare', sans-serif", name: '나눔스퀘어' }
            ]
        },
        {
            category: '모던/깔끔한 폰트',
            fonts: [
                { value: "'Pretendard Variable', Pretendard, sans-serif", name: 'Pretendard' },
                { value: "'SUITE', sans-serif", name: '스위트' },
                { value: "'IBM Plex Sans KR', sans-serif", name: 'IBM Plex Sans KR' },
                { value: "'GowunDodum', sans-serif", name: '고운돋움' }
            ]
        },
        {
            category: '개성있는 폰트',
            fonts: [
                { value: "'MaruBuri', serif", name: '마루부리' },
                { value: "'Hanna', sans-serif", name: '한나체' },
                { value: "'BMJUA', sans-serif", name: '배민 주아' },
                { value: "'BMDOHYEON', sans-serif", name: '배민 도현' },
                { value: "'Jua', sans-serif", name: '주아' },
                { value: "'Do Hyeon', sans-serif", name: '도현' }
            ]
        },
        {
            category: '굵은/강한 폰트',
            fonts: [
                { value: "'Black Han Sans', sans-serif", name: '검은고딕' },
                { value: "'Jalnan', sans-serif", name: '잘난체' },
                { value: "'Tenada', sans-serif", name: 'Tenada' }
            ]
        },
        {
            category: '캐주얼 폰트',
            fonts: [
                { value: "'Cafe24Ssurround', sans-serif", name: '카페24 써라운드' },
                { value: "'NEXON Lv1 Gothic', sans-serif", name: '넥슨 LV1 고딕' },
                { value: "'Sunflower', sans-serif", name: '해바라기' },
                { value: "'DungGeunMo', sans-serif", name: '둥근모꼴' }
            ]
        }
    ],
    
    // Google Fonts 로드
    loadGoogleFonts() {
        // Google Fonts preconnect
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);
        
        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
        
        // Google Fonts 링크 생성
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${this.fonts.googleFonts.join('&family=')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    },
    
    // CDN 폰트 로드
    loadCDNFonts() {
        const style = document.createElement('style');
        let cssText = '';
        
        this.fonts.cdnFonts.forEach(font => {
            if (font.type === 'link') {
                // CSS 파일 직접 import
                cssText += `@import url('${font.url}');\n`;
            } else {
                // @font-face 정의
                cssText += `
                @font-face {
                    font-family: '${font.name}';
                    src: url('${font.url}') format('${font.format}');
                    font-weight: ${font.weight};
                    font-style: ${font.style};
                    font-display: swap;
                }\n`;
            }
        });
        
        style.textContent = cssText;
        document.head.appendChild(style);
    },
    
    // select 요소에 폰트 옵션 추가
    populateFontSelect(selectId, defaultValue = null) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // 기존 옵션 제거
        select.innerHTML = '';
        
        // 카테고리별로 옵션 추가
        this.fontOptions.forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.category;
            
            category.fonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.value;
                option.textContent = font.name;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
        
        // 기본값 설정
        if (defaultValue) {
            select.value = defaultValue;
        }
    },
    
    // 초기화 함수
    init(defaultFont = null) {
        console.log('폰트 로딩 시작...');
        
        // Google Fonts 로드
        this.loadGoogleFonts();
        
        // CDN 폰트 로드
        this.loadCDNFonts();
        
        // DOM이 준비되면 select 옵션 추가
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.populateFontSelect('fontFamily', defaultFont);
            });
        } else {
            this.populateFontSelect('fontFamily', defaultFont);
        }
        
        console.log('폰트 로딩 완료');
    }
};

// 페이지 로드 완료 후 초기화 - 나눔명조를 기본값으로 설정
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fontManager.init("'Nanum Myeongjo', serif");
    });
} else {
    // DOM이 이미 로드된 경우
    fontManager.init("'Nanum Myeongjo', serif");
}