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

// 2. 타임라인 항목 1개
function renderTimelineItem(item) {
    const tone = TIMELINE_TONES[item.tone] || TIMELINE_TONES.gray;
    return `
        <div class="relative pl-6">
            <div class="absolute w-3 h-3 ${tone.dot} rounded-full -left-[7px] top-1.5 shadow-sm ring-4 ring-white dark:ring-nordic-900"></div>
            <div class="flex items-start gap-3">
                <span class="font-bold ${tone.time} w-11 flex-shrink-0 mt-0.5 text-sm">${item.time}</span>
                <div>
                    <h5 class="font-bold text-gray-800 dark:text-gray-200 text-sm">${item.title}</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${item.desc}</p>
                </div>
            </div>
        </div>`;
}

// 3. 숙소 카드 (지도 포함)
function renderStayCard(stay) {
    return `
        <div class="bg-white dark:bg-nordic-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mt-6">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">${stay.badge}</span>
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

// 5. Day 카드 (타임라인 + 선택적 숙소 카드)
function renderDayCard(day) {
    return renderAccordion({
        badge: `Day ${day.day}`,
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        title: day.title,
        bodyClass: 'p-4 pt-2',
        body: `
            <div class="relative border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3 mt-2 mb-2 space-y-6">
                ${day.items.map(renderTimelineItem).join('')}
            </div>
            ${day.stay ? renderStayCard(day.stay) : ''}`
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
// .krw-calc의 원화 환산은 app.js의 환율 로직이 data-eur 값을 읽어서 채움
const formatEur = (eur) => `€${eur.toLocaleString('en-US')}`;

function renderBudgetItem(item) {
    return `<div class="flex justify-between"><span>${item.label}</span><span>${formatEur(item.eur)} <span class="text-[10px] text-gray-400 ml-1 krw-calc" data-eur="${item.eur}"></span></span></div>`;
}

function renderBudgetCategory(cat) {
    const total = sumEur(cat.items);
    return `
        <details class="group border-b dark:border-gray-800 last:border-0">
            <summary class="flex justify-between items-center font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden p-3 hover:bg-gray-50 dark:hover:bg-nordic-800 rounded-lg transition-colors">
                <div class="flex items-center gap-2">
                    <span class="text-base">${cat.icon}</span>
                    <span class="text-sm text-gray-800 dark:text-gray-200">${cat.title}</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <span class="font-bold text-blue-600 dark:text-blue-400">${formatEur(total)}</span>
                        <span class="block text-[10px] text-gray-400 font-normal mt-0.5 krw-calc" data-eur="${total}"></span>
                    </div>
                    <span class="text-gray-400 text-xs transition-transform duration-300 group-open:rotate-180">▼</span>
                </div>
            </summary>
            <div class="text-xs text-gray-500 dark:text-gray-400 px-3 pb-3 space-y-2">
                ${cat.items.map(renderBudgetItem).join('')}
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
                    <span class="text-lg font-black text-blue-600 dark:text-blue-400">${formatEur(BUDGET_TOTAL)}</span>
                    <span class="block text-[10px] text-gray-400 font-normal mt-0.5 krw-calc" data-eur="${BUDGET_TOTAL}"></span>
                </div>
                <span id="budget-toggle-icon" class="text-gray-500 transform transition-transform duration-300">▼</span>
            </div>
        </button>

        <div id="budget-table-content" class="hidden border-t dark:border-gray-800 p-2">
            ${plan.map(renderBudgetCategory).join('')}
        </div>`;
}

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

// 11. 핀란드 주차별 일정 (카드 하나 안에 주차 탭 + 날짜 행)
// 탭 클릭 전환은 app.js의 주차 탭 로직이 담당 (아래 클래스 상수를 함께 사용)
const WEEK_TAB_BASE = 'week-tab flex-1 min-w-[4.5rem] py-3 border-b-2 text-sm font-bold transition-colors';
const WEEK_TAB_ACTIVE = 'border-emerald-500 text-emerald-600 dark:text-emerald-400';
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
        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';

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

// 12. 실제 렌더링 실행
function renderInto(containerId, html) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = html;
}

renderInto('estonia-days', ESTONIA_DAYS.map(renderDayCard).join(''));
renderInto('packing-list', PACKING_BAGS.map(renderPackingBag).join(''));
renderInto('budget-plan', renderBudgetPlan(BUDGET_PLAN));
renderInto('flight-list', FLIGHTS.map(renderFlight).join(''));
renderInto('prep-roadmap', PREP_ROADMAP.map(renderRoadmapCard).join('') + SCROLL_END_SPACER);
renderInto('airport-steps', AIRPORT_STEPS.map((step, i) => renderAirportStep(step, i === AIRPORT_STEPS.length - 1)).join('') + SCROLL_END_SPACER);
renderInto('finland-weeks', renderFinlandWeeks(FINLAND_WEEKS));
renderInto('return-summary', renderReturnSummary(FLIGHTS[1]));

// 본문 중간의 날짜/주차 표시 (데이터에서 가져와 채움)
const departure = parseDate(OUTBOUND_FIRST.from.date);
renderInto('departure-day', `${pad2(departure.getMonth() + 1)}.${pad2(departure.getDate())}`);
const englandWeek = findTripWeek('england');
renderInto('england-week', englandWeek ? `${englandWeek.label} 주말` : '주차 미정');
