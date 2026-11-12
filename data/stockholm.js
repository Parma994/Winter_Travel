// data/stockholm.js - 스웨덴 탭 (1주차 스톡홀름 + 투르쿠, 야간 페리 왕복) 일정 데이터
// 형식은 data/helsinki.js와 같음 (tone, places, stay 설명은 그 파일 맨 위 참고)
// ⚠️ 페리/기차 시각은 예약한 Viking Line 시간표 기준으로 확인해 주세요
// stay.mapId는 지도 상자 이름이라 모든 지도마다 달라야 함 (같으면 두 번째 지도가 안 그려짐)
//   헬싱키 'map-helsinki' / 여기 'map-turku-port', 'map-stockholm-port'

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
            badge: '1.6 (수) 배 타는 곳',
            name: '야간 페리 선실 (투르쿠 → 스톡홀름)',
            shortName: '투르쿠 항구 터미널',
            flag: '⛴️',
            pin: '⛴️',
            mapId: 'map-turku-port',
            coords: [60.4339, 22.2212], // 투르쿠 항구 (1.6 출발, 1.8 도착 모두 여기)
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
            { time: '07:45', tone: 'green', title: '감라스탄(구시가지) 투어', desc: '좁은 골목과 색색의 건물이 모인 구시가지. 아침이라 사람이 적음.',
                places: [
                    { name: 'T-Centralen', desc: '스톡홀름 지하철 중심역. 암반 벽화 등의 예술 작품이 유명하다.', map: 'T-Centralen Stockholm', coords: [59.3311, 18.0599] },
                    { name: '쿵스트래드고르덴 (Kungsträdgården)', desc: '스톡홀름 중심부의 공원. 겨울에는 얼음 조각 전시. 이곳 역시 지하철 역 전시로도 유명하다.', map: 'Kungsträdgården Stockholm', coords: [59.3307, 18.0730] },
                    { name: '구스타프 3세 동상 (Gustav III)', desc: '감라스탄 섬 동부에 위치한 동상. 일출을 보기에 아주 좋은 광장이자 대로이기도 하다.', map: 'Gustav III Stockholm', coords: [59.3268, 18.0750] },
                    { name: '스톡홀름 대성당 (Storkyrkan)', desc: '9시 30분에 개장. 스웨덴 국교 루터교의 중심 성당. 구시가지 중심부에 위치. 입장료 120SEK. 미술관처럼 관람도 가능하다.', map: 'Storkyrkan Stockholm', coords: [59.3255, 18.0719] },
                    { name: '스톡홀름 왕궁 (Kungliga slottet)', desc: '10시에 개장. 야외 정원은 무료 입장이 가능하다. 근위병 교대식은 12시 15분.', map: 'Royal Palace Stockholm', coords: [59.3268, 18.0717] },
                    { name: '노벨 박물관 (Nobelprismuseet)', desc: '11시 개장. 입장료는 120SEK. 내부에 노벨상 수상자들의 전시가 있다. 내부 식당도 있으니 점심도 여기서 해결.', map: 'Nobel Prize Museum Stockholm', coords: [59.3253, 18.0706] },
                    { name: '우편 박물관 (Postmuseum)', desc: '도장이나 기념 우표를 구매하기 좋은 곳. 골목과 주변 매장도 이 때 돌아볼만 하다.', map: 'Postmuseum Stockholm', coords: [59.3241, 18.0681] }
                ]
            },
            { time: '13:00', tone: 'green', title: '유르고르덴 섬', desc: '구시가지에서 지하철과 트램으로 이동.',
                places: [
                    { name: '스트란드베겐 (Strandvägen)', desc: '스톡홀름의 대표적인 부촌 거리. 유르고르덴 섬으로 들어가는 거리로, 도보로 이동하며 구경할만 하다.', map: 'Strandvägen Stockholm', coords: [59.3317, 18.0882] },
                    { name: '바사 박물관 (Vasamuseet)', desc: '17세기에 침몰했다가 인양된 전함을 통째로 전시. 입장료는 195SEK.', map: 'Vasa Museum Stockholm', coords: [59.3280, 18.0914] }
                ]
            },
            { time: '15:00', tone: 'green', title: '피카(Fika) 타임 ☕', desc: '시나몬 번과 커피로 스웨덴식 휴식. 해 지기 전후로 시내 야경',
                places: [
                    { name: '베테-카텐 (Vete-Katten)', desc: '스웨덴 전통 카페이자 베이커리. 1928년부터 100년 가까이 운영중이다. 프린세스 케이크를 추천.', map: 'Vete-Katten Stockholm', coords: [59.3341, 18.0585] },
                    { name: '드로트닝가탄 (Drottninggatan)', desc: '스톡홀름 중심부의 번화가. 쇼핑과 식사, 카페를 즐기기 좋다.', map: 'Drottninggatan Stockholm', coords: [59.3345, 18.0630] },
                    { name: '회토리샬렌 (Hötorgshallen)', desc: '스톡홀름 중심부의 실내 시장. 다양한 스웨덴 음식과 기념품을 판매. 가능하다면 여기서 저녁을 해결하거나 배에서 먹을걸 사두기.', map: 'Hötorgshallen Stockholm', coords: [59.3325, 18.0620] },
                    { name: '스톡홀름 시청 (Stadshuset)', desc: '전망대(탑)는 보수 공사로 2029년까지 닫혀 있다. 대신 시청 앞 물가에서 감라스탄과 리다르홀멘 쪽 야경을 감상하기.', map: 'Stockholm City Hall', coords: [59.3275, 18.0543] },
                    { name: '카타리나 엘리베이터 (Katarina Elevator)', desc: '스톡홀름의 유명한 엘리베이터. 시내 야경을 무료로 감상할 수 있다.', map: 'Katarina Elevator Stockholm', coords: [59.3199, 18.0731] }
                ]
            },
            { time: '18:30', tone: 'gray', title: '페리 터미널 이동', desc: '출항 1시간 전까지 도착' },
            { time: '20:00', tone: 'blue', title: '투르쿠행 야간 페리 출발 ⛴️', desc: '선실에서 1박' }
        ],
        stay: {
            badge: '1.7 (목) 배 타는 곳',
            name: '야간 페리 선실 (스톡홀름 → 투르쿠)',
            shortName: '스톡홀름 항구 터미널',
            flag: '⛴️',
            pin: '⛴️',
            mapId: 'map-stockholm-port',
            coords: [59.3164, 18.0960], // 스톡홀름 항구 (1.7 아침 도착, 저녁 출발 모두 여기)
            notes: [
                'Viking Glory 호. Inside Piccolo Two 클래스 호실.'
            ],
            mapUrl: 'https://maps.google.com/?q=Viking+Line+Stadsg%C3%A5rden+Terminal+Stockholm' // 바이킹 라인 투르쿠행 터미널
        }
    },
    {
        day: 3,
        title: '1월 8일 (금) : 투르쿠 당일치기 ➔ 탐페레',
        items: [
            { time: '07:35', tone: 'blue', title: '투르쿠 도착 🇫🇮', desc: '하선 후 시내로 이동' },
            { time: '08:00', tone: 'green', title: '투르쿠 시내 탐방', desc: '핀란드의 옛 수도. 항구에서 아우라 강을 따라 시내까지 버스로 이동 가능.',
                places: [
                    { name: '투르쿠 마켓홀 (Kauppahalli)', desc: '1896년부터 이어진 실내 시장. 아침을 여기서 해결한다.', map: 'Turku Market Hall', coords: [60.4504, 22.2644] },
                    { name: '시립 도서관 (Turku City Library)', desc: '투르쿠 시청 근처에 위치한 도서관. 건물 외관이 독특하다.', map: 'Turku City Library', coords: [60.4510, 22.2665] },
                    { name: '아우라 강변 (Aurajoki)', desc: '강을 따라 카페와 배 레스토랑이 늘어선 산책로. 일출을 보며 걸어서 성으로 이동한다.', map: 'Aurajoki Turku', coords: [60.4487, 22.2693] },
                ]
            },
            { time: '10:00', tone: 'green', title: '투르쿠 성(Turun linna) 관람', desc: '10시 개장. 입장료는 €9. 관람에 1~2시간 소요된다고 한다.' },
            { time: '12:00', tone: 'gray', title: '투르쿠 시내로 이동', desc: '1번 버스 혹은 체력이 남았다면 도보로 시내로 복귀. 투르쿠 역 근처 레스토랑에서 점심.' },
            { time: '14:05', tone: 'blue', title: '투르쿠 ➔ 탐페레 기차 🚄', desc: '투르쿠역에서 약 1시간 40분' },
            { time: '15:47', tone: 'blue', title: '탐페레 복귀 🏠', desc: '주말은 탐페레에서 휴식' }
        ]
    }
];
