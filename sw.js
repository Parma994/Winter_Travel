// sw.js - 오프라인 대응 서비스 워커 (한 번 온라인으로 열어 두면 오프라인에서도 화면이 열림)
// - 사이트 파일(HTML/JS/데이터/이미지): 인터넷 우선 → 3초 안에 응답이 없거나 실패하면 저장본
// - 외부 라이브러리(Tailwind/Leaflet/Chart.js): 저장본 우선 (버전 고정 파일이라 바뀌지 않음)
// - 지도 타일: 한 번 본 타일만 저장 (최대 MAX_TILES장)
// - 날씨/환율/가계부 API는 건드리지 않음 (마지막 값 표시는 app.js가 담당)
//
// ⚠️ 파일을 새로 추가하거나 라이브러리 주소를 바꾸면 아래 목록에 반영하고 CACHE_VERSION을 올려 주세요.

const CACHE_VERSION = 'v2';
const APP_CACHE = `app-${CACHE_VERSION}`;
const LIB_CACHE = `lib-${CACHE_VERSION}`;
const TILE_CACHE = 'tiles-v1';
const NETWORK_TIMEOUT_MS = 3000;
const MAX_TILES = 400;

const APP_FILES = [
    './',
    './index.html',
    './app.js',
    './render.js',
    './data/flights.js',
    './data/helsinki.js',
    './data/packing.js',
    './data/budget.js',
    './data/prep.js',
    './data/finland.js',
    './Tampere.jpg',
    './manifest.webmanifest',
    './icons/apple-touch-icon.png',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// index.html의 <script>/<link> 주소와 글자 하나까지 같아야 함
const LIB_URLS = [
    'https://cdn.tailwindcss.com/3.4.17',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.6.1'
];

// 1. 설치: 사이트 파일과 라이브러리를 미리 저장
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const appCache = await caches.open(APP_CACHE);
        await appCache.addAll(APP_FILES.map(url => new Request(url, { cache: 'reload' })));

        // 라이브러리는 하나가 실패해도 설치는 계속 (다음 접속 때 저장됨)
        const libCache = await caches.open(LIB_CACHE);
        await Promise.all(LIB_URLS.map(async (url) => {
            try {
                // Tailwind CDN은 CORS 헤더가 없어서 no-cors로 저장 (페이지도 no-cors로 요청하므로 문제없음)
                const mode = url.startsWith('https://cdn.tailwindcss.com') ? 'no-cors' : 'cors';
                const response = await fetch(url, { mode });
                if (response.ok || response.type === 'opaque') await libCache.put(url, response);
            } catch (error) {
                console.warn('라이브러리 저장 실패:', url, error);
            }
        }));
        self.skipWaiting();
    })());
});

// 2. 활성화: 이전 버전 저장본 정리
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = [APP_CACHE, LIB_CACHE, TILE_CACHE];
        const names = await caches.keys();
        await Promise.all(names.filter(name => !keep.includes(name)).map(name => caches.delete(name)));
        await self.clients.claim();
    })());
});

// 3. 요청 가로채기
self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    if (url.origin === self.location.origin) {
        event.respondWith(networkFirst(request));
    } else if (LIB_URLS.includes(request.url)) {
        event.respondWith(cacheFirst(request, LIB_CACHE));
    } else if (url.hostname.endsWith('tile.openstreetmap.org')) {
        event.respondWith(cacheFirst(request, TILE_CACHE, MAX_TILES));
    }
    // 그 외(날씨/환율/구글 시트 API)는 브라우저 기본 동작
});

async function networkFirst(request) {
    const cache = await caches.open(APP_CACHE);
    // cache: 'no-cache' → GitHub Pages의 10분 캐시를 건너뛰고 서버에 최신인지 확인 (안 바뀌었으면 304로 가볍게 끝남)
    // 배포 직후 새 index.html + 옛 app.js처럼 버전이 섞이는 것을 막음 (navigate 요청은 옵션을 못 붙여서 URL로 요청)
    const network = fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
    });
    network.catch(() => {}); // 오프라인 실패는 아래에서 저장본으로 처리

    const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS));
    const fast = await Promise.race([network.catch(() => null), timeout]);
    if (fast) return fast;

    const cached = await cache.match(request, { ignoreSearch: true })
        || (request.mode === 'navigate' && await cache.match('./index.html'));
    return cached || network; // 저장본도 없으면 네트워크 결과를 끝까지 기다림
}

async function cacheFirst(request, cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') {
        await cache.put(request, response.clone());
        if (maxEntries) trimCache(cache, maxEntries);
    }
    return response;
}

// 오래 저장된 것부터 지워서 maxEntries개 유지
async function trimCache(cache, maxEntries) {
    const keys = await cache.keys();
    for (const key of keys.slice(0, Math.max(0, keys.length - maxEntries))) {
        await cache.delete(key);
    }
}
