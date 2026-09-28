// data.js

// 1. D-Day 및 날씨 기본 설정
const CONFIG = {
    departureDate: "2026-12-31T23:45:00",
    tampereCoords: { lat: 61.4978, lon: 23.7610 },
    budgetTotal: 2500
};

// 2. 항공편 바우처 데이터
const FLIGHT_DATA = {
    outbound: {
        date: "2026.12.31 (목) ➔ 헬싱키(HEL)",
        legs: [
            { depTime: "23:45", arrTime: "05:25", depCode: "ICN", arrCode: "CPH", flight: "SK988", duration: "13h 40m", arrDate: "01.01 (금)", plusDay: true },
            { layover: "⏳ 코펜하겐 대기 2시간 30분" },
            { depTime: "07:55", arrTime: "10:35", depCode: "CPH", arrCode: "HEL", flight: "SK1706", duration: "1h 40m", arrDate: "01.01 (금)", plusDay: false }
        ]
    },
    inbound: {
        date: "2027.02.01 (월) ➔ 인천(ICN)",
        legs: [
            { depTime: "16:05", arrTime: "16:45", depCode: "HEL", arrCode: "CPH", flight: "SK1713", duration: "1h 40m", arrDate: "02.01 (월)", plusDay: false },
            { layover: "⏳ 코펜하겐 대기 6시간 25분 (시내관광)" },
            { depTime: "23:20", arrTime: "17:45", depCode: "CPH", arrCode: "ICN", flight: "SK987", duration: "10h 25m", arrDate: "02.02 (화)", plusDay: true }
        ]
    }
};

// 3. 예산 데이터
const BUDGET_DATA = [
    { id: "transport", icon: "✈️", title: "교통 및 항공권", amount: 440, items: [
        { name: "영국 런던 왕복 항공권", cost: 200 },
        { name: "헬싱키 ↔ 탐페레 기차(VR)", cost: 120 },
        { name: "탈린 왕복 페리", cost: 60 },
        { name: "탐페레 대중교통 30일권", cost: 60 }
    ]},
    { id: "food", icon: "🍔", title: "식비 및 생활비", amount: 850, items: [
        { name: "탐페레 한 달 마트 식재료", cost: 650 },
        { name: "런던 2박 3일 식비", cost: 100 },
        { name: "탈린 2박 3일 식비", cost: 100 }
    ]},
    // 필요 시 숙소비, 액티비티 등 추가
];