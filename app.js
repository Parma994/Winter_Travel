// app.js - 대시보드 인터랙션 및 외부 API 전체 로직

// 1. 지도 변수 선언
let map;
let mapTampere;
let mapTallinn; // 탈린 숙소 지도용
let mapHelsinki; // 헬싱키 숙소 지도용

// 전역 환율 변수 (기본값: 임시 환율 1,450원)
let currentEurToKrw = 1450;
let currentGbpToKrw = 1705; // 1파운드 = 약 1,705원 임시 설정
let currentEurToGbp = 0.85; // 1유로 = 약 0.85파운드 임시 설정

// 2. 하단 탭 전환 로직
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-blue-600', 'dark:text-blue-500', 'font-bold');
        btn.classList.add('text-gray-500');
    });
    btnElement.classList.remove('text-gray-500');
    btnElement.classList.add('text-blue-600', 'dark:text-blue-500', 'font-bold');
    
    // 선택된 탭 메뉴를 화면 가운데로 스크롤
    const navContainer = btnElement.parentElement;
    const scrollPosition = btnElement.offsetLeft - (navContainer.offsetWidth / 2) + (btnElement.offsetWidth / 2);
    navContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 탭 복귀 시 지도 깨짐(회색 화면) 방지
    if(tabId === 'tab-main' && map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
    if(tabId === 'tab-finland' && mapTampere) {
        setTimeout(() => mapTampere.invalidateSize(), 100);
    }
    if(tabId === 'tab-estonia') {
        if(mapTallinn) setTimeout(() => mapTallinn.invalidateSize(), 100);
        if(mapHelsinki) setTimeout(() => mapHelsinki.invalidateSize(), 100);
    }
}

// 3. Leaflet 지도 초기화
function initMap() {
    const mapEl = document.getElementById('map');
    if (mapEl && !map) {
        map = L.map('map', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const tampere = [61.4978, 23.7610];
        const tallinn = [59.4370, 24.7536];
        const london = [51.5074, -0.1278];
        const rovaniemi = [66.5039, 25.7294];

        const createIcon = (emoji) => L.divIcon({
            html: `<div style="font-size: 22px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">${emoji}</div>`,
            className: 'bg-transparent border-0',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        L.marker(tampere, {icon: createIcon('🇫🇮')}).bindPopup('<b>탐페레</b><br>거점').addTo(map);
        L.marker(tallinn, {icon: createIcon('🇪🇪')}).bindPopup('<b>탈린</b><br>1주차').addTo(map);
        L.marker(london, {icon: createIcon('🇬🇧')}).bindPopup('<b>런던</b><br>3주차').addTo(map);
        L.marker(rovaniemi, {icon: createIcon('🎅')}).bindPopup('<b>로바니에미</b><br>산타마을').addTo(map);

        L.polyline([tallinn, tampere, london], {color: '#3b82f6', weight: 2, dashArray: '5, 5'}).addTo(map);
        L.polyline([tampere, rovaniemi], {color: '#3b82f6', weight: 2, dashArray: '5, 5'}).addTo(map);
        map.fitBounds([tampere, tallinn, london], { padding: [30, 30] });
    }

    // 핀란드 거점 숙소 지도
    const mapTampereEl = document.getElementById('map-tampere');
    if (mapTampereEl && !mapTampere) {
        mapTampere = L.map('map-tampere', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(mapTampere);
        
        const airbnbLocation = [61.4968, 23.7675];
        mapTampere.setView(airbnbLocation, 15);
        
        L.marker(airbnbLocation, {
            icon: L.divIcon({
                html: `<div style="font-size: 26px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">🏠</div>`,
                className: 'bg-transparent border-0',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            })
        }).bindPopup('<b>탐페레 베이스캠프</b><br>Hatanpään Valtatie 4 B').addTo(mapTampere);
    }

    // (추가) 탈린 1박 숙소 지도 (시티박스)
    const mapTallinnEl = document.getElementById('map-tallinn');
    if (mapTallinnEl && !mapTallinn) {
        mapTallinn = L.map('map-tallinn', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(mapTallinn);
        
        // 시티박스 탈린 대략적 좌표 (로테르만 지구)
        const cityboxLocation = [59.4412, 24.7565];
        mapTallinn.setView(cityboxLocation, 14);
        
        L.marker(cityboxLocation, {
            icon: L.divIcon({
                html: `<div style="font-size: 22px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">🏨</div>`,
                className: 'bg-transparent border-0',
                iconSize: [26, 26],
                iconAnchor: [13, 26]
            })
        }).bindPopup('<b>시티박스 탈린</b><br>무인 체크인').addTo(mapTallinn);
    }

    // (추가) 헬싱키 1박 숙소 지도 (호텔 아서)
    const mapHelsinkiEl = document.getElementById('map-helsinki');
    if (mapHelsinkiEl && !mapHelsinki) {
        mapHelsinki = L.map('map-helsinki', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(mapHelsinki);
        
        // 호텔 아서 좌표 (카이사니에미 인근)
        const arthurLocation = [60.1729, 24.9477];
        mapHelsinki.setView(arthurLocation, 14);
        
        L.marker(arthurLocation, {
            icon: L.divIcon({
                html: `<div style="font-size: 22px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">🏨</div>`,
                className: 'bg-transparent border-0',
                iconSize: [26, 26],
                iconAnchor: [13, 26]
            })
        }).bindPopup('<b>호텔 아서</b><br>중앙역 도보 5분').addTo(mapHelsinki);
    }
}
setTimeout(initMap, 100);

// 4. 다크모드 On/Off 토글
const themeCheckbox = document.getElementById('theme-toggle-checkbox');
const themeLabel = document.getElementById('theme-label');
const htmlElement = document.documentElement;

function updateThemeUI(isDark) {
    if (isDark) {
        htmlElement.classList.add('dark');
        if (themeCheckbox) themeCheckbox.checked = true;
        if (themeLabel) themeLabel.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark');
        if (themeCheckbox) themeCheckbox.checked = false;
        if (themeLabel) themeLabel.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    updateThemeUI(true);
} else {
    updateThemeUI(false);
}

if (themeCheckbox) {
    themeCheckbox.addEventListener('change', (e) => updateThemeUI(e.target.checked));
}

// 5. D-Day 실시간 슬라이드 애니메이션 타이머
const departureDate = new Date('2026-12-31T23:45:00').getTime();

function animateValue(id, newValue) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getAttribute('data-value') !== newValue) {
        el.setAttribute('data-value', newValue);
        el.innerHTML = `<span class="inline-block animate-slide-up">${newValue}</span>`;
    }
}

function updateDday() {
    const now = new Date().getTime();
    const distance = departureDate - now;
    const dValEl = document.getElementById('d-val');
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        
        if (dValEl) {
            dValEl.innerHTML = `<span class="text-white mr-1 drop-shadow-md">D-</span><span class="inline-block bg-white text-[#003580] px-2.5 py-0.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform -translate-y-0.5">${days}</span><span class="text-white ml-2 mr-3 opacity-50">|</span>`;
        }
        animateValue('h-val', h);
        animateValue('m-val', m);
        animateValue('s-val', s);
        
    } else if (distance > -86400000) {
        if (dValEl) dValEl.innerHTML = `<span class="inline-block bg-white text-[#003580] px-3 py-1 rounded-lg shadow-lg">D-Day!</span>`;
    } else {
        const pastDays = Math.floor(Math.abs(distance) / (1000 * 60 * 60 * 24));
        if (dValEl) {
            dValEl.innerHTML = `<span class="text-white mr-1 drop-shadow-md">D+</span><span class="inline-block bg-white text-[#003580] px-2.5 py-0.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform -translate-y-0.5">${pastDays}</span><span class="text-white ml-2 mr-3 opacity-50">|</span>`;
        }
    }
}
updateDday();
setInterval(updateDday, 1000);

// 6. 탐페레 실시간 시각 & 날씨 API (Open-Meteo)
function updateTampereTime() {
    const timeEl = document.getElementById('tampere-time');
    if (!timeEl) return;
    const now = new Date();
    const options = { timeZone: 'Europe/Helsinki', hour: '2-digit', minute: '2-digit', hour12: false };
    timeEl.textContent = now.toLocaleTimeString('ko-KR', options);
}

async function fetchTampereWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=61.4978&longitude=23.7610&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=Europe%2FHelsinki');
        const data = await res.json();
        
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const sunriseTime = data.daily.sunrise[0].split('T')[1];
        const sunsetTime = data.daily.sunset[0].split('T')[1];
        
        let icon = '☁️';
        let desc = '흐림';
        if (code === 0) { icon = '☀️'; desc = '맑음'; }
        else if (code >= 1 && code <= 3) { icon = '⛅'; desc = '구름 조금'; }
        else if (code === 45 || code === 48) { icon = '🌫️'; desc = '안개'; }
        else if (code >= 51 && code <= 67) { icon = '🌧️'; desc = '비'; }
        else if (code >= 71 && code <= 77) { icon = '❄️'; desc = '눈'; }
        else if (code >= 80 && code <= 82) { icon = '🌦️'; desc = '소나기'; }
        else if (code >= 85 && code <= 86) { icon = '🌨️'; desc = '눈보라'; }
        else if (code >= 95) { icon = '⛈️'; desc = '뇌우'; }
        
        const tempEl = document.getElementById('weather-temp');
        const iconEl = document.getElementById('weather-icon');
        const descEl = document.getElementById('weather-desc');
        const sunEl = document.getElementById('weather-sun');
        
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (iconEl) iconEl.textContent = icon;
        if (descEl) descEl.textContent = desc;
        if (sunEl) sunEl.textContent = `일출 ${sunriseTime} · 일몰 ${sunsetTime}`;
    } catch (error) {
        console.error("날씨 정보 조회 실패:", error);
    }
}

updateTampereTime();
setInterval(updateTampereTime, 60000);
fetchTampereWeather();

// 7. 상세 예산표 토글
function toggleBudgetTable() {
    const content = document.getElementById('budget-table-content');
    const icon = document.getElementById('budget-toggle-icon');
    if (!content || !icon) return;
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

// 8. 실시간 환율 API 연동 (실시간 최신 환율 + 로컬스토리지/CDN 하이브리드 변동폭 계산)
async function fetchExchangeRateAndCalculate() {
    const rateValEl = document.getElementById('exchange-rate-val');
    const dateEl = document.getElementById('exchange-date');
    const krwElements = document.querySelectorAll('.krw-calc');
    
    const budgetRateEl = document.getElementById('budget-exchange-rate');
    const budgetDateEl = document.getElementById('budget-exchange-date');

    try {
        // 1. 실시간 최신 환율 호출 (open.er-api.com)
        const liveRes = await fetch('https://open.er-api.com/v6/latest/EUR');
        const liveData = await liveRes.json();

        if (!liveData || !liveData.rates) {
            throw new Error("실시간 환율 데이터를 불러올 수 없습니다.");
        }

        currentEurToKrw = liveData.rates.KRW;
        currentEurToGbp = liveData.rates.GBP;
        currentGbpToKrw = currentEurToKrw / currentEurToGbp;

        const updateDateObj = new Date(liveData.time_last_update_utc);
        const updateDate = updateDateObj.toLocaleDateString('ko-KR');
        const todayKey = updateDateObj.toISOString().split('T')[0];

        // 2. 변동폭 계산 (로컬 스토리지 우선 확인 -> 없으면 CDN 과거 데이터 호출)
        let eurDiff = 0;
        let gbpDiff = 0;

        // 기기에 저장된 이전 환율 기록 불러오기
        const savedHistory = JSON.parse(localStorage.getItem('rateHistory') || '{}');

        // 만약 기기에 '오늘 이전 날짜'에 저장된 환율이 있다면 그 값과 비교
        if (savedHistory.prevDate && savedHistory.prevDate !== todayKey && savedHistory.eur) {
            eurDiff = currentEurToKrw - savedHistory.eur;
            gbpDiff = currentGbpToKrw - savedHistory.gbp;
        } else if (savedHistory.todayDate === todayKey && savedHistory.eurDiff !== undefined) {
            // 오늘 이미 계산해 둔 변동폭이 있다면 그대로 재사용
            eurDiff = savedHistory.eurDiff;
            gbpDiff = savedHistory.gbpDiff;
        } else {
            // 기기에 기록이 없는 첫 접속일 경우: 3일 전 데이터를 CDN에서 가져와 비교 (시차/주말 중복 완벽 회피)
            try {
                const compareDate = new Date(updateDateObj);
                compareDate.setDate(compareDate.getDate() - 3);
                const compareDateStr = compareDate.toISOString().split('T')[0];

                const histRes = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${compareDateStr}/v1/currencies/eur.json`);
                if (histRes.ok) {
                    const histData = await histRes.json();
                    const pastEurToKrw = histData.eur.krw;
                    const pastGbpToKrw = pastEurToKrw / histData.eur.gbp;

                    eurDiff = currentEurToKrw - pastEurToKrw;
                    gbpDiff = currentGbpToKrw - pastGbpToKrw;
                }
            } catch (e) {
                console.warn("과거 환율 CDN 조회 생략:", e);
            }
        }

        // 오늘 환율과 계산된 변동폭을 로컬 스토리지에 백업 (내일 접속 시 비교 기준점이 됨)
        if (savedHistory.todayDate !== todayKey) {
            localStorage.setItem('rateHistory', JSON.stringify({
                prevDate: savedHistory.todayDate || todayKey,
                eur: savedHistory.todayEur || currentEurToKrw,
                gbp: savedHistory.todayGbp || currentGbpToKrw,
                todayDate: todayKey,
                todayEur: currentEurToKrw,
                todayGbp: currentGbpToKrw,
                eurDiff: eurDiff,
                gbpDiff: gbpDiff
            }));
        }

        const rateEurKrwFmt = currentEurToKrw.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const rateGbpKrwFmt = currentGbpToKrw.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        // 변동폭 UI 생성 함수 (상승=빨간색▲, 하락=파란색▼)
        const getDiffHtml = (diff) => {
            if (Math.abs(diff) < 0.01) return `<span class="text-[11px] ml-1.5 text-gray-400 font-bold">- 0.00원</span>`;
            const isUp = diff > 0;
            const color = isUp ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400';
            const sign = isUp ? '▲' : '▼';
            const val = Math.abs(diff).toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            return `<span class="text-[11px] ml-1.5 font-bold ${color}">${sign} ${val}원</span>`;
        };

        // 1. 메인 환율 배너 업데이트
        if (rateValEl) {
            rateValEl.innerHTML = `
                <div class="flex items-center justify-end">
                    <div class="text-lg font-black text-blue-600 dark:text-blue-400">€1 = ${rateEurKrwFmt}원</div>
                    ${getDiffHtml(eurDiff)}
                </div>
                <div class="flex items-center justify-end mt-0.5">
                    <div class="text-lg font-black text-[#f87171] tracking-tight">£1 = ${rateGbpKrwFmt}원</div>
                    ${getDiffHtml(gbpDiff)}
                </div>
            `;
        }
        if (dateEl) dateEl.textContent = `기준일: ${updateDate}`;

        // 2. 가계부 탭 미니 배너 업데이트
        if (budgetRateEl) {
            budgetRateEl.innerHTML = `€1 = ${rateEurKrwFmt}원<br>£1 = ${rateGbpKrwFmt}원`;
            budgetRateEl.classList.add('leading-tight', 'text-right');
        }
        if (budgetDateEl) budgetDateEl.textContent = `환율 기준: ${updateDate}`;

        // 3. 메인 탭 예산표 원화 계산 (100원 단위 반올림)
        krwElements.forEach(el => {
            const eurAmount = parseFloat(el.getAttribute('data-eur'));
            if (!isNaN(eurAmount)) {
                const rawKrw = eurAmount * currentEurToKrw;
                const roundedKrw = Math.round(rawKrw / 100) * 100;
                el.textContent = `(약 ${roundedKrw.toLocaleString('ko-KR')}원)`;
            }
        });
        
        // 4. 가계부 지출 내역 원화 환산 강제 새로고침 트리거
        if (typeof window.triggerRenderExpenses === 'function') {
            window.triggerRenderExpenses();
        }

    } catch (error) {
        console.error("환율 API 호출 실패:", error);
        if (rateValEl) rateValEl.innerHTML = "불러오기 실패";
        if (dateEl) dateEl.textContent = "오프라인 상태입니다";
        if (budgetRateEl) budgetRateEl.innerHTML = "€1 = 임시 1,450원<br>£1 = 임시 1,705원";
        
        krwElements.forEach(el => {
            const eurAmount = parseFloat(el.getAttribute('data-eur'));
            if (!isNaN(eurAmount)) {
                const rawKrw = eurAmount * currentEurToKrw;
                const roundedKrw = Math.round(rawKrw / 100) * 100;
                el.textContent = `(약 ${roundedKrw.toLocaleString('ko-KR')}원 *임시환율)`;
            }
        });
    }
}
fetchExchangeRateAndCalculate();

// 10. 토글 열림 시 지도 새로고침 로직
document.addEventListener('DOMContentLoaded', () => {
    const detailsEls = document.querySelectorAll('details');
    detailsEls.forEach(detail => {
        detail.addEventListener('toggle', (e) => {
            if (detail.open) {
                // 어떤 지도가 포함되어 있는지 확인 후 새로고침
                if (detail.querySelector('#map-tallinn') && mapTallinn) {
                    setTimeout(() => mapTallinn.invalidateSize(), 50);
                }
                if (detail.querySelector('#map-helsinki') && mapHelsinki) {
                    setTimeout(() => mapHelsinki.invalidateSize(), 50);
                }
            }
        });
    });
});
// 11. 구글 스프레드시트 실시간 동기화 가계부 로직 (+ 환율 연동 통합)
document.addEventListener('DOMContentLoaded', () => {
    // 🔥 아래 따옴표 안에 구글 배포 후 받은 웹 앱 URL(exec로 끝나는 주소)을 넣으세요.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8aKRlruKIgUlRWpEAAOzLqog6Sm3ZulxbnqNLU6byGMBd3k4ec0tz6pZqdFvldA8k/exec"; 
    
    const TOTAL_BUDGET = BUDGET_TOTAL; // data/budget.js 예산 계획표 합계
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const balanceEl = document.getElementById('budget-balance');
    const spentEl = document.getElementById('budget-spent');
    const progressEl = document.getElementById('budget-progress');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    // 카테고리별 이모지 설정
    const categoryIcons = {
        '교통': '✈️', '숙박': '🏠', '식비': '🍔', '액티비티': '⚽', '기타': '🛒'
    };

    let expenses = []; // 불러온 데이터를 저장할 배열
    let expenseChart = null;

    // 폼 날짜 입력칸 기본값을 오늘 날짜로 세팅
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('exp-date');
    if (dateInput) dateInput.value = today;

    // [핵심 1] 화면 렌더링 함수 (renderExpenses)
    function renderExpenses() {
        expenseList.innerHTML = '';
        let totalSpent = 0;

        // 지출 내역을 최신 날짜순으로 정렬
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 1. 가계부 탭의 전체 리스트 그리기
        if (sortedExpenses.length === 0) {
            expenseList.innerHTML = `<p class="text-center text-sm text-gray-400 py-4">아직 기록된 지출이 없거나 데이터를 불러오는 중입니다.</p>`;
        } else {
            sortedExpenses.forEach(exp => {
                totalSpent += parseFloat(exp.amount) || 0;
                
                const card = document.createElement('div');
                card.className = "flex justify-between items-center p-3 bg-white dark:bg-nordic-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm";
                card.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${categoryIcons[exp.category] || '💸'}</span>
                        <div>
                            <p class="font-bold text-sm text-gray-800 dark:text-gray-200">${exp.desc}</p>
                            <p class="text-[10px] text-gray-500">${new Date(exp.date).toLocaleDateString('ko-KR')} · ${exp.category}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-red-500">-€${parseFloat(exp.amount).toFixed(2)}</span>
                    </div>
                `;
                expenseList.appendChild(card);
            });
        }
        // 2. 예산 요약 영역 업데이트 (가계부 탭 + 메인 탭 동시 업데이트)
        const remaining = TOTAL_BUDGET - totalSpent;
        const percentage = Math.max(0, (remaining / TOTAL_BUDGET) * 100);

        // 가계부 탭 요소
        if (balanceEl) balanceEl.textContent = `€${remaining.toFixed(2)}`;
        if (spentEl) spentEl.textContent = `€${totalSpent.toFixed(2)}`;
        if (progressEl) progressEl.style.width = `${percentage}%`;

        // 메인 탭 위젯 요소 가져오기
        const mainBalanceEl = document.getElementById('main-budget-balance');
        const mainProgressEl = document.getElementById('main-budget-progress');
        const mainBalanceKrwEl = document.getElementById('main-budget-balance-krw');

        // 메인 탭 유로 및 프로그레스 바 갱신
        if (mainBalanceEl) mainBalanceEl.textContent = `€${remaining.toFixed(2)}`;
        if (mainProgressEl) mainProgressEl.style.width = `${percentage}%`;

        // 3. 원화(KRW) 및 파운드(GBP) 환산 금액 병기 업데이트
        const balanceKrwEl = document.getElementById('budget-balance-krw');
        const spentKrwEl = document.getElementById('budget-spent-krw');
        
        if (typeof currentEurToKrw !== 'undefined' && typeof currentEurToGbp !== 'undefined') {
            // 잔액 계산
            const rawBalanceKrw = remaining * currentEurToKrw;
            const roundedBalanceKrw = Math.round(rawBalanceKrw / 100) * 100;
            const balanceGbp = (remaining * currentEurToGbp).toFixed(2);
            const formattedBalance = `(약 ${roundedBalanceKrw.toLocaleString('ko-KR')}원 / £${balanceGbp})`;

            // 총 지출 계산
            const rawSpentKrw = totalSpent * currentEurToKrw;
            const roundedSpentKrw = Math.round(rawSpentKrw / 100) * 100;
            const spentGbp = (totalSpent * currentEurToGbp).toFixed(2);
            const formattedSpent = `(약 ${roundedSpentKrw.toLocaleString('ko-KR')}원 / £${spentGbp})`;

            if (balanceKrwEl) balanceKrwEl.textContent = formattedBalance;
            if (spentKrwEl) spentKrwEl.textContent = formattedSpent;
            if (mainBalanceKrwEl) mainBalanceKrwEl.textContent = formattedBalance;
        }

        if (percentage < 20) {
            if (progressEl) progressEl.classList.replace('bg-emerald-400', 'bg-red-500');
            if (mainProgressEl) mainProgressEl.classList.replace('bg-emerald-400', 'bg-red-500');
        } else {
            if (progressEl) progressEl.classList.replace('bg-red-500', 'bg-emerald-400');
            if (mainProgressEl) mainProgressEl.classList.replace('bg-red-500', 'bg-emerald-400');
        }

        // 4. 메인 탭 위젯: 최근 지출 3건 렌더링 추가
        const mainRecentEl = document.getElementById('main-recent-expenses');
        if (mainRecentEl) {
            mainRecentEl.innerHTML = ''; // 초기화

            if (sortedExpenses.length === 0) {
                mainRecentEl.innerHTML = `<p class="text-xs text-gray-400 py-1">최근 지출 내역이 없습니다.</p>`;
            } else {
                // 배열에서 앞에서부터 3개만 잘라서 가져옴 (slice)
                const recentThree = sortedExpenses.slice(0, 3);
                
                recentThree.forEach(exp => {
                    const row = document.createElement('div');
                    row.className = "flex justify-between items-center text-sm py-1";
                    
                    // 제목이 너무 길면 말줄임표 처리 (truncate)
                    row.innerHTML = `
                        <div class="flex items-center gap-2 overflow-hidden">
                            <span class="text-base">${categoryIcons[exp.category] || '💸'}</span>
                            <span class="text-gray-700 dark:text-gray-300 truncate w-32 md:w-48 text-xs font-medium">${exp.desc}</span>
                        </div>
                        <span class="font-bold text-red-500 text-xs">-€${parseFloat(exp.amount).toFixed(2)}</span>
                    `;
                    mainRecentEl.appendChild(row);
                });
            }
        }
        const ctx = document.getElementById('expense-chart');
        if (ctx) {
            // 카테고리별 누적 금액 계산 (유로 기준)
            const categoryTotals = {
                '교통': 0, '숙박': 0, '식비': 0, '액티비티': 0, '기타': 0
            };
            
            let hasAnyExpense = false;

            expenses.forEach(exp => {
                const amt = parseFloat(exp.amount) || 0;
                if (amt > 0) {
                    // 카테고리가 맵핑에 없으면 기타로 처리
                    const cat = categoryTotals[exp.category] !== undefined ? exp.category : '기타';
                    categoryTotals[cat] += amt;
                    hasAnyExpense = true;
                }
            });

            // 기존 차트가 있으면 파괴하고 새로 그림 (중복 렌더링 방지)
            if (expenseChart) {
                expenseChart.destroy();
            }

            // 지출이 하나도 없을 경우 빈 회색 차트 표시
            if (!hasAnyExpense) {
                expenseChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['지출 없음'],
                        datasets: [{
                            data: [1],
                            backgroundColor: ['#e5e7eb'], // tailwind gray-200
                            borderWidth: 0
                        }]
                    },
                    options: {
                        cutout: '70%',
                        plugins: { legend: { display: false }, tooltip: { enabled: false } }
                    }
                });
            } else {
                // 실제 데이터로 도넛 차트 생성
                expenseChart = new Chart(ctx, {
                    type: 'doughnut', // 파이 차트로 완전히 꽉 차게 하려면 'pie'로 변경해도 됩니다.
                    data: {
                        labels: ['✈️ 교통', '🏠 숙박', '🍔 식비', '⚽ 액티비티', '🛒 기타'],
                        datasets: [{
                            data: [
                                categoryTotals['교통'],
                                categoryTotals['숙박'],
                                categoryTotals['식비'],
                                categoryTotals['액티비티'],
                                categoryTotals['기타']
                            ],
                            backgroundColor: [
                                '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'
                            ],
                            borderWidth: 2,
                            borderColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        // 비율 유지를 해제하여 부모 래퍼(<div class="relative w-full...">) 크기에 꽉 차도록 설정
                        maintainAspectRatio: false, 
                        
                        // 도넛 구멍의 크기입니다. 파이 차트처럼 속을 꽉 채우려면 '0%'로 변경하세요.
                        cutout: '50%', 
                        
                        // 차트 바깥쪽 여백을 없애 캔버스에 꽉 차게 렌더링
                        layout: {
                            padding: 0
                        },
                        
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right', // 범례를 구역 오른쪽에 배치
                                align: 'center', // 범례 항목을 수직 중앙에 정렬
                                labels: {
                                    usePointStyle: true, // 범례 아이콘을 동그라미로 변경
                                    boxWidth: 8,         // 동그라미 크기 축소
                                    padding: 12,         // 범례 항목 간의 간격
                                    font: { 
                                        size: 12, 
                                        family: "'Pretendard', sans-serif" 
                                    },
                                    color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151'
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += '€' + context.parsed.toFixed(2);
                                        }
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    // -----------------------------------------------------
    // [외부 연동 연결고리]
    // 환율 API가 로드된 직후 금액을 다시 계산하게끔 전역 함수로 열어둠
    // -----------------------------------------------------
    window.triggerRenderExpenses = renderExpenses;

    // -----------------------------------------------------
    // [핵심 2] 구글 시트에서 데이터 불러오기 (GET)
    // -----------------------------------------------------
    async function fetchExpenses() {
        if (!SCRIPT_URL.includes("script.google.com")) return; // URL 세팅 안 했을 때 멈춤
        expenseList.innerHTML = `<p class="text-center text-sm text-gray-400 py-4">구글 시트에서 데이터를 불러오는 중... ⏳</p>`;
        
        try {
            const response = await fetch(SCRIPT_URL);
            expenses = await response.json();
            renderExpenses();
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            expenseList.innerHTML = `<p class="text-center text-sm text-red-400 py-4">오프라인 상태이거나 데이터를 불러오지 못했습니다.</p>`;
        }
    }

    // -----------------------------------------------------
    // [핵심 3] 구글 시트로 새 데이터 전송 (POST)
    // -----------------------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!SCRIPT_URL.includes("script.google.com")) {
                alert("구글 웹 앱 URL이 설정되지 않았습니다. 앱스 스크립트 주소를 붙여넣어 주세요.");
                return;
            }

            // 제출 버튼 로딩 상태로 변경
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "전송 중... 🚀";
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70');
            
            // 💡 통화 환산 로직 (내부 계산은 EUR-GBP, 데이터 명시는 원래 통화)
            const selectedCurrency = document.getElementById('exp-currency').value;
            const inputAmount = parseFloat(document.getElementById('exp-amount').value);
            
            let finalEurAmount = inputAmount;
            let finalDesc = document.getElementById('exp-desc').value;

            if (selectedCurrency === 'GBP') {
                if (typeof currentEurToGbp !== 'undefined' && currentEurToGbp > 0) {
                    // 유로로 환산 (입력 파운드 / 파운드당 유로 환율)
                    finalEurAmount = inputAmount / currentEurToGbp;
                    // 지출 내역 뒤에 실제 결제한 파운드 금액 박제
                    finalDesc = `${finalDesc} (£${inputAmount.toFixed(2)})`;
                } else {
                    alert("환율 데이터를 불러오지 못해 파운드 환산이 불가능합니다.");
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-70');
                    return;
                }
            }

            const newExpense = {
                id: Date.now(),
                date: document.getElementById('exp-date').value,
                category: document.getElementById('exp-category').value,
                desc: finalDesc,
                amount: finalEurAmount // 무조건 유로(EUR) 기준으로 변환하여 저장
            };

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(newExpense)
                });
                
                expenses.push(newExpense);
                renderExpenses();
                
                document.getElementById('exp-desc').value = '';
                document.getElementById('exp-amount').value = '';
                // 폼 리셋 후 통화는 EUR로 복구
                document.getElementById('exp-currency').value = 'EUR';
            } catch (error) {
                console.error("구글 시트 저장 실패:", error);
                alert("네트워크 오류로 저장하지 못했습니다.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
            }
        });
    }

    // 페이지 시작 시 구글 시트 데이터 1회 불러오기
    fetchExpenses();
});

// 12. 체크리스트 로컬 스토리지 통합 연동 (준비 로드맵 & 패킹 리스트)
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.pack-chk');
    
    // 취소선 스타일 토글 함수
    const updateLabelStyle = (chk) => {
        const labelSpan = chk.nextElementSibling;
        if (!labelSpan) return;
        if (chk.checked) {
            labelSpan.classList.add('line-through', 'opacity-50');
        } else {
            labelSpan.classList.remove('line-through', 'opacity-50');
        }
    };

    checkboxes.forEach(chk => {
        const savedState = localStorage.getItem(chk.id);
        
        // 1. 로컬 스토리지에 저장된 기록이 있으면 그 값을 따름
        if (savedState !== null) {
            chk.checked = (savedState === 'true');
        } else if (chk.checked) {
            // 저장된 기록이 없는데 HTML에 기본 checked가 되어 있다면 로컬 스토리지에 초기 저장
            localStorage.setItem(chk.id, 'true');
        }
        
        // 초기 화면 렌더링 시 취소선 적용
        updateLabelStyle(chk);
        
        // 2. 클릭하여 상태 변경 시 로컬 스토리지 업데이트 및 취소선 토글
        chk.addEventListener('change', (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
            updateLabelStyle(e.target);
        });
    });
});