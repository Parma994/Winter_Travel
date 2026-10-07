// app.js - 대시보드 인터랙션 및 외부 API 전체 로직

// 1. 지도 변수 선언
let map;
let mapTampere;

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

// 8. 실시간 환율 API 연동 및 원화 계산 (10원 단위 반올림)
async function fetchExchangeRateAndCalculate() {
    const rateValEl = document.getElementById('exchange-rate-val');
    const dateEl = document.getElementById('exchange-date');
    const krwElements = document.querySelectorAll('.krw-calc');

    try {
        const response = await fetch('https://open.er-api.com/v6/latest/EUR');
        const data = await response.json();

        if (data && data.rates && data.rates.KRW) {
            const eurToKrw = data.rates.KRW;
            
            // 1. 환율 텍스트 업데이트
            if (rateValEl) {
                rateValEl.textContent = `€1 = ${eurToKrw.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}원`;
            }
            
            // 2. 시간은 빼고 날짜까지만 축약 표기 (예: "기준일: 2026. 10. 7.")
            if (dateEl) {
                const updateDate = new Date(data.time_last_update_utc);
                dateEl.textContent = `기준일: ${updateDate.toLocaleDateString('ko-KR')}`;
            }

            // 3. 예산표 원화 10원 단위 반올림 계산
            krwElements.forEach(el => {
                const eurAmount = parseFloat(el.getAttribute('data-eur'));
                if (!isNaN(eurAmount)) {
                    const rawKrw = eurAmount * eurToKrw;
                    const roundedKrw = Math.round(rawKrw / 10) * 10;
                    el.textContent = `(약 ${roundedKrw.toLocaleString('ko-KR')}원)`;
                }
            });
        } else {
            throw new Error("환율 데이터를 불러올 수 없습니다.");
        }
    } catch (error) {
        console.error("환율 API 호출 실패:", error);
        
        if (rateValEl) rateValEl.textContent = "불러오기 실패";
        if (dateEl) dateEl.textContent = "오프라인 상태이거나 API 응답이 지연되고 있습니다.";
        
        // 오류 시 임시 고정 환율 처리
        const fallbackRate = 1450;
        krwElements.forEach(el => {
            const eurAmount = parseFloat(el.getAttribute('data-eur'));
            if (!isNaN(eurAmount)) {
                const rawKrw = eurAmount * fallbackRate;
                const roundedKrw = Math.round(rawKrw / 10) * 10;
                el.textContent = `(약 ${roundedKrw.toLocaleString('ko-KR')}원 *임시환율)`;
            }
        });
    }
}

// 스크립트 로드 시 환율 계산 함수 즉시 실행
fetchExchangeRateAndCalculate();