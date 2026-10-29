// data/budget.js - 메인 탭 상세 예산 계획표 데이터
// 세부 항목 금액(amount)만 적으면 카테고리 합계, 전체 합계, 가계부 총예산이 자동 계산됩니다.
// currency: 현지 통화로 쓸 때만 적음 (data/currency.js의 코드, 없으면 유로)
//           → 예산표에 현지 통화로 표시되고 왼쪽에 실시간 환율로 바꾼 유로 금액이 작게 붙음
// 구분선: 항목 사이에 { divider: '제목' } 한 줄 (제목 없이 선만 원하면 { divider: true }, 합계에는 영향 없음)
//         오른쪽에 다음 구분선 전까지 항목들의 소계가 자동으로 붙음
// (data/currency.js 다음에 로드되어야 합니다)

const BUDGET_PLAN = [
    {
        icon: '✈️', title: '교통 및 항공권',
        items: [
            { divider: '0주차 · 헬싱키 & 탐페레' },
            { label: '공항 ~ 헬싱키 기차', amount: 4.5 },
            { label: '헬싱키 시내 교통 (HSL)', amount: 15.9 },
            { label: '헬싱키 ~ 탐페레', amount: 8.9 },
            { label: '탐페레 대중교통(Nysse) 30일권', amount: 46 },

            { divider: '1주차 · 스톡홀름' },
            { label: '탐페레 ↔ 투르쿠', amount: 12.2 },
            { label: '투르쿠 ↔ 스톡홀름 페리', amount: 191 },
            { label: '스톡홀름 시내 교통', amount: 180, currency: 'SEK' },

            { divider: '2주차 · 잉글랜드' },
            { label: '탐페레 ↔ 공항 * 2', amount: 31.6 },
            { label: '영국 런던 왕복 항공권', amount: 57 },
            { label: '런던 시내 교통', amount: 67, currency: 'GBP' },

            { divider: '3주차 · 로바니에미 & 트롬쇠' },
            { label: '탐페레 ~ 로바니에미 기차', amount: 79 },
            { label: '로바니에미 ~ 트롬쇠 항공권', amount: 149 },
            { label: '트롬쇠 ~ 헬싱키 항공권', amount: 502, currency: 'NOK' },

            { divider: '4주차 · 코펜하겐' },
            { label: '코펜하겐 지하철', amount: 60, currency: 'DKK' },
        ]
    },
    {
        icon: '🍔', title: '식비 및 생활비',
        items: [
            { label: '탐페레 한 달 마트 식재료', amount: 650 },
            { label: '영국 런던 2박 3일 식비', amount: 85, currency: 'GBP' },
            { label: '헬싱키 2박 3일 식비', amount: 100 }
        ]
    },
    {
        icon: '🏠', title: '추가 숙박비 (탐페레 제외)',
        items: [
            { label: '영국 런던 2박 3일 숙소', amount: 255, currency: 'GBP' },
            { label: '헬싱키 2박 숙소 (놀리 헤르토니에미)', amount: 120 }
        ]
    },
    {
        icon: '⚽', title: '문화 및 액티비티',
        items: [
            { label: '탐페레 로컬 사우나 (주 2~3회)', amount: 130 },
            { label: '토트넘 홋스퍼 경기 직관 티켓', amount: 85, currency: 'GBP' },
            { label: '현지 박물관 및 관광 입장료', amount: 100 }
        ]
    },
    {
        icon: '🆘', title: '비상 예비비',
        items: [
            { label: '환율 변동 및 돌발 상황 여유 자금', amount: 460 }
        ]
    }
];

// 자동 계산 (직접 수정하지 마세요) - 현지 통화 항목은 현재 환율로 유로 환산하므로 환율이 바뀌면 합계도 바뀜
const itemEur = (item) => item.divider ? 0 : toEur(item.amount, item.currency);
const sumEur = (items) => items.reduce((sum, item) => sum + itemEur(item), 0);
const groupEur = (items, dividerIndex) => { // 구분선 소계: 다음 구분선(또는 끝) 전까지
    const nextDivider = items.findIndex((item, i) => i > dividerIndex && item.divider);
    return sumEur(items.slice(dividerIndex + 1, nextDivider === -1 ? items.length : nextDivider));
};
const getBudgetTotal = () => BUDGET_PLAN.reduce((sum, cat) => sum + sumEur(cat.items), 0);
