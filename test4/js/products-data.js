// ═══════════════════════════════════════════════════════════════════════
// PEACH BUILDER - 통합 제품 데이터 관리
// 이 파일에서 모든 제품 정보를 중앙 관리합니다
// ═══════════════════════════════════════════════════════════════════════

// 📌 카테고리 정보
const GOFIT_CATEGORIES = {
  'cardio': { 
    kr: '카디오', 
    en: 'Cardio',
    contact: 'Cardio'  // contact 페이지용 이름
  },
  'strength': { 
    kr: '웨이트머신', 
    en: 'Weight',
    contact: 'Weight'
  },
  'functional': { 
    kr: '기능성', 
    en: 'functional',
    contact: '기능성'
  },
  'free': { 
    kr: '프리웨이트', 
    en: 'Free weights',
    contact: 'Free weights'
  }
};

/*
████████████████████████████████████████████████████████████████████████████████
██                         GOFIT PRODUCTS DATA                               ██
██                    specs 항목 통일 (5개 항목으로 일치)                       ██
████████████████████████████████████████████████████████████████████████████████
*/

// 📌 모든 제품 데이터 - image 속성 제거, images 배열만 사용, 렌탈가격 = 구매가격의 10%
const GOFIT_PRODUCTS = [
  // ═══════════════════════════════════════════════════════════════════════
  // 35개 제품 리스트 - specs 항목 통일 (크기, 프레임, 도장, 무게, 최대하중)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 1,
    name: '피치빌더 벨트 스쿼트',
    code: 'PB-312',
    category: 'Weight',
    originalPrice: null,
    price: 2600000,
    rentalPrice: 260000,
    badge: null,
    images: [
      '/products/images/Belt Squat_PB312.jpg'
    ],
    specs: {
      '크기': ' W 1741 x D 978 x H 1055',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '107kg',
      '최대훈련하중': '200kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 2,
    name: '피치빌더 멀티 힙 익스텐션',
    code: 'PB-410',
    category: 'Weight',
    originalPrice: null,
    price: 2700000,
    rentalPrice: 270000,
    badge: null,
    images: [
      '/products/images/MultiHipExtension_PB410.jpg'
    ],
    specs: {
      '크기': 'W 1733 x D 1051 x H 1118',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '137kg',
      '최대훈련하중': '60kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 3,
    name: '피치빌더 멀티 데드리프트',
    code: 'PB-411',
    category: 'Weight',
    originalPrice: null,
    price: 2900000,
    rentalPrice: 290000,
    badge: null,
    images: [
      '/products/images/MultiDeadLift_PB411.jpg'
    ],
    specs: {
      '크기': 'W 1458 x D 1491 x H 900',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '114.5kg',
      '최대훈련하중': '200kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 4,
    name: '피치빌더 리버스 하이퍼',
    code: 'PB-407',
    category: 'Weight',
    originalPrice: null,
    price: 2600000,
    rentalPrice: 260000,
    badge: null,
    images: [
      '/products/images/Reverse Hyper_PB407.jpg'
    ],
    specs: {
      '크기': 'W 1272 x D 825 x H 1094',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '75kg',
      '최대훈련하중': '60kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 5,
    name: '피치빌더 스탠딩 어브덕션',
    code: 'PB-403',
    category: 'Weight',
    originalPrice: null,
    price: 2700000,
    rentalPrice: 270000,
    badge: null,
    images: [
      '/products/images/Standing Abduction_PB403.jpg'
    ],
    specs: {
      '크기': 'W 1805 x D 939 x H 1518',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '128kg',
      '최대훈련하중': '200kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 6,
    name: '피치빌더 스탠딩 힙 쓰러스트',
    code: 'PB-402',
    category: 'Weight',
    originalPrice: null,
    price: 2700000,
    rentalPrice: 270000,
    badge: null,
    images: [
      '/products/images/Standing Hip Thrust_PB402.jpg'
    ],
    specs: {
      '크기': 'W 1182 x D 1160 x H 1446',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '88kg',
      '최대훈련하중': '120kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 7,
    name: '피치빌더 브이 스쿼트',
    code: 'PB-311',
    category: 'Weight',
    originalPrice: null,
    price: 3500000,
    rentalPrice: 350000,
    badge: null,
    images: [
      '/products/images/V Squat_PB311.jpg'
    ],
    specs: {
      '크기': 'W 2032 x D 1650 x H 1660',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '192kg',
      '최대훈련하중': '200kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
  {
    id: 8,
    name: '피치빌더 힙 쓰러스트',
    code: 'PB-401',
    category: 'Weight',
    originalPrice: null,
    price: 2900000,
    rentalPrice: 290000,
    badge: null,
    images: [
      '/products/images/Hip Thruster_PB401.jpg'
    ],
    specs: {
      '크기': 'W 1802 x D 1448 x H 781',
      '프레임': '미기재',
      '도장': '미기재',
      '무게': '137kg',
      '최대하중': '150kg'
    },
    features: [
      '미기재'
    ],
    video: null
  },
];

/*
████████████████████████████████████████████████████████████████████████████████
██                         수정 완료!                                         ██
██    모든 제품의 specs가 동일한 5개 항목으로 통일됨 (크기, 프레임, 도장, 무게, 최대하중)    ██
████████████████████████████████████████████████████████████████████████████████
*/

// 📌 유틸리티 함수들

// 가격 포맷팅 함수 (숫자 → "₩1,234,567" 형식)
function formatPrice(price) {
  if (!price) return '가격 문의';
  return '₩' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 카테고리 이름 가져오기
function getCategoryName(category, type = 'kr') {
  return GOFIT_CATEGORIES[category]?.[type] || category;
}

// ID로 제품 찾기
function getProductById(id) {
  return GOFIT_PRODUCTS.find(product => product.id === parseInt(id));
}

// 카테고리별 제품 필터링
function getProductsByCategory(category) {
  if (category === 'all') return GOFIT_PRODUCTS;
  return GOFIT_PRODUCTS.filter(product => product.category === category);
}

// 뱃지별 제품 필터링
function getProductsByBadge(badge) {
  return GOFIT_PRODUCTS.filter(product => {
    if (!product.badge) return false;
    const badges = Array.isArray(product.badge) ? product.badge : [product.badge];
    return badges.some(b => b.toLowerCase() === badge.toLowerCase());
  });
}

// 📌 전역으로 내보내기 (다른 파일에서 사용하기 위해)
if (typeof window !== 'undefined') {
  window.GOFIT_PRODUCTS = GOFIT_PRODUCTS;
  window.GOFIT_CATEGORIES = GOFIT_CATEGORIES;
  window.gofitUtils = {
    formatPrice,
    getCategoryName,
    getProductById,
    getProductsByCategory,
    getProductsByBadge
  };
}

// ═══════════════════════════════════════════════════════════════════════
// PEACH BUILDER - 통합 제품 데이터 관리 끝
// ═══════════════════════════════════════════════════════════════════════