// data/england.js - 런던 탭 (2주차 주말, 3박 4일 + 토트넘 직관) 일정 데이터
// 형식은 data/helsinki.js와 같음 (tone, places, stay 설명은 그 파일 맨 위 참고)
// stayAfter: 숙소 카드를 그 시각 일정 바로 밑에 붙임 (없으면 그날 일정 맨 아래)
// flight: 그날 탭 맨 아래에 붙일 항공편 바우처 (ENGLAND_FLIGHTS 중 하나)
// 시각은 모두 그 나라 현지 시각: 핀란드(헬싱키) = 영국(런던) + 2시간
// stay.mapId는 지도마다 달라야 함 (헬싱키 'map-helsinki', 스톡홀름 'map-turku-port', 'map-stockholm-port')
// '미정'인 시각과 장소는 정해지면 바꿔 주세요

// 런던 왕복 항공편 바우처 (라이언에어, 형식은 data/flights.js와 같음 → Day 1, Day 4 탭 맨 아래에 표시)
// 아래 일정의 비행기 시각/편명도 여기서 가져오므로, 바뀌면 여기만 고치면 됨
const ENGLAND_FLIGHTS = [
    {
        badge: '런던행', tone: 'blue',
        legs: [
            {
                flightNo: 'FR2345', duration: '3h 10m',
                from: { code: 'HEL', city: '헬싱키', time: '23:40', date: '2027-01-15' },
                to:   { code: 'STN', city: '런던 스탠스테드', time: '00:50', date: '2027-01-16' }
            }
        ]
    },
    {
        badge: '헬싱키행', tone: 'red',
        legs: [
            {
                flightNo: 'FR2344', duration: '2h 50m',
                from: { code: 'STN', city: '런던 스탠스테드', time: '15:00', date: '2027-01-18' },
                to:   { code: 'HEL', city: '헬싱키', time: '19:50', date: '2027-01-18' }
            }
        ]
    }
];
const LONDON_OUT = ENGLAND_FLIGHTS[0].legs[0]; // 헬싱키 → 런던
const LONDON_BACK = ENGLAND_FLIGHTS[1].legs[0]; // 런던 → 헬싱키

const ENGLAND_DAYS = [
    {
        day: 1,
        title: '1월 15일 (금) : 탐페레 ➔ 헬싱키 공항 ➔ 런던',
        items: [
            { time: '미정', tone: 'blue', title: '탐페레 ➔ 헬싱키 공항 기차 🚄', desc: '약 2시간. 공항역(Lentoasema)까지 바로 가는 열차로. 출발 2시간 전(21:40)까지 공항 도착하도록 예약 후 시각 수정' },
            { time: '21:40', tone: 'gray', title: '헬싱키 공항 도착', desc: '라이언에어는 온라인 체크인 필수 (탑승권은 앱에). 무료 가방은 좌석 밑에 들어가는 40×30×20cm 하나뿐이니 크기 확인' },
            { time: LONDON_OUT.from.time, tone: 'blue', title: `런던행 출발 ✈️ ${LONDON_OUT.flightNo}`, desc: '헬싱키 반타 → 런던 스탠스테드, 약 3시간 10분 (도착은 영국 시각)' }
        ],
        flight: ENGLAND_FLIGHTS[0] // 그날 탭 맨 아래에 런던행 바우처
    },
    {
        day: 2,
        title: '1월 16일 (토) : 런던 도착 & 토트넘 직관',
        items: [
            { time: LONDON_OUT.to.time, tone: 'blue', title: '런던 스탠스테드 도착 🇬🇧', desc: '영국 시각 (핀란드보다 2시간 느림). 입국 심사 후 시내로' },
            { time: '01:30', tone: 'blue', title: '공항 ➔ 웸블리 심야 이동 🚌', desc: 'National Express A6 공항버스로 핀칠리 로드(Finchley Road)까지 → 주빌리선 나이트 튜브로 웸블리 파크역. 새벽 버스 시간표는 출발 전 확인' },
            { time: '03:00', tone: 'gray', title: '숙소 도착 및 휴식', desc: '새벽 도착이라 숙소에 늦은 체크인을 미리 알려 두기' },
            { time: '13:00', tone: 'blue', title: '경기장으로 이동 🚇', desc: '웸블리 파크 → 토트넘 헤일역 (주빌리선 → 빅토리아선, 약 1시간) 후 걸어서 경기장. 경기 2시간 전쯤 출발' },
            { time: '15:00', tone: 'green', title: '토트넘 홋스퍼 경기 ⚽', desc: '홈경기 직관. 경기 전후 공식 스토어도 들러 보기',
                places: [
                    { name: '토트넘 홋스퍼 스타디움 (Tottenham Hotspur Stadium)', desc: '토트넘의 홈구장. 가까운 역은 화이트 하트 레인 / 토트넘 헤일', map: 'Tottenham Hotspur Stadium', coords: [51.6043, -0.0664] }
                ] },
            { time: '17:00', tone: 'gray', title: '경기 후 1시간 정도 분위기와 스타디움 즐기기', desc: '혼잡도 회피 겸 서둘러서 나가지 않고 최대한 시간을 보내다 출발.' },
            { time: '18:00', tone: 'gray', title: '저녁 식사', desc: '경기장 근처 식당에서 간단히 식사 후 숙소로 이동' }
        ],
        stayAfter: '03:00',
        stay: {
            badge: '1.16 (토) ~ 1.18 (월) 3박',
            name: '프리미어 인 런던 웸블리 스타디움 (Premier Inn London Wembley Stadium)',
            shortName: '프리미어 인 웸블리 스타디움',
            flag: '🏨',
            mapId: 'map-london',
            coords: [51.5557, -0.2842], // 1 Wembley Park Boulevard, HA9 0GG (대략적인 위치, 다르면 숫자만 바꾸기)
            notes: [
                '1 Wembley Park Boulevard, London HA9 0GG',
                '가까운 역: 웸블리 파크(Wembley Park, 주빌리선)',
                '1.16 새벽 3시쯤 도착 예정'
            ],
            mapUrl: 'https://maps.google.com/?q=Premier+Inn+London+Wembley+Stadium'
        }
    },
    {
        day: 3,
        title: '1월 17일 (일) : 런던 시내',
        items: [
            { time: '미정', tone: 'green', title: '런던 시내 일정', desc: '정해지면 장소(places)를 추가' }
        ]
    },
    {
        day: 4,
        title: '1월 18일 (월) : 런던 ➔ 헬싱키 ➔ 탐페레',
        items: [
            { time: '11:00', tone: 'gray', title: '체크아웃 후 공항으로 🚆', desc: '웸블리 파크 → 토트넘 헤일역 (주빌리선 → 빅토리아선)에서 스탠스테드 익스프레스로 환승. 총 1시간 30분~2시간, 출발 2시간 전(13:00)까지 공항 도착' },
            { time: '13:00', tone: 'gray', title: '런던 스탠스테드 공항 도착', desc: '라이언에어 탑승권 확인. 남은 파운드는 공항에서 정리' },
            { time: LONDON_BACK.from.time, tone: 'blue', title: `헬싱키행 출발 ✈️ ${LONDON_BACK.flightNo}`, desc: '런던 스탠스테드 → 헬싱키 반타, 약 2시간 50분 (도착은 핀란드 시각)' }
        ],
        flight: ENGLAND_FLIGHTS[1] 
    }
];
