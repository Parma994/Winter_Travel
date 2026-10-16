// data/flights.js - 출발 전 탭 항공편 바우처 데이터 (SAS)
// 시각은 모두 현지 시간. duration(비행시간)은 바우처 표기 그대로 적습니다.
// 자동 계산: 경유지 대기 시간(앞 구간 도착 ~ 다음 구간 출발), +1일 배지(출발/도착 날짜가 다르면 표시)
// layoverNote: 이 구간 도착 후 대기 시간 옆에 붙는 메모

const FLIGHTS = [
    {
        badge: '출국편', tone: 'blue',
        title: '2026.12.31 (목) ➔ 헬싱키(HEL)',
        legs: [
            {
                flightNo: 'SK988', duration: '13h 40m',
                from: { code: 'ICN', city: '인천', time: '23:45', date: '12.31 (목)' },
                to:   { code: 'CPH', city: '코펜하겐', time: '05:25', date: '01.01 (금)' }
            },
            {
                flightNo: 'SK1706', duration: '1h 40m',
                from: { code: 'CPH', city: '코펜하겐', time: '07:55', date: '01.01 (금)' },
                to:   { code: 'HEL', city: '헬싱키', time: '10:35', date: '01.01 (금)' }
            }
        ]
    },
    {
        badge: '귀국편', tone: 'red',
        title: '2027.02.01 (월) ➔ 인천(ICN)',
        legs: [
            {
                flightNo: 'SK1713', duration: '1h 50m', layoverNote: '시내관광',
                from: { code: 'HEL', city: '헬싱키', time: '16:05', date: '02.01 (월)' },
                to:   { code: 'CPH', city: '코펜하겐', time: '16:55', date: '02.01 (월)' }
            },
            {
                flightNo: 'SK987', duration: '10h 25m',
                from: { code: 'CPH', city: '코펜하겐', time: '23:20', date: '02.01 (월)' },
                to:   { code: 'ICN', city: '인천', time: '17:45', date: '02.02 (화)' }
            }
        ]
    }
];
