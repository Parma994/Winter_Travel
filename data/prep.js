// data/prep.js - 출발 전 탭 준비 로드맵 & 당일 공항 여정 데이터
// (data/flights.js 다음에 로드되어야 합니다)

// 1. 준비 로드맵 카드 (가로 스크롤)
// tone: 'plain'(기본) | 'soft'(연한 강조) | 'strong'(진한 강조)
// id: 체크 상태가 이 값으로 localStorage에 저장됩니다. 기존 항목의 id를 바꾸면 체크 기록이 사라지니 주의하세요.
// checked: 저장된 기록이 없을 때의 기본 체크 상태
const PREP_ROADMAP = [
    {
        period: 'D-60 (10~11월)', title: '교통 & 핵심 숙소', tone: 'plain',
        items: [
            { id: 'prep-flight', label: '항공권 발권', checked: true },
            { id: 'prep-airbnb', label: '탐페레 에어비앤비 예약', checked: true },
            { id: 'prep-transit', label: '국가 간 이동편 예약' },
            { id: 'prep-passport-exp', label: '여권 유효기간(6개월) 확인' }
        ]
    },
    {
        period: 'D-30 (12월)', title: '세부 동선 & 투어', tone: 'soft',
        items: [
            { id: 'prep-route', label: '일자별 세부 동선 확정' },
            { id: 'prep-spurs', label: '토트넘 직관 티켓팅' },
            { id: 'prep-travelcard', label: '트래블카드 발급 & 환전' },
            { id: 'prep-insurance', label: '여행자 보험 가입' }
        ]
    },
    {
        period: 'D-7 (12월 말)', title: '최종 점검 & 패킹', tone: 'strong',
        items: [
            { id: 'prep-esim', label: '현지 e-SIM/유심 구매' },
            { id: 'prep-winterpack', label: '겨울 방한 의류 압축 패킹' },
            { id: 'prep-meds', label: '비상약 및 상비약 챙기기' },
            { id: 'prep-voucher-save', label: '바우처/여권 사본 오프라인 저장' }
        ]
    }
];

// 2. 출국 당일 공항 여정 (카드 사이 점선은 자동 연결, highlight: 강조 카드, 마지막 단계는 출국 첫 비행기 정보 사용)
const AIRPORT_STEPS = [
    { icon: '🚄', title: '목포역 출발', desc: '16:32 KTX' },
    { icon: '🔄', title: '광명역 환승', desc: '19:30 공항버스' },
    { icon: '🧳', title: '인천공항 T2', desc: '20:40 도착' },
    { icon: '🛂', title: '수속 & 식사', desc: '20:45 ~ 22:30' },
    { icon: '🛫', title: '탑승 & 이륙', desc: `${OUTBOUND_FIRST.from.time} ${OUTBOUND_FIRST.flightNo}`, highlight: true }
];
