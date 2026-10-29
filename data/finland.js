// data/finland.js - 핀란드 탭 주차별 일정 데이터
// (data/flights.js 다음에 로드되어야 합니다)

// 1. 주말 여행지 (주차의 trip에 아래 키를 적으면 주차 탭 배지, 메인 지도, 잉글랜드 탭에 자동 반영)
// coords: 있으면 메인 지도에 마커와 점선 표시 / note: 지도 팝업 보조 설명 (선택)
// from: 점선을 이어줄 출발지 (다른 여행지 키 또는 'helsinki', 없으면 탐페레에서 출발)
//       자기 주차가 없으면 출발지 여행의 주차를 따름
const TRIP_PLACES = {
    england:   { name: '잉글랜드', icon: '🇬🇧', city: '런던', coords: [51.5074, -0.1278] },
    rovaniemi: { name: '로바니에미', icon: '🎅', city: '로바니에미', coords: [66.5039, 25.7294], note: '산타마을' },
    tromso:    { name: '트롬쇠', icon: '🇳🇴', city: '트롬쇠', coords: [69.6492, 18.9553], from: 'rovaniemi' },
    stockholm: { name: '스톡홀름', icon: '🇸🇪', city: '스톡홀름', coords: [59.3293, 18.0686] },
    denmark:   { name: '코펜하겐', icon: '🇩🇰', city: '코펜하겐', coords: [55.6761, 12.5683], from: 'helsinki' } // 귀국편 경유지
};

// 2. 주차 구간 (start ~ end 사이의 날짜 카드가 자동 생성됨)
const FINLAND_WEEKS = [
    { label: '1주차', start: '2027-01-03', end: '2027-01-10', trip: 'stockholm' },
    { label: '2주차', start: '2027-01-11', end: '2027-01-17', trip: 'england' },
    { label: '3주차', start: '2027-01-18', end: '2027-01-24', trip: 'rovaniemi' },
    { label: '4주차', start: '2027-01-25', end: '2027-02-01', trip: 'denmark' }
];

// 3. 날짜별 일정 ('YYYY-MM-DD': { title, items })
// title: Day 카드 제목 (선택, 없으면 "일정 N개"로 표시)
// items: 헬싱키 탭과 같은 형식 { time, tone: 'blue' | 'gray' | 'green', title, desc }
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
            { time: RETURN_FIRST.from.time, tone: 'blue', title: '헬싱키 출발 ✈️', desc: `${RETURN_FIRST.flightNo}편으로 ${RETURN_FIRST.to.city} 경유 귀국` }
        ]
    }
};
