// data/meals.js - 요리 탭 (오늘 뭐 먹지?) 메뉴 데이터 (모두 1인분 기준)
// 1. 종류: key는 아래 메뉴의 category에 그대로 적음 (순서대로 선택 버튼이 생김)
// 2. 메뉴 하나 = { name, category, desc, difficulty, minutes, kcal, sides, storage, image, ingredients, steps }
//    difficulty: 1(쉬움) | 2(보통) | 3(어려움) / minutes: 예상 소요 시간(분) / kcal: 1인분 기준 대략적인 값
//    sides: 곁들이면 좋은 것 (추천 카드와 레시피 화면에 표시, 생략 가능)
//    storage: 다 먹고 남았을 때 보관법 (확정 화면과 "다 먹었어요" 뒤에 표시, 생략 가능)
//    image: 예시 사진 경로 (예: 'meals/aglio-olio.jpg', 생략하면 종류 아이콘으로 표시)
//           사진은 meals 폴더에 넣으면 되고, 한 번 본 사진은 sw.js가 자동으로 저장해서 오프라인에서도 보임
//    ingredients: [{ name: '재료', amount: '양', fi: '핀란드어 이름 (마트에서 찾기용, 생략 가능)' }]
//    steps: 레시피 순서 (문장 하나가 한 단계)
//    (여러 인분짜리를 넣고 싶으면 servings: 2 처럼 적으면 칼로리 옆에 "2인분"으로 표시)
// ⚠️ 먹은 기록은 메뉴 이름(name)으로 저장되므로, 이미 기록한 메뉴의 이름을 바꾸면 기록의 이름은 예전 그대로 남음

const MEAL_CATEGORIES = [
    { key: 'korean', name: '한식', icon: '🥢' },
    { key: 'noodle', name: '면', icon: '🍜' },
    { key: 'rice', name: '밥', icon: '🍚' },
    { key: 'bread', name: '빵', icon: '🥪' },
    { key: 'stew', name: '스튜·수프', icon: '🍲' },
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
    // 한식 (김치, 된장, 고추장 등은 탐페레 아시아 마트에서)
    {
        name: '김치볶음밥', category: 'korean', desc: '김치만 있으면 실패 없는 한 그릇',
        difficulty: 1, minutes: 15, kcal: 650,
        sides: ['김', '계란국', '단무지 대신 피클'],
        storage: '냉장 2일, 지퍼백에 납작하게 담으면 냉동 2주. 전자레인지 2분 또는 팬에 다시 볶기.',
        ingredients: [
            { name: '밥', amount: '1공기', fi: 'riisi' },
            { name: '김치', amount: '1컵', fi: 'kimchi (아시아 마트)' },
            { name: '햄 또는 스팸', amount: '50g', fi: 'kinkku' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '간장', amount: '1/2큰술', fi: 'soijakastike' },
            { name: '설탕', amount: '약간', fi: 'sokeri' },
            { name: '참기름', amount: '1작은술', fi: 'seesamiöljy' }
        ],
        steps: [
            '김치와 햄을 잘게 썬다.',
            '팬에 기름을 두르고 햄을 볶다가 김치와 설탕을 넣고 2분 볶는다.',
            '밥과 간장을 넣고 고루 볶는다.',
            '불을 끄고 참기름을 두른 뒤 계란 프라이를 올린다.'
        ]
    },
    {
        name: '김치찌개', category: 'korean', desc: '푹 익은 김치와 돼지고기로 끓이는 1인분 찌개',
        difficulty: 2, minutes: 25, kcal: 450,
        sides: ['밥', '계란 프라이', '김'],
        storage: '냉장 2~3일, 다시 끓일수록 맛이 깊어져요. 냉동하면 두부 식감이 변하니 두부는 먹을 때 넣기.',
        ingredients: [
            { name: '김치', amount: '1컵', fi: 'kimchi (아시아 마트)' },
            { name: '돼지고기 (목살이나 삼겹)', amount: '80g', fi: 'porsaankylki / possu' },
            { name: '두부', amount: '1/4모', fi: 'tofu' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '고춧가루 (선택)', amount: '1/2큰술', fi: 'chilijauhe' },
            { name: '설탕', amount: '약간', fi: 'sokeri' }
        ],
        steps: [
            '돼지고기와 김치를 한입 크기로 썬다.',
            '냄비에 기름을 조금 두르고 돼지고기를 볶다가 김치와 설탕을 넣고 3분 더 볶는다.',
            '물 300ml와 고춧가루를 넣고 10분 끓인다.',
            '양파와 두부를 넣고 5분 더 끓인다. 싱거우면 김치 국물이나 간장으로 간한다.'
        ]
    },
    {
        name: '된장찌개', category: 'korean', desc: '한식이 그리울 때, 아시아 마트 된장으로',
        difficulty: 2, minutes: 20, kcal: 250,
        sides: ['밥', '계란말이', '김치'],
        storage: '냉장 2~3일, 먹을 만큼 덜어서 한 번 끓여 먹기. 두부는 얼리면 식감이 변해서 냉동은 비추천.',
        ingredients: [
            { name: '된장', amount: '1큰술', fi: 'doenjang (아시아 마트)' },
            { name: '두부', amount: '1/4모', fi: 'tofu' },
            { name: '애호박', amount: '1/4개', fi: 'kesäkurpitsa' },
            { name: '감자', amount: '1/2개', fi: 'peruna' },
            { name: '양파', amount: '1/4개', fi: 'sipuli' },
            { name: '양송이', amount: '2개', fi: 'herkkusieni' }
        ],
        steps: [
            '물 300ml에 된장을 풀고 감자를 넣어 5분 끓인다.',
            '양파, 애호박, 양송이를 넣고 5분 더 끓인다.',
            '두부를 넣고 3분 끓인다.',
            '고춧가루나 파가 있으면 마지막에 넣는다.'
        ]
    },
    {
        name: '제육볶음', category: 'korean', desc: '고추장 양념 돼지고기 볶음, 밥 도둑',
        difficulty: 2, minutes: 25, kcal: 600,
        sides: ['밥', '상추쌈', '된장국'],
        storage: '냉장 2일. 양념에 재운 생고기 상태로 냉동하면 2주까지, 먹기 전날 냉장실에서 해동.',
        ingredients: [
            { name: '돼지고기 (앞다리나 목살)', amount: '150g', fi: 'possu / porsaan suikale' },
            { name: '양파', amount: '1/2개', fi: 'sipuli' },
            { name: '고추장', amount: '1.5큰술', fi: 'gochujang (아시아 마트)' },
            { name: '간장', amount: '1큰술', fi: 'soijakastike' },
            { name: '설탕', amount: '1큰술', fi: 'sokeri' },
            { name: '다진 마늘', amount: '1작은술', fi: 'valkosipuli' },
            { name: '참기름', amount: '약간', fi: 'seesamiöljy' }
        ],
        steps: [
            '고추장, 간장, 설탕, 다진 마늘을 섞어 양념을 만든다.',
            '돼지고기를 양념에 버무려 10분 정도 둔다.',
            '팬에 기름을 두르고 고기를 중불에서 볶다가 익으면 양파를 넣고 2분 더 볶는다.',
            '불을 끄고 참기름을 두른다.'
        ]
    },
    {
        name: '계란 치즈 라면', category: 'korean', desc: '아시아 마트 라면에 계란과 치즈만 더하기',
        difficulty: 1, minutes: 10, kcal: 600,
        sides: ['김치', '찬밥 (국물에 말아서)', '단무지 대신 피클'],
        storage: '보관하지 말고 바로 먹기. 남은 국물에 밥을 말아 먹으면 끝!',
        ingredients: [
            { name: '라면', amount: '1봉', fi: 'nuudeli (아시아 마트)' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '쪽파', amount: '약간', fi: 'kevätsipuli' },
            { name: '슬라이스 치즈 (선택)', amount: '1장', fi: 'juustoviipale' }
        ],
        steps: [
            '물 550ml를 끓인다.',
            '면과 스프를 넣고 2분 끓인 뒤 계란을 넣는다.',
            '1분 더 끓이고 불을 끈 뒤 쪽파와 치즈를 올린다.'
        ]
    },

    // 면
    {
        name: '알리오 올리오', category: 'noodle', desc: '마늘과 올리브유만 있으면 되는 기본 파스타',
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
        name: '크림 연어 파스타', category: 'noodle', desc: '핀란드에서 싸고 맛있는 연어로 만드는 크림 파스타',
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
        name: '토마토 소시지 파스타', category: 'noodle', desc: '병 토마토소스와 소시지로 20분 완성',
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

    // 밥
    {
        name: '연어 데리야키 덮밥', category: 'rice', desc: '간장, 설탕 소스에 졸인 연어 덮밥',
        difficulty: 2, minutes: 25, kcal: 700,
        sides: ['된장국', '양배추 채 샐러드', '계란 프라이'],
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
        name: '닭고기 카레라이스', category: 'rice', desc: '작은 냄비 하나로 끓이는 1인분 카레',
        difficulty: 2, minutes: 30, kcal: 750,
        sides: ['김치나 피클', '요거트', '삶은 계란'],
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
        name: '참치마요 덮밥', category: 'rice', desc: '불 없이 5분, 참치캔과 마요네즈',
        difficulty: 1, minutes: 5, kcal: 650,
        sides: ['김', '컵라면', '김치'],
        storage: '만들어 두면 밥이 마르고 마요네즈가 상하기 쉬워서 바로 먹기. 남은 참치는 용기에 옮겨 냉장 2일.',
        ingredients: [
            { name: '밥', amount: '1공기', fi: 'riisi' },
            { name: '참치캔', amount: '1개 (작은 것)', fi: 'tonnikala' },
            { name: '마요네즈', amount: '1.5큰술', fi: 'majoneesi' },
            { name: '간장', amount: '1/2큰술', fi: 'soijakastike' },
            { name: '김 (선택)', amount: '약간', fi: 'nori / merilevä' }
        ],
        steps: [
            '참치캔의 기름을 따라 버린다.',
            '참치에 마요네즈와 간장을 섞는다.',
            '따뜻한 밥 위에 올리고 김을 부숴 뿌린다.'
        ]
    },

    // 빵
    {
        name: '핀란드식 오픈 샌드위치', category: 'bread', desc: '호밀빵에 치즈, 햄을 올리는 핀란드 아침',
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
        name: '프렌치토스트', category: 'bread', desc: '계란물에 적신 식빵을 버터에 굽기',
        difficulty: 1, minutes: 15, kcal: 500,
        sides: ['베리', '요거트', '커피'],
        storage: '식혀서 냉장 1일, 한 장씩 랩에 싸면 냉동 2주. 토스터나 팬에 데우기.',
        ingredients: [
            { name: '식빵', amount: '2장', fi: 'paahtoleipä' },
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
        name: '카렐리안 파이 & 달걀버터', category: 'bread', desc: '핀란드 국민 간식 카랴란피이라카에 무나보이(달걀버터) 올리기',
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

    // 스튜·수프
    {
        name: '로히케이토 (연어 수프)', category: 'stew', desc: '핀란드식 연어 크림 수프, 추운 날 딱',
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
        name: '마카라케이토 (소시지 수프)', category: 'stew', desc: '핀란드 가정식 소시지 감자 수프',
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

    // 간단식
    {
        name: '미트볼 & 감자 퓨레', category: 'quick', desc: '마트 미트볼에 링곤베리 잼, 북유럽 집밥',
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
        name: '스크램블 에그 & 베이컨', category: 'quick', desc: '10분 완성 브런치',
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
    }
];
