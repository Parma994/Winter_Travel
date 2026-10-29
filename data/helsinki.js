// data/helsinki.js - 헬싱키 탭 (0주차 헬싱키 2박 3일) 일정 데이터
// tone: 'blue'(주요 이동) | 'gray'(일반 일정) | 'green'(탐페레 관련)
// stay: 숙소 카드 + 지도 (mapId는 지도 상자 id, coords는 [위도, 경도] → 숫자만 바꾸면 지도 위치가 바뀜)
// (data/flights.js 다음에 로드되어야 합니다)

const HELSINKI_WEEK_LABEL = '0주차'; // 헬싱키 탭 제목, 메인 지도 팝업, 경로 칩에 표시 (탐페레 1주차 전)

const HELSINKI_DAYS = [
    {
        day: 1,
        title: '1월 1일 (금) : 헬싱키 도착',
        items: [
            { time: OUTBOUND_LAST.to.time, tone: 'blue', title: '헬싱키 공항 도착 🛬', desc: '입국 심사는 코펜하겐에서 완료했으므로 수하물만 수령' }
        ],
        stay: {
            badge: '1.1 (금) ~ 1.3 (일) 2박',
            name: '놀리 헤르토니에미 (Noli Herttoniemi)',
            shortName: '놀리 헤르토니에미',
            flag: '🏙️',
            mapId: 'map-helsinki',
            coords: [60.1967, 25.0355], // ⚠️ 임시: 헤르토니에미 지하철역 부근 대략 위치 → 정확한 좌표로 수정 필요
            notes: [
                '헬싱키 2박 숙소 (위치/체크인 정보는 추후 업데이트)'
            ],
            mapUrl: 'https://maps.google.com/?q=Noli+Herttoniemi+Helsinki'
        }
    },
    {
        day: 2,
        title: '1월 2일 (토) : 헬싱키 시내',
        items: [
            { time: '15:30', tone: 'gray', title: '헬싱키 시내 투어 & 바다 사우나 🧖‍♂️', desc: '헬싱키 대성당, 에스플라나디 공원 야경 후 Löyly 등 사우나 방문' }
        ]
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
