// data/stockholm.js - 스톡홀름 탭 (1주차 주말 여행) 일정 데이터
// 형식은 data/helsinki.js와 같음 (tone, places, stay 설명은 그 파일 맨 위 참고)
// ⚠️ 임시 일정: 날짜, 이동 수단, 숙소는 아직 미정이라 예시로 채워 둠
// stay.mapId는 헬싱키(map-helsinki)와 겹치지 않게 'map-stockholm'처럼 새 이름으로

const STOCKHOLM_DAYS = [
    {
        day: 1,
        title: '1월 8일 (금) : 탐페레 ➔ 스톡홀름',
        items: [
            { time: '15:00', tone: 'blue', title: '탐페레 출발 🚄', desc: '헬싱키(공항 또는 항구)로 이동. 항공편/페리 중 미정' },
            { time: '19:00', tone: 'blue', title: '스톡홀름 도착 ✈️', desc: '알란다 공항이면 Arlanda Express로 중앙역까지 약 20분' },
            { time: '20:30', tone: 'gray', title: '숙소 체크인 및 저녁', desc: '중앙역 근처 숙소에 짐 풀고 가볍게 저녁' }
        ],
        stay: {
            badge: '1.8 (금) ~ 1.10 (일) 2박',
            name: '스톡홀름 숙소 (미정)',
            shortName: '스톡홀름 숙소',
            flag: '🇸🇪',
            mapId: 'map-stockholm',
            coords: [59.3310, 18.0590], // 임시: 스톡홀름 중앙역
            notes: [
                '숙소 예약 후 이름/좌표/체크인 정보 업데이트'
            ],
            mapUrl: 'https://maps.google.com/?q=Stockholm+Central+Station'
        }
    },
    {
        day: 2,
        title: '1월 9일 (토) : 스톡홀름 시내',
        items: [
            { time: '09:30', tone: 'green', title: '감라스탄(구시가지) 산책', desc: '좁은 골목과 색색의 건물이 모인 구시가지. 오전에 사람이 적음.',
                places: [
                    { name: '감라스탄 (Gamla stan)', desc: '스톡보리스 광장 주변의 알록달록한 건물이 대표 풍경.', map: 'Gamla stan Stockholm', coords: [59.3251, 18.0711] },
                    { name: '스톡홀름 왕궁 (Kungliga slottet)', desc: '근위병 교대식 시간 확인하고 가기.', map: 'Royal Palace Stockholm', coords: [59.3268, 18.0717] },
                    { name: '노벨 박물관 (Nobelprismuseet)', desc: '스톡보리스 광장에 있는 작은 박물관.', map: 'Nobel Prize Museum Stockholm', coords: [59.3250, 18.0706] }
                ] },
            { time: '13:00', tone: 'green', title: '유르고르덴 섬 박물관 투어', desc: '구시가지에서 트램 또는 페리로 이동.',
                places: [
                    { name: '바사 박물관 (Vasamuseet)', desc: '17세기에 침몰했다가 인양된 전함을 통째로 전시.', map: 'Vasa Museum Stockholm', coords: [59.3280, 18.0914] },
                    { name: '스칸센 (Skansen)', desc: '야외 민속 박물관. 겨울에는 해가 일찍 지니 일찍 둘러보기.', map: 'Skansen Stockholm', coords: [59.3270, 18.1036] }
                ] },
            { time: '17:00', tone: 'gray', title: '피카(Fika) 및 저녁', desc: '시나몬 번과 커피로 스웨덴식 휴식 후 저녁' }
        ]
    },
    {
        day: 3,
        title: '1월 10일 (일) : 스톡홀름 ➔ 탐페레',
        items: [
            { time: '10:00', tone: 'green', title: '시청사 및 쇠데르말름', desc: '체크아웃 후 짐 보관, 남은 시간 시내 구경',
                places: [
                    { name: '스톡홀름 시청사 (Stadshuset)', desc: '노벨상 만찬이 열리는 곳. 내부는 가이드 투어로만 입장.', map: 'Stockholm City Hall', coords: [59.3275, 18.0543] },
                    { name: '포토그라피스카 (Fotografiska)', desc: '사진 미술관. 꼭대기 카페에서 시내 전망.', map: 'Fotografiska Stockholm', coords: [59.3178, 18.0857] }
                ] },
            { time: '15:00', tone: 'blue', title: '스톡홀름 출발 ✈️', desc: '공항 또는 항구로 이동' },
            { time: '20:00', tone: 'blue', title: '탐페레 복귀 🏠', desc: '다음 날 2주차 시작' }
        ]
    }
];
