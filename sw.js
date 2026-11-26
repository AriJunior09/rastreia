/**
 * Service worker do Rastreia: guarda as telas no aparelho para o app abrir sem internet.
 * Os dados (servidor do Google) nunca são guardados aqui.
 * Sempre que publicar uma nova versão, aumente o número em VERSAO_CACHE.
 */
const VERSAO_CACHE = 'rastreia-v31';
const ARQUIVOS = [
  './',
  './index.html',
  './style.css',
  './config.js',
  './api.js',
  './app.js',
  './leitor.js',
  './xlsx.js',
  './manifest.json',
  './icone-192.png',
  './icone-512.png'
];

self.addEventListener('install', function (evento) {
  evento.waitUntil(caches.open(VERSAO_CACHE).then(function (c) { return c.addAll(ARQUIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.filter(function (n) { return n !== VERSAO_CACHE; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Arquivos do próprio site: tenta a internet primeiro (para pegar atualizações) e usa o cache se estiver sem conexão.
self.addEventListener('fetch', function (evento) {
  const req = evento.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  evento.respondWith(
    fetch(req).then(function (resp) {
      const copia = resp.clone();
      caches.open(VERSAO_CACHE).then(function (c) { c.put(req, copia); });
      return resp;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('./index.html'); });
    })
  );
});
