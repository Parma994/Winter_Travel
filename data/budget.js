// data/budget.js - 메인 탭 상세 예산 계획표 데이터 (단위: 유로)
// 세부 항목 금액(eur)만 적으면 카테고리 합계, 전체 합계, 가계부 총예산이 자동 계산됩니다.

const BUDGET_PLAN = [
    {
        icon: '✈️', title: '교통 및 항공권',
        items: [
            { label: '영국 런던 왕복 항공권', eur: 200 },
            { label: '헬싱키 ↔ 탐페레 기차(VR)', eur: 120 },
            { label: '탈린 왕복 페리', eur: 60 },
            { label: '탐페레 대중교통(Nysse) 30일권', eur: 60 }
        ]
    },
    {
        icon: '🍔', title: '식비 및 생활비',
        items: [
            { label: '탐페레 한 달 마트 식재료', eur: 650 },
            { label: '영국 런던 2박 3일 식비', eur: 100 },
            { label: '에스토니아 탈린 2박 3일 식비', eur: 100 }
        ]
    },
    {
        icon: '🏠', title: '추가 숙박비 (탐페레 제외)',
        items: [
            { label: '영국 런던 2박 3일 숙소', eur: 300 },
            { label: '에스토니아 탈린 2박 3일 숙소', eur: 120 }
        ]
    },
    {
        icon: '⚽', title: '문화 및 액티비티',
        items: [
            { label: '탐페레 로컬 사우나 (주 2~3회)', eur: 130 },
            { label: '토트넘 홋스퍼 경기 직관 티켓', eur: 100 },
            { label: '현지 박물관 및 관광 입장료', eur: 100 }
        ]
    },
    {
        icon: '🆘', title: '비상 예비비',
        items: [
            { label: '환율 변동 및 돌발 상황 여유 자금', eur: 460 }
        ]
    }
];

// 자동 계산 (직접 수정하지 마세요)
const sumEur = (items) => items.reduce((sum, item) => sum + item.eur, 0);
const BUDGET_TOTAL = BUDGET_PLAN.reduce((sum, cat) => sum + sumEur(cat.items), 0);
