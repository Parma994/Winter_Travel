// render.js - data/*.js의 데이터를 HTML로 그려주는 템플릿 함수 모음
// app.js(지도 초기화 등)보다 먼저 로드되어야 합니다.

// 0. 공통 날짜 도우미 (데이터의 날짜는 모두 'YYYY-MM-DD')
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const pad2 = (n) => String(n).padStart(2, '0');
const parseDate = (key) => new Date(`${key}T00:00:00`);
const toDateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatMonthDay = (d) => `${d.getMonth() + 1}/${d.getDate()}`;                           // 1/3
const formatShortDate = (d) => `${formatMonthDay(d)} (${WEEKDAYS[d.getDay()]})`;               // 1/3 (일)
const formatDotDate = (d) => `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} (${WEEKDAYS[d.getDay()]})`; // 01.03 (일)
const formatFullDotDate = (d) => `${d.getFullYear()}.${formatDotDate(d)}`;                    // 2027.01.03 (일)
const formatKoreanDate = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;                      // 1월 3일

// 1. 타임라인 점/시간 색상 (Tailwind가 클래스를 인식하도록 전체 문자열로 작성)
const TIMELINE_TONES = {
    blue:  { dot: 'bg-blue-500',                time: 'text-blue-600 dark:text-blue-400' },
    gray:  { dot: 'bg-gray-300 dark:bg-gray-600', time: 'text-gray-500' },
    green: { dot: 'bg-emerald-500',             time: 'text-emerald-600 dark:text-emerald-400' }
};

// 1-1. 여행지별 강조색 (Day 배지, 숙소 배지에 사용 / 탭 배너와 안내 상자 색은 index.html에서 같은 색으로)
const PLACE_THEMES = {
    blue:  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
};

// 2. 타임라인 항목 1개
// places: 일정 아래에 붙는 장소 목록 [{ name, desc, map, coords }] (name 외에는 선택)
//   map: Google 지도 검색어 → "지도 ↗" 링크 / coords: [위도, 경도] → 일정 아래 작은 지도에 번호 핀
// 장소 지도는 app.js가 카드를 펼칠 때 PLACE_MAPS(지도 상자 id → 좌표 있는 장소 목록)를 보고 만듦
const PLACE_MAPS = {};
const PLACE_NUMBER_CLASS = 'inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold';

function renderPlace(place, number, mapId) {
    const mapLink = place.map
        ? ` <a href="https://maps.google.com/?q=${encodeURIComponent(place.map)}" target="_blank" class="font-bold text-blue-500 hover:underline whitespace-nowrap">지도 ↗</a>`
        : '';
    // 지도에 핀이 있는 장소는 번호를 붙이고, 누르면 지도가 그 핀으로 이동
    const marker = number ? `<span class="${PLACE_NUMBER_CLASS} mr-1 align-[-2px]">${number}</span>` : '📍 ';
    const target = number ? ` data-place-map="${mapId}" data-place-index="${number - 1}"` : '';
    return `
        <li${target} class="bg-gray-50 dark:bg-nordic-800 rounded-lg px-3 py-2${number ? ' cursor-pointer hover:bg-blue-50 dark:hover:bg-nordic-700 transition-colors' : ''}">
            <p class="font-bold text-gray-700 dark:text-gray-300">${marker}${place.name}${mapLink}</p>
            ${place.desc ? `<p class="text-gray-500 dark:text-gray-400 mt-0.5">${place.desc}</p>` : ''}
        </li>`;
}

function renderPlaces(places) {
    const pinned = places.filter(place => place.coords);
    const mapId = pinned.length ? `place-map-${Object.keys(PLACE_MAPS).length + 1}` : '';
    if (mapId) PLACE_MAPS[mapId] = pinned;
    const mapBox = mapId
        ? `<div class="relative h-40 mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"><div id="${mapId}" class="place-map absolute inset-0 z-0"></div></div>`
        : '';
    const list = places.map(place => renderPlace(place, pinned.indexOf(place) + 1, mapId)).join('');
    return `${mapBox}<ul class="mt-2 space-y-1.5 text-xs">${list}</ul>`;
}

function renderTimelineItem(item) {
    const tone = TIMELINE_TONES[item.tone] || TIMELINE_TONES.gray;
    return `
        <div class="relative pl-6">
            <div class="absolute w-3 h-3 ${tone.dot} rounded-full -left-[7px] top-1.5 shadow-sm ring-4 ring-white dark:ring-nordic-900"></div>
            <div class="flex items-start gap-3">
                <span class="font-bold ${tone.time} w-11 flex-shrink-0 mt-0.5 text-sm">${item.time}</span>
                <div class="flex-1 min-w-0">
                    <h5 class="font-bold text-gray-800 dark:text-gray-200 text-sm">${item.title}</h5>
                    ${item.desc ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${item.desc}</p>` : ''}
                    ${item.places ? renderPlaces(item.places) : ''}
                </div>
            </div>
        </div>`;
}

// 3. 숙소 카드 (지도 포함)
function renderStayCard(stay, theme = 'blue') {
    return `
        <div class="bg-white dark:bg-nordic-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mt-6">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="${PLACE_THEMES[theme]} text-[10px] font-bold px-2 py-0.5 rounded">${stay.badge}</span>
                    <h4 class="font-bold text-gray-800 dark:text-gray-100 mt-1.5">${stay.name}</h4>
                </div>
                <span class="text-lg">${stay.flag}</span>
            </div>

            <div class="relative w-full h-52 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 my-3">
                <div id="${stay.mapId}" class="absolute inset-0 z-0"></div>
            </div>

            <div class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-3 pt-1 text-gray-500 dark:text-gray-400">
                    <ul class="list-disc list-inside space-y-1">
                        ${stay.notes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                    <a href="${stay.mapUrl}" target="_blank" class="text-blue-500 font-bold hover:underline text-right whitespace-nowrap">Google 지도 열기 ↗</a>
                </div>
            </div>
        </div>`;
}

// 4. 공통 아코디언 카드 틀 (배지 + 제목 + 펼쳐지는 본문)
function renderAccordion({ badge, badgeClass, title, bodyClass, body }) {
    return `
        <details class="group bg-white dark:bg-nordic-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
            <summary class="flex justify-between items-center p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-gray-50 dark:hover:bg-nordic-800 transition-colors">
                <div class="flex items-center gap-3">
                    <span class="${badgeClass} text-xs font-bold px-2.5 py-1 rounded-md">${badge}</span>
                    <h4 class="font-bold text-gray-800 dark:text-gray-200">${title}</h4>
                </div>
                <span class="text-gray-400 text-xs transition-transform duration-300 group-open:rotate-180">▼</span>
            </summary>
            <div class="${bodyClass} border-t border-gray-100 dark:border-gray-800">
                ${body}
            </div>
        </details>`;
}

// 5. Day 카드 (타임라인 + 선택적 숙소 카드), theme은 PLACE_THEMES의 키
function renderDayCard(day, theme = 'blue') {
    return renderAccordion({
        badge: `Day ${day.day}`,
        badgeClass: PLACE_THEMES[theme],
        title: day.title,
        bodyClass: 'p-4 pt-2',
        body: `
            <div class="relative border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3 mt-2 mb-2 space-y-6">
                ${day.items.map(renderTimelineItem).join('')}
            </div>
            ${day.stay ? renderStayCard(day.stay, theme) : ''}`
    });
}

// 6. 패킹 리스트 (가방 → 그룹 → 체크 항목)
// 체크 상태 저장/취소선 처리는 app.js의 .pack-chk 로직이 담당
function renderPackingItem(item) {
    const note = item.note ? ` <span class="text-xs font-normal text-gray-400">(${item.note})</span>` : '';
    const warn = item.warn ? ` <span class="text-xs font-normal text-red-400">(${item.warn})</span>` : '';
    return `<label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="${item.id}" class="pack-chk w-4 h-4 rounded text-blue-600 focus:ring-blue-500"><span class="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug">${item.label}${note}${warn}</span></label>`;
}

function renderPackingGroup(group) {
    return `
        <div>
            <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-tight mb-2.5 flex items-center gap-1.5">
                <span>${group.icon}</span><span>${group.title}</span>
            </h4>
            <div class="space-y-2.5 pl-1">
                ${group.items.map(renderPackingItem).join('')}
            </div>
        </div>`;
}

function renderPackingBag(bag) {
    return renderAccordion({
        badge: bag.badge,
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        title: bag.title,
        bodyClass: 'p-4 pt-3 space-y-5',
        body: bag.groups.map(renderPackingGroup).join('')
    });
}

// 7. 상세 예산 계획표 (전체 → 카테고리 → 세부 항목)
// 현지 통화 항목은 현지 금액 왼쪽에 유로 환산값을 작게 병기
// data-budget가 붙은 유로 금액은 환율을 받아오면 updateBudgetAmounts가 다시 계산
// .krw-calc의 원화 환산은 app.js의 환율 로직이 data-eur 값을 읽어서 채움
const formatEur = (eur) => `€${Math.round(eur).toLocaleString('en-US')}`;

// data-budget 값: 'total' | '카테고리 번호' | '카테고리 번호:항목 번호'
function getBudgetEur(key) {
    if (key === 'total') return getBudgetTotal();
    const [catIndex, itemIndex] = String(key).split(':');
    const items = BUDGET_PLAN[catIndex].items;
    if (itemIndex === undefined) return sumEur(items);
    return items[itemIndex].divider ? groupEur(items, Number(itemIndex)) : itemEur(items[itemIndex]);
}

const renderBudgetEur = (key) => `<span data-budget="${key}">${formatEur(getBudgetEur(key))}</span>`;
const renderBudgetKrw = (key, className) => `<span class="${className} krw-calc" data-budget="${key}" data-eur="${getBudgetEur(key)}"></span>`;

function updateBudgetAmounts() {
    document.querySelectorAll('[data-budget]').forEach(el => {
        const eur = getBudgetEur(el.dataset.budget);
        if (el.classList.contains('krw-calc')) el.dataset.eur = eur;
        else el.textContent = formatEur(eur);
    });
}

function renderBudgetItem(item, catIndex, itemIndex) {
    const key = `${catIndex}:${itemIndex}`;
    // 구분선 { divider: '1주차 · 스톡홀름' } + 오른쪽에 소계 (맨 위 구분선은 선 없이 제목만)
    if (item.divider) {
        return `<div class="flex justify-between pt-2 first:pt-0 border-t first:border-0 border-dashed border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-400 dark:text-gray-500"><span>${item.divider === true ? '' : item.divider}</span><span>소계 ${renderBudgetEur(key)}</span></div>`;
    }
    const amount = item.currency && item.currency !== 'EUR'
        ? `<span class="text-[10px] text-gray-400 mr-1">≈${renderBudgetEur(key)}</span>${formatMoney(item.amount, item.currency)}`
        : formatMoney(item.amount); // 직접 적은 유로 금액은 소수점까지 그대로 (환산값/합계만 반올림)
    return `<div class="flex justify-between gap-2"><span>${item.label}</span><span class="whitespace-nowrap">${amount} ${renderBudgetKrw(key, 'text-[10px] text-gray-400 ml-1')}</span></div>`;
}

function renderBudgetCategory(cat, catIndex) {
    return `
        <details class="group border-b dark:border-gray-800 last:border-0">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden p-3 hover:bg-gray-50 dark:hover:bg-nordic-800 rounded-lg transition-colors">
                <div class="flex items-center gap-2">
                    <span class="text-base">${cat.icon}</span>
                    <span class="text-sm text-gray-800 dark:text-gray-200">${cat.title}</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <span class="font-bold text-blue-600 dark:text-blue-400">${renderBudgetEur(catIndex)}</span>
                        ${renderBudgetKrw(catIndex, 'block text-[10px] text-gray-400 font-normal mt-0.5')}
                    </div>
                    <span class="text-gray-400 text-xs transition-transform duration-300 group-open:rotate-180">▼</span>
                </div>
            </summary>
            <div class="text-xs text-gray-500 dark:text-gray-400 px-3 pb-3 space-y-2">
                ${cat.items.map((item, itemIndex) => renderBudgetItem(item, catIndex, itemIndex)).join('')}
            </div>
        </details>`;
}

function renderBudgetPlan(plan) {
    return `
        <button onclick="toggleBudgetTable()" class="w-full flex justify-between items-center p-4 focus:outline-none hover:bg-gray-50 dark:hover:bg-nordic-800 transition-colors">
            <div class="flex items-center gap-2">
                <span class="text-lg">💶</span>
                <h3 class="font-bold text-gray-800 dark:text-gray-100">상세 예산 계획표</h3>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <span class="text-lg font-black text-blue-600 dark:text-blue-400">${renderBudgetEur('total')}</span>
                    ${renderBudgetKrw('total', 'block text-[10px] text-gray-400 font-normal mt-0.5')}
                </div>
                <span id="budget-toggle-icon" class="text-gray-500 transform transition-transform duration-300">▼</span>
            </div>
        </button>

        <div id="budget-table-content" class="hidden border-t dark:border-gray-800 p-2">
            ${plan.map((cat, catIndex) => renderBudgetCategory(cat, catIndex)).join('')}
        </div>`;
}

// 가계부 통화 선택칸 (data/currency.js 순서대로)
const renderCurrencyOptions = () => Object.entries(CURRENCIES)
    .map(([code, currency]) => `<option value="${code}">${currency.prefix.trim()}</option>`).join('');

// 8. 항공편 바우처 (출국/귀국 → 구간 + 경유 대기)
const FLIGHT_TONES = {
    blue: {
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        layover: 'text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50'
    },
    red: {
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        layover: 'text-red-700 dark:text-red-300 bg-red-100/50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50'
    }
};

// 같은 공항 현지 시각끼리의 차이 ('05:25' → '07:55' = '2시간 30분'), 자정을 넘기면 다음 날로 계산
function formatLayover(arrive, depart) {
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const diff = (toMin(depart) - toMin(arrive) + 24 * 60) % (24 * 60);
    const h = Math.floor(diff / 60), m = diff % 60;
    return m ? `${h}시간 ${m}분` : `${h}시간`;
}

function renderAirport(stop, label, nextDay) {
    const dayBadge = nextDay ? `<span class="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">+1일</span>` : '';
    return `
        <div>
            <div class="flex items-center gap-2">
                <span class="text-xl font-bold text-blue-600 dark:text-blue-400">${stop.code}</span>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">${stop.city}</span>
                ${dayBadge}
            </div>
            <span class="text-xs text-gray-500">${formatDotDate(parseDate(stop.date))} ${label}</span>
        </div>`;
}

function renderFlightLeg(leg, isLast) {
    const dot = (pos) => `<div class="absolute w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 ${pos} -left-[3px]"></div>`;
    return `
        <div class="grid grid-cols-[auto_1fr] gap-5 bg-gray-50 dark:bg-nordic-950 p-5 rounded-xl border dark:border-gray-800${isLast ? '' : ' mb-2'}">
            <div class="flex flex-col items-center">
                <span class="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">${leg.from.time}</span>
                <div class="flex-1 min-h-[5.5rem] my-2 border-l-2 border-dashed border-gray-300 dark:border-gray-600 relative">
                    ${dot('-top-1')}
                    ${dot('-bottom-1')}
                </div>
                <span class="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">${leg.to.time}</span>
            </div>

            <div class="flex flex-col justify-between py-1">
                ${renderAirport(leg.from, '출발', false)}

                <div class="flex items-center gap-2 my-2">
                    <span class="text-gray-400 text-sm">✈️</span>
                    <span class="text-xs font-mono font-bold bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">${leg.flightNo}</span>
                    <span class="text-xs font-medium text-gray-500">${leg.duration}</span>
                </div>

                ${renderAirport(leg.to, '도착', leg.from.date !== leg.to.date)}
            </div>
        </div>`;
}

function renderLayover(prevLeg, nextLeg, tone) {
    const note = prevLeg.layoverNote ? ` (${prevLeg.layoverNote})` : '';
    return `
        <div class="pl-[6.5rem] my-3">
            <span class="inline-block text-xs font-bold ${tone.layover} py-1.5 px-3 rounded-lg border shadow-sm">
                ⏳ ${prevLeg.to.city} 대기 ${formatLayover(prevLeg.to.time, nextLeg.from.time)}${note}
            </span>
        </div>`;
}

function renderFlight(flight) {
    const tone = FLIGHT_TONES[flight.tone] || FLIGHT_TONES.blue;
    const first = flight.legs[0];
    const last = flight.legs[flight.legs.length - 1];
    const body = flight.legs.map((leg, i) => {
        const isLast = i === flight.legs.length - 1;
        return renderFlightLeg(leg, isLast) + (isLast ? '' : renderLayover(leg, flight.legs[i + 1], tone));
    }).join('');

    return renderAccordion({
        badge: flight.badge,
        badgeClass: tone.badge,
        title: `${formatFullDotDate(parseDate(first.from.date))} ➔ ${last.to.city}(${last.to.code})`,
        bodyClass: 'p-4 pt-1',
        body
    });
}

// 귀국 전 탭 요약 (귀국편 2구간: 헬싱키 → 경유지 → 인천)
function renderReturnSummary(flight) {
    const [first, second] = flight.legs;
    return `
        <h3 class="font-bold text-lg mb-2">${formatKoreanDate(parseDate(first.from.date))} 귀국편 (SAS)</h3>
        <ul class="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <li>• ${first.from.time} ${first.from.city} 출발 ➔ ${first.to.city}행 (${first.flightNo})</li>
            <li>• ${first.to.time} ${first.to.city} 도착</li>
            <li>• <span class="font-bold text-red-500">${formatLayover(first.to.time, second.from.time)} ${first.to.city} 레이오버</span></li>
            <li>• ${second.from.time} ${second.from.city} 출발 ➔ ${second.to.city}행 (${second.flightNo})</li>
        </ul>`;
}

// 9. 준비 로드맵 카드 (체크 상태 저장은 app.js의 .pack-chk 로직이 담당)
const ROADMAP_TONES = {
    plain: {
        card: 'bg-white dark:bg-nordic-900 border border-gray-200 dark:border-gray-800',
        period: 'text-gray-400', title: 'text-gray-800 dark:text-gray-200',
        list: 'text-gray-600 dark:text-gray-400', hover: 'hover:text-gray-900 dark:hover:text-gray-200'
    },
    soft: {
        card: 'bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50',
        period: 'text-blue-500', title: 'text-gray-800 dark:text-gray-200',
        list: 'text-gray-600 dark:text-gray-400', hover: 'hover:text-gray-900 dark:hover:text-gray-200'
    },
    strong: {
        card: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',
        period: 'text-blue-600 dark:text-blue-400', title: 'text-blue-900 dark:text-blue-200',
        list: 'text-blue-800/70 dark:text-blue-300/70', hover: 'hover:text-blue-900 dark:hover:text-blue-200'
    }
};

// 가로 스크롤 끝까지 밀었을 때 카드가 화면에 붙지 않게 하는 여백
const SCROLL_END_SPACER = `<div class="flex-shrink-0 w-4 pointer-events-none md:hidden"></div>`;

function renderRoadmapCard(card) {
    const tone = ROADMAP_TONES[card.tone] || ROADMAP_TONES.plain;
    const items = card.items.map(item => `<li><label class="flex items-start gap-2 cursor-pointer ${tone.hover} transition-colors"><input type="checkbox" id="${item.id}"${item.checked ? ' checked' : ''} class="pack-chk mt-0.5 w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"><span class="leading-snug">${item.label}</span></label></li>`).join('');
    return `
        <div class="flex-shrink-0 w-52 ${tone.card} rounded-xl p-4 shadow-sm">
            <div class="text-xs font-bold ${tone.period} mb-1">${card.period}</div>
            <h4 class="font-bold text-sm mb-2 ${tone.title}">${card.title}</h4>
            <ul class="text-xs ${tone.list} space-y-2">
                ${items}
            </ul>
        </div>`;
}

// 10. 당일 공항 여정 단계 카드 (마지막 카드를 제외하고 다음 카드로 점선 연결)
function renderAirportStep(step, isLast) {
    const card = step.highlight
        ? { bg: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800', title: 'text-blue-800 dark:text-blue-300', desc: 'text-blue-600 dark:text-blue-400' }
        : { bg: 'bg-white dark:bg-nordic-900 border border-gray-200 dark:border-gray-800', title: 'text-gray-800 dark:text-gray-200', desc: 'text-gray-500' };
    const connector = isLast ? '' : `<div class="absolute top-1/2 -right-6 w-6 h-0 border-t-2 border-dotted border-gray-400 dark:border-gray-600" style="margin-top: -1px;"></div>`;
    return `
        <div class="relative flex-shrink-0 w-28 ${card.bg} rounded-xl p-3 shadow-sm z-10 text-center">
            ${connector}
            <div class="text-2xl mb-2">${step.icon}</div>
            <h4 class="font-bold text-xs ${card.title}">${step.title}</h4>
            <p class="text-[10px] ${card.desc} mt-1">${step.desc}</p>
        </div>`;
}

// 11. 핀란드 주차별 일정 (카드 하나 안에 주차 탭 + 날짜 행, 포인트 색은 탐페레 탭에 맞춘 호박색)
// 탭 클릭 전환은 app.js의 주차 탭 로직이 담당 (아래 클래스 상수를 함께 사용)
const WEEK_TAB_BASE = 'week-tab flex-1 min-w-[4.5rem] py-3 border-b-2 text-sm font-bold transition-colors';
const WEEK_TAB_ACTIVE = 'border-amber-500 text-amber-700 dark:text-amber-400';
const WEEK_TAB_INACTIVE = 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300';


function getDatesInRange(start, end) {
    const dates = [];
    for (let d = parseDate(start); d <= parseDate(end); d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    return dates;
}

function renderFinlandDay(date, todayKey) {
    const key = toDateKey(date);
    const day = FINLAND_SCHEDULE[key] || {};
    const items = day.items || [];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday = key === todayKey;

    const title = day.title || (items.length ? `일정 ${items.length}개` : '<span class="font-normal text-gray-400">일정 없음</span>');
    const todayBadge = isToday ? ' <span class="ml-1 text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">오늘</span>' : '';
    const body = items.length
        ? `<div class="relative border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3 mt-2 mb-2 space-y-6">
               ${items.map(renderTimelineItem).join('')}
           </div>`
        : `<p class="text-xs text-gray-400 py-2 text-center">아직 등록된 일정이 없어요.</p>`;
    const badgeClass = isWeekend
        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

    // 카드 안의 한 행 (행 사이는 구분선, 마지막 행은 구분선 없음)
    return `
        <details${isToday ? ' open' : ''} class="group border-b border-gray-200 dark:border-gray-700 last:border-0">
            <summary class="flex justify-between items-center px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-gray-50 dark:hover:bg-nordic-800 transition-colors">
                <div class="flex items-center gap-3">
                    <span class="${badgeClass} w-16 text-center text-xs font-bold py-1 rounded-md">${formatShortDate(date)}</span>
                    <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200">${title}${todayBadge}</h4>
                </div>
                <span class="text-gray-400 text-xs transition-transform duration-300 group-open:rotate-180">▼</span>
            </summary>
            <div class="px-4 pb-4">
                ${body}
            </div>
        </details>`;
}

function renderFinlandWeeks(weeks) {
    const todayKey = toDateKey(new Date());
    // 오늘이 속한 주차를 먼저 보여주고, 여행 기간이 아니면 1주차
    const activeIndex = Math.max(0, weeks.findIndex(w => todayKey >= w.start && todayKey <= w.end));

    const tabs = weeks.map((week, i) => `
        <button type="button" data-week="${i}" class="${WEEK_TAB_BASE} ${i === activeIndex ? WEEK_TAB_ACTIVE : WEEK_TAB_INACTIVE}">
            ${week.label}
            <span class="block text-[10px] font-medium opacity-80">${formatMonthDay(parseDate(week.start))} ~ ${formatMonthDay(parseDate(week.end))}</span>
            ${week.trip ? `<span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">${TRIP_PLACES[week.trip].icon} ${TRIP_PLACES[week.trip].name}</span>` : ''}
        </button>`).join('');

    const panels = weeks.map((week, i) => `
        <div class="week-panel" data-week="${i}"${i === activeIndex ? '' : ' hidden'}>
            ${getDatesInRange(week.start, week.end).map(date => renderFinlandDay(date, todayKey)).join('')}
        </div>`).join('');

    return `
        <div class="bg-white dark:bg-nordic-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div class="flex overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-gray-700">
                ${tabs}
            </div>
            ${panels}
        </div>`;
}

// 여행지 키('england' 등)로 그 여행이 있는 주차 찾기 (없으면 undefined)
const findTripWeek = (tripKey) => FINLAND_WEEKS.find(week => week.trip === tripKey);

// 메인 환율 배너에 유로와 함께 보여줄 통화: 오늘이 속한 주차의 여행지(+거기서 이어지는 여행지) 통화
// 주차 밖(여행 전, 헬싱키 0주차, 귀국 후)이거나 여행지가 유로 지역이면 파운드
function getFeaturedCurrencies(dateKey = toDateKey(new Date())) {
    const week = FINLAND_WEEKS.find(w => w.start <= dateKey && dateKey <= w.end);
    const placeKeys = week && week.trip
        ? [week.trip, ...Object.keys(TRIP_PLACES).filter(key => TRIP_PLACES[key].from === week.trip)]
        : [];
    const codes = [...new Set(placeKeys.map(key => TRIP_PLACES[key].currency).filter(code => code && code !== 'EUR'))];
    return codes.length ? codes : ['GBP'];
}

// 메인 지도 아래 주차별 경로 칩 (헬싱키 → 탐페레 거점 → 주차별 여행지 → 주차 미정)
// 장소 버튼의 data-place 키로 app.js가 지도를 이동시킴 (좌표가 없는 곳은 버튼 대신 글자로만 표시)
const ROUTE_CHIP_ACTIVE = ['bg-blue-600', 'text-white'];

function getRouteGroups() {
    const place = (key, icon, name, hasCoords = true) => ({ key, icon, name, hasCoords });
    const tripPlace = (key) => place(key, TRIP_PLACES[key].icon, TRIP_PLACES[key].name, !!TRIP_PLACES[key].coords);
    const children = (key) => Object.keys(TRIP_PLACES).filter(k => TRIP_PLACES[k].from === key);

    const groups = [
        { label: HELSINKI_WEEK_LABEL, places: [place('helsinki', '🏙️', '헬싱키')] },
        { label: '거점', places: [place('tampere', '🇫🇮', '탐페레')] },
        ...FINLAND_WEEKS.filter(week => week.trip).map(week => ({
            label: week.label,
            places: [week.trip, ...children(week.trip)].map(tripPlace)
        }))
    ];
    // 어느 주차에도 없고 다른 여행지에서 이어지지도 않는 곳
    const assigned = new Set(groups.flatMap(group => group.places.map(p => p.key)));
    const unassigned = Object.keys(TRIP_PLACES).filter(key => !assigned.has(key) && !TRIP_PLACES[key].from);
    if (unassigned.length) groups.push({ label: '미정', places: unassigned.map(tripPlace) });
    return groups;
}

function renderRouteChips() {
    const allButton = `<button type="button" data-place="all" class="route-place flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-nordic-900 shadow-sm text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors">🗺️ 전체</button>`;
    const groups = getRouteGroups().map(group => `
        <div class="flex-shrink-0 flex items-center gap-0.5 pl-3 pr-1 py-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-nordic-900 shadow-sm">
            <span class="text-[10px] font-bold text-gray-400 mr-1">${group.label}</span>
            ${group.places.map(p => p.hasCoords
                ? `<button type="button" data-place="${p.key}" class="route-place px-2 py-0.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-nordic-800 transition-colors">${p.icon} ${p.name}</button>`
                : `<span class="px-2 py-0.5 text-xs font-bold text-gray-400">${p.icon} ${p.name}</span>`).join('')}
        </div>`).join('');
    return allButton + groups;
}

// 11-1. 요리 탭 (오늘 뭐 먹지?) - 데이터는 data/meals.js, 상태 관리와 버튼 동작은 app.js 16번
// 버튼은 data-meal-action(pick/next/confirm/reset/eaten), data-meal-category, data-meal-delete, data-meal-month, data-meal-day로 구분
// 흐름: 종류 선택(대기 카드) → 🎲 추천 받기(이름이 돌아가다 멈춤) → 이걸로! → 재료/레시피/보관법 → 다 먹었어요
const MEAL_DIFFICULTY = { 1: '쉬움', 2: '보통', 3: '어려움' };
const MEAL_BUTTON = 'flex-1 py-3 rounded-xl text-sm font-bold transition-colors';
const MEAL_BUTTON_MAIN = `${MEAL_BUTTON} bg-amber-500 hover:bg-amber-600 text-white shadow-sm`;
const MEAL_BUTTON_SUB = `${MEAL_BUTTON} border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-nordic-800`;
const MEAL_CARD = 'bg-white dark:bg-nordic-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800';
const findMealCategory = (key) => [...MEAL_CATEGORIES, ...MEAL_EXTRA_TYPES].find(c => c.key === key) || { name: '기타', icon: '🍽️' };
// 직접 적은 메뉴 이름을 화면에 넣을 때 HTML로 해석되지 않게
const escapeMealText = (text) => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderMealCategoryChips(active) {
    const chip = (key, label) => `
        <button type="button" data-meal-category="${key}" class="px-3.5 py-2 rounded-full text-sm font-bold border transition-colors ${key === active
            ? 'bg-amber-500 border-amber-500 text-white'
            : 'bg-white dark:bg-nordic-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-400'}">${label}</button>`;
    return chip('all', '🎲 아무거나') + MEAL_CATEGORIES.map(c => chip(c.key, `${c.icon} ${c.name}`)).join('');
}

// 난이도 · 시간 · 칼로리 (★ 개수 = 난이도)
function renderMealStats(meal) {
    const stars = '★'.repeat(meal.difficulty) + '☆'.repeat(3 - meal.difficulty);
    const servings = meal.servings > 1 ? ` · ${meal.servings}인분` : '';
    return `
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span><span class="text-amber-500">${stars}</span> ${MEAL_DIFFICULTY[meal.difficulty]}</span>
            <span>⏱️ ${meal.minutes}분</span>
            <span>🔥 약 ${meal.kcal}kcal${servings}</span>
        </div>`;
}

// 예시 사진 띠 (사진이 없거나 못 불러오면 뒤에 깔린 아이콘이 보임)
function renderMealPhoto(meal, icon, heightClass) {
    return `
        <div class="relative ${heightClass} bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-6xl overflow-hidden">
            <span>${icon}</span>
            ${meal.image ? `<img src="${meal.image}" onerror="this.remove()" alt="" class="absolute inset-0 w-full h-full object-cover animate-[fadeIn_0.3s_ease-out]">` : ''}
        </div>`;
}

// 곁들이면 좋은 것 (칩 목록)
function renderMealSides(meal) {
    return (meal.sides || []).map(side => `<span class="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-medium">${side}</span>`).join(' ');
}

// 남은 음식 보관법 상자
function renderMealStorage(meal) {
    return meal.storage ? `
        <div class="px-4 py-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900 text-left">
            <p class="font-bold text-sm text-sky-800 dark:text-sky-300 mb-1">🧊 남으면 이렇게 보관</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">${meal.storage}</p>
        </div>` : '';
}

// 대기 카드: 종류를 고르기 전에는 추천 버튼을 막아 둠 / eaten: 방금 먹은 메뉴 (기록 완료 문구 + 보관법)
function renderMealIdle(category, eaten) {
    const picked = category === 'all' ? '🎲 아무거나' : category ? `${findMealCategory(category).icon} ${findMealCategory(category).name}` : '';
    const done = eaten ? `
        <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3">${eaten.notice}</p>
        ${eaten.meal.storage ? `<div class="mb-5">${renderMealStorage(eaten.meal)}</div>` : ''}` : '';
    return `
        <div class="${MEAL_CARD} p-6 text-center">
            ${done}
            <p class="text-5xl mb-3">🍽️</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">${picked
                ? `<span class="font-bold text-gray-700 dark:text-gray-200">${picked}</span> 중에서 하나 골라 드릴게요.`
                : '먼저 위에서 먹고 싶은 종류를 골라 주세요.'}</p>
            <button type="button" data-meal-action="pick"${picked ? '' : ' disabled'} class="${MEAL_BUTTON_MAIN} w-full disabled:opacity-40 disabled:cursor-not-allowed">🎲 추천 받기</button>
        </div>`;
}

// 추천 카드 (spinning: 이름이 돌아가는 동안에는 설명/정보를 가리고 버튼을 막음, 이름은 app.js가 바꿔 끼움)
function renderMealPick(meal, spinning) {
    const category = findMealCategory(meal.category);
    const disabled = spinning ? ' disabled' : '';
    return `
        <div class="${MEAL_CARD} overflow-hidden text-center">
            ${spinning ? renderMealPhoto({}, '🎲', 'h-40') : renderMealPhoto(meal, category.icon, 'h-40')}
            <div class="p-6">
            <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 mb-3">${spinning ? '🎲 고르는 중' : `${category.icon} ${category.name}`}</span>
            <h3 id="meal-pick-name" class="text-2xl font-black text-gray-800 dark:text-gray-100 mb-1${spinning ? ' opacity-60' : ' animate-[fadeIn_0.3s_ease-out]'}">${meal.name}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${spinning ? '두구두구…' : meal.desc}</p>
            <div class="${spinning ? 'invisible' : ''}">
                ${renderMealStats(meal)}
                ${meal.sides ? `<p class="mt-3 text-xs text-gray-400">🥗 곁들이면 좋아요</p><div class="mt-1.5 flex flex-wrap justify-center gap-1">${renderMealSides(meal)}</div>` : ''}
            </div>
            <div class="flex gap-2 mt-6">
                <button type="button" data-meal-action="next"${disabled} class="${MEAL_BUTTON_SUB} disabled:opacity-40">🔄 다른 거</button>
                <button type="button" data-meal-action="confirm"${disabled} class="${MEAL_BUTTON_MAIN} disabled:opacity-40">✅ 이걸로!</button>
            </div>
            </div>
        </div>`;
}

// 확정한 메뉴: 재료 체크리스트 + 레시피 (재료 체크는 app.js가 기기에 저장, 취소선은 CSS peer로 처리)
function renderMealRecipe(meal, checked) {
    const ingredients = meal.ingredients.map((item, i) => `
        <label class="flex items-start gap-3 cursor-pointer py-1">
            <input type="checkbox" data-meal-ingredient="${i}"${checked.includes(i) ? ' checked' : ''} class="peer w-4 h-4 mt-0.5 accent-amber-600">
            <span class="flex-1 text-sm text-gray-700 dark:text-gray-200 peer-checked:line-through peer-checked:opacity-50">
                ${item.name} <span class="text-gray-400">${item.amount}</span>
                ${item.fi ? `<span class="block text-[11px] text-gray-400 dark:text-gray-500">🇫🇮 ${item.fi}</span>` : ''}
            </span>
        </label>`).join('');
    const steps = meal.steps.map((step, i) => `
        <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold flex items-center justify-center">${i + 1}</span>
            <p class="text-sm text-gray-700 dark:text-gray-200 pt-0.5">${step}</p>
        </li>`).join('');
    return `
        <div class="${MEAL_CARD} overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            ${meal.image ? renderMealPhoto(meal, findMealCategory(meal.category).icon, 'h-48') : ''}
            <div class="p-5 text-center border-b border-gray-100 dark:border-gray-800 bg-amber-50/60 dark:bg-amber-900/10">
                <p class="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">오늘의 요리</p>
                <h3 class="text-xl font-black text-gray-800 dark:text-gray-100 mb-2">${findMealCategory(meal.category).icon} ${meal.name}</h3>
                ${renderMealStats(meal)}
            </div>
            <div class="p-5">
                <h4 class="font-bold text-sm mb-2 text-gray-800 dark:text-gray-200">🛒 재료 <span class="text-xs font-normal text-gray-400">· 준비한 건 체크</span></h4>
                <div class="mb-5">${ingredients}</div>
                ${meal.sides ? `<h4 class="font-bold text-sm mb-2 text-gray-800 dark:text-gray-200">🥗 곁들이면 좋아요</h4><div class="mb-5 flex flex-wrap gap-1">${renderMealSides(meal)}</div>` : ''}
                <h4 class="font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">👩‍🍳 레시피</h4>
                <ol class="space-y-3 mb-5">${steps}</ol>
                ${meal.storage ? `<div class="mb-6">${renderMealStorage(meal)}</div>` : ''}
                <div class="flex gap-2">
                    <button type="button" data-meal-action="reset" class="${MEAL_BUTTON_SUB}">다시 고르기</button>
                    <button type="button" data-meal-action="eaten" class="${MEAL_BUTTON_MAIN}">🍽️ 다 먹었어요</button>
                </div>
            </div>
        </div>`;
}

// 먹은 기록 달력 (한 달씩, 날짜를 누르면 아래에 그날 먹은 메뉴 / 삭제는 log의 원래 순서 번호로)
// month: 그 달 1일 Date, selectedKey: 고른 날짜 ('YYYY-MM-DD' 또는 null)
function renderMealCalendar(log, month, selectedKey, todayKey) {
    const year = month.getFullYear();
    const monthPrefix = `${year}-${pad2(month.getMonth() + 1)}`;
    const byDate = {};
    log.forEach((entry, i) => { (byDate[entry.date] = byDate[entry.date] || []).push({ entry, i }); });
    const monthCount = log.filter(entry => entry.date.startsWith(monthPrefix)).length;

    const weekdays = WEEKDAYS.map((w, i) => `<div class="text-center text-[11px] font-bold py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}">${w}</div>`).join('');
    const blanks = '<div></div>'.repeat(new Date(year, month.getMonth(), 1).getDay());
    const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: daysInMonth }, (_, d) => {
        const key = `${monthPrefix}-${pad2(d + 1)}`;
        const meals = byDate[key] || [];
        const isSelected = key === selectedKey;
        const state = isSelected ? 'bg-amber-500 text-white font-bold'
            : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-nordic-800${key === todayKey ? ' ring-2 ring-inset ring-amber-400' : ''}`;
        return `
            <button type="button" data-meal-day="${key}" class="h-14 flex flex-col items-center pt-1.5 rounded-lg text-xs transition-colors ${state}">
                <span>${d + 1}</span>
                <span class="text-base leading-none mt-0.5">${meals.length ? findMealCategory(meals[0].entry.category).icon : ''}</span>
                ${meals.length > 1 ? `<span class="text-[9px] leading-tight ${isSelected ? '' : 'text-gray-400'}">+${meals.length - 1}</span>` : ''}
            </button>`;
    }).join('');

    const dayEntries = selectedKey ? (byDate[selectedKey] || []) : [];
    const dayRows = dayEntries.map(({ entry, i }) => `
        <div class="flex items-center gap-3 py-2">
            <span class="flex-1 text-sm font-bold text-gray-800 dark:text-gray-200">${findMealCategory(entry.category).icon} ${escapeMealText(entry.name)}</span>
            <button type="button" data-meal-delete="${i}" class="text-gray-300 hover:text-red-500 dark:text-gray-600 text-lg leading-none px-1" aria-label="기록 삭제">×</button>
        </div>`).join('');
    // 고른 날짜에 외식/즉석식품 등을 직접 추가하는 줄 (app.js의 submit 처리)
    const field = 'min-w-0 text-sm p-2 bg-gray-50 dark:bg-nordic-950 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 dark:text-gray-200';
    const addForm = `
        <form data-meal-add class="mt-2 space-y-2">
            <p class="text-[11px] text-gray-400">사 먹었거나 즉석식품을 먹었다면 직접 추가</p>
            <div class="flex gap-2">
                <select name="type" class="${field} shrink-0">${MEAL_EXTRA_TYPES.map(t => `<option value="${t.key}">${t.icon} ${t.name.replace(/ \(.*\)/, '')}</option>`).join('')}</select>
                <input name="name" required maxlength="40" placeholder="예: 버거, 편의점 도시락" class="${field} flex-1">
                <button type="submit" class="shrink-0 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold">추가</button>
            </div>
        </form>`;
    const dayDetail = !selectedKey ? '<p class="text-xs text-gray-400 text-center py-1">날짜를 누르면 그날 먹은 메뉴가 보이고, 직접 추가할 수도 있어요.</p>'
        : `<p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">${formatShortDate(parseDate(selectedKey))}</p>
           ${dayRows || '<p class="text-xs text-gray-400 py-1">이 날은 기록이 없어요.</p>'}
           ${addForm}`;

    return `
        <div class="${MEAL_CARD} p-4">
            <div class="flex items-center justify-between mb-2">
                <button type="button" data-meal-month="-1" class="w-10 h-10 rounded-full text-2xl leading-none text-gray-500 hover:bg-gray-100 dark:hover:bg-nordic-800" aria-label="이전 달">‹</button>
                <div class="text-center">
                    <p class="font-bold text-gray-800 dark:text-gray-100">${year}년 ${month.getMonth() + 1}월</p>
                    <p class="text-[11px] text-gray-400">${monthCount ? `${monthCount}끼 기록` : '기록 없음'}</p>
                </div>
                <button type="button" data-meal-month="1" class="w-10 h-10 rounded-full text-2xl leading-none text-gray-500 hover:bg-gray-100 dark:hover:bg-nordic-800" aria-label="다음 달">›</button>
            </div>
            <div class="grid grid-cols-7 gap-1">${weekdays}${blanks}${cells}</div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">${dayDetail}</div>
        </div>`;
}

// 12. 실제 렌더링 실행
function renderInto(containerId, html) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = html;
}

renderInto('helsinki-days', HELSINKI_DAYS.map(day => renderDayCard(day, 'blue')).join(''));
renderInto('helsinki-week', HELSINKI_WEEK_LABEL);
renderInto('stockholm-days', STOCKHOLM_DAYS.map(day => renderDayCard(day, 'amber')).join(''));
const stockholmWeek = findTripWeek('stockholm');
renderInto('stockholm-week', stockholmWeek ? stockholmWeek.label : '주차 미정');
renderInto('packing-list', PACKING_BAGS.map(renderPackingBag).join(''));
renderInto('budget-plan', renderBudgetPlan(BUDGET_PLAN));
renderInto('exp-currency', renderCurrencyOptions());
renderInto('edit-currency', renderCurrencyOptions());
renderInto('flight-list', FLIGHTS.map(renderFlight).join(''));
renderInto('prep-roadmap', PREP_ROADMAP.map(renderRoadmapCard).join('') + SCROLL_END_SPACER);
renderInto('airport-steps', AIRPORT_STEPS.map((step, i) => renderAirportStep(step, i === AIRPORT_STEPS.length - 1)).join('') + SCROLL_END_SPACER);
renderInto('finland-weeks', renderFinlandWeeks(FINLAND_WEEKS));
renderInto('return-summary', renderReturnSummary(FLIGHTS[1]));
renderInto('route-chips', renderRouteChips());

// 본문 중간의 날짜/주차 표시 (데이터에서 가져와 채움)
const departure = parseDate(OUTBOUND_FIRST.from.date);
renderInto('departure-day', `${pad2(departure.getMonth() + 1)}.${pad2(departure.getDate())}`);
const englandWeek = findTripWeek('england');
renderInto('england-week', englandWeek ? `${englandWeek.label} 주말` : '주차 미정');
// 탐페레 생활 진행 막대 (입주 전 D-N → 생활 중 N일째 → 끝)
const lifeStart = parseDate(FINLAND_WEEKS[0].start);
const lifeTotal = Math.round((parseDate(FINLAND_WEEKS[FINLAND_WEEKS.length - 1].end) - lifeStart) / 86400000) + 1;
const lifeDay = Math.round((parseDate(toDateKey(new Date())) - lifeStart) / 86400000) + 1;
const lifeProgress = Math.min(Math.max(lifeDay, 0), lifeTotal);
renderInto('tampere-life-label', lifeDay < 1 ? '입주까지' : lifeDay > lifeTotal ? '탐페레 생활 끝 👋' : `${lifeDay}일째 생활 중`);
renderInto('tampere-life-count', lifeDay < 1 ? `D-${1 - lifeDay}` : `${lifeProgress} / ${lifeTotal}일`);
const lifeBar = document.getElementById('tampere-life-bar');
if (lifeBar) lifeBar.style.width = `${lifeProgress / lifeTotal * 100}%`;
const laplandWeek = findTripWeek('rovaniemi');
renderInto('lapland-week', laplandWeek ? `${laplandWeek.label} 주말` : '주차 미정');
