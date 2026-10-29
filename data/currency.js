// data/currency.js - 여행 중 쓰는 통화 (가계부 통화 선택, 예산표 현지 통화 표시)
// prefix: 금액 앞에 붙는 표시 (가계부 내용 뒤 "(SEK 120.00)" 기록에도 쓰이므로 바꾸면 예전 기록을 못 읽음)
// rate: 1유로당 임시 환율 (app.js가 실시간 환율을 불러오면 자동으로 덮어씀)
// flag: 메인 환율 배너 펼친 목록에서 통화 이름 앞에 붙는 국기 (선택)
// 통화를 추가하려면 아래에 한 줄 추가 (코드는 open.er-api.com의 통화 코드)

const CURRENCIES = {
    EUR: { prefix: '€', name: '유로', rate: 1 },
    GBP: { prefix: '£', name: '파운드', rate: 0.85 },
    SEK: { prefix: 'SEK ', name: '크로나', flag: '🇸🇪', rate: 11 },
    NOK: { prefix: 'NOK ', name: '크로네', flag: '🇳🇴', rate: 11.7 },
    DKK: { prefix: 'DKK ', name: '크로네', flag: '🇩🇰', rate: 7.46 }
};

const toEur = (amount, code = 'EUR') => amount / CURRENCIES[code].rate;
const formatMoney = (amount, code = 'EUR') => `${CURRENCIES[code].prefix}${amount.toLocaleString('en-US')}`;
