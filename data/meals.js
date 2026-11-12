// data/meals.js - 요리 탭 (오늘 뭐 먹지?) 메뉴 데이터 (Recipe.txt 기준)
// 1. 종류: key는 아래 메뉴의 category에 그대로 적음 (순서대로 선택 버튼이 생김)
// 2. 메뉴 하나 = { name, fi, times, category, desc, difficulty, minutes, kcal, servings, sides, storage, image, ingredients, steps }
//    fi: 핀란드어 메뉴 이름 (이름 아래 작게 표시, 생략 가능)
//    times: 어울리는 끼니 (MEAL_TIMES의 key, 그 끼니를 골랐을 때만 목록에 나옴 / 생략하면 모든 끼니)
//    difficulty: 1(쉬움) | 2(보통) | 3(어려움) / minutes: 예상 소요 시간(분) / kcal: 1인분 기준 대략적인 값
//    servings: 레시피 분량 (숫자면 "2인분", 글자면 그대로 '5회분'처럼 표시, 생략하면 1인분)
//    sides: 곁들이면 좋은 것 (소개 카드와 레시피 화면에 표시, 생략 가능)
//    storage: 다 먹고 남았을 때 보관법 (레시피 화면과 "다 먹었어요" 뒤에 표시, 생략 가능)
//    image: 예시 사진 파일 이름 (예: 'aglio-olio.jpg', 생략하면 종류 아이콘으로 표시)
//           사진은 images/meals 폴더에 넣고 파일 이름만 적으면 됨, 한 번 본 사진은 sw.js가 자동으로 저장해서 오프라인에서도 보임
//    ingredients: [{ name: '재료', amount: '양', fi: '핀란드어 이름 (마트에서 찾기용, 생략 가능)' }]
//       name은 🧊 냉장고 비교에도 쓰임: '(선택)'은 없어도 됨, 'A (또는 B)'는 둘 중 하나, 'A, B'는 둘 다 필요, 그 밖의 괄호는 설명
//       같은 재료 다른 이름(계란/달걀, 다진고기/다짐육)은 render.js의 MEAL_INGREDIENT_GROUPS로 묶여 있음
//    steps: 레시피 순서 (문장 하나가 한 단계)
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
    { key: 'plate', name: '감자 요리', icon: '🥔' },
    { key: 'quick', name: '간단식', icon: '⚡' }
];

// 직접 추가하는 기록의 종류 (목록에는 안 나오고, 먹은 기록 달력에서 날짜를 고른 뒤 직접 적을 때만 사용)
const MEAL_EXTRA_TYPES = [
    { key: 'eatout', name: '외식', icon: '🍴' },
    { key: 'takeout', name: '포장·배달', icon: '🥡' },
    { key: 'instant', name: '즉석식품', icon: '🏪' },
    { key: 'homemade', name: '집밥 (목록에 없는 요리)', icon: '🍳' }
];

const MEALS = [
    // ===== 면 =====
    {
        name: '알리오 올리오', fi: 'Aglio e olio', times: ['lunch', 'dinner'], category: 'noodle', desc: '물 700ml에 면을 바로 졸여 만드는 원팬 알리오 올리오',
        image: 'aglio_olio.jpg',
        difficulty: 1, minutes: 20, kcal: 600,
        sides: ['그린 샐러드', '피클'],
        storage: '면이 금방 불어서 먹을 만큼만 만드는 게 좋아요. 남으면 냉장 1일, 팬에 물 1~2큰술 넣고 데우기.',
        ingredients: [
            { name: '파스타 면', amount: '1인분 (약 100g)', fi: 'spagetti' },
            { name: '마늘', amount: '3톨', fi: 'valkosipuli' },
            { name: '올리브유', amount: '3T', fi: 'oliiviöljy' },
            { name: '소금', amount: '0.5t', fi: 'suola' },
            { name: '페퍼론치노 (선택)', amount: '3알', fi: 'chilihiutale / kuivattu chili' }
        ],
        steps: [
            '물 700ml에 파스타 면 1인분을 표시보다 조금 덜 삶는다.',
            '물에 마늘 2알 정도를 갈아서 넣고, 올리브유 2T, 소금 0.5t, 페퍼론치노 3알(선택)도 같이 넣는다.',
            '물이 다 졸아들 때까지 뚜껑을 열고 익힌다.',
            '마지막으로 올리브유 1T, 마늘 한 톨을 갈아 넣는다.',
            '약불에서 좀 더 익히고 끝낸다.'
        ]
    },
    {
        name: '토마토 버터 파스타 + 소시지', fi: 'Tomaatti-voipasta ja makkara', times: ['lunch', 'dinner'], category: 'noodle', desc: '홀토마토 한 캔에 면을 바로 넣어 졸이는 원팬 토마토 파스타',
        image: 'tomato_butter_pasta.jpg',
        difficulty: 1, minutes: 25, kcal: 750,
        sides: ['그린 샐러드', '치즈 가루'],
        storage: '냉장 2일. 데울 때 물을 조금 넣고 약불로.',
        ingredients: [
            { name: '파스타 면', amount: '1인분 (약 100g)', fi: 'spagetti / penne' },
            { name: '홀토마토 캔', amount: '1캔 (400ml)', fi: 'kokonaiset kuoritut tomaatit' },
            { name: '간장', amount: '1T', fi: 'soijakastike' },
            { name: '버터', amount: '20g', fi: 'voi' },
            { name: '마늘', amount: '2톨', fi: 'valkosipuli' },
            { name: '소금', amount: '0.5t', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '설탕', amount: '1T', fi: 'sokeri' },
            { name: '소시지', amount: '1~2개', fi: 'makkara / nakki' }
        ],
        steps: [
            '소시지를 1, 2개 정도 먹고 싶은 만큼 굽는다.',
            '팬을 달군 뒤 토마토 한 캔(400ml)을 다 넣는다.',
            '약간 익으면 토마토 캔 하나 반만큼 물을 담아 팬에 붓는다.',
            '홀토마토는 가위 등으로 잘게 자르거나 으깬다.',
            '간장 1T, 소금 0.5t, 설탕 1T를 넣어 간을 맞춘다.',
            '끓으면 파스타 면 1인분과 버터 20g을 넣는다.',
            '강불에서 10분 끓인다.',
            '다 졸면 마늘 두 톨과 후추를 갈아 넣고 구웠던 소시지를 섞는다.',
            '약불에서 좀 더 졸이며 마무리한다.'
        ]
    },
    {
        name: '원팬 까르보나라', fi: 'Carbonara', times: ['lunch', 'dinner'], category: 'noodle', desc: '알리오 올리오 방식으로 졸인 면에 날달걀과 치즈를 버무리는 원팬 파스타',
        image: 'carbonara.jpg',
        difficulty: 1, minutes: 20, kcal: 700,
        sides: ['그린 샐러드', '피클'],
        storage: '계란이 들어가서 바로 먹기. 남기지 않는 걸 추천해요.',
        ingredients: [
            { name: '파스타 면', amount: '1인분 (약 100g)', fi: 'spagetti' },
            { name: '마늘', amount: '3톨', fi: 'valkosipuli' },
            { name: '올리브유', amount: '3T', fi: 'oliiviöljy' },
            { name: '소금', amount: '0.5t', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '파르미지아노', amount: '적당량', fi: 'parmesaani' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '페퍼론치노 (선택)', amount: '3개', fi: 'chilihiutale / kuivattu chili' }
        ],
        steps: [
            '물 700ml에 파스타 면 1인분을 넣는다.',
            '올리브유 2T, 마늘 2개, 소금 0.5t를 물에 넣고 충분히 끓인다.',
            '충분히 졸아들면 페퍼론치노 3개(선택)를 넣는다.',
            '충분히 유화가 되면 마늘 1개를 갈고 올리브유 1T를 넣고 버무린다.',
            '파르미지아노를 뿌려 섞는다.',
            '불을 다 끄고 날달걀 1개를 섞는다.',
            '다 섞은 뒤 치즈를 다시 뿌리고 후추로 마무리한다.'
        ]
    },
    {
        name: '연어 크림 파스타', fi: 'Kermainen lohipasta', times: ['lunch', 'dinner'], category: 'noodle', desc: '크림을 부어 오븐에 구운 연어를 부숴 면과 버무리는 파스타',
        image: 'cream_salmon_pasta.jpg',
        difficulty: 2, minutes: 30, kcal: 850,
        sides: ['루콜라 샐러드', '레몬 한 조각'],
        storage: '냉장 1일까지. 데울 때 우유를 조금 넣고 약불로 데워야 크림이 분리되지 않아요.',
        ingredients: [
            { name: '연어', amount: '160g (혹은 먹고 싶은 만큼)', fi: 'lohi' },
            { name: '파스타 면', amount: '1인분 (약 100g)', fi: 'pasta' },
            { name: '15% 크림', amount: '100ml', fi: 'ruokakerma 15%' },
            { name: '레몬', amount: '1개 (제스트 0.5t, 즙 2.5t)', fi: 'sitruuna' },
            { name: '차이브', amount: '1.5T', fi: 'ruohosipuli' },
            { name: '파르미지아노', amount: '20g', fi: 'parmesaani' },
            { name: '시금치 (또는 루콜라) (선택)', amount: '한 줌', fi: 'pinaatti / rucola' },
            { name: '소금', amount: '1t + 약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' }
        ],
        steps: [
            '물기를 제거한 연어 160g(혹은 먹고 싶은 만큼)에 레몬 제스트 0.5t, 소금, 후추로 간하고, 오븐 용기에 담는다.',
            '크림 100ml를 붓고 200도로 예열한 오븐에 18~20분 굽는다.',
            '그동안 물 1L에 소금 1t를 넣고 파스타를 안내 시간대로 삶는다.',
            '다 구워진 연어는 숟가락 등으로 큼직하게 부수고 다진 차이브 1.5T, 레몬즙 2.5t, 파르미지아노 20g을 갈아 넣는다.',
            '다 버무린 연어에 면을 섞어 준다. 농도는 면수로 맞춘다.',
            '시금치(혹은 루콜라, 선택)를 넣어 숨이 죽도록 섞으면 완성.'
        ]
    },
    {
        name: '마카로니라티코', fi: 'Makaronilaatikko', times: ['lunch', 'dinner'], category: 'noodle', desc: '다진 고기와 마카로니를 달걀물에 구운 핀란드 급식 단골',
        image: 'makaronilaatikko.jpg',
        difficulty: 2, minutes: 60, kcal: 900, servings: 2,
        sides: ['케첩 (핀란드식 정석)', '오이 피클', '그린 샐러드'],
        storage: '식혀서 냉장 3일, 냉동 1개월. 전자레인지에 2분 데우거나 오븐에 다시 구우면 겉이 바삭해져요.',
        ingredients: [
            { name: '다진고기', amount: '1팩 (400g)', fi: 'jauheliha' },
            { name: '마카로니', amount: '200g', fi: 'makaroni' },
            { name: '양파', amount: '1개', fi: 'sipuli' },
            { name: '소금', amount: '1t', fi: 'suola' },
            { name: '후추', amount: '0.5t', fi: 'pippuri' },
            { name: '올스파이스', amount: '0.3t', fi: 'maustepippuri (jauhettu)' },
            { name: '말린 타임', amount: '1t', fi: 'kuivattu timjami' },
            { name: '바질', amount: '2t', fi: 'basilika' },
            { name: '달걀', amount: '2개', fi: 'kananmuna' },
            { name: '우유', amount: '350ml', fi: 'maito' },
            { name: '슈레드 치즈', amount: '125ml (약 50g)', fi: 'juustoraaste' },
            { name: '버터', amount: '1t', fi: 'voi' }
        ],
        steps: [
            '오븐을 175도로 예열한 뒤 마카로니 200g을 포장지대로 삶는다.',
            '오븐 용기에 버터 1t를 얇게 바른다.',
            '양파 1개를 잘게 다진다.',
            '팬에 다진 고기 한 팩(400g)을 볶아 기름을 낸다.',
            '고기가 갈색이 되면 다진 양파를 넣고 기름은 조금 닦아 낸다.',
            '다 볶은 고기에 소금 0.5t, 후추 0.5t, 올스파이스 0.3t, 바질 2t, 타임 1t를 넣고 삶은 마카로니와 섞어 오븐 용기에 넣는다.',
            '달걀 2개에 우유 350ml, 소금 0.5t를 섞어 달걀물을 만들고 고기를 넣은 용기에 붓는다.',
            '오븐에 35분 굽고, 치즈 125ml(약 50g)를 위에 뿌려 녹을 때까지 마저 더 굽는다.',
            '용기를 기울였을 때 달걀물이 흐르지 않으면 완성.'
        ]
    },

    // ===== 밥·죽 =====
    {
        name: '리시푸로', fi: 'Riisipuuro', times: ['breakfast', 'lunch'], category: 'rice', desc: '죽용 쌀을 우유에 천천히 끓이는 핀란드 쌀 우유죽',
        image: 'riisipuuro.jpg',
        difficulty: 1, minutes: 45, kcal: 450,
        sides: ['시나몬 설탕', '버터 한 조각', '자두 키셀리 (과일 소스)'],
        storage: '냉장 2일. 데울 때 우유를 조금 넣고 저어 가며 데우기. 차갑게 먹어도 맛있어요.',
        ingredients: [
            { name: '쌀 (puuroriisi)', amount: '100ml', fi: 'puuroriisi' },
            { name: '3.5% 우유', amount: '500ml', fi: 'täysmaito' },
            { name: '소금', amount: '0.4t', fi: 'suola' },
            { name: '설탕', amount: '2t', fi: 'sokeri' },
            { name: '버터', amount: '10g', fi: 'voi' },
            { name: '시나몬 가루 (선택)', amount: '1t', fi: 'kaneli' }
        ],
        steps: [
            '냄비에 물 100ml를 끓인다.',
            '끓은 물에 죽용 쌀(puuroriisi) 100ml를 넣고 약불에서 물이 다 흡수될 때까지 익힌다.',
            '3.5% 우유(täysmaito) 500ml를 붓고 한 번 끓어오르기 직전까지 데운 뒤 아주 약불로 줄인다.',
            '냄비 바닥까지 눌어붙지 않게 저어 주며 걸쭉해질 때까지 익힌다.',
            '30분 정도 익힌 뒤 쌀알에 심이 죽으면 완성.',
            '불을 끄기 전 소금 0.4t를 넣어 간을 맞춘다. (우유랑 같이 넣으면 넘치기 쉬움)',
            '그릇에 담아 먹을 땐 시나몬 가루 1t, 설탕 2t, 버터 10g 등을 토핑으로 올려 먹는다.'
        ]
    },
    {
        name: '칼릴라티코', fi: 'Kaalilaatikko', times: ['lunch', 'dinner'], category: 'rice', desc: '양배추와 다짐육, 쌀을 흑시럽으로 달큰하게 구운 오븐 요리',
        image: 'kaalilaatikko.jpg',
        difficulty: 2, minutes: 100, kcal: 550, servings: 2,
        sides: ['링곤베리 잼 (정석)', '삶은 감자'],
        storage: '식혀서 냉장 3일, 냉동 1개월. 다음 날 데워 먹으면 더 맛있어요.',
        ingredients: [
            { name: '양배추', amount: '반 통 (500g)', fi: 'valkokaali' },
            { name: '양파', amount: '작은 것 1개', fi: 'sipuli' },
            { name: '다짐육', amount: '400g', fi: 'jauheliha' },
            { name: '쌀 (puuroriisi)', amount: '40ml', fi: 'puuroriisi' },
            { name: '버터', amount: '0.5T + 약간', fi: 'voi' },
            { name: '소금', amount: '1.1t', fi: 'suola' },
            { name: '후추', amount: '0.5t', fi: 'pippuri' },
            { name: '마조람', amount: '1.5t', fi: 'meirami' },
            { name: '흑시럽', amount: '2T', fi: 'tumma siirappi' }
        ],
        steps: [
            '양배추 반 통(500g)을 심을 빼고 채 썬다.',
            '양파 1개도 잘게 다진다.',
            '넓은 냄비에 물 250ml를 끓이고 소금 0.8t와 양배추, 다진 양파를 넣고 30분 정도 저어 가며 끓인다.',
            '그동안 오븐을 200도에 예열해 두고 팬에는 다짐육 400g을 갈색이 되도록 볶은 뒤 소금 0.3t로 간을 한다.',
            '볶은 고기, 마조람 1.5t, 후추 0.5t, 흑시럽 2T를 양배추와 양파를 끓이던 냄비에 넣는다.',
            '오븐 용기에 버터를 조금 바르고 바닥에 쌀(puuroriisi) 40ml를 뿌린다. 양배추 혼합물을 국물째 붓고, 남은 버터 0.5T를 조각내 위에 올린다.',
            '오븐에 50분간 굽고 쌀이 단단하면 10분 정도 더 굽는다.'
        ]
    },
    {
        name: '닭고기 쌀 오븐구이', fi: 'Kana-riisivuoka', times: ['lunch', 'dinner'], category: 'rice', desc: '쌀 위에 닭고기와 채소를 올려 크림 육수로 한 번에 굽는 오븐 요리',
        image: 'kana_riisivuoka.jpg',
        difficulty: 1, minutes: 55, kcal: 650, servings: 2,
        sides: ['그린 샐러드', '오이 피클'],
        storage: '식혀서 냉장 2~3일. 데울 때 물을 조금 뿌리고 전자레인지에.',
        ingredients: [
            { name: '쌀 (puuroriisi)', amount: '150ml', fi: 'puuroriisi' },
            { name: '닭고기', amount: '400g (슬라이스나 스트립이 잘 익어요)', fi: 'broilerin suikale / fileepala' },
            { name: '육수 큐브', amount: '반 개', fi: 'liemikuutio' },
            { name: '15% 크림', amount: '100ml', fi: 'ruokakerma 15%' },
            { name: '양파', amount: '다진 것 50ml', fi: 'sipuli' },
            { name: '시금치', amount: '40g', fi: 'pinaatti' },
            { name: '냉동 옥수수', amount: '100g', fi: 'maissi (pakaste)' },
            { name: '카레 가루', amount: '0.5t', fi: 'curry' },
            { name: '칠리 가루', amount: '0.5t', fi: 'chilijauhe' },
            { name: '소금', amount: '0.5t', fi: 'suola' },
            { name: '파슬리 (선택)', amount: '약간', fi: 'persilja' }
        ],
        steps: [
            '오븐을 200도로 예열해 두고 쌀 150ml는 두세 번 헹군다.',
            '1.2~1.5L 정도 되는 오븐 용기에 쌀을 고르게 펴고 그 위에 닭고기 400g을 올린다.',
            '그동안 냄비에 물 250ml를 끓이고 육수 큐브 반 개와 15% 크림 100ml를 넣어 섞은 뒤 용기에 붓는다.',
            '냉동 옥수수 100g, 시금치 40g, 다진 양파 50ml, 카레 가루 0.5t, 칠리 가루 0.5t, 소금 0.5t를 넣고 섞는다. 닭고기는 물 아래로 잠겨야 한다.',
            '오븐에 35분 굽는다. 쌀이 덜 익었는데 물이 없다면 뜨거운 물을 조금 더 붓고 5~10분 더 굽는다.',
            '꺼낸 뒤 5~10분 정도 뜸을 들이고 파슬리를 뿌린다.'
        ]
    },

    // ===== 빵 =====
    {
        name: '훈제연어 호밀빵', fi: 'Lohileipä', times: ['breakfast', 'lunch'], category: 'bread', desc: '크림치즈와 훈제연어, 딜을 올린 로히레이패',
        image: 'lohileipa.jpg',
        difficulty: 1, minutes: 5, kcal: 400,
        sides: ['삶은 계란', '레몬 한 조각', '커피'],
        storage: '만들어 두면 빵이 눅눅해지니 바로 먹기. 개봉한 훈제연어는 랩으로 싸서 냉장 2~3일.',
        ingredients: [
            { name: '호밀빵 슬라이스', amount: '1~2장', fi: 'ruisleipä' },
            { name: '크림치즈', amount: '원하는 만큼 (일반 혹은 차이브/부추 맛)', fi: 'tuorejuusto' },
            { name: '훈제연어 슬라이스', amount: '먹고 싶은 만큼', fi: 'kylmäsavulohi' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '딜', amount: '약간', fi: 'tilli' },
            { name: '오이 (선택)', amount: '얇게 몇 장', fi: 'kurkku' },
            { name: '양파 (선택)', amount: '얇게 몇 장', fi: 'sipuli' }
        ],
        steps: [
            '호밀빵을 토스터에 1~2분 정도 살짝 굽는다.',
            '빵에 크림치즈(혹은 무나보이)를 원하는 만큼 바른다.',
            '치즈 위에 얇게 썬 오이나 양파를 깐다. (선택)',
            '훈제연어 슬라이스를 먹고 싶은 만큼 얹는다.',
            '딜과 후추를 뿌려 마무리한다.'
        ]
    },
    {
        name: '카렐리안 파이 & 달걀 버터', fi: 'Karjalanpiirakka ja munavoi', times: ['breakfast', 'lunch'], category: 'bread', desc: '마트에서 산 카렐리안 파이에 무나보이(달걀 버터)를 올려 먹기',
        image: 'karjalanpiirakka.jpg',
        difficulty: 1, minutes: 15, kcal: 300, servings: '5회분',
        sides: ['우유나 커피', '오이 슬라이스'],
        storage: '무나보이는 밀폐 용기에 냉장 3~4일. 남은 파이는 냉장 2~3일(냉동도 가능), 오븐이나 토스터에 데우기.',
        ingredients: [
            { name: '카렐리안 파이', amount: '먹을 만큼 (마트 제품)', fi: 'karjalanpiirakka' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '버터', amount: '50g', fi: 'voi' },
            { name: '후추', amount: '취향껏', fi: 'pippuri' },
            { name: '차이브 (선택)', amount: '1T', fi: 'ruohosipuli' }
        ],
        steps: [
            '카렐리안 파이는 마트에도 판다. 만들기 어려우니 무나보이 레시피만 참조.',
            '계란은 완숙으로 삶는다. 5회분에 1개.',
            '식은 달걀을 포크로 잘게 으깨고 부드러운 버터 50g을 섞는다. 오래 둘 거라면 식용유 1T를 넣는다.',
            '다진 차이브 1T, 후추를 취향껏 넣어 섞는다.',
            '데운 카렐리안 파이 위에 무나보이를 올려 먹는다.'
        ]
    },
    {
        name: '판누카꾸', fi: 'Pannukakku', times: ['breakfast', 'lunch'], category: 'bread', desc: '반죽을 그릇째 오븐에 굽는 두툼한 핀란드 팬케이크',
        image: 'pannukakku.jpg',
        difficulty: 1, minutes: 70, kcal: 500, servings: 2,
        sides: ['딸기잼', '휘핑크림', '완두콩 수프 (목요일 정석 조합)'],
        storage: '식혀서 냉장했다가 오븐이나 프라이팬에 데워 먹는다.',
        ingredients: [
            { name: '계란', amount: '2개', fi: 'kananmuna' },
            { name: '우유', amount: '400ml', fi: 'maito' },
            { name: '밀가루', amount: '225ml', fi: 'vehnäjauho' },
            { name: '설탕', amount: '2T', fi: 'sokeri' },
            { name: '소금', amount: '0.5t', fi: 'suola' },
            { name: '버터', amount: '25g', fi: 'voi' }
        ],
        steps: [
            '계란 2개를 풀어 준다.',
            '우유 200ml, 밀가루 225ml, 설탕 2T, 소금 0.5t를 넣어 덩어리 없이 섞은 다음 남은 우유 200ml를 부어 가며 젓는다.',
            '반죽을 30분간 불리면서 오븐은 200도로 예열한다.',
            '둥근 오븐 용기(혹은 사각)에 버터 25g을 넣고 오븐에 5분간 두며 녹인다.',
            '반죽을 한 번 저어서 녹은 버터 위에 붓고 오븐에 굽는다. 30분 정도에 한 번 확인해서 가운데가 출렁이지 않으면 완성.',
            '조금 식혀서 자르고 잼 등을 올려 먹는다.'
        ]
    },
    {
        name: '페루나리에스카', fi: 'Perunarieska', times: ['breakfast', 'lunch'], category: 'bread', desc: '으깬 감자로 반죽해 오븐에 굽는 납작한 감자빵',
        image: 'perunarieska.jpg',
        difficulty: 1, minutes: 35, kcal: 200, servings: '5개분',
        sides: ['버터', '훈제연어', '치즈'],
        storage: '식으면 토스터나 프라이팬에 데워 먹는다.',
        ingredients: [
            { name: '매시드 포테이토', amount: '300ml (차가운 으깬 감자)', fi: 'perunamuusi' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '소금', amount: '0.3t', fi: 'suola' },
            { name: '밀가루', amount: '200ml + 덧가루', fi: 'vehnäjauho' },
            { name: '버터', amount: '10g', fi: 'voi' }
        ],
        steps: [
            '오븐을 225도로 예열한다.',
            '차가운 으깬 감자(혹은 매시드 포테이토 제품) 300ml에 계란 1개, 소금 0.3t를 넣고 섞는다.',
            '밀가루 200ml를 넣고 고르게 섞일 정도로만 적당히 섞는다.',
            '반죽을 숟가락으로 5등분 해서 유산지 위에 떠 놓고 밀가루를 묻혀 둥글고 납작하게 편다. (귀찮다면 한 번에 다 펴고 구운 뒤 잘라도 된다)',
            '오븐에서 20분 굽는다.',
            '다 구워지면 따뜻할 때 버터 10g을 바른다.'
        ]
    },

    // ===== 스튜·수프 =====
    {
        name: '로히케이토', fi: 'Lohikeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '핀란드식 연어 크림 수프, 추운 날 딱',
        image: 'lohikeitto.jpg',
        difficulty: 2, minutes: 40, kcal: 550, servings: 2,
        sides: ['호밀빵 & 버터', '레몬 한 조각'],
        storage: '냉장 2일. 다시 데울 때 팔팔 끓이면 연어가 부서지고 크림이 분리되니 약불로. 감자 식감이 변해서 냉동은 비추천.',
        ingredients: [
            { name: '연어', amount: '200g', fi: 'lohi' },
            { name: '감자', amount: '4개', fi: 'peruna' },
            { name: '양파', amount: '작은 것 1개', fi: 'sipuli' },
            { name: '당근', amount: '1개', fi: 'porkkana' },
            { name: '버터', amount: '1T', fi: 'voi' },
            { name: '올스파이스', amount: '3알', fi: 'maustepippuri' },
            { name: '월계수잎', amount: '1장', fi: 'laakerinlehti' },
            { name: '육수 큐브', amount: '1개', fi: 'kalaliemikuutio / liemikuutio' },
            { name: '15% 크림', amount: '100ml', fi: 'ruokakerma 15%' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '딜', amount: '다진 것 2T', fi: 'tilli' },
            { name: '차이브', amount: '다진 것 1T', fi: 'ruohosipuli' }
        ],
        steps: [
            '작은 양파 1개는 잘게 다지고, 당근 1개도 얇게 동전 모양으로 썬다. 감자 4개는 껍질을 벗겨 깍둑썬다. 연어 200g은 2cm로 깍둑썬다.',
            '냄비에 버터 0.5T를 녹이고 양파, 당근, 올스파이스 3알, 월계수잎 1장을 넣어 양파가 투명해질 때까지 볶는다.',
            '거기에 물 600ml와 육수 큐브 1개를 넣고 끓인다. 끓어오르면 감자를 넣고 10분 정도 익힌다.',
            '연어를 넣고 약불로 줄여 불투명해질 때까지 익힌다. 연어가 부서지지 않게 냄비를 살짝 흔드는 정도로만 섞는다.',
            '15% 크림 100ml와 버터 0.5T를 넣고 다시 불을 올린다. 팔팔 끓어오르지 않을 정도로.',
            '후추와 소금으로 간을 한다. 그래도 싱겁다면 육수 큐브를 더 넣어도 된다.',
            '불을 끄고 월계수잎을 건진 뒤 다진 딜 2T와 다진 차이브 1T를 넣는다.'
        ]
    },
    {
        name: '마카라케이토', fi: 'Makkarakeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '소시지와 감자, 수프용 채소를 푹 끓인 핀란드 가정식 수프',
        image: 'makkarakeitto.jpg',
        difficulty: 1, minutes: 40, kcal: 500, servings: 3,
        sides: ['호밀빵', '머스터드'],
        storage: '냉장 2~3일. 감자 식감이 변해서 냉동은 비추천. 데울 때 물을 조금 더 넣기.',
        ingredients: [
            { name: '감자', amount: '4개', fi: 'peruna' },
            { name: '스프용 채소 모듬', amount: '1팩 (파슬리 포함)', fi: 'keittojuurekset' },
            { name: '양파', amount: '1개', fi: 'sipuli' },
            { name: '마늘', amount: '2개', fi: 'valkosipuli' },
            { name: '소시지', amount: '270g', fi: 'lenkkimakkara' },
            { name: '식용유 (또는 버터)', amount: '1T', fi: 'rypsiöljy / voi' },
            { name: '소고기 폰드', amount: '1.5T', fi: 'naudanlihafondi' },
            { name: '월계수잎', amount: '2장', fi: 'laakerinlehti' },
            { name: '올스파이스', amount: '10알', fi: 'maustepippuri' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '칠리플레이크 (선택)', amount: '약간', fi: 'chilihiutale' }
        ],
        steps: [
            '감자 4개는 껍질을 벗겨 깍둑썰고 스프용 채소 모듬도 같은 크기로 썬다. (모듬에 든 파슬리는 잘게 다져 따로 둔다)',
            '양파 1개, 마늘 2개를 잘게 다지고 소시지 270g도 깍둑썬다.',
            '냄비에 식용유 1T(또는 버터)를 두르고 양파와 마늘을 중약불에서 투명해질 때까지 볶는다.',
            '물 1.2L를 붓고 끓인 뒤 소고기 폰드 1.5T, 월계수잎 2장, 올스파이스 10알, 감자, 스프용 채소를 넣고 15분간 끓인다.',
            '그동안 프라이팬에 소시지를 노릇하게 굽고 그걸 수프에 넣는다.',
            '한 번 더 끓여 감자가 익었는지 보고 폰드, 후추, 칠리플레이크 등으로 간을 맞춘다.',
            '마지막으로 월계수잎을 건져 내고 파슬리를 뿌려 마무리한다.'
        ]
    },
    {
        name: '헤르네케이토', fi: 'Hernekeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '핀란드 목요일 전통 메뉴, 마트 완두콩 수프 캔으로 간단하게',
        image: 'hernekeitto.jpg',
        difficulty: 1, minutes: 15, kcal: 500,
        sides: ['판누카꾸 (디저트로)', '호밀빵'],
        storage: '남은 수프는 용기에 옮겨 냉장 2~3일, 냉동 1개월. 데우면 되직해지니 물을 조금 넣기.',
        ingredients: [
            { name: '완두콩 스프 통조림', amount: '1개', fi: 'hernekeitto (säilyke)' },
            { name: '크렘 프레슈', amount: '18% 75g', fi: 'ranskankerma 18%' },
            { name: '소시지', amount: '50g', fi: 'makkara' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '홀그레인 머스타드', amount: '1T', fi: 'rakeinen sinappi' },
            { name: '당근 (선택)', amount: '반 개', fi: 'porkkana' },
            { name: '양파 (선택)', amount: '다진 것 1T', fi: 'sipuli' }
        ],
        steps: [
            '냄비에 완두콩 스프 통조림 1개와 물 125ml, 당근 반 개(선택)를 넣고 바닥에 눌어붙지 않게 저어 가며 끓인다.',
            '소시지 50g을 깍둑썰어 넣는다.',
            '18% 크렘 프레슈를 75g 넣고 섞은 뒤 농도를 맞춘다.',
            '뜨겁게 데운 채로 후추를 뿌린다.',
            '그릇에 담고 홀그레인 머스타드 1T와 다진 양파 1T(선택)를 뿌려 마무리한다.'
        ]
    },
    {
        name: '시에니케이토', fi: 'Sienikeitto', times: ['lunch', 'dinner'], category: 'stew', desc: '양송이를 볶아 크림으로 끓이는 숲의 수프',
        image: 'sienikeitto.jpg',
        difficulty: 1, minutes: 30, kcal: 350, servings: 2,
        sides: ['호밀빵 & 버터', '치즈 토스트'],
        storage: '냉장 2일. 크림이 들어가서 약불로 저어 가며 데우기. 냉동하면 분리될 수 있어요.',
        ingredients: [
            { name: '양송이', amount: '125g', fi: 'herkkusieni' },
            { name: '양파', amount: '반 개 (50g)', fi: 'sipuli' },
            { name: '마늘', amount: '1개', fi: 'valkosipuli' },
            { name: '생타임', amount: '2t', fi: 'tuore timjami' },
            { name: '소금', amount: '0.3t + 약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '버터', amount: '1T', fi: 'voi' },
            { name: '밀가루', amount: '2T', fi: 'vehnäjauho' },
            { name: '휘핑크림', amount: '100ml', fi: 'kuohukerma' },
            { name: '소고기 폰드', amount: '0.5T', fi: 'naudanlihafondi' }
        ],
        steps: [
            '양송이 125g은 썰어 두고 양파 반 개, 마늘 하나는 잘게 다진다.',
            '물 350ml는 따로 끓여 두면서 빈 냄비에 버섯을 넣고 중불에서 물이 다 날아갈 때까지 볶는다. 생타임 1t, 소금 0.3t, 후추를 넣고 섞은 뒤 따로 빼 둔다.',
            '같은 냄비에 버터 1T를 녹이고 양파와 마늘을 투명해질 때까지 볶은 뒤 밀가루 2T를 넣고 1분쯤 저으며 볶는다.',
            '데워 둔 물을 조금씩 나눠 부으며 덩어리가 없어질 때까지 계속 젓는다.',
            '그 물에 소고기 폰드 0.5T, 덜어 둔 버섯을 넣고 뚜껑을 덮어 약불에서 5분쯤 끓인다.',
            '휘핑크림 100ml를 넣고 뜨겁게 데운다. 소금으로 간을 맞춘 뒤 생타임으로 장식한다.'
        ]
    },

    // ===== 감자 요리 =====
    {
        name: '포론캐리스튀스', fi: 'Poronkäristys', times: ['dinner'], category: 'plate', desc: '냉동 순록 고기를 버터에 볶아 끓이는 라플란드 요리, 매시드 포테이토와 링곤베리를 곁들여',
        image: 'poronkaristys.jpg',
        difficulty: 2, minutes: 40, kcal: 650,
        sides: ['오이 피클'],
        storage: '냉장 2일, 냉동 1개월. 물을 조금 넣고 약불로 데우기.',
        ingredients: [
            { name: '냉동 순록 볶음용 고기', amount: '1봉', fi: 'poronkäristys (pakaste)' },
            { name: '버터', amount: '1T', fi: 'voi' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '후추', amount: '0.3t', fi: 'pippuri' },
            { name: '링곤베리', amount: '먹을 만큼 (냉동)', fi: 'puolukka (pakaste)' },
            { name: '흑시럽', amount: '2t', fi: 'tumma siirappi' },
            { name: '매시드 포테이토', amount: '300g (냉동)', fi: 'perunamuusi (pakaste)' },
            { name: '맥주 (선택)', amount: '150ml (물 대신)', fi: 'olut' }
        ],
        steps: [
            '냉동 링곤베리를 먹을 만큼 꺼내서 해동해 둔다.',
            '팬을 달궈 버터 1T를 녹이고 언 상태의 냉동 순록 볶음용 고기를 그대로 넣고 녹는 대로 한 장씩 떼어 내 고루 굽는다.',
            '물(혹은 맥주) 150ml와 후추 0.3t를 넣고 뚜껑을 덮어 약불에서 익힌다.',
            '그동안 냉동 매시드 포테이토 300g을 데운다.',
            '해동한 링곤베리는 포크로 으깨고 흑시럽 2t를 넣어 섞는다.',
            '고기에 소금으로 간을 맞추고 매시드 포테이토 위에 국물째 부어 낸다.'
        ]
    },
    {
        name: '마카라카스티케', fi: 'Makkarakastike', times: ['lunch', 'dinner'], category: 'plate', desc: '링 소시지를 토마토 크림소스에 끓인 핀란드 급식 맛, 삶은 감자와 함께',
        image: 'makkarakastike.jpg',
        difficulty: 1, minutes: 25, kcal: 650, servings: 2,
        sides: ['삶은 감자', '오이 피클', '강판에 간 당근 샐러드'],
        storage: '냉장 2~3일. 소스는 냉동 1개월도 가능, 감자는 그때그때 삶기.',
        ingredients: [
            { name: '소시지 (lenkkimakkara)', amount: '270g', fi: 'lenkkimakkara' },
            { name: '양파', amount: '1개 (약 100g)', fi: 'sipuli' },
            { name: '식용유', amount: '1T', fi: 'rypsiöljy' },
            { name: '밀가루', amount: '2T', fi: 'vehnäjauho' },
            { name: '양념용 크림', amount: '125ml', fi: 'ruokakerma' },
            { name: '머스타드', amount: '0.5T', fi: 'sinappi' },
            { name: '토마토 페이스트', amount: '0.5T', fi: 'tomaattipyree' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '파슬리', amount: '약간', fi: 'persilja' },
            { name: '간장 (선택)', amount: '약간', fi: 'soijakastike' },
            { name: '소고기 폰드 (선택)', amount: '약간', fi: 'naudanlihafondi' }
        ],
        steps: [
            '소시지 270g은 껍질을 벗겨 가늘게 썬다. 양파 1개는 잘게 다진다.',
            '팬에 식용유 1T를 두르고 소시지와 양파를 노릇해질 때까지 가볍게 볶는다.',
            '볶던 기름에 밀가루 2T를 위에 골고루 뿌리고 섞는다. 팬을 불에서 내리고 물 250ml를 부어 덩어리 없이 저어 준다.',
            '다시 불을 올리고 크림 125ml, 머스타드 0.5T, 토마토 페이스트 0.5T, 후추를 넣는다. 간장(선택)이나 소고기 폰드(선택)도 색을 위해 넣을 수 있다.',
            '약불에서 5~10분 정도 끓여 걸쭉해지면 맛을 보고 소금으로 간을 한다.',
            '다진 파슬리를 뿌려 마무리한다.'
        ]
    },
    {
        name: '마카라스트로가노프', fi: 'Makkarastroganoff', times: ['lunch', 'dinner'], category: 'plate', desc: '소시지를 토마토와 후추 크림소스에 끓여 삶은 감자와 먹는 핀란드식 스트로가노프',
        image: 'makkarastroganoff.jpg',
        difficulty: 1, minutes: 25, kcal: 650, servings: 2,
        sides: ['삶은 감자', '오이 피클'],
        storage: '냉장 2~3일. 소스는 냉동 1개월도 가능, 감자는 그때그때 삶기.',
        ingredients: [
            { name: '소시지', amount: '270g', fi: 'lenkkimakkara' },
            { name: '양파', amount: '반 개', fi: 'sipuli' },
            { name: '마늘', amount: '1개', fi: 'valkosipuli' },
            { name: '올리브유', amount: '0.5T', fi: 'oliiviöljy' },
            { name: '토마토 페이스트', amount: '2T', fi: 'tomaattipyree' },
            { name: '밀가루', amount: '1T', fi: 'vehnäjauho' },
            { name: '15% 후추 크림', amount: '100ml', fi: 'pippurikerma (ruokakerma 15%)' },
            { name: '오이 피클 큐브', amount: '60g', fi: 'kurkkukuutio' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '감자', amount: '삶은 것 먹을 만큼', fi: 'peruna' },
            { name: '머스타드 (선택)', amount: '1T', fi: 'sinappi' }
        ],
        steps: [
            '소시지 270g은 깍둑썰고 양파, 마늘 1개도 다져 둔다.',
            '팬에 올리브유 0.5T를 두르고 소시지를 굽는다. 그러고는 다진 양파와 마늘을 넣고 몇 분 더 볶는다.',
            '토마토 페이스트 2T, 밀가루 1T를 넣고 잠깐 볶는다.',
            '물 150ml, 후추 크림 100ml를 몇 번에 나눠 부으며 계속 젓는다. 한 번 끓어오르면 약불로 줄여 5분 더 익힌다.',
            '오이 피클 큐브 60g을 섞고 머스타드 1T(선택)도 넣는다. 소금으로 간을 한 뒤 삶은 감자와 낸다.'
        ]
    },
    {
        name: '퓌티판누', fi: 'Pyttipannu', times: ['breakfast', 'lunch'], category: 'plate', desc: '깍둑 감자, 양파, 소시지를 볶고 달걀프라이를 올리는 한 판 요리',
        image: 'pyttipannu.jpg',
        difficulty: 1, minutes: 25, kcal: 650,
        sides: ['절임 비트 (정석)', '오이 피클', '케첩'],
        storage: '냉장 2일, 팬에 다시 볶기. 달걀프라이는 먹을 때 새로 부치기.',
        ingredients: [
            { name: '감자 (단단한 감자)', amount: '삶은 것 2~3개', fi: 'kiinteä peruna (vihreä pussi)' },
            { name: '양파', amount: '반 개', fi: 'sipuli' },
            { name: '소시지', amount: '135g', fi: 'makkara' },
            { name: '식용유', amount: '0.5T', fi: 'rypsiöljy' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '차이브', amount: '다진 것 1T', fi: 'ruohosipuli' },
            { name: '계란', amount: '1개', fi: 'kananmuna' },
            { name: '절임 비트 (선택)', amount: '몇 조각', fi: 'etikkapunajuuri' },
            { name: '오이 피클 (선택)', amount: '몇 조각', fi: 'suolakurkku' }
        ],
        steps: [
            '삶은 단단한 감자 2, 3개의 껍질을 벗겨 1.5cm 크기로 깍둑썬다.',
            '양파 반 개는 웨지, 소시지 135g은 감자와 같은 크기로 깍둑썬다.',
            '팬에 식용유 0.5T를 두르고 양파가 부드러워질 때까지 볶는다.',
            '감자와 소시지를 넣고 가끔만 뒤집어 가며 노릇해질 때까지 볶는다.',
            '그동안 다른 팬에 달걀프라이 하나를 써니사이드업으로 부친다.',
            '소금, 후추로 간을 하고 다진 차이브 1T를 뿌린다.',
            '그릇에 옮겨 달걀프라이를 올리고 절임 비트 슬라이스, 오이 피클 슬라이스를 곁들여 낸다.'
        ]
    },

    // ===== 간단식 =====
    {
        name: '스크램블 에그', fi: 'Munakokkeli', times: ['breakfast'], category: 'quick', desc: '버터에 빠르게 익히는 5분 스크램블 에그, 빵과 함께',
        image: 'scrambled_egg.jpg',
        difficulty: 1, minutes: 5, kcal: 300,
        sides: ['빵', '토마토 슬라이스', '커피'],
        storage: '바로 먹는 메뉴라 보관은 비추천.',
        ingredients: [
            { name: '계란', amount: '2개', fi: 'kananmuna' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '후추', amount: '약간', fi: 'pippuri' },
            { name: '버터', amount: '1T', fi: 'voi' },
            { name: '크렘 프레슈 (선택)', amount: '1~2T', fi: 'ranskankerma' }
        ],
        steps: [
            '계란 2개를 풀어 계란물을 만들고 소금, 후추로 간을 한다.',
            '팬을 센 불로 올려 버터 1T를 두르고 어느 정도 온도가 오르면 중불로 내린다.',
            '계란물을 붓고 저어 가며 빠르게 익힌다. 이때 크렘 프레슈를 넣어도 좋다.',
            '다 익으면 그릇에 담아 빵과 함께 먹는다.'
        ]
    },
    {
        name: '카우라푸로', fi: 'Kaurapuuro', times: ['breakfast'], category: 'quick', desc: '전자레인지로 3분이면 되는 핀란드의 가장 흔한 아침 귀리죽',
        image: 'kaurapuuro.jpg',
        difficulty: 1, minutes: 5, kcal: 300,
        sides: ['과일 잼', '냉동 베리', '커피'],
        storage: '냉장 1~2일. 굳으면 물이나 우유를 조금 넣고 전자레인지에 1분.',
        ingredients: [
            { name: '귀리 플레이크', amount: '100ml', fi: 'kaurahiutale' },
            { name: '소금', amount: '약간', fi: 'suola' },
            { name: '버터', amount: '1T', fi: 'voi' }
        ],
        steps: [
            '깊은 그릇에 귀리 플레이크 100ml, 물 200ml를 넣고 소금 간을 한다.',
            '전자레인지 최대 출력(650W)으로 2분 30초 돌린다.',
            '저어 보면서 아직 묽거나 귀리가 덜 풀렸다면 30초씩 더 돌린다.',
            '다 되면 꺼내서 잠시 뜸을 들이고 고루 젓는다.',
            '버터 1T, 각종 과일 잼 등을 올려 먹는다.'
        ]
    },
    {
        name: '마랴라카', fi: 'Marjarahka', times: ['breakfast'], category: 'quick', desc: '거품 낸 바닐라 소스에 쿼크와 베리를 섞는 불 없는 한 그릇',
        image: 'marjarahka.jpg',
        difficulty: 1, minutes: 10, kcal: 150, servings: 2,
        sides: ['뮤즐리나 그래놀라', '커피'],
        storage: '뚜껑을 덮어 냉장고에 보관하면 된다. 하루이틀 안에 먹기.',
        ingredients: [
            { name: '바닐라 소스 (휘핑용)', amount: '85ml', fi: 'vaahtoutuva vaniljakastike' },
            { name: '쿼크', amount: '70g', fi: 'maitorahka' },
            { name: '냉동 베리', amount: '적당량', fi: 'pakastemarjat' },
            { name: '설탕 (선택)', amount: '1t', fi: 'sokeri' }
        ],
        steps: [
            '베리는 꺼내 둬서 살짝 녹인다.',
            '바닐라 소스(vaniljakastike) 85ml를 컵에 담아 거품기로 두꺼운 거품이 될 때까지 휘핑한다.',
            '쿼크(maitorahka) 70g을 넣고 매끄럽게 섞는다.',
            '살짝 녹인 베리를 올리고 거품이 꺼지지 않게 살살 섞는다.',
            '설탕 1t 등으로 취향껏 단맛을 더하면 된다.'
        ]
    },
    {
        name: '레이패유스토', fi: 'Leipäjuusto', times: ['breakfast'], category: 'quick', desc: '마트에서 파는 뽀득한 빵치즈를 굽거나 커피에 넣거나, 네 가지로 즐기기',
        image: 'leipajuusto.jpg',
        difficulty: 1, minutes: 10, kcal: 350,
        sides: ['커피', '베리 잼'],
        storage: '남은 치즈는 랩으로 싸서 냉장, 포장지 날짜까지. 먹기 전에 팬이나 오븐에 다시 데우기.',
        ingredients: [
            { name: '레이패유스토', amount: '먹을 만큼', fi: 'leipäjuusto' },
            { name: '베리 잼 (선택)', amount: '약간', fi: 'marjahillo (lakkahillo)' },
            { name: '커피 (선택)', amount: '1잔', fi: 'kahvi' },
            { name: '요리용 크림 (선택)', amount: '자작하게', fi: 'ruokakerma' },
            { name: '설탕 (선택)', amount: '약간', fi: 'sokeri' },
            { name: '계피가루 (선택)', amount: '약간', fi: 'kaneli' },
            { name: '호밀빵 (선택)', amount: '1장', fi: 'ruisleipä' }
        ],
        steps: [
            '① 구워 먹기: 치즈를 부채꼴 모양으로 잘라 마른 팬에 약불로 1~2분 굽거나 전자레인지에 30~45초 정도 돌린 뒤 베리 잼을 올려 먹는다.',
            '② 모닝 커피: 각설탕 크기로 깍둑썰어 머그잔 바닥에 넣은 다음 뜨거운 커피를 붓는다. 치즈를 먼저 건져 먹고 커피를 즐긴다.',
            '③ 오븐 구이: 작은 용기에 치즈를 크게 썰어 담고 요리용 크림(Ruokakerma)을 반쯤 잠기도록 자작하게 붓는다. 설탕과 계피가루(선택)를 뿌려 200도 오븐에 10~15분간 부풀어 오르도록 굽는다.',
            '④ 토스트: 살짝 구운 호밀빵 위에 따뜻하게 데운 레이패유스토 한 조각을 얹어 잼과 함께 먹는다.'
        ]
    }
];
