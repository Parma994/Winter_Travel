// data/meals.js - 요리 탭 (오늘 뭐 먹지?) 메뉴 데이터 (모두 1인분 기준)
// 1. 종류: key는 아래 메뉴의 category에 그대로 적음 (순서대로 선택 버튼이 생김)
// 2. 메뉴 하나 = { name, fi, times, category, desc, difficulty, minutes, kcal, sides, storage, image, ingredients, steps }
//    fi: 핀란드어 메뉴 이름 (이름 아래 작게 표시, 생략 가능)
//    times: 어울리는 끼니 (MEAL_TIMES의 key, 그 끼니를 골랐을 때만 추천에 나옴 / 생략하면 모든 끼니)
//    difficulty: 1(쉬움) | 2(보통) | 3(어려움) / minutes: 예상 소요 시간(분) / kcal: 1인분 기준 대략적인 값
//    sides: 곁들이면 좋은 것 (추천 카드와 레시피 화면에 표시, 생략 가능)
//    storage: 다 먹고 남았을 때 보관법 (확정 화면과 "다 먹었어요" 뒤에 표시, 생략 가능)
//    image: 예시 사진 경로 (예: 'meals/aglio-olio.jpg', 생략하면 종류 아이콘으로 표시)
//           사진은 meals 폴더에 넣으면 되고, 한 번 본 사진은 sw.js가 자동으로 저장해서 오프라인에서도 보임
//    ingredients: [{ name: '재료', amount: '양', fi: '핀란드어 이름 (마트에서 찾기용, 생략 가능)' }]
//    steps: 레시피 순서 (문장 하나가 한 단계)
//    (여러 인분짜리를 넣고 싶으면 servings: 2 처럼 적으면 칼로리 옆에 "2인분"으로 표시)
// ⚠️ 먹은 기록은 메뉴 이름(name)으로 저장되므로, 이미 기록한 메뉴의 이름을 바꾸면 기록의 이름은 예전 그대로 남음

// 끼니: 요리 탭 맨 위에서 먼저 고름 (들어오면 지금 시각에 맞는 끼니가 골라져 있음, hour = 이 시각 전까지)
const MEAL_TIMES = [
    { key: 'breakfast', name: '아침', icon: '🌅', hour: 11 },
    { key: 'lunch', name: '점심', icon: '☀️', hour: 16 },
    { key: 'dinner', name: '저녁', icon: '🌙', hour: 24 }
];

const MEAL_CATEGORIES = [
    { key: 'noodle', name: '면', icon: '🍜' },
    { key: 'rice', name: '밥·죽', icon: '🍚' },
    { key: 'bread', name: '빵', icon: '🥪' },
    { key: 'stew', name: '스튜·수프', icon: '🍲' },
    { key: 'plate', name: '감자 한 접시', icon: '🥔' },
    { key: 'quick', name: '간단식', icon: '⚡' }
];

// 직접 추가하는 기록의 종류 (추천에는 안 나오고, 먹은 기록 달력에서 날짜를 고른 뒤 직접 적을 때만 사용)
const MEAL_EXTRA_TYPES = [
    { key: 'eatout', name: '외식', icon: '🍴' },
    { key: 'takeout', name: '포장·배달', icon: '🥡' },
    { key: 'instant', name: '즉석식품', icon: '🏪' },
    { key: 'homemade', name: '집밥 (목록에 없는 요리)', icon: '🍳' }
];

const MEALS = [
    // 면
    {
        name: '알리오 올리오', fi: 'Aglio e olio', times: ['lunch', 'dinner'], category: 'noodle', desc: '마늘과 올리브유만 있으면 되는 기본 파스타',
        difficulty: 1, minutes: 20, kcal: 600,
        sides: ['그린 샐러드', '피클', '마늘빵'],
        storage: '면이 금방 불어서 먹을 만큼만 삶는 게 좋아요. 남으면 밀폐 용기에 담아 냉장 1일, 팬에 물 1~2큰술 넣고 데우기.',
        ingredients: [
            { name: '스파게티', amount: '100g', fi: 'spagetti' },
            { name: '마늘', amount: '5쪽', fi: 'valkosipuli' },
            { name: '올리브유', amount: '4큰술', fi: 'oliiviöljy' },
            { name: '건고추', amount: '약간', fi: 'chili' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '파슬리 (선택)', amount: '약간', fi: 'persilja' }
        ],
        steps: [
            '물 1L에 소금 1작은술을 넣고 끓여 스파게티를 봉지에 적힌 시간보다 1분 짧게 삶는다. 면 삶은 물은 반 컵 남겨 둔다.',
            '마늘을 얇게 썰어 올리브유에 넣고 약불에서 노릇해질 때까지 볶은 뒤 건고추를 넣는다.',
            '삶은 면과 면 삶은 물 3~4큰술을 넣고 1분 동안 빠르게 섞는다.',
            '소금으로 간하고 파슬리를 뿌린다.'
        ]
    },
    {
        name: '크림 연어 파스타', fi: 'Kermainen lohipasta', times: ['lunch', 'dinner'], category: 'noodle', desc: '핀란드에서 싸고 맛있는 연어로 만드는 크림 파스타',
        difficulty: 2, minutes: 25, kcal: 800,
        sides: ['피클', '루콜라 샐러드', '레몬 한 조각'],
        storage: '냉장 1일까지. 데울 때 우유를 조금 넣고 약불로 데워야 크림이 분리되지 않아요. 연어가 들어가서 오래 두지 않기.',
        ingredients: [
            { name: '펜네', amount: '100g', fi: 'penne' },
            { name: '연어', amount: '150g', fi: 'lohi' },
            { name: '생크림', amount: '150ml', fi: 'kuohukerma' },
            { name: '양파', amount: '1/2개', fi: 'sipuli' },
            { name: '마늘', amount: '2쪽', fi: 'valkosipuli' },
            { name: '시금치 (선택)', amount: '한 줌', fi: 'pinaatti' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '펜네를 봉지에 적힌 시간만큼 삶는다.',
            '연어를 한입 크기로 썰어 소금, 후추를 뿌린다.',
            '팬에 기름을 두르고 양파와 마늘을 볶다가 연어를 넣어 겉면을 익힌다.',
            '생크림을 넣고 약불에서 2~3분 끓인 뒤 시금치를 넣는다.',
            '펜네를 넣고 섞은 뒤 소금으로 간한다.'
        ]
    },
    {
        name: '토마토 소시지 파스타', fi: 'Makkarapasta tomaattikastikkeessa', times: ['lunch', 'dinner'], category: 'noodle', desc: '병 토마토소스와 소시지로 20분 완성',
        difficulty: 1, minutes: 20, kcal: 700,
        sides: ['그린 샐러드', '치즈 듬뿍'],
        storage: '냉장 2일. 소스만 남았다면 냉동 1개월, 다음에 면만 삶아서 쓰기.',
        ingredients: [
            { name: '스파게티나 펜네', amount: '100g', fi: 'spagetti / penne' },
            { name: '토마토소스 (병)', amount: '150g', fi: 'tomaattikastike' },
            { name: '소시지', amount: '2개', fi: 'nakki / makkara' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '치즈 가루 (선택)', amount: '약간', fi: 'juustoraaste' }
        ],
        steps: [
            '면을 봉지에 적힌 시간만큼 삶는다.',
            '소시지는 어슷 썰고 양파는 잘게 썬다.',
            '팬에 기름을 두르고 양파와 소시지를 3분 볶은 뒤 토마토소스를 넣고 3분 끓인다.',
            '삶은 면을 넣고 섞은 뒤 치즈 가루를 뿌린다.'
        ]
    },
    {
        name: '마카로니라티코 (마카로니 그라탱)', fi: 'Makaronilaatikko', times: ['lunch', 'dinner'], category: 'noodle', desc: '다진 고기와 마카로니를 계란물에 구운 핀란드 급식 단골',
        difficulty: 2, minutes: 55, kcal: 750,
        sides: ['케첩 (핀란드식 정석)', '오이 피클', '그린 샐러드'],
        storage: '식혀서 냉장 3일, 냉동 1개월. 전자레인지에 2분 데우거나 오븐에 다시 구우면 겉이 바삭해져요.',
        ingredients: [
            { name: '마카로니', amount: '60g', fi: 'makaroni' },
            { name: '다진 고기', amount: '100g', fi: 'jauheliha' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '우유', amount: '150ml', fi: 'maito' },
            { name: '치즈 가루', amount: '한 줌', fi: 'juustoraaste' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '오븐을 200℃로 예열하고, 마카로니를 봉지에 적힌 시간보다 2분 짧게 삶는다.',
            '팬에 다진 고기와 양파를 볶고 소금, 후추로 간한다.',
            '작은 오븐 그릇에 버터를 바르고 마카로니와 고기를 섞어 담는다.',
            '계란, 우유, 소금 한 꼬집을 섞어 붓고 치즈를 뿌린다.',
            '200℃에서 35~40분, 계란물이 굳고 윗면이 노릇해질 때까지 굽는다.'
        ]
    },

    // 밥·죽
    {
        name: '연어 데리야키 덮밥', fi: 'Teriyakilohi riisillä', times: ['lunch', 'dinner'], category: 'rice', desc: '간장, 설탕 소스에 졸인 연어 덮밥',
        difficulty: 2, minutes: 25, kcal: 700,
        sides: ['인스턴트 미소국', '오이 샐러드', '계란 프라이'],
        storage: '연어와 밥은 따로 담아 냉장 1일. 연어는 전자레인지에 짧게(30초씩) 데워야 퍽퍽해지지 않아요.',
        ingredients: [
            { name: '연어', amount: '150g', fi: 'lohi' },
            { name: '밥', amount: '1공기', fi: 'riisi' },
            { name: '간장', amount: '2큰술', fi: 'soijakastike' },
            { name: '설탕', amount: '1큰술', fi: 'sokeri' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '마요네즈 (선택)', amount: '약간', fi: 'majoneesi' }
        ],
        steps: [
            '간장 2큰술, 설탕 1큰술, 물 2큰술을 섞어 소스를 만든다.',
            '팬에 연어를 껍질 쪽부터 올려 중불에서 3분, 뒤집어서 2분 굽는다.',
            '소스를 붓고 졸이면서 연어에 계속 끼얹는다.',
            '밥 위에 얇게 썬 양파, 연어, 남은 소스를 올리고 마요네즈를 뿌린다.'
        ]
    },
    {
        name: '닭고기 카레라이스', fi: 'Kanacurry ja riisi', times: ['lunch', 'dinner'], category: 'rice', desc: '작은 냄비 하나로 끓이는 1인분 카레',
        difficulty: 2, minutes: 30, kcal: 750,
        sides: ['오이 피클', '요거트', '삶은 계란'],
        storage: '한 김 식혀서 냉장 2~3일. 냉동은 1개월까지 되는데 감자는 빼고 얼려야 식감이 덜 변해요. 데울 때 물을 조금 넣고 저어 가며 끓이기.',
        ingredients: [
            { name: '카레 블록', amount: '1조각', fi: 'curry (아시아 마트)' },
            { name: '닭고기', amount: '100g', fi: 'broileri' },
            { name: '감자', amount: '1개', fi: 'peruna' },
            { name: '당근', amount: '1/2개', fi: 'porkkana' },
            { name: '양파', amount: '1/2개', fi: 'sipuli' },
            { name: '밥', amount: '1공기', fi: 'riisi' }
        ],
        steps: [
            '닭고기, 감자, 당근, 양파를 한입 크기로 썬다.',
            '냄비에 기름을 두르고 닭고기와 양파를 볶는다.',
            '감자, 당근과 물 250ml를 넣고 10분 끓인다.',
            '불을 끄고 카레 블록을 녹인 뒤 약불에서 3분 더 저어 가며 끓인다.'
        ]
    },
    {
        name: '치킨 크림소스 & 밥', fi: 'Kermainen broilerikastike ja riisi', times: ['lunch', 'dinner'], category: 'rice', desc: '닭고기 슬라이스를 요리용 크림에 끓이는 핀란드 집밥 단골',
        difficulty: 1, minutes: 25, kcal: 700,
        sides: ['오이·토마토 샐러드', '링곤베리 잼 한 숟갈'],
        storage: '소스와 밥을 따로 담아 냉장 2일. 소스는 물이나 우유를 조금 넣고 약불로 데우기.',
        ingredients: [
            { name: '닭고기 슬라이스 (양념 없는 것)', amount: '150g', fi: 'broilerin suikale (maustamaton)' },
            { name: '요리용 크림', amount: '100ml', fi: 'ruokakerma' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '파프리카', amount: '1/4개', fi: 'paprika' },
            { name: '카레 가루나 파프리카 가루', amount: '1/2작은술', fi: 'curry / paprikajauhe' },
            { name: '쌀', amount: '60g', fi: 'riisi' }
        ],
        steps: [
            '쌀은 봉지 설명대로 삶거나 밥을 짓는다.',
            '팬에 기름을 두르고 닭고기를 중불에서 5분 볶는다.',
            '양파, 파프리카, 가루 향신료를 넣고 2분 더 볶는다.',
            '요리용 크림을 붓고 약불에서 5분 끓인 뒤 소금, 후추로 간한다.',
            '밥 위에 소스를 얹는다.'
        ]
    },
    {
        name: '리시푸로 (쌀 우유죽)', fi: 'Riisipuuro', times: ['breakfast', 'lunch'], category: 'rice', desc: '핀란드 크리스마스 대표 음식, 시나몬 설탕을 솔솔',
        difficulty: 1, minutes: 50, kcal: 450,
        sides: ['시나몬 설탕', '버터 한 조각', '자두 키셀리 (과일 소스)'],
        storage: '냉장 2일. 데울 때 우유를 조금 넣고 저어 가며 데우기. 차갑게 먹어도 맛있어요.',
        ingredients: [
            { name: '죽용 쌀 (둥근 쌀)', amount: '50g', fi: 'puuroriisi' },
            { name: '물', amount: '100ml', fi: 'vesi' },
            { name: '우유', amount: '400ml', fi: 'maito' },
            { name: '소금', amount: '한 꼬집', fi: 'suola' },
            { name: '버터, 시나몬, 설탕', amount: '약간', fi: 'voi, kaneli, sokeri' }
        ],
        steps: [
            '냄비에 물과 쌀을 넣고 물이 거의 없어질 때까지 5분 끓인다.',
            '우유를 붓고 끓어오르면 아주 약불로 줄인다.',
            '뚜껑을 살짝 덮고 가끔 바닥까지 저어 가며 40분 끓인다. (바닥이 눌기 쉬우니 주의)',
            '소금으로 간하고 그릇에 담아 버터 한 조각과 시나몬 설탕을 뿌린다.'
        ]
    },

    // 빵
    {
        name: '핀란드식 오픈 샌드위치', fi: 'Voileipä', times: ['breakfast', 'lunch'], category: 'bread', desc: '호밀빵에 치즈, 햄을 올리는 핀란드 아침',
        difficulty: 1, minutes: 5, kcal: 400,
        sides: ['커피', '요거트 & 베리', '삶은 계란'],
        storage: '미리 만들어 두지 말고 재료째 보관. 호밀빵은 냉동해 두면 오래 가고 토스터에 바로 데우면 돼요.',
        ingredients: [
            { name: '호밀빵', amount: '2장', fi: 'ruisleipä' },
            { name: '버터', amount: '약간', fi: 'voi' },
            { name: '치즈', amount: '2장', fi: 'juusto' },
            { name: '햄', amount: '2장', fi: 'kinkku' },
            { name: '오이, 토마토', amount: '약간', fi: 'kurkku, tomaatti' }
        ],
        steps: [
            '호밀빵에 버터를 얇게 바른다.',
            '치즈와 햄을 올린다.',
            '얇게 썬 오이와 토마토를 올린다.'
        ]
    },
    {
        name: '훈제연어 호밀빵', fi: 'Lohileipä', times: ['breakfast', 'lunch'], category: 'bread', desc: '크림치즈와 훈제연어, 딜을 올린 로히레이패',
        difficulty: 1, minutes: 5, kcal: 400,
        sides: ['삶은 계란', '레몬 한 조각', '커피'],
        storage: '만들어 두면 빵이 눅눅해지니 바로 먹기. 개봉한 훈제연어는 랩으로 싸서 냉장 2~3일.',
        ingredients: [
            { name: '호밀빵', amount: '2장', fi: 'ruisleipä' },
            { name: '훈제연어 (또는 그라브락스)', amount: '60g', fi: 'kylmäsavulohi / graavilohi' },
            { name: '크림치즈', amount: '2큰술', fi: 'tuorejuusto' },
            { name: '오이', amount: '약간', fi: 'kurkku' },
            { name: '딜', amount: '약간', fi: 'tilli' }
        ],
        steps: [
            '호밀빵에 크림치즈를 넉넉히 바른다.',
            '얇게 썬 오이와 훈제연어를 올린다.',
            '딜을 뿌리고 레몬즙을 조금 짠다.'
        ]
    },
    {
        name: '프렌치토스트', fi: 'Köyhät ritarit', times: ['breakfast'], category: 'bread', desc: '핀란드에선 쾨위햇 리타릿(가난한 기사)이라 불러요',
        difficulty: 1, minutes: 15, kcal: 500,
        sides: ['딸기잼', '베리', '커피'],
        storage: '식혀서 냉장 1일, 한 장씩 랩에 싸면 냉동 2주. 토스터나 팬에 데우기.',
        ingredients: [
            { name: '식빵 (또는 굳은 빵)', amount: '2장', fi: 'paahtoleipä / pulla' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '우유', amount: '80ml', fi: 'maito' },
            { name: '설탕', amount: '1큰술', fi: 'sokeri' },
            { name: '버터', amount: '1큰술', fi: 'voi' },
            { name: '시나몬 (선택)', amount: '약간', fi: 'kaneli' }
        ],
        steps: [
            '계란, 우유, 설탕을 잘 섞는다.',
            '식빵을 계란물에 앞뒤로 충분히 적신다.',
            '버터를 녹인 팬에 중약불로 앞뒤 2~3분씩 굽는다.',
            '시나몬이나 잼을 곁들인다.'
        ]
    },
    {
        name: '카렐리안 파이 & 달걀버터', fi: 'Karjalanpiirakka ja munavoi', times: ['breakfast', 'lunch'], category: 'bread', desc: '핀란드 국민 간식 카랴란피이라카에 무나보이(달걀버터) 올리기',
        difficulty: 1, minutes: 15, kcal: 450,
        sides: ['우유나 커피', '오이 슬라이스'],
        storage: '남은 파이는 냉장 2~3일(냉동도 가능), 오븐이나 에어프라이어에 데우기. 달걀버터는 밀폐 용기에 냉장 2일.',
        ingredients: [
            { name: '카렐리안 파이', amount: '2~3개', fi: 'karjalanpiirakka' },
            { name: '계란', amount: '2개', fi: 'kananmuna' },
            { name: '버터', amount: '2큰술', fi: 'voi' },
            { name: '소금', amount: '약간', fi: 'suola' }
        ],
        steps: [
            '계란을 10분 삶아 찬물에 식힌다.',
            '껍질을 벗겨 잘게 으깬 뒤 말랑한 버터, 소금과 섞는다. (무나보이)',
            '카렐리안 파이를 오븐이나 에어프라이어 200℃에서 5분 데운다.',
            '따뜻한 파이 위에 달걀버터를 듬뿍 올린다.'
        ]
    },
    {
        name: '판누카꾸 (오븐 팬케이크)', fi: 'Pannukakku', times: ['breakfast', 'lunch'], category: 'bread', desc: '반죽을 그릇째 오븐에 굽는 두툼한 핀란드 팬케이크',
        difficulty: 1, minutes: 35, kcal: 550,
        sides: ['딸기잼', '휘핑크림', '완두콩 수프 (목요일 정석 조합)'],
        storage: '식혀서 냉장 2일. 차갑게 먹어도 되고, 전자레인지에 30초 데우기.',
        ingredients: [
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '우유', amount: '200ml', fi: 'maito' },
            { name: '밀가루', amount: '45g (약 3/4dl)', fi: 'vehnäjauho' },
            { name: '설탕', amount: '1큰술', fi: 'sokeri' },
            { name: '소금', amount: '한 꼬집', fi: 'suola' },
            { name: '버터', amount: '1큰술', fi: 'voi' }
        ],
        steps: [
            '오븐을 225℃로 예열하고, 작은 오븐 그릇에 버터를 넣어 오븐에서 녹인다.',
            '계란, 우유, 설탕, 소금을 섞고 밀가루를 조금씩 넣으며 덩어리 없이 푼다.',
            '반죽을 10분 쉬게 한 뒤 녹인 버터 그릇에 붓는다.',
            '225℃에서 20~25분, 가장자리가 부풀고 노릇해질 때까지 굽는다.'
        ]
    },

    // 스튜·수프
    {
        name: '로히케이토 (연어 수프)', fi: 'Lohikeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '핀란드식 연어 크림 수프, 추운 날 딱',
        difficulty: 2, minutes: 30, kcal: 550,
        sides: ['호밀빵 & 버터', '레몬 한 조각'],
        storage: '냉장 2일. 다시 데울 때 팔팔 끓이면 연어가 부서지고 크림이 분리되니 약불로. 감자 식감이 변해서 냉동은 비추천.',
        ingredients: [
            { name: '연어', amount: '100g', fi: 'lohi' },
            { name: '감자', amount: '2개 (작은 것)', fi: 'peruna' },
            { name: '당근', amount: '1/2개', fi: 'porkkana' },
            { name: '리크 (또는 양파)', amount: '1/4대', fi: 'purjo' },
            { name: '생크림', amount: '100ml', fi: 'kuohukerma' },
            { name: '딜', amount: '약간', fi: 'tilli' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '감자와 당근은 깍둑썰기, 리크는 송송 썬다.',
            '냄비에 버터를 녹여 리크를 볶고 물 300ml, 감자, 당근을 넣어 12분 끓인다.',
            '연어를 한입 크기로 썰어 넣고 4분 더 끓인다.',
            '생크림을 넣고 끓기 직전까지 데운 뒤 소금, 후추로 간한다.',
            '잘게 썬 딜을 올린다.'
        ]
    },
    {
        name: '마카라케이토 (소시지 수프)', fi: 'Makkarakeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '핀란드 가정식 소시지 감자 수프',
        difficulty: 1, minutes: 25, kcal: 500,
        sides: ['호밀빵', '머스터드'],
        storage: '냉장 2~3일. 감자 식감이 변해서 냉동은 비추천. 데울 때 물을 조금 더 넣기.',
        ingredients: [
            { name: '소시지', amount: '100g', fi: 'makkara' },
            { name: '감자', amount: '2개 (작은 것)', fi: 'peruna' },
            { name: '당근', amount: '1/2개', fi: 'porkkana' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '고형 육수', amount: '1/2개', fi: 'liemikuutio' },
            { name: '후추', amount: '약간', fi: 'pippuri' }
        ],
        steps: [
            '감자, 당근은 깍둑썰기, 양파는 잘게, 소시지는 동그랗게 썬다.',
            '냄비에 물 400ml와 고형 육수, 감자, 당근을 넣고 12분 끓인다.',
            '양파와 소시지를 넣고 5분 더 끓인다.',
            '후추로 간하고 싱거우면 소금을 조금 넣는다.'
        ]
    },
    {
        name: '헤르네케이토 (완두콩 수프)', fi: 'Hernekeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '핀란드 목요일 전통 메뉴, 마트 캔으로 10분',
        difficulty: 1, minutes: 10, kcal: 450,
        sides: ['머스터드 한 숟갈', '판누카꾸 (디저트로)', '호밀빵'],
        storage: '남은 수프는 용기에 옮겨 냉장 2~3일, 냉동 1개월. 데우면 되직해지니 물을 조금 넣기.',
        ingredients: [
            { name: '완두콩 수프 캔', amount: '1캔 (약 435g)', fi: 'hernekeitto' },
            { name: '머스터드', amount: '1작은술', fi: 'sinappi' },
            { name: '양파 (선택)', amount: '약간', fi: 'sipuli' }
        ],
        steps: [
            '캔을 냄비에 붓고 물 2~3큰술을 넣는다.',
            '중약불에서 바닥이 눌지 않게 저어 가며 5분 데운다.',
            '그릇에 담고 머스터드를 올려 섞어 먹는다. 잘게 썬 생양파를 뿌려도 좋다.'
        ]
    },
    {
        name: '시에니케이토 (버섯 크림 수프)', fi: 'Sienikeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '양송이를 버터에 볶아 크림으로 끓이는 숲의 수프',
        difficulty: 1, minutes: 25, kcal: 400,
        sides: ['호밀빵 & 버터', '치즈 토스트'],
        storage: '냉장 2일. 크림이 들어가서 약불로 저어 가며 데우기. 냉동하면 분리될 수 있어요.',
        ingredients: [
            { name: '양송이 (또는 숲버섯)', amount: '150g', fi: 'herkkusieni / metsäsieni' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '버터', amount: '1큰술', fi: 'voi' },
            { name: '밀가루', amount: '1큰술', fi: 'vehnäjauho' },
            { name: '고형 육수', amount: '1/2개', fi: 'liemikuutio' },
            { name: '생크림', amount: '100ml', fi: 'kuohukerma' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '버섯과 양파를 잘게 썬다.',
            '냄비에 버터를 녹이고 버섯과 양파를 수분이 날아갈 때까지 5분 볶는다.',
            '밀가루를 뿌려 1분 볶은 뒤 물 250ml와 고형 육수를 조금씩 넣으며 푼다.',
            '약불에서 10분 끓이고 생크림을 넣어 한 번 더 데운 뒤 소금, 후추로 간한다.'
        ]
    },
    {
        name: '카랴란파이스티 (카렐리안 스튜)', fi: 'Karjalanpaisti', times: ['dinner'], category: 'stew', desc: '소고기, 돼지고기를 통후추와 오븐에서 푹 익히는 전통 스튜',
        difficulty: 2, minutes: 180, kcal: 650,
        sides: ['감자 퓨레', '링곤베리', '오이 피클'],
        storage: '오래 끓인 요리라 보관이 쉬워요. 냉장 3일, 냉동 2개월. 넉넉히 만들어 나눠 얼려 두기 좋아요.',
        ingredients: [
            { name: '스튜용 고기 (소·돼지 섞인 팩)', amount: '200g', fi: 'karjalanpaistiliha' },
            { name: '양파', amount: '1/2개', fi: 'sipuli' },
            { name: '올스파이스 (통)', amount: '5알', fi: 'maustepippuri' },
            { name: '월계수잎', amount: '1장', fi: 'laakerinlehti' },
            { name: '소금', amount: '1/2작은술', fi: 'suola' }
        ],
        steps: [
            '오븐을 175℃로 예열한다.',
            '고기를 큼직하게 썰어 뚜껑 있는 작은 오븐 그릇에 양파, 올스파이스, 월계수잎과 함께 켜켜이 담는다.',
            '소금을 뿌리고 고기가 반쯤 잠기게 물을 붓는다.',
            '뚜껑(없으면 호일)을 덮고 2시간 30분~3시간, 고기가 결대로 찢어질 때까지 익힌다. 중간에 물이 줄면 조금 보충한다.'
        ]
    },

    // 감자 한 접시
    {
        name: '미트볼 & 감자 퓨레', fi: 'Lihapullat ja perunamuusi', times: ['lunch', 'dinner'], category: 'plate', desc: '마트 미트볼에 링곤베리 잼, 북유럽 집밥',
        difficulty: 1, minutes: 20, kcal: 700,
        sides: ['오이 피클', '삶은 완두콩이나 당근'],
        storage: '냉장 2일. 퓨레는 우유를 조금 넣고 데우기. 남은 미트볼은 봉지째 냉동해도 돼요.',
        ingredients: [
            { name: '미트볼', amount: '10개', fi: 'lihapullat' },
            { name: '감자 (또는 퓨레 가루)', amount: '2개', fi: 'peruna / perunamuusijauhe' },
            { name: '우유', amount: '80ml', fi: 'maito' },
            { name: '버터', amount: '1큰술', fi: 'voi' },
            { name: '링곤베리 잼', amount: '2큰술', fi: 'puolukkahillo' },
            { name: '그레이비 소스 (선택)', amount: '약간', fi: 'ruskea kastike' }
        ],
        steps: [
            '감자를 15분 삶아 으깬 뒤 우유, 버터, 소금을 섞는다. (퓨레 가루면 봉지 설명대로)',
            '미트볼을 팬에 굴려 가며 5분 데운다.',
            '퓨레와 미트볼을 담고 링곤베리 잼과 그레이비 소스를 곁들인다.'
        ]
    },
    {
        name: '포론캐리스튀스 (순록 볶음)', fi: 'Poronkäristys', times: ['dinner'], category: 'plate', desc: '얇게 썬 냉동 순록 고기를 버터에 볶아 끓이는 라플란드 요리',
        difficulty: 2, minutes: 35, kcal: 650,
        sides: ['감자 퓨레', '링곤베리', '오이 피클'],
        storage: '냉장 2일, 냉동 1개월. 물을 조금 넣고 약불로 데우기.',
        ingredients: [
            { name: '냉동 순록 슬라이스', amount: '150g', fi: 'poronkäristys' },
            { name: '버터', amount: '1큰술', fi: 'voi' },
            { name: '양파 (선택)', amount: '1/4개', fi: 'sipuli' },
            { name: '감자', amount: '2개', fi: 'peruna' },
            { name: '링곤베리 (또는 잼)', amount: '2큰술', fi: 'puolukka / puolukkahillo' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '감자를 15분 삶아 버터, 우유, 소금과 으깨 퓨레를 만든다.',
            '냄비에 버터를 녹이고 언 순록 고기를 그대로 넣어 볶으며 하나씩 떼어 낸다.',
            '고기 색이 변하면 양파를 넣고 물 100ml, 소금, 후추를 넣는다.',
            '뚜껑을 덮고 약불에서 15분, 고기가 부드러워질 때까지 끓인다.',
            '퓨레 옆에 담고 링곤베리를 곁들인다.'
        ]
    },
    {
        name: '연어 오븐구이 & 감자', fi: 'Uunilohi ja perunat', times: ['dinner'], category: 'plate', desc: '오븐 하나로 끝내는 우니로히, 딜 크림소스와 함께',
        difficulty: 1, minutes: 40, kcal: 650,
        sides: ['딜 크림소스', '레몬', '삶은 브로콜리'],
        storage: '연어는 냉장 1일, 차갑게 샐러드나 호밀빵에 올려 먹어도 좋아요. 감자는 팬에 구우면 바삭해져요.',
        ingredients: [
            { name: '연어 필레', amount: '150g', fi: 'lohifilee' },
            { name: '감자', amount: '3개 (작은 것)', fi: 'peruna' },
            { name: '레몬', amount: '1/4개', fi: 'sitruuna' },
            { name: '사워크림 (소스용)', amount: '3큰술', fi: 'kermaviili' },
            { name: '딜', amount: '약간', fi: 'tilli' },
            { name: '소금, 올리브유', amount: '약간', fi: 'suola, oliiviöljy' }
        ],
        steps: [
            '오븐을 200℃로 예열하고, 감자를 반으로 잘라 기름과 소금에 버무려 15분 먼저 굽는다.',
            '연어에 소금을 뿌리고 레몬 슬라이스를 올려 감자 옆에 놓는다.',
            '15~18분 더 구워 연어 속이 불투명해지면 꺼낸다.',
            '사워크림에 잘게 썬 딜과 소금 한 꼬집을 섞어 소스를 만들어 곁들인다.'
        ]
    },
    {
        name: '실라카 튀김 (발트해 청어 구이)', fi: 'Paistetut silakat', times: ['lunch', 'dinner'], category: 'plate', desc: '호밀가루를 묻혀 버터에 바삭하게 지지는 핀란드 서민 생선',
        difficulty: 2, minutes: 30, kcal: 600,
        sides: ['감자 퓨레', '링곤베리', '오이 피클'],
        storage: '구운 생선은 냉장 1일, 차갑게 호밀빵에 올려 먹어도 맛있어요. 생 필레는 사 온 날 바로 요리하기.',
        ingredients: [
            { name: '청어 필레', amount: '150g', fi: 'silakkafilee' },
            { name: '호밀가루', amount: '3큰술', fi: 'ruisjauho' },
            { name: '버터', amount: '1큰술', fi: 'voi' },
            { name: '감자', amount: '2개', fi: 'peruna' },
            { name: '소금', amount: '약간', fi: 'suola' }
        ],
        steps: [
            '감자를 15분 삶아 퓨레를 만든다.',
            '청어 필레에 소금을 뿌리고 호밀가루를 앞뒤로 묻힌다. (껍질이 바깥으로 가게 두 장씩 겹쳐도 좋다)',
            '팬에 버터를 녹이고 중불에서 앞뒤 2~3분씩 노릇하게 굽는다.',
            '퓨레와 함께 담고 링곤베리를 곁들인다.'
        ]
    },
    {
        name: '마카라카스티케 (소시지 소스) & 감자', fi: 'Makkarakastike ja perunat', times: ['lunch', 'dinner'], category: 'plate', desc: '소시지를 토마토 크림소스에 끓인 핀란드 급식 맛',
        difficulty: 1, minutes: 30, kcal: 750,
        sides: ['삶은 감자', '오이 피클', '강판에 간 당근 샐러드'],
        storage: '냉장 2~3일. 소스는 냉동 1개월도 가능, 감자는 그때그때 삶기.',
        ingredients: [
            { name: '링 소시지', amount: '150g', fi: 'lenkkimakkara' },
            { name: '양파', amount: '1/2개', fi: 'sipuli' },
            { name: '토마토 퓨레', amount: '1큰술', fi: 'tomaattipyree' },
            { name: '요리용 크림', amount: '100ml', fi: 'ruokakerma' },
            { name: '감자', amount: '3개 (작은 것)', fi: 'peruna' },
            { name: '소금, 후추', amount: '약간', fi: 'suola, pippuri' }
        ],
        steps: [
            '감자를 15분 삶는다.',
            '소시지는 껍질을 벗겨 깍둑 썰고 양파는 잘게 썬다.',
            '팬에 소시지와 양파를 5분 볶고 토마토 퓨레를 넣어 1분 더 볶는다.',
            '물 100ml와 요리용 크림을 넣고 약불에서 5분 끓인 뒤 소금, 후추로 간한다.',
            '삶은 감자 위에 소스를 끼얹는다.'
        ]
    },
    {
        name: '퓌티판누 (북유럽식 해시)', fi: 'Pyttipannu', times: ['breakfast', 'lunch'], category: 'plate', desc: '깍둑 감자, 햄, 양파를 볶고 계란 프라이를 올리는 한 판 요리',
        difficulty: 1, minutes: 20, kcal: 700,
        sides: ['초절임 비트 (정석)', '오이 피클', '케첩'],
        storage: '냉장 2일, 팬에 다시 볶기. 계란 프라이는 먹을 때 새로 부치기.',
        ingredients: [
            { name: '감자 (또는 냉동 퓌티판누 믹스)', amount: '2개 (믹스면 300g)', fi: 'peruna / pyttipannu (pakaste)' },
            { name: '햄이나 소시지', amount: '100g', fi: 'kinkku / makkara' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '초절임 비트', amount: '약간', fi: 'etikkapunajuuri' }
        ],
        steps: [
            '감자를 1cm 크기로 깍둑 썰어 전자레인지에 4분 돌려 반쯤 익힌다. (냉동 믹스면 이 단계 생략)',
            '팬에 기름을 넉넉히 두르고 감자를 중불에서 노릇하게 8분 볶는다.',
            '햄, 양파를 넣고 3분 더 볶은 뒤 소금, 후추로 간한다.',
            '계란 프라이를 올리고 초절임 비트를 곁들인다.'
        ]
    },

    // 간단식
    {
        name: '스크램블 에그 & 베이컨', fi: 'Munakokkeli ja pekoni', times: ['breakfast'], category: 'quick', desc: '10분 완성 브런치',
        difficulty: 1, minutes: 10, kcal: 500,
        sides: ['토마토 슬라이스', '오렌지 주스', '커피'],
        storage: '바로 먹는 메뉴라 보관은 비추천. 남은 생베이컨은 잘 싸서 냉장 3~4일.',
        ingredients: [
            { name: '계란', amount: '3개', fi: 'kananmuna' },
            { name: '우유', amount: '2큰술', fi: 'maito' },
            { name: '베이컨', amount: '3줄', fi: 'pekoni' },
            { name: '버터', amount: '1작은술', fi: 'voi' },
            { name: '빵', amount: '1~2장', fi: 'leipä' }
        ],
        steps: [
            '베이컨을 팬에 바삭하게 굽고 꺼낸다.',
            '계란, 우유, 소금을 섞는다.',
            '약불에 버터를 녹이고 계란물을 부어 천천히 저어 가며 촉촉할 때 불을 끈다.',
            '구운 빵, 베이컨과 함께 담는다.'
        ]
    },
    {
        name: '카우라푸로 (오트밀 죽)', fi: 'Kaurapuuro', times: ['breakfast'], category: 'quick', desc: '핀란드 사람들의 가장 흔한 아침, 버터 한 조각과 베리',
        difficulty: 1, minutes: 10, kcal: 350,
        sides: ['냉동 블루베리나 링곤베리', '버터 한 조각', '커피'],
        storage: '냉장 1~2일. 굳으면 물이나 우유를 조금 넣고 전자레인지에 1분.',
        ingredients: [
            { name: '오트밀', amount: '40g (약 1dl)', fi: 'kaurahiutale' },
            { name: '물 (또는 우유)', amount: '200ml', fi: 'vesi / maito' },
            { name: '소금', amount: '한 꼬집', fi: 'suola' },
            { name: '버터', amount: '1작은술', fi: 'voi' },
            { name: '베리', amount: '한 줌', fi: 'mustikka / puolukka (pakaste)' }
        ],
        steps: [
            '냄비에 물과 소금을 넣고 끓인다.',
            '오트밀을 넣고 약불에서 저어 가며 3~5분 끓인다. (전자레인지면 큰 그릇에 2~3분)',
            '그릇에 담고 버터 한 조각과 베리를 올린다.'
        ]
    },
    {
        name: '마랴라카 (베리 쿼크)', fi: 'Marjarahka', times: ['breakfast'], category: 'quick', desc: '단백질 듬뿍 쿼크에 냉동 베리를 섞는 불 없는 한 그릇',
        difficulty: 1, minutes: 5, kcal: 300,
        sides: ['뮤즐리나 그래놀라', '커피'],
        storage: '섞은 것은 냉장 1일. 개봉한 쿼크는 냉장 3~4일 안에 먹기.',
        ingredients: [
            { name: '쿼크 (플레인)', amount: '200g', fi: 'maitorahka' },
            { name: '냉동 베리', amount: '한 줌', fi: 'pakastemarjat' },
            { name: '설탕이나 꿀', amount: '1큰술', fi: 'sokeri / hunaja' },
            { name: '우유', amount: '2큰술', fi: 'maito' }
        ],
        steps: [
            '냉동 베리를 그릇에 담아 10분 두거나 전자레인지에 30초 돌려 살짝 녹인다.',
            '쿼크에 우유를 넣어 부드럽게 푼다.',
            '베리와 설탕을 넣고 섞는다. 베리 즙이 배어 분홍색이 되면 완성.'
        ]
    },
    {
        name: '레이패유스토 & 클라우드베리 잼', fi: 'Leipäjuusto ja lakkahillo', times: ['breakfast'], category: 'quick', desc: '뽀득거리는 구운 치즈에 북극 산딸기 잼, 커피와 함께',
        difficulty: 1, minutes: 10, kcal: 400,
        sides: ['커피 (커피에 담가 먹기도 해요)', '베리'],
        storage: '남은 치즈는 랩으로 싸서 냉장, 포장지 날짜까지. 먹기 전에 팬이나 오븐에 다시 데우기.',
        ingredients: [
            { name: '레이패유스토 (빵치즈)', amount: '100g', fi: 'leipäjuusto' },
            { name: '클라우드베리 잼 (또는 다른 베리 잼)', amount: '2큰술', fi: 'lakkahillo' },
            { name: '버터 (선택)', amount: '약간', fi: 'voi' }
        ],
        steps: [
            '치즈를 먹기 좋게 썬다.',
            '팬에 버터를 아주 조금 두르고 중약불에서 앞뒤 2~3분씩, 말랑하고 따뜻해질 때까지 데운다.',
            '접시에 담고 잼을 올린다.'
        ]
    }
];
