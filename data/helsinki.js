// data/helsinki.js - 헬싱키 탭 (0주차 헬싱키 2박 3일) 일정 데이터
// tone: 'blue'(주요 이동) | 'gray'(일반 일정) | 'green'(투어 관련)
// places: 일정 아래에 장소 목록 (선택) [{ name: '장소 이름', desc: '설명', map: 'Google 지도 검색어', coords: [위도, 경도] }]
//         name 외에는 생략 가능, coords가 있는 장소는 일정 아래 작은 지도에 번호 핀으로 표시
// stay: 숙소 카드 + 지도 (mapId는 지도 상자 id, coords는 [위도, 경도] → 숫자만 바꾸면 지도 위치가 바뀜)
// (data/flights.js 다음에 로드되어야 합니다)

const HELSINKI_WEEK_LABEL = '0주차'; // 헬싱키 탭 제목, 메인 지도 팝업, 경로 칩에 표시 (탐페레 1주차 전)

const HELSINKI_DAYS = [
    {
        day: 1,
        title: '1월 1일 (금) : 헬싱키 도착',
        items: [
            { time: OUTBOUND_LAST.to.time, tone: 'blue', title: '헬싱키 공항 도착 🛬', desc: '입국 심사는 코펜하겐에서 완료했으므로 수하물만 수령' },
            { time: '12:00', tone: 'blue', title: '헬싱키 중앙역 도착🚄 및 숙소 이동', desc: '중앙역에서 숙소로 이동 (짐보관)' },
            { time: '13:00', tone: 'green', title: '헬싱키 시내 탐방 및 점심', desc: '동부 중심. 공휴일이므로 쉬는지 아닌지 잘 체크 한 뒤 돌아다닐 것. 3~4시가 일몰중인 블루 아워.',
                places: [
                    { name: '원로원 광장 (Senate Square)', desc: '헬싱키 대성당 앞 랜드마크. 계단을 올라 가벼운 파노라마 감상 가능. 서쪽에는 국립도서관과 헬싱키 대학교, 동쪽에는 기사원, 정부 청사 등이 몰려있음.', map: 'Senate Square Helsinki', coords: [60.1695, 24.9522] },
                    { name: '헬싱키 시장 광장(Helsinki Market Square)', desc: '헬싱키 대표 야외 시장. 지락실에서 이영지와 나PD가 데이트(?)를 즐긴 바로 그 곳. 다만 신정이라 쉴 가능성이 있으니 다음날이나 마지막에 다시 방문도 고려', map: 'Helsinki Market Square', coords: [60.1676, 24.9536] },
                    { name: '우스펜스키 대성당', desc: '붉은 벽돌의 정교회 성당, 언덕 위 항구 전망이 유명. 건너편 스카이휠도 같이 내다보는 풍경이 좋음.', map: 'Uspenski Cathedral Helsinki', coords: [60.1685, 24.9599] },
                    { name: '에스플라나디 공원 (Esplanadi Park)', desc: '헬싱키의 대표적인 공원으로, 겨울에는 눈 덮인 풍경이 아름다움.', map: 'Esplanadi Park Helsinki', coords: [60.1675, 24.9476] },
                    
                ] },
            { time: '17:00', tone: 'gray', title: '체크인 및 휴식', desc: '시차 적응 및 비행 피로 해소.' },
            { time: '18:30', tone: 'gray', title: '마트 투어 및 저녁', desc: '숙소 근처 마트에서 다음날 저녁까지 가벼운 장보기. 물가 체험 겸 한바퀴 쭉 다 보기' },
            { time: '20:00', tone: 'gray', title: '시설 내 휴식', desc: '호텔 내 사우나 사용 및 하루 마무리' }
                ],
        stay: {
            badge: '1.1 (금) ~ 1.3 (일) 2박',
            name: '놀리 헤르토니에미 (Noli Herttoniemi)',
            shortName: '놀리 헤르토니에미',
            flag: '🏙️',
            mapId: 'map-helsinki',
            coords: [60.1967, 25.0355], 
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
            { time: '9:00', tone: 'gray', title: '기상 및 아침 식사', desc: '전날 사온 장으로 간단히 해결' },
            { time: '10:00', tone: 'green', title: '수오멘리나 요새섬 및 점심', desc: '헬싱키 남쪽 항구에서 페리로 15분. 핀란드 전쟁 당시 러시아가 건설한 요새섬. 겨울에는 눈 덮인 풍경이 아름다움.',
                    places: [
                    
                    { name: '수오멘리나 페리 선착장', desc: '헬싱키 남쪽 항구에서 페리로 15분. 요새섬 입장료는 무료이며, 겨울에는 눈 덮인 풍경이 아름다움.', map: 'Suomenlinna Ferry Terminal', coords: [60.1674, 24.9556] },
                    { name: '수오멘리나 요새섬 (Suomenlinna Fortress)', desc: '18세기 스웨덴이 러시아 견제를 위해 건설한 요새섬. 1808년 핀란드 전쟁 중 러시아에 함락됨. 겨울에는 눈 덮인 풍경이 아름다움.', map: 'Suomenlinna Fortress', coords: [60.1454, 24.9881] }
                ]
             },
            { time: '13:30', tone: 'green', title: '헬싱키 2차 시내 투어', desc: '서부 중심. 주말인 점을 감안할 것.',
                 places: [
                    { name: '캄피 예배당(Kamppi Chapel)', desc: '헬싱키 시내의 아름다운 예배당. 입장료는 €5. 현대적인 디자인과 따뜻한 분위기로 유명. 외부 소음이 차단되어 고요함을 체험할 수 있다.', map: 'Kamppi Chapel', coords: [60.1695, 24.9359] },
                    { name: '템펠리아우키오 교회 / 암석교회(Temppeliaukio Church)', desc: '헬싱키 시내의 독특한 교회. 입장료는 €8. 자연 암반을 다이너마이트로 터트려 만든 공간으로, 독특한 분위기와 디자인으로 유명.', map: 'Temppeliaukio Church', coords: [60.1731, 24.9252] },
                    { name: '시벨리우스 공원', desc: '헬싱키 시내의 아름다운 공원. 카페 레가타와 시벨리우스 기념비도 유명.', map: 'Sibelius Park', coords: [60.1815, 24.9140] },
                    { name: '국회의사당', desc: '헬싱키 시내의 역사적인 건물. 다양한 정치 및 문화 행사가 열리는 장소. 건너편의 핀란디아 홀과 함께 역으로 돌아가는 길에 보기 좋음.', map: 'Parliamentary Building Helsinki', coords: [60.1727, 24.9330] },
                    { name: '아모스 렉스 미술관', desc: '헬싱키 시내의 현대 미술관. 입장료는 €5. 다양한 전시와 프로그램으로 유명.', map: 'Amos Rex Helsinki', coords: [60.1705, 24.9362] },
                    { name: '키아스마 미술관', desc: '또다른 현대 미술관. 입장료는 €13. 역시나 다양한 전시와 프로그램으로 유명.', map: 'Kiasma Art Gallery', coords: [60.1715, 24.9369] }
                ]
             },
             { time: '18:00', tone: 'gray', title: '복귀 후 저녁', desc: '전날 사온 장으로 해결. 부족하면 또 장보기.' },
             { time: '19:30', tone: 'gray', title: '시설 내 사우나', desc: '사우나 이용으로 휴식 후 회복' },
        ]
    },
    {
        day: 3,
        title: '1월 3일 (일) : 헬싱키 ➔ 탐페레',
        items: [
            { time: '9:00', tone: 'gray', title: '기상 및 아침 식사 후 체크아웃', desc: '전날 사온 장으로 간단히 해결' },
            { time: '10:30', tone: 'green', title: '헬싱키 마무리 투어', desc: '중앙역에 짐 보관 후 못 본 곳 둘러보기.',
                places: [
                    { name: '헬싱키 시장 광장(Helsinki Market Square)', desc: '헬싱키 대표 야외 시장. 혹시나 첫날에 방문하지 못했다면 이 때 재방문.', map: 'Helsinki Market Square', coords: [60.1676, 24.9536] },
                    { name: '아카테미넨 서점', desc: '채광 프리즘 창문이 돋보이는, 북유럽 최대 규모의 서점. 2층에 카페도 존재한다.', map: 'Akateeminen Kirjakauppa', coords: [60.1681, 24.9437] }
                ]
             },
            { time: '12:30', tone: 'gray', title: '중앙역 이동 후 역사 내 가벼운 점심', desc: '중앙역 내부 카페, 서브웨이 등에서 점심 해결 후 VR 기차 플랫폼 대기. 혹은 기차 내부에서 식사도 고려.' },
            { time: '13:20', tone: 'blue', title: '탐페레행 기차 출발 🌲', desc: 'VR 고속열차 탑승. 눈 내리는 창밖 풍경 감상 (약 1h 40m 소요)' },
            { time: '15:00', tone: 'blue', title: '탐페레 거점 정착 🏠', desc: '에어비앤비(Hatanpään Valtatie 4) 체크인 및 마트 장보기' }
        ]
    }
];
