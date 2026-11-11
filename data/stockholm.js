// data/stockholm.js - 스웨덴 탭 (1주차 스톡홀름 + 투르쿠, 야간 페리 왕복) 일정 데이터
// 형식은 data/helsinki.js와 같음 (tone, places, stay 설명은 그 파일 맨 위 참고)
// ⚠️ 페리/기차 시각은 대략적인 값: 예약한 선사(Viking Line / Tallink Silja) 시간표로 바꿔 주세요
// stay.mapId는 헬싱키(map-helsinki)와 겹치지 않게 'map-stockholm'처럼 새 이름으로

const STOCKHOLM_DAYS = [
    {
        day: 1,
        title: '1월 6일 (수) : 탐페레 ➔ 투르쿠 ➔ 야간 페리',
        items: [
            { time: '18:10', tone: 'blue', title: '탐페레 ➔ 투르쿠 기차 🚄', desc: '약 1시간 50분. 투르쿠 항구역(Turku satama)까지 가는 열차면 바로 터미널 앞 도착. 1월 6일은 핀란드 공휴일(주현절)이라 열차 시간표 확인' },
            { time: '20:10', tone: 'gray', title: '투르쿠 항구 체크인', desc: '바로 앞이라지만 35분 마감이니 서두를 것.' },
            { time: '20:55', tone: 'blue', title: '스톡홀름행 야간 페리 출발 ⛴️', desc: '선실에서 1박. 선내 뷔페, 면세점 구경 후 휴식' }
        ],
        stay: {
            badge: '1.6 (수) ~ 1.8 (금) 선내 2박',
            name: '야간 페리 선실 (투르쿠 ↔ 스톡홀름)',
            shortName: '투르쿠 항구 터미널',
            flag: '⛴️',
            mapId: 'map-stockholm',
            pin: '⛴️', 
            coords: [60.4339, 22.2212], // 투르쿠 항구 (출발/도착 모두 여기)
            notes: [
                'Viking Grace 호. Inside Piccolo Two 클래스 호실.'
            ],
            mapUrl: 'https://maps.google.com/?q=Turku+Harbour+Ferry+Terminal'
        }
    },
    {
        day: 2,
        title: '1월 7일 (목) : 스톡홀름 당일',
        items: [
            { time: '06:30', tone: 'blue', title: '스톡홀름 도착 🇸🇪', desc: '하선 후 도보로 슬루센 이동.' },
            { time: '07:00', tone: 'gray', title: '슬루센 카페(Fabrique) 도착 및 잠시 휴식', desc: '슬루센은 스톡홀름 시내 중심부. 구시가지와 유르고르덴 섬으로 이동 가능. 카페에서 조식 해결.' },
            { time: '08:00', tone: 'green', title: '감라스탄(구시가지) 산책', desc: '좁은 골목과 색색의 건물이 모인 구시가지. 아침이라 사람이 적음.',
                places: [
                    { name: '감라스탄 (Gamla stan)', desc: '스톡보리스 광장 주변의 알록달록한 건물이 대표 풍경.', map: 'Gamla stan Stockholm', coords: [59.3251, 18.0711] },
                    { name: '스톡홀름 왕궁 (Kungliga slottet)', desc: '근위병 교대식 시간 확인하고 가기.', map: 'Royal Palace Stockholm', coords: [59.3268, 18.0717] },
                    { name: '노벨 박물관 (Nobelprismuseet)', desc: '스톡보리스 광장에 있는 작은 박물관.', map: 'Nobel Prize Museum Stockholm', coords: [59.3250, 18.0706] }
                ] },
            { time: '11:00', tone: 'green', title: '유르고르덴 섬 & 점심', desc: '구시가지에서 트램 또는 페리로 이동.',
                places: [
                    { name: '바사 박물관 (Vasamuseet)', desc: '17세기에 침몰했다가 인양된 전함을 통째로 전시.', map: 'Vasa Museum Stockholm', coords: [59.3280, 18.0914] },
                    { name: '스칸센 (Skansen)', desc: '야외 민속 박물관. 겨울에는 해가 일찍 지니 시간 남으면.', map: 'Skansen Stockholm', coords: [59.3270, 18.1036] }
                ] },
            { time: '15:00', tone: 'gray', title: '피카(Fika) ☕', desc: '시나몬 번과 커피로 스웨덴식 휴식. 해 지기 전후로 시내 야경' },
            { time: '18:30', tone: 'gray', title: '짐 찾고 페리 터미널 이동', desc: '출항 1시간 전까지 도착' },
            { time: '19:30', tone: 'blue', title: '투르쿠행 야간 페리 출발 ⛴️', desc: '선실에서 1박' }
        ]
    },
    {
        day: 3,
        title: '1월 8일 (금) : 투르쿠 당일치기 ➔ 탐페레',
        items: [
            { time: '07:00', tone: 'blue', title: '투르쿠 도착 🇫🇮', desc: '하선 후 항구 바로 앞 투르쿠 성부터' },
            { time: '10:00', tone: 'green', title: '투르쿠 시내 탐방', desc: '핀란드의 옛 수도. 항구에서 아우라 강을 따라 시내까지 걸어서 이동 가능.',
                places: [
                    { name: '투르쿠 성 (Turun linna)', desc: '중세 성. 항구에서 걸어서 10분. 개관 시간 확인.', map: 'Turku Castle', coords: [60.4354, 22.2291] },
                    { name: '아우라 강변 (Aurajoki)', desc: '강을 따라 카페와 배 레스토랑이 늘어선 산책로.', map: 'Aurajoki Turku', coords: [60.4490, 22.2650] },
                    { name: '투르쿠 마켓홀 (Kauppahalli)', desc: '1896년부터 이어진 실내 시장. 점심 먹기 좋음.', map: 'Turku Market Hall', coords: [60.4504, 22.2644] },
                    { name: '투르쿠 대성당 (Turun tuomiokirkko)', desc: '핀란드 루터교의 중심 성당.', map: 'Turku Cathedral', coords: [60.4527, 22.2784] }
                ] },
            { time: '17:00', tone: 'blue', title: '투르쿠 ➔ 탐페레 기차 🚄', desc: '투르쿠역에서 약 1시간 50분' },
            { time: '19:00', tone: 'blue', title: '탐페레 복귀 🏠', desc: '주말은 탐페레에서 휴식' }
        ]
    }
];
