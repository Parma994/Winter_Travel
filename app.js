// app.js - 대시보드 인터랙션 및 외부 API 전체 로직

// 1. 지도 변수 선언
let map;
let mapTampere;
const stayMaps = {}; // 헬싱키 탭 숙소 지도 (mapId → Leaflet 지도, data/helsinki.js의 stay)
const mainMapMarkers = {}; // 메인 지도 마커 (장소 키 → 마커, 경로 칩에서 이동할 때 사용)
let mainMapBounds; // 메인 지도 전체 범위

// 전역 환율 변수 (기본값: 임시 환율 1,450원)
let currentEurToKrw = 1450;
// 유로 ↔ 현지 통화 환율은 data/currency.js의 CURRENCIES[코드].rate (1유로당 금액)
const krwPerUnit = (code) => currentEurToKrw / CURRENCIES[code].rate; // 해당 통화 1단위 = 몇 원

// 실시간/저장된 환율을 CURRENCIES에 반영 (응답에 없는 통화는 임시 환율 유지)
function applyCurrencyRates(rates) {
    Object.keys(CURRENCIES).forEach(code => {
        if (code !== 'EUR' && rates[code] > 0) CURRENCIES[code].rate = rates[code];
    });
}

// 오프라인 대비: 마지막으로 성공한 API 응답을 기기에 저장해 두고, 실패하면 그 값을 시각과 함께 표시
function saveSnapshot(key, data) {
    try { localStorage.setItem(`snapshot:${key}`, JSON.stringify({ savedAt: Date.now(), data })); } catch (e) {}
}
function loadSnapshot(key) {
    try { return JSON.parse(localStorage.getItem(`snapshot:${key}`)); } catch (e) { return null; }
}
const formatSavedAt = (ms) => { const d = new Date(ms); return `${d.getMonth() + 1}/${d.getDate()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };

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
    if(tabId === 'tab-helsinki') {
        Object.values(stayMaps).forEach(stayMap => setTimeout(() => stayMap.invalidateSize(), 100));
    }
}

// 3. Leaflet 지도 초기화
function initMap() {
    const mapEl = document.getElementById('map');
    if (mapEl && !map) {
        map = L.map('map', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            crossOrigin: true, // 서비스 워커 타일 저장용
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const tampere = [61.4978, 23.7610];
        const helsinki = [60.1699, 24.9384];

        const createIcon = (emoji) => L.divIcon({
            html: `<div style="font-size: 22px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">${emoji}</div>`,
            className: 'bg-transparent border-0',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        mainMapMarkers.tampere = L.marker(tampere, {icon: createIcon('🇫🇮')}).bindPopup('<b>탐페레</b><br>거점').addTo(map);
        mainMapMarkers.helsinki = L.marker(helsinki, {icon: createIcon('🏙️')}).bindPopup(`<b>헬싱키</b><br>${HELSINKI_WEEK_LABEL} · 2박 3일`).addTo(map);
        L.polyline([helsinki, tampere], {color: '#3b82f6', weight: 2, dashArray: '5, 5'}).addTo(map);

        // 주말 여행지 마커 (data/finland.js의 TRIP_PLACES 중 좌표가 있는 곳, 팝업에 주차 자동 표시)
        // from이 있으면 그 여행지에서 점선을 잇고 주차도 그 여행을 따름 (예: 로바니에미 → 트롬쇠)
        const tripPlaces = Object.entries(TRIP_PLACES).filter(([, place]) => place.coords);
        tripPlaces.forEach(([key, place]) => {
            const week = findTripWeek(key) || (place.from && findTripWeek(place.from));
            const detail = [week ? week.label : '주차 미정', place.note].filter(Boolean).join(' · ');
            // 출발지: 다른 여행지 키 또는 'helsinki'/'tampere' (위에서 먼저 만든 마커 위치)
            const origin = !place.from ? tampere
                : TRIP_PLACES[place.from] ? TRIP_PLACES[place.from].coords
                : mainMapMarkers[place.from].getLatLng();
            mainMapMarkers[key] = L.marker(place.coords, {icon: createIcon(place.icon)}).bindPopup(`<b>${place.city}</b><br>${detail}`).addTo(map);
            L.polyline([origin, place.coords], {color: '#3b82f6', weight: 2, dashArray: '5, 5'}).addTo(map);
        });
        // 모든 여행지가 한 화면에 보이도록 범위 맞춤 (경로 칩의 '전체'도 이 범위로 돌아옴)
        mainMapBounds = L.latLngBounds([tampere, helsinki, ...tripPlaces.map(([, place]) => place.coords)]);
        map.fitBounds(mainMapBounds, { padding: [30, 30] });
    }

    // 핀란드 거점 숙소 지도
    const mapTampereEl = document.getElementById('map-tampere');
    if (mapTampereEl && !mapTampere) {
        mapTampere = L.map('map-tampere', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            crossOrigin: true, // 서비스 워커 타일 저장용
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

    // 헬싱키 숙소 지도 (data/helsinki.js의 stay.coords 위치에 마커)
    HELSINKI_DAYS.filter(day => day.stay).forEach(({ stay }) => {
        if (stayMaps[stay.mapId] || !document.getElementById(stay.mapId)) return;
        const stayMap = L.map(stay.mapId, { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            crossOrigin: true, // 서비스 워커 타일 저장용
            attribution: '&copy; OpenStreetMap'
        }).addTo(stayMap);
        stayMap.setView(stay.coords, 14);

        L.marker(stay.coords, {
            icon: L.divIcon({
                html: `<div style="font-size: 22px; text-shadow: 0px 2px 4px rgba(0,0,0,0.5);">🏨</div>`,
                className: 'bg-transparent border-0',
                iconSize: [26, 26],
                iconAnchor: [13, 26]
            })
        }).bindPopup(`<b>${stay.shortName || stay.name}</b>`).addTo(stayMap);
        stayMaps[stay.mapId] = stayMap;
    });
}
setTimeout(initMap, 100);

// 경로 칩을 누르면 메인 지도가 그 여행지로 이동하고 팝업을 엶 ('전체'는 처음 범위로)
let pendingPopup = null; // 이동이 끝나면 열 팝업 (이동 중 다른 칩을 누르면 취소)
document.getElementById('route-chips').addEventListener('click', (e) => {
    const button = e.target.closest('[data-place]');
    if (!button || !map) return;
    document.querySelectorAll('#route-chips .route-place').forEach(b => b.classList.remove(...ROUTE_CHIP_ACTIVE));
    button.classList.add(...ROUTE_CHIP_ACTIVE);

    if (pendingPopup) map.off('moveend', pendingPopup);
    pendingPopup = null;
    map.closePopup();

    if (button.dataset.place === 'all') {
        map.flyToBounds(mainMapBounds, { padding: [30, 30], duration: 0.8 });
        return;
    }
    const marker = mainMapMarkers[button.dataset.place];
    if (!marker) return;
    // flyTo가 진행 중이던 이전 이동을 멈추면서 moveend를 보내므로, 예약은 flyTo 다음에 걸어야 이번 이동이 끝날 때 열림
    map.flyTo(marker.getLatLng(), 7, { duration: 0.8 });
    pendingPopup = () => { pendingPopup = null; marker.openPopup(); };
    map.once('moveend', pendingPopup);
});

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
const departureDate = new Date(`${OUTBOUND_FIRST.from.date}T${OUTBOUND_FIRST.from.time}:00`).getTime(); // data/flights.js 출국 첫 비행기

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

        const weather = {
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
            sunrise: data.daily.sunrise[0].split('T')[1],
            sunset: data.daily.sunset[0].split('T')[1]
        };
        saveSnapshot('weather', weather);
        renderWeather(weather);
    } catch (error) {
        console.error("날씨 정보 조회 실패:", error);
        const snapshot = loadSnapshot('weather');
        if (snapshot) renderWeather(snapshot.data, snapshot.savedAt);
    }
}

// savedAt이 있으면 오프라인 저장본이라는 표시를 함께 보여줌
function renderWeather({ temp, code, sunrise, sunset }, savedAt) {
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
        if (sunEl) sunEl.textContent = savedAt
            ? `일출 ${sunrise} · 일몰 ${sunset} · ${formatSavedAt(savedAt)} 기준`
            : `일출 ${sunrise} · 일몰 ${sunset}`;
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

    try {
        // 1. 실시간 최신 환율 호출 (open.er-api.com)
        const liveRes = await fetch('https://open.er-api.com/v6/latest/EUR');
        const liveData = await liveRes.json();

        if (!liveData || !liveData.rates) {
            throw new Error("실시간 환율 데이터를 불러올 수 없습니다.");
        }

        currentEurToKrw = liveData.rates.KRW;
        applyCurrencyRates(liveData.rates);

        const updateDateObj = new Date(liveData.time_last_update_utc);
        const updateDate = updateDateObj.toLocaleDateString('ko-KR');
        const todayKey = updateDateObj.toISOString().split('T')[0];

        // 2. 통화별 변동폭 계산 (원화 기준, 로컬 스토리지 우선 확인 -> 없으면 CDN 과거 데이터 호출)
        const codes = Object.keys(CURRENCIES);
        const todayKrw = Object.fromEntries(codes.map(code => [code, krwPerUnit(code)]));
        const diffFrom = (pastKrw) => Object.fromEntries(codes.map(code =>
            [code, pastKrw[code] > 0 ? todayKrw[code] - pastKrw[code] : 0]));
        let diffs = {};

        // 기기에 저장된 이전 환율 기록 { prevDate, prev, todayDate, today, diffs } (통화별 1단위 원화)
        // 유로/파운드만 저장하던 예전 형식이면 버리고 새로 시작
        const rawHistory = JSON.parse(localStorage.getItem('rateHistory') || '{}');
        const savedHistory = rawHistory.today ? rawHistory : {};

        // 만약 기기에 '오늘 이전 날짜'에 저장된 환율이 있다면 그 값과 비교
        if (savedHistory.prevDate && savedHistory.prevDate !== todayKey) {
            diffs = diffFrom(savedHistory.prev);
        } else if (savedHistory.todayDate === todayKey && savedHistory.diffs) {
            // 오늘 이미 계산해 둔 변동폭이 있다면 그대로 재사용
            diffs = savedHistory.diffs;
        } else {
            // 기기에 기록이 없는 첫 접속일 경우: 3일 전 데이터를 CDN에서 가져와 비교 (시차/주말 중복 완벽 회피)
            try {
                const compareDate = new Date(updateDateObj);
                compareDate.setDate(compareDate.getDate() - 3);
                const compareDateStr = compareDate.toISOString().split('T')[0];

                const histRes = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${compareDateStr}/v1/currencies/eur.json`);
                if (histRes.ok) {
                    const past = (await histRes.json()).eur; // { krw, gbp, sek, ... } 1유로당 금액
                    diffs = diffFrom(Object.fromEntries(codes.map(code =>
                        [code, code === 'EUR' ? past.krw : past.krw / past[code.toLowerCase()]])));
                }
            } catch (e) {
                console.warn("과거 환율 CDN 조회 생략:", e);
            }
        }

        // 오늘 환율과 계산된 변동폭을 로컬 스토리지에 백업 (내일 접속 시 비교 기준점이 됨)
        if (savedHistory.todayDate !== todayKey) {
            localStorage.setItem('rateHistory', JSON.stringify({
                prevDate: savedHistory.todayDate || todayKey,
                prev: savedHistory.today || todayKrw,
                todayDate: todayKey,
                today: todayKrw,
                diffs
            }));
        }

        const rates = Object.fromEntries(codes.map(code => [code, CURRENCIES[code].rate]));
        saveSnapshot('exchange', { eurKrw: currentEurToKrw, rates, updateDate, diffs });
        renderExchangeRates(diffs, `기준일: ${updateDate}`, `환율 기준: ${updateDate}`);

    } catch (error) {
        console.error("환율 API 호출 실패:", error);
        const snapshot = loadSnapshot('exchange');
        if (snapshot) {
            // 마지막으로 받아 둔 실제 환율로 계산 (임시 환율보다 정확)
            // eurGbp/eurDiff/gbpDiff: 통화를 늘리기 전에 저장된 저장본
            const { eurKrw, rates, eurGbp, updateDate, diffs, eurDiff, gbpDiff } = snapshot.data;
            currentEurToKrw = eurKrw;
            applyCurrencyRates(rates || { GBP: eurGbp });
            const savedLabel = `오프라인 · ${updateDate} 환율 (${formatSavedAt(snapshot.savedAt)} 저장)`;
            renderExchangeRates(diffs || { EUR: eurDiff, GBP: gbpDiff }, savedLabel, savedLabel);
            return;
        }
        if (rateValEl) rateValEl.innerHTML = "불러오기 실패";
        if (dateEl) dateEl.textContent = "오프라인 상태입니다";
        if (budgetRateEl) budgetRateEl.innerHTML = "€1 = 임시 1,450원<br>£1 = 임시 1,705원";
        updateBudgetAmounts();

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

// 메인 환율 배너 펼치기/접기 (유로 + 이번 주차 통화 아래에 나머지 통화 목록)
function toggleExchangeRates() {
    const more = document.getElementById('exchange-rate-more');
    const icon = document.getElementById('exchange-toggle-icon');
    if (!more || !icon) return;
    more.hidden = !more.hidden;
    icon.classList.toggle('rotate-180', !more.hidden);
}

// 현재 환율 전역 변수로 메인 배너/가계부 배너/예산표 원화 금액을 그림
// diffs: 통화별 전날(또는 3일 전) 대비 1단위 원화 변동폭 { EUR: 3.2, GBP: -1.1, ... }
function renderExchangeRates(diffs, dateLabel, budgetDateLabel) {
        const rateValEl = document.getElementById('exchange-rate-val');
        const rateListEl = document.getElementById('exchange-rate-list');
        const dateEl = document.getElementById('exchange-date');
        const krwElements = document.querySelectorAll('.krw-calc');
        const budgetRateEl = document.getElementById('budget-exchange-rate');
        const budgetDateEl = document.getElementById('budget-exchange-date');

        const formatKrw = (krw) => krw.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const rateText = (code) => `${formatMoney(1, code)} = ${formatKrw(krwPerUnit(code))}원`;

        // 변동폭 UI 생성 함수 (상승=빨간색▲, 하락=파란색▼)
        const getDiffHtml = (diff = 0) => {
            if (Math.abs(diff) < 0.01) return `<span class="text-[11px] ml-1.5 text-gray-400 font-bold">- 0.00원</span>`;
            const isUp = diff > 0;
            const color = isUp ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400';
            const sign = isUp ? '▲' : '▼';
            return `<span class="text-[11px] ml-1.5 font-bold ${color}">${sign} ${formatKrw(Math.abs(diff))}원</span>`;
        };

        // 유로 + 이번 주차 여행지 통화(여행 전에는 파운드)는 크게, 나머지는 펼치면 보이는 목록으로
        const featured = ['EUR', ...getFeaturedCurrencies()];
        const others = Object.keys(CURRENCIES).filter(code => !featured.includes(code));

        // 1. 메인 환율 배너 업데이트
        if (rateValEl) {
            rateValEl.innerHTML = featured.map((code, i) => `
                <div class="flex items-center justify-end${i ? ' mt-0.5' : ''}">
                    <div class="text-lg font-black ${i ? 'text-[#f87171] tracking-tight' : 'text-blue-600 dark:text-blue-400'}">${rateText(code)}</div>
                    ${getDiffHtml(diffs[code])}
                </div>`).join('');
        }
        if (rateListEl) {
            rateListEl.innerHTML = others.map(code => `
                <div class="flex justify-between items-center gap-2">
                    <span class="text-sm font-bold text-emerald-800 dark:text-emerald-300">${CURRENCIES[code].flag ? `${CURRENCIES[code].flag} ` : ''}${CURRENCIES[code].name} <span class="font-normal text-emerald-600 dark:text-emerald-400">${code}</span></span>
                    <div class="text-right leading-tight">
                        <div class="flex items-center justify-end">
                            <span class="text-base font-black text-gray-700 dark:text-gray-200">${rateText(code)}</span>
                            ${getDiffHtml(diffs[code])}
                        </div>
                        <span class="text-xs text-gray-400">€1 = ${CURRENCIES[code].rate.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${code}</span>
                    </div>
                </div>`).join('');
        }
        if (dateEl) dateEl.textContent = dateLabel;

        // 2. 가계부 탭 미니 배너 업데이트
        if (budgetRateEl) {
            budgetRateEl.innerHTML = featured.map(rateText).join('<br>');
            budgetRateEl.classList.add('leading-tight', 'text-right');
        }
        if (budgetDateEl) budgetDateEl.textContent = budgetDateLabel;

        // 3. 메인 탭 예산표 유로 환산(현지 통화 항목/합계) 및 원화 계산 (100원 단위 반올림)
        updateBudgetAmounts();
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
}
fetchExchangeRateAndCalculate();

// 10. 토글 열림 시 지도 새로고침 로직
document.addEventListener('DOMContentLoaded', () => {
    const detailsEls = document.querySelectorAll('details');
    detailsEls.forEach(detail => {
        detail.addEventListener('toggle', (e) => {
            if (detail.open) {
                // 펼친 카드 안에 숙소 지도가 있으면 새로고침 (접힌 상태에서 만든 지도는 크기가 0이라 깨짐)
                Object.entries(stayMaps).forEach(([mapId, stayMap]) => {
                    if (detail.querySelector(`#${mapId}`)) setTimeout(() => stayMap.invalidateSize(), 50);
                });
            }
        });
    });
});
// 11. 구글 스프레드시트 실시간 동기화 가계부 로직 (+ 환율 연동 통합)
document.addEventListener('DOMContentLoaded', () => {
    // 🔥 아래 따옴표 안에 구글 배포 후 받은 웹 앱 URL(exec로 끝나는 주소)을 넣으세요.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8aKRlruKIgUlRWpEAAOzLqog6Sm3ZulxbnqNLU6byGMBd3k4ec0tz6pZqdFvldA8k/exec"; 
    
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
    let expensesSavedAt = null; // 저장본을 보여주는 중이면 저장 시각
    let expensesRefreshing = false; // 저장본을 먼저 보여주고 최신 목록을 받아오는 중인지

    // 시트는 날짜를 한국 시간 자정(예: 2026-10-06T15:00:00.000Z = 10월 7일)으로 돌려줌
    // 기기 시간대로 표시하면 핀란드에서는 하루 전 날짜가 되므로 한국 시간 기준으로 표시
    const formatExpenseDate = (date) => new Date(date).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
    let expenseChart = null;

    // 지출 내용은 사용자가 입력한 글자라 HTML로 해석되지 않게 이스케이프해서 출력
    const escapeHtml = (text) => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // 폼 날짜 입력칸 기본값을 오늘 날짜로 세팅 (toISOString은 UTC 기준이라 새벽에 어제 날짜가 됨 → 현지 날짜 사용)
    const today = toDateKey(new Date());
    const dateInput = document.getElementById('exp-date');
    if (dateInput) dateInput.value = today;

    // [핵심 1] 화면 렌더링 함수 (renderExpenses)
    function renderExpenses() {
        expenseList.innerHTML = !expensesSavedAt ? ''
            : expensesRefreshing
                ? `<p class="text-center text-xs text-gray-400 py-1">🔄 최신 내역 불러오는 중 · ${formatSavedAt(expensesSavedAt)} 저장본 표시 중</p>`
                : `<p class="text-center text-xs text-gray-400 py-1">📴 오프라인 · ${formatSavedAt(expensesSavedAt)}에 저장된 내역이에요</p>`;
        let totalSpent = 0;

        // 지출 내역을 최신 날짜순으로 정렬
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 1. 가계부 탭의 전체 리스트 그리기
        if (sortedExpenses.length === 0) {
            // 비밀번호가 없으면 내역을 못 불러온 것이므로 비밀번호 안내 (환율 로딩 후 다시 그려질 때도 유지)
            expenseList.innerHTML += getKey()
                ? `<p class="text-center text-sm text-gray-400 py-4">아직 기록된 지출이 없거나 데이터를 불러오는 중입니다.</p>`
                : `<p class="text-center text-sm text-gray-400 py-4">가계부 비밀번호를 입력하면 지출 내역을 불러와요. 🔒</p>`;
        } else {
            sortedExpenses.forEach(exp => {
                totalSpent += parseFloat(exp.amount) || 0;
                
                const card = document.createElement('div');
                card.className = "flex justify-between items-center p-3 bg-white dark:bg-nordic-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors";
                card.dataset.expenseId = exp.id; // 누르면 수정 창 열림 ([핵심 4])
                card.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${categoryIcons[exp.category] || '💸'}</span>
                        <div>
                            <p class="font-bold text-sm text-gray-800 dark:text-gray-200">${escapeHtml(exp.desc)}</p>
                            <p class="text-[10px] text-gray-500">${formatExpenseDate(exp.date)} · ${exp.category}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-red-500">-€${parseFloat(exp.amount).toFixed(2)}</span>
                        <span class="text-gray-300 dark:text-gray-600">›</span>
                    </div>
                `;
                expenseList.appendChild(card);
            });
        }
        // 2. 예산 요약 영역 업데이트 (가계부 탭 + 메인 탭 동시 업데이트)
        const totalBudget = getBudgetTotal(); // data/budget.js 예산 계획표 합계 (현지 통화 항목은 현재 환율로 환산)
        const remaining = totalBudget - totalSpent;
        const percentage = Math.max(0, (remaining / totalBudget) * 100);

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

        // 잔액 계산
        const rawBalanceKrw = remaining * currentEurToKrw;
        const roundedBalanceKrw = Math.round(rawBalanceKrw / 100) * 100;
        const balanceGbp = (remaining * CURRENCIES.GBP.rate).toFixed(2);
        const formattedBalance = `(약 ${roundedBalanceKrw.toLocaleString('ko-KR')}원 / £${balanceGbp})`;

        // 총 지출 계산
        const rawSpentKrw = totalSpent * currentEurToKrw;
        const roundedSpentKrw = Math.round(rawSpentKrw / 100) * 100;
        const spentGbp = (totalSpent * CURRENCIES.GBP.rate).toFixed(2);
        const formattedSpent = `(약 ${roundedSpentKrw.toLocaleString('ko-KR')}원 / £${spentGbp})`;

        if (balanceKrwEl) balanceKrwEl.textContent = formattedBalance;
        if (spentKrwEl) spentKrwEl.textContent = formattedSpent;
        if (mainBalanceKrwEl) mainBalanceKrwEl.textContent = formattedBalance;

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
                            <span class="text-gray-700 dark:text-gray-300 truncate w-32 md:w-48 text-xs font-medium">${escapeHtml(exp.desc)}</span>
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
    // [핵심 2] 구글 시트 연결 (비밀번호 + 읽기)
    // -----------------------------------------------------
    // 비밀번호는 사이트 코드(GitHub 공개)에 넣지 않고, 기기마다 처음 한 번 입력받아 저장
    const KEY_STORAGE = 'expenseKey';
    const getKey = () => { try { return localStorage.getItem(KEY_STORAGE) || ''; } catch (e) { return ''; } };
    const setKey = (key) => { try { key ? localStorage.setItem(KEY_STORAGE, key) : localStorage.removeItem(KEY_STORAGE); } catch (e) {} };

    class AuthError extends Error {}

    const keyCard = document.getElementById('expense-key-card');
    const keyMessage = document.getElementById('expense-key-message');
    const keyForm = document.getElementById('expense-key-form');
    const keyInput = document.getElementById('expense-key-input');

    function showKeyCard(message) {
        keyMessage.textContent = message;
        keyCard.hidden = false;
    }

    // 비밀번호가 틀렸을 때: 저장된 비밀번호를 지우고 다시 입력받기
    function handleAuthError() {
        setKey('');
        showKeyCard('비밀번호가 맞지 않아요. 다시 입력해 주세요.');
    }

    async function loadExpenses() {
        const response = await fetch(`${SCRIPT_URL}?key=${encodeURIComponent(getKey())}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) {
            if (data && data.message === 'unauthorized') throw new AuthError('비밀번호 불일치');
            throw new Error('시트 응답 형식이 올바르지 않음');
        }
        useLatestExpenses(data);
        return data;
    }

    // 시트에서 받은 최신 목록을 기기에 저장 (오프라인/즉시 표시용)
    function useLatestExpenses(list) {
        saveSnapshot('expenses', list);
        expensesSavedAt = null;
        expensesRefreshing = false;
    }

    async function fetchExpenses() {
        if (!SCRIPT_URL.includes("script.google.com")) return; // URL 세팅 안 했을 때 멈춤
        if (!getKey()) {
            showKeyCard('이 기기에서 처음 한 번만 입력하면 돼요.');
            expenseList.innerHTML = `<p class="text-center text-sm text-gray-400 py-4">가계부 비밀번호를 입력하면 지출 내역을 불러와요. 🔒</p>`;
            return;
        }
        keyCard.hidden = true;

        // 저장본이 있으면 먼저 바로 보여주고, 최신 목록은 뒤에서 받아와 교체 (시트 응답은 1~3초 걸림)
        const cached = loadSnapshot('expenses');
        if (cached) {
            expenses = cached.data;
            expensesSavedAt = cached.savedAt;
            expensesRefreshing = true;
            renderExpenses();
        } else {
            expenseList.innerHTML = `<p class="text-center text-sm text-gray-400 py-4">구글 시트에서 데이터를 불러오는 중... ⏳</p>`;
        }

        try {
            expenses = await loadExpenses();
            renderExpenses();
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            expensesRefreshing = false;
            if (error instanceof AuthError) {
                handleAuthError();
                expenseList.innerHTML = `<p class="text-center text-sm text-gray-400 py-4">가계부 비밀번호를 입력하면 지출 내역을 불러와요. 🔒</p>`;
                return;
            }
            const snapshot = loadSnapshot('expenses');
            if (snapshot) {
                expenses = snapshot.data;
                expensesSavedAt = snapshot.savedAt;
                renderExpenses();
                return;
            }
            expenseList.innerHTML = `<p class="text-center text-sm text-red-400 py-4">오프라인 상태이거나 데이터를 불러오지 못했습니다.</p>`;
        }
    }

    keyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setKey(keyInput.value.trim());
        keyInput.value = '';
        fetchExpenses();
    });

    // -----------------------------------------------------
    // [핵심 3] 시트에 추가/수정/삭제 보내기 (공통)
    // -----------------------------------------------------
    // 쓰기 전에 확인: URL 미설정, 오프라인, 비밀번호 없음이면 막음
    function canWrite() {
        if (!SCRIPT_URL.includes("script.google.com")) {
            alert("구글 웹 앱 URL이 설정되지 않았습니다. 앱스 스크립트 주소를 붙여넣어 주세요.");
            return false;
        }
        if (!navigator.onLine) {
            alert("오프라인 상태라 저장할 수 없어요. 인터넷이 연결되면 다시 시도해 주세요.");
            return false;
        }
        if (!getKey()) {
            showKeyCard('먼저 가계부 비밀번호를 입력해 주세요.');
            alert("먼저 가계부 비밀번호를 입력해 주세요.");
            return false;
        }
        return true;
    }

    // 옛 Apps Script는 수정/삭제 요청도 "새 줄 추가"로 처리해 버리므로, 수정/삭제 전에 버전을 확인
    // 한 번 확인되면 기기에 기억해서 다음부터는 요청 없이 바로 진행
    const VERSION_STORAGE = 'expenseScriptVersion';
    let scriptSupportsEdit = (() => { try { return Number(localStorage.getItem(VERSION_STORAGE)) >= 2; } catch (e) { return false; } })();
    async function ensureScriptSupportsEdit() {
        if (scriptSupportsEdit) return true;
        try {
            const data = await (await fetch(`${SCRIPT_URL}?action=version`)).json();
            scriptSupportsEdit = !Array.isArray(data) && data.version >= 2;
            if (scriptSupportsEdit) { try { localStorage.setItem(VERSION_STORAGE, String(data.version)); } catch (e) {} }
        } catch (error) {
            console.error("Apps Script 버전 확인 실패:", error);
            alert("구글 시트 연결을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.");
            return false;
        }
        if (!scriptSupportsEdit) alert("구글 시트의 Apps Script가 아직 옛 버전이에요. 새 버전으로 배포한 뒤 다시 시도해 주세요.");
        return scriptSupportsEdit;
    }

    // 응답만으로는 실제 반영 여부를 알 수 없음 (스크립트 오류도 200으로 올 수 있음)
    // → 반영 후의 최신 목록으로 isApplied(최신 목록)를 확인
    //   시트가 저장 응답에 목록(expenses)을 담아 주면 그걸 바로 쓰고, 아니면 한 번 더 읽어옴
    async function sendToSheet(payload, isApplied) {
        let postError = null;
        let latest = null;
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ ...payload, key: getKey() })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json().catch(() => null);
            if (result && result.message === 'unauthorized') throw new AuthError('비밀번호 불일치');
            if (result && Array.isArray(result.expenses)) {
                latest = result.expenses;
                useLatestExpenses(latest);
            }
        } catch (error) {
            if (error instanceof AuthError) throw error;
            postError = error;
        }

        if (!latest) latest = await loadExpenses();
        if (!isApplied(latest)) throw postError || new Error('시트에 반영되지 않음');
        expenses = latest;
        renderExpenses();
    }

    // 버튼을 "처리 중" 상태로 바꾼 채 작업 실행. 실패하면 알림만 띄우고 입력 내용은 그대로 둠
    async function runWithButton(button, busyText, task, failMessage) {
        const originalText = button.innerText;
        button.innerText = busyText;
        button.disabled = true;
        button.classList.add('opacity-70');
        try {
            await task();
            return true;
        } catch (error) {
            console.error("구글 시트 저장 실패:", error);
            if (error instanceof AuthError) {
                handleAuthError();
                alert("가계부 비밀번호가 맞지 않아요. 비밀번호를 다시 입력해 주세요.");
            } else {
                alert(failMessage);
            }
            return false;
        } finally {
            button.innerText = originalText;
            button.disabled = false;
            button.classList.remove('opacity-70');
        }
    }

    // 유로가 아닌 통화는 유로로 환산해서 저장하고, 실제 결제한 현지 금액은 내용 뒤에 "(£12.00)", "(SEK 120.00)"처럼 남김
    const ORIGINAL_SUFFIX = /\s*\((£|[A-Z]{3} )([\d.]+)\)$/;
    const withOriginal = (desc, currency, amountText) =>
        currency === 'EUR' ? desc : `${desc} (${CURRENCIES[currency].prefix}${amountText})`;
    // 내용 뒤의 현지 금액 기록을 읽음 → { desc, currency, amountText } (기록이 없거나 모르는 통화면 null)
    function parseOriginal(expense) {
        const match = String(expense.desc).match(ORIGINAL_SUFFIX);
        const currency = match && Object.keys(CURRENCIES).find(code => CURRENCIES[code].prefix === match[1]);
        if (!currency) return null;
        return { desc: String(expense.desc).replace(ORIGINAL_SUFFIX, ''), currency, amountText: parseFloat(match[2]).toFixed(2) };
    }

    // 새 지출 추가
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!canWrite()) return;

            const currency = document.getElementById('exp-currency').value;
            const amount = parseFloat(document.getElementById('exp-amount').value);
            const desc = document.getElementById('exp-desc').value;

            const newExpense = {
                id: Date.now(),
                date: document.getElementById('exp-date').value,
                category: document.getElementById('exp-category').value,
                desc: withOriginal(desc, currency, amount.toFixed(2)),
                amount: toEur(amount, currency) // 무조건 유로(EUR) 기준으로 저장
            };

            const saved = await runWithButton(submitBtn, "전송 중... 🚀",
                () => sendToSheet({ action: 'add', ...newExpense },
                    latest => latest.some(exp => String(exp.id) === String(newExpense.id))),
                "저장하지 못했습니다. 입력한 내용은 그대로 남겨 두었으니 잠시 후 다시 시도해 주세요.");

            if (saved) {
                document.getElementById('exp-desc').value = '';
                document.getElementById('exp-amount').value = '';
                document.getElementById('exp-currency').value = 'EUR'; // 폼 리셋 후 통화는 EUR로 복구
            }
        });
    }

    // -----------------------------------------------------
    // [핵심 4] 지출 수정/삭제 창 (지출 내역 카드를 누르면 열림)
    // -----------------------------------------------------
    const editModal = document.getElementById('expense-edit-modal');
    const editForm = document.getElementById('expense-edit-form');
    const editDate = document.getElementById('edit-date');
    const editCategory = document.getElementById('edit-category');
    const editDesc = document.getElementById('edit-desc');
    const editCurrency = document.getElementById('edit-currency');
    const editAmount = document.getElementById('edit-amount');
    const saveBtn = document.getElementById('expense-save-btn');
    const deleteBtn = document.getElementById('expense-delete-btn');
    editCategory.innerHTML = document.getElementById('exp-category').innerHTML; // 카테고리 목록은 추가 폼과 똑같이

    let editing = null; // 수정 중인 지출과 수정 전 통화/금액 { expense, currency, amountText }

    // 시트 날짜(한국 시간 자정)를 날짜 입력칸 형식 'YYYY-MM-DD'로
    const toSeoulDateKey = (date) => new Date(date).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

    function openEditModal(expense) {
        const original = parseOriginal(expense);
        const currency = original ? original.currency : 'EUR';
        const amountText = original ? original.amountText : parseFloat(expense.amount).toFixed(2);
        editing = { expense, currency, amountText };

        editDate.value = toSeoulDateKey(expense.date);
        editCategory.value = expense.category;
        editDesc.value = original ? original.desc : expense.desc;
        editCurrency.value = currency;
        editAmount.value = amountText;
        resetDeleteButton();
        editModal.hidden = false;
    }

    function closeEditModal() {
        editModal.hidden = true;
        editing = null;
    }

    expenseList.addEventListener('click', (e) => {
        const card = e.target.closest('[data-expense-id]');
        if (!card) return;
        const expense = expenses.find(exp => String(exp.id) === card.dataset.expenseId);
        if (expense) openEditModal(expense);
    });
    editModal.querySelectorAll('[data-close-edit]').forEach(el => el.addEventListener('click', closeEditModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !editModal.hidden) closeEditModal(); });

    // 수정 저장
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!editing || !canWrite() || !(await ensureScriptSupportsEdit())) return;

        const { expense } = editing;
        const currency = editCurrency.value;
        const amountText = parseFloat(editAmount.value).toFixed(2);
        const amount = parseFloat(amountText);

        // 통화와 금액을 그대로 두었으면 원래 유로 금액 유지 (환율 변동이나 반올림으로 금액이 바뀌지 않게)
        const eurAmount = currency === editing.currency && amountText === editing.amountText
            ? parseFloat(expense.amount)
            : toEur(amount, currency);

        const desc = editDesc.value.trim();
        const updated = {
            id: expense.id,
            date: editDate.value,
            category: editCategory.value,
            desc: withOriginal(desc, currency, amountText),
            amount: eurAmount
        };
        // 같은 id가 딱 한 줄이고, 그 줄이 보낸 값과 같으면 반영된 것으로 판단
        const isApplied = (latest) => {
            const rows = latest.filter(exp => String(exp.id) === String(updated.id));
            return rows.length === 1
                && toSeoulDateKey(rows[0].date) === updated.date
                && rows[0].category === updated.category
                && String(rows[0].desc) === updated.desc
                && Math.abs(parseFloat(rows[0].amount) - updated.amount) < 0.005;
        };

        const saved = await runWithButton(saveBtn, "저장 중...",
            () => sendToSheet({ action: 'update', ...updated }, isApplied),
            "수정하지 못했어요. 잠시 후 다시 시도해 주세요.");
        if (saved) closeEditModal();
    });

    // 삭제 (실수 방지를 위해 두 번 눌러야 실행)
    let deleteArmed = false;
    const DELETE_IDLE = ['text-red-600', 'dark:text-red-400'];
    const DELETE_ARMED = ['bg-red-600', 'border-red-600', 'text-white'];

    function resetDeleteButton() {
        deleteArmed = false;
        deleteBtn.innerText = "삭제";
        deleteBtn.classList.remove(...DELETE_ARMED);
        deleteBtn.classList.add(...DELETE_IDLE);
    }

    deleteBtn.addEventListener('click', async () => {
        if (!editing) return;
        if (!deleteArmed) {
            deleteArmed = true;
            deleteBtn.innerText = "한 번 더 누르면 삭제";
            deleteBtn.classList.remove(...DELETE_IDLE);
            deleteBtn.classList.add(...DELETE_ARMED);
            return;
        }
        if (!canWrite() || !(await ensureScriptSupportsEdit())) { resetDeleteButton(); return; }

        const id = editing.expense.id;
        const deleted = await runWithButton(deleteBtn, "삭제 중...",
            () => sendToSheet({ action: 'delete', id },
                latest => !latest.some(exp => String(exp.id) === String(id))),
            "삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
        if (deleted) closeEditModal();
        else resetDeleteButton();
    });

    // 페이지 시작 시 구글 시트 데이터 1회 불러오기 (연결이 돌아오면 다시 불러올 수 있게 공개)
    window.refreshExpenses = fetchExpenses;
    fetchExpenses();
});

// 12. 핀란드 주차 탭 전환 (탭 클래스 상수는 render.js에 정의)
document.addEventListener('DOMContentLoaded', () => {
    const weekTabs = document.querySelectorAll('.week-tab');
    const weekPanels = document.querySelectorAll('.week-panel');

    weekTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const week = tab.dataset.week;
            weekTabs.forEach(t => {
                t.className = `${WEEK_TAB_BASE} ${t.dataset.week === week ? WEEK_TAB_ACTIVE : WEEK_TAB_INACTIVE}`;
            });
            weekPanels.forEach(panel => { panel.hidden = panel.dataset.week !== week; });
        });
    });
});

// 13. 체크리스트 로컬 스토리지 통합 연동 (준비 로드맵 & 패킹 리스트)
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

// 14. 온라인/오프라인 상태 표시 (연결이 돌아오면 실시간 정보를 다시 불러옴)
function updateOnlineStatus() {
    const badge = document.getElementById('offline-badge');
    if (badge) badge.hidden = navigator.onLine;
}
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('online', () => {
    updateOnlineStatus();
    fetchTampereWeather();
    fetchExchangeRateAndCalculate();
    if (window.refreshExpenses) window.refreshExpenses();
});
updateOnlineStatus();

// 15. 서비스 워커 등록 (오프라인에서도 화면이 열리도록, sw.js 참고 / file://로 열면 동작하지 않음)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('서비스 워커 등록 실패:', error));
}
