// data/flights.js - 출발 전 탭 항공편 바우처 데이터 (SAS)
// 시각은 모두 현지 시간, 날짜는 'YYYY-MM-DD' (요일과 카드 제목은 자동 생성). duration(비행시간)은 바우처 표기 그대로 적습니다.
// 자동 계산: 경유지 대기 시간(앞 구간 도착 ~ 다음 구간 출발), +1일 배지(출발/도착 날짜가 다르면 표시)
// layoverNote: 이 구간 도착 후 대기 시간 옆에 붙는 메모

const FLIGHTS = [
    {
        badge: '출국편', tone: 'blue',
        legs: [
            {
                flightNo: 'SK988', duration: '13h 40m',
                from: { code: 'ICN', city: '인천', time: '23:45', date: '2026-12-31' },
                to:   { code: 'CPH', city: '코펜하겐', time: '05:25', date: '2027-01-01' }
            },
            {
                flightNo: 'SK1706', duration: '1h 40m',
                from: { code: 'CPH', city: '코펜하겐', time: '07:55', date: '2027-01-01' },
                to:   { code: 'HEL', city: '헬싱키', time: '10:35', date: '2027-01-01' }
            }
        ]
    },
    {
        badge: '귀국편', tone: 'red',
        legs: [
            {
                flightNo: 'SK1713', duration: '1h 50m', layoverNote: '시내관광',
                from: { code: 'HEL', city: '헬싱키', time: '16:05', date: '2027-02-01' },
                to:   { code: 'CPH', city: '코펜하겐', time: '16:55', date: '2027-02-01' }
            },
            {
                flightNo: 'SK987', duration: '10h 25m',
                from: { code: 'CPH', city: '코펜하겐', time: '23:20', date: '2027-02-01' },
                to:   { code: 'ICN', city: '인천', time: '17:45', date: '2027-02-02' }
            }
        ]
    }
];

// 다른 파일에서 참조하는 대표 구간 (자동, 직접 수정하지 마세요)
const OUTBOUND_FIRST = FLIGHTS[0].legs[0];                          // 출국 첫 비행기 (D-Day, 당일 공항 여정)
const OUTBOUND_LAST = FLIGHTS[0].legs[FLIGHTS[0].legs.length - 1]; // 출국 마지막 비행기 (헬싱키 도착)
const RETURN_FIRST = FLIGHTS[1].legs[0];                            // 귀국 첫 비행기 (헬싱키 출발)
