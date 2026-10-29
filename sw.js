/* Escrituras — Cartório Praia do Forte · service worker v2.3.0
 * Regras (decididas 29/10/2026 — o celular já sofreu com cache velho):
 *  - Navegação/HTML: NETWORK-FIRST. Com rede, nunca serve index/consulta velhos; o cache é só fallback offline.
 *  - script.google.com (Apps Script) e qualquer origem de terceiro: NUNCA passam por aqui (nem cache, nem respondWith).
 *  - Só ícones/manifests/estáticos do próprio site ficam em cache (cache-first).
 *  - skipWaiting + clients.claim; versão no nome do cache → o activate apaga os antigos.
 */
const VERSION = 'esc26-v2.3.2';
// Página mostrada só quando não há rede nem cópia em cache (identidade do produto)
const OFFLINE_HTML = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Aguardando a internet</title>'
  + '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(160deg,#0b3324,#0a4e33 70%,#0d5a3c);color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:24px;box-sizing:border-box}'
  + '.c{max-width:380px;text-align:center}.p{display:inline-block;background:#fcfbf7;color:#0f6b43;border-radius:14px;padding:12px 22px;font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-weight:700;font-size:18px;letter-spacing:.06em;box-shadow:0 12px 30px rgba(0,0,0,.35)}'
  + 'h1{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:22px;margin:22px 0 8px}p{margin:0 0 18px;font-size:14px;line-height:1.5;color:rgba(255,255,255,.85)}'
  + 'button{min-height:44px;padding:0 20px;border:0;border-radius:11px;background:#fff;color:#0f6b43;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit}</style></head>'
  + '<body><div class="c"><div class="p">CARTÓRIO PRAIA DO FORTE</div><h1>Aguardando a internet</h1><p>O sistema abre assim que a conexão voltar. Seus dados continuam seguros no servidor.</p><button onclick="location.reload()">Tentar agora</button></div></body></html>';

// A página pede para o SW em espera assumir ("Atualizar agora" no banner de versão nova)
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
const STATIC = [
  'manifest.json', 'manifest-portal.json',
  'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
  'icon-portal-192.png', 'icon-portal-512.png', 'icon-portal-maskable-192.png', 'icon-portal-maskable-512.png', 'apple-touch-icon-portal.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.allSettled(STATIC.map(function (u) { return c.add(u); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function isHtml(req, url) {
  return req.mode === 'navigate' || req.destination === 'document' || /\.html?$/.test(url.pathname) || url.pathname.endsWith('/');
}
function isStatic(url) {
  return /\.(png|ico|svg|json|webmanifest)$/.test(url.pathname);
}

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // terceiros (Apps Script etc.) → direto à rede, sem SW

  if (isHtml(req, url)) {
    // rede primeiro, pulando o cache HTTP; cópia no cache só para uso offline
    e.respondWith(
      fetch(new Request(url.href, { cache: 'no-store', credentials: 'same-origin' }))
        .then(function (r) {
          if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(url.pathname === '/' ? '/index.html' : url.pathname, cp); }); }
          return r;
        })
        .catch(function () {
          const key = url.pathname === '/' ? '/index.html' : url.pathname;
          return caches.match(key, { ignoreSearch: true }).then(function (m) {
            return m || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
          });
        })
    );
    return;
  }

  if (isStatic(url)) {
    e.respondWith(caches.match(req).then(function (m) {
      return m || fetch(req).then(function (r) {
        if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
        return r;
      });
    }));
  }
  // demais (ex.: o próprio sw.js) → rede, sem interferência
});
