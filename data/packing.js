// data/packing.js - 출발 전 탭 패킹 리스트 데이터
// id: 체크 상태가 이 값으로 localStorage에 저장됩니다. 기존 항목의 id를 바꾸면 체크 기록이 사라지니 주의하세요.
// note: 회색 보조 설명 / warn: 빨간색 주의 문구 (둘 다 항목명 뒤에 괄호로 붙음)

const PACKING_BAGS = [
    {
        badge: '🎒 백팩',
        title: '기내 수하물',
        groups: [
            {
                icon: '🛂', title: '서류 및 금융',
                items: [
                    // 보조 설명이 항목명 중간에 들어가는 경우만 HTML로 직접 작성
                    { id: 'chk-passport', label: '여권 <span class="text-xs font-normal text-gray-400">(6개월 이상)</span> & UK ETA 승인서' },
                    { id: 'chk-cards', label: '트래블로그/비상용 신용카드 & 소액 환전' },
                    { id: 'chk-boucher', label: '바우처 캡처본 or 인쇄본' }
                ]
            },
            {
                icon: '🔌', title: '전자기기',
                items: [
                    { id: 'chk-battery', label: '대용량 보조배터리', warn: '위탁 불가' },
                    { id: 'chk-charger', label: '충전기 및 케이블' },
                    { id: 'chk-headphones', label: '이어폰' },
                    { id: 'chk-camera', label: '브이로그용 카메라' },
                    { id: 'chk-hotpack', label: '핫팩', note: '야외 촬영용' }
                ]
            },
            {
                icon: '🧥', title: '단기 파우치 (헬싱키 2박용)',
                items: [
                    { id: 'chk-underwear', label: '속옷 및 양말', note: '2일분' },
                    { id: 'chk-heattex', label: '방한 내의 1벌' },
                    { id: 'chk-swimsuit', label: '수영복 1벌', note: '헬싱키 사우나용' },
                    { id: 'chk-toothbrush', label: '소용량 세면도구', note: '100ml 이하' },
                    { id: 'chk-moisturizer', label: '보습제 및 인공눈물' }
                ]
            },
            {
                icon: '💊', title: '기내 비상약',
                items: [
                    { id: 'chk-medicine', label: '소화제 / 지사제 / 타이레놀' },
                    { id: 'chk-sleepmedicine', label: '기내용 안대 / 귀마개 / 수면유도제' }
                ]
            }
        ]
    },
    {
        badge: '🧳 캐리어',
        title: '위탁 수하물',
        groups: [
            {
                icon: '📚', title: '종이책 학습 & 아날로그 키트',
                items: [
                    { id: 'chk-books', label: '공부할/읽을 책' },
                    { id: 'chk-pens', label: '필기구 세트' },
                    { id: 'chk-diary', label: '스크랩용 다이어리 & 풀/테이프' },
                    { id: 'chk-scissors', label: '휴대용 가위/펜커터', warn: '기내 반입 불가' }
                ]
            },
            {
                icon: '🧥', title: '한 달 살기 방한 & 생활 의류',
                items: [
                    { id: 'chk-moreheattex', label: '방한 내의 여벌', note: '2~3벌' },
                    { id: 'chk-socks', label: '두꺼운 울 양말', note: '4~5켤레' },
                    { id: 'chk-clothes', label: '일상 상하의', note: '니트, 기모바지 등' },
                    { id: 'chk-pajamas', label: '편안한 실내복/잠옷 2벌' }
                ]
            },
            {
                icon: '🛒', title: '한 달 살기 생활 & 주방 용품',
                items: [
                    { id: 'chk-slipper', label: '도톰한 실내 룸슈즈', note: '한기 차단' },
                    { id: 'chk-multitap', label: '3구 멀티탭', note: '1.5m 선' },
                    { id: 'chk-food', label: '육수 코인, 고추장' },
                    { id: 'chk-bag', label: '에코백 or 장바구니' }
                ]
            },
            {
                icon: '🧴', title: '대용량 화장품 & 상비약 풀세트',
                items: [
                    { id: 'chk-lotion', label: '대용량 바디로션 / 수분크림 / 바세린' },
                    { id: 'chk-nailclipper', label: '손톱깎이 & 면봉' },
                    { id: 'chk-fullmedicine', label: '종합감기약, 파스, 밴드, 처방약', note: '1개월분' }
                ]
            }
        ]
    }
];
