// data/finland.js - 핀란드 탭 주차별 일정 데이터
// (data/flights.js 다음에 로드되어야 합니다)

// 1. 주차 구간 (start ~ end 사이의 날짜 카드가 자동 생성됨)
const FINLAND_WEEKS = [
    { label: '1주차', start: '2027-01-03', end: '2027-01-10'},
    { label: '2주차', start: '2027-01-11', end: '2027-01-17', trip : '🇬🇧 잉글랜드' },
    { label: '3주차', start: '2027-01-18', end: '2027-01-24', trip : '🎅 로바니에미' },
    { label: '4주차', start: '2027-01-25', end: '2027-02-01', trip : '🇩🇰 덴마크'  }
];

// 2. 날짜별 일정 ('YYYY-MM-DD': { title, items })
// title: Day 카드 제목 (선택, 없으면 "일정 N개"로 표시)
// items: 에스토니아 탭과 같은 형식 { time, tone: 'blue' | 'gray' | 'green', title, desc }
const returnFlight = FLIGHTS[1].legs[0]; // 귀국편 첫 비행기 정보를 그대로 사용

const FINLAND_SCHEDULE = {
    '2027-01-03': {
        title: '탐페레 도착 & 정착',
        items: [
            { time: '17:30', tone: 'green', title: '탐페레 거점 정착 🏠', desc: '에어비앤비(Hatanpään Valtatie 4) 체크인 및 마트 장보기' }
        ]
    },

    // 예시) 날짜를 키로 추가하면 해당 주차 탭에 자동으로 표시됩니다.
    // '2027-01-04': {
    //     title: '첫 평일 루틴 시작',
    //     items: [
    //         { time: '09:00', tone: 'gray', title: '전공 서적 정독 📚', desc: '숙소 창가 테이블' }
    //     ]
    // },

    '2027-02-01': {
        title: '체크아웃 & 귀국',
        items: [
            { time: '12:00', tone: 'blue', title: '에어비앤비 체크아웃 🧳', desc: '체크아웃 후 헬싱키 공항으로 이동' },
            { time: returnFlight.from.time, tone: 'blue', title: `헬싱키 출발 ✈️`, desc: `${returnFlight.flightNo}편으로 ${returnFlight.to.city} 경유 귀국` }
        ]
    }
};
