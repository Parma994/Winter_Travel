// data/estonia.js - 에스토니아 탭 (1주차 탈린 & 헬싱키) 일정 데이터
// tone: 'blue'(주요 이동) | 'gray'(일반 일정) | 'green'(탐페레 관련)
// stay.mapId는 app.js의 Leaflet 지도 초기화와 연결되므로 바꾸지 마세요.
// (data/flights.js 다음에 로드되어야 합니다)

const ESTONIA_DAYS = [
    {
        day: 1,
        title: '1월 1일 (금) : 헬싱키 ➔ 탈린',
        items: [
            { time: OUTBOUND_LAST.to.time, tone: 'blue', title: '헬싱키 공항 도착 🛬', desc: '입국 심사는 코펜하겐에서 완료했으므로 수하물만 수령' },
            { time: '12:00', tone: 'gray', title: '중앙역 짐 보관 및 점심 식사 🧳', desc: '공항철도 탑승. 대형 캐리어는 중앙역 지하 락커에 맡기고 백팩만 소지' },
            { time: '15:30', tone: 'blue', title: '페리 탑승 및 출항 🚢', desc: '서부터미널 T2에서 탈링크 실야(Megastar) 탑승' },
            { time: '17:45', tone: 'blue', title: '탈린 도착 🇪🇪', desc: '항구에서 Bolt 택시로 이동 및 체크인 준비' },
            { time: '18:30', tone: 'gray', title: '올드타운 야경 및 저녁 식사 🌙', desc: '툼페아 언덕, 시청사 광장 산책 후 중세풍 로컬 디너' }
        ],
        stay: {
            badge: '1.1 (금) 1박 / 무인 체크인',
            name: '시티박스 탈린 (Citybox Tallinn)',
            flag: '🇪🇪',
            mapId: 'map-tallinn',
            notes: [
                '페리 터미널 및 올드타운 정문 사이 로테르만 지구 위치',
                '1층 키오스크를 통한 24시간 비대면 셀프 체크인'
            ],
            mapUrl: 'https://maps.google.com/?q=Citybox+Tallinn'
        }
    },
    {
        day: 2,
        title: '1월 2일 (토) : 탈린 ➔ 헬싱키',
        items: [
            { time: '08:30', tone: 'gray', title: '올드타운 아침 산책 🏰', desc: '성 올라프 교회 외관, 장인들의 골목 등 오전에 압축 관람' },
            { time: '10:30', tone: 'gray', title: '체크아웃 및 터미널 이동 🚶', desc: '숙소 체크아웃 후 탈린 D-터미널 도착' },
            { time: '12:00', tone: 'blue', title: '페리 탑승 ➔ 헬싱키 복귀 🚢', desc: '선내에서 점심식사 및 바다 풍경 감상' },
            { time: '15:00', tone: 'blue', title: '헬싱키 시내 진입 🇫🇮', desc: '중앙역 방향으로 이동 및 숙소 체크인 준비' },
            { time: '15:30', tone: 'gray', title: '헬싱키 시내 투어 & 바다 사우나 🧖‍♂️', desc: '헬싱키 대성당, 에스플라나디 공원 야경 후 Löyly 등 사우나 방문' }
        ],
        stay: {
            badge: '1.2 (토) 1박 / 24시간 리셉션',
            name: '호텔 아서 (Hotel Arthur)',
            flag: '🇫🇮',
            mapId: 'map-helsinki',
            notes: [
                '헬싱키 중앙역 도보 4~5분 거리의 클래식 호텔',
                '원로원 광장 및 헬싱키 대성당 도보 3분 컷 접근성'
            ],
            mapUrl: 'https://maps.google.com/?q=Hotel+Arthur+Helsinki'
        }
    },
    {
        day: 3,
        title: '1월 3일 (일) : 헬싱키 ➔ 탐페레',
        items: [
            { time: '09:30', tone: 'gray', title: '헬싱키 건축 투어 🏛️', desc: '숙소 체크아웃 후 오디(Oodi) 도서관, 암석 교회 집중 관람' },
            { time: '14:30', tone: 'gray', title: '수하물 회수 및 기차 탑승 🚄', desc: '중앙역 보관함에서 캐리어를 찾은 후 VR 기차 플랫폼 대기' },
            { time: '15:30', tone: 'green', title: '탐페레행 기차 출발 🌲', desc: 'VR 고속열차 탑승. 눈 내리는 창밖 풍경 감상 (약 1h 40m 소요)' },
            { time: '17:30', tone: 'green', title: '탐페레 거점 정착 🏠', desc: '에어비앤비(Hatanpään Valtatie 4) 체크인 및 마트 장보기' }
        ]
    }
];
